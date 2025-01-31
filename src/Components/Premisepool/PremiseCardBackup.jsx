import React, { useEffect, useState } from "react";
import { FaEllipsisV, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUser } from "../../app/Slices/userSlice";
import backgroundImg from "../../img/Icons/download.jpg";
import msgIcon from "../../img/Icons/msgIcon.png";
import userImg from "../../img/Icons/userImg.png";
import { URL } from "../utils";
import CommentPremise from "./CommentPremise";
import AddPremise2 from "./Components/AddPremise2";
import LikePremise from "./LikePremise";
import OwnerMail from "./OwnerMail";
import "./Premise.css";
import TranslatePremise from "./TranslatePremise";
import UserMail from "./UserMail";

const PremiseCard = ({
  p,
  index,
  handleDelete,
  owner,
  userQuery,
  refetch,
  shouldBlink,
}) => {
  //console.log('should blink', shouldBlink);
  const { user, userFirstName, userLastName } = owner;
  const {
    id,
    source_language,
    text,
    created_at,
    likes,
    comments,
    bg_img,
    bg_color,
    created_by,
    hidden,
  } = p;
  // console.log("PPP", id);
  const splitText = text.split("+");
  const dText = splitText[1];
  const stylings = JSON.parse(splitText[0]);
  const { boldStyle, italicStyle, underlineStyle, hexColor } = stylings;

  const [premiseOwner, setPremiseOwner] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [imageLoaded, setImageLoaded] = useState(false);
  // const {data: isHideUnhide, isLoading, refetch: hideUnhideRefetch} = useGetHideUnhidePremiseQuery(id)
  // console.log("isHideUnhide", isHideUnhide);
  const [backgroundImage, setBackgroundImage] = useState(backgroundImg);
  const [editMode, setEditMode] = useState(false);
  const [userMail, setUserMail] = useState(false);
  const [ownerMail, setOwnerMail] = useState(false);
  const dispatch = useDispatch();
  const [openDotMenu, setOpenDotMenu] = useState(null);
  // const dotPopupRef = useRef(null);
  const [premiseId, setPremiseId] = useState(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     // Close accordion when clicking outside
  //     if (dotPopupRef.current && !dotPopupRef.current.contains(event.target)) {
  //       setOpenDotMenu(null);
  //     }
  //     // Close other components here if needed
  //   };

  //   // Add the event listener when the component mounts
  //   document.addEventListener("click", handleClickOutside);

  //   // Remove the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    if (created_by?.id === user) {
      setPremiseOwner(true);
    }
    refetch();
  }, [created_by, user, refetch, p]);

  useEffect(() => {
    if (!user) {
      dispatch(setUser(userQuery));
    }
  }, [userQuery, dispatch, user]);

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBackgroundImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  // Format the created_date
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    timeZone: "GMT",
    // weekday: "short",
    day: "numeric",
    month: "short",
  });
  const formattedTime = new Date(created_at).toLocaleTimeString("en-US", {
    timeZone: "GMT",
    hour: "numeric",
    minute: "numeric",
  });
  // console.log(formattedTime);

  const [hideDisable, setHideDisable] = useState(false);
  // console.log(hideDisable);
  const handleHideUnhidePremise = async (id) => {
    setHideDisable(true);
    const accessToken = localStorage.getItem("accessToken");
    // console.log(accessToken);
    try {
      const response = await fetch(`${URL}/ideamall/hide-premise/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",

          // Add any other headers if needed
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        setHideDisable(false);
      }
      // console.log(data);
      // Handle the data as needed
      refetch();
    } catch (error) {
      // console.error("Error fetching data:", error);
      setHideDisable(false);
      // Handle errors
    }
  };

  return (
    <div className="w-[338px] mx-auto border border-[#EAEAEA] hover:shadow-lg rounded-[8px]  ">
      {/* upper div */}
      <div className="flex justify-between items-center bg-[#FAFAFA] rounded-t-[8px] p-[15px]">
        <div className="block ">
          <a
            target="_blank"
            rel="noreferrer"
            href={`${URL}/memberpage/#/user/${created_by?.id}`}
          >
            <div className="flex-1 flex gap-1 items-center">
              <img src={userImg} className="w-[32px]" alt="" />
              <h4 className="text-[#252525] font-[500] text-[14px] capitalize cursor-pointer">
                {created_by?.first_name} {created_by?.last_name}
              </h4>
            </div>
          </a>

          <div className="text-[#616161] text-[12px] flex gap-[8px] font-[400]  ml-[36px] leading-[4px] mb-[12px]">
            <p>
              {formattedDate}, {formattedTime} GMT
            </p>
          </div>
        </div>
        <div>
          {" "}
          {created_by?.id === user ? (
            <div className="flex gap-[3px] items-center mr-[2px] relative ">
              <img
                data-te-toggle="tooltip"
                title="Check Mails"
                src={msgIcon}
                className="w-8 h-8 cursor-pointer"
                alt=""
                onClick={() => setOwnerMail(true)}
              />
              {/* <FaRegTrashAlt
                data-te-toggle="tooltip"
                title="Delete"
                
                onClick={() => handleDelete(id)}
                className="w-5 h-5 cursor-pointer "
                alt=""
              /> */}
              <FaEllipsisV
                onClick={() => {
                  setOpenDotMenu((prevIndex) =>
                    prevIndex === index ? null : index
                  );
                }}
                className="w-5 h-5 cursor-pointer"
              />
              {openDotMenu === index && (
                <div
                  // ref={dotPopupRef}

                  className="absolute   w-[172.99px]  font-[400] text-[#616161] px-3 bg-[#fafafa] rounded-[8px] shadow-md border border-[#eaeaea] top-[33px] right-[6px] z-10"
                >
                  {hidden ? (
                    <button
                      className="cursor-pointer flex items-center  gap-[8px] py-2"
                      disabled={hideDisable}
                      onClick={() => handleHideUnhidePremise(id)}
                    >
                      {" "}
                      <FaEye className="text-[14px]" />{" "}
                      <p className="text-[14px]  text-[#252525]"> Unhide From Others</p>{" "}
                    </button>
                  ) : (
                    <button
                      className="cursor-pointer flex items-center  gap-[8px] py-2"
                      disabled={hideDisable}
                      onClick={() => handleHideUnhidePremise(id)}
                    >
                      {" "}
                      <FaEyeSlash className="text-[14px]" />{" "}
                      <p className="text-[14px]  text-[#252525]"> Hide From Others</p>
                    </button>
                  )}

                  {/* */}
                </div>
              )}
            </div>
          ) : (
            <img
              data-te-toggle="tooltip"
              title="Send Mail"
              src={msgIcon}
              className="w-8 h-8 cursor-pointer"
              alt=""
              onClick={() => setUserMail(true)}
            />
          )}
        </div>
      </div>
      {/* middle div */}
      <div className="bg-[#FAFAFA] h-[200px] border !border-[#f8f8f8] ">
        <div
          className={` w-[85%] bg-[#FAFAFA]  h-[189px] rounded-[8px]  mx-auto shadow-md  border relative
           ${
             imageLoaded && bg_img
               ? "premiseBg-loaded rounded-[8px]"
               : "rounded-[8px]"
           }`}
          style={
            bg_img
              ? {
                  backgroundImage: `url(${bg_img})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "86%",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                }
              : { backgroundColor: bg_color }
          }
          onLoad={() => setImageLoaded(true)}
        >
          <div
            className={`absolute inset-0 w-[100%] backdrop-filter flex items-center justify-center backdrop-blur-sm px-[22px] text-[16px] rounded-[8px] text-[#616161] leading-5 font-[400] overflow-hidden break-words `}
          >
            <p
              className={`${boldStyle} ${italicStyle} ${underlineStyle} ${hexColor}`}
            >
              {splitText[1]}
            </p>
          </div>
          <div></div>
          {/* {created_by.id === user && (
          <div
            data-te-toggle="tooltip"
            title="Edit"
            className="absolute top-0 right-0  w-full"
          >
            <div className="flex justify-end">
              <FaEdit
                className="w-6 h-6 m-2 cursor-pointer text-[#000000]"
                onClick={() => setEditMode(true)}
              />
            </div>
          </div>
        )} */}
        </div>
      </div>
      {/* lower div */}
      <div className="flex justify-between items-center bg-[#FAFAFA] rounded-b-[8px] px-[15px] pb-[15px] pt-[17px] ">
        {/* 1st div */}
        <div className="flex items-center">
          <LikePremise
            data={{
              likes,
              id,
              bg_color,
              bg_img,
              dText,
              stylings,
              premiseOwner,
              user,
              isLiked,
              setOpenDotMenu,
              setUserMail,
              handleHideUnhidePremise,
              setOwnerMail,
              formattedTime,
              formattedDate,
              hidden,
              index,
              openDotMenu,
            }}
            refetch={refetch}
            setIsLiked={setIsLiked}
          />
          <CommentPremise
            data={{
              comments,
              bg_color,
              bg_img,
              dText,
              created_by,
              id,
              stylings,
              likes,
              isLiked,
              shouldBlink,
              source_language,
              user,
              setOpenDotMenu,
              setUserMail,
              handleHideUnhidePremise,
              setOwnerMail,
              formattedTime,
              formattedDate,
              hidden,
              index,
              openDotMenu,
            }}
            refetch={refetch}
            setIsLiked={setIsLiked}
          />
        </div>
        {/* 2nd div */}
        <div className="ml-[15px] flex gap-2 items-center cursor-pointer">
          <TranslatePremise
            data={{
              id,
              dText,
              bg_color,
              bg_img,
              likes,
              stylings,
              isLiked,
              source_language,
              user,
              setOpenDotMenu,
              setUserMail,
              handleHideUnhidePremise,
              setOwnerMail,
              formattedTime,
              formattedDate,
              hidden,
              index,
              openDotMenu,
            }}
            refetch={refetch}
            setIsLiked={setIsLiked}
          />
        </div>
      </div>
      {/* Background image selection */}
      <input
        type="file"
        accept="image/*"
        id="file-input-bg"
        style={{ display: "none" }}
        onChange={handleBackgroundChange}
      />
      {/* owner edit premise */}
      {editMode && (
        // <AddPremise
        //   id={id}
        //   modifiedText={modifiedText}
        //   bg_img={bg_img}
        //   bg_color={bg_color}
        //   setAddPopup={setEditMode}
        // />

        <AddPremise2
          data={{ dText, stylings, bg_img, bg_color, id }}
          setAddPopup={setEditMode}
          refetch={refetch}
        />
      )}
      {userMail && (
        <UserMail
          recipient={created_by}
          data={{ user, id, userFirstName, userLastName }}
          setUserMail={setUserMail}
        />
      )}
      {ownerMail && (
        <OwnerMail data={{ user, id }} setOwnerMail={setOwnerMail} />
      )}
    </div>
  );
};
