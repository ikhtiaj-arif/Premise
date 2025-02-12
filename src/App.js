import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useGetMyAllProjectQuery } from "./app/EndPoints/ScriptPad/project";
import PremiseNewTab from "./Components/PremiseV2/premiseNewTab/PremiseNewTab";
import Premisepool from "./Components/Premisepool/Premisepool";
import PremiseV2 from "./Components/PremiseV2/Premsie.v2";
import { URL } from "./Components/utils";


export const MyContext = createContext();

function App() {
  const {
    data: allspProjectJSON,
    isLoading: isProjectLoading,
    refetch: projectRefetch,
  } = useGetMyAllProjectQuery();

  const [searchAuthor, setSearchAuthor] = useState(null);
  const [isAddNew, setIsAddNew] = useState(false);
  const [activeAddedByMe, setActiveAddedByMe] = useState(false);
  const [addedByMeCondition, setAddedByMeCondition] = useState(false);
  const [selectedPremiseObj, setSelectedPremiseObj] = useState(null);
  const [searchText, setSearchText] = useState("");
  const user = useSelector((state) => state?.user);
  const [selectedSpProjectID, setSelectedSpProjectID] = useState("");
  const [createdSpProjectID, setCreatedSpProjectID] = useState("");
  const [selectedPremiseSpProjectId, setSelectedPremiseSpProjectId] =
    useState("");
  const [selectedLanguages, setSelectedLanguages] = useState(null);

  const [lastLevelReplyId, setLastLevelReplyId] = useState("");

  const [transPopup, setTransPopup] = useState(false);

  const [openPop, setOpenPop] = useState(false);

  // const [isFirstCommentSuggested, setIsFirstCommentSuggested] = useState(false);

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
  }, [activeAddedByMe, user?.id]);

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
    setCurrentlyOpenedCommentID,user,
    // isFirstCommentSuggested,
    // setIsFirstCommentSuggested,
    // openPop, setOpenPop
  };

  // console.log("currentlyOpenedCommentID", currentlyOpenedCommentID);

  return (
    <div className=" text-xl overflow-x-hidden">
      <MyContext.Provider value={value}>
      {/* <TLanguageSelector /> */}
        <Routes>
          <Route path="/" element={<Premisepool />}></Route>
          <Route path="/premise-pool-v2" element={<PremiseV2 />}></Route>
          <Route path="/premise-pool-v2/payment" element={<PremiseV2 />}></Route>
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

export const  fetchUserAccess = (flag, state, userId,api)=> {
  try { //pay/checkuseraccess/${userId}/${flag}
    fetch(`${URL}/${api}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`userAccess ${flag}`, data);
        if (data) {
          //sessionStorage.setItem(flag, data?.access);
          state(data);
        }
      });
  } catch (error) {
    console.log("userAccess error", error);
  }
}
