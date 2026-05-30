const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export const resolveImageUrl = (url) => {
  if (!url || typeof url !== "string") {
    return "";
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }

  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${API_ORIGIN}${trimmed}`;
  }

  return trimmed;
};
