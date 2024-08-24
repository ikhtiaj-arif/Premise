import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaCommentDots,
  FaEllipsisV,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import {
  useCommentPremiseMutation,
  useDeleteLikeMutation,
  useGetCommentByPremiseIdQuery,
  useGetOnePremiseQuery,
  useGetPremiseUserPictureQuery,
  useGetPremiseUserQuery,
  useIsLikePremiseMutation,
  useLikePremiseMutation,
} from "../../app/EndPoints/premisePoolApi";
import msgIcon from "../../img/Icons/msgIcon.png";
// import backgroundImg from "../../img/Icons/download.jpg";
import { motion } from "framer-motion";
import { MdKeyboardBackspace } from "react-icons/md";
import { useCreateReplyMutation } from "../../app/EndPoints/commentReply/reply";
import crossIcon from "../../img/Icons/crossIcon.png";
import forwardIcon from "../../img/Icons/forwardIcon.png";
import userImg from "../../img/Icons/userImg.png";
import BtnLoading from "../../shared/BtnLoading";
import Loading from "../../shared/Loading";
import { URL } from "../utils";
import AllComments from "./AllComments";
import HideOptionPop from "./Components/HideOptionPop";
import DeletePremise from "./DeletePremise";
import LikePopup from "./LikePopup";
import { hideUnhidePremise } from "./PreiseUtils";
import "./Premise.css";
import { MyContext } from "../../App";

