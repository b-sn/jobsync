/**
 * Internal checker function that can be overridden for testing
 * Stored in global to avoid Next.js module isolation issues
 */
type GlobalWithAutoLogin = typeof globalThis & {
  __autoLoginChecker?: (() => boolean) | null;
};

const getGlobal = () => globalThis as GlobalWithAutoLogin;

/**
 * Set a custom auto-login checker function for testing
 * @param checker Function that returns boolean indicating if auto-login is enabled
 */
export function setAutoLoginChecker(checker: (() => boolean) | null): void {
  getGlobal().__autoLoginChecker = checker;
}

/**
 * Reset auto-login checker to default behavior
 */
export function resetAutoLoginChecker(): void {
  getGlobal().__autoLoginChecker = null;
}

/**
 * Get the default auto-login state based on environment variables
 */
function getDefaultAutoLoginState(): boolean {
  const autoLoginEnv = process.env.AUTO_LOGIN === "true";
  const isPlaywrightTest = process.env.PLAYWRIGHT_TEST === "true";
  return autoLoginEnv && !isPlaywrightTest;
}

/**
 * Check if auto-login is enabled
 * This function can be mocked in tests to test both enabled and disabled states
 * @returns boolean indicating if auto-login should be activated
 */
export function isAutoLoginEnabled(): boolean {
  const autoLoginChecker = getGlobal().__autoLoginChecker;

  // If a custom checker was set (for testing), use it
  if (autoLoginChecker !== null && autoLoginChecker !== undefined) {
    return autoLoginChecker();
  }

  // Otherwise, use default behavior
  return getDefaultAutoLoginState();
}
