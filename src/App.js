/** 
 * App.jsx – Core Application Entry Point for PremisePool
 * -----------------------------------------------------
 * This component initializes the global context providers, manages global UI effects,
 * and defines the top-level route structure for the entire application.
 *
 * Major Responsibilities:
 * ------------------------
 //! 1.Context Management 
 *    - Provides a global `MyContext` for managing shared app-wide states such as:
 *      - Selected premise/project
 *      - Search filters and user preferences
 *      - Popup and onboarding flow control
 *      - Translation and sale availability states
 *    - Provides a `TranslationContext` to manage open translation dropdowns across components.
 *
 * 2.  UI Enhancements 
 *    - Dynamically applies custom scrollbar hover effects to all scrollable elements.
 *      This is achieved via a MutationObserver that continuously monitors the DOM
 *      for new scrollable containers and enhances their scrollbar UX.
 *
 * 3.  User Guidance & Onboarding 
 *    - Implements a multi-step user guidance popup system.
 *      The system uses `localStorage` to remember the user's progress
 *      (e.g., which popup step they are currently on) and whether they’ve
 *      chosen not to see guidance popups again.
 *
 * 4.  Persistent and Session-Based State Handling 
 *    - Loads saved popup progress and feature usage counts from localStorage/sessionStorage
 *      to persist state between page reloads.
 *
 * 5.  Event and UI Behavior Management 
 *    - Automatically closes translator dropdowns when clicking outside.
 *    - Ensures open/close states of popups and dropdowns are managed globally.
 *
 * 6.  Data Fetching 
 *    - Uses RTK Query’s `useGetMyAllProjectQuery` to fetch all ScriptPad projects
 *      for the authenticated user.
 *    - Filters locked projects for use throughout the app.
 *
 * 7.  Routing 
 *    - Defines core routes using React Router:
 *        `/`                → Main Premise view (PremiseV2)
 *        `/payment`         → Payment Limit page
 *        `/new-tab/:id`     → Secure premise access checker for new tabs
 *        `/premise_view`    → Single premise view page
 *        `/:__id/:service`  → Dynamic service-based premise view
 *    - Wraps routes with `UserGuidance` for consistent onboarding overlays.
 *
 * 8.  Notifications 
 *    - Integrates `react-toastify` to display global toast notifications
 *      with proper stacking and z-index control.
 *
 * 9.  Authentication Utilities 
 *    - Exports a helper function `fetchUserAccess(flag)` that checks user access
 *      permissions for specific functionalities through authenticated API requests.
 *

 * This file serves as the  root controller  of the PremisePool frontend application.
 * It unifies user experience, data flow, and contextual state under a clean, maintainable,
 * and reactive structure that scales with new features while maintaining smooth UX.
 */

import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useGetMyAllProjectQuery } from "./app/EndPoints/ScriptPad/project";
import LimitPaymentPage from "./Components/Payment/LimitPaymentPage";
import PremiseNewTabAccessChecker from "./Components/PremiseV2/premiseNewTab/PremiseNewTabAccessChecker";
import UserGuidance from "./Components/PremiseV2/Provider/UserGuidance";
import { baseURL } from "./Components/utils";

export const MyContext = createContext();
export const TranslationContext = createContext(); // Added global translation context

