// PremiseNewTab Component
//
// This component is the main viewer for a single premise in “New Tab” mode.
// It fetches, organizes, and displays all premise-related comments, replies,
// characters, and sidebar data — acting as the top-level coordinator for
// the premise discussion and story-building workspace.
//
// ------------------------------------------------------------
// Overview
// ------------------------------------------------------------
// - Fetches premise details, comments, and characters via multiple API hooks.
// - Handles dynamic comment searching, replying, and filtering logic.
// - Displays two main sections: Comment workspace (center) and sidebar info (left/right).
// - Supports tutorial popups and onboarding states for new users.
// - Integrates Framer Motion for smooth comment animation and scroll sync.
//
// ------------------------------------------------------------
// Core Logic
// ------------------------------------------------------------
//
// 1. **Data Fetching**
//    - Uses RTK Query endpoints to fetch premise, comments, and saved characters.
//    - Automatically refetches when premise or comment data changes.
//    //! Important: Relies on `premiseData?.setC` to calculate act thresholds for comment segmentation.
//
// 2. **Comment Management**
//    - Renders all comments (and replies) through the `AllComments` component.
//    - Provides in-line reply functionality with real-time updates.
//    - Supports comment search via `useFindCommentMutation`.
//    //! Important: Keeps both `filteredCommentsData` and `commentsData` in sync for search and refresh.
//
// 3. **Reply Handling**
//    - Tracks and manages open reply fields across multiple comments.
//    - Handles reply submission with validation and toast feedback.
//    - Syncs reply posting using `useCreateReplyMutation` and `commentRefetch()`.
//
// 4. **Act & Phase Segmentation**
//    - Parses `premiseData.setC` JSON to extract Act One / Act Two thresholds.
//    - These thresholds are used to display “Setup”, “Conflict”, and “Resolution” phases in comments.
//
// 5. **Sidebars & Layout**
//    - Left: `LeftSideBarUpdate` — manages character and comment navigation.
//    - Right: `VerticalBar` — visual guide for comment structure and phase progression.
//    - Responsive layout swaps between “lgHidden” (mobile) and “lgFlxVisible” (desktop) modes.
//
// 6. **Search & Filtering**
//    - Search form calls `findComments` mutation and displays matched comments dynamically.
//    - Prevents concurrent requests using a controlled `loading` state.
//
// 7. **Access Control & Visibility**
//    - Restricts access to hidden premises unless owned by the logged-in user.
//    - Displays `NoPremisePop` when unauthorized.
//    //! Important: Blocks rendering of sensitive or private premise data for non-owners.
//
// 8. **Tutorial & Onboarding**
//    - Uses `NewTabTutorialPop` to guide new users when opening the premise tab for the first time.
//    - Tracks tutorial completion with `localStorage` flags.
//
// ------------------------------------------------------------
// Props Overview
// ------------------------------------------------------------
// - id: The unique ID of the premise.
// - user: Current logged-in user ID.
// - premiseData: The premise object containing owner, project ID, and settings.
// - premiseRefetch: Callback to refetch premise data.
// - isPremiseLoading: Boolean indicating premise fetch status.
//
// ------------------------------------------------------------
// Summary
// ------------------------------------------------------------
// `PremiseNewTab` serves as the central hub for premise exploration and collaboration.
// It merges multiple submodules — comments, characters, beats, and user interactions —
// into a single coordinated layout, ensuring seamless data flow and UI synchronization.
//
// //! Key takeaway: This component orchestrates the full “premise view” experience,
//    combining fetching, filtering, replies, and tutorials into one cohesive screen.

