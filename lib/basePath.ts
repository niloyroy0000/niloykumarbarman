export function getBasePath() {
  const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!bp) return "";
  // ensure: "/my-portfolio" (no trailing slash)
  const normalized = bp.startsWith("/") ? bp : `/${bp}`;
  return normalized.replace(/\/+$/, "");
}

export function withBasePath(path: string) {
  const bp = getBasePath();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${bp}${p}`;
}
