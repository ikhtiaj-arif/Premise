import axios from "axios";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserAccess, MyContext } from "../../App";
import {
  useGetHiddenPremiseCountQuery,
  useGetPremiseQuery,
  useGetPremiseUserQuery,
} from "../../app/EndPoints/premisePoolApi";
import { setUser } from "../../app/Slices/userSlice";
import headText from "../../img/headText.webp";
import walletDoodle from "../../img/wallet_doodle.webp";
import AddPremise2 from "../Premisepool/Components/AddPremise2";
import Popup from "../Premisepool/Popup";
import UserNamePopup from "../Premisepool/UserNamePopup";
import NoAccessLbPopUp from "../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../PricingModel/NoAccessPopUp";
import TypingLoader from "../TypingLoader";
import { baseURL } from "../utils";
import PremiseCardV2 from "./Card/PremiseCardV2";
import FilterSearchSort from "./Header/FiltersSearchSort/FilterSearchSort";
import NoPremisePop from "./Popups/alerts/NoPremisePop";
import PricingPopup from "./sequalPopup/PricingPopup";
import TestPopup from "./sequalPopup/TestPopup";

export const loadingData = [
  "Initializing..",
  "Creating Structures...",
  "Collecting Data...",
  "Analyzing Data...",
  "Finishing!...",
];

