import React, { useEffect, useState } from "react";
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
import PopupLike from "../../SharedVersion/PopupLike";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../app/Slices/userSlice";
import { useGetPremiseUserQuery } from "../../../app/EndPoints/premisePoolApi";
import PopupPremiseText from "../../SharedVersion/PopupPremiseText";
import { MdOutlineEdit } from "react-icons/md";
import HideOptionPop from "../../Premisepool/Components/HideOptionPop";
import ReqTranslationPop from "../Popups/ReqTranslationPop";
import TranslatePremise from "../../Premisepool/TranslatePremise";

const LeftSideBar = ({
  premiseData,
  setBeatsPopup,
  setCommonPopup,
  premiseRefetch,
}) => {
  const {
    bg_img,
    bg_color,
    text,
    last_worked_on,
    created_at,
    id,
    created_by,
    premiseOwner,
    stamp,
    filter_flag,
    visible_to,
    comments,
    comment_filter_flag,
    source_language,
    project_id,
  } = premiseData;
  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();
  const [openHidePop, setOpenHidePop] = useState(false);
  const [transPopClose, setTransPopClose] = useState({});

  const user = useSelector((state) => state?.user?.id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(setUser(userQuery));
    }
  }, [userQuery, dispatch, user]);

  const splitText = text.split("+");
  const dText = splitText[1];
  const stylings = JSON?.parse(splitText[0]);
  const { boldStyle, italicStyle, underlineStyle, hexColor } = stylings;
  const [viewText, setViewText] = useState(splitText[1]);
  // console.log(premiseData);

  // const [commonPopup, setCommonPopup] = useState(""); // For "Brainstorms" and "Engagements"
  // const [beatsPopup, setBeatsPopup] = useState(false); // For "Beats"

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

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
        <PopupPremiseText {...{ bg_img, bg_color, stylings, dText ,viewText}} />
        {/* bottom */}
        <div className="flex justify-between items-center  rounded-b-[8px] px-[4px] pb-[8px] pt-[4px] ">
          {/* 1st div */}
          <div className="flex items-center">
            {/* like */}
            <PopupLike {...{ user, id, premiseRefetch, premiseData }} />
            {/* comment */}
            <div className="flex items-center gap-1">
              <FaComment className="w-7 h-7 ml-4 cursor-pointer" alt="" />
              <p className="text-[12px] leading-4 font-normal text-[#616161]">
                {comments}{" "}
                {comments > 1 ? (
                  <span>Brainstorms</span>
                ) : (
                  <span> Brainstorm</span>
                )}
              </p>
            </div>
          </div>

          <div className="ml-[15px] flex gap-2 items-center">
            <TranslatePremise {...{transPopClose,setTransPopClose,setViewText}}
              data={{
                id,
                dText,
                source_language,
                project_id,
              }} 
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
              {created_by?.first_name} {created_by?.last_name}
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
              {formatDate(created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center  justify-between">
          <h2 className="text-[#616161] text-[16px] leading-[24px] font-[700]">
            Last Worked On
          </h2>
          <div className="flex items-center">
            <span className="text-[#616161] text-[16px] leading-[24px] font-[700]">
              :
            </span>
            <p className="text-[#616161] text-[16px] leading-[24px] font-[400] pl-1">
              {formatDate(last_worked_on)}
            </p>
          </div>
        </div>
      </div>

      {/* visible to  */}
      <div className="mt-4">
        <div className="heading w-full  flex justify-between items-center">
          <p className="text-[#616161] font-[600] text-[16pxS]">Visible to</p>
          {premiseOwner?.id == user && (
            <MdOutlineEdit
              onClick={() => setOpenHidePop(!openHidePop)}
              className="text-[#33B0CA]"
            />
          )}
        </div>
        <div className="w-[96% mx-auto] bg-[#eaeaea] h-[1px] mt-1" />
        <p className="text-[#33B0CA] text-[16px] font-[500]">
          {filter_flag == 0
            ? "All Buddies"
            : filter_flag == 1
            ? "Only Me"
            : filter_flag == 2
            ? "Names"
              ? filter_flag == 3
              : "Everyone"
            : "Everyone/All Buddies/Names/Only Me"}
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

      {openHidePop && (
        <HideOptionPop
          {...{
            setOpenHidePop,
            id,
            user,
            filter_flag,
            comment_filter_flag,
            visible_to,
          }}
          refetch={premiseRefetch}
        />
      )}
    </div>
  );
};

export default LeftSideBar;
