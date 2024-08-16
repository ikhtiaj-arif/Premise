import React, { createContext } from "react";

const GlobalContext = createContext();


const GlobalProvider = ({ children }) => {



    // const user = useSelector((state) => state?.user?.id);

    // const {
    //     data: likedUsersList,
    //     isLoading,
    //     refetch: likedUserRefetch,
    //   } = useGetLikesByPremiseIdQuery(user);

    // const [isLiked, setIsLiked] = useState()
    // useEffect(() => {
    //     if (likedUsersList?.results) {
    //       const likedUsersIds = likedUsersList.results.map(user => user?.user?.id);
    //       if (likedUsersIds.includes(user)) {
    //         setIsLiked(true);
    //       } else {
    //         setIsLiked(false);
    //       }
    //     }
    //   }, [likedUsersList, user?.id]);

  const contextValue = {
    // isLiked, setIsLiked
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };

