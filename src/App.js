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

function App() {
  const {
    data: allspProjectJSON,
    isLoading: isProjectLoading,
    refetch: projectRefetch,
  } = useGetMyAllProjectQuery();

  const [counts, setCounts] = useState({});

  const [searchAuthor, setSearchAuthor] = useState(null);
  const [isAddNew, setIsAddNew] = useState(false);
  const [activeAddedByMe, setActiveAddedByMe] = useState(false);
  const [addedByMeCondition, setAddedByMeCondition] = useState(false);
  const [selectedPremiseObj, setSelectedPremiseObj] = useState(null);
  const [searchText, setSearchText] = useState("");
  const currentUser = useSelector((state) => state?.user);
  const [selectedSpProjectID, setSelectedSpProjectID] = useState("");
  const [createdSpProjectID, setCreatedSpProjectID] = useState("");
  const [selectedPremiseSpProjectId, setSelectedPremiseSpProjectId] =
    useState("");
  const [selectedLanguages, setSelectedLanguages] = useState(null);

  const [lastLevelReplyId, setLastLevelReplyId] = useState("");

  const [transPopup, setTransPopup] = useState(false);

  const [openPop, setOpenPop] = useState(false);

  const [availableForTranslation, setAvailableForTranslation] = useState(false);
  const [availableForSale, setAvailableForSale] = useState(false);

  const [currentlyOpenedCommentID, setCurrentlyOpenedCommentID] = useState("");
  // console.log("selectedPremiseObj Lnt",selectedPremiseObj);

  const allProjects = allspProjectJSON?.projects;
  const filterdAllProjects = allspProjectJSON?.projects?.filter(
    (item) => !item.locked
  );

  useEffect(() => {
    if (activeAddedByMe) {
      // setSearchAuthor(user?.id)
      // console.log(user?.id);
    }
  }, [activeAddedByMe, currentUser?.id]);

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
    currentlyOpenedCommentID,
    setCurrentlyOpenedCommentID,
    currentUser,
    counts,
    setCounts,
    availableForTranslation,
    availableForSale,
    setAvailableForSale,
    setAvailableForTranslation,
    // isFirstCommentSuggested,
    // setIsFirstCommentSuggested,
    // openPop, setOpenPop
  };

  // console.log("currentlyOpenedCommentID", currentlyOpenedCommentID);

  return (
    // overflow-x hidden is removed from this div
    <div className="text-xl">
      <MyContext.Provider value={value}>
        {/* <TLanguageSelector /> */}
        <Routes>
          {/* <Route path="/" element={<Premisepool />}></Route> */}
          <Route path="/" element={<PremiseV2 />}></Route>
          <Route
            path="/payment"
            element={<LimitPaymentPage />}
          ></Route>
          {/* <Route path="/premise-pool-v2" element={<PremiseV2 />}></Route>
          <Route
            path="/premise-pool-v2/payment"
            element={<LimitPaymentPage />}
          ></Route> */}
          <Route path="/new-tab/:id" element={<PremiseNewTab />}></Route>
          <Route path="/:__id/:service" element={<Premisepool />}></Route>
          <Route path="/:__id/:service" element={<Premisepool />}></Route>
        </Routes>
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

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
