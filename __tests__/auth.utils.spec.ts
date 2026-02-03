import {
  isAutoLoginEnabled,
  setAutoLoginChecker,
  resetAutoLoginChecker,
} from "@/utils/auth.utils";

describe("auth.utils", () => {
  // Save original env variables
  const originalAutoLogin = process.env.AUTO_LOGIN;
  const originalPlaywrightTest = process.env.PLAYWRIGHT_TEST;

  beforeEach(() => {
    // Reset auto-login checker before each test
    resetAutoLoginChecker();
    // Reset env variables
    delete process.env.AUTO_LOGIN;
    delete process.env.PLAYWRIGHT_TEST;
  });

  afterEach(() => {
    // Clean up
    resetAutoLoginChecker();
    // Restore original env variables
    if (originalAutoLogin !== undefined) {
      process.env.AUTO_LOGIN = originalAutoLogin;
    } else {
      delete process.env.AUTO_LOGIN;
    }
    if (originalPlaywrightTest !== undefined) {
      process.env.PLAYWRIGHT_TEST = originalPlaywrightTest;
    } else {
      delete process.env.PLAYWRIGHT_TEST;
    }
  });

  describe("isAutoLoginEnabled", () => {
    describe("when no custom checker is set", () => {
      it("should return false when AUTO_LOGIN is not set", () => {
        expect(isAutoLoginEnabled()).toBe(false);
      });

      it("should return false when AUTO_LOGIN is false", () => {
        process.env.AUTO_LOGIN = "false";
        expect(isAutoLoginEnabled()).toBe(false);
      });

      it("should return true when AUTO_LOGIN is true", () => {
        process.env.AUTO_LOGIN = "true";
        expect(isAutoLoginEnabled()).toBe(true);
      });

      it("should return false when AUTO_LOGIN is true but PLAYWRIGHT_TEST is true", () => {
        process.env.AUTO_LOGIN = "true";
        process.env.PLAYWRIGHT_TEST = "true";
        expect(isAutoLoginEnabled()).toBe(false);
      });

      it("should return false when PLAYWRIGHT_TEST is true but AUTO_LOGIN is not set", () => {
        process.env.PLAYWRIGHT_TEST = "true";
        expect(isAutoLoginEnabled()).toBe(false);
      });

      it("should handle other values of AUTO_LOGIN as false", () => {
        process.env.AUTO_LOGIN = "yes";
        expect(isAutoLoginEnabled()).toBe(false);

        process.env.AUTO_LOGIN = "1";
        expect(isAutoLoginEnabled()).toBe(false);

        process.env.AUTO_LOGIN = "on";
        expect(isAutoLoginEnabled()).toBe(false);
      });
    });

    describe("when custom checker is set", () => {
      it("should return true when checker returns true", () => {
        setAutoLoginChecker(() => true);
        expect(isAutoLoginEnabled()).toBe(true);
      });

      it("should return false when checker returns false", () => {
        setAutoLoginChecker(() => false);
        expect(isAutoLoginEnabled()).toBe(false);
      });

      it("should use custom checker even if AUTO_LOGIN env is set", () => {
        process.env.AUTO_LOGIN = "true";
        setAutoLoginChecker(() => false);
        expect(isAutoLoginEnabled()).toBe(false);
      });

      it("should use custom checker even if PLAYWRIGHT_TEST env is set", () => {
        process.env.AUTO_LOGIN = "true";
        process.env.PLAYWRIGHT_TEST = "true";
        setAutoLoginChecker(() => true);
        expect(isAutoLoginEnabled()).toBe(true);
      });

      it("should support complex checker logic", () => {
        const mockUser = { id: "123" };
        setAutoLoginChecker(() => mockUser?.id === "123");
        expect(isAutoLoginEnabled()).toBe(true);

        setAutoLoginChecker(() => mockUser?.id === "456");
        expect(isAutoLoginEnabled()).toBe(false);
      });
    });
  });

  describe("setAutoLoginChecker", () => {
    it("should set a custom checker function", () => {
      const checker = jest.fn(() => true);
      setAutoLoginChecker(checker);
      isAutoLoginEnabled();
      expect(checker).toHaveBeenCalled();
    });

    it("should allow setting checker to null", () => {
      setAutoLoginChecker(() => true);
      expect(isAutoLoginEnabled()).toBe(true);

      setAutoLoginChecker(null);
      process.env.AUTO_LOGIN = "false";
      expect(isAutoLoginEnabled()).toBe(false);
    });

    it("should override previous checker", () => {
      setAutoLoginChecker(() => true);
      expect(isAutoLoginEnabled()).toBe(true);

      setAutoLoginChecker(() => false);
      expect(isAutoLoginEnabled()).toBe(false);
    });
  });

  describe("resetAutoLoginChecker", () => {
    it("should reset checker to default behavior", () => {
      setAutoLoginChecker(() => true);
      expect(isAutoLoginEnabled()).toBe(true);

      resetAutoLoginChecker();
      process.env.AUTO_LOGIN = "false";
      expect(isAutoLoginEnabled()).toBe(false);
    });

    it("should revert to env-based logic after reset", () => {
      setAutoLoginChecker(() => false);
      resetAutoLoginChecker();

      process.env.AUTO_LOGIN = "true";
      expect(isAutoLoginEnabled()).toBe(true);

      process.env.PLAYWRIGHT_TEST = "true";
      expect(isAutoLoginEnabled()).toBe(false);
    });

    it("should be idempotent", () => {
      resetAutoLoginChecker();
      resetAutoLoginChecker();
      resetAutoLoginChecker();

      process.env.AUTO_LOGIN = "true";
      expect(isAutoLoginEnabled()).toBe(true);
    });
  });

  describe("integration scenarios", () => {
    it("should handle test-disable-enable flow", () => {
      // Initially disabled for testing
      process.env.AUTO_LOGIN = "true";
      process.env.PLAYWRIGHT_TEST = "true";
      expect(isAutoLoginEnabled()).toBe(false);

      // Override with custom checker to enable
      setAutoLoginChecker(() => true);
      expect(isAutoLoginEnabled()).toBe(true);

      // Reset back to env-based logic
      resetAutoLoginChecker();
      expect(isAutoLoginEnabled()).toBe(false);
    });

    it("should allow multiple test scenarios in sequence", () => {
      // Scenario 1: Auto-login disabled
      setAutoLoginChecker(() => false);
      expect(isAutoLoginEnabled()).toBe(false);
      resetAutoLoginChecker();

      // Scenario 2: Auto-login enabled
      setAutoLoginChecker(() => true);
      expect(isAutoLoginEnabled()).toBe(true);
      resetAutoLoginChecker();

      // Scenario 3: Back to env-based
      process.env.AUTO_LOGIN = "true";
      expect(isAutoLoginEnabled()).toBe(true);
      resetAutoLoginChecker();
    });

    it("should support nested testing patterns", () => {
      const outerChecker = jest.fn(() => true);
      const innerChecker = jest.fn(() => false);

      setAutoLoginChecker(outerChecker);
      expect(isAutoLoginEnabled()).toBe(true);
      expect(outerChecker).toHaveBeenCalled();

      setAutoLoginChecker(innerChecker);
      expect(isAutoLoginEnabled()).toBe(false);
      expect(innerChecker).toHaveBeenCalled();

      resetAutoLoginChecker();
      expect(isAutoLoginEnabled()).toBe(false);
    });
  });
});
