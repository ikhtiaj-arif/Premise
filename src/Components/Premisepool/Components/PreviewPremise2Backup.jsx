import React, { useContext, useEffect, useState } from "react";
import { FaBold, FaItalic, FaRegTrashAlt, FaUnderline } from "react-icons/fa";
import { PiTextAUnderlineBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MyContext } from "../../../App";
import {
  useEditPremiseMutation,
  useGetFilteredLangQuery,
  useGetPremiseUserQuery,
  usePostPremiseMutation,
} from "../../../app/EndPoints/premisePoolApi";
import { setUser } from "../../../app/Slices/userSlice";
import fillIcon from "../../../img/Icons/fillicon.png";
import bgIcon from "../../../img/Icons/setBgIcn.png";
import Popup from "../Popup";
import { hideUnhidePremise } from "../PreiseUtils";

const PremisePreview2 = ({
  newText,
  data,
  setAddPopup,
  setOpenPop,
  openPop,
  handleGoBack,
  refetch

}) => {
  //console.log("data", data);
  const { isAddNew, setIsAddNew } = useContext(MyContext);

  const { data: userQuery, isUserLoading, refetch:userRefetch } = useGetPremiseUserQuery();
  const {
    data: lang,
    isLangLoading,
    refetch: langRefetch,
  } = useGetFilteredLangQuery();

  const [previewPremise, isPremiseLoading,status, isError] = usePostPremiseMutation();
  
  
  const [previewEdit] = useEditPremiseMutation();
  // const user = useSelector((state) => state?.user?.id);
  // const userFirstName = useSelector((state) => state?.user?.firstName);
  // const userLastName = useSelector((state) => state?.user?.lastName);
  // console.log("object", userQuery);
  const user =  userQuery?.id
  const userFirstName = userQuery?.first_name;
  const userLastName = userQuery?.last_name;

  // console.log("user", user);
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [imgUrl, setImageUrl] = useState(data?.bg_img);
  const [randomColor, setRandomColor] = useState(data?.bg_color || "#FAFAFA");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [color, setColor] = useState(false);
  const [hexColor, setHexColor] = useState(data?.stylings?.hexColor);
  const [isLoading, setIsLoading] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [premiseData, setPremiseData] = useState(null);

  // useEffect(()=>{

  //    const imageName = data?.bg_img;
  //    const extension = imageName.split(".").pop();
  //    const existingFile = new File( imageName + "." + extension, {

  //   });
  //   // const imageUrl = URL.createObjectURL(existingImg);
  //   // setImageUrl(imageUrl);

  //   // const existingImg = new File([file], data?.bg_img + "." + extension, {
  //   //   type: file.type,
  //   // });
  //   // console.log("renamedFile", renamedFile);
  //   // setFile(renamedFile);
  //   const imageUrl = URL.createObjectURL(existingFile);
  //   // console.log("post img nme", imageUrl);
  //   setImageUrl(imageUrl);
  //   // event.target.value = null;

  // },[data ])

  useEffect(() => {
    setBold(data?.stylings?.boldStyle === "font-bold");
    setItalic(data?.stylings?.italicStyle === "italic");
    setUnderline(data?.stylings?.underlineStyle === "underline");
    setHexColor(data?.stylings?.hexColor);
  }, [data?.stylings]);
  useEffect(() => {
    if (!user) {
      dispatch(setUser(userQuery));
    }
  }, [userQuery, dispatch, user]);
  // Toggle bold style
  const toggleBold = () => {
    setBold((prev) => !prev);
  };
  // Toggle italic style
  const toggleItalic = () => {
    setItalic((prev) => !prev);
  };
  // Toggle underline style
  const toggleUnderline = () => {
    setUnderline((prev) => !prev);
  };
  // Toggle color picker
  const toggleColorPicker = () => {
    setColor((prev) => !prev);
  };

  // browsing file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const randomChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomStringLength = 10; // Adjust the length of the random string as needed
    const getRandomString = (length) => {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += randomChars.charAt(
          Math.floor(Math.random() * randomChars.length)
        );
      }
      return result;
    };
    const newName = `premiseImage_${getRandomString(randomStringLength)}`;
    const originalFileName = file?.name;
    const extension = originalFileName.split(".").pop();
    const renamedFile = new File([file], newName + "." + extension, {
      type: file.type,
    });
    //console.log("renamedFile", renamedFile);
    setFile(renamedFile);
    const imageUrl = URL.createObjectURL(renamedFile);
    //console.log("post img nme", imageUrl);
    setImageUrl(imageUrl);
    event.target.value = null;
  };

  // console.log("outside", imgUrl);
  // bg color
  const handleColor = () => {
    const randomHexColor =
      "#" + Math?.floor(Math.random() * 16777215).toString(16);
    setRandomColor(randomHexColor);
  };

  const [openDotMenu, setOpenDotMenu] = useState(null);
  const [hideDisable, setHideDisable] = useState(false);

  const handleHideUnhidePremise = async (id) => {
    hideUnhidePremise(id, setHideDisable, userRefetch, setOpenDotMenu)
  }


  // submit

  const submitPremise = async () => {
    //console.log("inside", imgUrl);
    setColor(false);
    setIsLoading(true);
    const formData = new FormData();

    const text = newText;
    const styling = JSON.stringify({
      boldStyle: bold ? "font-bold" : "font-normal",
      italicStyle: italic ? "italic" : "not-italic",
      underlineStyle: underline ? "underline" : "no-underline",
      hexColor,
    });

    const subText = `${styling} + ${text}`;
    formData.append("text", subText);

    if (file) {
      formData.append("bg_img", file);
    }
    if (imgUrl === null) {
      formData.append("bg_img", "");
    }
    if (randomColor) {
      formData.append("bg_color", randomColor);
    }

    formData.append("created_by", user);
    const previewData = {
      id: data?.id,
      body: formData,
    };

    const res = data?.id
      ? await previewEdit(previewData)
      : await previewPremise(formData);

    if (res?.data?.id) {
      // console.log(res?.data?.id)
      
      const text = res?.data?.text;
      const splitText = text.split("+");
      const dText = splitText[1];

      const stylings = JSON.parse(splitText[0]);
      const bg_color = res?.data?.bg_color;
      const bg_img = res?.data?.bg_img;
      const comments = res?.data?.comments;
      const created_at = res?.data?.created_at;
      const created_by = { id: user, first_name:userFirstName, last_name:userLastName,username: user };
      const likes = res?.data?.likes;
      const id = res?.data?.id;
      const source_language = res?.data?.source_language;
      const updated_at = res?.data?.updated_at;

      const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
        // timeZone: "GMT",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        // weekday: "short",
        day: "numeric",
        month: "short",
      });
      const formattedTime = new Date(created_at).toLocaleTimeString("en-US", {
        // timeZone: "GMT",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour: "numeric",
        minute: "numeric",
      });

      const data = {
        stylings,
        bg_color,
        bg_img,
        comments,
        created_at,
        created_by,
        likes,
        id,
        source_language,
        updated_at,
        dText,
        formattedDate,
        formattedTime,
        user,
        handleHideUnhidePremise,
        setHideDisable,
        hideDisable,
        openDotMenu
      };
      // console.log("status 200", data);

      // setAddPopup(false);

      setPremiseData(data);
      userRefetch();
      setIsLoading(false);
      setIsAddNew(true);
      toast.success(
        `Successfully ${data?.id ? "updated" : "added"} your Premise`,
        {
          position: toast.POSITION.TOP_CENTER,
        }
      );

      langRefetch();
      setOpenPop(true);
    } else if(res?.error?.status  === 400) {
      setAddPopup(false);
      // console.log("StatusError",res);
      toast.error(res.error.data.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    }else{
      setAddPopup(false);
      // console.log("StatusError",res);
      toast.error("Something went wrong!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };


  
  // const submitPremise = async () => {
  //   try {
  //     setColor(false);
  //     setIsLoading(true);
  //     const formData = new FormData();
  //     const text = newText;
  //     const styling = JSON.stringify({
  //       boldStyle: bold ? "font-bold" : "font-normal",
  //       italicStyle: italic ? "italic" : "not-italic",
  //       underlineStyle: underline ? "underline" : "no-underline",
  //       hexColor,
  //     });
  
  //     const subText = `${styling} + ${text}`;
  //     formData.append("text", subText);
  
  //     if (file) {
  //       formData.append("bg_img", file);
  //     } else if (imgUrl === null) {
  //       formData.append("bg_img", "");
  //     }
  //     if (randomColor) {
  //       formData.append("bg_color", randomColor);
  //     }
  
  //     formData.append("created_by", user);
      
  //     const previewData = {
  //       id: data?.id,
  //       body: formData,
  //     };
  
  //     const res = data?.id ? await previewEdit(previewData) : await previewPremise(formData);
 
  // console.log("StatusError", res);
 
  //     if (res?.data?.id) {
  //       const text = res?.data?.text;
  //       const [stylingString, dText] = text.split(" + ");
  //       const stylings = JSON.parse(stylingString);
  
  //       const {
  //         bg_color,
  //         bg_img,
  //         comments,
  //         created_at,
  //         likes,
  //         id,
  //         source_language,
  //         updated_at,
  //       } = res?.data;
  
  //       const created_by = {
  //         id: user,
  //         first_name: userFirstName,
  //         last_name: userLastName,
  //         username: user,
  //       };
  
  //       const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
  //         timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //         day: "numeric",
  //         month: "short",
  //       });
  
  //       const formattedTime = new Date(created_at).toLocaleTimeString("en-US", {
  //         timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //         hour: "numeric",
  //         minute: "numeric",
  //       });
  
  //       const premiseData = {
  //         stylings,
  //         bg_color,
  //         bg_img,
  //         comments,
  //         created_at,
  //         created_by,
  //         likes,
  //         id,
  //         source_language,
  //         updated_at,
  //         dText,
  //         formattedDate,
  //         formattedTime,
  //         user,
  //         handleHideUnhidePremise,
  //         setHideDisable,
  //         hideDisable,
  //         openDotMenu
  //       };
  
  //       setPremiseData(premiseData);
  //       userRefetch();
  //       setIsLoading(false);
  //       setIsAddNew(true);
  
  //       toast.success(`Successfully ${data?.id ? "updated" : "added"} your Premise`, {
  //         position: toast.POSITION.TOP_CENTER,
  //       });
  
  //       langRefetch();
  //       setOpenPop(true);
  //     } else {
  //       throw new Error("Invalid response data");
  //     }
  //   } catch (error) {
  //     setIsLoading(false);
  //     setAddPopup(false);
  //     console.log("error", error);
  //     toast.error(`Something went wrong: ${error.message}`, {
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //   }
  // };
  
  useEffect(() => {
    // console.log("openPop", premiseData);
  }, [premiseData]);

  // remove bg img
  const handleImgFileDelete = () => {
    setImageUrl(null);
    setFile(null);
    userRefetch();
  };

  return (
    <div>
      <div className="bg-[#FAFAFA] flex justify-between items-center p-1 cursor-pointer mx-[28px] my-[18px] border border-[#EAEAEA] shadow-sm rounded-[8px] px-3">
        <div className="flex items-center gap-3">
          {/* browsing */}
          <button data-te-toggle="tooltip" title="Add background image" onClick={() => document.getElementById("file-input").click()}>
            <img  src={bgIcon} className="w-[28px] h-[28px]" alt="" />
          </button>

          <input
            type="file"
            id="file-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {imgUrl && (
            <div data-te-toggle="tooltip" title="Delete background image">
              <button onClick={handleImgFileDelete}>
                <FaRegTrashAlt className="h-[20px] w-[20px]" />
              </button>
            </div>
          )}
          {/* color plate */}
          <div
            data-te-toggle="tooltip"
            title="Background color palate"
            className="pt-[3px]"
          >
            <button onClick={handleColor}>
              <img src={fillIcon} className="w-[25px] h-[25px] mt-[2px]" alt="" />
            </button>
          </div>
        </div>
        {/* editor content */}
        <div className="flex gap-3 items-center relative">
          <div data-te-toggle="tooltip" title="Bold">
            <FaBold
              onClick={toggleBold}
              className={bold ? "text-[#33B0CA]  text-[15.6px]" : " text-[15.6px]"}
            />
          </div>
          <div data-te-toggle="tooltip" title="Underline">
            <FaUnderline
              onClick={toggleUnderline}
              className={
                underline ? "text-[#33B0CA]  text-[15px]" : " text-[15px]"
              }
            />
          </div>
          <div data-te-toggle="tooltip" title="Italic">
            <FaItalic
              onClick={toggleItalic}
              className={
                italic ? "text-[#33B0CA]  text-[15.6px]" : " text-[15.6px]"
              }
            />
          </div>
          <div data-te-toggle="tooltip" title="Text Color palate">
            <PiTextAUnderlineBold
              onClick={toggleColorPicker}
              className={
                hexColor ? "text-[#33B0CA]  text-[18.6px]" : "text-black text-[18.6px]"
              }
            />
          </div>
          {color && (
            <div className="absolute bg-[#2525258c]  h-24 w-24 top-7 left-4 grid grid-cols-4 gap-[2px] z-10 p-[6px] rounded-[4px]">
              <div
                onClick={() => {setHexColor("text-[#FF0303]")
                setColor(false)}}
                className="bg-[#FF0303] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#009FBD]")
                setColor(false)
                } }
                className="bg-[#009FBD] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#FFBF00]")
              setColor(false)
              }}
                className="bg-[#FFBF00] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#1C7947]")
              setColor(false)
              }}
                className="bg-[#1C7947] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#8236CB]")
              setColor(false)
              }}
                className="bg-[#8236CB] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#FF6701]")
              setColor(false)
              }}
                className="bg-[#FF6701] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#0D0CB5]")
              setColor(false)
              }}
                className="bg-[#0D0CB5] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#84142D]")
              setColor(false)
              }}
                className="bg-[#84142D] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#6FEDD6]")
              setColor(false)
              }}
                className="bg-[#6FEDD6] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#ffffff]")
              setColor(false)
              }}
                className="bg-[#ffffff] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#F30CD4]")
              setColor(false)
              }}
                className="bg-[#F30CD4] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#3B0944]")
              setColor(false)
              }}
                className="bg-[#3B0944] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#020205]")
              setColor(false)
              }}
                className="bg-[#020205] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#E84545]")
              setColor(false)
              }}
                className="bg-[#E84545]  rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#00FFCC]")
              setColor(false)
              }}
                className="bg-[#00FFCC] rounded-full"
              />
              <div
                onClick={() => {setHexColor("text-[#FD89DD]")
              setColor(false)
              }}
                className="bg-[#FD89DD] rounded-full"
              />
            </div>
          )}
        </div>
      </div>
      {/* center */}
      <div
        className="bg-[#FAFAFA] h-[200px] flex justify-center items-center relative mx-[28px] shadow-md border border-[#eaeaea] rounded-[8px]"
        style={
          imgUrl
            ? {
                backgroundImage: `url(${imgUrl})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "88%",
                marginLeft: "auto",
                marginRight: "auto",
              }
            : { backgroundColor: randomColor }
        }
      >
        {/* edited text */}
        <div 
        // className="absolute shadow-md inset-0 text-[16px] backdrop-filter backdrop-blur-sm flex p-5 rounded-[8px]">
        className="absolute inset-0  shadow-md backdrop-blur-sm  text-[14px] rounded-[8px] overflow-hidden break-words px-[20px] py-[12px]">
          <p
            className={`${bold ? "font-bold" : ""} ${italic ? "italic" : ""} ${
              underline ? "underline" : ""
            } ${hexColor}`}
          >
            {newText}
          </p>
        </div>
      </div>
      {/* button part */}
      <div className="lg:bg-[#FAFAFA] flex gap-5 justify-end py-1 text-center   mx-[28px] my-[20px]">
        <button
          disabled={isLoading}
          className={
            isLoading
              ? "bg-[#9A9A9A] rounded-[8px] h-[32px] px-[12px] text-[14px] font-[600] text-white hover:bg hidden"
              : "bg-[#FAFAFA] border h-[32px] !border-[#33B0CA] text-[#33B0CA] rounded-[8px]  px-[12px] text-[14px] font-[600]"
          }
          onClick={() => handleGoBack()}
        >
          Cancel
        </button>
        {isLoading ? (
          <button
            className={`bg-[#33B0CA] text-white rounded-[8px] h-[32px] px-[10px] text-[14px] font-[600] defaultCursor-premisePool`}
          >
            Posting...
          </button>
        ) : (
          <button
            onClick={submitPremise}
            className={`bg-[#33B0CA] text-white rounded-[8px] h-[32px] px-[28px] text-[14px] font-[600]`}
          >
            Post
          </button>
        )}
      </div>
      {openPop && premiseData && (
        <Popup
          popClose={() => {
            setOpenPop(false);
            setAddPopup(false);
          }}
          setIsLiked={setIsLiked}
          data={premiseData}
          refetch={refetch}
        />
      )}
    </div>
  );
};
export default PremisePreview2;
