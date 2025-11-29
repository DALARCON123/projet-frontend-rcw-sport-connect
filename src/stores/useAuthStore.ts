import { create } from "zustand";

interface UserProfile {
  name?: string;
  email?: string;
  age?: number;
  weight?: number;
  height?: number;
  mainGoal?: string;
  lang?: string;
}

interface AuthState {
  token: string | null;
  userProfile: UserProfile | null;

  setToken: (token: string | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserField: (field: keyof UserProfile, value: any) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token") ?? null,
  userProfile: null,

  setToken: (token) => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
    set({ token });
  },

  setUserProfile: (profile) => set({ userProfile: profile }),

  updateUserField: (field, value) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        [field]: value,
      },
    })),

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, userProfile: null });
  },
}));

export default useAuthStore;
