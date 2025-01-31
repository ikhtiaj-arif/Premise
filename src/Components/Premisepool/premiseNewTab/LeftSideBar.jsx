import React from "react";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { PiShareFat } from "react-icons/pi";
import engagementImg from "../../../img/Icons/Engagements.png";
import beatsImg from "../../../img/Icons/beats.png";
import brainImg from "../../../img/Icons/brainstorme.png";
import mailCartQ from "../../../img/Icons/mailCartQ.png";
import transCartQ from "../../../img/Icons/transCartQ.png";
import transIcon from "../../../img/Icons/transIcon.png";
import translateCart from "../../../img/Icons/translateCart.png";

const LeftSideBar = ({ premiseData, setBeatsPopup, setCommonPopup }) => {
  const { bg_img, bg_color, text, premiseCreator } = premiseData;
  const splitText = text.split("+");
  const dText = splitText[1];
  const stylings = JSON?.parse(splitText[0]);
  const { boldStyle, italicStyle, underlineStyle, hexColor } = stylings;
  // console.log(premiseData);

  // const [commonPopup, setCommonPopup] = useState(""); // For "Brainstorms" and "Engagements"
  // const [beatsPopup, setBeatsPopup] = useState(false); // For "Beats"

  return (
    <div className="w-full pr-3">
      {/* header */}
      <div className="flex items-center gap-2">
        <div className="w-1/2 flex items-center gap-2">
          <div
            data-te-toggle="tooltip"
            title="Share"
            onClick={() => {}}
            className={`h-[32px] w-[32px] rounded-full cursor-pointer relative  border border-[#eaeaea] 
              `}
          >
            <PiShareFat className="h-[26px] w-[21px] pt-1 mx-auto " />
          </div>
          <div
            data-te-toggle="tooltip"
            title="Engagements"
            onClick={() => {
              setCommonPopup("engagements");
            }}
            className={`h-[32px] w-[32px] rounded-full cursor-pointer relative  border border-[#eaeaea] 
              `}
          >
            <img
              src={engagementImg}
              alt=""
              className="h-[26px] w-[26px] mx-auto mt-[2px]"
            />
          </div>
          <div
            data-te-toggle="tooltip"
            title="Brainstorms"
            onClick={() => {
              setCommonPopup("brainstorms");
            }}
            className={`h-[32px] w-[32px] rounded-full cursor-pointer relative  border border-[#eaeaea]  
              `}
          >
            <img
              src={brainImg}
              alt=""
              className="h-[31px] w-[31px] mx-auto  "
            />
          </div>
          <div
            data-te-toggle="tooltip"
            title="Beats"
            onClick={() => {
              // console.log("sdfadf");
              setBeatsPopup(true);
            }}
            className={`h-[32px] w-[32px] rounded-full cursor-pointer relative  border border-[#eaeaea]  
              `}
          >
            <img
              src={beatsImg}
              alt=""
              className="h-[21px] w-[21px] mx-auto  mt-[6px] ml-[7px]"
            />
          </div>
        </div>
        <div
          className={` border w-[146px] border-[#B4B4B4] mx-auto px-[14px] h-[32px] my-2 rounded-full`}
        >
          <form className="flex items-center">
            <input
              type="text"
              className="w-full flex-1 px-2  h-[28px] text-[14px] focus:outline-none"
              name="search"
              id=""
              maxLength="30"
              placeholder="Search"
            />

            <button type="submit" className="ml-2">
              <FiSearch className="h-[20px] w-[20px]" />
            </button>
          </form>
        </div>
      </div>
      {/* premise card */}
      <div>
        <div className="flex gap-[3px] items-center mt-[12px]  relative justify-end pb-1">
          <img
            data-te-toggle="tooltip"
            title="Check Mails"
            src={transCartQ}
            className="w-8 h-8 cursor-pointer"
            alt=""
            // onClick={() => setOwnerMail(true)}
          />
          <img
            data-te-toggle="tooltip"
            title="Check Mails"
            src={translateCart}
            className="w-8 h-8 cursor-pointer"
            alt=""
            // onClick={() => setOwnerMail(true)}
          />
          <img
            data-te-toggle="tooltip"
            title="Check Mails"
            src={mailCartQ}
            className="w-9 h-9 cursor-pointer"
            alt=""
            // onClick={() => setOwnerMail(true)}
          />
        </div>
        {/* center */}
        <div
          className=" mx-auto h-[24.6vh]   w-full lg:my-auto border border-[#eaeaea]  relative  rounded-[8px] "
          style={{
            background: `${bg_img ? `url(${bg_img})` : bg_color}`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "8px",
            backgroundPosition: "center",
          }}
        >
          {/* {bg_img &&  <img src={bg_img} alt="" className="rounded-[8px] bg-cover bg-no-repeat h-[25.6vh] lg:h-[270px]  w-full " />} */}
          <div
            // className="absolute inset-0 flex items-center justify-center backdrop-blur-sm px-2 md:text-xl lg:text-xl border border-[#EAEAEA] bg-[#FAFAFA] rounded-[8px] max-w-[383px]"
            className={`${
              bg_img || bg_color !== "#FAFAFA" ? "p-[12px]" : "px-[18px] "
            } absolute inset-0  backdrop-blur-sm  text-[14px] rounded-[8px] overflow-hidden break-words`}
          >
            {/* premise text */}

            <p
              className={`${boldStyle} ${italicStyle} ${underlineStyle} ${hexColor} notranslate`}
            >
              {dText}
            </p>
          </div>
        </div>
        {/* bottom */}
        <div className="flex justify-between items-center  rounded-b-[8px] px-[4px] pb-[8px] pt-[4px] ">
          {/* 1st div */}
          <div className="flex items-center">
            <div className="flex items-center gap-1">
              <FaThumbsUp className={`w-7 h-7 text-[#33B0CA]  `} />
              <p className="text-[12px] leading-4 font-normal text-[#616161]">
                2 Likes
              </p>
            </div>
            <div className="flex items-center gap-1">
              <FaComment
                src={`${URL}/media/img/Icons/comment_not_made_owner.png`}
                className="w-7 h-7 ml-4 cursor-pointer"
                alt=""
              />
              <p className="text-[12px] leading-4 font-normal text-[#616161]">
                2 Brainstorms
              </p>
            </div>
          </div>

          <div className="ml-[15px] flex gap-2 items-center">
            <img
              data-te-toggle="tooltip"
              title="Translate"
              src={transIcon}
              className="w-7 h-7 ml-auto  cursor-pointer"
              alt=""
            />
          </div>
        </div>
      </div>
      {/* Details */}

      <div className="mt-[17px] w-[75%] ">
        <div className="flex items-center justify-between">
          {" "}
          <h2 className="text-[#616161] text-[16px] leading-[24px] font-[700]">
            Created By
          </h2>
          <div className="flex items-center">
            <span className="text-[#616161] text-[16px] leading-[24px] font-[700]">
              :
            </span>
            <p className="text-[#616161] text-[16px] leading-[24px] font-[400] pl-1">
              {" "}
              Janhvi
            </p>
          </div>
        </div>
        <div className="flex items-center  justify-between">
          {" "}
          <h2 className="text-[#616161] text-[16px] leading-[24px] font-[700]">
            Created On
          </h2>
          <div className="flex items-center">
            <span className="text-[#616161] text-[16px] leading-[24px] font-[700]">
              :
            </span>
            <p className="text-[#616161] text-[16px] leading-[24px] font-[400] pl-1">
              {" "}
              Janhvi
            </p>
          </div>
        </div>
        <div className="flex items-center  justify-between">
          {" "}
          <h2 className="text-[#616161] text-[16px] leading-[24px] font-[700]">
            Last Worked On
          </h2>
          <div className="flex items-center">
            <span className="text-[#616161] text-[16px] leading-[24px] font-[700]">
              :
            </span>
            <p className="text-[#616161] text-[16px] leading-[24px] font-[400] pl-1">
              {" "}
              Janhvi
            </p>
          </div>
        </div>
      </div>

      {/* visible to  */}
      <div className="mt-4">
        <div className="heading w-full  flex justify-between items-center">
          <p className="text-[#616161] font-[600] text-[16pxS]">Visible to</p>
          <div>/</div>
        </div>
        <div className="w-[96% mx-auto] bg-[#eaeaea] h-[1px] mt-1" />
        <p className="text-[#33B0CA] text-[16px] font-[500]">
          Everyone/All Buddies/Names/Only Me
        </p>
      </div>

      {/* characters */}
      <div className=" mt-4">
        <div className="heading w-full flex justify-between items-center">
          <p className="text-[#616161] font-[600] text-[16pxS]">Characters</p>
          <div>+ /</div>
        </div>
        <div className="bg-[#eaeaea] rounded-[8px] p-3 w-full h-[160px] overflow-auto">
          {/* map characters here */}
        </div>
      </div>

      <div className=" relative mt-5  ">
        <textarea
          // ref={inputRef}
          type="text"
          name=""
          maxLength={150}
          id=""
          className="bg-[#fafafa] border border-[#eaeaea] resize-none leading-[21px] px-3 rounded-[8px] w-[100%] h-[49.27px] lg:h-[55px] xl:h-[140px] focus:border-none focus:outline-none text-[14px] py-[2px] pr-[12px] font-[400]"
          placeholder="Add a comment..."
        />
        <p className="text-[12px] font-[400] leading-[14px] absolute bottom-[-12px] right-0  text-[#616161]">
          2/150
        </p>
      </div>
      <div className="h-[100px]" />
    </div>
  );
};

export default LeftSideBar;
