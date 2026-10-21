import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    browserName: "chromium",
    headless: false,
    screenshot: "only-on-failure",
  },
  testDir: "tests",
});