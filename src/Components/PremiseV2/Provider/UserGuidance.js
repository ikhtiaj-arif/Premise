import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { stepSets } from "./joyrideSteps";
function CustomTooltip({
  step,
  index,
  size,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  skipProps,
}) {
  return (
    <div
      {...tooltipProps}
      className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-left z-50"
    >
      <h4 className="text-seaGreen text-md font-bold mb-2">{step.title}</h4>

      {/* <div className="text-gray-700 mb-4">
        {typeof step.content === "string" ? (
          <p>{step.content}</p>
        ) : (
          step.content
        )}
      </div> */}

      {/* {step.image && (
        <div className="mb-4">
          <img
            src={step.image}
            alt="Tooltip Illustration"
            className="w-full rounded-md object-contain"
          />
        </div>
      )} */}

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Step {index + 1} of {size}
        </span>
        <div className="space-x-2">
          {index > 0 && (
            <button
              {...backProps}
              className="px-3 py-1 rounded border border-seaGreen text-seaGreen hover:bg-blue-100"
            >
              Back
            </button>
          )}
          <button
            {...primaryProps}
            className="px-3 py-1 rounded bg-seaGreen text-white"
          >
            {index + 1 === size ? "Finish" : "Next"}
          </button>
          <button
            {...skipProps}
            className="px-3 py-1 rounded text-white bg-[#33b0ca] hover:text-gray-700"
            aria-label="Skip Step"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

const UserGuidance = ({ children }) => {
  const location = useLocation();
  const [steps, setSteps] = useState([]);
  const [run, setRun] = useState(false);
  const [completedTours, setCompletedTours] = useState(() => {
    // Load from localStorage or use defaults
    return (
      JSON.parse(localStorage.getItem("completedUserGuide")) || {
        addPremiseButton: false,
      }
    );
  });

  function fixScrollableDivOverflow() {
    const scrollableDiv = document.getElementById("scrollableDiv");
    if (scrollableDiv && scrollableDiv.style.overflow === "initial") {
      scrollableDiv.style.overflow = "auto"; // or "scroll" if you prefer
    }
  }
  const handleSidebarClick = (option) => {
    if (completedTours[option]) return;

    const intervalId = setInterval(() => {
      if (document.querySelector(stepSets[option][0].target)) {
        clearInterval(intervalId);
        setSteps(stepSets[option]);
        setRun(false);
        setTimeout(() => setRun(true), 500);
      }
    }, 500);
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = ["finished", "skipped"];

    if (finishedStatuses.includes(status)) {
      const currentKey = Object.keys(stepSets).find(
        (key) => stepSets[key] === steps
      );
      if (currentKey) {
        setCompletedTours((prev) => {
          const updated = { ...prev, [currentKey]: true };
          localStorage.setItem("completedUserGuide", JSON.stringify(updated));
          return updated;
        });
      }
      setRun(false);
    }
  };
  useEffect(() => {
    if (location.pathname === "/" && !completedTours.dashboard) {
      handleSidebarClick("addPremiseButton");
    }
    // if (location.pathname === "/interestskills" && !completedTours.dashboard) {
    //   handleSidebarClick("interestskills");
    // }
  }, [location.pathname]);

  // Also run fix on tour start or steps change to ensure scroll stays enabled
  // useEffect(() => {
  //   if (run) {
  //     fixScrollableDivOverflow();
  //   }
  // }, [run]);

  // Optional: MutationObserver to catch changes dynamically and fix immediately
  // useEffect(() => {
  //   const scrollableDiv = document.getElementById("scrollableDiv");
  //   if (!scrollableDiv) return;

  //   const observer = new MutationObserver(() => {
  //     if (scrollableDiv.style.overflow === "initial") {
  //       scrollableDiv.style.overflow = "auto";
  //     }
  //   });

  //   observer.observe(scrollableDiv, {
  //     attributes: true,
  //     attributeFilter: ["style"],
  //   });

  //   return () => observer.disconnect();
  // }, []);
 
  return (
    <>
      {/* Joyride */}
      {/* <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        // callback={handleJoyrideCallback}
        tooltipComponent={CustomTooltip}
        disableScrolling={true}
        spotlightClicks={true}
      /> */}
      {children}
    </>
  );
};

export default UserGuidance;
