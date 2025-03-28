import React, { useEffect, useRef, useState } from "react";
import PremiseKeyboarComponent from "../Character/PremiseKeyboarComponent";
const PremisePreviewKeyboard = ({
  sourcesLanguage,
  inputRefs,
  focusedFieldName,
  setAuthorName,
  setSpProjectName,
  setGeographyItem,
  setProtagonistName,
}) => {
  const [layoutName, setLayoutName] = useState("default");
  const keyboard = useRef(null);

  const getInputAndSetter = () => {
    switch (focusedFieldName) {
      case "protagonistName":
        return {
          input: inputRefs.protagonistNameRef.current,
          setter: setProtagonistName,
        };
      case "projectName":
        return {
          input: inputRefs.projectNameRef.current,
          setter: setSpProjectName,
        };
      case "locationName":
        return {
          input: inputRefs.locationNameRef.current,
          setter: setGeographyItem,
        };
      case "authorName":
        return {
          input: inputRefs.authorNameRef.current,
          setter: setAuthorName,
        };
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
        newText =
          inputValue.slice(0, startPos) + "\n" + inputValue.slice(endPos);
        newSelectionStart = startPos + 1;
        break;
      case "{tab}":
        newText =
          inputValue.slice(0, startPos) + "\t" + inputValue.slice(endPos);
        newSelectionStart = startPos + 1;
        break;
      case "{space}":
        newText =
          inputValue.slice(0, startPos) + " " + inputValue.slice(endPos);
        // Replace multiple spaces with a single space
        newText = newText.replace(/\s{2,}/g, " ").trimStart();
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
        newText =
          inputValue.slice(0, startPos) + button + inputValue.slice(endPos);
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

export default PremisePreviewKeyboard;
