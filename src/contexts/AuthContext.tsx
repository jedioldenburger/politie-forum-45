"use client";

import { createUser, getUser } from "@/lib/database";
import { auth as getAuthInstance } from "@/lib/firebase";
import { User } from "@/lib/types";
import {
    FacebookAuthProvider,
    User as FirebaseUser,
    GithubAuthProvider,
    GoogleAuthProvider,
    OAuthProvider,
    TwitterAuthProvider,
    createUserWithEmailAndPassword,
    signInAnonymously as firebaseSignInAnonymously,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return null state when Auth is not needed (homepage, articles, etc.)
    // This allows components to gracefully handle no-auth state
    return {
      currentUser: null,
      userData: null,
      loading: false,
      signUp: async () => { throw new Error("Auth not loaded"); },
      signIn: async () => { throw new Error("Auth not loaded"); },
      signInWithGoogle: async () => { throw new Error("Auth not loaded"); },
      signInWithFacebook: async () => { throw new Error("Auth not loaded"); },
      signInWithTwitter: async () => { throw new Error("Auth not loaded"); },
      signInWithGithub: async () => { throw new Error("Auth not loaded"); },
      signInWithMicrosoft: async () => { throw new Error("Auth not loaded"); },
      signInWithApple: async () => { throw new Error("Auth not loaded"); },
      signInAnonymously: async () => { throw new Error("Auth not loaded"); },
      signOut: async () => { throw new Error("Auth not loaded"); },
    } as AuthContextType;
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signUp(email: string, password: string, displayName: string) {
    const authInstance = getAuthInstance();
    const result = await createUserWithEmailAndPassword(authInstance, email, password);

    if (result.user) {
      await updateProfile(result.user, { displayName });

      // Create user profile in database
      const newUser: Omit<User, "uid"> = {
        email,
        displayName,
        createdAt: Date.now(),
        role: "user",
        posts: 0,
        reputation: 0,
      };

      await createUser(result.user.uid, newUser);
    }
  }

  async function signIn(email: string, password: string) {
    const authInstance = getAuthInstance();
    await signInWithEmailAndPassword(authInstance, email, password);
  }

  async function signInWithGoogle() {
    const authInstance = getAuthInstance();
    try {
      const provider = new GoogleAuthProvider();
      // Add custom parameters to help with storage issues
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(authInstance, provider);

      if (result.user) {
        // Check if user exists in database
        const existingUser = await getUser(result.user.uid);

        if (!existingUser) {
          // Create new user profile
          const newUser: Omit<User, "uid"> = {
            email: result.user.email || "",
            displayName: result.user.displayName || "Gebruiker",
            photoURL: result.user.photoURL || undefined,
            createdAt: Date.now(),
            role: "user",
            posts: 0,
            reputation: 0,
          };

          await createUser(result.user.uid, newUser);
        } else if (result.user.photoURL && existingUser.photoURL !== result.user.photoURL) {
          // Update photoURL if changed
          await createUser(result.user.uid, { ...existingUser, photoURL: result.user.photoURL });
        }
      }
    } catch (error: any) {
      // Better error handling for storage issues
      if (error.code === 'auth/web-storage-unsupported' ||
          error.code === 'auth/operation-not-supported-in-this-environment') {
        console.error('Browser storage is disabled. Please enable cookies and local storage.');
        throw new Error('Browser storage is vereist. Schakel cookies en local storage in.');
      }
      throw error;
    }
  }

  async function signInWithFacebook() {
    const authInstance = getAuthInstance();
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(authInstance, provider);

    if (result.user) {
      const existingUser = await getUser(result.user.uid);

      if (!existingUser) {
        const newUser: Omit<User, "uid"> = {
          email: result.user.email || "",
          displayName: result.user.displayName || "Gebruiker",
          photoURL: result.user.photoURL || undefined,
          createdAt: Date.now(),
          role: "user",
          posts: 0,
          reputation: 0,
        };

        await createUser(result.user.uid, newUser);
      }
    }
  }

  async function signInWithTwitter() {
    const authInstance = getAuthInstance();
    const provider = new TwitterAuthProvider();
    const result = await signInWithPopup(authInstance, provider);

    if (result.user) {
      const existingUser = await getUser(result.user.uid);

      if (!existingUser) {
        const newUser: Omit<User, "uid"> = {
          email: result.user.email || "",
          displayName: result.user.displayName || "Gebruiker",
          photoURL: result.user.photoURL || undefined,
          createdAt: Date.now(),
          role: "user",
          posts: 0,
          reputation: 0,
        };

        await createUser(result.user.uid, newUser);
      }
    }
  }

  async function signInWithGithub() {
    const authInstance = getAuthInstance();
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(authInstance, provider);

    if (result.user) {
      const existingUser = await getUser(result.user.uid);

      if (!existingUser) {
        const newUser: Omit<User, "uid"> = {
          email: result.user.email || "",
          displayName: result.user.displayName || "Gebruiker",
          photoURL: result.user.photoURL || undefined,
          createdAt: Date.now(),
          role: "user",
          posts: 0,
          reputation: 0,
        };

        await createUser(result.user.uid, newUser);
      }
    }
  }

  async function signInWithMicrosoft() {
    const authInstance = getAuthInstance();
    const provider = new OAuthProvider("microsoft.com");
    const result = await signInWithPopup(authInstance, provider);

    if (result.user) {
      const existingUser = await getUser(result.user.uid);

      if (!existingUser) {
        const newUser: Omit<User, "uid"> = {
          email: result.user.email || "",
          displayName: result.user.displayName || "Gebruiker",
          photoURL: result.user.photoURL || undefined,
          createdAt: Date.now(),
          role: "user",
          posts: 0,
          reputation: 0,
        };

        await createUser(result.user.uid, newUser);
      }
    }
  }

  async function signInWithApple() {
    const authInstance = getAuthInstance();
    const provider = new OAuthProvider("apple.com");
    const result = await signInWithPopup(authInstance, provider);

    if (result.user) {
      const existingUser = await getUser(result.user.uid);

      if (!existingUser) {
        const newUser: Omit<User, "uid"> = {
          email: result.user.email || "",
          displayName: result.user.displayName || "Gebruiker",
          photoURL: result.user.photoURL || undefined,
          createdAt: Date.now(),
          role: "user",
          posts: 0,
          reputation: 0,
        };

        await createUser(result.user.uid, newUser);
      }
    }
  }

  async function signInAnonymously() {
    const authInstance = getAuthInstance();
    const result = await firebaseSignInAnonymously(authInstance);

    if (result.user) {
      const existingUser = await getUser(result.user.uid);

      if (!existingUser) {
        // Create anonymous user profile
        const newUser: Omit<User, "uid"> = {
          email: "",
          displayName: "Gast",
          createdAt: Date.now(),
          role: "user",
          posts: 0,
          reputation: 0,
        };

        await createUser(result.user.uid, newUser);
      }
    }
  }

  async function signOut() {
    const authInstance = getAuthInstance();
    await firebaseSignOut(authInstance);
  }

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    // Only run in browser
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    let authInstance: any;
    try {
      authInstance = getAuthInstance();
    } catch (e) {
      console.warn("Firebase auth not initialized yet:", e);
      setLoading(false);
      return;
    }

    if (!authInstance || typeof authInstance !== 'object' || typeof (authInstance as any).onAuthStateChanged !== 'function') {
      // Fallback: dynamic import on first tick
      (async () => {
        try {
          const a = getAuthInstance();
          unsubscribe = onAuthStateChanged(a, async (user) => {
            setCurrentUser(user);
            if (user) {
              const dbUser = await getUser(user.uid);
              setUserData(dbUser);
            } else {
              setUserData(null);
            }
            setLoading(false);
          });
        } catch (err) {
          console.error("Auth init failed after retry", err);
          setLoading(false);
        }
      })();
      return () => { if (unsubscribe) unsubscribe(); };
    }

    unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      setCurrentUser(user);
      if (user) {
        const dbUser = await getUser(user.uid);
        setUserData(dbUser);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    signInWithGithub,
    signInWithMicrosoft,
    signInWithApple,
    signInAnonymously,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
