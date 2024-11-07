import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// User type definition
type User = {
  email: string;
  onBoardingStage: string;
  isOnBoarded: boolean;
  userName?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  profileImage?: string;
  coverImage?: string;
  interests?: string[];
  _id: string;
} | null;

// type for store
type MainStore = {
  verifyToken: string | null;

  accessToken: string | null;

  //setting token during signup
  setVerifyToken: (token: string | null) => void;

  //setting token after signup and login
  setAccessToken: (token: string | null) => void;
  //   usertype
  globalUser: User;
  // Set globalUser action
  setGlobalUser: (detail: User) => void;

  //clearing token after registration
  clearVerifyToken: () => void;

  //clearing token after logout
  clearAccessToken: () => void;

  // Clear user data
  clearGlobalUser: () => void;
  // Clear all store data
  clearStore: () => void;
};

export const useTokenStore = create<MainStore>()(
  persist(
    (set) => ({
      verifyToken: null,
      accessToken: null,
      globalUser: null,

      setGlobalUser: (detail) => {
        set({ globalUser: detail });
        if (detail) localStorage.setItem("isOnboarded", JSON.stringify(detail.isOnBoarded));
      },

      setVerifyToken: (token) => set({ verifyToken: token }),

      setAccessToken: (token) => {
        set({ accessToken: token });
        if (token) localStorage.setItem("access-token", token);
      },

      clearAccessToken: () => {
        set({ accessToken: null });
        localStorage.removeItem("access-token");
      },

      clearVerifyToken: () => set({ verifyToken: null }),

      clearGlobalUser: () => {
        set({ globalUser: null });
        localStorage.removeItem("isOnboarded");
      },

      // Utility function to clear all data
      clearStore: () => {
        set({ verifyToken: null, globalUser: null });
        localStorage.removeItem("access-token");
        localStorage.removeItem("isOnboarded");
      },
    }),
    {
      name: "auth-storage", // Updated name to reflect both token and user storage

      storage: createJSONStorage(() => localStorage),

      // Specify which parts of the state to persist
      partialize: (state) => ({
        verifyToken: state.verifyToken,
        globalUser: state.globalUser,
        accessToken: state.accessToken,
      }),
    }
  )
);

