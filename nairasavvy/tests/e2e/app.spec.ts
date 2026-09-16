import { test, expect } from "@playwright/test";
test("public pages and SEO assets work without external configuration", async ({
  request,
}) => {
  for (const path of [
    "/",
    "/savings",
    "/news",
    "/cut-costs/data-plans",
    "/search?q=bank",
    "/articles?category=savings",
    "/sitemap.xml",
    "/robots.txt",
    "/logo.svg",
    "/opengraph-image",
    "/tools/complaint-letter",
  ]) {
    const r = await request.get(path);
    expect(r.status(), path).toBe(200);
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("compare-savings-without-chasing-headline-rates");
  expect(sitemap).not.toContain("naira-hits-1591");
});
test("signup never falsely succeeds when services are missing", async ({
  request,
}) => {
  expect(
    (
      await request.post("/api/subscribe", {
        data: { email: "valid@example.invalid" },
      })
    ).status(),
  ).toBe(503);
  expect(
    (
      await request.post("/api/subscribe", { data: { email: "not-valid" } })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/subscribe", {
        data: "{bad",
        headers: { "Content-Type": "application/json" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/subscribe", {
        data: { email: "x".repeat(5000) },
      })
    ).status(),
  ).toBe(413);
});
test("calculator explains loss correctly and validates negative values", async ({
  page,
}) => {
  await page.goto("/tools/naira-erosion-calculator");
  await page.getByLabel("Amount (₦)", { exact: true }).fill("100000");
  await page.getByLabel("Annual inflation (%)").fill("20");
  await page.getByLabel("Years", { exact: true }).fill("1");
  await expect(page.locator(".result-card").nth(1)).toContainText("16,667");
  await page.getByRole("button", { name: "₦500,000", exact: true }).click();
  await expect(page.getByLabel("Amount (₦)", { exact: true })).toHaveValue(
    "500000",
  );
  await expect(page.locator(".power-labels")).toContainText("83.3%");
  await page.getByLabel("Amount (₦)", { exact: true }).fill("-1");
  await expect(page.locator(".erosion-calc-wrap [role=alert]")).toBeVisible();
});
test("mobile navigation traps focus, closes with Escape and has no overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open navigation menu" }),
  ).toBeFocused();
  await page.screenshot({
    path: test.info().outputPath("mobile-home.png"),
    fullPage: true,
  });
  for (const path of [
    "/",
    "/savings",
    "/cut-costs/data-plans",
    "/tools/complaint-letter",
    "/articles",
    "/grow",
    "/fight-back",
    "/cut-costs",
    "/newsletter",
    "/search?q=bank",
  ]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      path,
    ).toBe(true);
  }
});
test("historical data is opt-in and respects budget and validity", async ({
  page,
}) => {
  await page.goto("/cut-costs/data-plans");
  await expect(page.locator(".plan-grid article")).toHaveCount(0);
  await page.getByLabel("Show historical or unverified records").check();
  await page.getByLabel("Maximum budget (₦)").fill("1000");
  await page.getByLabel("Minimum validity (days)").fill("30");
  await expect(page.locator(".plan-grid article").first()).toBeVisible();
  for (const card of await page.locator(".plan-grid article").all()) {
    await expect(card).toContainText("Historical example");
    await expect(card).toContainText("30 days");
  }
});
test("complaint can be edited and downloaded", async ({ page }) => {
  await page.goto("/tools/complaint-letter");
  await page.getByLabel("Your name", { exact: true }).fill("Test Person");
  await page.getByLabel("Bank or institution").fill("Test Bank");
  await page.getByLabel("Transaction date").fill("2026-09-01");
  await page.getByLabel("Amount in dispute (₦)").fill("1000");
  await page.getByLabel("What happened?").fill("Recipient was not credited.");
  await page
    .getByLabel("What resolution are you requesting?")
    .fill("Please investigate.");
  await page.getByRole("button", { name: "Generate / update draft" }).click();
  await expect(page.getByLabel("Review and edit your letter")).toHaveValue(
    /Test Person/,
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download letter (.txt)" }).click();
  expect((await download).suggestedFilename()).toBe("bank-complaint.txt");
});
test("article category filter uses async search parameters", async ({
  page,
}) => {
  await page.goto("/articles?category=savings");
  await expect(page.locator("main")).toContainText(
    "Compare savings without chasing headline rates",
  );
  await expect(page.locator("main")).not.toContainText(
    "Five questions before choosing a money product",
  );
});
