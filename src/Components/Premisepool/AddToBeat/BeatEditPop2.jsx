import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaKeyboard } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { toast } from "react-toastify";
import {
  useCreateProjectMutation,
  useGetMyAllProjectQuery,
  useGetScreenPlayMutation,
  useSaveScreenPlayMutation,
  useUpdateSceneMutation,
} from "../../../app/EndPoints/ScriptPad/project";
import {
  useGetPremiseUserQuery,
  useTranslatePremiseMutation,
} from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";
import transIcon from "../../../img/Icons/transIcon.png";
import Loading from "../../../shared/Loading";
import SameNamePop from "../../PremiseV2/Popups/alerts/SameNamePop";
import "../../Premisepool/Premise.css";
import { URL } from "../../utils";
import KeyboardB from "../KeyboardB";
import { keyboardOptions } from "../KeyboardOption";
import { sortedLanguages } from "../Languages";
const BeatEditPop = ({
  popClose,
  commentText,
  data,
  setIsLiked,
  premiseData,
  suggestedBeats,
  isBeatSuggLoading,
  beatSuggestLoading,
}) => {
  const { id, dText, bg_color, bg_img, likes, stylings, source_language } =
    data;
  // console.log("suggestedBeats", isBeatSuggLoading);
  const projectCreateRef = useRef(null);
  const [editedText, setEditedText] = useState(commentText?.text);
  const [modifiedText, setModifiedText] = useState(commentText?.text);
  const [projectData, setProjectData] = useState([]);
  const [confirmBit, setConfirmBit] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [translatePremise, translateInfo] = useTranslatePremiseMutation();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(true);
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
    setOptions(suggestedBeats);
  }, [suggestedBeats]);

  // let modifiedText = editedText
  useEffect(() => {
    let filter1 = editedText?.replace(/^[\d\s]+/, "");
    let filter2 = filter1?.replace(/[!?.,]+/g, "");
    setModifiedText(filter2);
  }, [editedText]);

  // console.log("modifiedText", modifiedText);

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
    if (selectedProject || newProjectName?.length > 0) {
      setButtonDisable(false);
      setAddButtonDisable(true);
    } else {
      setButtonDisable(true);
      setAddButtonDisable(false);
    }
  }, [selectedProject, newProjectName]);

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

  const [alert, setAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const handleCreateProject = async () => {
    const nameExists = ProjectsObj?.projects?.some(
      (item) => item.name === newProjectName
    );
    if (nameExists) {
      setAlert(true);
      setAlertText(
        "A project with the same name already exists. Please choose a different name."
      );
      return;
      //  alert(
      //   "A project with the same name already exists. Please choose a different name."
      // );
    }

    setButtonDisable(true);

    // function to submit new project to script pad
    // ?.filter(item => !item.locked)

    const untitledProjects = ProjectsObj?.projects
      .filter((project) => {
        const words = project.name.split(" ");
        return words[0] === "Untitled";
      })
      .map((project) => project.name);
    let counter = 0;
    // console.log(untitledProjects);

    for (const item of untitledProjects) {
      const match = item.match(/^Untitled (\d+)$/);
      if (match) {
        const number = parseInt(match[1]);
        if (number >= counter) {
          counter = number + 1;
        }
      }
    }

    const fullName = `${userQuery?.first_name} ${userQuery?.last_name}`;

    let authorName;

    if (userQuery?.first_name && userQuery?.last_name) {
      authorName = fullName;
    } else {
      const email = userQuery?.email;
      const modifiedEmail = email.split("@")[0];

      authorName = modifiedEmail;
    }

    const nextUntitled = `Untitled ${counter}`;
    const data = {
      name: newProjectName,
      ownername: authorName,
      language: "en",
      nature_project: premiseData?.nature_of_project,
      duration: premiseData?.minutes,
      service_name: "premisePool",
    };

    const response = await createProject(data);
    if (response) {
      setSelectedProject(response?.data?.projects);
      // console.log(response?.data?.projects);
      refetch();
      setNewProjectName("");
      setNewProjectVisible(false);

      return response.data.projects;
    }

    // popClose();
    // You can access the new project name using the state variable newProjectName
    // console.log("New project name:", newProjectName);
    // Reset the input field and hide it
  };
  const [transLoading, setTransLoading] = useState(false);
  const handleOptionChange = async (e) => {
    setTransLoading(true);
    // console.log(e.target.value);
    setSelectedOption(e.target.value);
    setSelectedLanguage(e.target.value);
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

      setSelectedLanguage("");
      setTransLoading(false);
    } else {
      setTransLoading(false);
    }
  };

  const onClickKeyboard = () => {
    setKeyboardVisible(!keyboardVisible);
    if (selectedLanguage === "") {
      setSelectedLanguage("English");
    }
  };

  // Function to handle the click on "Add New Project" button

  const handleAddNewProjectClick = () => {
    setNewProjectVisible(!isNewProjectVisible);
    setSelectedProject(null);
  };

  const handleSelectProject = (value) => {
    setSelectedProject(value);
    setNewProjectVisible(false);
  };
  const [getScreenPlay, resGetScreenPlay] = useGetScreenPlayMutation();
  const [updateScene, updateBeatRes] = useUpdateSceneMutation();
  const [saveScreenPlay, resSaveScreenPlay] = useSaveScreenPlayMutation();
  const [screenPlayData, setScreenPlayData] = useState();

  const handleSubmitBeatToProject = async () => {
    // console.log("resSaveScreenPlay", resSaveScreenPlay.isSuccess);
    const data = {
      name: selectedProject?.name,
      version: selectedProject?.total_versions,
    };
    const screenPlayResponse = await getScreenPlay(data);
    const screenPlayJson = screenPlayResponse.data?.screenplay_data_json;

    if (Object.keys(screenPlayJson).length !== 0) {
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

      const newArray = [
        ...screenPlayJson,
        newBlankParagraph,
        newSluglineParagraph,
      ];

      setScreenPlayData(newArray);
    } else {
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

      const newArray = [newSluglineParagraph];

      setScreenPlayData(newArray);
    }

    const accessToken = localStorage.getItem("accessToken");
    const screenPlayResId = screenPlayResponse.data.screenplay.screenplay_uuid;
    const options = {
      url: `${URL}/scriptpad2/update-scene/${screenPlayResId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",

        // Add any other headers if needed
      },
    };
    return axios(options)
      .then((response) => {
        if (response) {
          let existingBeatData = response.data.data;
          const beatAddData = {
            beat: modifiedText,
            script: screenPlayResId,
            scene_number: existingBeatData.length + 1,
          };
          updateScene(beatAddData);
          toast.success("Beat successfully added to your scene", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 800,
          });
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (updateBeatRes) {
      if (updateBeatRes.isSuccess) {
        // console.log(screenPlayData);
        const data = {
          name: selectedProject.name,
          version: selectedProject.total_versions,
          body: screenPlayData,
        };
        saveScreenPlay(data);
      }
    }
  }, [updateBeatRes, screenPlayData]);

  useEffect(() => {
    if (resSaveScreenPlay) {
      if (resSaveScreenPlay.isSuccess) {
        popClose();
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

  return (
    <>
      {confirmBit ? (
        <div className="fixed top-0 left-0 w-full h-full flex  items-center bg-[#252525b0] justify-center z-[1]  ">
          <div className="h-[520px] md:h-[620px] w-[439px] md:mx-auto">
            <div className="w-full max-w-[1165px] max-h-[539px] pt-[63px] sm:pt-[30px]  relative">
              {/* close popup */}
              <div className="text-right flex justify-end h-0 ">
                <img
                  src={crossIcon}
                  alt=""
                  className="text-red-500 w-8 h-8 top-[22px] sm:top-[31px] md:top-[93px] xl:top-[31px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px] absolute z-[1] m-1 cursor-pointer"
                  onClick={() => popClose()}
                />
              </div>

              {/* container for projects */}
              {/* container for projects */}
              <div className="bg-[#FAFAFA] h-[78vh] md:h-[501px] sm:rounded-[8px]">
                <div className="mt-[16px] md:mt-[78px] xl:mt-[16px]   w-[353.86px] mx-auto">
                  <p className="text-[16px] py-[16px]  px-[12px] font-[500] text-[#252525] ">
                    Select Project
                  </p>
                  <div className="h-[1px] w-[353px] bg-[#616161] mx-auto" />
                </div>

                <div
                  className={`${
                    isNewProjectVisible
                      ? "h-[51vh] md:h-[325px] "
                      : "h-[56vh] md:h-[347px] lg:h-[359px]"
                  }  overflow-y-auto premiseScroll`}
                >
                  {isProjectLoading ? (
                    <Loading />
                  ) : (
                    <>
                      {projectData &&
                        projectData?.map((project, index) => (
                          <div key={project.pro_uuid + index} className="">
                            <p
                              onClick={() => {
                                handleSelectProject(project);
                              }}
                              className={`text-[14px] cursor-pointer font-[500] w-[353.86px] mx-auto px-[12px] my-[6px] py-[5px] rounded-[8px] hover:text-[#fafafa] hover:bg-[#33B0CA] ${
                                project?.pro_uuid === selectedProject?.pro_uuid
                                  ? "bg-[#33B0CA] text-[#fafafa]"
                                  : ""
                              }`}
                            >
                              {project.name}
                            </p>
                            <div className="h-[1px] w-full max-w-[353px] bg-[#EAEAEA] mx-auto" />
                          </div>
                        ))}
                    </>
                  )}
                </div>
                <div>
                  {/* Input field for adding a new project */}
                  {isNewProjectVisible && (
                    <div className="w-[90%] max-w-[358px] mx-auto ">
                      {resInfo?.isLoading ? (
                        <span className="loading loading-spinner text-[#33B0CA]  w-7 my-auto cursor-auto"></span>
                      ) : (
                        <input
                          ref={projectCreateRef}
                          type="text"
                          value={newProjectName}
                          maxLength={30}
                          onBlur={() => {
                            setNewProjectVisible(false);
                          }}
                          onChange={(e) => {
                            if (e.target.value.length === 30) {
                              // alert("Maximum 30 characters are allowed");
                              setAlertText(`Maximum 30 characters are allowed`);
                              setAlert(true);
                              return;
                            }
                            setNewProjectName(e.target.value);
                          }}
                          placeholder="Enter new project name"
                          className=" rounded-[8px] w-full px-[12px] bg-[#EAEAEA] font-[500] text-[14px]  h-[35.34px] focus:outline-none"
                        />
                      )}
                    </div>
                  )}
                </div>
                {/* <div className="h-[1px] w-[332px] bg-[#616161] mx-auto" /> */}
                {/* <div className="flex gap-[26px] absolute bottom-[30px] right-[30px]"> */}
                <div
                  className={`flex justify-end w-[90%] max-w-[358px] mt-[4px]  mx-auto gap-[26px] 
                    "
                  `}
                >
                  {!isNewProjectVisible && (
                    <button
                      // disabled={addButtonDisable}
                      onClick={() => {
                        handleAddNewProjectClick();
                      }}
                      className={`
                    bg-[#fafafa] flex items-center justify-center text-[#33B0CA] border !border-[#33b0ca] text-[14px] font-[600]  rounded-[8px] min-w-[170px] min-h-[32px] px-[8px] hover:shadow-md shadow-[#252525]
                  hover:bg-[#33b0ca] hover:text-[#fafafa]
                    
                    `}
                    >
                      <span className="mr-[8px] text-2xl focus:outline-none">
                        {" "}
                        +{" "}
                      </span>{" "}
                      Add New Project
                    </button>
                  )}

                  {selectedProject ? (
                    resGetScreenPlay?.isLoading ? (
                      <div className="w-[74px]">
                        <span className="loading loading-spinner text-[#33B0CA] h-5 w-5 my-auto cursor-auto" />
                      </div>
                    ) : (
                      <button
                        onClick={handleSubmitBeatToProject}
                        className="bg-[#33B0CA] text-[#FAFAFA] border  text-[14px] font-[600]  rounded-[8px] w-[74px] min-h-[32px] hover:shadow-md shadow-[#252525] hover:bg-[#33B0CA] hover:text-[#FAFAFA]"
                      >
                        Next
                      </button>
                    )
                  ) : (
                    <button
                      onClick={handleCreateProject}
                      className={`${
                        buttonDisable
                          ? "bg-[#ACDDE7] text-[#FAFAFA] border-none cursor-auto"
                          : "bg-[#33B0CA]"
                      } bg-[#33B0CA] text-[#FAFAFA]  border border-[#33B0CA] text-[14px] font-[600]  rounded-[8px] min-w-[74px] min-h-[32px] px-[8px] hover:shadow-md shadow-[#252525]  `}
                      disabled={buttonDisable}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed top-0 left-0 w-full h-full flex mt-[71px] xl:mt-[80px] lg:mt-[0px] items-center bg-[#252525b0] justify-center z-[1]  ">
          <div
            className={`${
              !doNotShowBox ? "h-full md:h-[505px]" : "h-[80%] md:h-[411px]"
            }
                  h-[100vh] md:mt-[88px] xl:mt-[-40px]  w-full lg:w-[920px] md:mx-auto bg-[#fff]  lg:bg-[#fadda] md:rounded-[8px] relative`}
          >
            <div className="h-[49vh]  md:h-[505px] ">
              <div className="z-10 top-26">
                <div
                  className={`rounded-[8px] relative ${
                    isSmallDevice && "overflow-y-scroll"
                  } md:w-[920px] mx-auto ${
                    !doNotShowBox
                      ? "h-full md:h-[505px]"
                      : "h-[80%] md:h-[411px]"
                  } bg-white md:bg-[#FAFAFA]`}
                >
                  <button
                    className="absolute left-0 top-0 md:hidden "
                    onClick={() => popClose(false)}
                  >
                    <IoIosArrowRoundBack className="text-[50px] text-[#33B0CA]" />
                  </button>
                  <div className="text-right hidden md:flex justify-end h-0 ">
                    <img
                      src={crossIcon}
                      alt=""
                      className="text-red-500 w-8 h-8 top-[22px] sm:top-[-16px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px] absolute z-[1] m-1 cursor-pointer"
                      onClick={() => popClose()}
                    />
                  </div>
                  <div className="pb-[8px] mt-[8px]">
                    <h1 className="text-[14px] md:text-[18px] font-[500] text-center">
                      Adding a Brainstorm to Beat Sheet
                    </h1>
                  </div>
                  <div className="px-[12px] md:px-[33px] pb-[4p]">
                    {!doNotShowBox && (
                      <div>
                        {readMore && (
                          <div className="leading-[20px]">
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
                    {beatSuggestLoading ? (
                      <div className="h-[59px]">
                        <Loading />
                      </div>
                    ) : (
                      <div>
                        {Object?.keys(options).map((key) => (
                          <div
                            key={key}
                            className={`w-full md:w-[853px] mb-[8px] rounded-[6px] px-[16px] py-[10px] ${
                              regardingOutput === key
                                ? "bg-[#EAEAEA] h-[65px]"
                                : "bg-[#F8F8F8]"
                            } ${
                              !readMore || doNotShowBox
                                ? "h-[53px]"
                                : "h-[42px]"
                            }  border flex items-center gap-[10px]`}
                          >
                            <input
                              onClick={() => setRegardingOutput(key)}
                              checked={regardingOutput === key}
                              type="radio"
                              name=""
                              id=""
                              className=""
                            />
                            {regardingOutput === key ? (
                              <textarea
                                maxLength={400}
                                type="text"
                                value={options[key]}
                                onChange={(e) => handleInputChange(e, key)}
                                className="focus:resize-none outline-none bg-[#EAEAEA] w-full  text-[14px] leading-[20px]"
                                ref={inputRef}
                              />
                            ) : (
                              <p
                                className={`w-full  outline-none bg-[#F8F8F8] text-[14px] leading-[18px] ${
                                  !readMore || doNotShowBox
                                    ? "h-[48px]"
                                    : "h-[38px]"
                                } overflow-y-auto`}
                              >
                                {options[key]}
                              </p>
                            )}

                            {showKeyboard && regardingOutput === key && (
                              <Draggable handle=".movable-handle">
                                <div className="absolute z-20 w-[650px] top-[400px] right-[30px] bg-white border border-gray-300 shadow-lg rounded">
                                  <div className="grid grid-cols-12">
                                    <div className="movable-handle col-span-11 bg-[#EAEAEA] text-[#616161]">
                                      Drag me!! {sourcesLanguage} Language
                                      Keyboard Show
                                    </div>
                                    <div className="flex justify-center items-center w-full h-full cursor-pointer">
                                      <button
                                        onClick={() => setShowKeyboard(false)}
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
                    )}
                    <div
                      className={`flex justify-end items-center gap-[16px] ${
                        doNotShowBox
                          ? "mt-[45px]"
                          : "mt-[8px] md:mt-[20px] mb-[3px]"
                      } `}
                    >
                      <div>
                        {!translatedPop && (
                          <button
                            className={` cursor-pointer hover:text-[#33B0CA] `}
                            onClick={() => setTranslatedPop(!translatedPop)}
                          >
                            <img src={transIcon} alt="" />
                          </button>
                        )}
                      </div>

                      {translatedPop && (
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
                        // <div className="border p-1 rounded-[4px] flex items-center justify-between h-[32px]">
                        //   <button
                        //     className={` cursor-pointer hover:text-[#33B0CA] `}
                        //     onClick={() => setTranslatedPop(!translatedPop)}
                        //   >
                        //     <img
                        //       src={transIcon}
                        //       alt=""
                        //       className="w-[32px] h-[30px]"
                        //     />
                        //   </button>
                        //   <TranslateDrop
                        //     source_language={source_language}
                        //     selectedOption={selectedOption}
                        //     setSelectedOption={setSelectedOption}
                        //     loading={translateInfo.isLoading}
                        //     handleOptionChange={handleOptionChange}
                        //   />
                        // </div>
                      )}
                      {!showKeyboard && (
                        <button
                          className="hidden md:block"
                          onClick={() => setShowKeyboard(!showKeyboard)}
                        >
                          <FaKeyboard className="text-[24px]" />
                        </button>
                      )}
                      {showKeyboard && (
                        <div className="border p-1 rounded-[4px] flex items-center justify-between">
                          <button
                            onClick={() => setShowKeyboard(!showKeyboard)}
                          >
                            <FaKeyboard />
                          </button>
                          <select
                            value={sourcesLanguage}
                            onChange={(e) => setSourcesLanguage(e.target.value)}
                            className="bg-[#FAFAFA] border-none w-full md:w-[110px] text-[14px] text-[#616161] font-[400] focus:outline-none h-7"
                          >
                            {Object.entries(keyboardOptions)
                              .sort(([, a], [, b]) => a.localeCompare(b))
                              .map(([code, name]) => (
                                <option key={code} value={name}>
                                  {name}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                      <button
                        className="bg-[#33B0CA] text-[#FAFAFA] border border-[#33B0CA] text-[14px] font-[600]  rounded-[8px] min-w-[74px] min-h-[32px] px-[8px] hover:shadow-md shadow-[#252525] hover:bg-[#33B0CA] "
                        onClick={() => setConfirmBit(true)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {alert && <SameNamePop popClose={setAlert} title={alertText} />}
    </>
  );
};

export default BeatEditPop;