function App() {
  useEffect(() => {
    const addScrollbarEffect = (el) => {
      let hoverTimeout;

      const onMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const nearRight = e.clientX >= rect.right - 20;
        const nearBottom = e.clientY >= rect.bottom - 20;

        const needsVertical = el.scrollHeight > el.clientHeight;
        const needsHorizontal = el.scrollWidth > el.clientWidth;

        if ((needsVertical && nearRight) || (needsHorizontal && nearBottom)) {
          el.classList.add("scrollbar-active");
        } else {
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            el.classList.remove("scrollbar-active");
          }, 100);
        }
      };

      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseleave", () =>
        el.classList.remove("scrollbar-active")
      );
    };

    const applyToScrollables = () => {
      document.querySelectorAll("*").forEach((el) => {
        const style = getComputedStyle(el);
        const overflowY = style.overflowY;
        const overflowX = style.overflowX;

        const hasScrollY =
          (overflowY === "scroll" || overflowY === "auto") &&
          el.scrollHeight > el.clientHeight;
        const hasScrollX =
          (overflowX === "scroll" || overflowX === "auto") &&
          el.scrollWidth > el.clientWidth;

        if (hasScrollY || hasScrollX) {
          addScrollbarEffect(el);
        }
      });
    };

    applyToScrollables();
    const observer = new MutationObserver(applyToScrollables);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const { data: allspProjectJSON, refetch: projectRefetch } =
    useGetMyAllProjectQuery();

  const currentUser = useSelector((state) => state?.user);

  const [counts, setCounts] = useState({});
  const [searchAuthor, setSearchAuthor] = useState(null);
  const [isAddNew, setIsAddNew] = useState(false);
  const [activeAddedByMe, setActiveAddedByMe] = useState(false);
  const [addedByMeCondition, setAddedByMeCondition] = useState(false);
  const [selectedPremiseObj, setSelectedPremiseObj] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedSpProjectID, setSelectedSpProjectID] = useState("");
  const [selectedSpProjectLanguage, setSelectedSpProjectLanguage] =
    useState("");
  const [createdSpProjectID, setCreatedSpProjectID] = useState("");
  const [selectedPremiseSpProjectId, setSelectedPremiseSpProjectId] =
    useState("");
  const [selectedLanguages, setSelectedLanguages] = useState(null);
  const [transPopup, setTransPopup] = useState(false);
  const [availableForTranslation, setAvailableForTranslation] = useState(false);
  const [availableForSale, setAvailableForSale] = useState(false);
  const [currentlyOpenedCommentID, setCurrentlyOpenedCommentID] =
    useState(null);
  const [openSequalPop, setOpenSequalPop] = useState(true);

  // Global state for managing which comment dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const allProjects = allspProjectJSON?.projects;
  const filterdAllProjects = allspProjectJSON?.projects?.filter(
    (item) => !item.locked
  );

  const [currentPopup, setCurrentPopup] = useState(1); // Default to popup 1
  const totalPopups = 15;

  useEffect(() => {
    // Retrieve the saved popup number from localStorage
    const savedPopupNumber = parseInt(localStorage.getItem("popupNumber"), 10);

    if (savedPopupNumber && savedPopupNumber <= totalPopups) {
      setCurrentPopup(savedPopupNumber); // Set the popup state based on saved value
    }
  }, []);

  const incrementPopup = () => {
    const nextPopup = currentPopup + 1;
    if (nextPopup <= totalPopups) {
      localStorage.setItem("popupNumber", nextPopup); // Store next popup number
      setCurrentPopup(nextPopup); // Update state
    }
  };
  const decrementPopup = () => {
    const nextPopup = currentPopup - 1;
    if (nextPopup >= 1) {
      // Ensure the popup number doesn't go below 1
      localStorage.setItem("popupNumber", nextPopup); // Store next popup number
      setCurrentPopup(nextPopup); // Update state
    }
  };

  const resetPopups = () => {
    localStorage.removeItem("popupNumber"); // Reset saved popup number
    setCurrentPopup(1); // Reset state to first popup
  };

  const setDoNotShowAgain = () => {
    localStorage.setItem("doNotShowBubblePopup", "true");
  };

  const removeDoNotShowAgain = () => {
    localStorage.removeItem("doNotShowBubblePopup");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".translator-dropdown")) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const storedCounts = sessionStorage.getItem("pp_limit_counts");
    if (storedCounts) {
      setCounts(JSON.parse(storedCounts));
    }
  }, []);

  //console.log('current user',currentUser);

  const value = {
    activeAddedByMe,
    setActiveAddedByMe,
    isAddNew,
    setIsAddNew,
    addedByMeCondition,
    setAddedByMeCondition,
    searchText,
    setSearchText,
    searchAuthor,
    setSearchAuthor,
    allspProjectJSON,
    projectRefetch,
    filterdAllProjects,
    selectedPremiseObj,
    setSelectedPremiseObj,
    createdSpProjectID,
    setCreatedSpProjectID,
    selectedSpProjectID,
    setSelectedSpProjectID,
    selectedPremiseSpProjectId,
    setSelectedPremiseSpProjectId,
    transPopup,
    setTransPopup,
    allProjects,
    selectedLanguages,
    setSelectedLanguages,
    currentUser,
    counts,
    setCounts,
    availableForTranslation,
    availableForSale,
    setAvailableForSale,
    setAvailableForTranslation,
    currentlyOpenedCommentID,
    setCurrentlyOpenedCommentID,
    selectedSpProjectLanguage,
    setSelectedSpProjectLanguage,
    currentPopup,
    incrementPopup,
    resetPopups,
    setDoNotShowAgain,
    removeDoNotShowAgain,
    openSequalPop,
    setOpenSequalPop,
    decrementPopup,
  };

  return (
    <div className="text-xl">
      <MyContext.Provider value={value}>
        <TranslationContext.Provider
          value={{ openDropdownId, setOpenDropdownId }}
        >
          <UserGuidance>
            <Routes>
              <Route path="/:id" element={<PremiseNewTabAccessChecker />} />
              <Route path="/payment/:id" element={<LimitPaymentPage />} />

              {/*
              <Route path="/" element={<PremiseV2 />} />
              <Route
                path="/new-tab/:id"
                element={<PremiseNewTabAccessChecker />}
              />
          
              */}
               
            </Routes>
          </UserGuidance>
        </TranslationContext.Provider>
      </MyContext.Provider>
      <ToastContainer style={{ zIndex: "1000" }} />
    </div>
  );
}

export default App;

export const fetchUserAccess = async (flag) => {
  try {
    const response = await fetch(`${baseURL}/pay/user-product-access/?checkfunctionality=${flag}`, {
    // const response = await fetch(`${URL}/pay/checkuseraccess/${flag}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    return null;
  }
};
