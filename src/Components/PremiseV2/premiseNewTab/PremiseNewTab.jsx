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
import AskIda from "../../SharedVersion/AskIda";
import PopupTextarea from "../../SharedVersion/PopupTextarea";

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

  const [openAllReplies, setOpenAllReplies] = useState(false);
  const [openReplyFieldID, setOpenReplyFieldID] = useState(null);
  const [openReplyField, setOpenReplyField] = useState(null);
  const [replyField, setReplyField] = useState(false);

  const [replyToCommentID, setReplyToCommentID] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [commentOwner, setCommentOwner] = useState("");
  const [replyTextCount, setReplyTextCount] = useState(0);

  const [actOneThreshold, setActOneThreshold] = useState(null);
  const [actTwoEnd, setActTwoEnd] = useState(null);

  useEffect(() => {
    if (commentsData) {
      setFilteredCommentsData(commentsData);
    }
  }, [commentsData]);

  useEffect(() => {
    if (!isPremiseLoading && premiseData?.setC) {
      try {
        // Parse setC only if it exists
        const setCString = premiseData.setC;
        const setCObject = JSON.parse(setCString.replace(/'/g, '"')); // Replace single quotes with double quotes for valid JSON

        const actOne = setCObject["Forward the Act One"];
        const actTwo = setCObject["Forward the Act Two"];

        // Set the thresholds
        setActOneThreshold(actOne[actOne.length - 1]); // Last number of Act One
        setActTwoEnd(actTwo[actTwo.length - 1]); // Last number of Act Two
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
    const reply = event.target.value;
    setReplyTextCount(reply.length);
    setReplyText(reply);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value;
    const data = {
      search_text: searchTerm,
      premise_id: id,
    };

    const res = await findComments(data);
    setFilteredCommentsData(res?.data);

    // e.target.reset();
  };

  console.log("filteredCommentsData", filteredCommentsData);
  console.log("commentsData", commentsData);

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
          <div className="w-full lg:flex items-start relative" >
          
            {/* Left Sidebar */}
            <div className="leftSection bg-[#fff] lg:w-[500px] w-full pr-0 flex justify-end lg:h-[calc(100vh-75px)]">
              <LeftSideBar
                {...{
                  filteredCommentsData,
                  premiseData,
                  premiseRefetch,
                  commentRefetch,
                  commentsData,
                  setOpenReplyField,
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
                }}
              />
            </div>
            {/* right Comment Section */}
            {/* <div
              style={{
                boxShadow: "0px 0px 10px 2px #eaeaea",
              }}
              className="commentSection bg-[#fff] py-2 px-4 rounded-lg rounded-2 w-[68%] h-full overflow-y-auto"
            >
              {[...(commentsData?.comments || [])] // Create a shallow copy of the array to avoid modifying the original
                .sort((a, b) => a.c_value - b.c_value) // Sort comments by c_value in ascending order
                .map((comment, index) => (
                  <MainComment comment={comment} />
                ))}
            </div> */}

            <div className="w-full relative lg:h-[calc(100vh-75px)] lg:overflow-y-auto lg:shadow-[0px_0px_20.6px_0px_rgba(0,0,0,0.15)] lg:ml-3 lg:rounded-t-2xl">
              {isSearchLoading || isCommentLoading ? (
                <div>Loading ....</div>
              ) : (
                <div className="pb-[160px] pt-[18px] lg:pb-[18px]">
                  {filteredCommentsData?.comments?.length > 0 ? (
                    <>
                      <div>
                        {[...(filteredCommentsData?.comments || [])]
                          .sort((a, b) => a.c_value - b.c_value)
                          .map((comment, index) => (
                            <motion.div
                              key={index + 1}
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
                                // m_value={m_value}
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
