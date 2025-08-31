import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  FieldValue, 
} from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
}

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const createUserProfile = async (
  user: User,
  profileData: Omit<UserProfile, "uid" | "createdAt" | "updatedAt">
): Promise<void> => {
  try {
    const userProfile: UserProfile = {
      uid: user.uid,
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, userProfile);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  user: User,
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // El documento existe, actualizamos
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      });
    } else {
      // El documento no existe, lo creamos
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || "",
        firstName: "",
        lastName: "",
        dni: "",
        phone: "",
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(userDocRef, userProfile);
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
