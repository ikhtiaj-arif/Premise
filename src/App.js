import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Premisepool from "./Components/Premisepool/Premisepool";

export const MyContext = createContext();

function App() {
  const [searchAuthor, setSearchAuthor] = useState(null);
  const [isAddNew, setIsAddNew] = useState(false);
  const [activeAddedByMe, setActiveAddedByMe] = useState(false);
  const [addedByMeCondition, setAddedByMeCondition] = useState(false);
  const [searchText, setSearchText] = useState("");
  const user = useSelector((state) => state?.user?.id);

  
useEffect(()=>{
  if(activeAddedByMe){
    // setSearchAuthor(user)
    console.log(user);
  }

},[activeAddedByMe, user])

  const value = {
    activeAddedByMe,
    setActiveAddedByMe,
    isAddNew,
    setIsAddNew,
    addedByMeCondition,
    setAddedByMeCondition,
    searchText, setSearchText,searchAuthor, setSearchAuthor
  };

  return (
    <div className=" text-xl overflow-x-hidden">
      <MyContext.Provider value={value}>
        <Routes>
          <Route path="/" element={<Premisepool />}></Route>
          <Route path="/premise-pool" element={<Premisepool />}></Route>
          <Route path="/:__id" element={<Premisepool />}></Route>
          <Route path="/premise-pool/:__id" element={<Premisepool />}></Route>
        </Routes>
      </MyContext.Provider>

      <ToastContainer style={{ zIndex: "1000" }} />
    </div>
  );
}

export default App;
