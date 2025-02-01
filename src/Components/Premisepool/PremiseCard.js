import React, { useContext, useEffect, useRef, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { MyContext } from "../../App";
import {
  useGetSavedCharactersQuery,
  useSaveCharactersMutation,
} from "../../app/EndPoints/Characters/Characters";
import { useGetPremiseUserPictureQuery } from "../../app/EndPoints/premisePoolApi";
import { setUser } from "../../app/Slices/userSlice";
import backgroundImg from "../../img/Icons/download.jpg";
import msgIcon from "../../img/Icons/msgIcon.png";
import userImg from "../../img/Icons/userImg.png";
import { URL } from "../utils";
import CharacterEditablePop from "./Character/CharacterEditablePop";
import CommentPremise from "./CommentPremise";
import AddPremise2 from "./Components/AddPremise2";
import HideOptionPop from "./Components/HideOptionPop";
import LikePremise from "./LikePremise";
import OwnerMail from "./OwnerMail";
import Popup from "./Popup";
import { hideUnhidePremise } from "./PreiseUtils";
import "./Premise.css";
import TranslatePremise from "./TranslatePremise";
import UserMail from "./UserMail";
import UserType from "./UserType";

const PremiseCard = ({
  setShowRefine,
  p,
  index,
  handleDelete,
  owner,
  userQuery,
  refetch,
  shouldBlink,
  activeSearch,
  transPopClose,
  setTransPopClose,
  isLiked,
  setIsLiked,
  hiddenCountRefetch,
}) => {
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
    filter_flag,
    visible_to,
    comment_filter_flag,
    m_value,
    project_id,
  } = p;
  const [actOneThreshold, setActOneThreshold] = useState();
  const [actTwoEnd, setActTwoEnd] = useState();

  // console.log("card actOneThreshold", actOneThreshold);
  // console.log("PremiseData", p);

  useEffect(() => {
    setActOneThreshold(Math.floor(0.25 * m_value));

    setActTwoEnd(Math.floor(0.8 * m_value));
  }, [m_value]);

  const { data: characters, isCharLoading } =
    useGetSavedCharactersQuery(project_id);
  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();

  const [characterArray, setCharacterArray] = useState([]);

  const [onlyAdd, setOnlyAdd] = useState(true);
  const [characterLoading, setCharacterLoading] = useState(true);

  useEffect(() => {
    if (characters) setCharacterArray(characters);
  }, [characters]);

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(created_by?.id);
  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  // console.log("xcvvdfawsedfdsfgfgd", p);
  const {
    setSelectedPremiseObj,
    setSelectedPremiseSpProjectId,
    setTransPopup,
    allspProjectJSON,
  } = useContext(MyContext);

  const currentProjectData = allspProjectJSON?.projects?.find(
    (item) => item.pro_uuid === project_id
  );
  const currentProjectName = currentProjectData?.name;
  const isProjectLocked = currentProjectData?.locked;
  // console.log("object", currentProjectData);

  const splitText = text.split("+");
  const dText = splitText[1];
  const stylings = JSON?.parse(splitText[0]);
  const [viewText, setViewText] = useState(splitText[1]);
  const { boldStyle, italicStyle, underlineStyle, hexColor } = stylings;
  const [openDotMenu, setOpenDotMenu] = useState(null);
  const [openCharacterChart, setOpenCharacterChart] = useState(null);
  const [openHidePop, setOpenHidePop] = useState(false);
  const [premiseOwner, setPremiseOwner] = useState(false);
  const [confirmOpenSp, setConfirmOpenSp] = useState(false);
  // const [isLiked, setIsLiked] = useState(false);

  const [imageLoaded, setImageLoaded] = useState(false);

  // const {data: isHideUnhide, isLoading, refetch: hideUnhideRefetch} = useGetHideUnhidePremiseQuery(id)
  // console.log("isHideUnhide", isHideUnhide);
  const [backgroundImage, setBackgroundImage] = useState(backgroundImg);
  const [editMode, setEditMode] = useState(false);
  const [userMail, setUserMail] = useState(false);
  const [ownerMail, setOwnerMail] = useState(false);
  const dispatch = useDispatch();
  const [openPop, setOpenPop] = useState(false);

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
    // timeZone: "GMT",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = new Date(created_at).toLocaleTimeString("en-US", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour: "numeric",
    minute: "numeric",
  });
  // console.log("formattedTime", Intl.DateTimeFormat().resolvedOptions().timeZone);

  const [hideDisable, setHideDisable] = useState(false);

  // const {
  //   data: commentsData,
  //   isCommentLoading,
  //   refetch: commentRefetch,
  // } = useGetCommentByPremiseIdQuery(id);

  // //filter Deleted Comment count

  // const deletedCount = commentsData?.comments?.filter(comment => comment.is_deleted).length;

  // const finalCount = comments - deletedCount

  // console.log(hideDisable);

  // const handleHideUnhidePremise = async (id) => {
  //   setHideDisable(true);
  //   const accessToken = localStorage.getItem("accessToken");
  //   // console.log(accessToken);
  //   try {
  //     const response = await fetch(`${URL}/ideamall/hide-premise/${id}`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",

  //         // Add any other headers if needed
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     if (data) {
  //       setHideDisable(false);
  //     }
  //     console.log(data);
  //     // Handle the data as needed
  //     refetch();
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setHideDisable(false);
  //     // Handle errors
  //   }
  // };

  const handleHideUnhidePremise = async (id) => {
    hideUnhidePremise(id, setHideDisable, refetch, setOpenDotMenu);
  };

  const dotPopupRef = useRef();
  useEffect(() => {
    const closeMenu = (e) => {
      if (!dotPopupRef?.current?.contains(e.target)) {
        if (!e.target.closest(".absolute")) {
          setOpenDotMenu(null);
        }
      }
    };
    document.body.addEventListener("mousedown", closeMenu);

    return () => document.body.removeEventListener("mousedown", closeMenu);
  }, []);

  const handleOpenSp = () => {
    // console.log("object", p);
    if (isProjectLocked) {
      window.open(`${URL}/scriptpad2/#/myscript`);
    }
    window.open(
      `${URL}/scriptpad2/#/${project_id}/0x0d2a90b8da670ddad09e2d7b719779a41687515aa196cb35568f20659b204de6/premise`
    );
  };

  const handleUpdateSavedChar = async () => {
    setCharacterLoading(true);
    try {
      const charArr = JSON.stringify(characterArray);
      const data = {
        // id: premiseID,
        id: project_id,
        body: { char_data: charArr },
      };

      const response = await saveCharacter(data);

      if (response) {
        // setAddNewCharacter(false)
        // setEditPopupOpen(false)
        setOpenCharacterChart(false);
        // setCharSaveDisable(true);
        setCharacterLoading(false);

        // toast.success("characters updated!")
      }
      return response;
    } catch (error) {
      setCharacterLoading(false);
      // console.error("Error updating characters:", error);
    }
  };

  // console.log(created_by);

  return (
    <div className="w-[358px] lg:w-[100%] mx-auto border border-[#EAEAEA] hover:shadow-lg rounded-[8px]  ">
      {/* upper div */}
      <div className="flex justify-between items-center bg-[#FAFAFA] rounded-t-[8px] px-[15px] pt-[15px] pb-[6px]">
        <div className="block ">
          <a
            target="_blank"
            rel="noreferrer"
            // href={`${URL}/memberpage/#/user/${created_by?.id}`}

            href={
              created_by?.id === user
                ? `${URL}/memberpage/#/personaldetails`
                : `${URL}/memberpage/#/user/${created_by?.id}/personaldetails`
            }
          >
            <div className="flex-1 flex gap-1 items-center">
              {profileImg?.[0]?.profile_photo ? (
                <img
                  src={proImgUrl}
                  className="w-[36px] h-[35.9px] border
                border-[#eaeaea] rounded-full object-cover"
                  alt=""
                />
              ) : (
                <img
                  src={userImg}
                  className="w-[36px] h-[35.9px] rounded-full border
                border-[#eaeaea]"
                  alt=""
                />
              )}
              <div>
                <div className="flex items-center">
                  <h4 className="notranslate text-[#252525] font-[600] text-[14px] capitalize cursor-pointer hover:text-[#33B0CA]">
                    {created_by?.first_name} {created_by?.last_name}
                  </h4>
                  <UserType
                    type={created_by?.centraldatabase?.type}
                    user_type={created_by?.centraldatabase?.user_type}
                  />
                </div>
                <div className="text-[#616161] text-[10px] flex flex-col gap-[8px] font-[400] leading-[4px] mb-[12px]">
                  <p>
                    {formattedDate}, {formattedTime}
                  </p>
                  {created_by?.id === user && (
                    <p className="notranslate text-[#252525] text-[12px]">
                      {currentProjectName?.slice(0, 20)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </a>
        </div>
        <div>
          {" "}
          {created_by?.id === user ? (
            <div className="flex gap-[3px] items-center mt-[-13px] mr-[2px] relative ">
              {/* <img
                data-te-toggle="tooltip"
                title="Check Mails"
                src={msgIcon}
                className="w-8 h-8 cursor-pointer"
                alt=""
                onClick={() => setOwnerMail(true)}
              /> */}
              {/* <FaRegTrashAlt
                data-te-toggle="tooltip"
                title="Delete"
                
                onClick={() => handleDelete(id)}
                className="w-5 h-5 cursor-pointer "
                alt=""
              /> */}
              <FaEllipsisV
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setOpenDotMenu((prevIndex) =>
                    prevIndex === index ? null : index
                  );
                }}
                className="w-5 h-5 cursor-pointer"
              />
              {openDotMenu === index && (
                <div
                  ref={dotPopupRef}
                  className="absolute flex flex-col w-[186.99px] font-[400] text-[#616161] px-3 bg-[#fafafa] rounded-[8px] shadow-md border border-[#eaeaea] top-[25px] right-[3px] py-[8px] z-10"
                >
                  <button
                    onClick={() => {
                      setOpenHidePop(!openHidePop);
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] break-none  hover:text-[#33B0CA] text-[#252525]">
                      {" "}
                      Visibility Settings
                    </p>{" "}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(id);
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500]  hover:text-[#33B0CA] break-none text-[#252525]">
                      {" "}
                      Delete Premise
                    </p>{" "}
                  </button>
                  <button
                    onClick={() => {
                      setOpenCharacterChart(project_id);
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500]  hover:text-[#33B0CA] break-none text-[#252525]">
                      {" "}
                      Characters and Roles
                    </p>{" "}
                  </button>
                  <button
                    onClick={() => {
                      handleOpenSp();
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500]  hover:text-[#33B0CA] break-none text-[#252525]">
                      {" "}
                      Open <span className="scriptpad-m">Script Pad</span>
                    </p>{" "}
                  </button>

                  {/* */}
                </div>
              )}
              {/* <FaEllipsisV
                onClick={() => setOpenHidePop(!openHidePop)}
                className="w-5 h-5 cursor-pointer"
              /> */}
              {openHidePop && (
                <HideOptionPop
                  setOpenHidePop={setOpenHidePop}
                  id={id}
                  refetch={refetch}
                  user={user}
                  filter_flag={filter_flag}
                  comment_filter_flag={comment_filter_flag}
                  visible_to={visible_to}
                />
              )}
            </div>
          ) : (
            <img
              data-te-toggle="tooltip"
              title="Send Message"
              src={msgIcon}
              className="w-8 h-8 mt-[-13px] cursor-pointer"
              alt=""
              onClick={() => setUserMail(true)}
            />
          )}
        </div>
      </div>
      {/* middle div */}
      <div className="bg-[#FAFAFA] h-[189px] border !border-[#f8f8f8] ">
        <div
          className={` w-[93%] bg-[#FAFAFA]  h-[189px] rounded-[8px]  mx-auto   border border-[#eaeaea] relative
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
                  width: "92%",
                  borderRadius: "8px",
                  // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                }
              : { backgroundColor: bg_color }
          }
          onLoad={() => setImageLoaded(true)}
        >
          <div
            onClick={() => {
              setOpenPop(true);
              setShowRefine(false);
              setOpenDotMenu(null);
              setSelectedPremiseObj(p);
              setSelectedPremiseSpProjectId(project_id);
              setTransPopup(false);
            }}
            // className={`absolute inset-0 w-[100%] mx-auto backdrop-filter flex items-center justify-center backdrop-blur-sm px-[14px] text-[16px] rounded-[8px] text-[#616161] leading-5 font-[400] overflow-hidden `}
            className="absolute cursor-pointer inset-0  backdrop-blur-sm  text-[16px] leading-[19.83px] rounded-[8px] overflow-hidden break-words px-[14px] py-[12px]"
          >
            <p
              className={`${boldStyle} ${italicStyle} ${underlineStyle} ${hexColor} notranslate`}
              style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
            >
              {viewText}
              {/* {splitText[1]} */}
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
      <div className="flex justify-between items-center bg-[#FAFAFA] rounded-b-[8px] px-[15px] pb-[15px] pt-[25px] ">
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
              setHideDisable,
              hideDisable,
              project_id,
            }}
            refetch={refetch}
            setIsLiked={setIsLiked}
            actTwoEnd={actTwoEnd}
            actOneThreshold={actOneThreshold}
          />
          <CommentPremise
            data={{
              // finalCount,
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
              setHideDisable,
              hideDisable,
              project_id,
            }}
            refetch={refetch}
            setIsLiked={setIsLiked}
            p={p}
          />
        </div>
        {/* 2nd div */}

        <div className="ml-[15px] flex gap-2 items-center">
          <TranslatePremise
            {...{transPopClose,setTransPopClose,setViewText}}
            data={{
              id,
              dText,
              source_language,
              project_id,
            }} 
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
      {openPop && (
        <Popup
          popClose={() => setOpenPop(false)}
          setIsLiked={setIsLiked}
          data={{
            id,
            dText,
            bg_color,
            bg_img,
            likes,
            stylings,
            created_by,
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
            setHideDisable,
            hideDisable,
            hiddenCountRefetch,
            project_id,
            m_value: p?.m_value,
          }}
          viewText={viewText}
          refetch={refetch}
          p={p}
        />
      )}
      {openCharacterChart && (
        <CharacterEditablePop
          setCharacterEditPop={setOpenCharacterChart}
          characterArray={characterArray}
          currentProjectData={currentProjectData}
          setCharacterArray={setCharacterArray}
          onlyAdd={onlyAdd}
          handleUpdateSavedChar={handleUpdateSavedChar}
          characterLoading={isCharLoading}
          project_id={p?.project_id}
        />
      )}
      {/* {confirmOpenSp && (
        <ConfirmationModal
          onClose={() => {
            setConfirmOpenSp(false);
          }}
          onConfirm={() => handleOpenSp()}
          title="Beat added, would you like to open script now ?"
          content="Beat added would you like to open script now "
        />
      )} */}
    </div>
  );
};
export default PremiseCard;
