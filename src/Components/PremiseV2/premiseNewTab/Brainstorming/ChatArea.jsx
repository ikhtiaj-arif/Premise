"use client";

import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import { MdReply } from "react-icons/md";
import AskIda from "../../../SharedVersion/AskIda";

const ChatArea = ({ rawBackendData }) => {
  console.log("rawBackendData", rawBackendData);
  const transformBackendData = (data) => {
    const currentUserId = 92; // Assuming current user is the one with ID 92
    return data?.map((item) => ({
      id: item.id,
      text: item.text_prefix ? `${item.text_prefix}: ${item.text}` : item.text,
      sender: item.user.id === currentUserId ? "user" : "other",
      timestamp: new Date(item.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      replyingTo: item.reply || null,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user.username}`,
      userId: item.user.id,
      name: item.user.username,
      askIda: item.ask_ida || false,
      rejectButton: item.reject_button || false,
      addToBeat: item.add_to_beat || false,
      suggested: item.suggested || false,
    }));
  };

  const [messages, setMessages] = useState(
    transformBackendData(rawBackendData)
  );
  const [textValue, setTextValue] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [suggestingId, setSuggestingId] = useState(null);
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        name: "You",
        suggested: false,
      };

      setMessages([...messages, newMessage]);
      setTextValue("");
      setReplyingTo(null);
    }
  };

  const handleSuggestion = (messageId) => {
    setSuggestingId(messageId);
    // Simulate API call
    setTimeout(() => {
      setMessages(
        messages.map((msg) =>
          msg.id === messageId ? { ...msg, suggested: true } : msg
        )
      );
      setSuggestingId(null);
    }, 1000);
  };

  const shouldShowSuggestion = (message) => {
    const hasQuestion =
      message.text.includes("?") || message.text.includes("؟");
    const isFromIdaOrUser79 = message.userId === 1 || message.userId === 79;
    return hasQuestion && isFromIdaOrUser79 && message.sender !== "user";
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
    return messages?.find((msg) => msg.id === messageId);
  };

  const charCount = textValue.length;
  const maxChars = 250;

  return (
    <div className="bg-[#F0F2F5] h-screen flex flex-col w-full rounded-lg">
      {/* Messages Container */}
      <div className="p-3 h-[calc(100vh-300px)]  lg:h-[calc(95vh-300px)] overflow-y-auto space-y-4">
        {messages?.map((message) => {
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
                    message.sender === "user" && "border-2 border-[#00C3FF]"
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
                      className={`mb-2 p-2 ${
                        message.sender === "user"
                          ? "bg-[linear-gradient(30deg,#741CFF_10%,#00C3FF)] text-white"
                          : "bg-[#EFF6FF] text-[#0F0E13]"
                      }  rounded-tr-[6px] rounded-tl-[16px] rounded-b-[16px] cursor-pointer hover:opacity-80 transition-opacity max-w-[581px] shadow-xl`}
                    >
                      <div className="bg-[linear-gradient(30deg,#b48bff85,#99e6ff86)] m-2 p-3 rounded-[10px]">
                        <p className="text-sm  line-clamp-2">
                          {repliedToMessage.text}
                        </p>
                      </div>
                      <p className="text-[16px]  leading-relaxed px-3 py-1">
                        {message.text}
                      </p>
                    </div>
                  )}

                  {/* Main Message */}
                  {!repliedToMessage && (
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === "user"
                          ? "text-white rounded-br-none  bg-[linear-gradient(30deg,#741CFF_10%,#00C3FF)]"
                          : "bg-[#EFF6FF] text-[#0F0E13] text-[16px] rounded-tl-[6px] rounded-tr-[16px] rounded-b-[16px] border shadow-xl"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  )}

                  {/* Action Buttons */}

                  {shouldShowSuggestion(message) ? (
                    <div className="w-[95%] mx-auto flex justify-end">
                      {message.suggested ? (
                        <button
                          disabled
                          className="px-2 cursor-auto rounded-[4px] pt-[2px] pb-[3px] bg-[linear-gradient(30deg,#b38bff,#99e6ff)]"
                        >
                          <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]">
                            Suggested
                          </p>
                        </button>
                      ) : (
                        <button
                          disabled={suggestingId === message.id}
                          onClick={() => handleSuggestion(message.id)}
                          className=""
                        >
                          {/* <p className="text-[14px] text-[#fafafa] font-[400] leading-[16.52px]">
                            {suggestingId === message.id
                              ? "Suggesting..."
                              : "Suggestion"}
                          </p> */}
                          <h4 class="text-[14px]  font-[500] leading-[21px] w-full  bg-[linear-gradient(30deg,#741CFF,#00C3FF)] bg-clip-text text-transparent">
                            Suggestion
                          </h4>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`w-[95%] mx-auto flex justify-between items-center mt-1 ${
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
                        <button className="text-[#9810FA]">
                          + Add as Beat
                        </button>
                        <button className="text-[#FB2C36]">Reject</button>
                      </div>
                      {/* <button>
                   
                    </button> */}
                    </div>
                  )}
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
                <div className="mb-2 h-[52px] overflow-y-auto p-2 bg-[linear-gradient(30deg,#b48bff62,#99e6ff5e)] rounded-lg rounded-b-none flex items-start justify-between">
                  <div className="flex-1 border-l-4 border-[#741CFF]">
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
                      ? "justify-between w-full items-center"
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
