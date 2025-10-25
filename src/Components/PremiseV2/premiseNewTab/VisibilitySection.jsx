// VisibilitySection Component
//
// Displays and manages the “Visible to” section of a premise — showing who can
// view the current premise and allowing the owner to edit visibility settings.
//
// ------------------------------------------------------------
// Overview
// ------------------------------------------------------------
// - Shows the list or label of users who can view the premise.
// - Allows the owner to open visibility settings via an edit icon.
// - Supports interactive tooltip for viewing long user lists.
// - Excludes the current user from the visible list when applicable.
//
// ------------------------------------------------------------
// Core Functionalities
// ------------------------------------------------------------
//
// 1. **Dynamic Visibility Label**
//    - `getFilterLabel()` determines what label or names to show based on `filter_flag`:
//        0 → “All Buddies”
//        1 → “Only Me”
//        2 → “Selected Users” (shows names with expandable tooltip)
//        3 → “Everyone”
//    //! Important: When `filter_flag` is 2, only selected users appear (excludes `currentUser`).
//
// 2. **Tooltip Behavior**
//    - Displays first 4–5 users inline; the rest appear inside a scrollable tooltip.
//    - Tooltip toggles open/close via “See more...” link.
//    - Automatically closes when clicking outside the tooltip area.
//
// 3. **Edit Visibility**
//    - Clicking the edit (`MdOutlineEdit`) icon triggers `handleVisibility()`
//      — typically opens a popup or modal for visibility settings.
//
// 4. **Ownership Restriction**
//    - The section is rendered **only if** the logged-in user is the premise owner.
//    //! Ensures that only owners can modify or view detailed visibility info.
//
// ------------------------------------------------------------
// Props Overview
// ------------------------------------------------------------
// - `premiseOwner`: Object containing the premise owner info.
// - `user`: Current logged-in user ID.
// - `visible_to`: Array of users who have permission to view the premise.
// - `currentUser`: Current user object used for filtering visibility.
// - `filter_flag`: Determines visibility level (All, Only Me, Selected, etc.).
// - `handleVisibility`: Function triggered when the edit icon is clicked.
//
// ------------------------------------------------------------
// Summary
// ------------------------------------------------------------
// `VisibilitySection` cleanly represents who can view a premise and gives owners
// a simple way to manage that access. It dynamically adjusts the view depending
// on visibility rules and user interactions.
//
// //! Key takeaway: This component ensures visibility data remains accurate,
//    interactive, and restricted to premise owners.

import { useEffect, useRef, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";

const VisibilitySection = ({
  premiseOwner,
  user,
  visible_to,
  currentUser,
  filter_flag,
  handleVisibility,
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const tooltipRef = useRef(null);
  const spanRef = useRef(null);

  // State to store the processed visible users for the tooltip
  const [processedVisibleUsers, setProcessedVisibleUsers] = useState([]);

  // Effect to update processed visible users when visible_to changes
  useEffect(() => {
    if (visible_to?.length) {
      // If filter_flag is 2, exclude currentUser from visible users
      const visibleUsers = visible_to.filter((v) => v?.id !== currentUser?.id);
      setProcessedVisibleUsers(visibleUsers);
    }
  }, [visible_to, currentUser]); // Only run when visible_to or currentUser changes

  const getFilterLabel = () => {
    if (filter_flag === 0) {
      return "All Buddies";
    } else if (filter_flag === 1) {
      return "Only Me";
    } else if (filter_flag === 2) {
      if (processedVisibleUsers?.length > 0) {
        const displayedUsers = processedVisibleUsers.slice(0, 4); // Only show first 5 users
        const remainingUsers = processedVisibleUsers.slice(5); // Remaining users

        const displayedNames = displayedUsers
          .map((v) => {
            // If first_name exists, use it, otherwise use the email
            if (v?.first_name) {
              return `${v?.first_name} ${v?.last_name}`;
            } else {
              const emailParts = v?.email?.split("@");
              return emailParts ? emailParts[0] : "No Name Available";
            }
          })
          .join(", ");

        return (
          <span
            ref={spanRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative"
          >
            {displayedNames}
            {processedVisibleUsers.length > 5 && !isTooltipOpen && (
              <span
                className="text-[#00c3ff] cursor-pointer see-more"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent clicking on names from toggling the dropdown
                  setIsTooltipOpen((prev) => !prev); // Toggle the tooltip visibility
                }}
              >
                , See more...
              </span>
            )}

            {isTooltipOpen && (
              <div
                ref={tooltipRef}
                className="absolute bg-white text-[#00c3ff] h-[280px] overflow-y-auto p-2 border border-gray-300 rounded shadow-lg z-10 min-w-[170px] top-full left-0 mt-2"
              >
                <ul>
                  {remainingUsers.map((v, index) => (
                    <li key={index}>
                      {v?.first_name
                        ? `${v?.first_name} ${v?.last_name}`
                        : `${v?.email?.split("@")[0] || "No Name Available"}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </span>
        );
      } else {
        return "No one";
      }
    } else if (filter_flag === 3) {
      return "Everyone";
    } else {
      return "Everyone";
    }
  };

  // Close the tooltip if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        !spanRef.current.contains(event.target)
      ) {
        setIsTooltipOpen(false);
      }
    };

    // Adding the event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    premiseOwner?.id === user && (
      <div className="mt-1">
        <div className="w-full flex justify-between items-center">
          <p className="text-[#616161] font-bold text-[16px] leading-6">
            Visible to
          </p>
          <MdOutlineEdit
            onClick={handleVisibility}
            className="text-[#00c3ff] cursor-pointer"
          />
        </div>
        <div className="w-[96% mx-auto] bg-[#eaeaea] h-[1px] mt-1" />
        <p className="text-[#00c3ff] text-[16px] font-[500] leading-6 capitalize">
          {getFilterLabel()}
        </p>
      </div>
    )
  );
};

export default VisibilitySection;
