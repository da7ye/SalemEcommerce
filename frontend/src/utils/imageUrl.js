const BACKEND_URL = "https://da7ye.pythonanywhere.com";

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BACKEND_URL}${path}`;
};