import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

export type UserRole = "admin" | "moderator" | "user";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        role: data.role || "user",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Create or update user profile in Firestore
 * This is called when a user signs in for the first time or updates their profile
 */
export async function createOrUpdateUserProfile(user: User): Promise<void> {
  try {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create new user profile with default role
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // Update existing user profile
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        updatedAt: new Date(),
      }, { merge: true });
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
  }
}

/**
 * Check if the current user has admin role
 * 
 * To set up admin users:
 * 1. Go to Firebase Console → Firestore Database
 * 2. Find the user document in 'users' collection
 * 3. Update the 'role' field to 'admin'
 */
export async function isAdmin(uid: string): Promise<boolean> {
  if (!uid) return false;
  
  const profile = await getUserProfile(uid);
  return profile?.role === "admin";
}

/**
 * Get user role from Firestore
 */
export async function getUserRole(uid: string): Promise<UserRole> {
  const profile = await getUserProfile(uid);
  return profile?.role || "user";
}