const PremiseV2 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [sortedData, setSortedData] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [showRefine, setShowRefine] = useState(false);
  const [draftOpenFromSp, setDraftOpenFromSp] = useState(false);
  const [previewAfterDraft, setPreviewAfterDraft] = useState(false);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const {
    isAddNew,
    activeAddedByMe,
    addedByMeCondition,
    setAddedByMeCondition,
    searchAuthor,
    setSearchAuthor,
    availableForSale,
    availableForTranslation,
    currentUser,
    openSequalPop,
    currentPopup,
  } = useContext(MyContext);

  const [isFirstCardBlinking, setIsFirstCardBlinking] = useState(false);
  const user = useSelector((state) => state?.user?.id);

  const dispatch = useDispatch();

  const [queryUser, setQueryUser] = useState(null);
  const [refetching, setRefetching] = useState(false);
  const [querying, setQuerying] = useState(true);
  const [skip, setSkip] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setSkip(false);
    else setSkip(true);
  }, [user]);

  // const [activeAddedByMe, setActiveAddedByMe] = useState(false);

  const [query, setQuery] = useState({
    pn: currentPage,
    ps: itemsToShow,
    sort: sortedData,
    order: sortOrder,
    text: text,
    user: queryUser,
    language: language,
    shared: addedByMeCondition,
    sale: availableForSale,
    translation: availableForTranslation,
  });

  useEffect(() => {}, [sortOrder, sortedData, itemsToShow, currentPage]);

  const id = useParams();

  useEffect(() => {
    if (activeAddedByMe && user) {
      setQueryUser(user);
    } else {
      setQueryUser(null);
    }
  }, [user, activeAddedByMe]);

  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();
  const {
    data: hiddenCountRes,
    countLoading,
    refetch: hiddenCountRefetch,
  } = useGetHiddenPremiseCountQuery(query, {
    skip,
  });

  const res = useGetPremiseQuery(query, {
    skip: !hiddenCountRes,
  });

  const { data: premiseData, isLoading, refetch } = res;

  const [openPopBySp, setOpenPopBySp] = useState(false);
  const [premiseDataForUser, setPremiseDataForUser] = useState([]);
  const [matchingPremiseData, setMatchingPremiseData] = useState({});
  const [formattedDate, setFormattedDate] = useState({});
  const [formattedTime, setFormattedTime] = useState({});
  const [stylings, setStylings] = useState();
  const [dText, setdText] = useState();
  // console.log(stylings);

  // console.log(matchingPremiseData);

  const token = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const xyz = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/ideamall/premise?current_user=${user}&user=${user}`,
        {
          headers: headers,
        }
      );
      const data = response?.data;

      setPremiseDataForUser(data?.results);
      return data;
    } catch (err) {}
  };

  // useEffect(() => {
  //   // console.log(id);
  //   if (id && id.service === "scriptpad") {
  //     xyz();
  //     const matchingPremiseData = premiseDataForUser?.find(
  //       (item) => item.id === id.__id
  //     );
  //     console.log(matchingPremiseData);
  //     if (matchingPremiseData) {
  //       setOpenPopBySp(true);
  //       setMatchingPremiseData(matchingPremiseData);
  //       const splitText = matchingPremiseData?.text?.split("+");
  //       const dText = splitText[1];
  //       const stylings = JSON?.parse(splitText[0]);

  //       // Format the created_date
  //       const formattedDate = new Date(
  //         matchingPremiseData?.created_at
  //       ).toLocaleDateString("en-US", {
  //         // timeZone: "GMT",
  //         timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //         // weekday: "short",
  //         day: "numeric",
  //         month: "short",
  //         year: "numeric",
  //       });
  //       setFormattedDate(formattedDate);

  //       const formattedTime = new Date(
  //         matchingPremiseData?.created_at
  //       ).toLocaleTimeString("en-US", {
  //         timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //         hour: "numeric",
  //         minute: "numeric",
  //       });
  //       setFormattedTime(formattedTime);

  //       setdText(dText);
  //       setStylings(stylings);
  //       navigate("/");
  //     }
  //     // setActiveAddedByMe(true);
  //   }
  // }, [id, premiseData]);
  const [hiddenPop, setHiddenPop] = useState(false);

  const fetchPremiseById = async () => {
    try {
      const response = await axios({
        url: `${baseURL}/ideamall/api/v2/premise/${id.__id}`,
        method: "GET",
        headers: headers,
      });

      const data = response?.data;
      console.log("fetched premise data", data);

      if (data) {
        if (data?.premiseOwner?.id !== user && data?.hidden) {
          setHiddenPop(true);
          return;
        }
        // if (data?.is_draft === true) {
        //   setDraftOpenFromSp(true);
        //   return;
        // }

        setOpenPopBySp(true);
        setMatchingPremiseData({ ...data, user });

        const splitText = data?.text?.split("+");
        const dText = splitText[1];
        const stylings = JSON?.parse(splitText[0]);

        const formattedDate = new Date(data?.created_at).toLocaleDateString(
          "en-US",
          {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        );
        setFormattedDate(formattedDate);

        const formattedTime = new Date(data?.created_at).toLocaleTimeString(
          "en-US",
          {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hour: "numeric",
            minute: "numeric",
          }
        );
        setFormattedTime(formattedTime);

        setdText(dText);
        setStylings(stylings);
        navigate("/");
      }

      return data;
    } catch (err) {
      console.error("Failed to fetch premise by ID:", err);
    }
  };

  useEffect(() => {
    if (id?.service === "scriptpad" && user) {
      fetchPremiseById();
    }
  }, [id, user]);

  // console.log("matchingPremiseData", premiseData);

  const userFirstName = userQuery?.first_name;
  const userLastName = userQuery?.last_name;

  const [isDelete, setIsDelete] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [dataCount, setDataCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [addPopup, setAddPopup] = useState(null);

  useEffect(() => {
    setQuery({
      pn: currentPage,
      ps: itemsToShow,
      sort: sortedData,
      order: sortOrder,
      text: text,
      language: language,
      user: queryUser,
      user_id: user,
      shared: addedByMeCondition,
      sale: availableForSale,
      translation: availableForTranslation,
    });
    setTotalPages(Math.ceil(dataCount / itemsToShow));
  }, [
    currentPage,
    itemsToShow,
    dataCount,
    sortedData,
    sortOrder,
    text,
    language,
    queryUser,
    user,
    addedByMeCondition,
    availableForSale,
    availableForTranslation,
  ]);

  useEffect(() => {
    if (res?.status === "fulfilled") {
      setRefetching(false);
      setQuerying(false);
    }
  }, [res]);

  useEffect(() => {
    if (!user) {
      dispatch(setUser(userQuery));
    }
  }, [userQuery, dispatch, user]);

  // useEffect(() => {
  //   setDataCount(premiseData?.count);

  //   setTotalPages(Math.ceil(dataCount / itemsToShow));
  //   setViewData(premiseData?.results);
  //   refetch();
  // }, [premiseData, dataCount, totalPages, itemsToShow, refetch]);

  useEffect(() => {
    if (premiseData) {
      let filterPremiseData = premiseData?.results?.filter(
        // (items) => items.ai_comments_generated
        (item) =>
          item?.ai_comments_generated === true || item?.is_draft === true
      );
      // console.log("filterPremiseData",filterPremiseData);
      setDataCount(filterPremiseData?.length);
      setViewData(filterPremiseData);
      setTotalPages(Math.ceil(premiseData?.count / itemsToShow));

      // Determine if there's more data to load
      if (itemsToShow >= premiseData.count) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      refetch();
    }
  }, [premiseData, itemsToShow]);

  // delete premise card
  // const handleDelete = (id) => {
  //   setIsDelete(id);
  // };

  // const handleShow = () => {
  //   let newItemsToShow = itemsToShow + 12;
  //   if (newItemsToShow < premiseData?.count) {
  //     setItemsToShow(newItemsToShow);
  //     setHasMore(true);
  //   } else if (newItemsToShow >= premiseData?.count) {
  //     setItemsToShow(premiseData?.count);
  //     setHasMore(false);
  //   }

  // };
  const handleShow = () => {
    let newItemsToShow = itemsToShow + 12;

    // Ensure newItemsToShow does not exceed the total count
    if (newItemsToShow >= premiseData?.count) {
      newItemsToShow = premiseData?.count;
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    setItemsToShow(newItemsToShow);
  };

  const [activeSearch, setActiveSearch] = useState(false);
  const [transPopClose, setTransPopClose] = useState({});

  const handleScroll = () => {
    setActiveSearch(false);
    setTransPopClose(null);
  };
  const [checkedAddPremise, setCheckedAddPremise] = useState(false);

  // console.log("checkedAddPremise", checkedAddPremise);
  const handleAddPopup = async () => {
    const notShowAddPremise = localStorage.getItem("NotShowAddPremise");

    if (
      (!notShowAddPremise || notShowAddPremise === "false") &&
      !checkedAddPremise
    ) {
      setCheckedAddPremise(true);
    }

    if (userFirstName) {
      //&& userLastName
      const res = await fetchUserAccess(`${currentUser?.id}/PP_PostPremise`);
      // console.log("add premise res", res);
      if (res?.access === "No") {
        setAddPopup(res);
      } else {
        setAddPopup("Yes");
      }
    } else {
      setAddPopup("noUserName");
    }
  };

  const [triggerPopup, setTriggerPopup] = useState(false);
  let idleTimer = null;
  const stored = localStorage.getItem("doNotShowBubblePopup");

  useEffect(() => {
    if (stored === "true") {
      return;
    } else {
      // Function to handle idle state
      const handleIdle = () => {
        idleTimer = setTimeout(() => {
          setTriggerPopup(true); // Trigger popup after 8 seconds of inactivity
        }, 10000); // 8 seconds
      };

      // Reset the timer on user activity
      const resetIdleTimer = () => {
        clearTimeout(idleTimer); // Clear existing timer
        handleIdle(); // Restart idle timer
      };

      // Set event listeners to reset idle timer
      window.addEventListener("mousemove", resetIdleTimer);
      window.addEventListener("keydown", resetIdleTimer);
      window.addEventListener("scroll", resetIdleTimer);
      window.addEventListener("click", resetIdleTimer);

      // Start the idle timer on mount
      handleIdle();

      // Cleanup event listeners and timer on unmount
      return () => {
        clearTimeout(idleTimer);
        window.removeEventListener("mousemove", resetIdleTimer);
        window.removeEventListener("keydown", resetIdleTimer);
        window.removeEventListener("scroll", resetIdleTimer);
        window.removeEventListener("click", resetIdleTimer);
      };
    }
  }, [stored]);

  const [pricingPopup, setPricingPopup] = useState(false);

  return (
    //   <div
    //   className="fixed left-0 top-[60px] w-full"
    //   style={{ width: `calc(100vw - 35px)` }}
    //   id="premisePool"
    // >
    <div
      className="fixed left-0 top-[60px] w-full md:w-[calc(100vw-35px)]"
      id="premisePool"
    >
      <div className=" overflow-y-hidden overflow-x-hidden lg:px-5 mx-auto w-full md:w-[95%] xl:w-full h-auto max-w-[1580px] ">
        {/* <div className="md:px-5 mx-auto w-full md:w-[95%] xl:w-full h-70vh max-w-[1462px] mt-[22px] "> */}
        <div className="">
          <div className="flex  justify-between items-center h-[124px] ">
            <div className=" flex items-end">
              <div className="relative mr-[43px]">
                <img
                  // src={premiseImage}
                  src={`https://uidemos.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-12-06+at+18.04+10.png`}
                  alt="premise doodle"
                  className="w-[103.07px] h-[103.72px] md:w-[115.07px] ml-[10px] md:ml-[0px]"
                />
                <img
                  // src={premiseImage}
                  src={walletDoodle}
                  alt="premise doodle"
                  className="w-[51px] h-[77px] absolute bottom-[3px] right-[-36px]"
                />
              </div>
              {
                <p className=" hidden md:flex w-[233px]  items-center text-[16px] leading-[19.5px] text-[#616161] h-[32px] font-[600]">
                  {hiddenCountRes?.total_premises === 1 ? (
                    <p>
                      {hiddenCountRes?.total_premises}{" "}
                      <span className="premise-m">Premise</span>
                    </p>
                  ) : (
                    <p>
                      {hiddenCountRes?.total_premises}{" "}
                      <span className="premises-m">Premises</span>
                    </p>
                  )}
                  ,{" ("}
                  {hiddenCountRes?.hidden_count} Private{")"}
                </p>
              }
            </div>
            {/* <button onClick={() => setPricingPopup(true)}>p</button> */}
            <div className="md:w-[50%] flex items-center justify-between h-[124px]">
              <div className="mr-[20px] md:mr-[0px] text-center w-[360px] md:mt-[-30px] lg:w-[440px] ml-[-186px] mb-0 lg:ml-[-171px] xl:ml-[-229px">
                <img
                  alt="monetize your creativity"
                  src={headText}
                  className="w-[60%] xxs:w-[70%] lg:w-[443px] ml-auto lg:mx-auto h-[42px] lg:h-[52px]"
                />
                {/* <h2 className="text-[30px] font-figma-hand text-[#] leading-[41.37px] font-[700] mt-[0px]">
                  Monetize Your Creativity!
                </h2> */}
                <button
                  id="addNewPremise"
                  onClick={handleAddPopup}
                  // className="btn btn"
                  className="bg-[#33B0CA] flex items-center justify-center gap-[8px] text-[#FAFAFA] text-[14px] font-[600] rounded-[8px] min-w-[196px] min-h-[34px] mt-[14px] px-[12px] ml-auto lg:mx-auto"
                >
                  <div className="flex gap-[6px] min-h-[34px] items-center">
                    <span className=" text-[24px]">+</span>{" "}
                    <span className="addNewPremise-m">Add A New Premise</span>
                  </div>
                </button>
                <div className="md:hidden flex justify-end text-[14px] text-[#252525] h-[32px] font-[500]">
                  <p>
                    {hiddenCountRes?.total_premises === 1 ? (
                      <span>
                        {hiddenCountRes?.total_premises}{" "}
                        <span className="premise-m">Premise</span>
                      </span>
                    ) : (
                      <span>
                        {hiddenCountRes?.total_premises}{" "}
                        <span className="premises-m">Premises</span>
                      </span>
                    )}
                    ,{" ("}
                    {hiddenCountRes?.hidden_count} Private{")"}
                  </p>
                </div>
              </div>

              <div className="mt-[36px] hidden md:block">
                <FilterSearchSort
                  data={{
                    totalPages,
                    currentPage,
                    next: premiseData?.next,
                    prev: premiseData?.previous,
                  }}
                  showRefine={showRefine}
                  setShowRefine={setShowRefine}
                  setCurrentPage={setCurrentPage}
                  setViewData={setViewData}
                  setItemsToShow={setItemsToShow}
                  setSortedData={setSortedData}
                  setSortOrder={setSortOrder}
                  refetch={refetch}
                  setRefetching={setRefetching}
                  setText={setText}
                  setQueryUser={setQueryUser}
                  setLanguage={setLanguage}
                  sortOrder={sortOrder}
                  sortedData={sortedData}
                  language={language}
                  activeSearch={activeSearch}
                  dataCount={premiseData?.count}
                  setActiveSearch={setActiveSearch}
                  hiddenCountRes={hiddenCountRes}
                />
              </div>
            </div>
          </div>
          <div className="w-full mx-auto h-[1px] bg-[#eaeaea] mt-[4px] barSm-hidden" />
          {addPopup === "noUserName" && (
            <UserNamePopup {...{ refetch, setAddPopup }} addPremise />
          )}
          {addPopup?.msg === "ShowBecomePrivilege" ? (
            <NoAccessPopUp
              noAccessPopup={addPopup}
              setNoAccessPopup={setAddPopup}
            />
          ) : addPopup?.msg === "LB" ||
            addPopup?.msg === "ShowBuyPackage_and_Allacarte" ? (
            <NoAccessLbPopUp
              divId="addNewPremise"
              setNoAccessPopup={setAddPopup}
              noAccessLbPopup={addPopup}
              service="PP_Premises"
            />
          ) : (
            addPopup === "Yes" && (
              <AddPremise2
                setAddPopup={setAddPopup}
                refetch={refetch}
                checkedAddPremise={checkedAddPremise}
                setCheckedAddPremise={setCheckedAddPremise}
              />
            )
          )}

          <div className="shortM-hidden ">
            <FilterSearchSort
              data={{
                totalPages,
                currentPage,
                next: premiseData?.next,
                prev: premiseData?.previous,
              }}
              showRefine={showRefine}
              setShowRefine={setShowRefine}
              setCurrentPage={setCurrentPage}
              setViewData={setViewData}
              setItemsToShow={setItemsToShow}
              setSortedData={setSortedData}
              setSortOrder={setSortOrder}
              refetch={refetch}
              setRefetching={setRefetching}
              setText={setText}
              setQueryUser={setQueryUser}
              setLanguage={setLanguage}
              sortOrder={sortOrder}
              sortedData={sortedData}
              language={language}
              activeSearch={activeSearch}
              dataCount={premiseData?.count}
              setActiveSearch={setActiveSearch}
              hiddenCountRes={hiddenCountRes}
            />
          </div>
        </div>
        {activeAddedByMe && (
          <div className=" flex items-center gap-[12px] justify-center md:justify-start flex-nowrap cursor-pointer">
            <h4
              onClick={() => setAddedByMeCondition(false)}
              className={`flex items-center flex-shrink-0 leading-[20px] text-[16px] font-[500] px-[8px] py-[4px] border-b-4 cursor-pointer   hover:border-[#33B0CA]  bg-[#fafafa] ${
                !addedByMeCondition
                  ? "text-[#33B0CA] border-[#33B0CA]"
                  : "text-[#252525] border-[#616161]"
              }`}
            >
              Posted by me
            </h4>
            <h4
              onClick={() => setAddedByMeCondition(true)}
              className={`flex items-center flex-shrink-0 leading-[20px] text-[16px] font-[500] px-[8px] py-[4px] border-b-4 cursor-pointer   hover:border-[#33B0CA]  bg-[#fafafa] ${
                addedByMeCondition
                  ? "text-[#33B0CA] border-[#33B0CA]"
                  : "text-[#252525] border-[#616161]"
              }`}
            >
              Shared with me
            </h4>
          </div>
        )}
        <div
          className="h-[70vh] 2xl:h-[73vh] 3xl:h-[75vh] overflow-y-scroll"
          id="scrollableDiv"
          onScroll={handleScroll}
        >
          {querying || refetching ? (
            // <TypingLoader data={loadingData} />
            <div className="fixed inset-0 flex items-center justify-center mx-auto z-50">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="relative rounded-[8px] h-[100px] bg-[#fafafa] w-[90%] lg:w-[35%] flex items-center">
                <TypingLoader data={loadingData} />
              </div>
            </div>
          ) : viewData?.length > 0 ? (
            <InfiniteScroll
              // dataLength={premiseData?.count}
              dataLength={viewData?.length}
              // loader={<p className="text-center">Loading....</p>}
              hasMore={hasMore}
              next={handleShow}
              // endMessage={<p>NO MORE DATA!</p>}
              scrollableTarget="scrollableDiv"
            >
              <div
                //  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:w-[1400px] 2xl:w-[97%] gap-[22px] xl:gap-[20px] 2xl:gap-[48px] my-[22px] md:my-10 w-full md:w-[720px] lg:w-[1060px]  justify-center mx-auto"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  2xl:w-[97%] gap-[32px] md:gap-x-[30px] xl:gap-[15px] xxl:gap-[30px] 2xl:gap-[24px] my-[22px] md:my-10 w-full md:w-[720px] lg:min-w-[1060px] lg:max-w-[1440px] justify-center mx-auto pb-20"
              >
                {viewData?.map((premise, index) => (
                  <PremiseCardV2
                    setShowRefine={setShowRefine}
                    key={premise?.id}
                    index={index}
                    p={premise}
                    refetch={refetch}
                    userQuery={userQuery}
                    owner={{ user, userFirstName, userLastName }}
                    // handleDelete={handleDelete}
                    shouldBlink={isAddNew && index === 0}
                    activeSearch={activeSearch}
                    transPopClose={transPopClose}
                    setTransPopClose={setTransPopClose}
                    hiddenCountRefetch={hiddenCountRefetch}
                    addPopup={addPopup}
                    setAddPopup={setAddPopup}
                    draftOpenFromSp={draftOpenFromSp}
                  />
                ))}
                {/* {isDelete && matchingPremiseData && (
                  <DeletePremise
                    setIsDelete={setIsDelete}
                    refetch={refetch}
                    hiddenCountRefetch={hiddenCountRefetch}
                    deleteId={matchingPremiseData}
                    isDelete={isDelete}
                  />
                )} */}
                {openPopBySp && (
                  <Popup
                    popClose={() => setOpenPopBySp(false)}
                    // setIsLiked={setIsLiked}
                    data={{
                      id: matchingPremiseData?.id,
                      dText: dText,
                      bg_color: matchingPremiseData?.bg_color,
                      bg_img: matchingPremiseData?.bg_img,
                      likes: matchingPremiseData?.likes,
                      stylings: stylings,
                      created_by: matchingPremiseData?.created_by,
                      isLiked: matchingPremiseData?.isLiked,
                      source_language: matchingPremiseData?.source_language,
                      user: matchingPremiseData?.user,
                      setOpenDotMenu: matchingPremiseData?.setOpenDotMenu,
                      setUserMail: matchingPremiseData?.setUserMail,
                      handleHideUnhidePremise:
                        matchingPremiseData?.handleHideUnhidePremise,
                      setOwnerMail: matchingPremiseData?.setOwnerMail,
                      formattedTime: formattedTime,
                      formattedDate: formattedDate,
                      hidden: matchingPremiseData?.hidden,
                      index: matchingPremiseData?.index,
                      openDotMenu: matchingPremiseData?.openDotMenu,
                      setHideDisable: matchingPremiseData?.setHideDisable,
                      hideDisable: matchingPremiseData?.hideDisable,
                      hiddenCountRefetch:
                        matchingPremiseData?.hiddenCountRefetch,
                      project_id: matchingPremiseData?.project_id,
                      m_value: matchingPremiseData?.m_value,
                      premiseOwner: matchingPremiseData?.premiseOwner,
                    }}
                    setPreviewAfterDraft={setPreviewAfterDraft}
                    previewAfterDraft={previewAfterDraft}
                    refetch={refetch}
                    p={matchingPremiseData}
                  />
                )}
                {hiddenPop && (
                  <NoPremisePop popClose={() => setHiddenPop(false)} />
                )}
                {/* {srcData.map((item, idx) => {
                return (
                  <div className="px-12 py-2 my-2 border rounded-md">
                    This is no. {idx + 1}
                  </div>
                );
              })} */}
              </div>
            </InfiniteScroll>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-2xl  text-red-600 font-semibold">
                No premise available
              </p>
            </div>
          )}
        </div>
      </div>

      {openSequalPop && <TestPopup />}
      {pricingPopup && <PricingPopup setPricingPopup={setPricingPopup} />}

      {/* footer */}
      {/* <Footer></Footer> */}
    </div>
  );
};
export default PremiseV2;
