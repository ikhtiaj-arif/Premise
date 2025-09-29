import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import {
  FaBold,
  FaItalic,
  FaKeyboard,
  FaRegTrashAlt,
  FaUnderline,
} from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdKeyboardBackspace } from "react-icons/md";
import { PiTextAUnderlineBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../../App";
import {
  usePostPremiseWithCharactersMutation,
  useSaveCharactersMutation,
} from "../../../app/EndPoints/Characters/Characters";
import {
  useDeletePremiseMutation,
  useEditPremiseMutation,
  useGetFilteredLangQuery,
  useGetPremiseUserQuery,
  usePostPremiseMutation,
} from "../../../app/EndPoints/premisePoolApi";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetStoryToScriptProjectQuery,
  useUpdateSpProjectMutation,
} from "../../../app/EndPoints/ScriptPad/project";
import { setUser } from "../../../app/Slices/userSlice";
import "../../../Components/Premisepool/Premise.css";
import fillIcon from "../../../img/Icons/fillicon.png";
import bgIcon from "../../../img/Icons/setBgIcn.png";
import SameNamePop from "../../PremiseV2/Popups/alerts/SameNamePop";
import OnSaveCharacterPop from "../../PremiseV2/sequalPopup/OnSaveCharacterPop";
import PreviewPremiseTutorialPop from "../../PremiseV2/sequalPopup/PreviewPremiseTutorialPop";
import ProposedCharDemoPop from "../../PremiseV2/sequalPopup/ProposedCharDemoPop";
import PreviewNextDemoPop from "../../PremiseV2/sequalPopup/singlePop/PreviewNextDemoPop";
import TypingLoader from "../../TypingLoader";
import { baseURL } from "../../utils";
import CharacterEditablePop from "../Character/CharacterEditablePop";
import { sortedLanguages } from "../Languages";
import LanguageSelector from "../LanguageSelector";
import Popup from "../Popup";
import { hideUnhidePremise } from "../PreiseUtils";
import PremisePreviewKeyboard from "./PremisePreviewKeyboard";

