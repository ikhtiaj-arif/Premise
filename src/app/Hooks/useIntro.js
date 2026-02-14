// src/hooks/useIntro.js
import introJs from "intro.js";
import "intro.js/introjs.css";

/**
 * useIntro
 * - returns startIntro(steps, options, onBeforeStart)
 * - useful to start the tour from code (for example on mount or after opening a panel)
 */
export default function useIntro() {
  const startIntro = async (steps = [], options = {}, onBeforeStart) => {
    try {
      if (typeof onBeforeStart === "function") {
        await onBeforeStart();
        await new Promise((r) => setTimeout(r, 150));
      }
      introJs()
        .setOptions({
          steps,
          ...options,
        })
        .start();
    } catch (err) {
      // console.warn("Intro start error", err);
    }
  };

  return { startIntro };
}
