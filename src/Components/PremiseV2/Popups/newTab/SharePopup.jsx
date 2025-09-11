import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import fbIcon from "../../../../img/fb_icon.png";
import icon_3 from "../../../../img/icon_3.png";
import icon_4 from "../../../../img/icon_4.png";
import icon_5 from "../../../../img/icon_5.png";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import instaIcon from "../../../../img/insta_icon.png";
import linkdinIcon from "../../../../img/linkdin_icon.png";
import msgIcon from "../../../../img/msg_black.png";

const SharePopup = ({ popClose }) => {
  const navigate = useNavigate();
  const [link, setLink] = useState(window.location.href);
  const [isCopy, setIsCopy] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopy(true);
      toast.success("Copied successfully!");
      // console.log("Text copied to clipboard:", link);
    } catch (err) {
      console.error("Error copying text to clipboard:", err);
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
    <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-screen flex items-center justify-center bg-[#252525b0] z-[21]">
      <div className=" bg-white rounded-[8px] w-[100%] lg:w-[623px] ">
        <div className="relative">
          {/* Close Popup */}
          <div className="absolute right-[45%] top-[-60px] lg:top-[-12px] lg:right-[-12px]">
            <img
              src={crossIcon}
              alt=""
              className="w-[40px] h-[40px] z-[99] cursor-pointer"
              onClick={() => {
                popClose(false);
              }}
            />
          </div>
        

          <div className="p-[20px]">
            <div>
              <img
                onClick={openMessageSection}
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] cursor-pointer"
                src={msgIcon}
                alt=""
              />
              <p className="text-[#5C5C5C] text-[12px] flex gap-[8px] font-[400] leading-[18px]">
                Share link with MNF Buddies
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
                className="w-full border border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none rounded-[4px] bg-[#FAFAFA] p-[10px] text-[#616161] text-[12px] flex gap-[8px] font-[400] leading-[18px]"
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
    </div>
  );
};

export default SharePopup;
