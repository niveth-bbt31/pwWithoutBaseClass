import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;
  readonly errorMsg: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator("#username");
    this.passwordInput = page.locator("#password");
    this.loginBtn = page.locator("button[type='submit']");
    this.errorMsg = page.locator(".error");
  }

  async navigate() {
    await this.page.goto("https://the-internet.herokuapp.com/login");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }
}