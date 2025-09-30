// import "./BeatCss.css";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaKeyboard } from "react-icons/fa";
import { MdKeyboardBackspace } from "react-icons/md";
import { toast } from "react-toastify";
import { MyContext } from "../../../App";
import {
  useCreateProjectMutation,
  useGetMyAllProjectQuery,
  useGetScreenPlayMutation,
  useSaveScreenPlayMutation,
  useUpdateAddedToBeatMutation,
  useUpdateSceneMutation,
} from "../../../app/EndPoints/ScriptPad/project";
import {
  useGetPremiseUserQuery,
  useTranslatePremiseMutation,
} from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";
import transIcon from "../../../img/Icons/transIcon.png";
import "../../Premisepool/Premise.css";
import TypingLoader from "../../TypingLoader";
import { URL } from "../../utils";
import ConfirmationModal from "../Comments/ConfirmationModal";
import KeyboardB from "../KeyboardB";
import { sortedLanguages } from "../Languages";
import ProjectNotfound from "./ProjectNotfound";
const BeatEditPop = ({
  project_id,
  popClose,
  commentText,
  commentObj,
  commentRefetch,
  replyRefetch,
  data,
  premiseData,
  suggestedBeats,
  isBeatSuggLoading,
  beatSuggestLoading,
  selectedProject,
  setAddToBeatDisable,
  fromNew
}) => {
  const {
    selectedPremiseObj,
    selectedSpProjectID,
    createdSpProjectID,
    allspProjectJSON,
  } = useContext(MyContext);
  const currentProjectData = allspProjectJSON?.projects?.find(
    (item) => item.pro_uuid === project_id
  );

  const isProjectLocked = currentProjectData?.locked;

  const projectCreateRef = useRef(null);
  const [editedText, setEditedText] = useState(commentText?.text);
  const [modifiedText, setModifiedText] = useState(commentText?.text);
  const [projectData, setProjectData] = useState([]);
  const [confirmBit, setConfirmBit] = useState(false);
  // console.log("passed Project", modifiedText);
  // const [selectedProject, setSelectedProject] = useState(null);
  // console.log("selectedProject", selectedProject);
  const [selectedOption, setSelectedOption] = useState("");
  const [translatePremise, translateInfo] = useTranslatePremiseMutation();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [textareaValues, setTextareaValues] = useState({});

  const {
    data: userQuery,
    isUserNameLoading,
    refetch: userRefetch,
  } = useGetPremiseUserQuery();

  const [addButtonDisable, setAddButtonDisable] = useState(false);
  const [isNewProjectVisible, setNewProjectVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const userFirstName = userQuery?.first_name;
  const userLastName = userQuery?.last_name;
  const [openUserNamePop, setOpenUserNamePop] = useState(false);
  const [isUserName, setIsUserName] = useState(true);
  // console.log(suggestedBeats)

  const [regardingOutput, setRegardingOutput] = useState("one");
  const [options, setOptions] = useState({});
  const [doNotShowBox, setDoNotShowBox] = useState(false);

  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [sourcesLanguage, setSourcesLanguage] = useState("English");

  const [firstName, setFirstName] = useState(userFirstName || "");
  const [lastName, setLastName] = useState(userLastName || "");

  const {
    data: ProjectsObj,
    isLoading: isProjectLoading,
    isError,
    refetch,
  } = useGetMyAllProjectQuery();

  useEffect(() => {
    const initialValues = Object.keys(suggestedBeats).reduce((acc, key) => {
      acc[key] = cleanUpInput(suggestedBeats[key]);
      return acc;
    }, {});
    setOptions(initialValues);
  }, [suggestedBeats]);

  const [addedToBeat, addedToBEatResInfo] = useUpdateAddedToBeatMutation();

  // let modifiedText = editedText
  useEffect(() => {
    // let filter1 = editedText?.replace(/^[\d\s]+/, "");
    // let filter2 = filter1?.replace(/[!?.,]+/g, "");
    setModifiedText(options[regardingOutput]);
  }, [options, regardingOutput]);

  const [createProject, resInfo] = useCreateProjectMutation();
  // console.log("res", translateInfo.isLoading);
  const { data: user, isUserLoading } = useGetPremiseUserQuery();

  useEffect(() => {
    const allProjects = ProjectsObj?.projects?.filter((item) => !item.locked);
    if (allProjects) {
      const projectArray = [...allProjects].reverse();
      // console.log("userQuery", user);
      setProjectData(projectArray);
    }
  }, [ProjectsObj]);

  useEffect(() => {
    if (isNewProjectVisible) {
      projectCreateRef?.current?.focus();
    }
  }, [isNewProjectVisible]);

  useEffect(() => {
    if (userLastName && userFirstName) {
      setOpenUserNamePop(false);
    }
  }, [userFirstName, userLastName, userRefetch]);

  const [transLoading, setTransLoading] = useState(false);
  const handleOptionChange = async (e) => {
    setTransLoading(true);
    // console.log(e.target.value);
    setSelectedOption(e.target.value);
    setSelectedLanguage(e.target.value);
    setSourcesLanguage(sortedLanguages[e.target.value]);
    const selectedLanguage = e.target.value;
    const body = {
      text: modifiedText,
      tar_lang: selectedLanguage,
    };
    const res = await translatePremise(body);
    setEditedText(res?.data?.translated);

    if (res) {
      const trnsText = res.data.translated;

      setOptions((prevOptions) => ({
        ...prevOptions,
        [regardingOutput]: trnsText,
      }));

      // setSelectedLanguage("");
      setTransLoading(false);
    } else {
      setTransLoading(false);
    }
  };

  function cleanUpInput(input) {
    const result = input.replace(/\s/g, " ");
    return result.endsWith("?") ? result.slice(0, -1) : result;
  }

  const onClickKeyboard = () => {
    setKeyboardVisible(!keyboardVisible);
    if (selectedLanguage === "") {
      setSelectedLanguage("English");
    }
  };

  // Function to handle the click on "Add New Project" button

  // const handleAddNewProjectClick = () => {
  //   setNewProjectVisible(!isNewProjectVisible);
  //   setSelectedProject(null);
  // };

  // const handleSelectProject = (value) => {
  //   setSelectedProject(value);
  //   setNewProjectVisible(false);
  // };
  const [getScreenPlay, resGetScreenPlay] = useGetScreenPlayMutation();
  const [updateScene, updateBeatRes] = useUpdateSceneMutation();
  const [saveScreenPlay, resSaveScreenPlay] = useSaveScreenPlayMutation();
  const [screenPlayData, setScreenPlayData] = useState();
  const [beatPostLoading, setBeatPostLoading] = useState(false);
  const [projectNotFound, setProjectNotFound] = useState(false);

  // const handleSubmitBeatToProject = async () => {
  //   setBeatPostLoading(true);
  //   // setAddToBeatDisable(true);
  //   const data = {
  //     name: selectedProject?.name,
  //     version: selectedProject?.total_versions,
  //   };
  //   let screenPlayResponse;
  //   // screenPlayResponse = await getScreenPlay(data);
  //   try {
  //     screenPlayResponse = await getScreenPlay(data);
  //     // console.log("screenPlayResponse", screenPlayResponse?.data);
  //   } catch (err) {
  //     // alert("The screenplay file on the server is deleted or cannot be found.");
  //     setBeatPostLoading(false);
  //     // setAddToBeatDisable(false);
  //     return;
  //   }

  //   if (!screenPlayResponse?.data || isProjectLocked) {
  //     setProjectNotFound(true);

  //     setBeatPostLoading(false);
  //     return;
  //   }
  //   const screenPlayJson = screenPlayResponse.data?.screenplay_data_json;

  //   if (screenPlayJson && Object.keys(screenPlayJson).length !== 0) {
  //     const newBlankParagraph = {
  //       type: "paragraph",
  //       attrs: {
  //         "data-line-number": null,
  //         paragraphWidth: "0px",
  //         paragraphMargin: "20px",
  //         paragraphCase: "uppercase",
  //         textAlign: "left",
  //         scriptElement: "blank",
  //         id: "new-uuid-for-blank",
  //         class: "",
  //         color: "black",
  //       },
  //     };

  //     const newSluglineParagraph = {
  //       type: "paragraph",
  //       attrs: {
  //         "data-line-number": null,
  //         paragraphWidth: "0px",
  //         paragraphMargin: "20px",
  //         paragraphCase: "uppercase",
  //         textAlign: "left",
  //         scriptElement: "slugline",
  //         id: "new-uuid-for-slugline",
  //         class: "",
  //         color: "black",
  //       },
  //       content: [
  //         {
  //           type: "text",
  //           text: "INT. NEW SLUGLINE TEXT",
  //         },
  //       ],
  //     };

  //     const newArray = [
  //       ...screenPlayJson,
  //       newBlankParagraph,
  //       newSluglineParagraph,
  //     ];

  //     setScreenPlayData(newArray);
  //   } else {
  //     const newSluglineParagraph = {
  //       type: "paragraph",
  //       attrs: {
  //         "data-line-number": null,
  //         paragraphWidth: "0px",
  //         paragraphMargin: "20px",
  //         paragraphCase: "uppercase",
  //         textAlign: "left",
  //         scriptElement: "slugline",
  //         id: "new-uuid-for-slugline",
  //         class: "",
  //         color: "black",
  //       },
  //       content: [
  //         {
  //           type: "text",
  //           text: "INT. NEW SLUGLINE TEXT",
  //         },
  //       ],
  //     };

  //     const newArray = [newSluglineParagraph];

  //     setScreenPlayData(newArray);
  //   }

  //   const accessToken = localStorage.getItem("accessToken");
  //   const screenPlayResId = screenPlayResponse.data.screenplay.screenplay_uuid;
  //   const options = {
  //     url: `${URL}/scriptpad2/update-scene/${screenPlayResId}`,
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       "Content-Type": "application/json",

  //       // Add any other headers if needed
  //     },
  //   };
  //   return axios(options)
  //     .then((response) => {
  //       if (response) {
  //         let existingBeatData = response.data.data;
  //         const beatAddData = {
  //           beat: modifiedText,
  //           script: screenPlayResId,
  //           scene_number: existingBeatData.length + 1,
  //         };
  //         updateScene(beatAddData);
  //         toast.success("Beat successfully added to your scene", {
  //           position: toast.POSITION.TOP_CENTER,
  //           autoClose: 800,
  //         });

  //         if (commentObj?.reply) {
  //           // console.log("replyyy");
  //           const data = {
  //             reply_id: commentObj.id,
  //             add_to_beat_text: modifiedText,
  //           };
  //           addedToBeat(data);
  //           replyRefetch();
  //         } else {
  //           // console.log("cmnttt");
  //           const data = {
  //             comment_id: commentObj.id,
  //             add_to_beat_text: modifiedText,
  //           };
  //           addedToBeat(data);
  //           commentRefetch();
  //         }
  //         // setBeatPostLoading(false);
  //       }
  //     })
  //     .catch((err) => {
  //       toast.error("Something went wrong!", {
  //         position: toast.POSITION.TOP_CENTER,
  //         autoClose: 800,
  //       });
  //       setBeatPostLoading(false);
  //     });
  // };
  const handleSubmitBeatToProject = async () => {
    setBeatPostLoading(true); // Disable loading initially

    const data = {
      name: selectedProject?.name,
      version: selectedProject?.total_versions,
    };

    let screenPlayResponse;
    try {
      screenPlayResponse = await getScreenPlay(data);
    } catch (err) {
      setBeatPostLoading(false); // Re-enable loading in case of error
      toast.error("Failed to fetch screenplay, please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      return;
    }

    if (!screenPlayResponse?.data || isProjectLocked) {
      setProjectNotFound(true);
      setBeatPostLoading(false); // Re-enable loading when project not found
      toast.error("Project not found or locked, please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      return;
    }

    const screenPlayJson = screenPlayResponse.data?.screenplay_data_json;

    // Create paragraphs to add to the screenplay data
    const newBlankParagraph = {
      type: "paragraph",
      attrs: {
        "data-line-number": null,
        paragraphWidth: "0px",
        paragraphMargin: "20px",
        paragraphCase: "uppercase",
        textAlign: "left",
        scriptElement: "blank",
        id: "new-uuid-for-blank",
        class: "",
        color: "black",
      },
    };

    const newSluglineParagraph = {
      type: "paragraph",
      attrs: {
        "data-line-number": null,
        paragraphWidth: "0px",
        paragraphMargin: "20px",
        paragraphCase: "uppercase",
        textAlign: "left",
        scriptElement: "slugline",
        id: "new-uuid-for-slugline",
        class: "",
        color: "black",
      },
      content: [
        {
          type: "text",
          text: "INT. NEW SLUGLINE TEXT",
        },
      ],
    };

    const newArray =
      screenPlayJson && Object.keys(screenPlayJson).length !== 0
        ? [...screenPlayJson, newBlankParagraph, newSluglineParagraph]
        : [newSluglineParagraph];

    setScreenPlayData(newArray);

    const accessToken = localStorage.getItem("accessToken");
    const screenPlayResId = screenPlayResponse.data.screenplay.screenplay_uuid;
    const options = {
      url: `${URL}/scriptpad2/update-scene/${screenPlayResId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios(options);

      if (!response) {
        throw new Error("Failed to update scene data.");
      }

      let existingBeatData = response.data.data;
      const beatAddData = {
        beat: modifiedText,
        script: screenPlayResId,
        scene_number: existingBeatData.length + 1,
      };

      // Attempt to update the scene
      const updateRes = await updateScene(beatAddData);

      if (updateRes?.error) {
        toast.error("Failed to update the scene, please try again.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
        setBeatPostLoading(false); // Re-enable loading in case of error
        return; // Stop further execution if scene update fails
      }

      // Proceed with adding the beat if scene update is successful
      const fetchData = commentObj?.reply
        ? { reply_id: commentObj.id, add_to_beat_text: modifiedText }
        : { comment_id: commentObj.id, add_to_beat_text: modifiedText };

      try {
        // Attempt to add the beat
        const addToBeatRes = await addedToBeat(fetchData);
        if (addToBeatRes?.error) {
          toast.error("Failed to add beat to project, please try again.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 800,
          });
          setBeatPostLoading(false); // Re-enable loading in case of error
          return; // Stop further execution if adding the beat fails
        }
      } catch (beatError) {
        toast.error("Failed to add beat to project, please try again.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
        setBeatPostLoading(false); // Re-enable loading in case of error
        return; // Stop further execution if adding the beat fails
      }

      // Wait for refetch before finishing
      try {
        if (commentObj?.reply) {
          await replyRefetch();
        } else {
          await commentRefetch();
        }
        // If all steps succeed, show success toast
        toast.success("Beat successfully added to your scene", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
      } catch (refetchError) {
        toast.error("Failed to refetch data, please try again.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
        setBeatPostLoading(false); // Re-enable loading in case of error
        return; // Stop further execution if refetching fails
      }
    } catch (err) {
      toast.error("Failed to update scene, please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setBeatPostLoading(false); // Ensure loading is disabled in case of error
    }
  };

  useEffect(() => {
    if (updateBeatRes) {
      if (updateBeatRes.isSuccess) {
        // console.log(screenPlayData);
        const data = {
          name: selectedProject?.name,
          version: selectedProject?.total_versions,
          body: screenPlayData,
        };
        saveScreenPlay(data);
      }
    }
  }, [updateBeatRes, screenPlayData]);

  useEffect(() => {
    if (resSaveScreenPlay) {
      if (resSaveScreenPlay.isSuccess) {
        // popClose();
        setConfirmBit(true);
      }
    }
  }, [resSaveScreenPlay, popClose]);

  // const handleChange = (e) => {
  //   // Remove leading numbers or characters
  //   const cleanedText = e.target.value.replace(/^\d\//, ""); // Remove if the text starts with a number followed by a slash

  //   // Update the state
  //   setEditedText(cleanedText);
  // };

  useEffect(() => {
    const cleanedText = editedText?.replace(/^\d+\.\s*/, "");

    // Update the state only if the cleaned text is different
    if (cleanedText !== editedText) {
      setEditedText(cleanedText);
      // console.log("cleanedText", cleanedText);
    }
  }, [editedText]);

  useEffect(() => {
    if (resInfo.isError || resInfo.isSuccess) {
      setButtonDisable(false);
    }
  }, [resInfo]);
  // console.log(editedText);
  const [addPopup, setAddPopup] = useState(false);

  const inputRef = useRef();
  useEffect(() => {
    if (regardingOutput !== null && inputRef.current) {
      autoResize(inputRef.current);
    }
  }, [regardingOutput]);

  const autoResize = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto"; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
    }
  };

  useEffect(() => {
    const preference = localStorage.getItem("doNotShowBox");
    if (preference) {
      setDoNotShowBox(JSON.parse(preference));
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("doNotShowBox");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleInputChange = (e, key) => {
    // const trimmedValue = e.target.value.trim();
    // console.log(trimmedValue)
    setOptions({ ...options, [key]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setDoNotShowBox(isChecked);
    localStorage.setItem("doNotShowBox", JSON.stringify(isChecked));
  };
  useEffect(() => {
    if (inputRef.current) {
      const textarea = inputRef.current;
      textarea.focus();
      // Move cursor to the end of the text
      textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    }
  }, [regardingOutput]);
  const [translatedPop, setTranslatedPop] = useState(false);

  const [resDisable, setresDisable] = useState(false);

  const handleOpenBeatSheet = () => {
    // console.log("BEat sheet open", id);

    setConfirmBit(false);
    popClose();
    window.open(
      `${URL}/scriptpad2/#/${selectedProject?.pro_uuid}/0x0d2a90b8da670ddad09e2d7b719779a41687515aa196cb35568f20659b204de6/premise`
    );
  };

  return (
    // <div> {projectNotFound ? (
    //   <ProjectNotfound setProjectNotFound={setProjectNotFound}/> // Conditionally render ProjectNotFound component
    // ) :(
    <>
      <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-screen flex  items-center bg-[#252525b0] justify-center z-[999] ">
        {beatSuggestLoading ? (
          <div className="h-auto w-full lg:w-[40%] xl:w-[35%]">
            <TypingLoader />
          </div>
        ) : (
          <div
            className={`${
              !doNotShowBox ? "h-full lg:h-[525px]" : "h-[80%] lg:h-[411px] "
            }
          h-[100vh] lg:mt-0  w-full lg:w-[920px] md:mx-auto bg-[#fff]  lg:bg-[#fadda] md:rounded-[8px] relative    ${
            doNotShowBox ? "h-auto pb-[10px]" : "mb-[20px] pb-[20px]"
          }`}
          >
            <div className="h-[49vh]  md:h-[525px] ">
              <div className="z-10 top-26 ">
                <div
                  className={`rounded-[8px] relative ${
                    isSmallDevice && "overflow-y-scroll pb-12"
                  } lg:w-[920px] mx-auto ${
                    !doNotShowBox
                      ? " h-[calc(100vh-73px)]  lg:h-[525px]"
                      : "h-[80%] lg:h-[411px]"
                  } bg-white lg:bg-[#FAFAFA] ${fromNew ? "mt-0":"mt-20"}   lg:mt-0`}
                >
                  {/* <div
                  className={`rounded-[8px] relative ${
                    isSmallDevice && "overflow-y-scroll pb-12"
                  } lg:w-[920px] mx-auto ${
                    !doNotShowBox
                      ? "h-[90vh] lg:h-[525px]"
                      : "h-[80%] lg:h-[411px]"
                  } bg-white lg:bg-[#FAFAFA] mt-14  lg:mt-0`}
                > */}
                  {!beatPostLoading && (
                    <button
                      className="absolute left-0 md:left-6 top-0 lgHidden"
                      onClick={() => {
                        popClose();
                        commentRefetch();
                      }}
                    >
                      <MdKeyboardBackspace className="text-[#252525] ml-3 text-left text-[32px] cursor-pointer " />
                    </button>
                  )}
                  <div className="relative text-right lgFlxVisible justify-end h-0 ">
                    {!beatPostLoading && (
                      <img
                        src={crossIcon}
                        alt="Close"
                        className="absolute top-[-8px] right-[10px]  md:right-[-10px] w-8 h-8 z-[20] cursor-pointer "
                        onClick={() => {
                          popClose();
                          commentRefetch();
                        }}
                      />
                    )}
                  </div>
                  <div className="pb-[8px] mt-2">
                    <h1 className="text-[14px] leading-4 md:leading-5 md:text-[18px] max-w-[68%] mx-auto font-[500] text-center">
                      Adding a Brainstorm to Beat (event) Sheet
                    </h1>
                  </div>

                  <div className="px-[12px] md:px-[43px] lg:px-[33px] pb-[4px] ">
                    {!doNotShowBox && (
                      <div>
                        {readMore && (
                          <div className="leading-[20px] mt-2">
                            <h5 className="text-[14px] font-[400] pb-[8px]">
                              <span className="pl-[20px] ">A</span> beat
                              describes a moment or event which forwards to
                              story or reveals something significant about the
                              characters or plot. It clearly brings out who does
                              what and defines the outcome of the scene in a
                              clear, impactful, and engaging way to connect the
                              audience with the characters and maintain
                              engagement and coherence in the narrative.
                            </h5>
                            <h5 className="text-[14px] font-[400]">
                              <span className="pl-[20px]">The</span> beat
                              description is in present continuous tense,
                              concise, in active voice, precisely detailing the
                              trigger, subject, actions, settings and emotions.
                              To control the rhythm and pace, Short and long
                              sentences are used to increase tension or provide
                              details or reflection.
                            </h5>
                          </div>
                        )}
                        {!readMore && (
                          <div className="leading-[20px]">
                            <h5 className="text-[14px]  font-[400] pb-[8px]">
                              <span className="pl-[20px]">A</span> beat
                              describes a moment or event which forwards to
                              story or reveals something significant about the
                              characters or plot. It clearly brings out who does
                              what and defines the outcome of the scene in a
                              clear, impactful, and engaging way to connect the
                              audience with the characters and maintain
                              engagement and{" "}
                              <button
                                onClick={() => setReadMore(true)}
                                className="text-[#33B0CA] underline"
                              >
                                Read more
                              </button>
                            </h5>
                          </div>
                        )}
                        <div className="pt-[4px] text-[12px] font-[600] pb-[6px] pl-[11px] flex items-center gap-[10px]">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onChange={handleCheckboxChange}
                          />
                          <span>Do not show this box again</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="text-[12px] md:text-[14px] leading-[18px] font-[600] pb-[13px]">
                        Select and Edit one of the following for adding To Beat
                        Sheet
                      </h3>
                    </div>
                    {!beatSuggestLoading && (
                      <>
                        <div
                          className={`${
                            readMore ? "max-h-[200px]" : " h-[calc(69vh-230px)]"
                          } overflow-y-auto`}
                        >
                          <div className="grid grid-cols-1 gap-y-[8px]">
                            {Object.keys(options).map((key) => (
                              <div
                                key={key}
                                className={`w-full rounded-[6px] px-[16px]  py-[10px]  ${
                                  regardingOutput === key
                                    ? "bg-[#EAEAEA] h-auto"
                                    : "bg-[#F8F8F8] h-auto"
                                } ${
                                  !readMore || doNotShowBox
                                    ? "h-auto"
                                    : "h-auto"
                                }  border flex flex-row gap-[10px] items-start`}
                              >
                                <input
                                  onClick={() => setRegardingOutput(key)}
                                  checked={regardingOutput === key}
                                  type="radio"
                                  name=""
                                  id=""
                                  className="cursor-pointer mt-[7px]"
                                />
                                {regardingOutput === key ? (
                                  <textarea
                                    maxLength={400}
                                    type="text"
                                    // value={cleanUpInput(options[key])}
                                    value={options[key]}
                                    onChange={(e) => {
                                      handleInputChange(e, key);
                                      autoResize(e.target);
                                    }}
                                    className=" outline-none bg-[#EAEAEA] w-full  text-[14px] leading-[25px] h-auto max-h-[90px]  overflow-y-auto  resize-none "
                                    ref={inputRef}
                                    style={{ height: "auto" }}
                                    // onInput={(e) => {
                                    //   e.target.style.height = 'auto';
                                    //   e.target.style.height = `${e.target.scrollHeight}px`;
                                    // }}
                                  />
                                ) : (
                                  <p
                                    className={`w-full  outline-none bg-[#F8F8F8] text-[14px] leading-[20px] ${
                                      !readMore || doNotShowBox
                                        ? "h-auto"
                                        : "h-auto"
                                    }  `}
                                  >
                                    {options[key]}
                                  </p>
                                )}

                                {/* {console.log(options[key])} */}

                                {showKeyboard && regardingOutput === key && (
                                  <Draggable handle=".movable-handle">
                                    <div className="absolute z-20 w-[650px] top-[180px] right-[30px] bg-[#fafafa] border border-[#eaeaea] shadow-lg rounded">
                                      <div className="grid grid-cols-12">
                                        <div className="movable-handle col-span-11 bg-[#f8f8f8] text-[#616161] cursor-move text-center text-[14px] font-[400]">
                                          Drag me!!{" "}
                                          <span className="font-[500]">
                                            {sourcesLanguage}
                                          </span>{" "}
                                          Keyboard
                                        </div>
                                        <div className="flex justify-center items-center w-full h-full cursor-pointer">
                                          <button
                                            onClick={() =>
                                              setShowKeyboard(false)
                                            }
                                            className="font-bold w-full h-full"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      </div>

                                      <div className="p-2">
                                        <KeyboardB
                                          regardingOutput={regardingOutput}
                                          setOptions={setOptions}
                                          inputRef={inputRef}
                                          sourcesLanguage={sourcesLanguage}
                                        />
                                      </div>
                                    </div>
                                  </Draggable>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div
                          className={`flex  justify-end items-center gap-[16px] ${
                            doNotShowBox
                              ? "mt-[20px] mb-[0px] pb-[0px]"
                              : "mt-[23px] md:mt-[20px] mb-[3px] pb-[4px]"
                          } `}
                        >
                          <div className="relative ">
                            <button
                              data-te-toggle="tooltip"
                              title="Translate"
                              className={`cursor-pointer hover:text-[#33B0CA] `}
                              onClick={() => setTranslatedPop(!translatedPop)}
                            >
                              <img
                                src={transIcon}
                                alt=""
                                className="h-[30px]"
                              />
                            </button>

                            {translatedPop && (
                              <>
                                <ul className="absolute bottom-[42px] right-0 z-50 w-[135px] max-h-[27vh] overflow-y-auto border bg-[#fafafa] shadow-md">
                                  {Object.entries(sortedLanguages).map(
                                    ([key, name]) => (
                                      <li
                                        key={key}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOptionChange({
                                            target: { value: key },
                                          });
                                          setTranslatedPop(false);
                                        }}
                                        className={`cursor-pointer text-[14px] text-[#252525] hover:bg-[#33B0CA] hover:text-[#fafafa] list-none pl-[8px] border-b py-1 ${
                                          selectedLanguage === key
                                            ? "bg-[#33B0CA] text-[#fafafa]"
                                            : ""
                                        }`}
                                      >
                                        {name}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </>
                            )}
                            {/* {translatedPop && (
                            <div className="border p-1 rounded-[4px] flex items-center justify-between">
                              <button
                                onClick={() => setTranslatedPop(!translatedPop)}
                              >
                                <img
                                  src={transIcon}
                                  alt=""
                                  className="w-[29px] h-[26px]"
                                />
                              </button>
                              <select
                                value={selectedLanguage}
                                onChange={handleOptionChange}
                                className="bg-[#FAFAFA] border-none w-[106px] text-[14px] text-[#616161] font-[400] focus:outline-none h-7"
                              >
                                {Object.entries(sortedLanguages).map(
                                  ([key, name]) => (
                                    <option key={key} value={key}>
                                      <p className="bg-[#33B0CA]">{name}</p>
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          )} */}
                          </div>
                          {!showKeyboard && (
                            <button
                              data-te-toggle="tooltip"
                              title="Keyboard"
                              className="hidden md:block"
                              onClick={() => setShowKeyboard(!showKeyboard)}
                            >
                              <FaKeyboard className="text-[24px]" />
                            </button>
                          )}
                          {showKeyboard && (
                            <div className=" relative p-1 rounded-[4px] flex items-center justify-between">
                              <button
                                onClick={() => setShowKeyboard(!showKeyboard)}
                              >
                                <FaKeyboard className="w-8" />
                              </button>
                              {/* <select
                                disabled={selectedLanguage}
                                value={sourcesLanguage}
                                onChange={(e) =>
                                  setSourcesLanguage(e.target.value)
                                }
                                className="bg-[#FAFAFA] border-none w-full md:w-[110px] text-[14px] text-[#616161] font-[400] focus:outline-none h-7"
                              >
                                {Object.entries(keyboardOptions)
                                  .sort(([, a], [, b]) => a.localeCompare(b))
                                  .map(([code, name]) => (
                                    <option key={code} value={name}>
                                      {name}
                                    </option>
                                  ))}
                              </select> */}
                              {/* <div className="absolute top-[32px] left-0 z-50 w-[135px]  h-[27vh] overflow-x-hidden md:h-[20vh] overflow-y-auto border bg-[#fafafa]">
                                {Object.entries(keyboardOptions)
                                  ?.sort(([, a], [, b]) => a.localeCompare(b))
                                  ?.map(([code, name]) => (
                                    <li
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSourcesLanguage(name);
                                        setTranslatedPop(null);
                                      }}
                                      className="cursor-pointer  text-[14px] text-[#252525] hover:bg-[#33B0CA] hover:text-[#fafafa] list-none pl-[8px] border-b"
                                      key={code}
                                      value={code}
                                    >
                                      {name}
                                    </li>
                                  ))}
                              </div> */}
                            </div>
                          )}

                          <button
                            disabled={beatPostLoading || transLoading}
                            className={`${
                              beatPostLoading || transLoading
                                ? "bg-[#ACDDE7]"
                                : "bg-[#33B0CA] border-[#33B0CA]"
                            }  text-[#FAFAFA] border  text-[14px] font-[600]  rounded-[8px] min-w-[74px] min-h-[32px] px-[8px] hover:shadow-md shadow-[#252525]  `}
                            onClick={() => handleSubmitBeatToProject()}
                          >
                            Next
                          </button>
                          {projectNotFound && (
                            <ProjectNotfound
                              setProjectNotFound={setProjectNotFound}
                              isProjectLocked={isProjectLocked}
                            /> // Conditionally render the pop-up
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {confirmBit && (
              <ConfirmationModal
                isOpen={confirmBit}
                onClose={() => {
                  setConfirmBit(false);
                  popClose();
                }}
                onConfirm={() => handleOpenBeatSheet()}
                title="Beat added, would you like to open script now?"
                content="Beat added would you like to open script now "
              />
            )}
          </div>
        )}
      </div>
    </>

    // )}
    // </div>
  );
};

export default BeatEditPop;
