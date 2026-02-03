import { test, expect } from "@playwright/test";

test.describe("Auto-login functionality", () => {
  test.describe("When AUTO_LOGIN=true", () => {
    test.beforeEach(async ({ request }) => {
      // Set auto-login to enabled via test API and check response
      const response = await request.post("/api/test/set-auto-login", {
        data: { enabled: true },
      });
      expect(response.ok()).toBeTruthy();
      // Check response body
      const responseBody = await response.text();
      expect(responseBody).toContain('"success":true');

      // Additional check to ensure it's set correctly
      const getResponse = await request.get("/api/test/get-auto-login");
      expect(getResponse.ok()).toBeTruthy();
      const getResponseBody = await getResponse.text();
      expect(getResponseBody).toContain('"autoLoginEnabled":true');
    });

    test.afterEach(async ({ request }) => {
      const response = await request.post("/api/test/reset-auto-login");
      expect(response.ok()).toBeTruthy();
      // Check response body
      const responseBody = await response.text();
      expect(responseBody).toContain('"success":true');
    });

    test("should automatically login when accessing dashboard", async ({
      page,
    }) => {
      // This test assumes AUTO_LOGIN=true is set in the test environment
      await page.goto("/dashboard");

      // Should be redirected and logged in automatically
      await expect(page).toHaveURL(/\/dashboard/);
      // Check that we're on the dashboard (not signin page)
      await expect(page.getByText("Recent Jobs Applied")).toBeVisible();
    });

    test("should not show logout button in profile menu", async ({ page }) => {
      await page.goto("/dashboard");

      // Open profile dropdown
      await page.getByRole("button", { name: "Avatar" }).click();

      // Logout button should NOT be visible
      await expect(page.getByText("Logout")).not.toBeVisible();

      // But settings should still be visible
      await expect(
        page.getByRole("menuitem", { name: "Settings" }),
      ).toBeVisible();
    });

    test("should redirect from signin page to dashboard", async ({ page }) => {
      await page.goto("/signin");

      // Should be auto-logged in and redirected to dashboard
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe("When AUTO_LOGIN=false", () => {
    test.beforeEach(async ({ request }) => {
      const response = await request.post("/api/test/set-auto-login", {
        data: { enabled: false },
      });
      expect(response.ok()).toBeTruthy();
      // Check response body
      const responseBody = await response.text();
      expect(responseBody).toContain('"success":true');

      // Additional check to ensure it's set correctly
      const getResponse = await request.get("/api/test/get-auto-login");
      expect(getResponse.ok()).toBeTruthy();
      const getResponseBody = await getResponse.text();
      expect(getResponseBody).toContain('"autoLoginEnabled":false');
    });

    test.afterEach(async ({ request }) => {
      const response = await request.post("/api/test/reset-auto-login");
      expect(response.ok()).toBeTruthy();
      // Check response body
      const responseBody = await response.text();
      expect(responseBody).toContain('"success":true');
    });

    test("should show login form", async ({ page }) => {
      // This test assumes AUTO_LOGIN=false or not set
      await page.goto("/signin");

      // Should see the login form
      await expect(
        page.getByRole("heading", { name: "Sign in" }),
      ).toBeVisible();
      await expect(page.getByPlaceholder("id@example.com")).toBeVisible();
    });

    test("should redirect to signin when accessing dashboard unauthenticated", async ({
      page,
    }) => {
      await page.goto("/dashboard");

      // Should be redirected to signin
      await expect(page).toHaveURL(/\/signin/);
      await expect(
        page.getByRole("heading", { name: "Sign in" }),
      ).toBeVisible();
    });

    test("should show logout button after manual login", async ({
      page,
      baseURL,
    }) => {
      await page.goto("/signin");

      // Login manually
      await page.getByLabel("Email").click();
      await page.getByLabel("Email").fill("admin@example.com");
      await page.getByLabel("Password").click();
      await page.getByLabel("Password").fill("password123");
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(page).toHaveURL(baseURL + "/dashboard");

      // Open profile dropdown
      await page.getByRole("button", { name: "Avatar" }).click();

      // Logout button SHOULD be visible
      await expect(page.getByText("Logout")).toBeVisible();
    });
  });
});
