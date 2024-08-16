import React, { useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import ChineseLayout from "simple-keyboard-layouts/build/layouts/chinese";
import "./index.css";

const Chinese = () => {
  const [layoutName, setLayoutName] = useState("default");
  const [input, setInput] = useState("");
  const keyboardRef = useRef();

  const onChange = (input) => {
    setInput(input);
  };

  const onKeyPress = (button) => {
    if (button === "{shift}" || button === "{lock}") {
      handleShift();
    }
    if (button === "{enter}") {
      // Handle enter key press
      // this?.props.editor?.commands.enter();
    }
  };

  const handleShift = () => {
    setLayoutName((prevLayoutName) =>
      prevLayoutName === "default" ? "shift" : "default"
    );
  };

  const onChangeInput = (event) => {
    const input = event.target.value;
    setInput(input);
    keyboardRef?.current?.setInput(input);
  };

  return (
    <div>
      <input value={input} onChange={onChangeInput} />
      <Keyboard
        layoutName={layoutName}
        onChange={onChange}
        onKeyPress={onKeyPress}
        {...ChineseLayout}
      />
    </div>
  );
};

export default Chinese;
