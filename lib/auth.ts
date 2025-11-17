import { auth } from "@clerk/nextjs/server";

/**
 * Check if the current user has admin role
 * 
 * To set up admin users in Clerk:
 * 1. Go to Clerk Dashboard → Users
 * 2. Select a user
 * 3. Go to "Metadata" tab
 * 4. Add to "Public metadata": { "role": "admin" }
 */
export async function isAdmin() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return false;
  }
  
  // Check if user has admin role in public metadata
  const metadata = sessionClaims?.metadata as { role?: string } | undefined;
  const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
  const role = metadata?.role || publicMetadata?.role;
  return role === "admin";
}

/**
 * Get user role from Clerk metadata
 */
export function getUserRole(sessionClaims: any): "admin" | "user" {
  const role = sessionClaims?.metadata?.role || sessionClaims?.publicMetadata?.role;
  return role === "admin" ? "admin" : "user";
}

