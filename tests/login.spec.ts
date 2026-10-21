import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test("Verify login with invalid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login("wrong", "wrong");

  await expect(loginPage.errorMsg).toBeVisible();
  await expect(loginPage.errorMsg).toContainText("Your username is invalid");
});