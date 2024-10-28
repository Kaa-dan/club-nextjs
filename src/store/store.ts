import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// User type definition
type User = {
  email: string;
  onBoardingStage: string;
  isOnBoarded: boolean;
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

      setGlobalUser: (detail) => set({ globalUser: detail }),

      setVerifyToken: (token) => set({ verifyToken: token }),

      setAccessToken: (token) => set({ accessToken: token }),

      clearAccessToken: () => set({ accessToken: null }),

      clearVerifyToken: () => set({ verifyToken: null }),

      clearGlobalUser: () => set({ globalUser: null }),

      // Utility function to clear all data
      clearStore: () => set({ verifyToken: null, globalUser: null }),
    }),
    {
      name: "auth-storage", // Updated name to reflect both token and user storage

      storage: createJSONStorage(() => sessionStorage),

      // Specify which parts of the state to persist
      partialize: (state) => ({
        verifyToken: state.verifyToken,
        globalUser: state.globalUser,
        accessToken: state.accessToken
      }),
    }
  )
);