const Popup = ({ popClose, data, refetch, transText }) => {
  const {
    bg_img,
    bg_color,
    comments,
    stylings,
    dText,
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
    hiddenCountRefetch,
    project_id
  } = data;


  const [openDotMenu, setOpenDotMenu] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [postLike, resInfo] = useLikePremiseMutation();
  const [postIsLike, isResInfo] = useIsLikePremiseMutation();
  const [deletePremise, deleteInfo] = useDeleteLikeMutation();
  const [likePopup, setLikePopup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [commentField, setCommentField] = useState(false);
  const [replyField, setReplyField] = useState(false);
  const [openHidePop, setOpenHidePop] = useState(false);
  const [isCommentQuestion, setIsCommentQuestion] = useState(false);
  const [cValue, setCvalue] = useState(null);

  const [newComment, setNewComment] = useState("");
  const commentRef = useRef(null);
  const replyRef = useRef(null);

  useEffect(() => {
    if (commentField && commentRef?.current) {
      commentRef?.current?.focus();
      setReplyField(false);
    }
    if (replyField && replyRef?.current) {
      replyRef?.current?.focus();
      setCommentField(false);
    }
  }, [replyField, commentField]);

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(created_by?.id);

  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  const { boldStyle, italicStyle, underlineStyle, hexColor } = stylings;
  const premiseId = data?.id;
  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(premiseId);

  const {
    data: commentsData,
    isCommentLoading,
    refetch: commentRefetch,
  } = useGetCommentByPremiseIdQuery(premiseId);

  const handleDelete = (id) => {
    setIsDelete(id);
  };

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

  // useEffect(() => {
  //   setCvalue(parseInt(commentsData?.comments?.length) + 1);
  // }, [commentsData]);

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
    if (newComment.endsWith("?")) {
      setIsCommentQuestion(true);
    } else {
      setIsCommentQuestion(false);
    }

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
  const [textCount, setTextCount] = useState(0);

  const handleTextareaChange = (event) => {
    const comment = event.target.value;
    setTextCount(comment.length);
    setNewComment(comment);
  };


useEffect(()=> {
  const commentArray = commentsData?.comments;

  const lastCValue = commentArray?.[commentArray.length - 1]?.c_value + 1;

  setCvalue(lastCValue)

}, [commentsData])


  const handleButtonClick = async () => {
    setIsLoading(true);
    const body = {
      premise: premiseId,
      text: newComment,
      user: user,
      C: cValue,
      is_question: isCommentQuestion,
    };

    const res = await postComment(body);

    if (res?.data) {
      // refetch();
      setNewComment("");
      setTextCount(0);
      toast.success("Comment added!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      commentRefetch();
      setIsLoading(false);
    }
  };

  const [openReplyField, setOpenReplyField] = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyToCommentID, setReplyToCommentID] = useState(null);
  const [commentOwner, setCommentOwner] = useState("");

  const [openAllReplies, setOpenAllReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [createReplyMutation, isReplyResInfo] = useCreateReplyMutation();
  const replyResStat = isReplyResInfo?.status;

  const [replyTextCount, setReplyTextCount] = useState(0);
  const handleReplyTextChange = (event) => {
    const reply = event.target.value;
    setReplyTextCount(reply.length);
    setReplyText(reply);
  };

  //submit reply
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
  useEffect(() => {}, [openDotMenu]);

  const handleHideUnhidePremise = (id) => {
    hideUnhidePremise(id, setHideDisable, premiseRefetch, setOpenDotMenu);
  };

  const dotPopupRef = useRef();
  useEffect(() => {
    const closeMenu = (e) => {
      if (!dotPopupRef?.current?.contains(e.target)) {
        if (!e.target.closest(".absolute")) {
          setOpenDotMenu(null);
        }
      }
    };
    document.body.addEventListener("mousedown", closeMenu);

    return () => document.body.removeEventListener("mousedown", closeMenu);
  }, []);

// console.log("commentsData", commentsData);
  

  if (isPremiseLoading) {
    return <>Loading...</>;
  } else
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[1] ">
        <ToastContainer />
        <div className=" h-[100vh] lg:h-[490px] mb-[20px]  lg:mb-0 xl:h-[621px] lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[1119px] xl:w-[1185px] md:mx-auto relative lg:rounded-[8px]">
          {/* close popup */}
          <img
            src={crossIcon}
            alt=""
            className="text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer lgVisible  "
            onClick={() => {
              popClose(false);
              refetch();
            }}
          />
          <MdKeyboardBackspace
            src={crossIcon}
            alt=""
            className="text-[#33B0CA] text-left text-[38px] my-[8px] mt-[30px] ml-[24px] z-[1] cursor-pointer lgHidden"
            onClick={() => {
              popClose(false);
              // setOpenReplyField(null);
              // setReplyToCommentID(null);
              //sdfdsfds
            }}
          />

          <div className="flex flex-col gap-[21px] lg:gap-[32px] lg my-auto lg:flex-row lg:justify-center ">
            {/* left div */}
            <div className="border border-[#eaeaea] relative bg-[#FAFAFA] shadow-lg w-[86%] sm:w-[80%] md:w-[33%] max-w-[336px] h-[33vh] lg:h-[460px] xl:h-[563px] lg:mt-[18px] xl:mt-[32px]  mx-auto lg:mx-0 lg:ml-[32px] xl:ml-[32px] rounded-[8px]">
              {/* header */}
              <div className="flex w-full max-w-[383px] mx-auto justify-between items-center bg-[#FAFAFA] rounded-t-[8px]  p-[8px] md:py-[20px] md:px-[16px]">
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
                      {profileImg?.[0]?.profile_photo ? (
                        <img
                          src={proImgUrl}
                          className="h-[31.9px] w-[32px] rounded-full object-cover border border-[#eaeaea]"
                          alt=""
                        />
                      ) : (
                        <img
                          src={userImg}
                          className="w-[32px] h-[31.9px] rounded-full border border-[#eaeaea]"
                          alt=""
                        />
                      )}
                      <div>
                        <h4 className="text-[#252525] font-[600] text-[14px] capitalize cursor-pointer leading-[21px]  hover:text-[#33B0CA]">
                          {created_by?.first_name} {created_by?.last_name}
                        </h4>
                        <p className="text-[#616161] text-[12px] flex gap-[8px] font-[400] leading-[18px]">
                          {formattedDate}, {formattedTime}
                        </p>
                      </div>
                    </div>
                  </a>
                  {/* 
                <div className="text-[#616161] text-[12px] flex gap-[8px] font-[400]  ml-[36px] leading-3">
                  <p>
                    {formattedDate}, {formattedTime} GMT
                  </p>
                </div> */}
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
                        onClick={() => setOpenDotMenu(!openHidePop)}
                        className="w-5 h-5 cursor-pointer"
                      />

                      {openDotMenu && (
                        <div
                          ref={dotPopupRef}
                          className="absolute w-[186.99px] font-[400] text-[#616161] px-3 bg-[#fafafa] rounded-[8px] shadow-md border border-[#eaeaea] top-[25px] right-[3px] py-[8px] z-10"
                        >
                          <button
                            onClick={() => {
                              setOpenHidePop(!openHidePop);
                              setOpenDotMenu(null);
                            }}
                            className="cursor-pointer"
                          >
                            <p className="text-[14px] w-full font-[500] break-none hover:text-[#33B0CA] text-[#252525]">
                              {" "}
                              Make Private
                            </p>{" "}
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(id);
                              setOpenDotMenu(null);
                            }}
                            className="cursor-pointer "
                          >
                            <p className="text-[14px] w-full font-[500]  hover:text-[#33B0CA] break-none text-[#252525]">
                              {" "}
                              Delete Premise
                            </p>{" "}
                          </button>

                          {/* */}
                        </div>
                      )}
                      {openHidePop && (
                        <HideOptionPop
                          setOpenHidePop={setOpenHidePop}
                          id={premiseId}
                          refetch={premiseRefetch}
                          user={user}
                          filter_flag={premiseData?.filter_flag}
                          comment_filter_flag={premiseData?.comment_filter_flag}
                          visible_to={premiseData?.visible_to}
                          hiddenCountRefetch={hiddenCountRefetch}
                        />
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
                className=" mx-auto h-[25.6vh] lg:h-[225px] xl:h-[270px]  w-full lg:w-[88%] lg:my-auto border border-[#eaeaea]  relative  rounded-[8px] "
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
                //   style={{
                //     background: `${
                //       bg_color && bg_color

                //     }`,

                //     borderRadius: "8px",

                //   }}
              >
                {/* {bg_img &&  <img src={bg_img} alt="" className="rounded-[8px] bg-cover bg-no-repeat h-[25.6vh] lg:h-[270px]  w-full " />} */}
                <div
                  // className="absolute inset-0 flex items-center justify-center backdrop-blur-sm px-2 md:text-xl lg:text-xl border border-[#EAEAEA] bg-[#FAFAFA] rounded-[8px] max-w-[383px]"
                  className={`${
                    bg_img || bg_color !== "#FAFAFA"
                      ? "p-[12px]"
                      : "px-[18px] "
                  } absolute inset-0  backdrop-blur-sm  text-[14px] rounded-[8px] overflow-hidden break-words`}
                >
                  {/* premise text */}
                  {transText ? (
                    <p
                      className={`${boldStyle} ${italicStyle} ${underlineStyle} ${hexColor} `}
                    >
                      {transText}
                    </p>
                  ) : (
                    <p
                      className={`${boldStyle} ${italicStyle} ${underlineStyle} ${hexColor} `}
                    >
                      {dText}
                    </p>
                  )}
                </div>
              </div>
              <div className="hidden md:flex h-[10vh] md:h-[116px] mt-[8px]  flex-col justify-between">
                {/* <div className="w-[90%] mx-auto bg-[#eaeaea] h-[2px] hidden md:block" /> */}
                {/* icons */}
                <div className="lg:ml-3 hidden lg:block py-[2px] ">
                  <div className="notranslate flex gap-1 space-x-4 items-center px-3 ">
                    <div className=" flex gap-2 ml-[3px]">
                      {isLiked ? (
                        <button>
                          <FaThumbsUp
                            onClick={handleDisLikeClick}
                            className={`w-6 h-6 text-[#33B0CA]   
                              `}
                          />
                        </button>
                      ) : (
                        <button>
                          <FaRegThumbsUp
                            onClick={handleLikeClick}
                            className={`w-6 h-6 
                              `}
                          />
                        </button>
                      )}
                      <p
                        className={
                          premiseData?.likes > 0
                            ? "cursor-pointer  text-[14px] font-[500]"
                            : "defaultCursor  text-[14px] font-[500]"
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
                      <button
                        onClick={() => {
                          setOpenReplyField(null);
                          setCommentField(!commentField);
                        }}
                      >
                        <FaCommentDots className=" text-[24px]  " />
                      </button>
                      <p className=" text-[14px] font-[500]">
                        {commentsData?.counts}{" "}
                        {commentsData?.counts > 1 ? "Comments" : "Comment"}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div>
                  <div className="bg-[#F8F8F8] relative flex justify-between items-stretch md:mb-[16px] pl-3 md:flex-row w-[90%] mx-auto border border-[#EAEAEA] rounded-[8px] mt-[8px]">
                    {created_by?.id === user ? (
                      <textarea
                        ref={commentRef}
                        type="text"
                        name=""
                        maxLength={250}
                        id=""
                        className="bg-[#F8F8F8] resize-none leading-[21px] rounded-[8px] w-[100%] h-[49.27px] lg:h-[83px] xl:h-[134px]  focus:border-none focus:outline-none text-[14px] py-[2px] pr-[55px] font-[400]"
                        placeholder="Add a comment..."
                        value={newComment}
                        required
                        onChange={handleTextareaChange}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleButtonClick();
                            event.currentTarget.blur();
                          }
                        }}
                      />
                    ) : (
                      <textarea
                        ref={commentRef}
                        type="text"
                        name=""
                        maxLength={150}
                        id=""
                        className="bg-[#F8F8F8] resize-none leading-[21px] rounded-[8px] w-[100%] h-[49.27px] lg:h-[83px] xl:h-[134px] focus:border-none focus:outline-none text-[14px] py-[2px] pr-[55px] font-[400]"
                        placeholder="Add a comment..."
                        value={newComment}
                        required
                        onChange={handleTextareaChange}
                        onKeyDown={(event) => {
                          // console.log('Key pressed:', event.key);
                          if (event.key === "Enter") {
                            handleButtonClick();
                            event.currentTarget.blur();
                          }
                        }}
                      />
                    )}
                    <div className="">
                      {isLoading ? (
                        <div className=" absolute top-[29%]  lg:top-[20px] xl:top-[104px] right-[20px]">
                          <BtnLoading />
                        </div>
                      ) : (
                        <button
                          className="absolute top-[29%] lg:top-[20px] xl:top-[74px] right-[20px] md:w-[21px]"
                          onClick={handleButtonClick}
                        >
                          <img
                            src={forwardIcon}
                            alt=""
                            className=" w-full my-auto cursor-pointer lg:!mt-[32px]"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block absolute bottom-[8px] md:bottom-[2px] xl:bottom-[8px] right-[16px]">
                {created_by?.id === user ? (
                  <p className="text-[12px] font-[400] leading-[14px]  text-[#616161]">
                    {textCount}/250
                  </p>
                ) : (
                  <p className="text-[12px] font-[400] leading-[14px]  text-[#616161]">
                    {textCount}/150
                  </p>
                )}
              </div>
            </div>

            {/* right div */}
            <div data-reply className=" lg:border lg:mt-[18px] xl:mt-[32px]  bg-[#fff] lg:bg-[#fafafa] lg:shadow-lg border-[#eaeaea] w-[90%] sm:w-[68%] md:w-[70%] lg:w-[686px] xl:w-[753px] mx-auto lg:ml-0 h-[40vh] lg:h-[460px] xl:h-[563px] rounded-[8px] flex flex-col gap-[5px]">
              <div className="w-full h-[35vh] lg:h-[auto] py-[12px] !overflow-y-auto lg:premiseScroll">
                {loading ? (
                  <div className="z-[1]">
                    <Loading />
                  </div>
                ) : commentsData?.comments?.length > 0 ? (
                  commentsData?.comments?.map((comments, commentIdx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 70 }} // Start from slightly below the final position
                      animate={{ opacity: 1, y: 0 }} // Move to the final position
                      exit={{ opacity: 0, y: -50 }} // Exit by moving above the screen
                      transition={{ duration: 0.5 }} // Adjust the duration as needed
                    >
                      <AllComments
                        commentIdx={commentIdx + 1}
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
                      />
                    </motion.div>
                  ))
                ) : commentsData?.counts > 0 &&
                  commentsData?.comments?.length === 0 ? (
                  <p className=" text-center my-4">
                    The Comments Are Private.{" "}
                  </p>
                ) : (
                  <p className=" text-center my-4">No Comments Available </p>
                )}
              </div>

              {/* comment and reply div */}
              <div className="md:hidden h-[10vh] md:h-[116px] flex flex-col justify-between">
                <div className="w-[90%] mx-auto bg-[#eaeaea] h-[2px] hidden md:block" />

                <div className="  bg-[#F8F8F8] relative flex justify-between items-stretch md:mb-[12px] pl-3 md:flex-row w-[90%] mx-auto border border-[#EAEAEA] rounded-[8px]">
                  {created_by?.id === user ? (
                    <textarea
                      ref={commentRef}
                      type="text"
                      name=""
                      maxLength={250}
                      id=""
                      className="bg-[#F8F8F8] resize-none leading-[21px] rounded-[8px] w-[85%] md:w-[100%]  h-[49.27px]  lg:h-[65px]  focus:border-none focus:outline-none text-[14px] py-[2px] md:pr-[55px] font-[400]"
                      placeholder="Add a comment..."
                      value={newComment}
                      required
                      onChange={handleTextareaChange}
                      onKeyDown={(event) => {
                        // console.log('Key pressed:', event.key);
                        if (event.key === "Enter") {
                          handleButtonClick();
                        }
                      }}
                    />
                  ) : (
                    <textarea
                      ref={commentRef}
                      type="text"
                      name=""
                      maxLength={150}
                      id=""
                      className="bg-[#F8F8F8] resize-none leading-[21px] rounded-[8px] w-[85%] md:w-[100%] h-[49.27px]  lg:h-[65px]  focus:border-none focus:outline-none text-[14px] py-[2px] md:pr-[55px] font-[400]"
                      placeholder="Add a comment..."
                      value={newComment}
                      required
                      onChange={handleTextareaChange}
                      onKeyDown={(event) => {
                        // console.log('Key pressed:', event.key);
                        if (event.key === "Enter") {
                          handleButtonClick();
                        }
                      }}
                    />
                  )}
                  <div className="">
                    {isLoading ? (
                      <div className="md:w-[40px] absolute right-[16px] bottom-[50%] md:bottom-[20%] ">
                        <BtnLoading />
                      </div>
                    ) : (
                      <button
                        className=" md:w-[21px] absolute right-[8px] md:right-[16px] bottom-[50%]"
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
                  <div className=" md:hidden absolute bottom-[4px] right-[2px]">
                    {created_by?.id === user ? (
                      <p className="text-[12px] font-[400] leading-[14px]  text-[#616161]">
                        {textCount}/250
                      </p>
                    ) : (
                      <p className="text-[12px] font-[400] leading-[14px]  text-[#616161]">
                        {textCount}/150
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isDelete && (
            <DeletePremise
              setIsDelete={setIsDelete}
              refetch={refetch}
              isDelete={isDelete}
              popClose={popClose}
            />
          )}
          {likePopup && (
            <LikePopup setLikePopup={setLikePopup} id={premiseData?.id} />
          )}
        </div>
      </div>
    );
};
export default Popup;
