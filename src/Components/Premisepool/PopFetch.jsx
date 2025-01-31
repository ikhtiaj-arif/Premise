import React, { useEffect, useState } from "react";
import {
  FaCommentDots,
  FaEllipsisV,
  FaEye,
  FaEyeSlash,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import {
  useCommentPremiseMutation,
  useDeleteLikeMutation,
  useGetCommentByPremiseIdQuery,
  useGetOnePremiseQuery,
  useGetPremiseUserQuery,
  useIsLikePremiseMutation,
  useLikePremiseMutation,
} from "../../app/EndPoints/premisePoolApi";
// import backgroundImg from "../../img/Icons/download.jpg";
import { motion } from "framer-motion";
import { MdKeyboardBackspace } from "react-icons/md";
import { useCreateReplyMutation } from "../../app/EndPoints/commentReply/reply";
import crossIcon from "../../img/Icons/crossIcon.png";
import forwardIcon from "../../img/Icons/forwardIcon.png";
import msgIcon from "../../img/Icons/msgIcon.png";
import userImg from "../../img/Icons/userImg.png";
import Loading from "../../shared/Loading";
import AllComments from "./AllComments";
import LikePopup from "./LikePopup";
import { hideUnhidePremise } from "./PreiseUtils";
import "./Premise.css";

const PopFetch = ({ popClose, data, refetch }) => {
  const {
    bg_img,
    bg_color,
    comments,
    stylings,
    dText,
    transText,
    id,
    user,
    created_by,
    setUserMail,
    setOwnerMail,
    formattedTime,
    formattedDate,
    hidden,
    index,
    setHideDisable,
    hideDisable,
  } = data;

  const [openDotMenu, setOpenDotMenu] = useState(false);
  const { boldStyle, italicStyle, underlineStyle, hexColor } = stylings;
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [postLike, resInfo] = useLikePremiseMutation();
  const [postIsLike, isResInfo] = useIsLikePremiseMutation();
  const [deletePremise, deleteInfo] = useDeleteLikeMutation();
  const [likePopup, setLikePopup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const premiseId = data?.id;

  const {
    data: commentsData,
    isCommentLoading,
    refetch: commentRefetch,
  } = useGetCommentByPremiseIdQuery(premiseId);

  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(premiseId);
  // console.log("premiseData", premiseData);
  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();

  const [postComment, isCommentResInfo] = useCommentPremiseMutation();

  const userName = `${userQuery?.first_name} ${userQuery?.last_name}`;

  useEffect(() => {
    async function fetchData() {
      const body = {
        premise: id,
        user: user,
      };
      const isLikeRes = await postIsLike(body);
      setIsLiked(isLikeRes?.data?.message);
    }
    if (user && id) {
      fetchData();
    }
  }, [user, id, postIsLike, setIsLiked]);

  const body = {
    premise: id,
    user: user,
  };

  const handleDisLikeClick = async () => {
    setDisable(true);
    const deleteResponse = await deletePremise(body);
    if (deleteResponse?.data?.message === true) {
      setDisable(false);
      setIsLiked(!isLiked);
      premiseRefetch();
    }
  };

  const handleLikeClick = async () => {
    setDisable(true);
    const postLikeResponse = await postLike(body);
    if (postLikeResponse?.data) {
      setDisable(false);
      setIsLiked(!isLiked);
      premiseRefetch();
    }
  };

  useEffect(() => {
    if (newComment?.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [newComment]);
  useEffect(() => {
    if (commentsData) {
      setLoading(false);
    }
  }, [commentsData]);

  const handleTextareaChange = (event) => {
    const comment = event.target.value;
    setNewComment(comment);
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    const body = {
      premise: premiseId,
      text: newComment,
      user: user,
    };

    const res = await postComment(body);
    if (res?.data) {
      setNewComment("");
      toast.success("Comment added!", {
        position: toast.POSITION.TOP_CENTER,autoClose: 800,
      });
      setIsLoading(false);
      refetch();
      commentRefetch();
    }
  };

  const [openReplyField, setOpenReplyField] = useState(null);
  const [replyToCommentID, setReplyToCommentID] = useState(null);
  const [commentOwner, setCommentOwner] = useState("");

  const [openAllReplies, setOpenAllReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [createReplyMutation, isReplyResInfo] = useCreateReplyMutation();
  const replyResStat = isReplyResInfo?.status;
  const handleReplyTextChange = (event) => {
    const reply = event.target.value;
    setReplyText(reply);
  };

  //submit reply
  const handlePostReplyToComment = async () => {
    const data = {
      reply: replyToCommentID,
      text: replyText,
    };
    const response = await createReplyMutation(data);
    if (response) {
      refetch();
      setOpenReplyField(null);
      setReplyText("");
    }
  };
  useEffect(() => {}, [openDotMenu]);

  const handleHideUnhidePremise = (id) => {
    hideUnhidePremise(id, setHideDisable, premiseRefetch, setOpenDotMenu);
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[1] ">
      <ToastContainer />
      <div className=" h-[100vh] lg:h-[539px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[1185px] md:mx-auto relative lg:rounded-[8px]">
        {/* close popup */}
        <img
          src={crossIcon}
          alt=""
          className="text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer lgVisible  "
          onClick={() => {
            popClose(false);
          }}
        />
        <MdKeyboardBackspace
          src={crossIcon}
          alt=""
          className="text-[#33B0CA] text-left text-[38px] ml-[24px] my-[8px] z-[1] cursor-pointer lgHidden"
          onClick={() => {
            popClose(false);
            // setOpenReplyField(null);
            // setReplyToCommentID(null);
            //sdfdsfds
          }}
        />

        <div className="flex flex-col gap-[21px] md:gap-[30px] my-auto  lg:flex-row lg:gap-[60px] lg:justify-center lg:!mt-[67px]">
          {/* left div */}
          <div className="border border-[#eaeaea] bg-[#FAFAFA] shadow-lg w-[90%] sm:w-[80%] md:w-[60%] max-w-[383px] min-h-[35vh] lg:h-[380px]  mx-auto lg:mr-0 rounded-[8px]">
            {/* header */}
            <div
              className="flex w-full max-w-[383px] mx-auto justify-between items-center bg-[#FAFAFA] rounded-t-[8px]  p-[8px] md:p-[20px]
                  "
            >
              <div className="block ml-[8px] mt-[4px]">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    created_by?.id === user
                      ? `${URL}/memberpage/#/personaldetails`
                      : `${URL}/memberpage/#/user/${created_by?.id}/personaldetails`
                  }
                >
                  <div className="flex-1 flex gap-1 items-center">
                    <img src={userImg} className="w-[32px]" alt="" />
                    <h4 className="notranslate text-[#252525] font-[600] text-[14px] capitalize cursor-pointer">
                      {created_by?.first_name} {created_by?.last_name}
                    </h4>
                  </div>
                </a>

                <div className="text-[#616161] text-[12px] flex gap-[8px] font-[400]  ml-[36px] leading-3">
                  <p>
                    {formattedDate}, {formattedTime} GMT
                  </p>
                </div>
              </div>
              <div>
                {" "}
                {created_by?.id === user ? (
                  <div className="flex gap-[3px] items-center mr-[2px] relative ">
                    {/* <img
                        data-te-toggle="tooltip"
                        title="Check Mails"
                        src={msgIcon}
                        className="w-8 h-8 cursor-pointer"
                        alt=""
                        onClick={() => setOwnerMail(true)}
                      /> */}
                    {/* <FaRegTrashAlt
                  data-te-toggle="tooltip"
                  title="Delete"
                  
                  onClick={() => handleDelete(id)}
                  className="w-5 h-5 cursor-pointer "
                  alt=""
                /> */}
                    <FaEllipsisV
                      onClick={() => setOpenDotMenu(!openDotMenu)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    {openDotMenu && (
                      <div
                        // ref={dotPopupRef}

                        className="absolute w-[187px]  font-[400] text-[#616161] px-3 bg-[#fafafa] rounded-[8px] shadow-md border border-[#eaeaea] top-[33px] right-[6px] z-10"
                      >
                        {premiseData?.hidden ? (
                          <button
                            className="cursor-pointer flex items-center  gap-[8px] py-2"
                            onClick={() => {
                              handleHideUnhidePremise(id);

                              setOpenDotMenu(null);
                            }}
                          >
                            {" "}
                            <FaEye className="text-[14px]" />{" "}
                            <p className="text-[14px] text-[#252525]">
                              {" "}
                              Unhide From Others
                            </p>{" "}
                          </button>
                        ) : (
                          <button
                            className="cursor-pointer flex items-center  gap-[8px] py-2"
                            onClick={() => {
                              handleHideUnhidePremise(id);
                              setOpenDotMenu(null);
                            }}
                          >
                            {" "}
                            <FaEyeSlash className="text-[14px]" />{" "}
                            <p className="text-[14px]  text-[#252525]">
                              {" "}
                              Hide From Others
                            </p>
                          </button>
                        )}

                        {/* */}
                      </div>
                    )}
                  </div>
                ) : (
                  <img
                    data-te-toggle="tooltip"
                    title="Send Message"
                    src={msgIcon}
                    className="w-8 h-8 cursor-pointer"
                    alt=""
                    onClick={() => setUserMail(true)}
                  />
                )}
              </div>
            </div>
            {/* image */}
            <div
              className=" mx-auto h-[25.6vh] lg:h-[270px] w-full lg:w-[83%] lg:my-auto border border-[#fafafa] relative  rounded-[8px] "
              style={{
                background: `${
                  bg_img
                    ? `url(${bg_img})`
                    : bg_color
                    ? bg_color
                    : `url(${data?.backgroundImage})`
                }`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderRadius: "8px",
                backgroundPosition: "center",
              }}
            >
              <div
                // className="absolute inset-0 flex items-center justify-center backdrop-blur-sm px-2 md:text-xl lg:text-xl border border-[#EAEAEA] bg-[#FAFAFA] rounded-[8px] max-w-[383px]"
                className={`${
                  bg_img || bg_color !== "#FAFAFA"
                    ? "p-[12px]"
                    : "px-[18px] lg:px-0"
                } absolute inset-0  backdrop-blur-sm  text-[16px] rounded-[8px] overflow-hidden break-words`}
              >
                {/* premise text */}
                <p
                  className={`${boldStyle} ${italicStyle} ${underlineStyle} ${hexColor} `}
                >
                  {dText || transText}
                </p>
              </div>
            </div>
          </div>

          {/* right div */}
          <div className=" lg:border bg-[#fff] lg:bg-[#fafafa] lg:shadow-lg border-[#eaeaea] w-[90%] sm:w-[68%] md:w-[60%] max-w-[567px] mx-auto lg:ml-0 h-[49vh] lg:h-[380px] rounded-[8px] flex flex-col gap-[5px]">
            <div className="w-full h-[35vh] lg:h-[238px] !overflow-y-auto lg:premiseScroll">
              {loading ? (
                <div className="z-[1]">
                  <Loading />
                </div>
              ) : commentsData?.length > 0 ? (
                commentsData?.map((comments) => (
                  <motion.div
                    initial={{ opacity: 0, y: 70 }} // Start from slightly below the final position
                    animate={{ opacity: 1, y: 0 }} // Move to the final position
                    exit={{ opacity: 0, y: -50 }} // Exit by moving above the screen
                    transition={{ duration: 0.5 }} // Adjust the duration as needed
                  >
                    <AllComments
                      comments={comments}
                      data={data}
                      refetch={refetch}
                      openReplyField={openReplyField}
                      setOpenReplyField={setOpenReplyField}
                      replyToCommentID={replyToCommentID}
                      setReplyToCommentID={setReplyToCommentID}
                      replyResStat={replyResStat}
                      setCommentOwner={setCommentOwner}
                      setOpenAllReplies={setOpenAllReplies}
                      openAllReplies={openAllReplies}
                    />
                  </motion.div>
                ))
              ) : (
                <p className=" text-center my-4">No comments </p>
              )}
            </div>

            {/* comment and reply div */}
            <div className="h-[10vh] md:h-[142px] flex flex-col justify-between">
              <div className="w-[90%] mx-auto bg-[#eaeaea] h-[2px] hidden md:block" />
              {/* icons */}
              <div className="lg:ml-3 hidden lg:block py-[2px] ">
                <div className="notranslate flex gap-1 space-x-4 items-center px-3 ">
                  <div className=" flex gap-2 ml-[3px]">
                    {isLiked ? (
                      <button disabled={disable}>
                        <FaThumbsUp
                          onClick={handleDisLikeClick}
                          className={`w-5 h-5 text-[#33B0CA]   ${
                            disable ? " cursor-default" : " cursor-pointer"
                          }`}
                        />
                      </button>
                    ) : (
                      <button disabled={disable}>
                        <FaRegThumbsUp
                          onClick={handleLikeClick}
                          className={`w-5 h-5 ${
                            disable ? " cursor-default" : " cursor-pointer"
                          }`}
                        />
                      </button>
                    )}
                    <p
                      className={
                        premiseData?.likes > 0
                          ? "cursor-pointer  text-[16px] font-[500]"
                          : "defaultCursor  text-[16px] font-[500]"
                      }
                      onClick={() =>
                        premiseData?.likes > 0 && setLikePopup(true)
                      }
                    >
                      {premiseData?.likes}{" "}
                      {premiseData?.likes > 1 ? "Likes" : "Like"}
                    </p>
                  </div>
                  <div className=" defaultCursor flex gap-2">
                    <button>
                      <FaCommentDots className=" text-lg  " />
                    </button>
                    <p className=" text-[16px] font-[500]">
                      {commentsData?.length}{" "}
                      {commentsData?.length > 1 ? "Comments" : "Comment"}
                    </p>
                  </div>
                </div>
              </div>

              {openAllReplies || openReplyField ? (
                //  add reply
                <div className="bg-[#F8F8F8] flex justify-between items-stretch mb-[18px] px-3 md:flex-row w-[90%] mx-auto border border-[#EAEAEA] rounded-[8px]">
                  <div className="flex flex-col w-[100%]">
                    <p className="text-[#252525] text-[12px] font-[500]">
                      {commentOwner} :
                    </p>
                    <input
                      type="text"
                      name=""
                      maxLength={200}
                      id=""
                      className="bg-[#F8F8F8] w-[90%] h-[44.27px]  lg:h-[37px]  md:mr-2 focus:border-none focus:outline-none text-[14px] font-[400]"
                      placeholder="Enter your reply..."
                      required
                      onChange={handleReplyTextChange}
                    />
                  </div>
                  <div className=" w-[21px]">
                    {isReplyResInfo?.isLoading ? (
                      <button className="md:w-[21px] cursor-auto " disabled>
                        <img
                          src={forwardIcon}
                          alt=""
                          className=" w-full my-auto cursor-pointer !mt-[37px]"
                        />
                      </button>
                    ) : (
                      <button
                        className="md:w-[21px] "
                        onClick={handlePostReplyToComment}
                      >
                        <img
                          src={forwardIcon}
                          alt=""
                          className=" w-full my-auto cursor-pointer !mt-[37px]"
                        />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                // add comment
                <div className="bg-[#F8F8F8] flex justify-between items-stretch mb-[18px] px-3 md:flex-row w-[90%] mx-auto border border-[#EAEAEA] rounded-[8px]">
                  <input
                    type="text"
                    name=""
                    maxLength={200}
                    id=""
                    className="bg-[#F8F8F8] w-[90%] h-[49.27px]  lg:h-[65px]  md:mr-2 focus:border-none focus:outline-none text-[14px] font-[400]"
                    placeholder="Add a comment..."
                    value={newComment}
                    required
                    onChange={handleTextareaChange}
                  />
                  {isLoading ? (
                    <button className=" md:w-[21px] cursor-auto" disabled>
                      <img
                        src={forwardIcon}
                        alt=""
                        className=" w-full my-auto cursor-pointer lg:!mt-[32px]"
                      />
                    </button>
                  ) : (
                    <button
                      className=" md:w-[21px]"
                      onClick={handleButtonClick}
                      disabled={isDisabled}
                    >
                      <img
                        src={forwardIcon}
                        alt=""
                        className=" w-full my-auto cursor-pointer lg:!mt-[32px]"
                      />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {likePopup && <LikePopup setLikePopup={setLikePopup} id={id} />}
      </div>
    </div>
  );
};

export default PopFetch;
