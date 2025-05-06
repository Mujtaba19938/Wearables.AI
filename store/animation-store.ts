import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AnimationStyle = "particles" | "waves" | "geometric" | "constellation" | "minimal"

interface AnimationState {
  animationStyle: AnimationStyle
  setAnimationStyle: (style: AnimationStyle) => void
  cycleAnimationStyle: () => void
}

export const useAnimationStore = create<AnimationState>()(
  persist(
    (set, get) => ({
      animationStyle: "particles",
      setAnimationStyle: (style) => set({ animationStyle: style }),
      cycleAnimationStyle: () => {
        const currentStyle = get().animationStyle
        const styles: AnimationStyle[] = ["particles", "waves", "geometric", "constellation", "minimal"]
        const currentIndex = styles.indexOf(currentStyle)
        const nextIndex = (currentIndex + 1) % styles.length
        set({ animationStyle: styles[nextIndex] })
      },
    }),
    {
      name: "animation-style",
    },
  ),
)
