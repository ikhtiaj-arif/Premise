"use client";

import { useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import { MdReply } from "react-icons/md";
import AskIda from "../../../SharedVersion/AskIda";

const ChatArea = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "May be: Nihal discovers a secret government document revealing Earth's imminent demise; she panics but confides in Aarav and Dev, forming a plan.",
      sender: "other",
      timestamp: "2:11 PM",
      name: "Ida",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ida",
    },
    {
      id: "2",
      text: "OR May be: Nihal, at a tense meeting with Meera and Vikram, cleverly thwarts their sabotage attempt, establishing her resolve.",
      sender: "other",
      timestamp: "2:11 PM",
      name: "Ida",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ida",
    },
    {
      id: "3",
      text: "Do Think About: How do Nihal's leadership qualities evolve post-Government's revelation and thwarting Meera's plans?",
      sender: "other",
      timestamp: "2:11 PM",
      name: "Ida",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ida",
    },
    {
      id: "4",
      text: "Her leadership evolves from reactive to proactive. She transforms from someone who discovers secrets to someone who actively shapes outcomes and protects those around her.",
      sender: "user",
      timestamp: "2:15 PM",
      name: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      replyingTo: "3",
    },
  ]);

  const [textValue, setTextValue] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});

  const handleSendMessage = () => {
    if (textValue.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: textValue,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        replyingTo: replyingTo?.id,
        avatar: "👤",
        name: "You",
      };

      setMessages([...messages, newMessage]);
      setTextValue("");
      setReplyingTo(null);
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        0
      );
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const handleScrollToOriginal = (messageId) => {
    const element = messageRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight-message");
      setTimeout(() => element.classList.remove("highlight-message"), 2000);
    }
  };

  const getReplyingToMessage = (messageId) => {
    return messages.find((msg) => msg.id === messageId);
  };

  const charCount = textValue.length;
  const maxChars = 250;

  return (
    <div className="bg-[#F0F2F5] h-screen flex flex-col w-full rounded-lg">
      {/* Messages Container */}
      <div className="p-3 xxs:h-[calc(69vh-300px)] md:h-[calc(67vh-300px)] lg:h-[calc(95vh-300px)] overflow-y-auto space-y-4">
        {messages.map((message) => {
          const repliedToMessage = message.replyingTo
            ? getReplyingToMessage(message.replyingTo)
            : null;

          return (
            <div
              key={message.id}
              ref={(el) => {
                if (el) messageRefs.current[message.id] = el;
              }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } group`}
            >
              <div
                className={`flex gap-2 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                } max-w-[681px]`}
              >
                {/* Avatar */}
                <img
                  src={message.avatar || "/placeholder.svg"}
                  alt={message.name}
                  className={`w-12 h-12 rounded-full ${
                    message.sender === "user" && " border-2 border-[#00C3FF]"
                  } object-cover flex-shrink-0`}
                />

                {/* Message Content */}
                <div
                  className={`flex flex-col ${
                    message.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {/* Name and Time */}
                  <div
                    className={`text-xs text-gray-500 mb-1 ${
                      message.sender === "user"
                        ? "text-right flex gap-2 flex-row-reverse"
                        : "text-left"
                    }`}
                  >
                    <span className="font-semibold">{message.name}</span>
                    <span className="ml-2">{message.timestamp}</span>
                  </div>

                  {/* Reply Preview */}
                  {repliedToMessage && (
                    <div
                      onClick={() =>
                        handleScrollToOriginal(repliedToMessage.id)
                      }
                      className="mb-2 p-2 bg-[linear-gradient(30deg,#741CFF_10%,#00C3FF)] rounded-tr-[6px] rounded-tl-[16px] rounded-b-[16px]  cursor-pointer hover:opacity-80 transition-opacity max-w-[581px] shadow-xl"
                    >
                      <div className="bg-[linear-gradient(30deg,#b48bff85,#99e6ff86)]  m-2  p-3 rounded-[10px]">
                        <p className="text-sm text-white line-clamp-2">
                          {repliedToMessage.text}
                        </p>
                      </div>
                      <p className="text-[16px] text-white leading-relaxed px-3 py-1">
                        {message.text}
                      </p>
                    </div>
                  )}

                  {/* Main Message */}
                  {!repliedToMessage && (
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === "user"
                          ? " text-white rounded-br-none"
                          : "bg-[#EFF6FF] text-[#0F0E13] text-[16px] rounded-tl-[6px] rounded-tr-[16px] rounded-b-[16px] border shadow-xl"
                      }`}
                    >
                      {" "}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  )}

                  {/* Action Buttons opacity-0 group-hover:opacity-100 transition-opacity */}
                  <div
                    className={`w-[95%] mx-auto flex justify-between items-center mt-1  ${
                      message.sender === "user" ? "hidden" : "flex-row"
                    }`}
                  >
                    <button
                      onClick={() => handleReply(message)}
                      className="w-4 h-4 rounded-full bg-[#00C3FF] flex items-center justify-center gap-1"
                    >
                      <MdReply className="text-black text-[15px]" />
                    </button>
                    <div className="flex items-center gap-3 text-sm">
                      <button className="text-[#9810FA]"> + Add as Beat</button>
                      <button className="text-[#FB2C36]"> Reject</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white flex-1 border border-[##E2E8F0] pt-2 px-2 md:pt-3 md:px-4">
        <div className={`relative bottom-0 w-full max-w-[937px] mx-auto`}>
          {/* Textarea Container */}
          <div
            className="p-[1px] rounded-[8px] bg-[linear-gradient(30deg,#741CFF_0%,#00C3FF_70%)] h-[134px] inline-block w-full
          mx-auto"
          >
            <div
              className={`bg-[#fff]
         relative  rounded-[8px] h-[132px] `}
            >
              {/* Reply Preview */}
              {replyingTo && (
                <div className="mb-2 h-[52px] overflow-y-auto p-2 bg-[linear-gradient(30deg,#b48bff62,#99e6ff5e)] rounded-lg rounded-b-none  flex items-start justify-between">
                  <div className="flex-1 border-l-4  border-[#741CFF] ">
                    {/* <p className="text-xs font-semibold text-gray-700 px-3 pt-1">
                      Replying to {replyingTo.name}
                    </p> */}
                    <p className="text-sm text-gray-600 line-clamp-1 px-3">
                      {replyingTo.text}
                    </p>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <IoMdCloseCircle />
                  </button>
                </div>
              )}
              <div className={`${replyingTo ? "flex" : "flex-col"} px-3 pt-1`}>
                <textarea
                  value={textValue}
                  onChange={(e) =>
                    setTextValue(e.target.value.slice(0, maxChars))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      handleSendMessage();
                      event.preventDefault();
                    }
                  }}
                  maxLength={maxChars}
                  className={`bg-[#fff] resize-none leading-[21px] rounded-[8px] ${
                    !replyingTo ? "w-[100%]" : "w-[100%]"
                  } h-[62.27px] focus:border-none focus:outline-none text-[14px] py-[2px] pr-[12px] font-[400] placeholder:text-[#7B809A] placeholder:italic`}
                  placeholder="Share an action taken by any character in pursuit of its want OR describe a situation in which the chosen characters interact OR write anything you have in mind."
                />

                <div
                  className={`flex ${
                    !replyingTo
                      ? "justify-between w-full  items-center"
                      : "justify-end items-end w-[15%]"
                  } bottom-[2px] gap-3 pb-1`}
                >
                  {!replyingTo && <AskIda />}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSendMessage}
                      className="w-12 h-12 rounded-[14px] shadow-md bg-[linear-gradient(30deg,#741CFF_0%,#00C3FF_70%)] hover:opacity-90 transition-opacity"
                    >
                      <FiSend className="text-[#fff] ml-3 w-5 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Character Count */}
          <div className={`absolute bottom-[-16px] right-[14px]`}>
            <p
              className={`text-[12px] font-[400] leading-[14px] ${
                charCount > maxChars * 0.9 ? "text-red-500" : "text-[#616161]"
              }`}
            >
              {charCount}/{maxChars}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes highlight {
          0% {
            background-color: rgba(116, 28, 255, 0.2);
          }
          100% {
            background-color: transparent;
          }
        }

        .highlight-message {
          animation: highlight 2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatArea;
