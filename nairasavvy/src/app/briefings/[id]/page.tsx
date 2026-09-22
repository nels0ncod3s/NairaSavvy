import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import Footer from "@/components/Footer";
import { agentDb, check } from "@/lib/agents/db";
import { briefSchema } from "@/lib/agents/model";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Money briefing" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  let result;
  try {
    const db = agentDb(true);
    const { data, error } = await db
      .from("agent_briefings")
      .select("id,content,published_at")
      .eq("id", id)
      .maybeSingle();
    check(error);
    result = data;
  } catch {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="container-content"
        style={{ paddingTop: 140, paddingBottom: 100 }}
      >
        <h1 className="type-h1">Briefing unavailable</h1>
        <p role="status">
          We could not load this briefing. Please try again later.
        </p>
        <Link href="/briefings">Back to all briefings</Link>
      </main>
    );
  }
  const data = result;
  if (!data) notFound();
  const c = briefSchema.parse(data.content);
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <article
          className="container-content"
          style={{
            maxWidth: 820,
            paddingTop: 120,
            paddingBottom: 100,
            overflowWrap: "anywhere",
          }}
        >
          <Link href="/briefings">← All briefings</Link>
          <p className="category-tag" style={{ marginTop: 40 }}>
            {c.category}
          </p>
          <h1 className="type-h1" style={{ margin: "24px 0" }}>
            {c.title}
          </h1>
          <p>
            Published {new Date(data.published_at).toLocaleDateString("en-NG")}
          </p>
          <div className="type-body" style={{ fontSize: 19, lineHeight: 1.85 }}>
            {c.paragraphs.map((p, i) => (
              <p key={i} style={{ margin: "24px 0", whiteSpace: "pre-line" }}>
                {p}
              </p>
            ))}
          </div>
          <aside
            style={{
              borderTop: "1px solid #ccc",
              paddingTop: 24,
              marginTop: 40,
            }}
          >
            <h2 className="type-h3">Read the source</h2>
            <p>
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">
                {c.source} ↗
              </a>
            </p>
            <p>
              {c.sourceDate
                ? `Source publication: ${new Date(c.sourceDate).toLocaleDateString("en-NG")}`
                : "Source publication date was not available."}
            </p>
            <p>
              Prepared by Bayo and reviewed before publication. This briefing is
              information, not personalised financial advice.
            </p>
          </aside>
        </article>
      </main>
      <Footer />
    </>
  );
}
