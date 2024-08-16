import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import {
  useBroadcastPremiseMutation,
  useGetMessageByPremiseIdQuery,
  useSendMsgPremiseMutation,
} from "../../app/EndPoints/premisePoolApi";
import crossIcon from "../../img/Icons/crossIcon.png";
import forwardIcon from "../../img/Icons/forwardIcon.png";
import Loading from "../../shared/Loading";
import "./Premise.css";
import UserMailChat from "./UserMailChat";

const UserMail = ({ setUserMail, data, recipient }) => {
  const { user, id, userFirstName, userLastName } = data;

  const [broadcastPost] = useBroadcastPremiseMutation();
  const [msgPost, msgPostRes] = useSendMsgPremiseMutation();

  const formRef = useRef(null);
  const [broadcastId, setBroadcastId] = useState();
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const [message, setMessage] = useState("");

  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [msgTime, setMsgTime] = useState(null);

  const {
    data: messages,
    isMessageLoading,
    refetch: msgRefetch,
  } = useGetMessageByPremiseIdQuery(broadcastId);

  //console.log(broadcastId);
  useEffect(() => {}, [messages]);

  useEffect(() => {
    async function fetchData() {
      const body = {
        premise: id,
        sender: user,
        recipient: recipient?.id,
      };
      const res = await broadcastPost(body);
      //console.log(res?.data);
      if (res?.data) {
        setBroadcastId(res?.data?.broadcast_id);
        setIsLoadingMessages(false);
      }
    }
    if (user && id) {
      fetchData();
    }
    msgRefetch();
  }, [user, id, broadcastPost, recipient]);

  // button disable for blank field
  useEffect(() => {
    if (message?.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [message?.length]);

  const handlePost = async (e) => {
    setIsDisabled(true);
    e.preventDefault();
    // const message = e.target.message.value;
    if (broadcastId && message && user) {
      setIsLoading(true);
      const body = {
        message: message,
        broadcast: broadcastId,
        sender: user,
      };
      const res = await msgPost(body);
      if (res?.data) {
        setIsLoading(false);
        setMessage("");
        formRef.current.reset();
        setIsDisabled(false);
        msgRefetch();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents adding new line
      handlePost(e); // Calls handlePost function to submit the form
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full mt-[80px] lg:mt-[0px] flex items-center justify-center bg-[#252525b0] z-[10]">
      <div className="bg-[#FAFAFA] w-full  lg:w-[563px] rounded-[8px] h-[100vh] lg:h-[380px] relative">
        <img
          src={crossIcon}
          alt=""
          className="  top-[-10px] right-[-10px] w-8 h-8 cursor-pointer absolute lgVisible"
          onClick={() => setUserMail(false)}
        />

        <MdKeyboardBackspace
          src={crossIcon}
          alt=""
          className="text-[#33B0CA] text-left text-[38px] ml-[24px] mb-[8px] mt-[20px] z-[1] cursor-pointer lgHidden"
          onClick={() => setUserMail(false)}
        />
        {/* close popup */}
        <div className="text-right flex justify-between p-1 text-[16px] font-[500] w-[90%] max-w-[513px] mx-auto">
          <div className="flex items-center ">
            <p className="d text-[#252525] pr-3 py-1">Direct Message</p>
            <div>
              <h4 className=" text-[#33B0CA] ">
                {recipient?.first_name} {recipient?.last_name}
              </h4>
            </div>
          </div>
        </div>
        <div className="h-[2px] bg-[#EAEAEA] w-[90%] mx-auto my-1" />
        <div className="flex flex-col  items-end h-[66vh] lg:h-[310px] justify-between">
          {/* upper part */}
          <div className=" pt-1 h-[60vh] lg:h-[230px] w-[90%] mx-auto overflow-y-auto premiseScroll px-3">
            {isLoadingMessages ? (
              <Loading />
            ) : messages?.count > 0 ? (
              <div>
                {messages?.results?.map((mail) => (
                  <UserMailChat mail={mail} />
                ))}
              </div>
            ) : (
              <p></p>
            )}
          </div>
          {/* post part */}
          <form
            ref={formRef}
            onSubmit={handlePost}
            className="flex justify-between w-[90%] max-w-[513px] gap-2 my-1 px-3 bg-[#F8F8F8]  mx-auto h-[73px] border border-[#EAEAEA] rounded-[8px]"
          >
            <textarea
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              name="message"
              maxLength="170"
              id=""
              className="w-full resize-none max-w-[513px] bg-[#F8F8F8] py-[4px] text-[14px] leading-[18px] text-[#616161] font-[400] focus:border-none focus:outline-none"
              placeholder="Reply..."
            />
            <div className="flex md:items-end mb-1">
              {isLoading ? (
                <button disabled>
                  <img
                    src={forwardIcon}
                    alt=""
                    className=" w-[22px]  my-auto cursor-pointer"
                  />
                </button>
              ) : (
                <button type="submit" disabled={isDisabled}>
                  <img
                    src={forwardIcon}
                    alt=""
                    className=" w-[22px]  my-auto cursor-pointer"
                  />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserMail;
