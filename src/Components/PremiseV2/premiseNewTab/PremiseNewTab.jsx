import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useGetCommentByPremiseIdQuery,
  useGetOnePremiseQuery,
  useGetPremiseBrainstormsDataQuery,
  useGetPremiseEngagementsDataQuery,
  useGetPremiseUserPictureQuery,
} from "../../../app/EndPoints/premisePoolApi";

import BeatsPop from "../Popups/newTab/BeatsPop";
import BrainstormEngagementsPop from "../Popups/newTab/BrainstormEngagementsPop";
import LeftSideBar from "./LeftSideBar";
import VerticalBar from "./VerticalBar";
import MainComment from "./MainComment";
import ProjectInfo from "./ProjectInfo";
import TypingLoader from "../../TypingLoader";
import { loadingData } from "../Premsie.v2";
import { motion } from "framer-motion";
import AllComments from "../../Premisepool/AllComments";
import { toast } from "react-toastify";
import { useCreateReplyMutation } from "../../../app/EndPoints/commentReply/reply";
import { baseURL } from "../../utils";

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
    data: brainstormData,
    isBrainstormDataLoading,
    // refetch: premiseRefetch,
  } = useGetPremiseBrainstormsDataQuery(id);

  const {
    data: engagementsData,
    isEngagementsDataLoading,
    // refetch: premiseRefetch,
  } = useGetPremiseEngagementsDataQuery(id);

  const {
    data: commentsData,
    isCommentLoading,
    refetch: commentRefetch,
  } = useGetCommentByPremiseIdQuery(id);

  const [createReplyMutation, isReplyResInfo] = useCreateReplyMutation();
  const replyResStat = isReplyResInfo?.status;
  // const {
  //   data: profileImg,
  //   profileImgLoading,
  //   refetch: profileRefetch,
  // } = useGetPremiseUserPictureQuery(created_by?.id);

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(premiseData?.premiseOwner?.id);

  const proImgUrl = baseURL.concat(profileImg?.[0]?.profile_photo);

  const [beatsPopup, setBeatsPopup] = useState(false);
  const [commonPopup, setCommonPopup] = useState(""); // For "Brainstorms" and "Engagements"

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

  return (
    <div className="lg:w-[90%] mx-auto h-screen overflow-hidden">
      {!isPremiseLoading && !isCommentLoading && premiseData && commentsData ? (
        <>
          <ProjectInfo {...{ premiseData }} />
          <div className="w-full flex items-start gap-4 mt-2 h-[calc(100vh-78px)]">
            {/* Left Sidebar */}
            <div className="leftSection bg-[#fff] w-[30%] p-2 pr-0 flex justify-end h-full  overflow-y-auto">
              <LeftSideBar
                {...{
                  premiseData,
                  setBeatsPopup,
                  setCommonPopup,
                  premiseRefetch,
                  commentRefetch,
                  commentsData,
                  setOpenReplyField,
                  replyField,
                  setReplyField,
                  setOpenReplyFieldID,
                  setOpenAllReplies,
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
            {commentsData?.comments?.length > 0 ? (
              <div>
                {[...(commentsData?.comments || [])] // Create a shallow copy of the array to avoid modifying the original
                  .sort((a, b) => a.c_value - b.c_value) // Sort comments by c_value in ascending order
                  .map((comment, index) => (
                    <motion.div
                      key={index + 1}
                      initial={{ opacity: 0, y: 70 }} // Start from slightly below the final position
                      animate={{ opacity: 1, y: 0 }} // Move to the final position
                      exit={{ opacity: 0, y: -50 }} // Exit by moving above the screen
                      transition={{ duration: 0.5 }} // Adjust the duration as needed
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
            ) : commentsData?.counts > 0 &&
              commentsData?.comments?.length === 0 ? (
              <p className=" text-center my-4">Comments Are Private. </p>
            ) : (
              <p className=" text-center my-4">No Comments Available </p>
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

      {beatsPopup && id && <BeatsPop popClose={setBeatsPopup} id={id} />}
      {commonPopup === "brainstorms" && !isBrainstormDataLoading && id && (
        <BrainstormEngagementsPop
          popClose={setCommonPopup}
          id={id}
          data={brainstormData?.data}
          commonPopup={commonPopup}
        />
      )}
      {commonPopup === "engagements" && !isEngagementsDataLoading && id && (
        <BrainstormEngagementsPop
          popClose={setCommonPopup}
          id={id}
          data={engagementsData}
          commonPopup={commonPopup}
        />
      )}
    </div>
  );
};

export default PremiseNewTab;
