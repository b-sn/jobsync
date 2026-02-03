import { test, expect } from "@playwright/test";

test("Signin page has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Sign in | JobSync");

  await expect(
    page.getByRole("heading", { name: "JobSync - Job Search Assistant" }),
  ).toBeVisible();

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("Signin and out from app", async ({ page, baseURL }) => {
  await page.goto("/");
  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(baseURL + "/dashboard");

  await page.getByRole("button", { name: "Avatar" }).click();
  await page.getByRole("button", { name: "Logout" }).click();

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
