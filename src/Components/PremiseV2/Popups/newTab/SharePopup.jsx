import React, { useEffect, useState } from "react";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import { toast } from "react-toastify";
import msgIcon from "../../../../img/msg_black.png";
import fbIcon from "../../../../img/fb_icon.png";
import instaIcon from "../../../../img/insta_icon.png";
import linkdinIcon from "../../../../img/linkdin_icon.png";
import icon_3 from "../../../../img/icon_3.png";
import icon_4 from "../../../../img/icon_4.png";
import icon_5 from "../../../../img/icon_5.png";
import { URL } from "../../../utils";
import {  useNavigate } from "react-router-dom";

const SharePopup = ({ popClose }) => {
  const navigate = useNavigate();
  const [link, setLink] = useState(window.location.href);
  const [isCopy, setIsCopy] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopy(true);
      console.log("Text copied to clipboard:", link);
    } catch (err) {
      console.error("Error copying text to clipboard:", err);
      toast("Error copying text to clipboard..!");
    }
  };

  const openMessageSection = () => {
    const messageSection = document.getElementById("list-3");
    if (messageSection) {
      messageSection.click();
    }
    handleCopyToClipboard();
    popClose(false);
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21]">
      <div className="h-[253px] mb-[20px] lg:px-[22px] lg:mb-0 lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:w-auto md:mx-auto absolute bottom-[60px] left-0 lg:relative lg:bottom-0 lg:rounded-[8px] rounded-t-[12px]">
        {/* Close Popup */}
        <img
          src={crossIcon}
          alt="Close"
          className="text-red-500 w-8 h-8 top-[-60px] right-[50%] translate-x-[50%] lg:translate-x-0 lg:top-[-15px] lg:right-[-15px] absolute z-[1] m-1 cursor-pointer"
          onClick={() => {
            popClose(false);
          }}
        />

        <div className="p-[20px]">
          <div>
            <img
              onClick={openMessageSection}
              className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] cursor-pointer"
              src={msgIcon}
              alt=""
            />
            <p className="text-[#5C5C5C] text-[12px] flex gap-[8px] font-[400] leading-[18px]">
              Share link with <span className="mnff-m">MNF</span> Buddies
            </p>
          </div>

          {/* social icon */}
          <div className="flex gap-[20px] items-center my-[20px] ">
            <a
              target="_blank"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                link
              )}`}
              rel="noopener noreferrer"
            >
              <img
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] cursor-pointer"
                src={fbIcon}
                alt=""
              />
            </a>
            <a
              target="_blank"
              href={`https://www.instagram.com/?url=${encodeURIComponent(
                link
              )}`}
              rel="noopener noreferrer"
            >
              <img
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] cursor-pointer"
                src={instaIcon}
                alt=""
              />
            </a>
            <a
              target="_blank"
              href={`https://www.threads.net/share?url=${encodeURIComponent(
                link
              )}`}
              rel="noopener noreferrer"
            >
              <img
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] cursor-pointer"
                src={icon_3}
                alt=""
              />
            </a>
            <a
              target="_blank"
              href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
                link
              )}`}
              rel="noopener noreferrer"
            >
              <img
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] cursor-pointer"
                src={icon_4}
                alt=""
              />
            </a>
            <a
              target="_blank"
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                link
              )}`}
              rel="noopener noreferrer"
            >
              <img
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] cursor-pointer"
                src={icon_5}
                alt=""
              />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                link
              )}`}
              rel="noopener noreferrer"
            >
              <img
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] cursor-pointer"
                src={linkdinIcon}
                alt=""
              />
            </a>
          </div>

          {/* copy link */}
          <div className="flex gap-[10px] items-center">
            <input
              value={link}
              className="w-full border-[1px] border-[#EAEAEA] rounded-[4px] bg-[#FAFAFA] p-[10px] text-[#616161] text-[12px] flex gap-[8px] font-[400] leading-[18px]"
              placeholder="Type here"
              type="text"
            />

            <button
              onClick={handleCopyToClipboard}
              className="border-[1px] text-[12px] font-[600] border-[#33B0CA] bg-[#33B0CA] text-[#FFFFFF] py-[4px] rounded-[8px] w-[100px]"
            >
              {!isCopy ? "Copy link" : "Copied"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
