import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import {
  FaBold,
  FaItalic,
  FaKeyboard,
  FaRegTrashAlt,
  FaUnderline,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { PiTextAUnderlineBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MyContext } from "../../../App";
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
  useUpdateSpProjectMutation,
} from "../../../app/EndPoints/ScriptPad/project";
import { setUser } from "../../../app/Slices/userSlice";
import fillIcon from "../../../img/Icons/fillicon.png";
import bgIcon from "../../../img/Icons/setBgIcn.png";
import TypingLoader from "../../TypingLoader";
import { baseURL } from "../../utils";
import CharacterEditablePop from "../Character/CharacterEditablePop";
import { sortedLanguages } from "../Languages";
import LanguageSelector from "../LanguageSelector";
import Popup from "../Popup";
import { hideUnhidePremise } from "../PreiseUtils";
import Pkeyboard from "./PreviewKeyboard";

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
}) => {
  const baseLanguage = sessionStorage.getItem("multilingualDropDownValue");

  const options1 = {
    "Short film": [
      { text: "About 2 Minutes", value: "Upto 2 Minutes" },
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
      { text: "About 2 Minutes", value: "Upto 2 Minutes", hi: "लगभग 2 मिनट" },
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
  const [selectedLanguage, setSelectedLanguage] = useState("English");
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
  const [duration, setDuration] = useState("");
  // console.log("duration", duration);
  const [periodSetIn, setPeriodSetIn] = useState("");
  const [protagonist, setProtagonist] = useState(null);
  const [protagonistName, setProtagonistName] = useState("");
  const [geographyItem, setGeographyItem] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [selectedSpProject, setSelectedSpProject] = useState();

  const [activeInput, setActiveInput] = useState(""); // Track the active input field
  const inputRefs = useRef({}); // Store references to all input fields

  const projectNameRef = useRef();

  const setText = (newText) => {
    if (activeInput && inputRefs.current[activeInput]) {
      const setterMap = {
        authorName: setAuthorName,
        geographyItem: setGeographyItem,
        protagonistName: setProtagonistName,
      };
      setterMap[activeInput](newText);
    }
  };

  const token = localStorage.getItem("accessToken");

  const header = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // const [selectedSpProjectID, setSelectedSpProjectID] = useState("");
  // const [createdSpProjectID, setCreatedSpProjectID] = useState("");
  const [spProjectName, setSpProjectName] = useState("");
  const [matchingProject, setMatchingProject] = useState(null);
  const [characterArray, setCharacterArray] = useState([]);
  // const [characters, setCharacters] = useState(characterArray);

  const [language, setlanguage] = useState("");
  // console.log("language", language);
  const handleNatureOfProjectChange = (e) => {
    const selectedProject = e.target.value;
    setNatureOfProject(selectedProject);
    setDurationOptions(options[selectedProject] || []);
    setDuration("");
  };
  console.log(natureOfProject);
  console.log(durationOptions);
  // const {
  //   data: ProjectsObj,
  //   isLoading: isProjectLoading,
  //   refetch: projectRefetch,
  // } = useGetMyAllProjectQuery();

  const filteredSpProjectsUnsorted = allProjects?.filter(
    (item) => !item.locked && item.premise_id === ""
  );
  //  console.log(filteredSpProjectsUnsorted);
  const filteredSpProjects = filteredSpProjectsUnsorted?.sort((a, b) => {
    return new Date(b.updated_on) - new Date(a.updated_on);
  });

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
      setlanguage("");
      setAuthorName("");
      setNatureOfProject("");
      setDuration("");
      setGeneraItem("");
      setSubGeneraItem("");
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
        setlanguage(matchingProject?.language);
        setAuthorName(matchingProject?.ownername);
        setNatureOfProject(matchingProject?.nature_project);

        setDurationOptions(options[matchingProject?.nature_project]);

        setDuration(matchingProject?.duration);
        setGeneraItem(matchingProject?.genre);
        setSubGeneraItem(matchingProject?.sub_genre);
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
  const [toDltPremiseWhenErrorID, setToDltPremiseWhenErrorID] = useState("");
  // console.log("toDltPremiseWhenErrorID", toDltPremiseWhenErrorID);

  const handleHideUnhidePremise = async (id) => {
    hideUnhidePremise(id, setHideDisable, userRefetch, setOpenDotMenu);
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

  useEffect(()=>{

    
    console.log( 'protagonist',protagonist);
    
  },[protagonist])
  // console.log("Header", characterArray);
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
        const nameExists = allspProjectJSON?.projects?.some(
          (item) => item.name === spProjectName
        );
        if (nameExists) {
          setIsLoading(false);
          return alert(
            "A project with the same name already exists. Please choose a different name."
          );
        }

        const response = await createProject(data);
        // const response = await console.log(data);

        if (response) {
          // refetch();
          setCurrentProjectData(response?.data?.projects);
          setCreatedSpProjectID(response?.data?.projects?.pro_uuid);
          setspID(response?.data?.projects?.pro_uuid);
          formData.append("project_id", response?.data?.projects?.pro_uuid);
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
                }
              })
              .catch((error) => {
                setIsLoading(false);
                deletePremiseWhenFailed(deletePreID);

                const data = {
                  project: deleteId,
                };
                deleteProject(data);

                toast.error("Failed to create Premise", {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 1600,
                });
                setAddPopup(null);
              });
          } else {
            // Handle API errors
            setIsLoading(false);

            const data = {
              project: deleteId,
            };

            deleteProject(data);
            toast.error(res?.error?.data?.message || "Something went wrong!", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1600,
            });
            setAddPopup(null);
          }
        }
      } else {
        data.id = selectedSpProjectID;
        data.name = selectedSpProject;
        // return
        const response = await updateProject(data);
        setCurrentProjectData(data);
        if (response) {
          formData.append("project_id", selectedSpProjectID);
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
              project_id: response?.data?.projects?.pro_uuid,
              m_value: res?.data?.m_value,
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
            toast.error(res?.error?.data?.message || "Something went wrong!", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 800,
            });
          }
        }
      }
    } catch (error) {
      setIsLoading(false);

      // console.error("Error submitting premise:", error);
      toast.error("Something went wrong!", {
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

  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();
  const [charSaveDisable, setCharSaveDisable] = useState(false);

  const [finalSubmitLoading, setFinalSubmitLoading] = useState(false);
  const [characterLoading, setCharacterLoading] = useState(false);

  const handleUpdateSavedChar = async () => {
    setCharacterLoading(true);
    try {
      const charArr = JSON.stringify(characterArray);
      const data = {
        // id: premiseID,
        id: spID,
        body: { char_data: charArr },
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
            setOpenPop(true);
            setFinalSubmitLoading(false);
            setSelectedSpProjectID("");
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
    setActOneThreshold(Math.floor(0.25 * mValue));

    setActTwoEnd(Math.floor(0.8 * mValue));
  }, [premiseData, mValue]);

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
        <p className=" md:hidden text-center my-[8px] text-[17px] mx-auto font-[500] text-[#252525] ">
          Preview your Imagination
        </p>
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
            <p className="hidden md:block text-[17px] text-center mx-auto font-[500] text-[#252525]">
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
        ) : (
          <div>
            {" "}
            <p className="hidden md:block text-[17px] text-center mx-auto font-[500] text-[#252525] ">
              Preview your Imagination
            </p>
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
          className={`relative ${
            charSaveDisable
              ? "h-[150px] md:h-[125px] overflow-y-hidden "
              : finalEdit
              ? "h-[125px]"
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
                <div className="flex gap-[12px] items-center mt-[32px]">
                  {filteredSpProjects.length !== 0 && (
                    <div
                      ref={spProjectRef}
                      className={`h-[31px] relative w-[144px] md:w-[206px] bg-[#fafafa] ${
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
                        {filteredSpProjects?.map((option) => (
                          <option
                            key={option.pro_uuid}
                            value={option?.pro_uuid}
                          >
                            {option?.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center   pointer-events-none">
                        {isProjectOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                        )}
                      </div>
                    </div>
                  )}
                  {!createNewProject && (
                    <>
                      {filteredSpProjects.length !== 0 && (
                        <p className="text-[14px] font-[400] text-[#616161]">
                          Or
                        </p>
                      )}

                      <div
                        onClick={() => {
                          setCreateNewProject(true);
                          setSelectedSpProjectID("");
                        }}
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
                      <div
                        ref={spProjectRef}
                        className={`h-[31px] relative w-[144px] md:w-[206px] bg-[#fafafa] ${
                          selectedSpProjectID
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        } rounded-[4px] border-[2px]`}
                      >
                        <select
                          //  disabled={filteredSpProjects.length==0 || createNewProject}
                          className="block appearance-none bg-[#fafafa]  h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                          onClick={() => {
                            setIsProjectOpen(!isProjectOpen);
                          }}
                          value={selectedSpProjectID}
                          onChange={(e) =>
                            setSelectedSpProjectID(e.target.value)
                          }
                          required
                        >
                          <option value="" disabled>
                            Select A Project
                          </option>
                          {filteredSpProjects?.map((option) => (
                            <option
                              key={option.pro_uuid}
                              value={option.pro_uuid}
                            >
                              {option?.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center   pointer-events-none">
                          {isProjectOpen ? (
                            <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                          ) : (
                            <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                          )}
                        </div>
                      </div>
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
                  <div className="bg-[#FAFAFA] h-[38px] md:h-[32px] xl:h-[38px] border border-[#EAEAEA] shadow-sm rounded-[8px] px-[8px] hidden lg:flex items-center w-[120px] ">
                    <div className="flex justify-end gap-3  w-full ">
                      <FaKeyboard
                        onClick={onClickKeyboard}
                        data-te-toggle="tooltip"
                      />
                      <LanguageSelector
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
                <span className="font-[500] text-[#252525]">conflict</span> and{" "}
                {actTwoEnd + 1} to {mValue} around{" "}
                <span className="font-[500] text-[#252525]">resolution</span>.
              </p>
            )}
          </div>

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
                    <div className="flex h-[31px] col-span-5 md:col-span-4">
                      <input
                        type="text"
                        ref={projectNameRef}
                        // id="spProjectName"
                        className={`h-[30px] relative  text-[12px] md:!text-[14px] leading-tight px-[8px] w-full md:w-[181px] bg-[#fafafa] rounded-[4px] border-[2px] ${
                          spProjectName
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        } focus:outline-none`}
                        placeholder="Project Name"
                        required
                        // value={spProjectName}
                        onChange={handleProjectChange}
                      />
                    </div>
                  )}
                  <div
                    className={`col-span-7 md:col-span-4 md:w-[191px] ${
                      createNewProject && "md:ml-[-5px]"
                    }`}
                  >
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
                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center   pointer-events-none">
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
                      // id="authorName"
                      ref={projectNameRef}
                      className={`h-[30px] relative text-[12px] md:!text-[14px] leading-tight px-[8px] w-full md:w-[191px] bg-[#fafafa] rounded-[4px] border-[2px] ${
                        authorName ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } focus:outline-none`}
                      placeholder="Author Name"
                      // value={authorName}
                      // onFocus={() => setActiveInput("authorName")}
                      onChange={(e) => setAuthorName(e.target.value)}
                      // required
                    />
                  </div>
                  <div
                    className={` col-span-7 ${
                      createNewProject
                        ? "md:col-span-3  md:w-[146px] "
                        : "md:col-span-4"
                    } `}
                  >
                    <div
                      ref={natureProjectRef}
                      className={`h-[31px] relative  bg-[#fafafa] rounded-[4px] border-[2px] ${
                        natureOfProject
                          ? "border-[#33B0CA]"
                          : "border-[#EAEAEA]"
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
                        {/* {Object.keys(options)?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))} */}

                        {NProjectOpt?.map((option) => (
                          <>
                            {baseLanguage === "hi" ? (
                              <option key={option?.value} value={option?.value}>
                                {option?.hi}
                              </option>
                            ) : (
                              <option key={option?.value} value={option?.value}>
                                {option?.value}
                              </option>
                            )}
                          </>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center pointer-events-none">
                        {isNatureProjectOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px] " />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px] " />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div
                    className={`h-[31px] relative  bg-[#fafafa] rounded-[4px] border-[2px] col-span-4 ${
                      createNewProject
                        ? "  md:col-span-3 w-[104px] xxs:w-[120px] md:w-[130px] md:ml-[8px] "
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
                      <option className="" value="" selected disabled>
                        Duration
                      </option>

                      {durationOptions?.map((option, index) => (
                        <option key={option.value} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center  pointer-events-none">
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
                        ? " md:col-span-3 w-[104px] xxs:w-[119px] md:w-[126px] ml-[-6px] md:ml-[0px]"
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

                      {genera?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center  pointer-events-none">
                      {isgenreOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      )}
                    </div>
                  </div> */}
                  <div
                    className={`h-[31px] relative  bg-[#fafafa] rounded-[4px] border-[2px] col-span-4 ${
                      createNewProject
                        ? "  md:col-span-3 w-[104px] xxs:w-[120px] md:w-[130px] md:ml-[8px] "
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
                      <option className="" value="" selected disabled>
                        Duration
                      </option>

                      {durationOptions?.map((option, index) => (
                        <>
                          {baseLanguage === "hi" ? (
                            <option key={option?.value} value={option?.value}>
                              {option?.hi}
                            </option>
                          ) : (
                            <option key={option?.value} value={option?.value}>
                              {option?.text}
                            </option>
                          )}
                        </>

                        // <option key={option.value} value={option.value}>
                        //   {option.text}
                        // </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center  pointer-events-none">
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
                        ? " md:col-span-3 w-[104px] xxs:w-[119px] md:w-[126px] ml-[-6px] md:ml-[0px]"
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

                      <option value="" disabled>
                        Genre
                      </option>

                      {genera?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center  pointer-events-none">
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
                        ? "md:col-span-3 xxs:w-[139px] md:w-[154px] ml-[-13px] md:ml-[-13px] "
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

                      {subGeneraOptions?.map((subGenre) => (
                        <option
                          className="text-[12px] md:!text-[14px]"
                          key={subGenre}
                          value={subGenre}
                        >
                          {subGenre}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center pointer-events-none">
                      {isSubGenreOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      )}
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6 mt-[-6px]">
                    <label className="text-[12px] md:!text-[14px] font-[500]">
                      Location
                    </label>
                    {/* <input
                      className={`block bg-[#fafafa] h-[30px] rounded-[4px] border-[2px] ${
                        geographyItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                      placeholder="Country/Region/City"
                      type="text"
                      value={geographyItem}
                      onChange={handleGeographyChange}
                      required
                      maxLength={100}
                    /> */}
                    <input
                      type="text"
                      ref={projectNameRef}
                      className={`block bg-[#fafafa] h-[30px] rounded-[4px] border-[2px] ${
                        geographyItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                      placeholder="Country/Region/City"
                      value={geographyItem}
                      onFocus={() => setActiveInput("geographyItem")}
                      onChange={(e) => setGeographyItem(e.target.value)}
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
                      <option className="" value="" selected disabled>
                        Period of time
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
                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center  pointer-events-none">
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
                      ref={projectNameRef}
                      className={`block bg-[#fafafa] w-full h-[30px] rounded-[4px] border-[2px] ${
                        protagonistName
                          ? "border-[#33B0CA]"
                          : "border-[#EAEAEA]"
                      }  px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                      placeholder="Name"
                      type="text"
                      // value={protagonistName}
                      onChange={(e) =>
                        handleProtagonistNameChange(e, setProtagonistName)
                      }
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
                      <option className="" value="" selected disabled>
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
                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center pointer-events-none">
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
                      {protagonist !== "" && (
                        <>
                          <label className="text-[12px] md:!text-[14px] font-[500]">
                            Age
                          </label>
                          <input
                            type="text"
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
              <div className="lg:bg-[#FAFAFA] absolute right-3 md:right-0 bottom-0  flex  justify-end py-1 text-center  md:mx-[28px] mt-[12px] md:mb-[10px]">
                <button
                  disabled={isLoading}
                  className={`${
                    isLoading
                      ? "bg-[#616161] rounded-[8px] h-[32px] px-[12px] text-[14px] font-[600] text-white hover:bg hidden"
                      : "bg-[#FAFAFA] border h-[32px] !border-[#33B0CA] text-[#33B0CA] rounded-[8px]  px-[12px] text-[14px] font-[600]"
                  } mr-7 md:ml-0`}
                  onClick={() => handleGoBack()}
                >
                  Back
                </button>
                {!isLoading && (
                  <button
                    // onClick={submitPremise}
                    disabled={!formValid}
                    type="submit"
                    className={` text-white rounded-[8px] h-[32px] px-[28px] text-[14px] font-[600] ${
                      !formValid ? "bg-[#616161] " : "bg-[#33B0CA]"
                    }`}
                  >
                    Next
                  </button>
                )}
              </div>
            ) : (
              <div className="lg:bg-[#FAFAFA] absolute right-3 md:right-0 bottom-0  flex  justify-end pt-[4px] pb-[8px] text-center  md:mx-[28px] top-[100px] md:top-[73px] md:mb-[10px] ">
                {!charSaveDisable && (
                  <div
                    onClick={() => setCharacterEditPop(true)}
                    className={` text-[#33B0CA] cursor-pointer mr-[12px] rounded-[8px] h-[32px] px-[10px] text-[14px] font-[500] border border-[#fafafa] border-b-[#33B0CA]
                  `}
                  >
                    Edit Proposed Characters
                  </div>
                )}
                {finalSubmitLoading ? (
                  <div
                    disabled={finalSubmitLoading}
                    className={` text-white cursor-auto rounded-[8px] h-[32px] px-[28px] text-[14px] font-[600] ${"bg-[#33B0CA]"}`}
                  >
                    Posting...
                  </div>
                ) : (
                  <div
                    onClick={handlePremisePostToGetComments}
                    disabled={finalSubmitLoading}
                    className={` text-white flex justify-center items-center cursor-pointer rounded-[8px] h-[32px] px-[28px] text-[14px] font-[600] ${"bg-[#33B0CA]"}`}
                  >
                    Post
                  </div>
                )}
              </div>
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
            characterLoading={characterLoading}
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
                      onClick={() => setKeyboardVisible(false)}
                      className="font-bold w-full h-full"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-2">
                  <Pkeyboard
                    sourcesLanguage={selectedLanguage}
                    setText={setText}
                    inputRef={projectNameRef}
                  />
                </div>
              </div>
            </Draggable>
          )}
        </div>
      </div>
    );
  }
};
export default PremisePreview2;
