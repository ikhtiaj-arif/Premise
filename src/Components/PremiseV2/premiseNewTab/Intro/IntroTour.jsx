// src/components/IntroTour.jsx
import React from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";

/**
 * IntroTour
 * - props.steps: array of steps for intro.js
 * - props.options: intro.js options
 * - props.buttonLabel: label for the built-in start button (optional)
 * - props.onBeforeStart: optional function executed before starting (useful to open panels)
 */
export default function IntroTour({
  steps = [],
  options = {},
  buttonLabel = "Show tour",
  onBeforeStart,
  className = "",
}) {
  const start = async () => {
    try {
      if (typeof onBeforeStart === "function") {
        // allow caller to prepare UI (open sidebars, reveal elements, etc.)
        await onBeforeStart();
        // small delay to let UI open (tweak if needed)
        await new Promise((r) => setTimeout(r, 150));
      }

      introJs()
        .setOptions({
          steps,
          ...options,
        })
        .start();
    } catch (err) {
      // swallow errors gracefully
      // console.error("Intro start error:", err);
    }
  };

  return (
    <button
      onClick={start}
      className={`px-3 py-1 rounded-md text-sm font-medium ${className}`}
      type="button"
    >
      {buttonLabel}
    </button>
  );
}
