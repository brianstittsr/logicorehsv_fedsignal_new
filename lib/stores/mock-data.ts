import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MockDataState {
  showMockData: boolean;
  setShowMockData: (value: boolean) => void;
}

export const useMockDataStore = create<MockDataState>()(
  persist(
    (set) => ({
      showMockData: true,
      setShowMockData: (value) => set({ showMockData: value }),
    }),
    { name: "fedsignal-mock-data" }
  )
);
