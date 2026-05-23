/**
 * FedSignal School Authentication & Role-Based Access Control
 * 
 * Manages authentication and role-based access for HBCU schools
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from "firebase/firestore";
import { FSCOLLECTIONS, FSOrganizationDoc, FSOnboardingDoc } from "@/lib/fedsignal/schema";

export type UserRole = "vp_research" | "researcher" | "bd_manager" | "admin";

export interface SchoolUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  universityId: string;
  universityName: string;
  title?: string;
  status: "active" | "pending" | "inactive";
  createdAt: Timestamp;
  lastLogin?: Timestamp;
}

export interface SchoolCredentials {
  universityId: string;
  username: string;
  password: string;
}

// Pre-configured school credentials for demo/testing
export const SCHOOL_CREDENTIALS: Record<string, { username: string; password: string }> = {
  "tuskegee": { username: "TUSKEGEE1", password: "TUSKEGEE2026" },
  "howard": { username: "HOWARD1", password: "HOWARD2026" },
  "spelman": { username: "SPELMAN1", password: "SPELMAN2026" },
  "morehouse": { username: "MOREHOUSE1", password: "MOREHOUSE2026" },
  "hampton": { username: "HAMPTON1", password: "HAMPTON2026" },
  "famu": { username: "FAMU1", password: "FAMU2026" },
  "aamu": { username: "AAMU1", password: "AAMU2026" },
  "ncat": { username: "NCAT1", password: "NCAT2026" },
  "huston-tillotson": { username: "HBCU1", password: "HBCU2026" },
};

// School role permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  vp_research: [
    "view_opportunities",
    "view_grants",
    "edit_profile",
    "manage_users",
    "export_data",
    "view_analytics",
  ],
  researcher: [
    "view_opportunities",
    "view_grants",
    "edit_profile",
    "export_data",
  ],
  bd_manager: [
    "view_opportunities",
    "edit_profile",
    "manage_proposals",
    "export_data",
  ],
  admin: [
    "view_opportunities",
    "view_grants",
    "edit_profile",
    "manage_users",
    "export_data",
    "view_analytics",
    "manage_settings",
  ],
};

/**
 * Authenticate a school user
 */
export async function authenticateSchoolUser(
  credentials: SchoolCredentials
): Promise<{ success: boolean; user?: SchoolUser; error?: string }> {
  try {
    const { universityId, username, password } = credentials;
    
    // Check if credentials match school config
    const schoolCreds = SCHOOL_CREDENTIALS[universityId];
    if (!schoolCreds) {
      return { success: false, error: "Invalid school ID" };
    }
    
    if (username !== schoolCreds.username || password !== schoolCreds.password) {
      return { success: false, error: "Invalid username or password" };
    }
    
    // Check if db is available
    if (!db) {
      // Fallback to session storage only if db is not available
      sessionStorage.setItem("fedsignal_demo_login", "true");
      sessionStorage.setItem("fedsignal_username", username);
      sessionStorage.setItem("svp_user_id", universityId);
      sessionStorage.setItem("svp_user_role", "vp_research");
      sessionStorage.setItem("svp_user_university", getUniversityName(universityId));
      sessionStorage.setItem("svp_user_mascot", getUniversityMascot(universityId));
      
      return { success: true, user: {
        id: universityId,
        email: `${username.toLowerCase()}@${universityId.replace(/-/g, "")}.edu`,
        name: username,
        role: "vp_research",
        universityId,
        universityName: getUniversityName(universityId),
        status: "active",
        createdAt: Timestamp.now(),
      }};
    }
    
    // Check if user exists in Firestore
    const usersRef = collection(db, FSCOLLECTIONS.USERS);
    const q = query(
      usersRef, 
      where("universityId", "==", universityId),
      where("email", "==", `${username.toLowerCase()}@${universityId.replace(/-/g, "")}.edu`)
    );
    const querySnapshot = await getDocs(q);
    
    let userDoc;
    if (querySnapshot.empty) {
      // Create new user if doesn't exist
      const newUserRef = doc(collection(db, FSCOLLECTIONS.USERS));
      const userData: SchoolUser = {
        id: newUserRef.id,
        email: `${username.toLowerCase()}@${universityId.replace(/-/g, "")}.edu`,
        name: `${username} User`,
        role: "vp_research", // Default role for new users
        universityId,
        universityName: getUniversityName(universityId),
        status: "active",
        createdAt: Timestamp.now(),
      };
      
      await setDoc(newUserRef, userData);
      userDoc = userData;
    } else {
      userDoc = querySnapshot.docs[0].data() as SchoolUser;
      
      // Update last login
      await updateDoc(querySnapshot.docs[0].ref, {
        lastLogin: Timestamp.now(),
      });
    }
    
    // Store in session storage
    sessionStorage.setItem("fedsignal_demo_login", "true");
    sessionStorage.setItem("fedsignal_username", username);
    sessionStorage.setItem("svp_user_id", universityId);
    sessionStorage.setItem("svp_user_role", userDoc.role);
    sessionStorage.setItem("svp_user_university", userDoc.universityName);
    sessionStorage.setItem("svp_user_mascot", getUniversityMascot(universityId));
    
    return { success: true, user: userDoc };
  } catch (error) {
    console.error("School authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

/**
 * Check if user has permission for a specific action
 */
export function hasPermission(userRole: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

/**
 * Get university name from ID
 */
function getUniversityName(universityId: string): string {
  const names: Record<string, string> = {
    "tuskegee": "Tuskegee University",
    "howard": "Howard University",
    "spelman": "Spelman College",
    "morehouse": "Morehouse College",
    "hampton": "Hampton University",
    "famu": "Florida A&M University",
    "aamu": "Alabama A&M University",
    "ncat": "NC A&T State University",
    "huston-tillotson": "Huston-Tillotson University",
  };
  return names[universityId] || "Unknown University";
}

/**
 * Get university mascot from ID
 */
function getUniversityMascot(universityId: string): string {
  const mascots: Record<string, string> = {
    "tuskegee": "🐯",
    "howard": "🦬",
    "spelman": "🐆",
    "morehouse": "🐅",
    "hampton": "🏴‍☠️",
    "famu": "🐍",
    "aamu": "🐴",
    "ncat": "🐐",
    "huston-tillotson": "🐾",
  };
  return mascots[universityId] || "🎓";
}

/**
 * Sign out user
 */
export async function signOut(): Promise<void> {
  try {
    if (auth) {
      await firebaseSignOut(auth);
    }
    sessionStorage.clear();
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

/**
 * Get current user from session
 */
export function getCurrentSessionUser(): SchoolUser | null {
  const userId = sessionStorage.getItem("svp_user_id");
  const username = sessionStorage.getItem("fedsignal_username");
  const role = sessionStorage.getItem("svp_user_role") as UserRole;
  const universityName = sessionStorage.getItem("svp_user_university");
  
  if (!userId || !username || !role) {
    return null;
  }
  
  return {
    id: userId,
    email: `${username.toLowerCase()}@${userId.replace(/-/g, "")}.edu`,
    name: username,
    role,
    universityId: userId,
    universityName: universityName || "",
    status: "active",
    createdAt: Timestamp.now(),
  };
}
