import { create } from "zustand";
import { persist } from "zustand/middleware";

type Density = "comfortable" | "compact";

type PreferencesState = {
  density: Density;
  setDensity: (density: Density) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      density: "comfortable",
      setDensity: (density) => set({ density }),
    }),
    {
      name: "template-preferences",
    },
  ),
);
