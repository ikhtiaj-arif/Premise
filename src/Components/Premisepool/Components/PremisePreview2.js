import React, { useContext, useEffect, useRef, useState } from "react";
import { FaBold, FaItalic, FaRegTrashAlt, FaUnderline } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
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
import {
  useCreateProjectMutation,
  useGetMyAllProjectQuery,
  useUpdateSpProjectMutation,
} from "../../../app/EndPoints/ScriptPad/project";
import { setUser } from "../../../app/Slices/userSlice";
import fillIcon from "../../../img/Icons/fillicon.png";
import bgIcon from "../../../img/Icons/setBgIcn.png";
import { sortedLanguages } from "../Languages";
import Popup from "../Popup";
import { hideUnhidePremise } from "../PreiseUtils";

const PremisePreview2 = ({
  newText,
  data,
  setAddPopup,
  setOpenPop,
  openPop,
  handleGoBack,
  refetch,
}) => {
  // const options = {
  //   "Short film": [
  //     "Upto 2 Minutes",
  //     "2 to 5 Minutes",
  //     "5 to 15 Minutes",
  //     "15 to 30 Minutes",
  //   ],
  //   "Feature film": ["1 Hour", "2 Hours", "3 Hours"],
  //   "TV series": [""],
  //   "Web series": [""],
  //   Documentary: [
  //     "Upto 5 Minutes",
  //     "5 to 15 Minutes",
  //     "15 to 30 Minutes",
  //     "30 to 60 Minutes",
  //     "More then 60 Minutes",
  //   ],
  //   "Animated film": [
  //     "Upto 5 Minutes",
  //     "5 to 15 Minutes",
  //     "15 to 30 Minutes",
  //     "30 to 60 Minutes",
  //     "More then 60 Minutes",
  //   ],
  // };
  const options = {
    "Short film": [
      { text: "Upto 2 Minutes", value: "Upto 2 Minutes" },
      { text: "2 to 4 Minutes", value: "2 to 4 Minutes" },
      { text: "5 to 14 Minutes", value: "5 to 14 Minutes" },
      { text: "15 to 29 Minutes", value: "15 to 29 Minutes" },
      { text: "30 Minutes", value: "30 Minutes" },
    ],
    "Feature film": [
      { text: "1 Hour", value: "1 Hour" },
      { text: "2 Hours", value: "2 Hours" },
      { text: "3 Hours", value: "3 Hours" },
    ],
    // "TV series": [{ text: "", value: 0 }],
    // "Web series": [{ text: "", value: 0 }],
    // Documentary: [
    //   { text: "Upto 5 Minutes", value: 5 },
    //   { text: "5 to 15 Minutes", value: 15 },
    //   { text: "15 to 30 Minutes", value: 30 },
    //   { text: "30 to 60 Minutes", value: 60 },
    //   { text: "More than 60 Minutes", value: 90 },
    // ],
    // "Animated film": [
    //   { text: "Upto 5 Minutes", value: 5 },
    //   { text: "5 to 15 Minutes", value: 15 },
    //   { text: "15 to 30 Minutes", value: 30 },
    //   { text: "30 to 60 Minutes", value: 60 },
    //   { text: "More than 60 Minutes", value: 90 },
    // ],
  };

  const genera = [
    "Action",
    "Crime",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Romantic",
    "Science_fiction",
    "Thriller",
  ];

  const subGenraItems = {
    Action: ["Superhero", "Martial arts", "Action Comedy"],
    Adventure: ["Adventure", "Treasure hunt", "War action adventure"],
    Comedy: [
      "Black Comedy",
      "Buddy Comedy",
      "Comedic Thriller",
      "Farce",
      "Mockumentary",
      "Musical Comedy",
      "Parody",
      "Romantic Comedy",
      "Slapstick",
      "Sports Comedy",
    ],
    Crime: [
      "Film noir",
      "Neo-noir",
      "Mafia",
      "Military Thriller",
      "Psychological Thriller",
    ],
    Drama: [
      "Biopic",
      "Coming of age drama",
      "Costume drama",
      "Crime drama",
      "Romantic drama",
      "Tragedy",
      "War movie",
    ],
    Fantasy: [
      "Dark fantasy",
      "Epic fantasy",
      "Low fantasy",
      "Magical realism",
      "Fables",
      "Fairy tales",
      "Superhero fiction",
    ],
    Horror: [
      "B-Movie",
      "Found footage",
      "Monster",
      "Paranormal film",
      "Slasher",
      "Vampire",
      "Zombie",
    ],
    Romantic: [
      "Bromantic Comedy",
      "Chick flick",
      "Historical romance",
      "Gothic romance",
      "Romantic Comedy",
    ],
    Science_fiction: [
      "Cyberpunk",
      "Disaster",
      "Dystopian",
      "Fairy tale",
      "Fantasy",
      "Space opera",
      "Time travel",
    ],
    Thriller: [
      "Action Thriller",
      "Crime Thriller",
      "Legal thriller",
      "Mystery Thriller",
      "Romantic Thriller",
      "Science fiction Thriller",
      "Political Thriller",
      "Spy Thriller",
    ],
    Other: ["", ""],
  };
  //console.log("data", data);
  const { isAddNew, setIsAddNew ,selectedSpProjectID, setSelectedSpProjectID,createdSpProjectID, setCreatedSpProjectID} = useContext(MyContext);

  const {
    data: userQuery,
    isUserLoading,
    refetch: userRefetch,
  } = useGetPremiseUserQuery();
  const {
    data: lang,
    isLangLoading,
    refetch: langRefetch,
  } = useGetFilteredLangQuery();

  const [previewPremise, isPremiseLoading, status, isError] =
    usePostPremiseMutation();

  const [previewEdit] = useEditPremiseMutation();
  const [createProject, resInfo] = useCreateProjectMutation();
  const [updateProject, updateResInfo] = useUpdateSpProjectMutation();
  // const user = useSelector((state) => state?.user?.id);
  // const userFirstName = useSelector((state) => state?.user?.firstName);
  // const userLastName = useSelector((state) => state?.user?.lastName);
  // console.log("object", userQuery);
  const user = userQuery?.id;
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
  const [createNewProject, setCreateNewProject] = useState(false);

  const [isLiked, setIsLiked] = useState(false);

  // const [generaItem, setGeneraItem] = useState(false);

  const [premiseData, setPremiseData] = useState(null);

  const [natureOfProject, setNatureOfProject] = useState("");
  const [durationOptions, setDurationOptions] = useState([]);

  const handleNatureOfProjectChange = (e) => {
    const selectedProject = e.target.value;
    setNatureOfProject(selectedProject);
    setDurationOptions(options[selectedProject] || []);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isProtagonistOpen, setIsProtagonistOpen] = useState(false);
  const [isNatureProjectOpen, setIsNatureProjectOpen] = useState(false);
  const [isdurationOpen, setIsdurationOpen] = useState(false);
  const [isgenreOpen, setIsgenreOpen] = useState(false);
  const [isSubGenreOpen, setIsSubGenreOpen] = useState(false);
  const [isSetinPeriodOpen, setSetinPeriodOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const [noOfEpi, setNoOfEpi] = useState(null);
  const [protaAge, setProtaAge] = useState(null);
  const [generaItem, setGeneraItem] = useState("");
  const [subGeneraItem, setSubGeneraItem] = useState("");

  const [duration, setDuration] = useState(null);
  const [periodSetIn, setPeriodSetIn] = useState();
  const [protagonist, setProtagonist] = useState(null);
  const [protagonistName, setProtagonistName] = useState("");

  const [geographyItem, setGeographyItem] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [selectedSpProject, setSelectedSpProject] = useState();

  // const [selectedSpProjectID, setSelectedSpProjectID] = useState("");
  // const [createdSpProjectID, setCreatedSpProjectID] = useState("");
  const [spProjectName, setSpProjectName] = useState("");
  const [matchingProject, setMatchingProject] = useState(null);

  console.log("createdSpProjectID", createdSpProjectID);

  const [language, setlanguage] = useState("");
  console.log("language", language);

  const {
    data: ProjectsObj,
    isLoading: isProjectLoading,
    refetch: projectRefetch,
  } = useGetMyAllProjectQuery();

  useEffect(() => {
    if (selectedSpProjectID === "") {
      setMatchingProject(null);
      setlanguage("");
      setAuthorName("");
      setNatureOfProject("");
      setDuration(null);
      setGeneraItem("");
      setSubGeneraItem("");
      setGeographyItem("");
      setPeriodSetIn();
      setProtagonistName("");
      setProtagonist(null);
      setProtaAge("");
    } else {
      setCreateNewProject(false);
      const matchingProject = ProjectsObj?.projects.find(
        (project) => project.pro_uuid === selectedSpProjectID
      );

      if (matchingProject) {
        setMatchingProject(matchingProject);
        setlanguage(matchingProject?.language);
        setAuthorName(matchingProject?.ownername);
        setNatureOfProject(matchingProject?.nature_project);
        setDuration(matchingProject?.duration_episodes);
        setGeneraItem(matchingProject?.genre);
        setSubGeneraItem(matchingProject?.sub_genre);
        setGeographyItem(matchingProject?.geography);
        setPeriodSetIn(matchingProject?.period);
        setProtagonistName(matchingProject?.protagonist_name);
        setProtagonist(matchingProject?.protagonist_type);
        setProtaAge(matchingProject?.protagonist_age);
        setSelectedSpProject(matchingProject?.name);
      }
    }
  }, [selectedSpProjectID, ProjectsObj]);

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
    hideUnhidePremise(id, setHideDisable, userRefetch, setOpenDotMenu);
  };

  const handleProtagonistNameChange = (e) => {
    const value = e.target.value;
    const trimmedValue = value.replace(/^\s+/, ""); // Remove leading spaces
    const regex = /^[A-Za-z ]*$/;

    if (regex.test(trimmedValue)) {
      setProtagonistName(trimmedValue);
    } else {
      // alert('Invalid characters detected. Only letters and spaces are allowed.');
    }
  };

  const handleGeographyChange = (e) => {
    const value = e.target.value;
    const trimmedValue = value.replace(/^\s+/, ""); // Remove leading spaces
    const regex = /^[A-Za-z ]*$/;

    if (regex.test(trimmedValue)) {
      setGeographyItem(trimmedValue); // Keep original value to retain user's formatting
    } else {
      // alert('Invalid characters detected. Only letters and spaces are allowed.');
    }
  };

  const submitPremise = async (e) => {
    e.preventDefault();

    // Disable submit button to prevent multiple clicks
    setIsLoading(true);

    try {
      const formData = new FormData();
      const text = newText;
      const styling = {
        boldStyle: bold ? "font-bold" : "font-normal",
        italicStyle: italic ? "italic" : "not-italic",
        underlineStyle: underline ? "underline" : "no-underline",
        hexColor,
      };
      const subText = `${JSON.stringify(styling)} + ${text}`;
      formData.append("text", subText);

      if (file) {
        formData.append("bg_img", file);
      } else if (imgUrl === null) {
        formData.append("bg_img", ""); // Ensure bg_img is set to empty string if no file or imgUrl
      }

      if (randomColor) {
        formData.append("bg_color", randomColor);
      }

      formData.append("created_by", user);

      // Add project-specific data
      formData.append("nature_of_project", natureOfProject);
      if (["TV series", "Web series"].includes(natureOfProject)) {
        formData.append("episodes", noOfEpi);
      } else {
        formData.append("minutes", duration);
      }
      if (createNewProject) {
        formData.append("project_name", spProjectName);
      }
      formData.append("genre", generaItem);
      formData.append("sub_genre", subGeneraItem);
      formData.append("period", periodSetIn);
      formData.append("geography", geographyItem);
      formData.append("protagonist_type", protagonist);
      formData.append("protagonist_name", protagonistName);
      formData.append("protagonist_age", protaAge);

      const previewData = {
        // id: data?.id,
        body: formData,
      };
      // Determine whether to call edit or add API based on data.id existence
      // const res = data?.id
      //   ? await previewEdit(previewData)
      //   : await previewPremise(formData);

      const data = {
        name: spProjectName,
        language: language,
        ownername: authorName,
        nature_project: natureOfProject,
        duration: duration,
        genre: generaItem,
        sub_genre: subGeneraItem,
        geography: geographyItem,
        period: periodSetIn,
        protagonist_type: protagonist,
        protagonist_name: protagonistName,
        protagonist_age: protaAge,
      };

      if (createNewProject) {
        const response = await createProject(data);

        if (response) {
          refetch();
          setCreatedSpProjectID(response?.data?.projects?.pro_uuid);
          formData.append("project_id", response?.data?.projects?.pro_uuid);

          // post premise
          const res = await previewPremise(formData);
          if (res?.data?.id) {
            const {
              text,
              bg_color,
              bg_img,
              comments,
              created_at,
              likes,
              id,
              source_language,
              updated_at,
            } = res.data;
            const created_by = {
              id: user,
              first_name: userFirstName,
              last_name: userLastName,
              username: user,
            };

            const formattedDate = new Date(created_at).toLocaleDateString(
              "en-US",
              {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                day: "numeric",
                month: "short",
              }
            );
            const formattedTime = new Date(created_at).toLocaleTimeString(
              "en-US",
              {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hour: "numeric",
                minute: "numeric",
              }
            );

            const data = {
              stylings: JSON.parse(text.split("+")[0]),
              bg_color,
              bg_img,
              comments,
              created_at,
              created_by,
              likes,
              id,
              source_language,
              updated_at,
              dText: text.split("+")[1],
              formattedDate,
              formattedTime,
              user,
              handleHideUnhidePremise,
              setHideDisable,
              hideDisable,
              openDotMenu,
            };

            // Update state with new premise data
            setPremiseData(data);
            userRefetch();
            setIsAddNew(true);
            toast.success(
              `Successfully ${data?.id ? "updated" : "added"} your Premise`,
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 800,
              }
            );
            langRefetch();
            setOpenPop(true);
          } else {
            // Handle API errors
            toast.error(res?.error?.data?.message || "Something went wrong!", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 800,
            });
          }
        }
      } else {
        data.id = selectedSpProjectID;
        data.name = selectedSpProject;
        const response = await updateProject(data);

        if (response) {
          formData.append("project_id", selectedSpProjectID);

          // post premise
          const res = await previewPremise(formData);

          console.log("PostedData", res);

          if (res?.data?.id) {
            const {
              text,
              bg_color,
              bg_img,
              comments,
              created_at,
              likes,
              id,
              source_language,
              updated_at,
              project_id
            } = res.data;
            const created_by = {
              id: user,
              first_name: userFirstName,
              last_name: userLastName,
              username: user,
            };

            const formattedDate = new Date(created_at).toLocaleDateString(
              "en-US",
              {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                day: "numeric",
                month: "short",
              }
            );
            const formattedTime = new Date(created_at).toLocaleTimeString(
              "en-US",
              {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hour: "numeric",
                minute: "numeric",
              }
            );

            const data = {
              stylings: JSON.parse(text.split("+")[0]),
              bg_color,
              bg_img,
              comments,
              created_at,
              created_by,
              likes,
              id,
              source_language,
              updated_at,
              dText: text.split("+")[1],
              formattedDate,
              formattedTime,
              user,
              handleHideUnhidePremise,
              setHideDisable,
              hideDisable,
              openDotMenu,
            project_id

            
            };

            // Update state with new premise data
            setPremiseData(data);
            userRefetch();
            setIsAddNew(true);
            toast.success(
              `Successfully ${data?.id ? "updated" : "added"} your Premise`,
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 800,
              }
            );
            langRefetch();
            setOpenPop(true);
          } else {
            // Handle API errors
            toast.error(res?.error?.data?.message || "Something went wrong!", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 800,
            });
          }
        }
      }

      // const res = await previewPremise(formData);

      // if (res?.data?.id) {
      //   const {
      //     text,
      //     bg_color,
      //     bg_img,
      //     comments,
      //     created_at,
      //     likes,
      //     id,
      //     source_language,
      //     updated_at,
      //   } = res.data;
      //   const created_by = {
      //     id: user,
      //     first_name: userFirstName,
      //     last_name: userLastName,
      //     username: user,
      //   };

      //   const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
      //     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      //     day: "numeric",
      //     month: "short",
      //   });
      //   const formattedTime = new Date(created_at).toLocaleTimeString("en-US", {
      //     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      //     hour: "numeric",
      //     minute: "numeric",
      //   });

      //   const data = {
      //     stylings: JSON.parse(text.split("+")[0]),
      //     bg_color,
      //     bg_img,
      //     comments,
      //     created_at,
      //     created_by,
      //     likes,
      //     id,
      //     source_language,
      //     updated_at,
      //     dText: text.split("+")[1],
      //     formattedDate,
      //     formattedTime,
      //     user,
      //     handleHideUnhidePremise,
      //     setHideDisable,
      //     hideDisable,
      //     openDotMenu,
      //   };

      //   // Update state with new premise data
      //   setPremiseData(data);
      //   userRefetch();
      //   setIsAddNew(true);
      //   toast.success(
      //     `Successfully ${data?.id ? "updated" : "added"} your Premise`,
      //     {
      //       position: toast.POSITION.TOP_CENTER,
      //       autoClose: 800,
      //     }
      //   );
      //   langRefetch();
      //   setOpenPop(true);
      // } else {
      //   // Handle API errors
      //   toast.error(res?.error?.data?.message || "Something went wrong!", {
      //     position: toast.POSITION.TOP_CENTER,
      //     autoClose: 800,
      //   });
      // }
    } catch (error) {
      console.error("Error submitting premise:", error);
      toast.error("Something went wrong!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
    } finally {
      setIsLoading(false); // Enable submit button after API call completes (whether success or error)
    }
  };

  // const submitPremise = async (e) => {
  //   e.preventDefault();
  //   //console.log("inside", imgUrl);
  //   setColor(false);
  //   setIsLoading(true);
  //   const formData = new FormData();

  //   const text = newText;
  //   const styling = JSON.stringify({
  //     boldStyle: bold ? "font-bold" : "font-normal",
  //     italicStyle: italic ? "italic" : "not-italic",
  //     underlineStyle: underline ? "underline" : "no-underline",
  //     hexColor,
  //   });

  //   const subText = `${styling} + ${text}`;
  //   formData.append("text", subText);

  //   if (file) {
  //     formData.append("bg_img", file);
  //   }
  //   if (imgUrl === null) {
  //     formData.append("bg_img", "");
  //   }
  //   if (randomColor) {
  //     formData.append("bg_color", randomColor);
  //   }

  //   formData.append("created_by", user);
  //   const previewData = {
  //     id: data?.id,
  //     body: formData,
  //   };

  //   formData.append("nature_of_project", natureOfProject);
  //   if (["TV series", "Web series"].includes(natureOfProject)) {
  //     formData.append("episodes", noOfEpi);
  //   } else {
  //     formData.append("minutes", duration);
  //   }

  //   formData.append("genre", generaItem);
  //   formData.append("sub_genre", subGeneraItem);
  //   formData.append("period", periodSetIn);
  //   formData.append("geography", geographyItem);
  //   formData.append("protagonist_type", protagonist);
  //   formData.append("protagonist_name", protagonistName);
  //   formData.append("protagonist_age", protaAge);

  //   const res = data?.id
  //     ? await previewEdit(previewData)
  //     : await previewPremise(formData);

  //   if (res?.data?.id) {
  //     // console.log(res?.data?.id)

  //     const text = res?.data?.text;
  //     const splitText = text.split("+");
  //     const dText = splitText[1];

  //     const stylings = JSON.parse(splitText[0]);
  //     const bg_color = res?.data?.bg_color;
  //     const bg_img = res?.data?.bg_img;
  //     const comments = res?.data?.comments;
  //     const created_at = res?.data?.created_at;
  //     const created_by = {
  //       id: user,
  //       first_name: userFirstName,
  //       last_name: userLastName,
  //       username: user,
  //     };
  //     const likes = res?.data?.likes;
  //     const id = res?.data?.id;
  //     const source_language = res?.data?.source_language;
  //     const updated_at = res?.data?.updated_at;

  //     const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
  //       // timeZone: "GMT",
  //       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //       // weekday: "short",
  //       day: "numeric",
  //       month: "short",
  //     });
  //     const formattedTime = new Date(created_at).toLocaleTimeString("en-US", {
  //       // timeZone: "GMT",
  //       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //       hour: "numeric",
  //       minute: "numeric",
  //     });

  //     const data = {
  //       stylings,
  //       bg_color,
  //       bg_img,
  //       comments,
  //       created_at,
  //       created_by,
  //       likes,
  //       id,
  //       source_language,
  //       updated_at,
  //       dText,
  //       formattedDate,
  //       formattedTime,
  //       user,
  //       handleHideUnhidePremise,
  //       setHideDisable,
  //       hideDisable,
  //       openDotMenu,
  //     };
  //     // console.log("status 200", data);

  //     // setAddPopup(false);

  //     setPremiseData(data);
  //     userRefetch();
  //     setIsLoading(false);
  //     setIsAddNew(true);
  //     toast.success(
  //       `Successfully ${data?.id ? "updated" : "added"} your Premise`,
  //       {
  //         position: toast.POSITION.TOP_CENTER,
  //         autoClose: 800,
  //       }
  //     );

  //     langRefetch();
  //     setOpenPop(true);
  //   } else if (res?.error?.status === 400) {
  //     setAddPopup(false);
  //     // console.log("StatusError",res);
  //     toast.error(res.error.data.message, {
  //       position: toast.POSITION.TOP_CENTER,
  //       autoClose: 800,
  //     });
  //   } else {
  //     setAddPopup(false);
  //     // console.log("StatusError",res);
  //     toast.error("Something went wrong!", {
  //       position: toast.POSITION.TOP_CENTER,
  //       autoClose: 800,
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

  const subGeneraOptions = subGenraItems[generaItem] || [];

  const dropdownRef = useRef(null);
  const natureProjectRef = useRef(null);
  const durationRef = useRef(null);
  const genreRef = useRef(null);
  const protagonistRef = useRef(null);
  const subGenreRef = useRef(null);
  const setinPeriodRef = useRef(null);
  const languageRef = useRef(null);
  const spProjectRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      natureProjectRef.current &&
      !natureProjectRef.current.contains(event.target)
    ) {
      setIsNatureProjectOpen(false);
    }
    if (durationRef.current && !durationRef.current.contains(event.target)) {
      setIsdurationOpen(false);
    }
    if (genreRef.current && !genreRef.current.contains(event.target)) {
      setIsgenreOpen(false);
    }
    if (
      protagonistRef.current &&
      !protagonistRef.current.contains(event.target)
    ) {
      setIsProtagonistOpen(false);
    }
    if (subGenreRef.current && !subGenreRef.current.contains(event.target)) {
      setIsSubGenreOpen(false);
    }
    if (
      setinPeriodRef.current &&
      !setinPeriodRef.current.contains(event.target)
    ) {
      setSetinPeriodOpen(false);
    }
    if (languageRef.current && !languageRef.current.contains(event.target)) {
      setIsLanguageOpen(false);
    }
    if (spProjectRef.current && !spProjectRef.current.contains(event.target)) {
      setIsProjectOpen(false);
    }
  };

  const handleSelectClick = (event) => {
    event.stopPropagation(); // Prevent the event from propagating to the document
    setIsNatureProjectOpen((prev) => !prev);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formValid =
    natureOfProject &&
    generaItem &&
    subGeneraItem &&
    periodSetIn &&
    geographyItem &&
    protagonist &&
    protaAge &&
    protagonistName &&
    ((["TV series", "Web series"].includes(natureOfProject) && noOfEpi) ||
      (!["TV series", "Web series"].includes(natureOfProject) && duration));

  const handleSelectChange = (e) => {
    setPeriodSetIn(e.target.value);
  };

  const toggleDropdown = () => {
    setSetinPeriodOpen(!isSetinPeriodOpen);
  };

  return (
    <div className="">
      <p className=" md:hidden text-center my-[8px] text-[14px] mx-auto font-[500] text-[#252525]">
        Preview your Imagination
      </p>
      <div className="bg-[#FAFAFA] flex justify-between items-center p-1 cursor-pointer mx-[24px] mb-[5px] sm:mb-[10px] rounded-[8px] px-3 border border-[#eaeaea] md:border-none">
        <div className="flex items-center gap-3 h-[25px] sm:h-auto">
          {/* browsing */}
          <button
            data-te-toggle="tooltip"
            title="Add background image"
            onClick={() => document.getElementById("file-input").click()}
          >
            <img
              src={bgIcon}
              className="w-[22px] sm:w-[28px] h-[22px] sm:h-[28px]"
              alt=""
            />
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
              <img
                src={fillIcon}
                className="w-[20px] sm:w-[25px] h-[20px] sm:h-[25px] mt-[2px]"
                alt=""
              />
            </button>
          </div>
        </div>
        <p className="hidden md:block text-[14px] text-center mx-auto font-[500] text-[#252525]">
          Preview your Imagination
        </p>
        {/* editor content */}
        <div className="flex gap-3 items-center relative">
          <div data-te-toggle="tooltip" title="Bold">
            <FaBold
              onClick={toggleBold}
              className={
                bold ? "text-[#33B0CA]  text-[15.6px]" : " text-[15.6px]"
              }
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
                hexColor
                  ? "text-[#33B0CA]  text-[18.6px]"
                  : "text-black text-[18.6px]"
              }
            />
          </div>
          {color && (
            <div className="absolute bg-[#2525258c]  h-24 w-24 top-7 left-4 grid grid-cols-4 gap-[2px] z-10 p-[6px] rounded-[4px]">
              <div
                onClick={() => {
                  setHexColor("text-[#FF0303]");
                  setColor(false);
                }}
                className="bg-[#FF0303] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#009FBD]");
                  setColor(false);
                }}
                className="bg-[#009FBD] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#FFBF00]");
                  setColor(false);
                }}
                className="bg-[#FFBF00] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#1C7947]");
                  setColor(false);
                }}
                className="bg-[#1C7947] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#8236CB]");
                  setColor(false);
                }}
                className="bg-[#8236CB] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#FF6701]");
                  setColor(false);
                }}
                className="bg-[#FF6701] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#0D0CB5]");
                  setColor(false);
                }}
                className="bg-[#0D0CB5] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#84142D]");
                  setColor(false);
                }}
                className="bg-[#84142D] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#6FEDD6]");
                  setColor(false);
                }}
                className="bg-[#6FEDD6] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#ffffff]");
                  setColor(false);
                }}
                className="bg-[#ffffff] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#F30CD4]");
                  setColor(false);
                }}
                className="bg-[#F30CD4] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#3B0944]");
                  setColor(false);
                }}
                className="bg-[#3B0944] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#020205]");
                  setColor(false);
                }}
                className="bg-[#020205] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#E84545]");
                  setColor(false);
                }}
                className="bg-[#E84545]  rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#00FFCC]");
                  setColor(false);
                }}
                className="bg-[#00FFCC] rounded-full"
              />
              <div
                onClick={() => {
                  setHexColor("text-[#FD89DD]");
                  setColor(false);
                }}
                className="bg-[#FD89DD] rounded-full"
              />
            </div>
          )}
        </div>
      </div>
      {/* center */}
      <div
        className="bg-[#FAFAFA] h-[120px] flex justify-center items-center relative mx-[28px] rounded-[8px]"
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
            : {
                backgroundColor: randomColor,
                boxShadow: `0 0 12px rgba(0, 0, 0, 0.08)`,
              }
        }
      >
        {/* edited text */}
        <div
          style={{ boxShadow: `0 0 12px rgba(0, 0, 0, 0.08)` }}
          // className="absolute shadow-md inset-0 text-[14px] backdrop-filter backdrop-blur-sm flex p-5 rounded-[8px]">
          className="absolute inset-0  backdrop-blur-sm  text-[14px] rounded-[8px] overflow-hidden break-words px-[20px] py-[12px]"
        >
          <p
            className={`${bold ? "font-bold" : ""} ${italic ? "italic" : ""} ${
              underline ? "underline" : ""
            } ${hexColor}`}
          >
            {newText}
          </p>
        </div>
      </div>
      <div
        className={`relative ${
          createNewProject || selectedSpProjectID ? "h-[420px]" : "h-[180px]"
        } `}
      >
        <div className="w-[90%] md:w-[600px]  mx-auto">
          <p className=" md:w-[90%] lg:w-full  md:ml-[8px] text-[12px] md:text-[14px] text-[#616161] leading-[17px] md:leading-[24px] overflow-hidden break-words">
            That's an interesting idea ! 
            Let's work together to develop an exciting Screenplay 
            in this situation. To begin with, 
            {/* To begin with, Please select your preferences - */}
          </p>
          {!createNewProject && !selectedSpProjectID ? (
            <div className="col-span-12">
              <div className="flex gap-[12px] items-center">
                <div
                  ref={spProjectRef}
                  className={`h-[31px] relative w-[156px] md:w-[206px] bg-[#fafafa] ${
                    selectedSpProjectID
                      ? "border-[#33B0CA]"
                      : "border-[#EAEAEA]"
                  } rounded-[4px] border-[2px]`}
                >
                  <select
                    className="block appearance-none bg-[#fafafa]  h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                    onClick={() => {
                      setIsProjectOpen(!isProjectOpen);
                    }}
                    value={selectedSpProjectID}
                    onChange={(e) => setSelectedSpProjectID(e.target.value)}
                    // required={!createNewProject}  // Conditionally set the required attribute
                    // disabled={createNewProject}
                  >
                    <option value="" disabled>
                      Select A Project
                    </option>
                    {ProjectsObj?.projects.map((option) => (
                      <option key={option.pro_uuid} value={option.pro_uuid}>
                        {option?.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                    {isProjectOpen ? (
                      <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    ) : (
                      <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    )}
                  </div>
                </div>
                {!createNewProject && (
                  <>
                    <p className="text-[14px] font-[400] text-[#616161]">Or</p>

                    <div
                      onClick={() => {
                        setCreateNewProject(true);
                        setSelectedSpProjectID("");
                      }}
                      className="text-[14px] font-[400] text-[#33B0CA] cursor-pointer"
                    >
                      Create New Project
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="col-span-12">
                <div className="flex gap-[12px] items-center">
                  <div
                    ref={spProjectRef}
                    className={`h-[31px] relative w-[156px] md:w-[206px] bg-[#fafafa] ${
                      selectedSpProjectID
                        ? "border-[#33B0CA]"
                        : "border-[#EAEAEA]"
                    } rounded-[4px] border-[2px]`}
                  >
                    <select
                      className="block appearance-none bg-[#fafafa]  h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                      onClick={() => {
                        setIsProjectOpen(!isProjectOpen);
                      }}
                      value={selectedSpProjectID}
                      onChange={(e) => setSelectedSpProjectID(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select A Project
                      </option>
                      {ProjectsObj?.projects.map((option) => (
                        <option key={option.pro_uuid} value={option.pro_uuid}>
                          {option?.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                      {isProjectOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      )}
                    </div>
                  </div>
                  {!createNewProject && (
                    <>
                      <p className="text-[14px] font-[400] text-[#616161]">
                        Or
                      </p>

                      <div
                        onClick={() => {
                          setCreateNewProject(true);
                          setSelectedSpProjectID("");
                        }}
                        className="text-[14px] font-[400] text-[#33B0CA] cursor-pointer"
                      >
                        Create New Project
                      </div>
                    </>
                  )}
                </div>
              </div>
              {createNewProject && (
                <h2 className="col-span-12 text-[#252525] text-[14px] leading-[16px] md:text-[16px] md:leading-[24px] font-[500] mb-[6px] mt-[3px] md:mt-0">
                  Create a project structure :
                </h2>
              )}
              <h4 className="hidden md:block col-span-12 text-[#252525] text-[14px] font-[500] leading-[14px] mb-[3px] mt-[3px]">
                Basic Details
              </h4>
            </>
          )}
        </div>

        <form onSubmit={submitPremise}>
          {/* select section */}
          <div className="flex flex-col md:w-[600px]  mx-auto sm:gap-[12px] mt-[8px]">
            {!createNewProject && !selectedSpProjectID ? (
              <div className="col-span-12">
                {/* <div className="flex gap-[12px] items-center">
                  <div
                    ref={spProjectRef}
                    className={`h-[31px] relative w-[156px] md:w-[206px] bg-[#fafafa] ${
                      selectedSpProjectID
                        ? "border-[#33B0CA]"
                        : "border-[#EAEAEA]"
                    } rounded-[4px] border-[2px]`}
                  >
                    <select
                      className="block appearance-none bg-[#fafafa]  h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                      onClick={() => {
                        setIsProjectOpen(!isProjectOpen);
                      }}
                      value={selectedSpProjectID}
                      onChange={(e) => setSelectedSpProjectID(e.target.value)}
                      // required={!createNewProject}  // Conditionally set the required attribute
                      disabled={createNewProject}
                    >
                      <option value="" disabled>
                        Select A Project
                      </option>
                      {ProjectsObj?.projects.map((option) => (
                        <option key={option.pro_uuid} value={option.pro_uuid}>
                          {option?.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                      {isProjectOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      )}
                    </div>
                  </div>
                  {!createNewProject && (
                    <>
                      <p className="text-[14px] font-[400] text-[#616161]">
                        Or
                      </p>

                      <div
                        onClick={() => {
                          setCreateNewProject(true);
                          setSelectedSpProjectID("");
                        }}
                        className="text-[14px] font-[400] text-[#33B0CA] cursor-pointer"
                      >
                        Create New Project
                      </div>
                    </>
                  )}
                </div> */}
              </div>
            ) : (
              <div className="text-[12px] grid grid-cols-12 gap-x-[6px] md:gap-x-[12px] gap-y-[4px] md:gap-y-[8px] px-[16px] md:px-0 lg:px-0 mt-[8px] md:mt-[-5px]">
                {/* <div className="col-span-12">
                  <div className="flex gap-[12px] items-center">
                    <div
                      ref={spProjectRef}
                      className={`h-[31px] relative w-[156px] md:w-[206px] bg-[#fafafa] ${
                        selectedSpProjectID
                          ? "border-[#33B0CA]"
                          : "border-[#EAEAEA]"
                      } rounded-[4px] border-[2px]`}
                    >
                      <select
                        className="block appearance-none bg-[#fafafa]  h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                        onClick={() => {
                          setIsProjectOpen(!isProjectOpen);
                        }}
                        value={selectedSpProjectID}
                        onChange={(e) => setSelectedSpProjectID(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select A Project
                        </option>
                        {ProjectsObj?.projects.map((option) => (
                          <option key={option.pro_uuid} value={option.pro_uuid}>
                            {option?.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                        {isProjectOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                        )}
                      </div>
                    </div>
                    {!createNewProject && (
                      <>
                        <p className="text-[14px] font-[400] text-[#616161]">
                          Or
                        </p>

                        <div
                          onClick={() => {
                            setCreateNewProject(true);
                            setSelectedSpProjectID("");
                          }}
                          className="text-[14px] font-[400] text-[#33B0CA] cursor-pointer"
                        >
                          Create New Project
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {createNewProject && (
                  <h2 className="col-span-12 text-[#252525] text-[14px] leading-[16px] md:text-[16px] md:leading-[20px] font-[500] mb-[-6px] mt-[3px] md:mt-0">
                    Create a project structure :
                  </h2>
                )}
                <h4 className="col-span-12 text-[#252525] text-[14px] font-[500] leading-[14px] mb-[-3px] mt-[3px]">
                  Basic Details
                </h4> */}
                {createNewProject && (
                  <div className="flex h-[31px] col-span-5 md:col-span-4">
                    <input
                      type="text"
                      id="spProjectName"
                      className={`h-[30px] relative  text-[12px] md:!text-[14px] leading-tight px-[8px] w-full md:w-[181px] bg-[#fafafa] rounded-[4px] border-[2px] ${
                        spProjectName ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } focus:outline-none`}
                      placeholder="Project Name"
                      required
                      // value={authorName}
                      onChange={(e) => setSpProjectName(e.target.value)}
                    />
                  </div>
                )}
                <div className="col-span-7 md:col-span-4">
                  <div
                    ref={languageRef}
                    className={`h-[31px] relative  bg-[#fafafa] rounded-[4px] border-[2px] ${
                      language ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                    } `}
                  >
                    <select
                      className={`block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]   w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                      value={language}
                      onChange={(e) => setlanguage(e.target.value)}
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      required
                    >
                      <option value="" disabled>
                        Language
                      </option>
                      {Object.entries(sortedLanguages)?.map(([key, name]) => (
                        <option key={key} value={key}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                      {isLanguageOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex h-[31px] col-span-5 md:col-span-4">
                  <input
                    type="text"
                    id="authorName"
                    className={`h-[30px] relative  text-[12px] md:!text-[14px] leading-tight px-[8px] w-full md:w-[181px] bg-[#fafafa] rounded-[4px] border-[2px] ${
                      authorName ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                    } focus:outline-none`}
                    placeholder="Author Name"
                    required
                    value={authorName}
                    onChange={(e) => {
                      const value = e.target.value;
                      const regex = /^[a-zA-Z\s]*$/; 
                      if (regex.test(value)) {
                        setAuthorName(value);
                      }
                    }}
                  />
                </div>
                <div
                  className={` col-span-7 ${
                    createNewProject
                      ? "md:col-span-3  md:w-[146px] md:ml-[-12px]"
                      : "md:col-span-4"
                  } `}
                >
                  <div
                    ref={natureProjectRef}
                    className={`h-[31px] relative  bg-[#fafafa] rounded-[4px] border-[2px] ${
                      natureOfProject ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                    } `}
                  >
                    <select
                      className={`block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]   w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                      value={natureOfProject}
                      onChange={handleNatureOfProjectChange}
                      onClick={handleSelectClick}
                      required
                    >
                      <option value="" disabled>
                        Nature of project
                      </option>
                      {Object.keys(options).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                      {isNatureProjectOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px] " />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px] " />
                      )}
                    </div>
                  </div>
                </div>
                {/* <div
                            className={` ${
                             ["TV series", "Web series"].includes(natureOfProject)
                      ? "col-span-7"
                    : "col-span-7 md:col-span-4 "
                }`}
              > */}
                {/* {["TV series", "Web series"].includes(natureOfProject) && (
                <div className="flex h-[31px] col-span-7">
                  <label
                    htmlFor="numOfEpisodes"
                    className="block text-[12px] md:!text-[14px] text-[#616161] mb-1 mr-3"
                  >
                    No of episodes
                  </label>
                  <input
                    type="number"
                    id="numOfEpisodes"
                    className={`h-[30px] relative  text-[12px] md:!text-[14px] leading-tight px-[8px] w-[102px] md:w-[196px] bg-[#fafafa] rounded-[4px] border-[2px] ${
                      noOfEpi ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                    } focus:outline-none`}
                    placeholder="No of episodes"
                    required
                    onChange={(e) => setNoOfEpi(e.target.value)}
                  />
                </div>
              )}

              {[
                "Animated film",
                "Documentary",
                "Feature film",
                "Short film",
              ].includes(natureOfProject) && (
                <div
                  className={`h-[31px] relative  bg-[#fafafa] rounded-[4px] border-[2px] col-span-5 md:col-span-4  ${
                    duration ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                  } `}
                >
                  <select
                    ref={durationRef}
                    className="block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                    onClick={() => setIsdurationOpen(!isdurationOpen)}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  >
                    <option className="" selected disabled>
                      Duration
                    </option>

                    {durationOptions.map((option, index) => (
                      <option key={option.value} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                    {isdurationOpen ? (
                      <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    ) : (
                      <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    )}
                  </div>
                </div>
              )} */}
                {/* </div> */}
                <div
                  className={`h-[31px] relative  bg-[#fafafa] rounded-[4px] border-[2px] col-span-4 ${
                    createNewProject
                      ? "  md:col-span-3 w-[107px] md:w-[140px] ml-[-6px] "
                      : " md:col-span-4"
                  }  ${duration ? "border-[#33B0CA]" : "border-[#EAEAEA]"} `}
                >
                  <select
                    ref={durationRef}
                    className="block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                    onClick={() => setIsdurationOpen(!isdurationOpen)}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  >
                    <option className="" selected disabled>
                      Duration
                    </option>

                    {durationOptions.map((option, index) => (
                      <option key={option.value} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                    {isdurationOpen ? (
                      <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    ) : (
                      <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    )}
                  </div>
                </div>
                <div
                  className={`h-[31px] relative col-span-4 ${
                    createNewProject
                      ? " md:col-span-3 w-[103px] md:w-[136px] ml-[-7px]"
                      : " md:col-span-4 "
                  } bg-[#fafafa] rounded-[4px] border-[2px] ${
                    generaItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                  } `}
                >
                  <select
                    ref={genreRef}
                    className="block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                    onClick={() => setIsgenreOpen(!isgenreOpen)}
                    value={generaItem}
                    onChange={(e) => setGeneraItem(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Genre
                    </option>

                    {genera.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                    {isgenreOpen ? (
                      <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    ) : (
                      <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    )}
                  </div>
                </div>
                <div
                  className={`h-[31px] relative col-span-4 ${
                    createNewProject
                      ? "md:col-span-3 w-[126px] md:w-[164px] ml-[-13px] "
                      : " md:col-span-4"
                  }  bg-[#fafafa] rounded-[4px] border-[2px] ${
                    subGeneraItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                  }`}
                >
                  <select
                    className="block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                    value={subGeneraItem}
                    onChange={(e) => setSubGeneraItem(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Sub-Genre
                    </option>

                    {subGeneraOptions.map((subGenre) => (
                      <option
                        className="text-[12px] md:!text-[14px]"
                        key={subGenre}
                        value={subGenre}
                      >
                        {subGenre}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                    {isSubGenreOpen ? (
                      <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    ) : (
                      <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    )}
                  </div>
                </div>
                <div className="col-span-6 md:col-span-6 mt-[-6px]">
                  <label className="text-[12px] md:!text-[14px] font-[500]">
                    Geography
                  </label>
                  <input
                    className={`block bg-[#fafafa] h-[30px] rounded-[4px] border-[2px] ${
                      geographyItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                    } w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                    placeholder="Country/Region/City"
                    type="text"
                    value={geographyItem}
                    onChange={handleGeographyChange}
                    required
                    maxLength={100}
                  />
                </div>
                <div
                  className={`h-[31px] mt-[21px] relative col-span-6 md:col-span-3 ${
                    periodSetIn ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                  } rounded-[4px] border-[2px]`}
                >
                  <select
                    ref={setinPeriodRef}
                    className={`block appearance-none bg-[#fafafa] h-[27px] rounded-[4px] w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                    onClick={() => setSetinPeriodOpen(!isSetinPeriodOpen)}
                    onChange={(e) => setPeriodSetIn(e.target.value)}
                    value={periodSetIn}
                    required
                  >
                    <option className="" selected disabled>
                      Period set in
                    </option>

                    <option className="text-[12px] md:!text-[14px]">
                      Ancient
                    </option>
                    <option className="text-[12px] md:!text-[14px]">
                      Modern
                    </option>
                    <option className="text-[12px] md:!text-[14px]">
                      Contemporary
                    </option>
                    <option className="text-[12px] md:!text-[14px]">
                      Last Century
                    </option>
                    <option className="text-[12px] md:!text-[14px]">
                      Medieval
                    </option>
                    <option className="text-[12px] md:!text-[14px]">
                      Prehistortic
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                    {isSetinPeriodOpen ? (
                      <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    ) : (
                      <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    )}
                  </div>
                </div>
                <div
                  className={`col-span-6 md:col-span-5 gap-[12px] mt-[-6px]`}
                >
                  <p className="text-[12px] md:!text-[14px] font-[500]">
                    Who Is Your Protagonist
                  </p>
                  <input
                    className={`block bg-[#fafafa] w-full h-[30px] rounded-[4px] border-[2px] ${
                      protagonistName ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                    }  px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                    placeholder="Name"
                    type="text"
                    value={protagonistName}
                    onChange={handleProtagonistNameChange}
                    required
                    maxLength={100}
                  />
                </div>{" "}
                <div
                  className={`h-[31px] mt-[21px] relative col-span-6 md:col-span-4  bg-[#fafafa] ${
                    protagonist ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                  } rounded-[4px] border-[2px]`}
                >
                  <select
                    ref={protagonistRef}
                    className="block appearance-none bg-[#fafafa]  h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                    onClick={() => setIsProtagonistOpen(!isProtagonistOpen)}
                    value={protagonist}
                    onChange={(e) => setProtagonist(e.target.value)}
                    required
                  >
                    <option className="" selected disabled>
                      Gender
                    </option>
                    <option className="text-[12px] md:!text-[14px]">
                      Male
                    </option>
                    <option className="text-[12px] md:!text-[14px]">
                      Female
                    </option>
                    <option className="text-[12px] md:!text-[14px]">
                      Animal
                    </option>
                    <option className="text-[12px] md:!text-[14px]">
                      Inanimate Object
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-[-3px] flex items-center px-[4px] pointer-events-none">
                    {isProtagonistOpen ? (
                      <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    ) : (
                      <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                    )}
                  </div>
                </div>
                <div className="col-span-12 mb-[12px] md:mt-[21px] md:mb-[0px] md:col-span-3">
                  {" "}
                  <div className="flex h-[31px] gap-[12px] md:w-[185px]">
                    <label className="text-[12px] md:!text-[14px] font-[500]">
                      Age
                    </label>
                    <input
                      type="number"
                      id="protaAge"
                      value={protaAge}
                      min="0" // This prevents negative values
                      className={`h-[30px] col-span-4 relative text-[12px] md:!text-[14px] leading-tight px-[8px] w-[57px]  bg-[#fafafa] rounded-[4px] border-[2px] ${
                        protaAge ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } focus:outline-none`}
                      placeholder="23"
                      required
                      onChange={(e) => setProtaAge(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* button part */}
          <div className="lg:bg-[#FAFAFA] absolute right-3 md:right-0 bottom-0  md:flex gap-5 justify-end py-1 text-center  md:mx-[28px] mt-[12px] md:mb-[10px]">
            <button
              disabled={isLoading}
              className={`${
                isLoading
                  ? "bg-[#616161] rounded-[8px] h-[32px] px-[12px] text-[14px] font-[600] text-white hover:bg hidden"
                  : "bg-[#FAFAFA] border h-[32px] !border-[#33B0CA] text-[#33B0CA] rounded-[8px]  px-[12px] text-[14px] font-[600]"
              } mr-[12px] md:ml-0`}
              onClick={() => handleGoBack()}
            >
              Cancel
            </button>
            {isLoading ? (
              <button
                disabled={isLoading}
               
                className={`bg-[#33B0CA] text-white rounded-[8px] h-[32px] px-[10px] text-[14px] font-[600] defaultCursor-premisePool`}
              >
                Posting...
              </button>
            ) : (
              <button
                // onClick={submitPremise}
                disabled={!formValid}
                type="submit"
                className={` text-white rounded-[8px] h-[32px] px-[28px] text-[14px] font-[600] ${
                  !formValid ? "bg-[#616161] " : "bg-[#33B0CA]"
                }`}
              >
                Post
              </button>
            )}
          </div>
        </form>
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
