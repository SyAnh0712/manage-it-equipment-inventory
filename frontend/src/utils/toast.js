export const showToast = {
  success: (message) => {
    console.log("✓ " + message);
  },
  error: (message) => {
    console.error("✗ " + message);
  },
  info: (message) => {
    console.info("ℹ " + message);
  },
  warning: (message) => {
    console.warn("⚠ " + message);
  },
};
