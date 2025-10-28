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

import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { MyContext } from "../../../App";
import { useGetSavedCharactersQuery } from "../../../app/EndPoints/Characters/Characters";
import { useCreateReplyMutation } from "../../../app/EndPoints/commentReply/reply";
import { useFindCommentMutation } from "../../../app/EndPoints/comments/commentAPi";
import {
  useGetCommentByPremiseIdQuery,
  useGetPremiseUserPictureQuery,
} from "../../../app/EndPoints/premisePoolApi";
import AllComments from "../../Premisepool/AllComments";
import TypingLoader from "../../TypingLoader";
import { baseURL } from "../../utils";
import NewTabTutorialPop from "../sequalPopup/NewTabTutorialPop";
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
  // const { id } = useParams(); // Extract the ID from the route
  const { state } = useLocation();
  const currentCommentRef = useRef({});

  // const params = state || {};
  // const { project_id } = params;
  // console.log("project_id", project_id);
  const { setCurrentlyOpenedCommentID } = useContext(MyContext);
  // const {
  //   data: premiseData,
  //   isPremiseLoading,
  //   refetch: premiseRefetch,
  // } = useGetOnePremiseQuery(id);

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(premiseData?.premiseOwner?.id);

  // const user = useSelector((state) => state?.user?.id);

  const [premiseDataR, setPremiseDataR] = useState(null);

  useEffect(() => {
    console.log("Premise", premiseData);
    if (!premiseData) return; // wait until data is available

    if (premiseData?.premiseOwner?.id === user) {
      setPremiseDataR(premiseData);
    } else {
      setPremiseDataR(null);
    }
  }, [premiseData, user]);

  const {
    data: commentsData,
    isCommentLoading,
    refetch: commentRefetch,
  } = useGetCommentByPremiseIdQuery(id);

  const {
    data: characters,
    isCharLoading,
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

  useEffect(() => {
    if (!searchTerm && commentsData) {
      setFilteredCommentsData(commentsData); // Set initial data if no search
    }
  }, [commentsData, searchTerm]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const data = {
      search_text: searchTerm,
      premise_id: id,
    };

    // Avoid multiple concurrent requests
    if (loading) return;

    setLoading(true); // Start loading state

    try {
      const res = await findComments(data); // API call
      console.log(res);

      if (res?.data) {
        // If search results are returned, update filtered comments
        setFilteredCommentsData(res.data);
      } else {
        console.error("No data returned from API");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false); // End loading state
    }
  };

  const [actOneThreshold, setActOneThreshold] = useState(null);
  const [actTwoEnd, setActTwoEnd] = useState(null);

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

  // useEffect(() => {
  //   if (
  //     (!newTabTutorialPop || newTabTutorialPop === "false") &&
  //     premiseData?.premiseOwner?.id === user &&
  //     !openNewTabTutorialPop
  //   ) {
  //     setOpenNewTabTutorialPop(true);
  //   }
  // }, [newTabTutorialPop, user, premiseData]);

  // const [openNewTabTutorialPopOtherUser, setOpenNewTabTutorialPopOtherUser] =
  //   useState(false);
  // const newTabTutorialOtherUser = localStorage.getItem(
  //   "newTabTutorialPopOtherUser"
  // );
  // useEffect(() => {
  //   if (
  //     (!newTabTutorialOtherUser || newTabTutorialOtherUser === "false") &&
  //     premiseData?.premiseOwner?.id !== user &&
  //     !openNewTabTutorialPopOtherUser
  //   ) {
  //     setOpenNewTabTutorialPopOtherUser(true);
  //   }
  // }, [newTabTutorialOtherUser, user, premiseData]);

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

  const handlePostReplyToComment = async (e) => {
    e.preventDefault();
    setReplyLoading(true);
    const data = {
      reply: replyToCommentID,
      text: replyText,
    };
    const response = await createReplyMutation(data);
    if (response) {
      // refetch();
      // setOpenReplyField(null);
      e.target.reset();
      setReplyText("");
      commentRefetch();
      toast.success("Reply added!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setReplyLoading(false);
    }
  };

  const handleReplyTextChange = (event) => {
    const reply = event.target.value.replace(/^\s+|\s+(?=\s)/g, "");
    setReplyTextCount(reply.length);
    setReplyText(reply);
  };

  const [focusedCValue, setFocusedCValue] = useState(null);

  const handleOpenSp = () => {
    // console.log("object", p);
    // if (isProjectLocked) {
    //   window.location.href(`${URL}/scriptpad/#/generated-scripts`);
    // }
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

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="fixed top-[80px] left-1/2 -translate-x-1/2 w-full  h-[calc(100vh-80px)]">
        {!isPremiseLoading &&
        !isCommentLoading &&
        premiseDataR &&
        commentsData ? (
          <div className="w-[95%]   max-w-[1445px] mx-auto mt-4">
            {/* <ProjectInfo {...{ premiseData }} /> */}
            <ProjectInfoUpdate
              {...{
                premiseData,
                premiseRefetch,
                setOpenReplyField,
                commentsData,
                commentField,
                setCommentField,
              }}
            />
            <button
              className="text-[#fff] bg-[linear-gradient(30deg,#741CFF,#00c3ff)] rounded-lg px-3 ml-4 h-[32px] text-[14px] my-1 font-semibold flex items-center gap-1"
              onClick={() => {
                handleOpenSp();
                // setOpenDotMenu(null);
              }}
            >
              <FaArrowLeft />
              Screenplay
            </button>
            <div className="w-full lgHidden  relative">
              <div className=" pb-6 lg:pb-0 h-[calc(80vh-206px)] sm:h-[66vh]  overflow-y-auto  ">
                {/* Left Sidebar */}
                <div className=" bg-[#fff] xl:w-[500px] w-full pr-0 flex ">
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
                      currentCommentRef,
                      handleOpenAllReplies,
                      setSearchTerm,
                      commentField,
                      setCommentField,
                    }}
                  />
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

                <div
                  ref={lastCommentRef}
                  className="w-full md:w-[98%] mx-auto relative lg:h-[80vh] lg:overflow-y-auto lg:shadow-[0px_0px_20.6px_0px_rgba(0,0,0,0.15)] lg:ml-3 lg:rounded-2xl"
                >
                  {isSearchLoading || isCommentLoading ? (
                    <div>
                      <TypingLoader />
                    </div>
                  ) : (
                    <div className="pt-[18px] pb-[18px]">
                      {/* ✅ Show loader only while data is fetching */}
                      {isCommentLoading ? (
                        <TypingLoader />
                      ) : filteredCommentsData?.comments?.length > 0 ? (
                        // ✅ Comments exist
                        <div>
                          {[...(filteredCommentsData?.comments || [])]
                            .sort((a, b) => a.c_value - b.c_value)
                            .map((comment, index) => (
                              <motion.div
                                key={comment.id + index}
                                initial={{ opacity: 0, y: 70 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.5 }}
                                ref={(el) =>
                                  (currentCommentRef.current[comment.id] = el)
                                }
                              >
                                <AllComments
                                  fromNew
                                  commentIdx={index + 1}
                                  comments={comment}
                                  data={premiseData}
                                  refetch={premiseRefetch}
                                  openReplyField={openReplyField}
                                  setOpenReplyField={setOpenReplyField}
                                  replyToCommentID={replyToCommentID}
                                  setReplyToCommentID={setReplyToCommentID}
                                  replyResStat={replyResStat}
                                  setCommentOwner={setCommentOwner}
                                  setOpenAllReplies={setOpenAllReplies}
                                  openAllReplies={openAllReplies}
                                  commentRefetch={commentRefetch}
                                  proImgUrl={proImgUrl}
                                  setReplyField={setReplyField}
                                  replyField={replyField}
                                  replyRef={replyRef}
                                  handleOpenAllReplies={handleOpenAllReplies}
                                  handleReplyTextChange={handleReplyTextChange}
                                  handlePostReplyToComment={
                                    handlePostReplyToComment
                                  }
                                  replyLoading={replyLoading}
                                  premiseData={premiseData}
                                  replyTextCount={replyTextCount}
                                  setReplyTextCount={setReplyTextCount}
                                  actTwoEnd={actTwoEnd}
                                  actOneThreshold={actOneThreshold}
                                  openReplyFieldID={openReplyFieldID}
                                  setOpenReplyFieldID={setOpenReplyFieldID}
                                  project_id={premiseData?.project_id}
                                  focusedCValue={focusedCValue}
                                  iconWidth="w-[97.8%] md:w-[90.8%]"
                                  inpRightMargin="mr-[47px] md:mr-[120px]"
                                  addBeatTutorialPop={addBeatTutorialPop}
                                  setAddBeatTutorialPop={setAddBeatTutorialPop}
                                  setReplyText={setReplyText}
                                />
                              </motion.div>
                            ))}
                        </div>
                      ) : filteredCommentsData?.counts > 0 &&
                        filteredCommentsData?.comments?.length === 0 ? (
                        // ✅ Private comments
                        <p className="text-center my-4">
                          Comments Are Private.
                        </p>
                      ) : (
                        // ✅ Only show “No Comments” when loading is done and there’s truly no data
                        !isCommentLoading && (
                          <p className="text-center my-4">
                            No Comments Available
                          </p>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full lgFlxVisible relative">
              <div className="w-full mr-4 ">
                <div
                  ref={lastCommentRef}
                  className="w-full relative lg:h-[80vh] lg:overflow-y-auto lg:shadow-[0px_0px_20.6px_0px_rgba(0,0,0,0.15)] lg:ml-3 pb-12 lg:rounded-t-2xl"
                >
                  {isSearchLoading || isCommentLoading ? (
                    <div>
                      <TypingLoader />
                    </div>
                  ) : (
                    <div className=" pt-[18px] pb-[18px]">
                      {filteredCommentsData?.comments?.length > 0 ? (
                        <>
                          <div>
                            {[...(filteredCommentsData?.comments || [])]
                              .sort((a, b) => a.c_value - b.c_value)
                              .map((comment, index) => (
                                <motion.div
                                  key={comment.id + index}
                                  initial={{ opacity: 0, y: 70 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -50 }}
                                  transition={{ duration: 0.5 }}
                                  ref={(el) =>
                                    (currentCommentRef.current[comment.id] = el)
                                  }
                                >
                                  <AllComments
                                    fromNew
                                    commentIdx={index + 1}
                                    comments={comment}
                                    data={premiseData}
                                    refetch={premiseRefetch}
                                    openReplyField={openReplyField}
                                    setOpenReplyField={setOpenReplyField}
                                    replyToCommentID={replyToCommentID}
                                    setReplyToCommentID={setReplyToCommentID}
                                    replyResStat={replyResStat}
                                    setCommentOwner={setCommentOwner}
                                    setOpenAllReplies={setOpenAllReplies}
                                    openAllReplies={openAllReplies}
                                    commentRefetch={commentRefetch}
                                    proImgUrl={proImgUrl}
                                    setReplyField={setReplyField}
                                    replyField={replyField}
                                    replyRef={replyRef}
                                    handleOpenAllReplies={handleOpenAllReplies}
                                    handleReplyTextChange={
                                      handleReplyTextChange
                                    }
                                    handlePostReplyToComment={
                                      handlePostReplyToComment
                                    }
                                    replyLoading={replyLoading}
                                    premiseData={premiseData}
                                    replyTextCount={replyTextCount}
                                    setReplyTextCount={setReplyTextCount}
                                    actTwoEnd={actTwoEnd}
                                    actOneThreshold={actOneThreshold}
                                    openReplyFieldID={openReplyFieldID}
                                    setOpenReplyFieldID={setOpenReplyFieldID}
                                    project_id={premiseData?.project_id}
                                    focusedCValue={focusedCValue}
                                    iconWidth={"w-[87%] md:w-[90%]"}
                                    inpRightMargin={"mr-[47px] md:mr-[120px]"}
                                    addBeatTutorialPop={addBeatTutorialPop}
                                    setAddBeatTutorialPop={
                                      setAddBeatTutorialPop
                                    }
                                    setReplyText={setReplyText}
                                  />
                                </motion.div>
                              ))}
                          </div>
                        </>
                      ) : filteredCommentsData?.counts > 0 &&
                        filteredCommentsData?.comments?.length === 0 ? (
                        <p className=" text-center my-4">
                          Comments Are Private.
                        </p>
                      ) : (
                        <p className=" text-center my-4">
                          No Comments Available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Left Sidebar */}
              <div className=" bg-[#fff] lg:w-[500px] w-full  flex ">
                <VerticalBar
                  replyRef={replyRef}
                  comments={filteredCommentsData?.comments}
                  currentCommentRef={currentCommentRef}
                  handleOpenAllReplies={handleOpenAllReplies}
                  // setReplyField={setReplyField}
                  // replyField={replyField}
                  // onFocusComment={handleFocusComment}
                />
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
                    currentCommentRef,
                    handleOpenAllReplies,
                    setSearchTerm,
                    commentField,
                    setCommentField,
                  }}
                />
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
