import { AdminRole } from "@prisma/client";
import { NextURL } from "next/dist/server/web/next-url";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import {
  adminDashboardRoute,
  authApi,
  authRoutes,
  privateRoutes,
  tutorDashboardRoute,
} from "./data/routes";

const roleBasedRedirect = (role: AdminRole, nextUrl: NextURL) => {
  if (role === "TUTOR") {
    return NextResponse.redirect(new URL(tutorDashboardRoute, nextUrl));
  } else {
    return NextResponse.redirect(new URL(adminDashboardRoute, nextUrl));
  }
};

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const session = await auth();
  const role = session?.user.role;
  const isLoggedIn = !!session?.user;

  const isApiAuthRoute = nextUrl.pathname.startsWith(authApi);
  const isTutorDashboardRoute =
    nextUrl.pathname.startsWith(tutorDashboardRoute);
  const isAdminDashboardRoute =
    nextUrl.pathname.startsWith(adminDashboardRoute);
  const isPrivateRoute = privateRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Bypass API authentication routes
  if (isApiAuthRoute || isAuthRoute) {
    return null;
  }

  //  Protect Private Routes
  if (!isLoggedIn && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  //  HANDLE LOGGED IN USERS
  if (isAuthRoute && isLoggedIn) {
    return roleBasedRedirect(role, nextUrl);
  }

  // ACCESS TO ADMIN DASHBOARD
  if (isAdminDashboardRoute) {
    if (role === "TUTOR") {
      return roleBasedRedirect(role, nextUrl);
    }
  }

  // RACCESS TO TUTOR DASHBOARD
  if (isTutorDashboardRoute) {
    if (role === "ADMIN" || role !== "TUTOR") {
      return null;
    } else {
      return roleBasedRedirect(role, nextUrl);
    }
  }

  return null;
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
