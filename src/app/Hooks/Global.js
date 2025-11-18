import React, { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [charactersPopupMobile, setCharactersPopupMobile] = useState(false);

  function toggleCharactersPopup() {
    setCharactersPopupMobile((prev) => !prev);
  }


  const contextValue = {
    charactersPopupMobile,
    setCharactersPopupMobile,
    toggleCharactersPopup,
    // isLiked, setIsLiked
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
