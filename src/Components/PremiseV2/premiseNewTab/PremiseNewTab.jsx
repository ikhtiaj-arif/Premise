import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useGetCommentByPremiseIdQuery,
  useGetOnePremiseQuery,
  useGetPremiseUserPictureQuery,
} from "../../../app/EndPoints/premisePoolApi";

import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { MyContext } from "../../../App";
import { useGetSavedCharactersQuery } from "../../../app/EndPoints/Characters/Characters";
import { useCreateReplyMutation } from "../../../app/EndPoints/commentReply/reply";
import { useFindCommentMutation } from "../../../app/EndPoints/comments/commentAPi";
import AllComments from "../../Premisepool/AllComments";
import TypingLoader from "../../TypingLoader";
import { baseURL } from "../../utils";
import { loadingData } from "../Premsie.v2";
import LeftSideBar from "./LeftSideBar";
import ProjectInfo from "./ProjectInfo";
import VerticalBar from "./VerticalBar";

const PremiseNewTab = () => {
  const { id } = useParams(); // Extract the ID from the route
  const { state } = useLocation();
  const currentCommentRef = useRef({});

  // const params = state || {};
  // const { project_id } = params;
  // console.log("project_id", project_id);
  const { setCurrentlyOpenedCommentID } = useContext(MyContext);
  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(id);

  // console.log("premiseData", premiseData.available_for_sale);

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

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(premiseData?.premiseOwner?.id);

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

  const [searchTerm, setSearchTerm] = useState("");

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
      console.log("premiseData setC:", premiseData?.setC); // Check what setC looks like

      try {
        const setCString = premiseData?.setC;

        // Step 2: Check if setC is already an object or a string
        if (typeof setCString === "string") {
          const setCObject = JSON.parse(setCString.replace(/'/g, '"')); // Parse if it's a string
          console.log("Parsed setCObject:", setCObject); // Log parsed object to ensure it's correct

          const actOne = setCObject["Forward the Act One"];
          const actTwo = setCObject["Forward the Act Two"];

          // Step 3: Set the thresholds
          setActOneThreshold(actOne); // Last number of Act One
          setActTwoEnd(actTwo[actTwo.length - 1]); // Last number of Act Two

          console.log("actOneThreshold:", actOne); // Check if actOneThreshold is being set correctly
          console.log("actTwoEnd:", actTwo[actTwo.length - 1]); // Check if actTwoEnd is being set correctly
        } else {
          // If setC is already an object, handle it directly
          const setCObject = setCString; // No need to parse
          console.log("Direct setCObject:", setCObject);

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

  const handleOpenAllReplies = (id, commenterName) => {
    setOpenAllReplies(true);
    setOpenReplyFieldID(id);
    setReplyToCommentID(id);
    // setReplyToCommentID(comments?.id);
    // setCurrentlyOpenedCommentID(comments?.id);
    setCurrentlyOpenedCommentID(id);
    setCommentOwner(commenterName);
  };

  return (
    <div className="w-[95%] max-w-[1445px] mx-auto">
      {!isPremiseLoading && !isCommentLoading && premiseData && commentsData ? (
        <>
          <ProjectInfo {...{ premiseData }} />
          <div className="w-full lg:flex relative">
            {/* Left Sidebar */}
            <div className=" bg-[#fff] lg:w-[500px] w-full pr-0 flex ">
              {/* <div className=" bg-[#fff] lg:w-[500px] w-full pr-0 flex lg:h-[calc(100vh-75px)]"> */}
              <LeftSideBar
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
              className="w-full relative lg:h-[83vh] lg:overflow-y-auto lg:shadow-[0px_0px_20.6px_0px_rgba(0,0,0,0.15)] lg:ml-3 lg:rounded-t-2xl"
            >
              {isSearchLoading || isCommentLoading ? (
                <div>
                  <TypingLoader />
                </div>
              ) : (
                <div className="pb-[160px] pt-[18px] lg:pb-[18px]">
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
                                iconWidth={"w-[87%] md:w-[90%]"}
                                inpRightMargin={"mr-[47px] md:mr-[120px]"}
                              />
                            </motion.div>
                          ))}
                      </div>
                    </>
                  ) : filteredCommentsData?.counts > 0 &&
                    filteredCommentsData?.comments?.length === 0 ? (
                    <p className=" text-center my-4">Comments Are Private.</p>
                  ) : (
                    <p className=" text-center my-4">No Comments Available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center mx-auto z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative rounded-[8px] h-[100px] bg-[#fafafa] w-[90%] lg:w-[35%] flex items-center">
            <TypingLoader data={loadingData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiseNewTab;
