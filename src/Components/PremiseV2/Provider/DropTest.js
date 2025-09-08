import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";
import { useLocation } from "react-router-dom";

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
      <h4 className="text-seaGreen text-lg font-bold mb-2">{step.title}</h4>

      <div className="text-gray-700 mb-4">
        {typeof step.content === "string" ? <p>{step.content}</p> : step.content}
      </div>

      {step.image && (
        <div className="mb-4">
          <img
            src={step.image}
            alt="Tooltip Illustration"
            className="w-full rounded-md object-contain"
          />
        </div>
      )}

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
            className="px-3 py-1 rounded text-gray-500 hover:text-gray-700"
            aria-label="Skip Step"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SidebarTour() {
  const location = useLocation();

  const stepSets = {
    dashboard: [
      {
        target: ".dashboard-title",
        title: "Welcome to your Dashboard",
        content: "This is where everything starts.",
        image: "https://via.placeholder.com/300x150?text=Dashboard+Image",
        disableBeacon: true,
      },
      {
        target: ".dashboard-stats",
        title: "Performance Stats",
        content: "Here you can see your performance stats in real time.",
        disableBeacon: true,
      },
      {
        target: ".dashboard-actions",
        title: "Quick Actions",
        content: "Use these actions to quickly manage your work.",
        disableBeacon: true,
      },
    ],
    settings: [
      {
        target: ".settings-title",
        title: "Application Settings",
        content: "These are your application settings.",
        disableBeacon: true,
      },
      {
        target: ".settings-form",
        title: "Preferences",
        content: "Update your preferences here to customize your experience.",
        disableBeacon: true,
        image: "https://via.placeholder.com/300x150?text=Settings+Image",
      },
      {
        target: ".settings-save",
        title: "Save Changes",
        content: "Don't forget to save your changes!",
        disableBeacon: true,
      },
    ],
    profile: [
      {
        target: ".profile-title",
        title: "Profile Page",
        content: "This is your profile page.",
        disableBeacon: true,
      },
      {
        target: ".profile-info",
        title: "Personal Details",
        content: "View and edit your personal details here.",
        disableBeacon: true,
      },
      {
        target: ".profile-activity",
        title: "Recent Activity",
        content: "See your recent activity here.",
        disableBeacon: true,
      },
    ],
    reports: [
      {
        target: ".reports-title",
        title: "Reports Section",
        content: "Access all reports here.",
        disableBeacon: true,
      },
      {
        target: ".reports-filters",
        title: "Filter Reports",
        content: "Filter reports by date, category, or type.",
        disableBeacon: true,
      },
      {
        target: ".reports-export",
        title: "Export Reports",
        content: "Export reports in multiple formats.",
        disableBeacon: true,
      },
    ],
    help: [
      {
        target: ".help-title",
        title: "Help Center",
        content: "Need help? You’re in the right place.",
        disableBeacon: true,
      },
      {
        target: ".help-faq",
        title: "FAQs",
        content: "Read FAQs to solve common issues.",
        disableBeacon: true,
      },
      {
        target: ".help-contact",
        title: "Contact Support",
        content: "Contact support if you need more help.",
        disableBeacon: true,
      },
    ],
  };

  const [steps, setSteps] = useState([]);
  const [run, setRun] = useState(false);

  const [completedTours, setCompletedTours] = useState({
    dashboard: false,
    settings: false,
    profile: false,
    reports: false,
    help: false,
  });

  const handleSidebarClick = (option) => {
    if (completedTours[option]) return;
    setSteps(stepSets[option]);
    setRun(false);
    setTimeout(() => setRun(true), 500);
  };

  const handleJoyrideCallback = (data) => {
    const { status, action, index } = data;
    const finishedStatuses = ["finished", "skipped"];

    if (finishedStatuses.includes(status)) {
      const currentKey = Object.keys(stepSets).find(
        (key) => stepSets[key] === steps
      );
      if (currentKey) {
        setCompletedTours((prev) => ({
          ...prev,
          [currentKey]: true,
        }));
      }
      setRun(false);
      return;
    }

    // When clicking the target element, advance or finish
    if (action === "spotlightClick") {
      if (index + 1 < steps.length) {
        // Do nothing, Joyride will auto-advance on spotlightClick with continuous=true
      } else {
        // Last step clicked: finish the tour
        setRun(false);
      }
    }
  };

  useEffect(() => {
    if (location.pathname === "/testing2" && !completedTours.dashboard) {
      handleSidebarClick("dashboard");
    }
  }, [location.pathname]);

  return (
    <div className="flex h-[calc(100vh-100px)]">
      {/* Sidebar */}
      <div className="w-52 bg-gray-100 p-5 flex flex-col gap-2">
        {Object.keys(stepSets).map((option) => (
          <button
            key={option}
            onClick={() => handleSidebarClick(option)}
            className="text-left px-3 py-2 rounded"
          >
            {option.charAt(0).toUpperCase() + option.slice(1)} Tour{" "}
            {completedTours[option] && "✅"}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-auto">
        {/* Dashboard */}
        <h1 className="dashboard-title text-2xl font-semibold">Dashboard</h1>
        <div className="dashboard-stats bg-gray-300 p-3 mt-2 rounded">
          Dashboard Stats
        </div>
        <div className="dashboard-actions bg-gray-400 p-3 mt-3 rounded">
          Quick Actions
        </div>

        {/* Settings */}
        <h1 className="settings-title text-2xl font-semibold mt-12">
          Settings
        </h1>
        <div className="settings-form bg-gray-200 p-3 mt-2 rounded">
          Settings Form
        </div>
        <div className="settings-save bg-gray-300 p-3 mt-3 rounded">
          Save Button
        </div>

        {/* Profile */}
        <h1 className="profile-title text-2xl font-semibold mt-12">Profile</h1>
        <div className="profile-info bg-gray-300 p-3 mt-2 rounded">
          Profile Info
        </div>
        <div className="profile-activity bg-gray-400 p-3 mt-3 rounded">
          Recent Activity
        </div>

        {/* Reports */}
        <h1 className="reports-title text-2xl font-semibold mt-12">Reports</h1>
        <div className="reports-filters bg-gray-300 p-3 mt-2 rounded">
          Report Filters
        </div>
        <div className="reports-export bg-gray-400 p-3 mt-3 rounded">
          Export Reports
        </div>

        {/* Help */}
        <h1 className="help-title text-2xl font-semibold mt-12">Help</h1>
        <div className="help-faq bg-gray-200 p-3 mt-2 rounded">FAQ Section</div>
        <div className="help-contact bg-gray-300 p-3 mt-3 rounded">
          Contact Support
        </div>
      </div>

      {/* Joyride */}
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        spotlightClicks
        callback={handleJoyrideCallback}
        tooltipComponent={CustomTooltip}
        styles={{
          options: {
            zIndex: 10000,
            borderRadius: 12,
            padding: 0,
          },
        }}
      />
    </div>
  );
}