const PremisePreview2 = ({
  newText,
  data,
  setAddPopup,
  setOpenPop,
  openPop,
  handleGoBack,
  refetch,
  finalEdit,
  setFinalEdit,
  isLoading,
  setIsLoading,
  premiseLanguage,
}) => {
  const baseLanguage = sessionStorage.getItem("multilingualDropDownValue");
  const options1 = {
    "Short film": [
      // { text: "About 2 Minutes", value: "Upto 2 Minutes" },
      { text: "About 5 Minutes", value: "2 to 4 Minutes" },
      { text: "About 15 Minutes", value: "5 to 14 Minutes" },
      { text: "About 25 Minutes", value: "15 to 29 Minutes" },
      { text: "About 30 Minutes", value: "30 Minutes" },
    ],
    "Feature film": [
      { text: "About 1 Hour", value: "1 Hour" },
      { text: "About 2 Hours", value: "2 Hours" },
      { text: "About 3 Hours", value: "3 Hours" },
    ],
  };

  const NProjectOpt = [
    {
      value: "Short film",
      hi: "शॉर्ट फिल्म",
    },
    {
      value: "Feature film",
      hi: "फीचर फिल्म",
    },
  ];

  const options = {
    "Short film": [
      // { text: "About 2 Minutes", value: "Upto 2 Minutes", hi: "लगभग 2 मिनट" },
      { text: "About 5 Minutes", value: "2 to 4 Minutes", hi: "लगभग 5 मिनट" },
      {
        text: "About 15 Minutes",
        value: "5 to 14 Minutes",
        hi: "लगभग 15 मिनट",
      },
      {
        text: "About 25 Minutes",
        value: "15 to 29 Minutes",
        hi: "लगभग 25 मिनट",
      },
      { text: "About 30 Minutes", value: "30 Minutes", hi: "लगभग 30 मिनट" },
    ],
    "Feature film": [
      { text: "About 1 Hour", value: "1 Hour", hi: "लगभग 1 घंटा" },
      { text: "About 2 Hours", value: "2 Hours", hi: "लगभग 2 घंटे" },
      { text: "About 3 Hours", value: "3 Hours", hi: "लगभग 3 घंटे" },
    ],
  };

  const genera = [
    "Thriller",
    "Horror",
    "Drama",
    "Action",
    "Mystery",
    "Documentary",
    "Romantic",
    "Adventure",
    "Superhero",
    "Comedy",
    "Crime",
    "Fantasy",
    "Science_fiction",
    "Other",
  ];

  const subGenraItems = {
    Thriller: [
      "Action Thriller",
      "Crime Thriller",
      "Legal thriller",
      "Mystery Thriller",
      "Romantic Thriller",
      "Science fiction Thriller",
      "Political Thriller",
      "Spy Thriller",
      "Psychological Thriller",
      "Conspiracy Thriller",
    ],
    Horror: [
      "B-Movie",
      "Found footage",
      "Monster",
      "Paranormal film",
      "Slasher",
      "Vampire",
      "Zombie",
      "Folk Horror",
      "Psychological Horror",
      "Horror Comedy",
    ],
    Drama: [
      "Biopic",
      "Coming of age drama",
      "Costume drama",
      "Crime drama",
      "Romantic drama",
      "Tragedy",
      "War movie",
      "Legal Drama",
      "Family Drama",
      "Teen Drama",
    ],
    Action: [
      "Superhero",
      "Martial arts",
      "Action Comedy",
      "Military/War Action",
      "Spy",
      "Heist Action",
      "Supernatural Action",
    ],
    Mystery: [
      "Superhero",
      "Martial arts",
      "Action Comedy",
      "Cozy Mystery",
      "Noir",
      "Psychological Mystery",
      "Detective Procedural",
      "Paranormal Mystery",
    ],
    Documentary: [
      "True Crime",
      "Biographical",
      "Social Issue",
      "Nature",
      "Tech/Startup",
    ],
    Romantic: [
      "Romantic Comedy",
      "Chick flick",
      "Historical romance",
      "Gothic romance",
      "Period Romance",
      "Teen Romance",
      "Love Triangle",
    ],

    Adventure: [
      "Survival Adventure",
      "Historical Adventure",
      "Fantasy Adventure",
      "Expedition/Quest",
      "Swashbuckling",
    ],

    Superhero: [
      "Classic Superhero",
      "Anti-Hero",
      "Teen Superhero",
      "Superhero Comedy",
      "Dark/Realistic ",
    ],
    Comedy: [
      "Black Comedy",
      "Buddy Comedy",
      "Comedic Thriller",
      "Farce",
      "Mockumentary",
      "Musical Comedy",
      "Parody",
      "Slapstick",
      "Sports Comedy",
      "Romantic Comedy",
      "Workplace Comedy",
    ],
    Crime: [
      "Film noir",
      "Neo-noir",
      "Mafia",
      "Military Thriller",
      "Psychological Thriller",
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

    Science_fiction: [
      "Cyberpunk",
      "Disaster",
      "Dystopian",
      "Fairy tale",
      "Fantasy",
      "Space opera",
      "Time travel",
    ],

    Other: ["", ""],
  };

  // console.log("data", data);
  const {
    isAddNew,
    setIsAddNew,
    selectedSpProjectID,
    setSelectedSpProjectID,
    createdSpProjectID,
    setCreatedSpProjectID,
    allspProjectJSON,
    
    filteredAllProjects,
    setSelectedPremiseSpProjectId,
    // ProjectsObj,
    projectRefetch,
    allProjects,
    currentUser,
    selectedSpProjectLanguage,
    setSelectedSpProjectLanguage,
  } = useContext(MyContext);

  const {
    data: userQuery,
    isUserLoading,
    refetch: userRefetch,
  } = useGetPremiseUserQuery();

  // const {
  //   data: characterData,
  //   isCharLoading,
  //   refetch: charRefetch,
  // } = useGetCharactersQuery();

  const {
    data: lang,
    isLangLoading,
    refetch: langRefetch,
  } = useGetFilteredLangQuery();

  const [previewPremise, isPremiseLoading, status, isError] =
    usePostPremiseMutation();
  const [isOldProject, setIsOldProject] = useState(false);
  const [previewEdit] = useEditPremiseMutation();
  const [deletePremise] = useDeletePremiseMutation();
  const [createProject, resInfo] = useCreateProjectMutation();
  const [updateProject, updateResInfo] = useUpdateSpProjectMutation();
  const [postPremiseWithCharacters, updatePostPremiseResInfo] =
    usePostPremiseWithCharactersMutation();
  const [deleteProject, resDeleteProject] = useDeleteProjectMutation();
  // const user = useSelector((state) => state?.user?.id);
  // const userFirstName = useSelector((state) => state?.user?.firstName);
  // const userLastName = useSelector((state) => state?.user?.lastName);
  // console.log("object", userQuery);
  const user = userQuery?.id;
  const userFirstName = userQuery?.first_name;
  const userLastName = userQuery?.last_name;

  // console.log("createdSpProjectID", user);
  const [selectedLanguage, setSelectedLanguage] = useState(premiseLanguage);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [imgUrl, setImageUrl] = useState(data?.bg_img);
  const [randomColor, setRandomColor] = useState(data?.bg_color || "#FAFAFA");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [color, setColor] = useState(false);
  const [hexColor, setHexColor] = useState(data?.stylings?.hexColor);
  // const [isLoading, setIsLoading] = useState(false);
  const [createNewProject, setCreateNewProject] = useState(false);
  const [premiseID, setPremiseId] = useState("");
  const [postedPremiseData, setPostedPremiseData] = useState(null);
  const [spID, setspID] = useState("");
  const [spDeleteID, setSpDeleteID] = useState();

  const [isLiked, setIsLiked] = useState(false);
  // const [finalEdit, setFinalEdit] = useState(false);
  const [characterEditPop, setCharacterEditPop] = useState(false);
  const [currentProjectData, setCurrentProjectData] = useState({});
  // console.log("currentProjectData", currentProjectData);
  // const [generaItem, setGeneraItem] = useState(false);

  const [premiseData, setPremiseData] = useState(null);
  // const [mValue, setMValue] = useState(0);

  const [natureOfProject, setNatureOfProject] = useState("");
  const [openPreviewDemoPop, setOpenPreviewDemoPop] = useState(false);

  const handleCreateNewProject = () => {
    const newProjectDemoP = localStorage.getItem("newProjectDemoPop");
    if (
      (!newProjectDemoP || newProjectDemoP === "false") &&
      !openPreviewDemoPop
    ) {
      setOpenPreviewDemoPop(true);
    }
    setCreateNewProject(true);
    setSelectedSpProjectID("");
  };

  const loadingData = [
    "Initializing...",
    "Analyzing Premise...",
    "Analyzing other Inputs...",
    "Brainstorming...",
    "Creating Story-Arc...",
    "Defining Characters...",
    "Drawing Character Sketches...",
    "Establishing Relationships among Characters...",
    "Incorporating Geography...",
    "Customizing Period...",
    "Customizing for Genre and Sub-Genre...",
    "Defining Narrative Structure...",
    "Brainstorming...",
    "Generating Pointed Queries...",
  ];

  const [durationOptions, setDurationOptions] = useState([]);
  const [focusedFieldName, setFocusedFieldName] = useState("");
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
  const [generaItemTxt, setGeneraItemTxt] = useState("");
  const [subGeneraItem, setSubGeneraItem] = useState("");
  const [subGeneraItemTxt, setSubGeneraItemTxt] = useState("");
  const [duration, setDuration] = useState("");
  // console.log("duration", duration);
  const [periodSetIn, setPeriodSetIn] = useState("");
  const [protagonist, setProtagonist] = useState(null);
  const [protagonistName, setProtagonistName] = useState("");
  const [geographyItem, setGeographyItem] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [selectedSpProject, setSelectedSpProject] = useState();
  const [agreeToPost, setAgreeToPost] = useState(false);

  const [activeInput, setActiveInput] = useState(""); // Track the active input field
  const inputRefs = useRef({}); // Store references to all input fields

  const projectNameRef = useRef();
  const authorNameRef = useRef();
  const locationNameRef = useRef();
  const protagonistNameRef = useRef();

  const token = localStorage.getItem("accessToken");

  const header = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const [spProjectName, setSpProjectName] = useState("");
  const { data: storyToScriptData } = useGetStoryToScriptProjectQuery();
  const [matchingProject, setMatchingProject] = useState(null);
  const [characterArray, setCharacterArray] = useState([]);
  // const [characters, setCharacters] = useState(characterArray);

  const [language, setLanguage] = useState("");
  const handleNatureOfProjectChange = (e) => {
    const selectedProject = e.target.value;
    setNatureOfProject(selectedProject);
    setDurationOptions(options[selectedProject] || []);
    setDuration("");
  };

  const filteredSpProjectsUnsorted = allProjects?.filter(
    (item) => !item.locked && item.premise_id === ""
  );
  //  console.log(filteredSpProjectsUnsorted);
  const filteredSpProjects = filteredSpProjectsUnsorted?.sort((a, b) => {
    return new Date(b.updated_on) - new Date(a.updated_on);
  });
  const languageOptions = Object.entries(sortedLanguages).map(
    ([key, name]) => ({
      value: key,
      label: name,
    })
  );

  useEffect(() => {
    const languageKey =
      languageOptions.find((option) => option.label === premiseLanguage) ||
      null;
    console.log("languageKey", languageKey);
    setSelectedSpProjectLanguage(languageKey.value);
    setLanguage(languageKey.value);
  }, [premiseLanguage]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault(); // Some browsers require this to be set
      event.returnValue = ""; // Required for showing the default confirmation dialog
    };

    // Add the event listener when the component mounts
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (selectedSpProjectID === "") {
      setMatchingProject(null);
      setLanguage("");
      setAuthorName("");
      setNatureOfProject("");
      setDuration("");
      setGeneraItem("");
      setGeneraItemTxt("");
      setSubGeneraItem("");
      setSubGeneraItemTxt("");
      setGeographyItem("");
      setPeriodSetIn("");
      setProtagonistName("");
      setProtagonist(null);
      setProtaAge("");
      setDurationOptions([]);
    } else {
      setCreateNewProject(false);

      const matchingProject = allProjects?.find(
        (project) => project?.pro_uuid === selectedSpProjectID
      );

      if (matchingProject) {
        // console.log("matchingProject", matchingProject);
        setMatchingProject(matchingProject);
        setLanguage(matchingProject?.language);
        setAuthorName(matchingProject?.ownername);
        setNatureOfProject(matchingProject?.nature_project);

        setDurationOptions(options[matchingProject?.nature_project]);

        setDuration(matchingProject?.duration);
        setGeneraItem(matchingProject?.genre);
        setGeneraItemTxt(matchingProject?.genre);
        setSubGeneraItem(matchingProject?.sub_genre);
        setSubGeneraItemTxt(matchingProject?.sub_genre);
        setGeographyItem(matchingProject?.geography);
        setPeriodSetIn(matchingProject?.period || "");
        setProtagonistName(matchingProject?.protagonist_name);
        setProtagonist(matchingProject?.protagonist_type);
        setProtaAge(matchingProject?.protagonist_age);
        setSelectedSpProject(matchingProject?.name);
      }
    }
  }, [selectedSpProjectID, allProjects]);

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

  // keyboard clicked
  const onClickKeyboard = () => {
    if (selectedLanguage === "") {
      setSelectedLanguage("English");
    }
    setKeyboardVisible(!keyboardVisible);
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
    const extension = originalFileName?.split(".").pop();
    const renamedFile = new File([file], newName + "." + extension, {
      type: file.type,
    });
    // console.log("renamedFile", renamedFile);
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
      "#" + Math?.floor(Math.random() * 16777215)?.toString(16);
    setRandomColor(randomHexColor);
  };

  const [openDotMenu, setOpenDotMenu] = useState(null);
  const [hideDisable, setHideDisable] = useState(false);
  const [sameNamePop, setSameNamePop] = useState(false);
  const [toDltPremiseWhenErrorID, setToDltPremiseWhenErrorID] = useState("");
  // console.log("toDltPremiseWhenErrorID", toDltPremiseWhenErrorID);

  const handleHideUnhidePremise = async (id) => {
    hideUnhidePremise(id, setHideDisable, userRefetch, setOpenDotMenu);
  };
  const [userMail, setUserMail] = useState(null);
  const [ownerMail, setOwnerMail] = useState(false);
  const handleUserMail = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_MessageOwner`);
    console.log("message rs", res);
    if (res?.access === "No") {
      setUserMail(res);
    } else {
      setUserMail("Yes");
    }
  };

  const handleProtagonistNameChange = (e, setValue) => {
    let value = e.target.value;
    // Remove leading spaces, but allow spaces after the first character
    if (value.length === 1 && value[0] === " ") {
      setValue(""); // Prevent setting a single space as input
      return;
    }

    // Handle the case when input is cleared
    if (value.length === 0) {
      setValue(""); // Set an empty value if the input is empty
      return;
    }
    // Remove non-alphanumeric characters for the first character only
    const firstChar = value[0].replace(/[^a-zA-Z0-9]/, ""); // Clean the first character
    const restOfValue = value.slice(1); // Keep the rest of the value as-is

    setValue(firstChar + restOfValue); // Combine the cleaned first character with the rest of the input
  };

  const handleGeographyChange = (e) => {
    const value = e.target.value;

    if (value.length === 1 && value[0] === " ") {
      setGeographyItem(""); // Prevent setting a single space as input
      return;
    }

    // Handle the case when input is cleared
    if (value.length === 0) {
      setGeographyItem(""); // Set an empty value if the input is empty
      return;
    }
    // Remove non-alphanumeric characters for the first character only
    const firstChar = value[0].replace(/[^a-zA-Z0-9]/, ""); // Clean the first character
    const restOfValue = value.slice(1); // Keep the rest of the value as-is
    // setGeographyItem(firstChar + restOfValue);
    setGeographyItem(e.target.value);
  };

  const handleAuthorChange = (e) => {
    const value = e.target.value;

    if (value.length === 1 && value[0] === " ") {
      setAuthorName(""); // Prevent setting a single space as input
      return;
    }

    // Handle the case when input is cleared
    if (value.length === 0) {
      setAuthorName(""); // Set an empty value if the input is empty
      return;
    }
    // Remove non-alphanumeric characters for the first character only
    const firstChar = value[0].replace(/[^a-zA-Z0-9]/, ""); // Clean the first character
    const restOfValue = value.slice(1); // Keep the rest of the value as-is
    setAuthorName(firstChar + restOfValue);
  };
  const handleProjectChange = (e) => {
    const value = e.target.value;

    if (value.length === 1 && value[0] === " ") {
      setSpProjectName(""); // Prevent setting a single space as input
      return;
    }

    // Handle the case when input is cleared
    if (value.length === 0) {
      setSpProjectName(""); // Set an empty value if the input is empty
      return;
    }
    // Remove non-alphanumeric characters for the first character only
    const firstChar = value[0].replace(/[^a-zA-Z0-9]/, ""); // Clean the first character
    const restOfValue = value.slice(1); // Keep the rest of the value as-is
    setSpProjectName(firstChar + restOfValue);
  };

  useEffect(() => {
    console.log("protagonist", protagonist);
  }, [protagonist]);
  // console.log("Header", characterArray);

  const [openPreviewNextDemoPop, setOpenPreviewNextDemoPop] = useState(false);

  const submitPremise = async (e) => {
    e.preventDefault();
    const languageKey =
      languageOptions.find((option) => option.label === premiseLanguage) ||
      null;

    //demo popup
    const newProjectNextDemoPop = localStorage.getItem("newProjectNextDemoPop");
    if (
      (!newProjectNextDemoPop || newProjectNextDemoPop === "false") &&
      !openPreviewNextDemoPop
    ) {
      setOpenPreviewNextDemoPop(true);
    }
    // Disable submit button to prevent multiple clicks
    setIsLoading(true);
    setKeyboardVisible(false);

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
      formData.append("created_from", "premisePool");
      formData.append("source_language", languageKey.value);
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
      if (generaItem === "Other") {
        formData.append("genre", "Drama");
        formData.append("sub_genre", subGeneraItemTxt);
      } else if (
        generaItem === "Superhero" ||
        generaItem === "Adventure" ||
        generaItem === "Mystery" ||
        generaItem === "Documentary"
      ) {
        formData.append("genre", "Drama");
        formData.append("sub_genre", subGeneraItem);
      } else {
        formData.append("sub_genre", subGeneraItem);
        formData.append("genre", generaItem);
      }
      formData.append("period", periodSetIn);
      formData.append("geography", geographyItem);
      formData.append("protagonist_type", protagonist);
      formData.append("protagonist_name", protagonistName);

      if (protagonist === "Inanimate Object") {
        setProtaAge(0);
      }
      formData.append("protagonist_age", protaAge);

      const previewData = {
        // id: data?.id,
        body: formData,
      };
      // Determine whether to call edit or add API based on data.id existence
      // const res = data?.id
      //   ? await previewEdit(previewData)
      //   : await previewPremise(formData);
      let generaValue;
      let subGeneraValue;
      if (generaItem === "Other") {
        generaValue = "Drama";
        subGeneraValue = subGeneraItemTxt;
      } else if (
        generaItem === "Superhero" ||
        generaItem === "Adventure" ||
        generaItem === "Mystery" ||
        generaItem === "Documentary"
      ) {
        generaValue = "Drama";
        subGeneraValue = subGeneraItem;
      } else {
        generaValue = generaItem;
        subGeneraValue = subGeneraItem;
      }

      const data = {
        name: spProjectName,
        language: languageKey.value,
        ownername: authorName,
        nature_project: natureOfProject,
        duration: duration,
        genre: generaValue,
        sub_genre: subGeneraValue,
        geography: geographyItem,
        period: periodSetIn,
        protagonist_type: protagonist,
        protagonist_name: protagonistName,
        protagonist_age: protaAge,
        service_name: "premisePool",
        // current_status: "is_draft"
      };

      if (createNewProject) {
        // const trimmedName = spProjectName.trim();
        // const nameExists = allspProjectJSON?.projects?.some(
        //   (item) => item.name === trimmedName
        // );

        const trimmedName = spProjectName.trim().toLowerCase();
        const nameExists = allspProjectJSON?.projects?.some(
          (item) => item.name.toLowerCase() === trimmedName
        );

        const nameSTExists = storyToScriptData?.some(
          (item) => item?.project_name?.toLowerCase() === trimmedName
        );

        if (nameExists || nameSTExists) {
          setIsLoading(false);
          setSameNamePop(true);
          return;
          // return alert(
          //   "A project with the same name already exists. Please choose a different name."
          // );
        }

        const response = await createProject(data);
        // const response = await console.log(data);

        if (response) {
          // refetch();
          setCurrentProjectData(response?.data?.projects);
          setCreatedSpProjectID(response?.data?.projects?.pro_uuid);
          setspID(response?.data?.projects?.pro_uuid);
          formData.append("project_id", response?.data?.projects?.pro_uuid);
          formData.append("PremiseLimitCheck", "NO");
          projectRefetch();

          const deleteId = response?.data?.projects?.pro_uuid;
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
              // project_id
            } = res?.data;
            setSelectedPremiseSpProjectId(response?.data?.projects?.pro_uuid);
            setPremiseId(res?.data?.id);
            setPostedPremiseData(res?.data);
            // setMValue(res?.data?.m_value)

            const deletePreID = res?.data?.id;

            const created_by = userQuery;
            // {
            // id: user,
            // first_name: userFirstName,
            // last_name: userLastName,
            // username: user,
            // };

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
              stylings: JSON.parse(text?.split("+")[0]),
              bg_color,
              bg_img,
              comments,
              created_at,
              created_by,
              likes,
              id,
              source_language,
              updated_at,
              dText: text?.split("+")[1],
              formattedDate,
              formattedTime,
              user,
              handleHideUnhidePremise,
              setHideDisable,
              hideDisable,
              openDotMenu,
              project_id: response?.data?.projects?.pro_uuid,
              m_value: res?.data?.m_value,
              hidden: res?.data?.hidden,
              index: 0,
              premiseOwner: userQuery,
              handleUserMail,
              setOwnerMail,
            };

            // Update state with new premise data
            setPremiseData(data);
            userRefetch();
            setIsAddNew(true);

            axios
              .get(`${baseURL}/ideamall/get_characters/${data?.id}`, {
                headers: header,
              })
              .then((response) => {
                if (response) {
                  const charData = response?.data?.data;

                  const updateData = {
                    id: deleteId,
                    name: spProjectName,
                    premise_id: res?.data?.id,
                  };

                  updateProject(updateData);
                  setFinalEdit(true);
                  setCharacterArray(charData);
                  setIsLoading(false);
                  setIsOldProject(true);
                }
              })
              .catch((error) => {
                setIsLoading(false);
                deleteProject({ project: deleteId });
                deletePremiseWhenFailed(deletePreID);
                projectRefetch()
                toast.error("Failed to create Premise", {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 1600,
                });
                // setAddPopup(null);
              });
          } else {
            // Handle API errors
            setIsLoading(false);
          const dltRes = await  deleteProject({ project: deleteId });
         if(dltRes){
             projectRefetch()
            toast.error(
              res?.error?.data?.message || "Failed to create Premise!",
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1600,
              }
            );
         }
                // projectRefetch()
            // setAddPopup(null);
          }
        }
      } else {
        data.id = selectedSpProjectID;
        data.name = selectedSpProject;

        if (matchingProject?.current_status === "without_premise") {
          data.current_status = null;
        }
        // return
        const response = await updateProject(data);
        setCurrentProjectData(data);
        if (response) {
          formData.append("project_id", selectedSpProjectID);
          formData.append("PremiseLimitCheck", "NO");
          setspID(selectedSpProjectID);
          projectRefetch();

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
              // project_id,
            } = res?.data;

            setSelectedPremiseSpProjectId(response?.data?.projects?.pro_uuid);
            setPremiseId(res?.data?.id);
            setPostedPremiseData(res?.data);
            const deletePreID = res?.data?.id;
            // setMValue(res?.data?.m_value)

            const created_by = userQuery;
            //  {
            //   id: user,
            //   first_name: userFirstName,
            //   last_name: userLastName,
            //   username: user,
            // };

            const formattedDate = new Date(created_at)?.toLocaleDateString(
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
              stylings: JSON.parse(text?.split("+")[0]),
              bg_color,
              bg_img,
              comments,
              created_at,
              created_by,
              likes,
              id,
              source_language,
              updated_at,
              dText: text?.split("+")[1],
              formattedDate,
              formattedTime,
              user,
              handleHideUnhidePremise,
              setHideDisable,
              hideDisable,
              openDotMenu,
              project_id: selectedSpProjectID,
              m_value: res?.data?.m_value,
              hidden: res?.data?.hidden,
              index: 0,
              premiseOwner: userQuery,
              handleUserMail,
              setOwnerMail,
            };

            // Update state with new premise data
            setPremiseData(data);
            // userRefetch();
            setIsAddNew(true);
            // langRefetch();

            axios
              .get(`${baseURL}/ideamall/get_characters/${data?.id}`, {
                headers: header,
              })
              .then((response) => {
                if (response) {
                  const charData = response?.data?.data;

                  const updateData = {
                    id: selectedSpProjectID,
                    name: selectedSpProject,
                    premise_id: res?.data?.id,
                  };
                  updateProject(updateData);
                  setFinalEdit(true);
                  setCharacterArray(charData);
                  setIsLoading(false);
                  setIsOldProject(true);
                }

                // Optionally set openPop here if needed
                // setOpenPop(true);
              })
              .catch((error) => {
                setIsLoading(false);
                deletePremiseWhenFailed(deletePreID);
                toast.error("Failed to create Premise", {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 1600,
                });
              });
          } else {
            // Handle API errors
            setIsLoading(false);
            toast.error(
              res?.error?.data?.message || "Failed to create Premise!",
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 800,
              }
            );
          }
        }
      }
    } catch (error) {
      setIsLoading(false);

      // console.error("Error submitting premise:", error);
      toast.error("Failed to create Premise!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
    }
  };

  useEffect(() => {
    if (updateResInfo.isSuccess) {
      projectRefetch();
    }
  }, [updateResInfo]);

  const deletePremiseWhenFailed = async (id) => {
    const response = await deletePremise(id);
    if (response) {
      setAddPopup(null);
    }
  };

  useEffect(() => {
    // console.log("openPop", premiseData);
  }, [premiseData]);

  // remove bg img
  const handleImgFileDelete = () => {
    setImageUrl(null);
    setFile(null);
    userRefetch();
  };

  const [isMobile, setIsMobile] = useState(false);

  // detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // <= 1024 → mobile/tab
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  // Watch for changes in protagonist and update protaAge if necessary
  useEffect(() => {
    if (protagonist === "Inanimate Object") {
      setProtaAge(0); // Set protaAge to empty string when protagonist is "Inanimate Object"
    }
  }, [protagonist]);

  const formValid =
  (spProjectName || selectedSpProjectID) &&
    natureOfProject &&
    generaItem &&
    (subGeneraItem || subGeneraItemTxt) &&
    periodSetIn &&
    authorName &&
    geographyItem &&
    protagonist &&
    protagonistName &&
    // If protagonist is not "Inanimate Object", ensure protaAge is set
    ((protagonist !== "Inanimate Object" && protaAge) ||
      protagonist === "Inanimate Object") &&
    ((["TV series", "Web series"].includes(natureOfProject) && noOfEpi) ||
      (!["TV series", "Web series"].includes(natureOfProject) && duration));

  const handleSelectChange = (e) => {
    setPeriodSetIn(e.target.value);
  };

  const toggleDropdown = () => {
    setSetinPeriodOpen(!isSetinPeriodOpen);
  };

  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();
  const [charSaveDisable, setCharSaveDisable] = useState(false);

  const [finalSubmitLoading, setFinalSubmitLoading] = useState(false);
  const [characterLoading, setCharacterLoading] = useState(false);

  const [openOnSaveCharactersDemoPop, setOpenOnSaveCharactersDemoPop] =
    useState(false);

  const handleUpdateSavedChar = async () => {
    const newProposedCharDemoPop = localStorage.getItem(
      "onSavedCharacterDemoPop"
    );
    if (
      (!newProposedCharDemoPop || newProposedCharDemoPop === "false") &&
      !openOnSaveCharactersDemoPop
    ) {
      setOpenOnSaveCharactersDemoPop(true);
    }

    setCharacterLoading(true);
    try {
      characterArray.forEach((character) => {
        if (character.is_ai_generated === undefined) {
          character.is_ai_generated = false;
        }
      });
      const charArr = JSON.stringify(characterArray);
      const data = {
        // premise_id: premiseID,

        id: spID,
        body: { char_data: charArr, is_draft: false, premise_id: premiseID },
      };

      const response = await saveCharacter(data);

      if (response) {
        // setAddNewCharacter(false)
        // setEditPopupOpen(false)
        setCharacterEditPop(false);
        setCharSaveDisable(true);
        setCharacterLoading(false);

        // toast.success("characters updated!")
      }
      return response;
    } catch (error) {
      setCharacterLoading(false);
      // console.error("Error updating characters:", error);
    }
  };
  const handleSaveAsDraft = async () => {
    setCharacterLoading(true);
    try {
      characterArray.forEach((character) => {
        if (character.is_ai_generated === undefined) {
          character.is_ai_generated = false;
        }
      });
      const charArr = JSON.stringify(characterArray);
      const data = {
        premise_id: premiseID,
        id: spID,
        body: { char_data: charArr, is_draft: true, premise_id: premiseID },
        is_draft: true,
      };

      const response = await saveCharacter(data);

      if (response) {
        // setAddNewCharacter(false)
        // setEditPopupOpen(false)
        // setOpenCharacterChart(false);
        // setCharSaveDisable(true);
        setCharacterLoading(false);
        setAddPopup(null);
        refetch();
        // toast.success("characters updated!")
      }
      return response;
    } catch (error) {
      setCharacterLoading(false);
      // console.error("Error updating characters:", error);
    }
  };

  const [finalPostPremiseDemoPop, setFinalPostPremiseDemoPop] = useState(false);
  const [afterFinalPostPremiseDemoPop, setAfterFinalPostPremiseDemoPop] =
    useState(false);
  const handlePremisePostToGetComments = async () => {
    setFinalSubmitLoading(true);
    try {
      // Only call handleUpdateSavedChar if charSaveDisable is true
      let charactersSaved = true; // Default to true if charSaveDisable is false

      if (!charSaveDisable) {
        charactersSaved = await handleUpdateSavedChar(characterArray);
      }

      // If characters are successfully saved or charSaveDisable is true, continue with the next steps
      if (charactersSaved) {
        const data = {
          id: premiseID,
        };

        try {
          const response = await postPremiseWithCharacters(data);
          if (response.error) {
            await deletePremiseWhenFailed(premiseID);
            setSelectedSpProjectID("");
            return;
          }
          if (response) {
            // console.log(response);
            const finalPostDemoPop = localStorage.getItem("finalPostDemoPop");
            if (
              (!finalPostDemoPop || finalPostDemoPop === "false") &&
              !finalPostPremiseDemoPop
            ) {
              setFinalPostPremiseDemoPop(true);
            }
            setOpenPop(true);
            setFinalSubmitLoading(false);
            setSelectedSpProjectID("");
            const afterFinalPopDemo = localStorage.getItem(
              "afterFinalPostPremise"
            );
            if (
              (!afterFinalPopDemo || afterFinalPopDemo === "false") &&
              !finalPostPremiseDemoPop
            ) {
              setAfterFinalPostPremiseDemoPop(true);
            }

            // refetch();
          } else {
            throw new Error("Failed to post premise with characters");
          }
        } catch (error) {
          // console.error("An error occurred:", error);
          setFinalSubmitLoading(false);
          // Handle any additional error cases here
        }
      } else {
        throw new Error("Failed to save characters, stopping premise post.");
      }
    } catch (error) {
      setFinalSubmitLoading(false);
      deletePremiseWhenFailed(premiseID);
      // console.error("Error in handlePremisePostToGetComments:", error);
    }
  };

  const [actOneThreshold, setActOneThreshold] = useState();
  const [actTwoEnd, setActTwoEnd] = useState();

  const mValue = premiseData?.m_value || 0; // default to 0 if m_value is undefined

  // Calculate the percentage points
  useEffect(() => {
    setActOneThreshold(Math.round(0.15 * mValue) + 4);

    setActTwoEnd(Math.round(0.85 * mValue));
  }, [premiseData, mValue]);

  // const projectOptions = filteredSpProjects?.map((project) => ({
  //   value: project.pro_uuid,
  //   label: project.name,
  // }));
  const projectOptions = filteredSpProjects
    ?.filter(
      (currentProject) =>
        currentProject?.view_only !== "Viewer" ||
        currentProject?.view_only !== "Editor"
    )
    ?.map((project) => ({
      value: project.pro_uuid,
      label: project.name,
    }));

  const customTheme = (theme) => ({
    ...theme,
    spacing: {
      ...theme.spacing,
      controlHeight: 30, // Adjust this value as needed
    },
  });

  //!

  const [openProposedCharDemoPop, setOpenProposedCharDemoPop] = useState(false);
  const handleEditProposedCharacters = () => {
    const newProposedCharDemoPop = localStorage.getItem("proposedCharDemoPop");
    if (
      (!newProposedCharDemoPop || newProposedCharDemoPop === "false") &&
      !openProposedCharDemoPop
    ) {
      setOpenProposedCharDemoPop(true);
    }

    setCharacterEditPop(true);
  };

  const [openUpward, setOpenUpward] = useState(false);

  // Check space and decide dropdown direction
  useEffect(() => {
    if (isProjectOpen && spProjectRef.current) {
      const rect = spProjectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < 220 && spaceAbove > spaceBelow);
    }
  }, [isProjectOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        spProjectRef.current &&
        !spProjectRef.current.contains(event.target)
      ) {
        setIsProjectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // useEffect(() => {
  //   if (isProjectOpen && spProjectRef.current) {
  //     const rect = spProjectRef.current.getBoundingClientRect();
  //     const dropdownHeight = 170; // px
  //     const spaceBelow = window.innerHeight - rect.bottom;
  //     const openUpward = spaceBelow < dropdownHeight;

  //     setDropdownPos({
  //       left: rect.left,
  //       top: openUpward ? rect.top - dropdownHeight - 6 : rect.bottom + 2,
  //     });
  //   }
  // }, [isProjectOpen]);



useEffect(() => {
  if (isProjectOpen && spProjectRef.current && dropdownRef.current) {
    const rect = spProjectRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    const dropdownHeight = dropdownRect.height; // actual height
    const spaceBelow = window.innerHeight - rect.bottom;

    const openUpward = spaceBelow < dropdownHeight;

    setDropdownPos({
      left: rect.left,
      top: openUpward ? rect.top - dropdownHeight - 6 : rect.bottom + 2,
    });
  }
}, [isProjectOpen, filteredSpProjects.length]);



  if (isLoading) {
    return (
      <div className="h-auto">
        {/* <Loading /> */}
        <div className="xl:mt-[-8px]">
          <TypingLoader data={loadingData} />
        </div>
        {/* {createNewProject ? (
          <div className="text-[16px] font-[400] w-full md:w-[78%] px-[20px] md:px-auto md:mx-auto text-center h-[80px] mt-[-30px] ">
            Hold Tight! We are Crafting something Awesome for you!
          </div>
        ) : (
          <div className="text-[16px] font-[400] w-full md:w-[60%] mx-auto text-center h-[80px] mt-[-30px]">
            Sit Back and Relax! We are making magic happen!
          </div>
        )} */}
      </div>
    );
  } else {
    return (
      <div className="">
        {charSaveDisable && (
          <FaArrowLeft
            className=" text-[20px] cursor-pointer mx-6"
            onClick={() => {
              setFinalSubmitLoading(false);
              setCharacterEditPop(true);
            }}
          />
        )}

        {!finalEdit ? (
          <div className="bg-[#FAFAFA] flex justify-between items-center p-1 cursor-pointer  mx-[18px] md:mx-[24px] mb-[5px] sm:mb-[10px]  rounded-[8px]   px-3 border border-[#eaeaea] md:border-none">
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
        ) : (
          <div>
            {!charSaveDisable && (
              <MdKeyboardBackspace
                alt=""
                className={`text-[#252525] absolute top-8 left-0  ml-[20px] text-left text-[32px] cursor-pointer mdHidden  "mt-3"
                                }`}
                onClick={handleEditProposedCharacters}
              />
            )}{" "}
            {/* <p className="hidden md:block text-[17px] text-center mx-auto font-[500] text-[#252525] ">
              Preview your Imagination
            </p> */}
          </div>
        )}
        {/* center */}
        <div
          className={`bg-[#FAFAFA] mt-2 ${
            charSaveDisable || finalEdit ? "h-[184px]" : "h-[120px]"
          } flex justify-center items-center relative mx-[18px] md:mx-[28px] rounded-[8px] `}
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
            className="absolute inset-0  backdrop-blur-sm  text-[14px]  rounded-[8px] overflow-hidden break-words px-[20px] py-[12px]"
          >
            <p
              className={`notranslate ${bold ? "font-bold" : ""} ${
                italic ? "italic" : ""
              } ${underline ? "underline" : ""} ${hexColor}`}
            >
              {newText}
            </p>
          </div>
        </div>
        <div
          // className={`relative ${
          //   charSaveDisable
          //     ? `h-[150px] ${
          //         finalSubmitLoading ? "md:h-[65px]" : "md:h-[125px]"
          //       }  overflow-y-hidden`
          //     : finalEdit
          //     ? "h-[125px]"
          //     : createNewProject || selectedSpProjectID
          //     ? "h-[373px]"
          //     : "h-[180px]"
          // }`}
          className={`relative ${
            finalSubmitLoading
              ? "md:h-[72px]"
              : charSaveDisable
              ? "h-[80px] overflow-y-hidden"
              : finalEdit
              ? "h-[146px]"
              : createNewProject || selectedSpProjectID
              ? "h-[373px]"
              : "h-[180px]"
          }`}
        >
          <div
            className={`${
              finalEdit ? "hidden" : "w-[90%] md:w-[600px]  mx-auto"
            } `}
          >
            <p className=" ThatsAnInterestingIdea-m md:w-[90%] lg:w-full mt-[10px]  mb-[5px] md:mt-[8px] md:ml-[8px] text-[12px] md:text-[14px] text-[#616161] leading-[17px] md:leading-[24px] overflow-hidden break-words">
              That's an interesting idea! 
              Let's work together to develop an exciting Screenplay 
              in this situation. To begin with, 
              {/* To begin with, Please select your preferences - */}
            </p>
            {!createNewProject && !selectedSpProjectID ? (
              <div className="col-span-12">
                <div className="flex gap-[12px] items-center mt-2 lg:mt-[32px]">
                  {filteredSpProjects?.length !== 0 && (
                    <>
                      {isMobile ? (
                        <select
                          ref={spProjectRef}
                          value={selectedSpProjectID || ""}
                          onChange={(e) =>
                            setSelectedSpProjectID(e.target.value)
                          }
                          className="h-[31px] w-[144px] focus:outline-none  md:w-[206px] border-2 rounded-[4px] px-[8px] text-[12px] md:text-[14px] bg-[#fafafa]"
                        >
                          <option value="" disabled>
                            Select A Project
                          </option>
                          {filteredSpProjects.map((p) => (
                            <option key={p.pro_uuid} value={p.pro_uuid}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div
                          ref={spProjectRef}
                          className={`h-[31px] overflow-visible relative w-[144px] md:w-[206px] bg-[#fafafa] ${
                            selectedSpProjectID
                              ? "border-[#33B0CA]"
                              : "border-[#EAEAEA]"
                          } rounded-[4px] border-[2px] cursor-pointer`}
                          onClick={() => setIsProjectOpen((prev) => !prev)}
                        >
                          <div className="h-[27px] px-[8px] text-[12px] md:!text-[14px] flex items-center justify-between">
                            {filteredSpProjects.find(
                              (p) => p.pro_uuid === selectedSpProjectID
                            )?.name || (
                              <span className="text-gray-400">
                                Select A Project
                              </span>
                            )}
                            <div className="flex items-center">
                              {isProjectOpen ? (
                                <IoIosArrowUp className="text-[14px] md:text-[18px]" />
                              ) : (
                                <IoIosArrowDown className="text-[14px] md:text-[18px]" />
                              )}
                            </div>
                          </div>

                          {/* Dropdown List */}
                          {isProjectOpen && (
                            <div
                             ref={dropdownRef}
                              className={`fixed z-[99] bg-white border border-[#EAEAEA] rounded-[4px] shadow-md max-h-[200px] overflow-y-auto w-[144px] md:w-[206px]`}
                              style={{
                                top: dropdownPos.top,
                                left: dropdownPos.left,
                              }}
                            >
                              {filteredSpProjects.length === 0 ? (
                                <div className="px-4 text-sm text-gray-400">
                                  No Projects Found
                                </div>
                              ) : (
                                filteredSpProjects.map((option) => (
                                  <div
                                    title={option.name}
                                    key={option.pro_uuid}
                                    onMouseDown={() => {
                                      setIsProjectOpen(false);
                                      setSelectedSpProjectID(option.pro_uuid);
                                    }}
                                    className={`px-4 py-[2px] text-[12px] md:text-[14px] hover:bg-[#33b0ca] hover:text-white ${
                                      selectedSpProjectID === option.pro_uuid
                                        ? "bg-[#e6f7fa]"
                                        : ""
                                    }`}
                                  >
                                    {option.name.slice(0, 15)}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {!createNewProject && (
                    <>
                      {filteredSpProjects.length !== 0 && (
                        <p className="text-[14px] font-[400] text-[#616161]">
                          Or
                        </p>
                      )}

                      <div
                        onClick={handleCreateNewProject}
                        className={`${
                          filteredSpProjects.length === 0 && "ml-[15px] "
                        } text-[14px] font-[400] text-[#33B0CA] cursor-pointer`}
                      >
                        Create New Project
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="col-span-12 flex justify-between">
                  <div className="flex gap-[12px] items-center ">
                    {filteredSpProjects.length !== 0 && (
                      <>
                        {isMobile ? (
                          <select
                            ref={spProjectRef}
                            value={selectedSpProjectID || ""}
                            onChange={(e) =>
                              setSelectedSpProjectID(e.target.value)
                            }
                            className="h-[31px] w-[144px] focus:outline-none md:w-[206px] border-2 rounded-[4px] px-[8px] text-[12px] md:text-[14px] bg-[#fafafa]"
                          >
                            <option value="" disabled>
                              Select A Project
                            </option>
                            {filteredSpProjects.map((p) => (
                              <option key={p.pro_uuid} value={p.pro_uuid}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div
                            ref={spProjectRef}
                            className={`h-[31px] overflow-visible relative w-[144px] md:w-[206px] bg-[#fafafa] ${
                              selectedSpProjectID
                                ? "border-[#33B0CA]"
                                : "border-[#EAEAEA]"
                            } rounded-[4px] border-[2px] cursor-pointer`}
                            onClick={() => {
                              setIsProjectOpen((prev) => !prev);
                            }}
                          >
                            <div className="h-[27px] px-[8px] text-[12px] md:!text-[14px] flex items-center justify-between">
                              {filteredSpProjects
                                .find((p) => p.pro_uuid === selectedSpProjectID)
                                ?.name.slice(0, 25) || (
                                <span className="text-gray-400">
                                  Select A Project
                                </span>
                              )}
                              <div className="flex items-center">
                                {isProjectOpen ? (
                                  <IoIosArrowUp className="text-[14px] md:text-[18px]" />
                                ) : (
                                  <IoIosArrowDown className="text-[14px] md:text-[18px]" />
                                )}
                              </div>
                            </div>

                            {/* Dropdown List */}
                            {isProjectOpen && (
                              <div
                                className={`fixed z-[9999] bg-white border border-[#EAEAEA] rounded-[4px] shadow-md max-h-[200px] overflow-y-auto w-[144px] md:w-[206px]`}
                                style={{
                                  top: dropdownPos.top,
                                  left: dropdownPos.left,
                                }}
                              >
                                {filteredSpProjects.length === 0 ? (
                                  <div className="px-4 text-sm text-gray-400">
                                    No Projects Found
                                  </div>
                                ) : (
                                  filteredSpProjects.map((option) => (
                                    <div
                                      title={option.name}
                                      key={option.pro_uuid}
                                      onMouseDown={() => {
                                        setSelectedSpProjectID(option.pro_uuid);
                                        setIsProjectOpen(false);
                                      }}
                                      className={`px-4 py-[2px] text-[12px] md:text-[14px] hover:bg-[#33b0ca] hover:text-white ${
                                        selectedSpProjectID === option.pro_uuid
                                          ? "bg-[#e6f7fa]"
                                          : ""
                                      }`}
                                    >
                                      {option.name.slice(0, 15)}
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
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
                  <div className="bg-[#FAFAFA] h-[38px] md:h-[32px] xl:h-[38px] border border-[#EAEAEA] shadow-sm rounded-[8px] px-[8px] hidden lg:flex items-center mx-[28px] ">
                    <div className="flex items-center justify-end gap-3  w-full ">
                      <FaKeyboard
                        data-te-toggle="tooltip"
                        title={`${
                          !keyboardVisible ? "View Keyboard" : "Hide Keyboard"
                        }`}
                        className={`w-7 h-7 ${
                          keyboardVisible && "text-[#33B0CA]"
                        } cursor-pointer hover:text-[#33B0CA]`}
                        onClick={onClickKeyboard}
                      />
                      <LanguageSelector
                        premiseLanguage={premiseLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                        selectedLanguage={selectedLanguage}
                        setKeyboardVisible={setKeyboardVisible}
                      />
                    </div>
                  </div>
                </div>
                {createNewProject && (
                  <h2 className="CreateAProjectStructure-m col-span-12 text-[#252525] text-[14px] leading-[16px] md:text-[16px] md:leading-[24px] font-[500] mb-[6px] mt-[3px] md:mt-0">
                    Create a project structure :
                  </h2>
                )}
                <h4 className="hidden md:block col-span-12 text-[#252525] text-[14px] font-[500] leading-[14px] mb-[3px] mt-[3px]">
                  Basic Details
                </h4>
              </>
            )}
          </div>

          {!finalSubmitLoading && (
            <div
              className={`${
                finalEdit
                  ? "w-[90%] md:w-[600px]  mx-auto mt-[10px] md:mt-[4px] "
                  : "hidden"
              } `}
            >
              {!charSaveDisable && (
                <p className="  md:w-[90%] lg:w-[98%] mt-[4px] ml-[10px] md:ml-[8px] text-[12px] md:text-[14px] text-[#616161] leading-[20px] overflow-hidden break-words ">
                  {/* {handleMValues()} */}
                  {/* {handleCharacterText(characterArray)} */}
                  <span className="mnff-m">MNF</span> proposes to develop a{" "}
                  <span className="screenplay-m">screenplay</span> flow by
                  interacting with you through {mValue} comments and discussions
                  thereon. The discussions from comment number {1} to{" "}
                  {actOneThreshold} will be centered around{" "}
                  <span className="font-[500] text-[#252525]">set up</span>,{" "}
                  {actOneThreshold + 1} to {actTwoEnd} around{" "}
                  <span className="font-[500] text-[#252525]">conflict</span>{" "}
                  and {actTwoEnd + 1} to {mValue} around{" "}
                  <span className="font-[500] text-[#252525]">resolution</span>.
                </p>
              )}
            </div>
          )}

          <form onSubmit={submitPremise}>
            {/* select section */}
            <div
              className={`${
                finalEdit
                  ? "hidden"
                  : " flex flex-col md:w-[600px]  mx-auto sm:gap-[12px] mt-[8px]"
              } `}
            >
              {!createNewProject && !selectedSpProjectID ? (
                <div className="col-span-12"></div>
              ) : (
                <div className="text-[12px] grid grid-cols-12 gap-x-[6px] md:gap-x-[12px] gap-y-[4px]  px-[16px] md:px-0 lg:px-0 mt-[8px] md:mt-[-5px]">
                  {createNewProject && (
                    <div className="flex h-[31px] col-span-12 md:col-span-4">
                      <input
                        type="text"
                        ref={projectNameRef}
                        onFocus={() => setFocusedFieldName("projectName")}
                        maxLength={50}
                        // id="spProjectName"
                        className={`h-[30px] relative  text-[12px] md:!text-[14px] leading-tight px-[8px] w-full md:w-[181px] bg-[#fafafa] rounded-[4px] border-[2px] ${
                          spProjectName
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        } focus:outline-none`}
                        data-te-toggle="tooltip"
                        title={spProjectName}
                        placeholder="Project Name"
                        required
                        value={spProjectName}
                        onChange={(e) => {
                          const value = e.target.value
                            .trimStart()
                            .replace(/\s{2,}/g, " ");
                          setSpProjectName(value);
                        }}
                      />
                    </div>
                  )}
                  <div
                    className={` col-span-12 md:col-span-4 md:w-[191px] ${
                      createNewProject && "md:ml-[-5px]"
                    }`}
                  >
                    <div
                      ref={languageRef}
                      className={`h-[31px] relative bg-[#fafafa] rounded-[4px] border-[2px] border-[#33B0CA] 
                      
                      `}
                    >
                      <Select
                        isDisabled={premiseLanguage}
                        // options={languageOptions}
                        // value={
                        //   languageOptions.find(
                        //     (option) => option.value === language
                        //   ) || null
                        // }
                        placeholder={premiseLanguage}
                        // onChange={(selectedOption) => {
                        //   if (selectedOption) {
                        //     setLanguage(selectedOption.value);
                        //     setSelectedSpProjectLanguage(selectedOption.value);
                        //   }
                        //   setIsLanguageOpen(false);
                        // }}
                        // onMenuOpen={() => setIsLanguageOpen(true)}
                        // onMenuClose={() => setIsLanguageOpen(false)}
                        // placeholder="Language"
                        theme={customTheme}
                        menuPortalTarget={document.body} // Render menu to document.body
                        menuPosition="fixed" // Use fixed positioning
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9, // Very high z-index to ensure it's on top
                          }),
                          control: (base) => ({
                            ...base,
                            height: "27px",
                            minHeight: "27px",
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            border: "none",
                            backgroundColor: "#fafafa",
                            boxShadow: "none",
                            padding: "0",
                            margin: "0",
                            width: "100%",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: "0 6px",
                            height: "27px",
                            display: "flex",
                            alignItems: "center",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0",
                            padding: "0",
                          }),
                          indicatorsContainer: () => ({
                            display: "none", // hide default dropdown arrow
                          }),
                          menu: (base) => ({
                            ...base,
                            fontSize: "14px",
                            marginTop: "2px",
                            zIndex: 9, // Very high z-index
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          }),
                          option: (base, state) => ({
                            ...base,
                            fontSize: "14px",
                            padding: "0px 8px",
                            backgroundColor: state.isFocused
                              ? "#33b0ca"
                              : "#fafafa",
                            color: state.isFocused ? "#ffffff" : "#000000",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            height: "32px",
                            lineHeight: "20px",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            margin: "0",
                            padding: "0",
                            lineHeight: "27px",
                          }),
                        }}
                        classNamePrefix="custom-select"
                      />
                    </div>
                    {/* <div
                      ref={languageRef}
                      className={`h-[31px] relative  bg-[#fafafa] rounded-[4px] border-[2px] ${
                        language ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } `}
                    >
                      <select
                        className={`block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]   w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                        value={language}
                        onChange={(e) => {
                          setLanguage(e.target.value);
                          setSelectedSpProjectLanguage(e.target.value);
                        }}
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
                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center   pointer-events-none">
                        {isLanguageOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                        )}
                      </div>
                    </div> */}
                  </div>
                  <div className="flex h-[31px] col-span-12  md:col-span-4">
                    <input
                      type="text"
                      // id="authorName"
                      ref={authorNameRef}
                      maxLength={30}
                      data-te-toggle="tooltip"
                      title={authorName}
                      className={`h-[30px] relative text-[12px] md:!text-[14px] leading-tight px-[8px] w-full md:w-[191px] bg-[#fafafa] rounded-[4px] border-[2px] ${
                        authorName ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } focus:outline-none`}
                      placeholder="Author Name"
                      onFocus={() => setFocusedFieldName("authorName")}
                      value={authorName}
                      // onFocus={() => setActiveInput("authorName")}

                      onChange={(e) => {
                        const value = e.target.value
                          .trimStart()
                          .replace(/\s{2,}/g, " ");
                        setAuthorName(value);
                      }}
                      // required
                    />
                  </div>
                  {isMobile ? (
                    <div
                      className={`col-span-6 w-full ${
                        createNewProject
                          ? "md:col-span-3 md:w-[163px]"
                          : "md:col-span-4"
                      }`}
                    >
                      <div
                        ref={natureProjectRef}
                        className={`h-[31px] relative bg-[#fafafa] rounded-[4px] border-[2px] ${
                          natureOfProject
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        }`}
                      >
                        <select
                          value={natureOfProject || ""}
                          onChange={(e) =>
                            handleNatureOfProjectChange({
                              target: { value: e.target.value },
                            })
                          }
                          onFocus={() => setIsNatureProjectOpen(true)}
                          onBlur={() => setIsNatureProjectOpen(false)}
                          className="w-full h-[27px] text-[12px] md:text-[14px] bg-[#fafafa] border-none outline-none rounded-[4px] px-2 appearance-none cursor-pointer"
                        >
                          <option value="" disabled>
                            Nature of project
                          </option>
                          {NProjectOpt?.map((option, idx) => (
                            <option key={idx} value={option?.value}>
                              {baseLanguage === "hi"
                                ? option?.hi
                                : option?.value}
                            </option>
                          ))}
                        </select>

                        {/* Custom arrow */}
                        <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                          {isNatureProjectOpen ? (
                            <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                          ) : (
                            <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`col-span-6  w-full ${
                        createNewProject
                          ? "md:col-span-3  md:w-[163px] "
                          : "md:col-span-4"
                      } `}
                    >
                      <div
                        ref={natureProjectRef}
                        className={`h-[31px] relative bg-[#fafafa] rounded-[4px] border-[2px] ${
                          natureOfProject
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        } `}
                      >
                        <Select
                          options={NProjectOpt?.map((option) => ({
                            value: option?.value,
                            label:
                              baseLanguage === "hi"
                                ? option?.hi
                                : option?.value,
                          }))}
                          value={
                            NProjectOpt?.map((option) => ({
                              value: option?.value,
                              label:
                                baseLanguage === "hi"
                                  ? option?.hi
                                  : option?.value,
                            })).find(
                              (option) => option.value === natureOfProject
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            handleNatureOfProjectChange({
                              target: { value: selectedOption?.value || "" },
                            });
                          }}
                          onMenuOpen={() => setIsNatureProjectOpen(true)}
                          onMenuClose={() => setIsNatureProjectOpen(false)}
                          placeholder="Nature of project"
                          menuPortalTarget={document.body} // Render menu to document.body
                          menuPosition="fixed" // Use fixed positioning
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9, // Very high z-index to ensure it's on top
                            }),
                            control: (base) => ({
                              ...base,
                              height: "27px",
                              minHeight: "27px",
                              fontSize: "12px",
                              "@media (min-width: 768px)": {
                                fontSize: "14px",
                              },
                              border: "none",
                              backgroundColor: "#fafafa",
                              boxShadow: "none",
                              padding: "0",
                              margin: "0",
                              width: "100%",
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              padding: "0 6px",
                              height: "27px",
                              display: "flex",
                              alignItems: "center",
                            }),
                            input: (base) => ({
                              ...base,
                              margin: "0",
                              padding: "0",
                            }),
                            indicatorsContainer: () => ({
                              display: "none", // hide default dropdown arrow
                            }),
                            menu: (base) => ({
                              ...base,
                              fontSize: "14px",
                              marginTop: "2px",
                              zIndex: 9, // Very high z-index
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                            }),
                            option: (base, state) => ({
                              ...base,
                              fontSize: "14px",
                              padding: "0px 8px",
                              backgroundColor: state.isFocused
                                ? "#33b0ca"
                                : "#fafafa",
                              color: state.isFocused ? "#ffffff" : "#000000",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              height: "32px",
                              lineHeight: "20px",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              fontSize: "12px",
                              "@media (min-width: 768px)": {
                                fontSize: "14px",
                              },
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }),
                            singleValue: (base) => ({
                              ...base,
                              fontSize: "12px",
                              "@media (min-width: 768px)": {
                                fontSize: "14px",
                              },
                              margin: "0",
                              padding: "0",
                              lineHeight: "27px",
                            }),
                          }}
                          classNamePrefix="custom-select"
                        />

                        <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                          {isNatureProjectOpen ? (
                            <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px] " />
                          ) : (
                            <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px] " />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {isMobile ? (
                    <div
                      className={`h-[31px] relative bg-[#fafafa] rounded-[4px] border-[2px] col-span-6 w-full ${
                        createNewProject
                          ? "md:col-span-3 md:w-[136px] md:ml-[16px]"
                          : "md:col-span-4"
                      } ${duration ? "border-[#33B0CA]" : "border-[#EAEAEA]"}`}
                      ref={durationRef}
                    >
                      <select
                        value={duration || ""}
                        onChange={(e) => setDuration(e.target.value)}
                        onFocus={() => setIsdurationOpen(true)}
                        onBlur={() => setIsdurationOpen(false)}
                        className="w-full h-[27px] text-[12px] md:text-[14px] bg-[#fafafa] border-none outline-none rounded-[4px] px-2 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Duration
                        </option>
                        {durationOptions?.map((option, idx) => (
                          <option key={idx} value={option?.value}>
                            {baseLanguage === "hi" ? option?.hi : option?.text}
                          </option>
                        ))}
                      </select>

                      {/* Custom arrow */}
                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                        {isdurationOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`h-[31px] relative bg-[#fafafa] rounded-[4px] border-[2px] col-span-6  w-full ${
                        createNewProject
                          ? "md:col-span-3 md:w-[136px] md:ml-[16px]"
                          : "md:col-span-4"
                      } ${duration ? "border-[#33B0CA]" : "border-[#EAEAEA]"}`}
                      ref={durationRef}
                    >
                      <Select
                        options={durationOptions?.map((option) => ({
                          value: option?.value,
                          label:
                            baseLanguage === "hi" ? option?.hi : option?.text,
                        }))}
                        value={
                          durationOptions
                            ?.map((option) => ({
                              value: option?.value,
                              label:
                                baseLanguage === "hi"
                                  ? option?.hi
                                  : option?.text,
                            }))
                            .find((option) => option.value === duration) || null
                        }
                        onChange={(selectedOption) => {
                          setDuration(selectedOption?.value || "");
                        }}
                        onMenuOpen={() => setIsdurationOpen(true)}
                        onMenuClose={() => setIsdurationOpen(false)}
                        placeholder="Duration"
                        menuPortalTarget={document.body} // Render menu to document.body
                        menuPosition="fixed" // Use fixed positioning
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9, // Very high z-index to ensure it's on top
                          }),
                          control: (base) => ({
                            ...base,
                            height: "27px",
                            minHeight: "27px",
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            border: "none",
                            backgroundColor: "#fafafa",
                            boxShadow: "none",
                            padding: "0",
                            margin: "0",
                            width: "100%",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: "0 6px",
                            height: "27px",
                            display: "flex",
                            alignItems: "center",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0",
                            padding: "0",
                          }),
                          indicatorsContainer: () => ({
                            display: "none", // hide default dropdown arrow
                          }),
                          menu: (base) => ({
                            ...base,
                            fontSize: "14px",
                            marginTop: "2px",
                            zIndex: 9, // Very high z-index
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          }),
                          option: (base, state) => ({
                            ...base,
                            fontSize: "14px",
                            padding: "0px 2px",
                            backgroundColor: state.isFocused
                              ? "#33b0ca"
                              : "#fafafa",
                            color: state.isFocused ? "#ffffff" : "#000000",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            height: "32px",
                            lineHeight: "18px",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            margin: "0",
                            padding: "0",
                            lineHeight: "27px",
                          }),
                        }}
                        classNamePrefix="custom-select"
                      />

                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                        {isdurationOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        )}
                      </div>
                    </div>
                  )}
                  {generaItem === "Other" ? (
                    <>
                      <div
                        className={`h-[32px] relative w-full col-span-6  ${
                          createNewProject
                            ? " md:col-span-3  md:ml-[4px]"
                            : " md:col-span-4 "
                        } bg-[#fafafa] rounded-[4px] border-[2px] ${
                          generaItemTxt
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        } `}
                      >
                        <input
                          type="text"
                          value={generaItemTxt}
                          maxLength={"60"}
                          placeholder="Genre"
                          onChange={(e) => {
                            const updatedValue = e.target.value.replace(
                              /^\s+|\s+(?=\s)/g,
                              ""
                            );
                            setGeneraItemTxt(updatedValue);
                          }}
                          className="focus:outline-none h-[28px] rounded-[4px] w-full px-2 text-[12px] md:!text-[14px] leading-tight"
                        />
                      </div>

                      <div
                        className={`h-[31px] w-full  col-span-6 lg:col-span-6 ${
                          createNewProject
                            ? "md:col-span-4 lg:col-span-4 md:w-[143px] ml-[0px] lg:ml-[-3px] "
                            : " md:col-span-4"
                        }  bg-[#fafafa] rounded-[4px] border-[2px] ${
                          subGeneraItemTxt
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        }`}
                      >
                        <input
                          type="text"
                          value={subGeneraItemTxt}
                          maxLength={"60"}
                          placeholder="Sub-Genre"
                          onChange={(e) => {
                            const updatedValue = e.target.value.replace(
                              /^\s+|\s+(?=\s)/g,
                              ""
                            );
                            setSubGeneraItemTxt(updatedValue);
                          }}
                          className="focus:outline-none h-[28px] rounded-[4px] w-full px-2 text-[12px] md:!text-[14px] leading-tight"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {isMobile ? (
                        <div
                          ref={genreRef}
                          className={`h-[31px] relative w-full col-span-6 ${
                            createNewProject
                              ? "md:col-span-3 md:w-[130px] md:ml-[4px]"
                              : "md:col-span-4"
                          } bg-[#fafafa] rounded-[4px] border-[2px] ${
                            generaItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                          }`}
                        >
                          <select
                            value={generaItem || ""}
                            onChange={(e) => setGeneraItem(e.target.value)}
                            onFocus={() => setIsgenreOpen(true)}
                            onBlur={() => setIsgenreOpen(false)}
                            className="w-full h-[27px] text-[12px] md:text-[14px] bg-[#fafafa] border-none outline-none rounded-[4px] px-2 appearance-none cursor-pointer"
                          >
                            <option value="" disabled>
                              Genre
                            </option>
                            {genera?.map((option, idx) => (
                              <option key={idx} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          {/* Custom arrow */}
                          <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                            {isgenreOpen ? (
                              <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                            ) : (
                              <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          ref={genreRef}
                          className={`h-[31px] relative w-full col-span-6  ${
                            createNewProject
                              ? "md:col-span-3  md:w-[130px]  md:ml-[4px]"
                              : "md:col-span-4"
                          } bg-[#fafafa] rounded-[4px] border-[2px] ${
                            generaItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                          }`}
                        >
                          <Select
                            options={genera?.map((option) => ({
                              value: option,
                              label: option,
                            }))}
                            value={
                              genera
                                ?.map((option) => ({
                                  value: option,
                                  label: option,
                                }))
                                .find(
                                  (option) => option.value === generaItem
                                ) || null
                            }
                            onChange={(selectedOption) => {
                              setGeneraItem(selectedOption?.value || "");
                            }}
                            onMenuOpen={() => setIsgenreOpen(true)}
                            onMenuClose={() => setIsgenreOpen(false)}
                            placeholder="Genre"
                            menuPortalTarget={document.body} // Render menu to document.body
                            menuPosition="fixed" // Use fixed positioning
                            styles={{
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9, // Very high z-index to ensure it's on top
                              }),
                              control: (base) => ({
                                ...base,
                                height: "27px",
                                minHeight: "27px",
                                fontSize: "12px",
                                "@media (min-width: 768px)": {
                                  fontSize: "14px",
                                },
                                border: "none",
                                backgroundColor: "#fafafa",
                                boxShadow: "none",
                                padding: "0",
                                margin: "0",
                                width: "100%",
                              }),
                              valueContainer: (base) => ({
                                ...base,
                                padding: "0 6px",
                                height: "27px",
                                display: "flex",
                                alignItems: "center",
                              }),
                              input: (base) => ({
                                ...base,
                                margin: "0",
                                padding: "0",
                              }),
                              indicatorsContainer: () => ({
                                display: "none", // hide default dropdown arrow
                              }),
                              menu: (base) => ({
                                ...base,
                                fontSize: "14px",
                                marginTop: "2px",
                                zIndex: 9, // Very high z-index
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                              }),
                              option: (base, state) => ({
                                ...base,
                                fontSize: "14px",
                                padding: "0px 8px",
                                backgroundColor: state.isFocused
                                  ? "#33b0ca"
                                  : "#fafafa",
                                color: state.isFocused ? "#ffffff" : "#000000",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                height: "32px",
                                lineHeight: "20px",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                fontSize: "12px",
                                "@media (min-width: 768px)": {
                                  fontSize: "14px",
                                },
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }),
                              singleValue: (base) => ({
                                ...base,
                                fontSize: "12px",
                                "@media (min-width: 768px)": {
                                  fontSize: "14px",
                                },
                                margin: "0",
                                padding: "0",
                                lineHeight: "27px",
                              }),
                            }}
                            classNamePrefix="custom-select"
                          />

                          <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                            {isgenreOpen ? (
                              <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                            ) : (
                              <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                            )}
                          </div>
                        </div>
                      )}

                      {isMobile ? (
                        <div
                          className={`h-[31px] relative w-full col-span-6 ${
                            createNewProject
                              ? "md:col-span-3 md:w-[154px] md:ml-[-13px]"
                              : "md:col-span-4"
                          } bg-[#fafafa] rounded-[4px] border-[2px] ${
                            subGeneraItem
                              ? "border-[#33B0CA]"
                              : "border-[#EAEAEA]"
                          }`}
                        >
                          <select
                            value={subGeneraItem || ""}
                            onChange={(e) => setSubGeneraItem(e.target.value)}
                            onFocus={() => setIsSubGenreOpen(true)}
                            onBlur={() => setIsSubGenreOpen(false)}
                            className="w-full h-[27px] text-[12px] md:text-[14px] bg-[#fafafa] border-none outline-none rounded-[4px] px-2 appearance-none cursor-pointer"
                          >
                            <option value="" disabled>
                              Sub-Genre
                            </option>
                            {subGeneraOptions?.map((subGenre, idx) => (
                              <option key={idx} value={subGenre}>
                                {subGenre}
                              </option>
                            ))}
                          </select>

                          {/* Custom arrow */}
                          <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                            {isSubGenreOpen ? (
                              <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                            ) : (
                              <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`h-[31px] relative w-full col-span-6  ${
                            createNewProject
                              ? "md:col-span-3 md:w-[154px]  md:ml-[-13px]"
                              : "md:col-span-4"
                          } bg-[#fafafa] rounded-[4px] border-[2px] ${
                            subGeneraItem
                              ? "border-[#33B0CA]"
                              : "border-[#EAEAEA]"
                          }`}
                        >
                          <Select
                            options={subGeneraOptions?.map((subGenre) => ({
                              value: subGenre,
                              label: subGenre,
                            }))}
                            value={
                              subGeneraOptions
                                ?.map((subGenre) => ({
                                  value: subGenre,
                                  label: subGenre,
                                }))
                                .find(
                                  (option) => option.value === subGeneraItem
                                ) || null
                            }
                            onChange={(selectedOption) => {
                              setSubGeneraItem(selectedOption?.value || "");
                            }}
                            onMenuOpen={() => setIsSubGenreOpen(true)}
                            onMenuClose={() => setIsSubGenreOpen(false)}
                            placeholder="Sub-Genre"
                            menuPortalTarget={document.body} // Render menu to document.body
                            menuPosition="fixed" // Use fixed positioning
                            styles={{
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9, // Very high z-index to ensure it's on top
                              }),
                              control: (base) => ({
                                ...base,
                                height: "27px",
                                minHeight: "27px",
                                fontSize: "12px",
                                "@media (min-width: 768px)": {
                                  fontSize: "14px",
                                },
                                border: "none",
                                backgroundColor: "#fafafa",
                                boxShadow: "none",
                                padding: "0",
                                margin: "0",
                                width: "100%",
                              }),
                              valueContainer: (base) => ({
                                ...base,
                                padding: "0 6px",
                                height: "27px",
                                display: "flex",
                                alignItems: "center",
                              }),
                              input: (base) => ({
                                ...base,
                                margin: "0",
                                padding: "0",
                              }),
                              indicatorsContainer: () => ({
                                display: "none", // hide default dropdown arrow
                              }),
                              menu: (base) => ({
                                ...base,
                                fontSize: "14px",
                                marginTop: "2px",
                                zIndex: 9, // Very high z-index
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                              }),
                              option: (base, state) => ({
                                ...base,
                                fontSize: "14px",
                                padding: "0px 8px",
                                backgroundColor: state.isFocused
                                  ? "#33b0ca"
                                  : "#fafafa",
                                color: state.isFocused ? "#ffffff" : "#000000",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                height: "32px",
                                lineHeight: "16px",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                fontSize: "12px",
                                "@media (min-width: 768px)": {
                                  fontSize: "14px",
                                },
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }),
                              singleValue: (base) => ({
                                ...base,
                                fontSize: "12px",
                                "@media (min-width: 768px)": {
                                  fontSize: "14px",
                                },
                                margin: "0",
                                padding: "0",
                                lineHeight: "27px",
                              }),
                            }}
                            classNamePrefix="custom-select"
                          />

                          <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                            {isSubGenreOpen ? (
                              <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                            ) : (
                              <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div className="col-span-12 sm:col-span-6 md:col-span-6 mt-[-6px]">
                    <label className="text-[12px] md:!text-[14px] font-[500]">
                      Location
                    </label>

                    <input
                      type="text"
                      ref={locationNameRef}
                      className={`block bg-[#fafafa] h-[30px] rounded-[4px] border-[2px] ${
                        geographyItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                      placeholder="Country/Region/City"
                      value={geographyItem}
                      onFocus={() => {
                        setActiveInput("geographyItem");
                        setFocusedFieldName("locationName");
                      }}
                      onChange={(e) => {
                        const value = e.target.value
                          .trimStart()
                          .replace(/\s{2,}/g, " ");
                        setGeographyItem(value);
                      }}
                      required
                      maxLength={100}
                    />
                  </div>
                  {isMobile ? (
                    <div
                      ref={setinPeriodRef}
                      className={`h-[31px] sm:mt-[21px] relative col-span-12 sm:col-span-6 md:col-span-3 ${
                        periodSetIn ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } rounded-[4px] border-[2px]`}
                    >
                      <select
                        value={periodSetIn || ""}
                        onChange={(e) => setPeriodSetIn(e.target.value)}
                        onFocus={() => setSetinPeriodOpen(true)}
                        onBlur={() => setSetinPeriodOpen(false)}
                        className="w-full h-[27px] text-[12px] md:text-[14px] bg-[#fafafa] border-none outline-none rounded-[4px] px-2 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Period of time
                        </option>
                        <option value="Ancient">Ancient</option>
                        <option value="Modern">Modern</option>
                        <option value="Contemporary">Contemporary</option>
                        <option value="Last Century">Last Century</option>
                        <option value="Medieval">Medieval</option>
                        <option value="Prehistortic">Prehistortic</option>
                      </select>

                      {/* Custom arrow */}
                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                        {isSetinPeriodOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      ref={setinPeriodRef}
                      className={`h-[31px] sm:mt-[21px] relative col-span-12 sm:col-span-6 md:col-span-3 ${
                        periodSetIn ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } rounded-[4px] border-[2px]`}
                    >
                      <Select
                        options={[
                          { value: "Ancient", label: "Ancient" },
                          { value: "Modern", label: "Modern" },
                          { value: "Contemporary", label: "Contemporary" },
                          { value: "Last Century", label: "Last Century" },
                          { value: "Medieval", label: "Medieval" },
                          { value: "Prehistortic", label: "Prehistortic" },
                        ]}
                        value={
                          [
                            { value: "Ancient", label: "Ancient" },
                            { value: "Modern", label: "Modern" },
                            { value: "Contemporary", label: "Contemporary" },
                            { value: "Last Century", label: "Last Century" },
                            { value: "Medieval", label: "Medieval" },
                            { value: "Prehistortic", label: "Prehistortic" },
                          ].find((option) => option.value === periodSetIn) ||
                          null
                        }
                        onChange={(selectedOption) => {
                          setPeriodSetIn(selectedOption?.value || "");
                        }}
                        onMenuOpen={() => setSetinPeriodOpen(true)}
                        onMenuClose={() => setSetinPeriodOpen(false)}
                        placeholder="Period of time"
                        menuPortalTarget={document.body} // Render menu to document.body
                        menuPosition="fixed" // Use fixed positioning
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9, // Very high z-index to ensure it's on top
                          }),
                          control: (base) => ({
                            ...base,
                            height: "27px",
                            minHeight: "27px",
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            border: "none",
                            backgroundColor: "#fafafa",
                            boxShadow: "none",
                            padding: "0",
                            margin: "0",
                            width: "100%",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: "0 6px",
                            height: "27px",
                            display: "flex",
                            alignItems: "center",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0",
                            padding: "0",
                          }),
                          indicatorsContainer: () => ({
                            display: "none", // hide default dropdown arrow
                          }),
                          menu: (base) => ({
                            ...base,
                            fontSize: "14px",
                            marginTop: "2px",
                            zIndex: 9, // Very high z-index
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          }),
                          option: (base, state) => ({
                            ...base,
                            fontSize: "14px",
                            padding: "0px 8px",
                            backgroundColor: state.isFocused
                              ? "#33b0ca"
                              : "#fafafa",
                            color: state.isFocused ? "#ffffff" : "#000000",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            height: "32px",
                            lineHeight: "20px",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            margin: "0",
                            padding: "0",
                            lineHeight: "27px",
                          }),
                        }}
                        classNamePrefix="custom-select"
                      />

                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                        {isSetinPeriodOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        )}
                      </div>
                    </div>
                  )}
                  <div
                    className={`col-span-12 sm:col-span-6 md:col-span-5 gap-[12px] mt-[-6px]`}
                  >
                    <p className="text-[12px] md:!text-[14px] font-[500]">
                      Who Is Your Protagonist
                    </p>
                    <input
                      ref={protagonistNameRef}
                      className={`block bg-[#fafafa] w-full h-[30px] rounded-[4px] border-[2px] ${
                        protagonistName
                          ? "border-[#33B0CA]"
                          : "border-[#EAEAEA]"
                      }  px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                      placeholder="Name"
                      type="text"
                      onFocus={() => setFocusedFieldName("protagonistName")}
                      onChange={(e) => {
                        const value = e.target.value
                          .trimStart()
                          .replace(/\s{2,}/g, " ");
                        setProtagonistName(value);
                      }}
                      value={protagonistName}
                      required
                      maxLength={100}
                    />
                  </div>{" "}
                  {isMobile ? (
                    <div
                      ref={protagonistRef}
                      className={`h-[31px] sm:mt-[21px] relative col-span-12 sm:col-span-6 md:col-span-4 ${
                        protagonist ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } bg-[#fafafa] rounded-[4px] border-[2px]`}
                    >
                      <select
                        value={protagonist || ""}
                        onChange={(e) => setProtagonist(e.target.value)}
                        onFocus={() => setIsProtagonistOpen(true)}
                        onBlur={() => setIsProtagonistOpen(false)}
                        className="w-full h-[27px] text-[12px] md:text-[14px] bg-[#fafafa] px-2 rounded-[4px] appearance-none outline-none"
                      >
                        <option value="" disabled>
                          Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Animal">Animal</option>
                        <option value="Inanimate Object">
                          Inanimate Object
                        </option>
                      </select>

                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                        {isProtagonistOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      ref={protagonistRef}
                      className={`h-[31px] sm:mt-[21px] relative col-span-12 sm:col-span-6 md:col-span-4 bg-[#fafafa] ${
                        protagonist ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } rounded-[4px] border-[2px]`}
                    >
                      <Select
                        options={[
                          { value: "Male", label: "Male" },
                          { value: "Female", label: "Female" },
                          { value: "Animal", label: "Animal" },
                          {
                            value: "Inanimate Object",
                            label: "Inanimate Object",
                          },
                        ]}
                        value={
                          [
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Animal", label: "Animal" },
                            {
                              value: "Inanimate Object",
                              label: "Inanimate Object",
                            },
                          ].find((option) => option.value === protagonist) ||
                          null
                        }
                        onChange={(selectedOption) => {
                          setProtagonist(selectedOption?.value || "");
                        }}
                        onMenuOpen={() => setIsProtagonistOpen(true)}
                        onMenuClose={() => setIsProtagonistOpen(false)}
                        placeholder="Gender"
                        menuPortalTarget={document.body} // Render menu to document.body
                        menuPosition="fixed" // Use fixed positioning
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9, // Very high z-index to ensure it's on top
                          }),
                          control: (base) => ({
                            ...base,
                            height: "27px",
                            minHeight: "27px",
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            border: "none",
                            backgroundColor: "#fafafa",
                            boxShadow: "none",
                            padding: "0",
                            margin: "0",
                            width: "100%",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: "0 6px",
                            height: "27px",
                            display: "flex",
                            alignItems: "center",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0",
                            padding: "0",
                          }),
                          indicatorsContainer: () => ({
                            display: "none", // hide default dropdown arrow
                          }),
                          menu: (base) => ({
                            ...base,
                            fontSize: "14px",
                            marginTop: "2px",
                            zIndex: 9, // Very high z-index
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          }),
                          option: (base, state) => ({
                            ...base,
                            fontSize: "14px",
                            padding: "0px 8px",
                            backgroundColor: state.isFocused
                              ? "#33b0ca"
                              : "#fafafa",
                            color: state.isFocused ? "#ffffff" : "#000000",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            height: "32px",
                            lineHeight: "20px",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            margin: "0",
                            padding: "0",
                            lineHeight: "27px",
                          }),
                        }}
                        classNamePrefix="custom-select"
                      />

                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                        {isProtagonistOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                        )}
                      </div>
                    </div>
                  )}
                  <div className="col-span-12 mb-[12px] md:mt-[21px] md:mb-[0px] md:col-span-3">
                    {" "}
                    <div className="flex h-[31px] gap-[12px] md:w-[185px]">
                      {protagonist !== "Inanimate Object" && (
                        <>
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
                            onChange={(e) => {
                              const value = e.target.value;

                              if (/^\d*$/.test(value)) {
                                if (value === "" || value > 0) {
                                  setProtaAge(value);
                                }
                              }
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* button part */}
            {!finalEdit ? (
              <div className="lg:bg-[#FAFAFA] w-1/2 ml-auto sticky right-0 bottom-12 sm:bottom-0 flex justify-end py-1 text-center  mx-[28px] mt-[12px] mb-[10px]">
                <button
                  disabled={isLoading}
                  className={`${
                    isLoading
                      ? "bg-[#616161] rounded-[8px] h-[32px] px-[12px] text-[14px] font-[600] text-white hover:bg hidden"
                      : "bg-[#FAFAFA] border h-[32px] !border-[#33B0CA] text-[#33B0CA] rounded-[8px]  px-[12px] text-[14px] font-[600]"
                  } mr-4 md:ml-0`}
                  onClick={() => handleGoBack()}
                >
                  Back
                </button>
                {!isLoading && (
                  <button
                    // onClick={submitPremise}
                    disabled={!formValid}
                    type="submit"
                    className={` text-white rounded-[8px] h-[32px] px-[28px] z-20 text-[14px] font-[600] ${
                      !formValid ? "bg-[#ACDDE7] " : "bg-[#33B0CA]"
                    }`}
                  >
                    Next
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex w-[88%] mx-auto items-center gap-2 mt-[8px] ml-8">
                  <input
                    className=" cursor-pointer"
                    type="checkbox"
                    id="checkbox"
                    onChange={() => setAgreeToPost(!agreeToPost)}
                    checked={agreeToPost}
                  />
                  <p
                    htmlFor="checkbox"
                    className="text-[12px] leading-4 max-w-[90%]"
                  >
                    I understand that after posting the Premise, I will not be
                    able to edit the proposed characters.
                  </p>
                </div>
                <div
                  className={`lg:bg-[#FAFAFA] absolute right-3 md:right-0 md:bottom-0  flex items-center justify-end pt-[4px] pb-[8px] text-center  md:mx-[28px]  ${
                    charSaveDisable ? " md:top-[23px]" : " md:top-[118px]"
                  } md:mb-[10px]  `}
                >
                  {!charSaveDisable && (
                    <div
                      onClick={handleEditProposedCharacters}
                      className={`position-relative text-[#33B0CA]  cursor-pointer mr-[12px]  h-[32px] px-[10px] text-[14px] font-[500] border border-[#fafafa] border-b-[#33B0CA]
                  `}
                    >
                      Edit Proposed Characters
                    </div>
                  )}
                  {finalSubmitLoading ? (
                    <div
                      disabled={finalSubmitLoading}
                      className={` text-white cursor-auto rounded-[8px] h-[32px] px-[28px] text-[14px] font-[600] bg-[#33B0CA]`}
                    >
                      Posting...
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center ">
                      {charSaveDisable && (
                        <div
                          onClick={() => {
                            setFinalSubmitLoading(false);
                            setCharacterEditPop(true);
                          }}
                          // disabled={}
                          className={`  flex justify-center items-center cursor-pointer rounded-[8px] h-[32px] px-[28px]
                             text-[14px] font-[600] border border-[#33B0CA]  text-[#33B0CA] `}
                        >
                          Back To Character List
                        </div>
                      )}
                      <button
                        disabled={!agreeToPost}
                        onClick={handlePremisePostToGetComments}
                        className={` text-white flex justify-center items-center  rounded-[8px] h-[32px] px-[28px] text-[14px] 
                          font-[600] ${
                            agreeToPost ? "bg-[#33B0CA] " : "bg-[#ACDDE7]"
                          }`}
                      >
                        Post
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </form>
        </div>
        {characterEditPop && (
          <CharacterEditablePop
            setCharacterEditPop={setCharacterEditPop}
            characterArray={characterArray}
            currentProjectData={currentProjectData}
            setCharacterArray={setCharacterArray}
            handleUpdateSavedChar={handleUpdateSavedChar}
            handleSaveAsDraft={handleSaveAsDraft}
            characterLoading={characterLoading}
            source_language={premiseData?.source_language}
            project_id={selectedSpProjectID || createdSpProjectID}
            // project_id1={createdSpProjectID}
            isOldProject={isOldProject}
            // source_language={premiseData?.source_language}
            openOnSaveCharactersDemoPop={openOnSaveCharactersDemoPop}
            setOpenOnSaveCharactersDemoPop={setOpenOnSaveCharactersDemoPop}
          />
        )}

        {openPop && premiseData && (
          <Popup
            popClose={() => {
              setOpenPop(false);
              setAddPopup(null);
            }}
            setIsLiked={setIsLiked}
            data={premiseData}
            refetch={refetch}
            projectRefetch={projectRefetch}
            actOneThreshold={actOneThreshold}
            actTwoEnd={actTwoEnd}
            afterFinalPostPremiseDemoPop={afterFinalPostPremiseDemoPop}
            setAfterFinalPostPremiseDemoPop={setAfterFinalPostPremiseDemoPop}
          />
        )}

        {sameNamePop && (
          <SameNamePop
            popClose={setSameNamePop}
            title={`A project with the same name already exists. Please choose a different name.`}
          />
        )}
        <div>
          {selectedLanguage && keyboardVisible && (
            <Draggable handle=".movable-handle">
              <div className="absolute z-20 w-[650px] top-[194px] right-[-85px] bg-[#fafafa] border border-[#eaeaea] shadow-lg rounded">
                <div className="grid grid-cols-12">
                  <div className="movable-handle col-span-11 bg-[#f8f8f8] text-[#616161] cursor-move text-center text-[14px] font-[400]">
                    Drag me!!{" "}
                    <span className="font-[500]">{selectedLanguage}</span>{" "}
                    Keyboard
                  </div>
                  <div className="flex justify-center items-center w-full h-full cursor-pointer">
                    <button
                      onClick={() => {
                        setKeyboardVisible(false);
                        //setSelectedLanguage('')
                      }}
                      className="font-bold w-full h-full"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-2">
                  <PremisePreviewKeyboard
                    sourcesLanguage={selectedLanguage}
                    inputRefs={{
                      locationNameRef,
                      authorNameRef,
                      projectNameRef,
                      protagonistNameRef,
                    }}
                    focusedFieldName={focusedFieldName}
                    setProtagonistName={setProtagonistName}
                    setSpProjectName={setSpProjectName}
                    setAuthorName={setAuthorName}
                    setGeographyItem={setGeographyItem}
                  />
                </div>
              </div>
            </Draggable>
          )}
        </div>
        {openPreviewDemoPop && (
          <PreviewPremiseTutorialPop
            popClose={() => setOpenPreviewDemoPop(false)}
          />
        )}
        {openPreviewNextDemoPop && (
          <PreviewNextDemoPop
            popClose={() => setOpenPreviewNextDemoPop(false)}
          />
        )}
        {openProposedCharDemoPop && (
          <ProposedCharDemoPop
            setOpenProposedCharDemoPop={setOpenProposedCharDemoPop}
          />
        )}
        {/* {finalPostPremiseDemoPop && (
          <finalPostPremiseDemoPop
            popClose={() => setFinalPostPremiseDemoPop(false)}
          />
        )} */}
        {openOnSaveCharactersDemoPop && (
          <OnSaveCharacterPop
            popClose={() => setOpenOnSaveCharactersDemoPop(false)}
          />
        )}
      </div>
    );
  }
};
export default PremisePreview2;
