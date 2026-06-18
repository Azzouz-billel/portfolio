import { create } from 'zustand'

/**
 * Shared scroll state. `progress` (0→1) is written from Lenis on every scroll
 * tick and read transiently inside the R3F render loop via `getState()`, so the
 * 3D scene reacts without triggering React re-renders. `section` tracks the
 * active section for nav highlighting.
 */
export const useScrollStore = create((set) => ({
  progress: 0,
  section: 'hero',
  setProgress: (progress) => set({ progress }),
  setSection: (section) => set({ section }),
}))
