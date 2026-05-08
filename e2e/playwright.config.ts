import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 1,
  use: {
    baseURL: "http://localhost:4200",
    extraHTTPHeaders: { "Content-Type": "application/json" },
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
