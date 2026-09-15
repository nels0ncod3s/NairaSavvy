import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
test("database setup is repeatable; subscribers are private and rate limiting is atomic", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;",
    );
    const schema = readFileSync("src/lib/supabase/schema.sql", "utf8");
    const upgrade = readFileSync("src/lib/supabase/upgrade.sql", "utf8");
    await db.exec(schema);
    await db.exec(upgrade);
    await db.exec(schema);
    await db.exec(upgrade);
    const read = await db.query<{ allowed: boolean }>(
      "SELECT has_table_privilege('anon','public.subscribers','SELECT') AS allowed",
    );
    assert.equal(read.rows[0].allowed, false);
    const write = await db.query<{ allowed: boolean }>(
      "SELECT has_table_privilege('anon','public.subscribers','INSERT') AS allowed",
    );
    assert.equal(write.rows[0].allowed, false);
    const fn = await db.query<{ allowed: boolean }>(
      "SELECT has_function_privilege('anon','public.newsletter_allow_request(text,integer,integer)','EXECUTE') AS allowed",
    );
    assert.equal(fn.rows[0].allowed, false);
    await db.exec("SET ROLE service_role");
    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        db.query<{ allowed: boolean }>(
          "SELECT newsletter_allow_request('test',60,1) AS allowed",
        ),
      ),
    );
    assert.equal(results.filter((r) => r.rows[0].allowed).length, 1);
    await db.exec(
      "INSERT INTO subscribers(email,confirmation_hash,confirmation_expires_at) VALUES ('test@example.invalid','hash',now()+interval '1 day')",
    );
    const confirm = await db.query(
      "UPDATE subscribers SET confirmed=true,active=true,confirmation_hash=null WHERE confirmation_hash='hash' AND confirmation_expires_at>now() RETURNING id",
    );
    assert.equal(confirm.rows.length, 1);
    const replay = await db.query(
      "UPDATE subscribers SET confirmed=true WHERE confirmation_hash='hash' RETURNING id",
    );
    assert.equal(replay.rows.length, 0);
  } finally {
    await db.close();
  }
});