import { useContext, useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { MyContext } from "../../../App";
import { useGetSavedCharactersQuery } from "../../../app/EndPoints/Characters/Characters";
import { useCreateReplyMutation } from "../../../app/EndPoints/commentReply/reply";
import { useFindCommentMutation } from "../../../app/EndPoints/comments/commentAPi";
import {
  useGetCommentByPremiseIdQuery,
  useGetPremiseUserPictureQuery,
} from "../../../app/EndPoints/premisePoolApi";
import human from "../../../img/Icons/human_icon.png";
import { baseURL } from "../../utils";
import NewTabTutorialPop from "../sequalPopup/NewTabTutorialPop";
import ChatArea from "./Brainstorming/ChatArea";
import LeftSideBarUpdate from "./LeftSideBarUpdate";
import ProjectInfoUpdate from "./ProjectInfoUpdate";
import VerticalBar from "./VerticalBar";

const PremiseNewTab = ({
  id,
  user,
  premiseData,
  premiseRefetch,
  isPremiseLoading,
}) => {
  const { state } = useLocation();
  const currentCommentRef = useRef({});

  const { setCurrentlyOpenedCommentID } = useContext(MyContext);

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(premiseData?.premiseOwner?.id);
  const {
    data: characters,
    isLoading: isCharLoading,
    isError,
    refetch: characterRefetch,
  } = useGetSavedCharactersQuery(premiseData?.project_id);

  // for search
  const [findComments, { isLoading: isSearchLoading }] =
    useFindCommentMutation();
  const [filteredCommentsData, setFilteredCommentsData] = useState(null);

  const [createReplyMutation, isReplyResInfo] = useCreateReplyMutation();
  const replyResStat = isReplyResInfo?.status;

  const proImgUrl = baseURL.concat(profileImg?.[0]?.profile_photo);
  // For "Brainstorms" and "Engagements"
  const lastCommentRef = useRef(null);
  const [openAllReplies, setOpenAllReplies] = useState(false);
  const [openReplyFieldID, setOpenReplyFieldID] = useState(null);
  const [openReplyField, setOpenReplyField] = useState(null);
  const [replyField, setReplyField] = useState(false);

  const [replyToCommentID, setReplyToCommentID] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [commentOwner, setCommentOwner] = useState("");
  const [replyTextCount, setReplyTextCount] = useState(0);
  const [addBeatTutorialPop, setAddBeatTutorialPop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [commentField, setCommentField] = useState(true);
  const [loading, setLoading] = useState(false);
  const [actOneThreshold, setActOneThreshold] = useState(null);
  const [actTwoEnd, setActTwoEnd] = useState(null);

  const [premiseDataR, setPremiseDataR] = useState(null);

  useEffect(() => {
    if (!premiseData) return; // wait until data is available

    if (premiseData?.premiseOwner?.id === user) {
      setPremiseDataR(premiseData);
    } else {
      setPremiseDataR(null);
    }
  }, [premiseData, user]);

  //get comments pagination
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsToShow, setItemsToShow] = useState(10);
  const [searchText, setSearchText] = useState("");

  const [query, setQuery] = useState({
    pn: currentPage,
    ps: itemsToShow,
    id,
    text: searchText,
  });

  const {
    data: commentsData,
    isLoading: isCommentLoading,
    refetch: commentRefetch,
  } = useGetCommentByPremiseIdQuery(query);

  const scrollContainerRef = useRef(null);
  const handleShow = () => {
    const totalCount = commentsData?.count || 0;
    let newItemsToShow = Math.min(itemsToShow + 10, totalCount);

    setItemsToShow(newItemsToShow);
    setHasMore(newItemsToShow < totalCount);

    setQuery((prev) => ({
      ...prev,
      ps: newItemsToShow,
    }));

    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, 300);
  };

  useEffect(() => {
    if (commentsData) {
      const totalCount = commentsData?.count || 0;

      // Update hasMore correctly
      setHasMore(itemsToShow < totalCount);
    }
  }, [commentsData, itemsToShow]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        setQuery((prev) => ({
          ...prev,
          text: searchTerm.trim(),
          pn: 1,
        }));
      } else {
        // reset query when searchTerm is empty
        setQuery({
          pn: currentPage,
          ps: itemsToShow,
          id,
          text: "",
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage, itemsToShow, id]);

  // 🔍 Handle form submit (optional)
  const handleSearch = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      setQuery((prev) => ({
        ...prev,
        text: searchTerm.trim(),
        pn: 1,
      }));
    } else {
      handleClear();
    }
  };

  //  Clear function
  const handleClear = () => {
    setSearchTerm("");
    setQuery({
      pn: currentPage,
      ps: itemsToShow,
      id,
      text: "",
    });
  };
  useEffect(() => {
    if (!isPremiseLoading && premiseData?.setC) {
      // Step 1: Log premiseData.setC to verify it

      try {
        const setCString = premiseData?.setC;

        // Step 2: Check if setC is already an object or a string
        if (typeof setCString === "string") {
          const setCObject = JSON.parse(setCString.replace(/'/g, '"')); // Parse if it's a string

          const actOne = setCObject["Forward the Act One"];
          const actTwo = setCObject["Forward the Act Two"];

          // Step 3: Set the thresholds
          setActOneThreshold(actOne); // Last number of Act One
          setActTwoEnd(actTwo[actTwo.length - 1]); // Last number of Act Two
        } else {
          // If setC is already an object, handle it directly
          const setCObject = setCString; // No need to parse

          const actOne = setCObject["Forward the Act One"];
          const actTwo = setCObject["Forward the Act Two"];

          setActOneThreshold(actOne[actOne.length - 1]); // Last number of Act One
          setActTwoEnd(actTwo[actTwo.length - 1]); // Last number of Act Two
        }
      } catch (error) {
        console.error("Error parsing setC or setting thresholds:", error);
      }
    }
  }, [isPremiseLoading, premiseData]);

  const [openNewTabTutorialPop, setOpenNewTabTutorialPop] = useState(false);
  const newTabTutorialPop = localStorage.getItem("newTabTutorialPop");
  const [openNewTabTutorialPopOtherUser, setOpenNewTabTutorialPopOtherUser] =
    useState(false);

  useEffect(() => {
    const newTabTutorialPop = localStorage.getItem("newTabTutorialPop");
    if (
      (!newTabTutorialPop || newTabTutorialPop === "false") &&
      !openNewTabTutorialPop
    ) {
      setOpenNewTabTutorialPopOtherUser(false);
      setOpenNewTabTutorialPop(true);
    }
  }, [user]);

  const replyRef = useRef(null);

  const handleOpenSp = () => {
    window.location.href = `${baseURL}/scriptpad/#/${premiseData?.project_id}/0x0d2a90b8da670ddad09e2d7b719779a41687515aa196cb35568f20659b204de6/premise`;
  };

  const handleOpenAllReplies = (id, commenterName) => {
    setOpenAllReplies(true);
    setOpenReplyFieldID(id);
    setReplyToCommentID(id);
    // setReplyToCommentID(comments?.id);
    // setCurrentlyOpenedCommentID(comments?.id);
    setCurrentlyOpenedCommentID(id);
    setCommentOwner(commenterName);
  };

  // if (isPremiseLoading || isCommentLoading) {
  //   return <TypingLoader />;
  // } else if (
  //   !isPremiseLoading &&
  //   !isCommentLoading &&
  //   !premiseDataR &&
  //   !commentsData
  // ) {
  //   return <NoPremisePop />;
  // }

  const [newTabTextFieldMob, setNewTabTextFieldMob] = useState(false);
  const handleToggleCharComment = () => {
    setNewTabTextFieldMob(!newTabTextFieldMob);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="mt-[70px]   w-full  h-[calc(100vh-80px)] overflow-y-hidden">
        {!isPremiseLoading &&
        !isCommentLoading &&
        premiseDataR &&
        commentsData ? (
          <div className="w-full lg:w-[95%] max-w-[1445px] mx-auto ">
            {/* FOr mobile */}
            <div className="lgHidden ">
              {/* header */}
              <div className="bg-[#741CFF33] px-2 h-12 flex items-center justify-between">
                {!newTabTextFieldMob ? (
                  <button
                    className="text-[#000] bg-[#F3F4F6] rounded-lg px-3 h-10 w-10 text-[16px] font-semibold"
                    onClick={() => {
                      handleOpenSp();
                      // setOpenDotMenu(null);
                    }}
                  >
                    <FaArrowLeft />
                  </button>
                ) : (
                  <button
                    className="text-[#000] bg-[#F3F4F6] rounded-lg px-3 h-10 w-10 text-[16px] font-semibold"
                    onClick={() => {
                      setNewTabTextFieldMob(false);
                      // setOpenDotMenu(null);
                    }}
                  >
                    <FaArrowLeft />
                  </button>
                )}
                <div
                  className={` border w-[224px] md:w-[206px] border-[#B4B4B4] bg-[#F3F4F6] lg:mx-auto px-[14px] h-[32px] my-2 rounded-full`}
                >
                  <form className="flex items-center" onSubmit={handleSearch}>
                    <input
                      type="text"
                      className="w-full flex-1 px-2 h-[28px] text-[14px] bg-[#F3F4F6] focus:outline-none rounded"
                      placeholder="Search"
                      maxLength={30}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm ? (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="ml-2"
                      >
                        <IoMdClose className="h-[20px] w-[20px] text-gray-600 hover:text-red-500 transition" />
                      </button>
                    ) : (
                      <button type="submit" className="ml-2">
                        <FiSearch className="h-[20px] w-[20px] text-gray-600 hover:text-blue-500 transition" />
                      </button>
                    )}
                  </form>
                </div>
                <div className="p-[1px] text-center h-10 w-10 bg-[linear-gradient(30deg,#741CFF_0%,#00C3FF_70%)] rounded-[8px]">
                  <button
                    onClick={handleToggleCharComment}
                    className="bg-[#F3F4F6] h-[38px] w-[38px] rounded-[8px] flex justify-center items-center"
                  >
                    <div className="bg-[#00C3FF] h-8 w-8 rounded-full">
                      <img
                        src={human}
                        className="object-cover h-6 w-6  mt-[4px] ml-[4px]"
                        alt=""
                      />
                    </div>
                  </button>
                </div>
              </div>
              {!newTabTextFieldMob ? (
                <div>
                  {" "}
                  <ChatArea
                    rawBackendData={commentsData?.results}
                    last_c_value={commentsData?.last_c_value}
                    premiseOwner={premiseData?.premiseOwner}
                    premiseId={id}
                    user={user}
                    commentRefetch={commentRefetch}
                    premiseData={premiseData}
                    handleShow={handleShow}
                    hasMore={hasMore}
                    scrollContainerRef={scrollContainerRef}
                    isCommentLoading={isCommentLoading}
                  />
                </div>
              ) : (
                <div>
                  <ProjectInfoUpdate
                    {...{
                      premiseData,
                      premiseRefetch,
                      setOpenReplyField,
                      commentsData,
                      commentField,
                      setCommentField,
                      handleOpenSp,
                    }}
                  />
                  <LeftSideBarUpdate
                    {...{
                      filteredCommentsData,
                      premiseData,
                      premiseRefetch,
                      commentRefetch,
                      commentsData,
                      setOpenReplyField,
                      lastCommentRef,
                      replyField,
                      setReplyField,
                      setOpenReplyFieldID,
                      setOpenAllReplies,
                      characters,
                      characterRefetch,
                      isCharLoading,
                      handleSearch,
                      handleClear,
                      currentCommentRef,
                      handleOpenAllReplies,
                      setSearchTerm,
                      searchTerm,
                      commentField,
                      setCommentField,
                    }}
                  />
                </div>
              )}
            </div>

            {/* <ProjectInfo {...{ premiseData }} /> */}
            <div className="lgVisible">
              <ProjectInfoUpdate
                {...{
                  premiseData,
                  premiseRefetch,
                  setOpenReplyField,
                  commentsData,
                  commentField,
                  setCommentField,
                  handleOpenSp,
                }}
              />
              {/* <div className="flex gap-2">
                <button
                  className="text-[#fff] bg-[linear-gradient(30deg,#741CFF,#00c3ff)] rounded-lg px-3 ml-4 h-[32px] text-[14px] my-1 font-semibold flex items-center gap-1"
                  onClick={() => {
                    handleOpenSp();
                    // setOpenDotMenu(null);
                  }}
                >
                  <FaArrowLeft />
                  <div className="hidden lg:block">Screenplay</div>
                </button>
              </div> */}
            </div>
            <div className=" pb-6 lg:pb-0 overflow-x-hidden   ">
              <div className="w-full lgFlxVisible  relative">
                <ChatArea
                  rawBackendData={commentsData?.results}
                   last_c_value={commentsData?.last_c_value}
                  premiseOwner={premiseData?.premiseOwner}
                  premiseId={id}
                  user={user}
                  commentRefetch={commentRefetch}
                  premiseData={premiseData}
                  handleShow={handleShow}
                  hasMore={hasMore}
                  scrollContainerRef={scrollContainerRef}
                  isCommentLoading={isCommentLoading}
                />
                {/* Left Sidebar */}
                <div className=" bg-[#fff] max-w-[500px] w-2/4 pr-0 flex ">
                  <div className="lgVisible">
                    <VerticalBar
                      replyRef={replyRef}
                      comments={filteredCommentsData?.comments}
                      currentCommentRef={currentCommentRef}
                      handleOpenAllReplies={handleOpenAllReplies}
                      // setReplyField={setReplyField}
                      // replyField={replyField}
                      // onFocusComment={handleFocusComment}
                    />
                  </div>
                  {/* <div className=" bg-[#fff] lg:w-[500px] w-full pr-0 flex lg:h-[calc(100vh-75px)]"> */}
                  <LeftSideBarUpdate
                    {...{
                      filteredCommentsData,
                      premiseData,
                      premiseRefetch,
                      commentRefetch,
                      commentsData,
                      setOpenReplyField,
                      lastCommentRef,
                      replyField,
                      setReplyField,
                      setOpenReplyFieldID,
                      setOpenAllReplies,
                      characters,
                      characterRefetch,
                      isCharLoading,
                      handleSearch,
                      handleClear,
                      currentCommentRef,
                      handleOpenAllReplies,
                      setSearchTerm,
                      searchTerm,
                      commentField,
                      setCommentField,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center mx-auto z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            {/* <div className="relative rounded-[8px] h-[100px] bg-[#fafafa] w-[90%] lg:w-[35%] flex items-center">
            <TypingLoader data={loadingData} />
          </div> */}
          </div>
        )}
      </div>
      {openNewTabTutorialPop && !openNewTabTutorialPopOtherUser && (
        <NewTabTutorialPop popClose={() => setOpenNewTabTutorialPop(false)} />
      )}

      {<></>}
    </div>
  );
};

export default PremiseNewTab;
