import React, { useRef, useState, forwardRef, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import english from "simple-keyboard-layouts/build/layouts/english";
import farsi from "simple-keyboard-layouts/build/layouts/farsi";
import burmese from "simple-keyboard-layouts/build/layouts/burmese";
import arabic from "simple-keyboard-layouts/build/layouts/arabic";
import assamese from "simple-keyboard-layouts/build/layouts/assamese";
import belarusian from "simple-keyboard-layouts/build/layouts/belarusian";
import bengali from "simple-keyboard-layouts/build/layouts/bengali";
import brazilian from "simple-keyboard-layouts/build/layouts/czech";
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
const KeyboardB = forwardRef(
  ({ setOptions, regardingOutput, inputRef, sourcesLanguage }, ref) => {
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
        <Keyboard
          keyboardRef={(r) => (keyboard.current = r)}
          layoutName={layoutName}
          onKeyPress={onKeyPress}
          {...layout}
        />
      </div>
    );
  }
);

export default KeyboardB;