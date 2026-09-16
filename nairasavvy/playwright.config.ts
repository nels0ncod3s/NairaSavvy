import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3099",
    browserName: "chromium",
    trace: "retain-on-failure",
    launchOptions: process.env.CHROMIUM_EXECUTABLE_PATH
      ? {
          executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
          args: [
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--no-zygote",
            "--disable-gpu",
            "--disable-software-rasterizer",
          ],
        }
      : undefined,
  },
  webServer: {
    command: "npm start -- --hostname 127.0.0.1 --port 3099",
    url: "http://127.0.0.1:3099",
    reuseExistingServer: false,
    env: {
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3099",
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
      SUPABASE_SECRET_KEY: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
      SENDBYTE_API_KEY: "",
    },
  },
});
