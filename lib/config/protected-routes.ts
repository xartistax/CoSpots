export type ProtectedRouteRule = {
  pattern: string;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
  roles?: Array<"guest" | "host">;
  accessRoles?: Array<"user" | "admin">;
};

export const protectedRoutes: ProtectedRouteRule[] = [
  {
    pattern: "/user/*",
    requireAuth: true,
    requireOnboarding: true,
  },

  {
    pattern: "/host/*",
    requireAuth: true,
    requireOnboarding: true,
    roles: ["host"],
    accessRoles: ["admin"],
  },
  {
    pattern: "/book/*",
    requireAuth: true,
    requireOnboarding: true,
  },
  {
    pattern: "/admin/*",
    requireAuth: true,
    requireOnboarding: true,
    accessRoles: ["admin"],
  },
  {
    pattern: "/user/bookings",
    requireAuth: true,
    roles: ["guest"],
  },
];
