import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaKeyboard } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  useSaveCharactersMutation,
  useSuggestCharactersMutation,
} from "../../../app/EndPoints/Characters/Characters";
import { getLanguageName } from "../../PremiseV2/utilityFuncitons/functions";
import AutoSizeTextArea from "./AutosizeTextArea";
import CharacterKeyboard from "./CharacterKeyboard";
import { genderJson } from "./Gender";
import { inanimateObject } from "./inanimateObject";

const SingleCharacterAddNewTab = ({
  setCharacterEditPop,
  characterArray,
  currentProjectData,
  setCharacterArray,
  onlyAdd,
  handleUpdateSavedChar,
  characterLoading,
  project_id,
  source_language,
  characterRefetch,
  setAddNewCharacter,
}) => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [background, setBackGround] = useState("");
  const [personality, setPersonality] = useState("");
  const [individualWant, setIndividualWant] = useState("");
  const [characterjourney, setCharacterjourney] = useState("");
  const [bloodrelationship, setBloodrelationship] = useState("");
  const [familyrelationship, setFamilyrelationship] = useState("");
  const [professionalrelationship, setProfessionalrelationship] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [focusedFieldName, setFocusedFieldName] = useState("");
  // New state to track if all fields are filled
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const occupationRef = useRef(null);
  const characterNameRef = useRef(null);
  const otherRoleRef = useRef(null);
  const backgroundRef = useRef(null);
  const personalityRef = useRef(null);
  const individualWantRef = useRef(null);
  const characterJourneyRef = useRef(null);
  const bloodRelationshipRef = useRef(null);
  const familyRelationshipRef = useRef(null);
  const professionalRelationshipRef = useRef(null);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);

  const [suggestCharacters, updatePostPremiseResInfo] =
    useSuggestCharactersMutation();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const sourceLanguageName = getLanguageName(source_language);

  useEffect(() => {
    let isAgeValid;
    if (
      gender === "Inanimate Object" ||
      inanimateObjectOptions(sourceLanguageName)
    ) {
      isAgeValid = true;
    } else {
      isAgeValid = age;
    }
    const isFormComplete = role && name && occupation && gender && isAgeValid;
    setIsSaveDisabled(!isFormComplete);
  }, [
    role,
    age,
    occupation,
    name,
    gender,
    background,
    personality,
    individualWant,
    characterjourney,
    bloodrelationship,
    familyrelationship,
    professionalrelationship,
    customRole,
  ]);

  const handleAddClick = async (e) => {
    e.preventDefault();
    setIsSaveLoading(true);
    const assignedRole = role === "Others" ? customRole : role;

    const newCharacter = {
      role: assignedRole,
      name,
      age,
      occupation,
      gender,
      background,
      personality,
      is_ai_generated: false,
      individual_want: individualWant,
      character_journey: characterjourney,
      blood_relationship: bloodrelationship,
      family_relationship: familyrelationship,
      professional_relationship: professionalrelationship,
    };

    const updatedCharacters = [...characterArray, newCharacter];
    const charArr = JSON.stringify(updatedCharacters);
    const data = {
      // id: premiseID,
      id: project_id,
      body: { char_data: charArr },
    };

    const response = await saveCharacter(data);
    if (response) {
      characterRefetch();
      setAddNewCharacter(null);
      setIsSaveLoading(false);
    } else {
      setIsSaveLoading(true);
    }

    // console.log(response, "response");
    // If this function returns a promise, await it
    // await handleAddNewCharacter(newCharacter);
    // handleUpdateSavedChar();

    // Reset all states
    setRole("");
    setName("");
    setAge("");
    setOccupation("");
    setGender("");
    setBackGround("");
    setPersonality("");
    setIndividualWant("");
    setCharacterjourney("");
    setBloodrelationship("");
    setFamilyrelationship("");
    setProfessionalrelationship("");
    setCustomRole("");
    // setAddNewCharacter(false);

    // Now safely call this after everything is done
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (/^(?!0$)(?!0\d)\d*$/.test(value)) {
      setAge(value);
    }
  };

  // const handleInputChange = (e, setValue) => {
  //   console.log(e);
  //   let value = e.target.value;
  //   if (typeof value !== "string") return;

  //   if (value.length === 0) {
  //     setValue("");
  //     return;
  //   }

  //   if (value.length === 1) {
  //     const firstChar = value.replace(/[^a-zA-Z0-9]/, "");
  //     setValue(firstChar);
  //   } else {
  //     const firstChar = value[0].replace(/[^a-zA-Z0-9]/, "");
  //     const restOfValue = value.slice(1);
  //     setValue(firstChar + restOfValue);
  //   }
  // };
  const handleInputChange = (e, setValue) => {
    const value = e.target.value.trimStart().replace(/\s{2,}/g, " ");
    setValue(value);
  };
  useEffect(() => {
    AutoSizeTextArea(occupationRef.current, background);
    AutoSizeTextArea(backgroundRef.current, background);
    AutoSizeTextArea(personalityRef.current, personality);
    AutoSizeTextArea(individualWantRef.current, individualWant);
    AutoSizeTextArea(characterJourneyRef.current, characterjourney);
    AutoSizeTextArea(bloodRelationshipRef.current, bloodrelationship);
    AutoSizeTextArea(familyRelationshipRef.current, familyrelationship);
    AutoSizeTextArea(
      professionalRelationshipRef.current,
      professionalrelationship
    );
  }, [
    occupation,
    background,
    personality,
    individualWant,
    characterjourney,
    bloodrelationship,
    familyrelationship,
    professionalrelationship,
  ]);

  const roleOptions = [
    "Protagonist",
    "Antagonist",
    "Narrator",
    "Co-Star",

    "Mediator",
    "Confidant",
    "Love Interest",
    "Antagonist's Right Hand",
    "Foil",
    "Mentor",
    "Comic Relief",
    "Rival",
    "Sidekick",
    "Symbolic Character",
    "Suspect",
    "Family Member",
    "Instigator",
    "Authority Figure",
    "Activist",
    "Peer",
    "Seeker ",
    "Guardian",
    "Supporting Character",
    "Expert",
    "Arbiter",
    "Others",
  ];

  const filteredRoleOptions = roleOptions.filter(
    (roleOption) => !characterArray.some((char) => char.role === roleOption)
  );
  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();

  // console.log("characterArray", characterArray);

  const handleSuggest = async (e) => {
    e.preventDefault();
    const assignedRole = role === "Others" ? customRole : role;
    const newCharacter = {
      role: assignedRole,
      name,
      age,
      occupation,
      gender,
      language: source_language,
    };
    try {
      setDisabled(true);
      const res = await suggestCharacters(newCharacter);
      if (res) {
        // setDisabled(false);
        const suggestedData = res?.data?.data;
        setBackGround(suggestedData?.Background);
        setPersonality(suggestedData?.Personality);
        setIndividualWant(suggestedData?.Individual_want);
        setCharacterjourney(suggestedData?.Character_journey);
        setBloodrelationship(suggestedData?.Blood_relationship);
        setFamilyrelationship(suggestedData?.Family_relationship);
        setProfessionalrelationship(suggestedData?.Professional_relationship);
      }
    } catch (error) {
      setDisabled(false);
      console.error("Error fetching character suggestion:", error);
    }
  };

  const onClickKeyboard = () => {
    if (selectedLanguage === "") {
      setSelectedLanguage("English");
    }
    setKeyboardVisible(!keyboardVisible);
  };

  const getGenderOptions = (language) => {
    if (genderJson[language]) {
      return Object.keys(genderJson[language]).map((key) => (
        <option
          key={key}
          value={genderJson[language][key]}
          className="text-[14px]"
        >
          {genderJson[language][key]}
        </option>
      ));
    }
    return [];
  };
  const inanimateObjectOptions = (language) => {
    if (inanimateObject[language]) {
      return Object.values(inanimateObject[language])[0]; // Get the first value
    }
    return null; // Return null if no value is found
  };
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-screen flex items-center bg-[#252525b0] justify-center z-[21] ">
      {/* <div className="fixed inset-0 bg-black opacity-50"></div> */}
      <div className="relative bg-[#FAFAFA] py-[20px] px-[8px] rounded-lg shadow-lg w-full md:max-w-[479px] md:mt-12 h-[490px]">
        <div className=" w-full h-10 sticky">
          <h3 className="text-center md:mb-[20px] font-[500]">
            <span className="text-[18px] text-center md:text-[14px]">
              Add Character
            </span>
          </h3>
        </div>
        <div className="h-[calc(100%-60px)] pt-4 pb-10 w-full overflow-auto">
          <div>
            <div>
              <div className="absolute top-[20px] right-[0px] z-10">
                <div className="text-[14px] mb-[-15px] hidden text-[#616161] w-full outline-[#EAEAEA] md:flex justify-center items-center">
                  <button
                    onClick={onClickKeyboard}
                    className={` w-full h-[32px] md:h-[30px] flex justify-between gap-10 px-5 items-center rounded-[6px]`}
                  >
                    <FaKeyboard
                      data-te-toggle="tooltip"
                      title={`${
                        source_language
                          ? `${sourceLanguageName} Keyboard`
                          : "Select Keyboard"
                      }`}
                      className={`w-7 h-7 ${
                        keyboardVisible && "text-[#33B0CA]"
                      } cursor-pointer hover:text-[#33B0CA] w-full `}
                    />
                  </button>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleAddClick}
              className="w-[90%] md:w-[398px] mx-auto"
            >
              <div className="block mb-[10px] md:mb-[20px] md:flex gap-[18px] ">
                {/* <div className="relative w-full md:w-[171px]">
                  <label
                    className={`absolute left-2 top-[1px] lg:top-[-10px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500]  transition-all z-[2]
                     `}
                  >
                    Role
                  </label>
                  <select
                    required
                    onChange={(e) => setRole(e.target.value)}
                    value={role}
                    className=" text-[14px] bg-[#FAFAFA] border-[2px] text-[#616161] outline-[#EAEAEA]  rounded-[8px] my-[12px] md:my-0   w-full md:w-[171px] h-[42px]  indent-1 "
                  >
                    <option className="text-[14px]" value="" selected disabled>
                      Role
                    </option>
                    {filteredRoleOptions?.map((roleOption) => (
                      <option
                        key={roleOption}
                        value={roleOption}
                        className="bg-white text-[#252525] text-[14px] "
                      >
                        {roleOption}
                      </option>
                    ))}
                  </select>
                </div> */}
                <div className="relative w-full md:w-[171px]">
                  <label className="absolute left-2 top-[1px] lg:top-[-10px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all z-[2]">
                    Role
                  </label>

                  <button
                    type="button"
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="text-left text-[14px] bg-[#FAFAFA] border-[2px] text-[#616161] outline-[#EAEAEA] rounded-[8px] my-[12px] md:my-0 w-full md:w-[171px] h-[42px] indent-1 pl-2 leading-[18px] pt-[6px]"
                  >
                    {role || "Role"}
                  </button>

                  {roleDropdownOpen && (
                    <ul className="absolute z-10  w-full border bg-[#fafafa] max-h-[27vh] overflow-y-auto rounded-md shadow-sm">
                      {filteredRoleOptions?.map((roleOption) => (
                        <li
                          key={roleOption}
                          className="cursor-pointer text-[14px]  leading-[18px]   text-[#252525] hover:bg-[#33B0CA] hover:text-[#fafafa] px-2 py-1 "
                          onClick={() => {
                            setRole(roleOption);
                            setRoleDropdownOpen(false);
                          }}
                        >
                          {roleOption}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="absolute  inset-y-5  md:inset-y-2 right-[2px] bg-[#fafafa] flex items-center px-2 pointer-events-none">
                    {roleDropdownOpen ? (
                      <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[15px]" />
                    ) : (
                      <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                    )}
                  </div>
                </div>

                <div className="relative w-full mt-[4px] md:mt-0  md:w-[171px]">
                  <label
                    className={`absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all `}
                  >
                    Name
                  </label>

                  <input
                    autoComplete="off"
                    value={name}
                    ref={characterNameRef}
                    required
                    onChange={(e) => handleInputChange(e, setName)}
                    onFocus={() => setFocusedFieldName("name")}
                    type="text"
                    name="name"
                    maxLength={50}
                    translate="no"
                    placeholder="Name"
                    className="text-[14px] text-[#33B0CA] bg-[#FAFAFA] px-3 py-[12px] outline-[#EAEAEA]  rounded-[8px] border-2  border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none  w-full md:w-[208px] h-[42px]"
                  />
                </div>
              </div>
              <div>
                {role === "Others" && (
                  <div className="relative w-full mt-[4px] md:mt-0  md:w-[171px]">
                    <label
                      className={`absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all `}
                    >
                      Others
                    </label>
                    <input
                      ref={otherRoleRef}
                      autoComplete="off"
                      value={customRole}
                      required
                      onChange={(e) => setCustomRole(e.target.value)}
                      onFocus={() => setFocusedFieldName("Others")}
                      type="text"
                      maxLength={50}
                      placeholder="Describe the role"
                      className="text-[14px] bg-[#FAFAFA] px-3 py-[12px] outline-[#EAEAEA]  mt-[5px] mb-[15px] rounded-[8px] border-2  border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none  w-full md:w-[398px] h-[42px]   text-[#616161] "
                    />
                  </div>
                )}
              </div>
              <div className="block mb-0 md:mb-[10px] md:flex gap-[14px]">
                <div
                  className={`relative w-full ${
                    gender === inanimateObjectOptions(sourceLanguageName)
                      ? "md:w-[155px]"
                      : "md:w-[97px]"
                  }`}
                >
                  <label className="absolute left-2 top-[0px] md:top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Gender
                  </label>

                  <button
                    type="button"
                    onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                    className={`text-left px-2 text-[14px] bg-[#FAFAFA] border-[2px] text-[#616161] outline-[#EAEAEA] rounded-[8px] mb-[22px] mt-[12px] md:my-0 h-[41px] w-full indent-1 ${
                      gender === inanimateObjectOptions(sourceLanguageName)
                        ? "md:w-[172px]"
                        : "md:w-[97px]"
                    }`}
                  >
                    {gender || "Gender"}
                    <div className="absolute inset-y-5  md:inset-y-2 right-[2px] bg-[#fafafa] flex items-center h-[25px] px-2 pointer-events-none">
                      {genderDropdownOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[15px] " />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px] " />
                      )}
                    </div>
                  </button>

                  {genderDropdownOpen && (
                    <ul className="absolute z-10 mt-0 w-full border bg-[#fafafa] max-h-[27vh] md:max-h-[20vh] overflow-y-auto rounded-md shadow-sm">
                      {getGenderOptions(sourceLanguageName).map(
                        (option, index) => (
                          <li
                            key={index}
                            className="cursor-pointer text-[14px] leading-5 text-[#252525] hover:bg-[#33B0CA] hover:text-[#fafafa] px-2 py-2"
                            onClick={() => {
                              setGender(option.props.value); // `option` is a JSX element, like <option value="Male">Male</option>
                              setGenderDropdownOpen(false);
                            }}
                          >
                            {option.props.children}
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
                {gender !== inanimateObjectOptions(sourceLanguageName) && (
                  <div className="relative w-full  md:w-[49px] ">
                    <label className="absolute left-2 top-[-12px] z-[2] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={handleAgeChange}
                      id="protaAge"
                      min="1"
                      maxLength={5}
                      className={`h-[41px] w-full  md:ml-0 relative text-[12px] md:!text-[14px] leading-tight  px-[8px] mb-[24px] md:mb-[15px] md:w-[64px] bg-[#fafafa] rounded-[8px] border-[2px] focus:outline-none   text-[#616161] `}
                      placeholder="age"
                      required
                    />
                  </div>
                )}
                <div className="relative w-full md:w-[206px] md:left-5 ">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Occupation
                  </label>
                  <textarea
                    autoComplete="off"
                    onFocus={() => setFocusedFieldName("occupation")}
                    required
                    onChange={(e) => handleInputChange(e, setOccupation)}
                    value={occupation}
                    ref={occupationRef}
                    type="text"
                    maxLength={50}
                    name="occupation"
                    translate="no"
                    placeholder="occupation"
                    className="text-[14px] bg-[#FAFAFA] mb-[18px]  leading-[20px] md:mb-0 px-3 pt-[8px] pb-[12px] outline-[#EAEAEA]  rounded-[8px] border-2   border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none w-full md:w-[208px] h-[42px]     text-[#616161] resize-none overflow-hidden break-words
                    "
                  />
                </div>
              </div>
              <div className="mb-[20px] flex justify-end gap-1">
                <button
                  disabled={isSaveDisabled || disabled}
                  onClick={handleSuggest}
                  className={`${
                    isSaveDisabled || disabled
                      ? "bg-[#ACDDE7]  "
                      : "bg-[#33B0CA] "
                  } text-white text-[14px] font-[700] md:h-[32px] rounded-[8px] px-3 `}
                >
                  Suggest the following
                </button>
              </div>
              <div className="mb-[20px]">
                <div className="relative w-full md:w-[171px]">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Background
                  </label>
                  <textarea
                    autoComplete="off"
                    required
                    onChange={(e) => handleInputChange(e, setBackGround)}
                    value={background}
                    onFocus={() => setFocusedFieldName("background")}
                    type="text"
                    ref={backgroundRef}
                    maxLength={300}
                    name="background"
                    translate="no"
                    placeholder="Background"
                    className={`text-[14px] bg-[#FAFAFA]   text-[#616161] px-3 pt-[8px] pb-[12px] leading-[17px] outline-[#EAEAEA]  rounded-[8px] overflow-y-hidden border-2  border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none  w-full md:w-[398px]
                    h-[44px] resize-none `}
                  />
                </div>
              </div>
              <div className="mb-[20px]">
                <div className="relative w-full md:w-[171px]">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Personality
                  </label>
                  <textarea
                    onChange={(e) => handleInputChange(e, setPersonality)}
                    value={personality}
                    autoComplete="off"
                    onFocus={() => setFocusedFieldName("personality")}
                    required
                    type="text"
                    maxLength={300}
                    name="personality"
                    ref={personalityRef}
                    translate="no"
                    placeholder="Personality"
                    className="text-[14px] bg-[#FAFAFA]  px-3 pt-[8px] pb-[12px] leading-[20px] outline-[#EAEAEA]  overflow-y-hidden rounded-[8px] border-2  border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none w-full md:w-[398px] h-[44px] resize-none   text-[#616161]"
                  />
                </div>
              </div>

              <div className="mb-[20px]">
                <div className="relative w-full md:w-[171px]">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Individual&nbsp;want
                  </label>
                  <textarea
                    onChange={(e) => handleInputChange(e, setIndividualWant)}
                    value={individualWant}
                    onFocus={() => setFocusedFieldName("individualWant")}
                    ref={individualWantRef}
                    autoComplete="off"
                    required
                    type="text"
                    maxLength={300}
                    name="individualwant"
                    translate="no"
                    placeholder="Individual want"
                    className="text-[14px] bg-[#FAFAFA]  px-3 pt-[8px] pb-[12px] leading-[20px] outline-[#EAEAEA]  overflow-y-hidden rounded-[8px] border-2  border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none w-full md:w-[398px] h-[44px] resize-none   text-[#616161] "
                  />
                </div>
              </div>
              <div className="mb-[20px]">
                <div className="relative w-full md:w-[171px]">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Character's&nbsp;journey
                  </label>
                  <textarea
                    onChange={(e) => handleInputChange(e, setCharacterjourney)}
                    value={characterjourney}
                    onFocus={() => setFocusedFieldName("characterJourney")}
                    ref={characterJourneyRef}
                    autoComplete="off"
                    required
                    type="text"
                    maxLength={300}
                    name="characterjourney"
                    translate="no"
                    placeholder="Character's journey"
                    className="text-[14px] bg-[#FAFAFA] px-3 pt-[8px] pb-[12px] leading-[17px] outline-[#EAEAEA]  rounded-[8px] border-2 overflow-y-hidden border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none  w-full md:w-[398px] h-[44px] resize-none    text-[#616161]  "
                  />
                </div>
              </div>
              <div className="mb-[20px]">
                <div className="relative w-full md:w-[171px]">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Blood&nbsp;relationship
                  </label>
                  <textarea
                    onChange={(e) => handleInputChange(e, setBloodrelationship)}
                    value={bloodrelationship}
                    onFocus={() => setFocusedFieldName("bloodRelationship")}
                    ref={bloodRelationshipRef}
                    autoComplete="off"
                    required
                    type="text"
                    maxLength={300}
                    name="Blood_relationship"
                    translate="no"
                    placeholder="Blood relationship"
                    className="text-[14px] bg-[#FAFAFA] px-3 pt-[8px] pb-[12px] leading-[17px] outline-[#EAEAEA] overflow-y-hidden rounded-[8px] border-2 border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none w-full md:w-[398px] h-[44px] resize-none   text-[#616161] "
                  />
                </div>
              </div>
              <div className="mb-[20px]">
                <div className="relative w-full md:w-[171px] mt-6">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Family&nbsp;relationship
                  </label>
                  <textarea
                    onChange={(e) =>
                      handleInputChange(e, setFamilyrelationship)
                    }
                    value={familyrelationship}
                    onFocus={() => setFocusedFieldName("familyRelationship")}
                    ref={familyRelationshipRef}
                    autoComplete="off"
                    required
                    type="text"
                    maxLength={300}
                    name="Family_relationship"
                    translate="no"
                    placeholder="Family relationship"
                    className="text-[14px] bg-[#FAFAFA] px-3 pt-[8px] pb-[12px] leading-[17px] outline-[#EAEAEA] overflow-y-hidden rounded-[8px] border-2  border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none w-full md:w-[398px] h-[44px] resize-none   text-[#616161]"
                  />
                </div>
              </div>
              <div className="mb-[12px]">
                <div className="relative w-full md:w-[171px]">
                  <label
                    htmlFor="professional_relationship_input"
                    className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all"
                  >
                    Professional&nbsp;relationship
                  </label>
                  <textarea
                    onChange={(e) =>
                      handleInputChange(e, setProfessionalrelationship)
                    }
                    value={professionalrelationship}
                    onFocus={() =>
                      setFocusedFieldName("professionalRelationship")
                    }
                    ref={professionalRelationshipRef}
                    autoComplete="off"
                    required
                    type="text"
                    maxLength={300}
                    name="Professional_relationship"
                    translate="no"
                    placeholder="Professional relationship"
                    className="text-[14px] bg-[#FAFAFA] px-3 pt-[8px] pb-[12px] leading-[17px] outline-[#EAEAEA] overflow-y-hidden rounded-[8px] border-2  border-[#EAEAEA]  focus:border-[#33b0ca] focus:outline-none w-full md:w-[398px] h-[44px] resize-none      text-[#616161]"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-[#FAFAFA] py-4 px-8 flex justify-end gap-[18px] rounded-[8px]">
          <button
            onClick={() => setAddNewCharacter(null)}
            className="bg-[#fafafa] flex items-center gap-[14px] justify-center text-[14px] text-[#33B0CA] border border-[#33B0CA]  h-[32px] rounded-[8px] py-[4px] px-3 "
          >
            Cancel
          </button>
          <button
            onClick={handleAddClick}
            disabled={isSaveDisabled || isSaveLoading}
            className={`${
              isSaveDisabled ? "bg-[#ACDDE7]  " : "bg-[#33B0CA] "
            } text-[14px] font-[600] text-white px-3 h-[32px] rounded-[8px]`}
          >
            Save Character
          </button>
        </div>
        {selectedLanguage && keyboardVisible && (
          <Draggable handle=".movable-handle">
            <div className="absolute z-20 w-[650px] top-[164px] right-[-145px] bg-[#fafafa] border border-[#eaeaea] shadow-lg rounded">
              <div className="grid grid-cols-12">
                <div className="movable-handle col-span-11 bg-[#f8f8f8] text-[#616161] cursor-move text-center text-[14px] font-[400]">
                  Drag me!!{" "}
                  <span className="font-[500]">{sourceLanguageName}</span>{" "}
                  Keyboard
                </div>
                <div className="flex bg-red-500 text-white rounded justify-center items-center w-full h-full cursor-pointer">
                  <button
                    onClick={() => {
                      setKeyboardVisible(false);
                      setSelectedLanguage("");
                    }}
                    className="font-bold w-full h-full"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-2">
                <CharacterKeyboard
                  sourcesLanguage={sourceLanguageName}
                  inputRefs={{
                    characterNameRef,
                    occupationRef,
                    backgroundRef,
                    personalityRef,
                    individualWantRef,
                    characterJourneyRef,
                    bloodRelationshipRef,
                    familyRelationshipRef,
                    professionalRelationshipRef,
                    otherRoleRef,
                  }}
                  focusedFieldName={focusedFieldName}
                  setProfessionalrelationship={setProfessionalrelationship}
                  setFamilyrelationship={setFamilyrelationship}
                  setBloodrelationship={setBloodrelationship}
                  setCharacterjourney={setCharacterjourney}
                  setIndividualWant={setIndividualWant}
                  setPersonality={setPersonality}
                  setBackGround={setBackGround}
                  setOccupation={setOccupation}
                  setCustomRole={setCustomRole}
                  setName={setName}
                />
              </div>
            </div>
          </Draggable>
        )}
      </div>

      <div></div>
    </div>
  );
};

export default SingleCharacterAddNewTab;
