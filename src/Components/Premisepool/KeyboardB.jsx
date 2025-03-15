import React, { forwardRef, useState } from "react";
import "react-simple-keyboard/build/css/index.css";
import KeyboardComponent from "./Components/KeyboardComponent";
const KeyboardB = forwardRef(
  ({ setOptions, regardingOutput, inputRef, sourcesLanguage }, ref) => {
    const [layoutName, setLayoutName] = useState("default");


    const onKeyPress = (button) => {
      if (button === "{shift}" || button === "{lock}") handleShift();

      const inputElement = inputRef.current;
      const startPos = inputElement?.selectionStart;
      const endPos = inputElement?.selectionEnd;
      const inputValue = inputElement.value;

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
          newSelectionStart = startPos + 1;
          break;
        case "{shift}":
        case "{lock}":
          newText = inputValue;
          newSelectionStart = inputValue.length;
          break;
        case "{bksp}":
          if (startPos === endPos) {
            if (startPos === 0) {
              newText = inputValue;
              newSelectionStart = startPos;
            } else {
              newText =
                inputValue.slice(0, startPos - 1) + inputValue.slice(startPos);
              newSelectionStart = startPos - 1;
            }
          } else {
            newText = inputValue.slice(0, startPos) + inputValue.slice(endPos);
            newSelectionStart = startPos;
          }
          break;
        default:
          newText =
            inputValue.slice(0, startPos) + button + inputValue.slice(endPos);
          newSelectionStart = startPos + button.length;
          break;
      }

      setOptions((prevOptions) => ({
        ...prevOptions,
        [regardingOutput]: newText,
      }));

      setTimeout(() => {
        inputElement.setSelectionRange(newSelectionStart, newSelectionStart);
        inputElement.focus();
      }, 0);
    };

    const handleShift = () => {
      let layout = layoutName;
      setLayoutName(layout === "default" ? "shift" : "default");
    };

    return (
      <div>
        <KeyboardComponent
          language={sourcesLanguage}
          onKeyPress={onKeyPress}
          layoutName={layoutName}
        />
      </div>
    );
  }
);

export default KeyboardB;
