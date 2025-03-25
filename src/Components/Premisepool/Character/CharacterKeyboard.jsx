import React, { useEffect, useRef, useState } from "react";
import PremiseKeyboarComponent from "./PremiseKeyboarComponent";

const CharacterKeyboard = ({
    sourcesLanguage,
    inputRefs,
    focusedFieldName,
    setProfessionalrelationship,
    setFamilyrelationship,
    setBloodrelationship,
    setCharacterjourney,
    setIndividualWant,
    setPersonality,
    setBackGround,
    setOccupation,
    setName,
    setCustomRole
}) => {
    const [layoutName, setLayoutName] = useState("default");
    const keyboard = useRef(null);

    const getInputAndSetter = () => {
        switch (focusedFieldName) {
            case "name":
                return { input: inputRefs.characterNameRef.current, setter: setName };
            case "occupation":
                return { input: inputRefs.occupationRef.current, setter: setOccupation };
            case "background":
                return { input: inputRefs.backgroundRef.current, setter: setBackGround };
            case "personality":
                return { input: inputRefs.personalityRef.current, setter: setPersonality };
            case "individualWant":
                return { input: inputRefs.individualWantRef.current, setter: setIndividualWant };
            case "characterJourney":
                return { input: inputRefs.characterJourneyRef.current, setter: setCharacterjourney };
            case "bloodRelationship":
                return { input: inputRefs.bloodRelationshipRef.current, setter: setBloodrelationship };
            case "familyRelationship":
                return { input: inputRefs.familyRelationshipRef.current, setter: setFamilyrelationship };
            case "professionalRelationship":
                return { input: inputRefs.professionalRelationshipRef.current, setter: setProfessionalrelationship };
            case "Others":
                return { input: inputRefs.otherRoleRef.current, setter: setCustomRole };
            default:
                return {};
        }
    };

    useEffect(() => {
        const { input } = getInputAndSetter();
        if (keyboard.current && input) {
            keyboard.current.setInput(input.value);
        }
    }, [focusedFieldName]);

    const onKeyPress = (button) => {
        const { input, setter } = getInputAndSetter();
        if (!input || !setter) return;

        if (button === "{shift}" || button === "{lock}") {
            setLayoutName((prev) => (prev === "default" ? "shift" : "default"));
            return;
        }

        const startPos = input.selectionStart;
        const endPos = input.selectionEnd;
        const inputValue = input.value;

        let newText;
        let newSelectionStart;

        switch (button) {
            case "{enter}":
                newText = inputValue.slice(0, startPos) + "\n" + inputValue.slice(endPos);
                newSelectionStart = startPos + 1;
                break;
            case "{tab}":
                newText = inputValue.slice(0, startPos) + "\t" + inputValue.slice(endPos);
                newSelectionStart = startPos + 1;
                break;
            case "{space}":
                newText = inputValue.slice(0, startPos) + " " + inputValue.slice(endPos);
                newSelectionStart = startPos + 1;
                break;
            case "{bksp}":
                if (startPos === endPos) {
                    newText =
                        startPos === 0
                            ? inputValue
                            : inputValue.slice(0, startPos - 1) + inputValue.slice(startPos);
                    newSelectionStart = startPos === 0 ? 0 : startPos - 1;
                } else {
                    newText = inputValue.slice(0, startPos) + inputValue.slice(endPos);
                    newSelectionStart = startPos;
                }
                break;
            default:
                newText = inputValue.slice(0, startPos) + button + inputValue.slice(endPos);
                newSelectionStart = startPos + 1;
                break;
        }

        setter(newText);

        setTimeout(() => {
            input.setSelectionRange(newSelectionStart, newSelectionStart);
            input.focus();
        }, 0);
    };

    return (
        <div className="notranslate">
            <PremiseKeyboarComponent
                language={sourcesLanguage}
                onKeyPress={onKeyPress}
                layoutName={layoutName}
            />
        </div>
    );
};

export default CharacterKeyboard;
