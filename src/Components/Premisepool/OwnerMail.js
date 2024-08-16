import React, { useEffect, useState } from "react";
import {
    useAllUserBroadcastQuery,
    useGetMessageByPremiseIdQuery,
    useSendMsgPremiseMutation,
} from "../../app/EndPoints/premisePoolApi";
import crossIcon from "../../img/Icons/crossIcon.png";
import forwardIcon from "../../img/Icons/forwardIcon.png";
import userIcon from "../../img/Icons/userImg.png";
import Loading from "../../shared/Loading";

const OwnerMail = ({ setOwnerMail, data }) => {
  const { user, id } = data;
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const { data: allUserBroadcast } = useAllUserBroadcastQuery(id);

  const [roomIds, setRoomIds] = useState([]);
  const [broadcastId, setBroadcastId] = useState(null);

  const [message, setMessage] = useState("");

  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { data: allMessages, isMsgLoading } =
    useGetMessageByPremiseIdQuery(broadcastId);
  const [msgPost] = useSendMsgPremiseMutation();

  useEffect(() => {
    if (roomIds?.length === 0) {
      setIsLoadingMessages(false);
    } else if (roomIds?.length > 0) {
      setBroadcastId(roomIds[0]?.id);
      setIsLoadingMessages(false);
    }
  }, [roomIds]);

  useEffect(() => {
    if (allUserBroadcast) {
      const rooms = allUserBroadcast?.results.map((b) => b);
      setRoomIds(rooms);
    }
  }, [allUserBroadcast, user]);

  // button disable for blank field
  useEffect(() => {
    if (message?.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [message?.length]);

  const handleMessageClick = (id) => {
    setBroadcastId(id);
  };

  const handlePost = async (e) => {
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
      // console.log(res);
      if (res?.data) {
        setIsLoading(false);
        setMessage("");
        e.target.reset();
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] bg-opacity-60 z-[1]">
      <div className="bg-[#FAFAFA] rounded-[8px] shadow-lg w-1/3 md:!w-[1165px]  relative">
      <img src={crossIcon} alt=""
            className=" top-[-10px] right-[-10px] w-8 h-8 cursor-pointer absolute"
            onClick={() => setOwnerMail(false)}
          />
        {isLoadingMessages ? (
          <Loading />
        ) : roomIds?.length === 0 ? (
          <div className="h-[300px]">
            {/* close popup */}
            {/* <div className="text-right flex justify-end p-1">
              <FaTimesCircle
                className="text-red-500 w-5 h-5 cursor-pointer"
                onClick={() => setOwnerMail(false)}
              />
            </div> */}
            <h1 className=" text-center  mt-10 ">No messages available</h1>
          </div>
        ) : (
          <div className="flex gap-[40px] mx-auto">
            {/* left side */}
            <div className="h-[380px] md:!w-[363px] border p-4 border-[#EAEAEA] rounded-[8px] !overflow-y-auto premiseScroll !my-20 ml-[98px] shadow-[#eaeaea] shadow-md">
              {roomIds.map((r) => (
                <div
                  key={r?.id}
                  className={`flex items-center gap-2 mb-2 rounded-[8px] cursor-pointer p-1  text-[12px] font-[500]  ${
                    broadcastId === r.id ? "bg-[#33B0CA] text-white py-[6px] px-2" : ""
                  }`}
                  onClick={() => handleMessageClick(r?.id)}
                >
                    <img src={userIcon} alt="" className="w-6 h-6" />
                  <p
                    className={
                      broadcastId === r?.id ? " text-white" : "text-[#616161]"
                    }
                  >
                    {r?.sender?.first_name} {r?.sender?.last_name}
                  </p>
                </div>
              ))}
            </div>

            {/* right div */}
            <div className="flex flex-col justify-between md:!w-[563px] border border-[#EAEAEA] rounded-[8px] !pt-[25px] !my-20 shadow-[#eaeaea] shadow-md">
              {/* close popup */}
              {/* <div className="text-right flex justify-end p-1">
                <FaTimesCircle
                  className="text-red-500 w-5 h-5 cursor-pointer"
                  onClick={() => setOwnerMail(false)}
                />
              </div> */}

              {/* upper part */}
              <div className=" border-b h-[250px] border-[#EAEAEA] !overflow-y-scroll premiseScroll mx-3">
                {isMsgLoading ? (
                  <Loading />
                ) : (
                  <div className="flex flex-col gap-2">
                    {allMessages?.results?.length > 0 &&
                      allMessages?.results?.map((m) => (
                        <div className="flex gap-2 bg-[#F8F8F8]">
                          <img src={userIcon} alt="" className="6 h-6" />
                          <div className="border border-[#EAEAEA] rounded-[8px] w-full px-2 py-2">
                            <h4 className=" text-[#252525] font-[500] text-[12px] leading-[18px]">
                              {m?.sender?.first_name} {m?.sender?.last_name}
                            </h4>
                            <p className="text-[#616161] font-[400] text-[12px] leading-[18px]">{m?.message}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* post part */}
              <form
                onSubmit={handlePost}
                className="flex gap-2  justify-between mt-[8px] mb-[18px] mx-3 px-2 border bg-[#F8F8F8] border-[#eaeaea] rounded-[8px]"
              >
                <textarea
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                  name="message"
                  id=""
                  className="w-full focus:border-none bg-[#F8F8F8] text-[#616161] text-[12px] font-[400] h-[73px] focus:outline-none px-1"
                  placeholder="Type here"
                />
                <div className="flex items-end mb-1">
                {isLoading ? (
                 <span className="loading loading-spinner text-[#33B0CA] h-5 w-5 my-auto cursor-auto"></span>
                ) : (
                  <button
                    type="submit"
                    disabled={isDisabled}
                    className=""
                  >
                    <img src={forwardIcon} alt="" className=" w-[28px]   cursor-pointer" />
                  </button>
                   
                )}
                </div>
          
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerMail;
