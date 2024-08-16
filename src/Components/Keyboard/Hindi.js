import React, { useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import HindiLayout from "simple-keyboard-layouts/build/layouts/hindi";
import "./index.css";

const Hindi = ({ setText, inputRef }) => {
  const [layoutName, setLayoutName] = useState("default");
  const keyboard = useRef(null);

  useEffect(() => {
    if (keyboard.current && inputRef.current) {
      keyboard.current.setInput(inputRef.current.value);
    }
  }, [inputRef]);

  const handleKeyPress = (button) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName((prevLayoutName) =>
        prevLayoutName === "default" ? "shift" : "default"
      );
      return;
    }

    const inputElement = inputRef.current;
    const startPos = inputElement.selectionStart;
    const endPos = inputElement.selectionEnd;
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
        newSelectionStart = startPos + 1;
        break;
    }

    setText(newText);

    setTimeout(() => {
      inputElement.setSelectionRange(newSelectionStart, newSelectionStart);
      inputElement.focus();
    }, 0);
  };

  return (
    <div>
      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        onKeyPress={handleKeyPress}
        layoutName={layoutName}
        {...HindiLayout}
      />
    </div>
  );
};

export default Hindi;
