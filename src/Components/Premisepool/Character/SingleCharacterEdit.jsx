import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaKeyboard } from "react-icons/fa";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useSuggestCharactersMutation } from "../../../app/EndPoints/Characters/Characters";
import { getLanguageName } from "../../PremiseV2/utilityFuncitons/functions";
import AutoSizeTextArea from "./AutosizeTextArea";
import CharacterKeyboard from "./CharacterKeyboard";

const SingleCharacterAdd = ({
  setEditPopupOpen,
  editData,
  onSave,
  editIdx,
  isEditPopupOpen,
  onlyAdd,
  source_language,
}) => {
  const [role, setRole] = useState(editData?.role || "");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [name, setName] = useState(editData?.name || "");
  const [age, setAge] = useState(editData?.age || "");
  const [focusedFieldName, setFocusedFieldName] = useState("");
  const [occupation, setOccupation] = useState(editData?.occupation || "");
  const [gender, setGender] = useState(editData?.gender || "");
  const [background, setBackGround] = useState(editData?.background || "");
  const [personality, setPersonality] = useState(editData?.personality || "");
  const [individualWant, setIndividualWant] = useState(
    editData?.individual_want || ""
  );
  const [characterjourney, setCharacterjourney] = useState(
    editData?.character_journey || ""
  );
  const [customRole, setCustomRole] = useState("");
  const [bloodrelationship, setBloodrelationship] = useState(
    editData?.blood_relationship || ""
  );
  const [familyrelationship, setFamilyrelationship] = useState(
    editData?.family_relationship || ""
  );
  const [professionalrelationship, setProfessionalrelationship] = useState(
    editData?.professional_relationship || ""
  );

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const characterNameRef = useRef(null);
  const occupationRef = useRef(null);
  const otherRoleRef = useRef(null);
  const backgroundRef = useRef(null);
  const personalityRef = useRef(null);
  const individualWantRef = useRef(null);
  const characterJourneyRef = useRef(null);
  const bloodRelationshipRef = useRef(null);
  const familyRelationshipRef = useRef(null);
  const professionalRelationshipRef = useRef(null);

  // useAutosizeTextArea(textAreaRef.current, familyrelationship);

  useEffect(() => {
    let isAgeValid;
    if (gender === "Inanimate Object") {
      isAgeValid = true;
    } else {
      isAgeValid = age;
    }

    const isFormComplete = role && name && occupation && gender && isAgeValid;
    //console.log("isFormComplete", isFormComplete);
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

  useEffect(() => {
    if (isEditPopupOpen) {
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
    }
  }, [
    isEditPopupOpen,
    background,
    personality,
    individualWant,
    characterjourney,
    bloodrelationship,
    familyrelationship,
    professionalrelationship,
  ]);

  const handleAddClick = (e) => {
    e.preventDefault();
    let isAgeValid;
    if (gender === "Inanimate Object") {
      isAgeValid = "";
    } else {
      isAgeValid = age;
    }
    const assignedRole = role === "Others" ? customRole : role;
    const updatedCharacter = {
      ...editData,
      role: assignedRole,
      name,
      age: isAgeValid,
      occupation,
      gender,
      background,
      personality,
      individual_want: individualWant,
      character_journey: characterjourney,
      blood_relationship: bloodrelationship,
      family_relationship: familyrelationship,
      professional_relationship: professionalrelationship,
    };
    // handleAddNewCharacter(newCharacter);

    // Optionally, reset the form fields after adding
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
    setEditPopupOpen(false);
    // console.log(updatedCharacter);

    onSave(updatedCharacter, editIdx);
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    // Allow only positive integers
    if (/^(?!0$)(?!0\d)\d*$/.test(value)) {
      setAge(value);
    }
  };
  const handleInputChange = (e, setValue) => {
    let value = e.target.value;
    if (typeof value !== "string") {
      // console.error('Invalid input value:', value);
      return;
    }
    if (value.length === 0) {
      setValue("");
      return;
    }

    // Handle the case for single-character input
    if (value.length === 1) {
      const firstChar = value.replace(/[^a-zA-Z0-9]/, ""); // Remove non-alphanumeric characters
      setValue(firstChar); // Set value to the cleaned character
    } else {
      // For multi-character input, validate only the first character
      const firstChar = value[0].replace(/[^a-zA-Z0-9]/, ""); // Clean the first character if it's non-alphanumeric
      const restOfValue = value.slice(1); // Keep the rest of the value as-is

      setValue(firstChar + restOfValue); // Combine the cleaned first character with the rest of the input
    }
  };

  const characterRoles = [
    "Protagonist",
    "Antagonist",
    "Narrator",
    "Co-Star",
    "Supporting Character",
    "Confidant",
    "Love Interest",
    "Antagonist's Right Hand",
    "Foil",
    "Mentor",
    "Comic Relief",
    "Rival",
    "Sidekick",
    "Symbolic Character",
    "Others",
  ];

  const getRole = () => {
    return characterRoles.includes(role) ? role : "Others";
  };

  // const isDisabled = editIdx === 0;
  const isDisabled = onlyAdd;
  const [suggestCharacters, updatePostPremiseResInfo] =
    useSuggestCharactersMutation();
  const [disabledEdit, setDisabledEdit] = useState(false);

  const handleSuggest = async (e) => {
    e.preventDefault();
    const assignedRole = role === "Others" ? customRole : role;
    const newCharacter = {
      role: assignedRole,
      name,
      age,
      occupation,
      gender,
    };
    try {
      setDisabledEdit(true);
      const res = await suggestCharacters(newCharacter);
      if (res) {
        setDisabledEdit(false);
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
      setDisabledEdit(false);
      console.error("Error fetching character suggestion:", error);
    }
  };

  const sourceLanguageName = getLanguageName(source_language);
  const onClickKeyboard = () => {
    if (selectedLanguage === "") {
      setSelectedLanguage(sourceLanguageName);
    }
    setKeyboardVisible(!keyboardVisible);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      {/* {console.log(editIdx)} */}
      <div className="relative bg-[#FAFAFA] pt-[20px] px-[8px] rounded-lg shadow-lg w-full lg:w-[479px] h-[450px]">
        <div className="h-[370px] overflow-auto">
          <div>
            <div>
              <h3 className="text-center mb-0 md:mb-[12px] flex md:justify-center items-center gap-[9px] font-[500]">
                <MdOutlineKeyboardBackspace
                  onClick={() => setEditPopupOpen(false)}
                  className="block md:hidden text-[#33B0CA] cursor-pointer h-[38px] w-[38px]"
                />
                <span className="text-[18px] md:text-[14px]">{`${
                  isDisabled ? "View Character" : "Edit Character"
                }`}</span>
              </h3>
              {!isDisabled && (
                <div className="absolute top-[20px] right-[10px] z-10">
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
              )}
            </div>
            <form
              onSubmit={handleAddClick}
              className="w-[90%] md:w-[398px] mt-[12px] md:mt-0 mx-auto"
            >
              <div className="block mb-0 md:mb-[12px] md:flex gap-[18px] ">
                <div className="relative w-full md:w-[171px]">
                  <label
                    className={`absolute left-2 top-[1px] lg:top-[-10px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500]  transition-all z-[2]
                     `}
                  >
                    Role
                  </label>
                  {/* {console.log(role)} */}
                  <select
                    required
                    // onChange={(e) => setRole(e.target.value)}
                    value={getRole()}
                    className=" text-[14px] bg-[#FAFAFA] border-[2px] text-[#252525] outline-[#EAEAEA]  rounded-[8px] my-[12px] md:my-0   w-full md:w-[171px] h-[42px]  indent-1 "
                    disabled
                  >
                    <option className="text-[14px]" value="" selected disabled>
                      Role
                    </option>
                    <option className="bg-white text-[#252525] text-[14px]">
                      Protagonist
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Antagonist
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Narrator
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Co-Star
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Supporting Character
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Confidant
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Love Interest
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Antagonist's Right Hand
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Foil
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Mentor
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Comic Relief
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Rival
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Sidekick
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Symbolic character
                    </option>
                    <option className=" text-[#252525] text-[14px]">
                      Others
                    </option>
                  </select>
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
                    required
                    ref={characterNameRef}
                    onChange={(e) => handleInputChange(e, setName)}
                    onFocus={() => setFocusedFieldName("name")}
                    type="text"
                    name="name"
                    maxLength={50}
                    translate=""
                    placeholder="Name"
                    className={`text-[14px] ${
                      isDisabled
                        ? `${`capitalize ${
                            !editData?.is_ai_generated
                              ? "text-[#33B0CA]"
                              : "text-[#7a7a7a]"
                          }`}`
                        : `${`capitalize ${
                            !editData?.is_ai_generated
                              ? "text-[#33B0CA]"
                              : "text-[#616161]"
                          }`}`
                    }  px-3 py-[12px] outline-[#EAEAEA]  rounded-[8px] border-2   w-full md:w-[208px] h-[42px]   `}
                    disabled={isDisabled}
                  />
                </div>
              </div>
              <div>
                {role === "Others" && (
                  <input
                    autoComplete="off"
                    value={customRole}
                    ref={otherRoleRef}
                    required
                    onFocus={() => setFocusedFieldName("Others")}
                    onChange={(e) => setCustomRole(e.target.value)}
                    type="text"
                    placeholder="Describe the role"
                    className="text-[14px] bg-[#FAFAFA] px-3 py-[12px] outline-[#EAEAEA]  mt-[5px] mb-[15px] rounded-[8px] border-2   w-full md:w-[398px] h-[42px] "
                  />
                )}
              </div>

              <div className="flex flex-col mb-0 md:mb-[12px] md:flex-row mt-[8px] md:mt-[24px]  gap-[18px]">
                <div className="relative w-full md:w-[92px]">
                  <label className="absolute left-2 top-[0px] md:top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all z-10">
                    Gender
                  </label>
                  <select
                    required
                    disabled={isDisabled}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className=" text-[14px] bg-[#FAFAFA] border-[2px] text-[#616161] outline-[#EAEAEA]  rounded-[8px] mt-[12px] md:my-0   w-full md:w-[97px] h-[42px]  indent-1"
                    // className="text-[14px] bg-[#FAFAFA] px-3 py-[12px] outline-[#EAEAEA]  rounded-[8px] border-2   w-full md:w-[208px] h-[42px]"
                    // style={{ width: "97px" }}
                  >
                    <option value="" className="text-[14px] " selected disabled>
                      Gender
                    </option>
                    <option className="text-[14px]">Male</option>
                    <option className="text-[14px]">Female</option>
                    <option className="text-[14px]">Animal</option>
                    <option className="text-[14px]">Inanimate Object</option>
                  </select>
                </div>
                {gender !== "Inanimate Object" && (
                  <div className="relative w-full md:w-[49px]">
                    <label className="absolute left-2 top-[-12px] z-[2] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                      Age
                    </label>
                    <input
                      type="text"
                      value={age}
                      onChange={handleAgeChange}
                      id="protaAge"
                      min="0"
                      maxLength={5}
                      className={`h-[42px] relative text-[12px] md:!text-[14px] leading-tight w-full px-[8px]  md:w-[64px] bg-[#fafafa] rounded-[8px] border-[2px] focus:outline-none ${
                        isDisabled ? "text-[#7a7a7a]" : "text-[#616161]"
                      }`}
                      // className="text-[14px] bg-[#FAFAFA] px-3 py-[12px] outline-[#EAEAEA]  rounded-[8px] border-2   w-full md:w-[208px] h-[42px]"
                      placeholder="age"
                      required
                      disabled={isDisabled}
                    />
                  </div>
                )}

                <div className="relative w-full md:w-[206px] md:left-3 ">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Occupation
                  </label>
                  <textarea
                    autoComplete="off"
                    required
                    onChange={(e) => handleInputChange(e, setOccupation)}
                    onFocus={() => setFocusedFieldName("occupation")}
                    value={occupation}
                    type="text"
                    maxLength={50}
                    disabled={isDisabled}
                    name="occupation"
                    translate="no"
                    placeholder="occupation"
                    ref={occupationRef}
                    className={`text-[14px] bg-[#FAFAFA] mb-[12px] leading-[20px] md:mb-0 px-3 pt-[8px] pb-[12px] outline-[#EAEAEA]  rounded-[8px] border-2   w-full md:w-[208px] h-[42px]    overflow-y-auto text-[#616161] resize-none "
                       `}
                  />
                </div>
              </div>

              <div className="mb-[12px] mt-6">
                <div className="relative w-full md:w-[171px]">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Background
                  </label>
                  <textarea
                    autoComplete="off"
                    required
                    onChange={(e) => handleInputChange(e, setBackGround)}
                    onFocus={() => setFocusedFieldName("background")}
                    value={background}
                    type="text"
                    maxLength={300}
                    name="background"
                    disabled={isDisabled}
                    translate="no"
                    placeholder="Background"
                    ref={backgroundRef}
                    className={`text-[14px] bg-[#FAFAFA]  px-3 pt-[8px] pb-[12px] leading-[17px] outline-[#EAEAEA]  rounded-[8px] overflow-y-hidden border-2   w-full md:w-[398px]
                    h-auto resize-none ${
                      isDisabled ? "text-[#7a7a7a]" : "text-[#616161]"
                    } h-auto resize-none leading-[20px]`}
                  />
                </div>
              </div>
              <div className="mb-[12px] mt-6">
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
                    disabled={isDisabled}
                    name="personality"
                    translate="no"
                    placeholder="Personality"
                    ref={personalityRef}
                    className={`text-[14px] bg-[#FAFAFA]  px-3 pt-[8px] pb-[12px] leading-[20px] outline-[#EAEAEA]  overflow-y-hidden rounded-[8px] border-2   w-full md:w-[398px] h-auto resize-none   ${
                      isDisabled ? "text-[#7a7a7a]" : "text-[#616161]"
                    } `}
                  />
                </div>
              </div>
              <div className="mb-[12px] mt-6">
                <div className="relative w-full md:w-[171px]">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Individual&nbsp;want
                  </label>
                  <textarea
                    onChange={(e) => handleInputChange(e, setIndividualWant)}
                    onFocus={() => setFocusedFieldName("individualWant")}
                    value={individualWant}
                    autoComplete="off"
                    required
                    type="text"
                    maxLength={300}
                    name="individualwant"
                    disabled={isDisabled}
                    translate="no"
                    placeholder="Individual want"
                    ref={individualWantRef}
                    className={`text-[14px] bg-[#FAFAFA] px-3 pt-[8px] pb-[12px] leading-[17px] outline-[#EAEAEA] overflow-y-hidden  rounded-[8px] border-2   w-full md:w-[398px] h-auto resize-none  ${
                      isDisabled ? "text-[#7a7a7a]" : "text-[#616161]"
                    }  `}
                  />
                </div>
              </div>
              <div className="mb-[12px] mt-6">
                <div className="relative w-full md:w-[171px]">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Character's&nbsp;journey
                  </label>

                  <textarea
                    onChange={(e) => handleInputChange(e, setCharacterjourney)}
                    onFocus={() => setFocusedFieldName("characterJourney")}
                    value={characterjourney}
                    autoComplete="off"
                    required
                    type="text"
                    maxLength={300}
                    disabled={isDisabled}
                    name="characterjourney"
                    translate="no"
                    placeholder="Character's journey"
                    ref={characterJourneyRef}
                    className={`text-[14px] bg-[#FAFAFA] px-3 pt-[8px] pb-[12px] leading-[17px] outline-[#EAEAEA] overflow-y-hidden  rounded-[8px] border-2   w-full md:w-[398px] h-auto resize-none   ${
                      isDisabled ? "text-[#7a7a7a]" : "text-[#616161]"
                    } `}
                  />
                </div>
              </div>
              <div className="mb-[12px] mt-6">
                <div className="relative w-full md:w-[171px]">
                  <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                    Blood&nbsp;relationship
                  </label>
                  <textarea
                    onChange={(e) => handleInputChange(e, setBloodrelationship)}
                    onFocus={() => setFocusedFieldName("bloodRelationship")}
                    value={bloodrelationship}
                    autoComplete="off"
                    required
                    type="text"
                    maxLength={300}
                    name="Blood_relationship"
                    disabled={isDisabled}
                    translate="no"
                    placeholder="Blood relationship"
                    ref={bloodRelationshipRef}
                    className={`text-[14px] bg-[#FAFAFA] px-3 pt-[8px] pb-[12px] leading-[17px] outline-[#EAEAEA] overflow-y-hidden  rounded-[8px] border-2   w-full md:w-[398px] h-auto resize-none    ${
                      isDisabled ? "text-[#7a7a7a]" : "text-[#616161]"
                    }`}
                  />
                </div>
              </div>
              <div className="relative w-full md:w-[171px] mt-6">
                <label className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all">
                  Family&nbsp;relationship
                </label>
                <div className="mb-[12px]">
                  <textarea
                    onChange={(e) =>
                      handleInputChange(e, setFamilyrelationship)
                    }
                    value={familyrelationship}
                    onFocus={() => setFocusedFieldName("familyRelationship")}
                    autoComplete="off"
                    required
                    type="text"
                    maxLength={300}
                    name="Family_relationship"
                    disabled={isDisabled}
                    translate="no"
                    placeholder="Family relationship"
                    ref={familyRelationshipRef}
                    className={`text-[14px] bg-[#FAFAFA] px-3 pt-[8px] pb-[12px] leading-[17px] outline-[#EAEAEA] overflow-y-hidden  rounded-[8px] border-2   w-full md:w-[398px] h-auto resize-none     ${
                      isDisabled ? "text-[#7a7a7a]" : "text-[#616161]"
                    }`}
                  />
                </div>
              </div>

              <div className="mb-[12px] mt-6">
                <div className="relative w-full md:w-[171px]">
                  <label
                    htmlFor="professional_relationship_input"
                    className="absolute left-2 top-[-12px] bg-[#FAFAFA] px-1 text-sm text-[#252525] font-[500] transition-all"
                  >
                    Professional&nbsp;relationship
                  </label>
                  <textarea
                    id="professional_relationship_input"
                    onChange={(e) =>
                      handleInputChange(e, setProfessionalrelationship)
                    }
                    value={professionalrelationship}
                    onFocus={() =>
                      setFocusedFieldName("professionalRelationship")
                    }
                    autoComplete="off"
                    required
                    type="text"
                    maxLength={300}
                    name="Professional_relationship"
                    disabled={isDisabled}
                    translate="no"
                    placeholder="Professional relationship"
                    ref={professionalRelationshipRef}
                    className={`text-[14px] bg-[#FAFAFA] px-3 pt-[8px] pb-[12px] leading-[17px] outline-[#EAEAEA] overflow-y-hidden  rounded-[8px] border-2   w-full md:w-[398px] h-auto resize-none   ${
                      isDisabled ? "text-[#7a7a7a]" : "text-[#616161]"
                    }`}
                  />
                </div>
              </div>
            </form>
          </div>
          {onlyAdd || isDisabled ? (
            <div className="absolute bottom-0 left-0 right-0 bg-[#FAFAFA] py-4 px-8 flex justify-end gap-[18px]  rounded-[8px]">
              <button
                onClick={() => setEditPopupOpen(false)}
                className="bg-[#fafafa] flex items-center gap-[14px] justify-center text-[14px] text-[#33B0CA] border border-[#33B0CA] w-[69px] h-[32px] rounded-[4px] py-[4px] px-[2px]"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="absolute bottom-0 left-0 right-0 bg-[#FAFAFA] py-4 px-8 flex justify-end gap-[18px]  rounded-[8px]">
              <button
                onClick={() => setEditPopupOpen(false)}
                className="bg-[#fafafa] flex items-center gap-[14px] justify-center text-[14px] text-[#33B0CA] border border-[#33B0CA] w-[69px] h-[28px] md:h-[32px] xl:h-[38px] rounded-[4px] py-[4px] px-[2px]"
              >
                Cancel
              </button>

              <button
                onClick={handleAddClick}
                className={`text-[14px] font-[600] text-white w-[69px] h-[28px] md:h-[32px] xl:h-[38px] rounded-[4px] ${
                  isSaveDisabled || disabledEdit
                    ? "bg-[#ACDDE7]  "
                    : "bg-[#33B0CA] "
                }`}
                disabled={isSaveDisabled || disabledEdit}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        {selectedLanguage && keyboardVisible && (
          <Draggable handle=".movable-handle">
            <div className="absolute z-20 w-[650px] top-[194px] right-[-85px] bg-[#fafafa] border border-[#eaeaea] shadow-lg rounded">
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
    </div>
  );
};

export default SingleCharacterAdd;
