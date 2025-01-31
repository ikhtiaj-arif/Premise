import React, { forwardRef, useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import arabic from "simple-keyboard-layouts/build/layouts/arabic";
import assamese from "simple-keyboard-layouts/build/layouts/assamese";
import belarusian from "simple-keyboard-layouts/build/layouts/belarusian";
import bengali from "simple-keyboard-layouts/build/layouts/bengali";
import burmese from "simple-keyboard-layouts/build/layouts/burmese";
import brazilian from "simple-keyboard-layouts/build/layouts/czech";
import english from "simple-keyboard-layouts/build/layouts/english";
import farsi from "simple-keyboard-layouts/build/layouts/farsi";
import georgian from "simple-keyboard-layouts/build/layouts/georgian";
import gilaki from "simple-keyboard-layouts/build/layouts/gilaki";
import hebrew from "simple-keyboard-layouts/build/layouts/hebrew";
import hindi from "simple-keyboard-layouts/build/layouts/hindi";
import hungarian from "simple-keyboard-layouts/build/layouts/hungarian";
import italian from "simple-keyboard-layouts/build/layouts/italian";
import japanese from "simple-keyboard-layouts/build/layouts/japanese";
import dannada from "simple-keyboard-layouts/build/layouts/kannada";
import korean from "simple-keyboard-layouts/build/layouts/korean";
import malayalam from "simple-keyboard-layouts/build/layouts/malayalam";
import nigerian from "simple-keyboard-layouts/build/layouts/nigerian";
import nko from "simple-keyboard-layouts/build/layouts/nko";
import norwegian from "simple-keyboard-layouts/build/layouts/norwegian";
import russian from "simple-keyboard-layouts/build/layouts/russian";
import sindhi from "simple-keyboard-layouts/build/layouts/sindhi";
import spanish from "simple-keyboard-layouts/build/layouts/spanish";
import thai from "simple-keyboard-layouts/build/layouts/thai";
import turkish from "simple-keyboard-layouts/build/layouts/turkish";
import ukrinian from "simple-keyboard-layouts/build/layouts/ukrainian";
import urdu from "simple-keyboard-layouts/build/layouts/urdu";
import uyghur from "simple-keyboard-layouts/build/layouts/uyghur";

const Pkeyboard = forwardRef(({ inputRef, sourcesLanguage }, ref) => {
  console.log(sourcesLanguage);
  const [layoutName, setLayoutName] = useState("default");
  const keyboard = useRef();
  const [layout, setLayout] = useState(english);

  useEffect(() => {
    switch (sourcesLanguage) {
      case "English":
        setLayout(english);
        break;
      case "Arabic":
        setLayout(arabic);
        break;
      case "Assamese":
        setLayout(assamese);
        break;
      case "Belarusian":
        setLayout(belarusian);
        break;
      case "Bengali":
        setLayout(bengali);
        break;
      case "Burmese":
        setLayout(burmese);
        break;
      case "Czech":
        setLayout(brazilian);
        break;
      case "Farsi":
        setLayout(farsi);
        break;
      case "Georgian":
        setLayout(georgian);
        break;
      case "Gilaki":
        setLayout(gilaki);
        break;
      case "Hebrew":
        setLayout(hebrew);
        break;
      case "Hindi":
        setLayout(hindi);
        break;
      case "Hungarian":
        setLayout(hungarian);
        break;
      case "Italian":
        setLayout(italian);
        break;
      case "Japanese":
        setLayout(japanese);
        break;
      case "Kannada":
        setLayout(dannada);
        break;
      case "Korean":
        setLayout(korean);
        break;
      case "Malayalam":
        setLayout(malayalam);
        break;
      case "Nigerian":
        setLayout(nigerian);
        break;
      case "Nko":
        setLayout(nko);
        break;
      case "Norwegian":
        setLayout(norwegian);
        break;
      case "Russian":
        setLayout(russian);
        break;
      case "Sindhi":
        setLayout(sindhi);
        break;
      case "Spanish":
        setLayout(spanish);
        break;
      case "Thai":
        setLayout(thai);
        break;
      case "Turkish":
        setLayout(turkish);
        break;
      case "Ukrainian":
        setLayout(ukrinian);
        break;
      case "Urdu":
        setLayout(urdu);
        break;
      case "Uyghur":
        setLayout(uyghur);
        break;
      default:
        setLayout(english);
    }
  }, [sourcesLanguage]);

  const onKeyPress = (button) => {
    const activeElement = document.activeElement;

    // Ensure activeElement is an input field
    if (!activeElement || activeElement.tagName !== "INPUT") return;

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
      <Keyboard
        className="notranslate"
        keyboardRef={(r) => (keyboard.current = r)}
        layoutName={layoutName}
        onKeyPress={onKeyPress}
        {...layout}
      />
    </div>
  );
});

export default Pkeyboard;
