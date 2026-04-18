import type { ProtectedRouteRule } from "@/lib/config/protected-routes";

function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }

  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
}

export function matchProtectedRoute(pathname: string, routes: ProtectedRouteRule[]): ProtectedRouteRule | null {
  const normalizedPath = normalizePath(pathname);

  for (const route of routes) {
    const pattern = normalizePath(route.pattern);

    if (pattern.endsWith("/*")) {
      const base = pattern.slice(0, -2);

      if (normalizedPath === base || normalizedPath.startsWith(`${base}/`)) {
        return route;
      }

      continue;
    }

    if (normalizedPath === pattern) {
      return route;
    }
  }

  return null;
}
