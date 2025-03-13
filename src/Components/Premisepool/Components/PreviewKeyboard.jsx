import React, { forwardRef, useState } from "react";
import KeyboardComponent from "./KeyboardComponent";


const Pkeyboard = forwardRef(({ sourcesLanguage }, ref) => {
  const [layoutName, setLayoutName] = useState("default");

  const onKeyPress = (button) => {
    if (button === "{shift}" || button === "{lock}") {
      handleShift()
      return
    };
    const activeElement = document.activeElement;

    // Ensure activeElement is an input field
    if (!activeElement || (activeElement.tagName !== "INPUT" && activeElement.tagName !== "TEXTAREA")) return;
    if (activeElement.type === "number") return;
    if (activeElement.id === "numberField") return
    const startPos = activeElement.selectionStart ?? 0;
    const endPos = activeElement.selectionEnd ?? 0;
    const inputValue = activeElement.value ?? "";

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
            newText = inputValue; // No change if backspace at the start
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

    activeElement.value = newText;

    setTimeout(() => {
      activeElement.setSelectionRange(newSelectionStart, newSelectionStart);
      activeElement.focus();
    }, 0);
  };

  const handleShift = () => {
    let layout = layoutName;
    setLayoutName(layout === "default" ? "shift" : "default");
  };

  return (
    <div className="notranslate">
      <KeyboardComponent language={sourcesLanguage} onKeyPress={onKeyPress} layoutName={layoutName} />
    </div>
  );
});

export default Pkeyboard;
