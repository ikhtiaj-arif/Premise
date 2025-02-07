import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useGetCommentByPremiseIdQuery,
  useGetOnePremiseQuery,
  useGetPremiseBrainstormsDataQuery,
  useGetPremiseEngagementsDataQuery,
  useGetPremiseUserPictureQuery,
} from "../../../app/EndPoints/premisePoolApi";

import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCreateReplyMutation } from "../../../app/EndPoints/commentReply/reply";
import { useFindCommentMutation } from "../../../app/EndPoints/comments/commentAPi";
import AllComments from "../../Premisepool/AllComments";
import TypingLoader from "../../TypingLoader";
import { baseURL } from "../../utils";
import BeatsPop from "../Popups/newTab/BeatsPop";
import BrainstormEngagementsPop from "../Popups/newTab/BrainstormEngagementsPop";
import { loadingData } from "../Premsie.v2";
import LeftSideBar from "./LeftSideBar";
import ProjectInfo from "./ProjectInfo";
import VerticalBar from "./VerticalBar";
import { useGetSavedCharactersQuery } from "../../../app/EndPoints/Characters/Characters";

const PremiseNewTab = () => {
  const { id } = useParams(); // Extract the ID from the route
  const { state } = useLocation();

  const params = state || {};
  const { project_id } = params;

  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(id);

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
    setFilteredCommentsData(res?.data?.data[0]);

    e.target.reset();
  };

  console.log("filteredCommentsData", filteredCommentsData);
  console.log("commentsData", commentsData);

  return (
    <div className="lg:w-[90%] mx-auto h-screen overflow-hidden">
      {!isPremiseLoading && !isCommentLoading && premiseData && commentsData ? (
        <>
          <ProjectInfo {...{ premiseData }} />
          <div className="w-full flex items-start justify-center mx-auto gap-4 mt-2 h-[calc(100vh-78px)]">
            {/* Left Sidebar */}
            <div className="leftSection bg-[#fff] w-[30%]  p-2 pr-0 flex justify-end h-full  overflow-y-auto">
              <LeftSideBar
                {...{
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
                }}
              />
              <VerticalBar />
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
            {isSearchLoading || isCommentLoading ? (
              <div>Loading ....</div>
            ) : (
              <div className="w-full h-full overflow-y-auto lg:premiseScroll mb-10">
                {filteredCommentsData?.comments?.length > 0 ? (
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
                        >
                          <AllComments
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
                            handleReplyTextChange={handleReplyTextChange}
                            handlePostReplyToComment={handlePostReplyToComment}
                            replyLoading={replyLoading}
                            premiseData={premiseData}
                            replyTextCount={replyTextCount}
                            setReplyTextCount={setReplyTextCount}
                            // m_value={m_value}
                            actTwoEnd={actTwoEnd}
                            actOneThreshold={actOneThreshold}
                            openReplyFieldID={openReplyFieldID}
                            setOpenReplyFieldID={setOpenReplyFieldID}
                            project_id={project_id}
                          />
                        </motion.div>
                      ))}
                  </div>
                ) : filteredCommentsData?.counts > 0 &&
                  filteredCommentsData?.comments?.length === 0 ? (
                  <p className=" text-center my-4">Comments Are Private.</p>
                ) : (
                  <p className=" text-center my-4">No Comments Available</p>
                )}
              </div>
            )}
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
