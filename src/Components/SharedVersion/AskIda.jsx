import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../App";
import { useCommentPremiseMutation } from "../../app/EndPoints/premisePoolApi";
import NoAccessLbPopUp from "../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../PricingModel/NoAccessPopUp";
import { baseURL } from "../utils";

const AskIda = ({
  id,
  user,
  commentRefetch,
  setOpenAllReplies,
  setOpenReplyFieldID,
  lastCommentRef,
  premiseOwner,
  isLoading,
  setIsLoading,setNoAccessPopup,setService
}) => {
  const { currentUser } = useContext(MyContext);
  const [postComment, { isLoading: isPostLoading }] =
    useCommentPremiseMutation();

  const token = localStorage.getItem("accessToken");
  const header = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    if (premiseOwner?.id === currentUser?.id) {
      checkAllowance("PP_AllowBrainstoming");
    } else {
      checkAllowance("PP_AllowInteraction");
    }
  };

  const checkAllowance = async (flag) => {
    const res = await fetchUserAccess(`${currentUser?.id}/${flag}`);
    console.log(`${flag} res`, res);
    if (res?.access === "No") {
      setNoAccessPopup(res);
      setService(flag);
      setIsLoading(false);
    } else {
      handleSubmitComment();
    }
  };

  const handleSubmitComment = async () => {
    setIsLoading(true);

    try {
      // Fetch the existing comment data
      const response = await axios.get(
        `${baseURL}/ideamall/GetCommentAPI/${id}`,
        {
          headers: header,
        }
      );

      if (response) {
        const body = {
          premise: id,
          text: "Please proceed further Ida!",
          ask_ida:true,
          user: user,
          C: response?.data?.counts + 1, // Update the comment count
          is_question: false,
        };

        // Post the new comment
        const res = await postComment(body);

        // if (res?.error) {
        //   toast.error("Failed to add comment. Please try again.", {
        //     position: toast.POSITION.TOP_CENTER,
        //     autoClose: 800,
        //   });

        //   setIsLoading(false);
        // } else {
        setIsLoading(false);

        // here scroll all the way down to a div using ref
        setTimeout(() => {
          commentRefetch(); // Refetch the comments after adding the new one
          setOpenAllReplies(true);
          setOpenReplyFieldID(res?.data?.id);
        }, 1000);

        setTimeout(() => {
          if (lastCommentRef.current) {
            lastCommentRef.current.scrollTo({
              top: lastCommentRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
          toast.success("Comment added!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1600,
          });
        }, 1100);
        // }
      }
    } catch (error) {
      toast.error("Failed to add comment. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1600,
      });

      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="my-1 text-center ">
        <button
          disabled={isLoading}
          onClick={handleButtonClick}
          className={` border-none rounded-[6px] px-4 py-1 text-white text-[14px] font-[600] leading-[21px] ${
            isLoading ? "bg-[#ACDDE7]   cursor-default" : "bg-[#33B0CA]"
          }`}
        >
          Ask Ida for more!
        </button>
      </div>
      
    </div>
  );
};

export default AskIda;
