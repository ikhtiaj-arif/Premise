import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useGetMyAllProjectQuery } from "./app/EndPoints/ScriptPad/project";
import LimitPaymentPage from "./Components/Payment/LimitPaymentPage";
import Premisepool from "./Components/Premisepool/Premisepool";
import PremiseNewTab from "./Components/PremiseV2/premiseNewTab/PremiseNewTab";
import PremiseV2 from "./Components/PremiseV2/Premsie.v2";
import { URL } from "./Components/utils";

export const MyContext = createContext();
export const TranslationContext = createContext(); // Added global translation context

function App() {
  const { data: allspProjectJSON, refetch: projectRefetch } = useGetMyAllProjectQuery();
  const currentUser = useSelector((state) => state?.user);

  const [counts, setCounts] = useState({});
  const [searchAuthor, setSearchAuthor] = useState(null);
  const [isAddNew, setIsAddNew] = useState(false);
  const [activeAddedByMe, setActiveAddedByMe] = useState(false);
  const [addedByMeCondition, setAddedByMeCondition] = useState(false);
  const [selectedPremiseObj, setSelectedPremiseObj] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedSpProjectID, setSelectedSpProjectID] = useState("");
  const [createdSpProjectID, setCreatedSpProjectID] = useState("");
  const [selectedPremiseSpProjectId, setSelectedPremiseSpProjectId] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState(null);
  const [transPopup, setTransPopup] = useState(false);
  const [availableForTranslation, setAvailableForTranslation] = useState(false);
  const [availableForSale, setAvailableForSale] = useState(false);
  const [currentlyOpenedCommentID, setCurrentlyOpenedCommentID] = useState(null);
  
  // Global state for managing which comment dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const allProjects = allspProjectJSON?.projects;
  const filterdAllProjects = allspProjectJSON?.projects?.filter((item) => !item.locked);



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
    projectRefetch,
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
  };

  return (
    <div className="text-xl">
      <MyContext.Provider value={value}>
        <TranslationContext.Provider value={{ openDropdownId, setOpenDropdownId }}>
          <Routes>
            <Route path="/" element={<PremiseV2 />} />
            <Route path="/payment" element={<LimitPaymentPage />} />
            <Route path="/new-tab/:id" element={<PremiseNewTab />} />
            <Route path="/:__id/:service" element={<Premisepool />} />
          </Routes>
        </TranslationContext.Provider>
      </MyContext.Provider>
      <ToastContainer style={{ zIndex: "1000" }} />
    </div>
  );
}

export default App;

export const fetchUserAccess = async (flag) => {
  try {
    const response = await fetch(`${URL}/pay/checkuseraccess/${flag}`, {
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