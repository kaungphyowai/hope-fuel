import { NextResponse } from "next/server";

import awsConfig from "./aws-exports";
import { Amplify } from "aws-amplify";
import { UserProvider, useUser } from "./context/UserContext";

// Initialize Amplify
Amplify.configure(awsConfig);

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  console.log("Middleware pathname:", pathname);
  // Public routes that do not require authentication
  const publicRoutes = ["/login"];

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  try {
 
    // // Check if the user is authenticated
    // const { currentUser } = useUser();
    // console.log("User from middleware: ", currentUser);

    // if (!currentUser) {
    //   throw new Error("User is not authenticated");
    // }
    const user = await Auth.currentAuthenticatedUser();

    console.log("Authenticated user:", user);

    
    // User is authenticated; allow access
    return NextResponse.next();
  } catch (error) {
    console.error("User is not authenticated:", error);

    // Redirect unauthenticated users to the login page
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!api|_next|static).*)"], // Protect all routes except API and static files
};
