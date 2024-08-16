import React, { useEffect, useRef, useState } from "react";
import { FaKeyboard, FaRegImage, FaRegTrashAlt, FaTimesCircle } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { baseURL } from "../utils";
import Keyboard from "./Keyboard";
import LanguageSelector from "./LanguageSelector";
import "./Premise.css";
import PremisePreview from "./PremisePreview";

const MAX_CHARACTERS = 250;

const AddPremise = ({ setAddPopup,id, modifiedText, bg_img, bg_color }) => {
  const [file, setFile] = useState();
  const [imgUrl, setImageUrl] = useState(bg_img);
  const [text, setText] = useState(modifiedText);
  const [editorContent, setEditorContent] = useState(modifiedText);
  const [randomColor, setRandomColor] = useState(bg_color || "#ffffff");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [confirmDisable, setConfirmDisable] = useState(true);
  const [preview, setPreview] = useState(false);

  const [characterCount, setCharacterCount] = useState(0);
  const quillRef = useRef(null);

  useEffect(() => {
    const quillEditor = quillRef?.current?.getEditor();
    quillEditor?.on("text-change", () => {
      const editorText = quillEditor?.getText();
      const trimmedText = editorText?.trim();

      setText(editorText);

      const wordCount = trimmedText
        ?.split(/\s+/)
        .filter((word) => word !== "").length;

      if (wordCount >= 5) {
        setConfirmDisable(false);
      }

      const count = trimmedText?.length;
      setCharacterCount(count);
      if (count > MAX_CHARACTERS) {
        const delta = count - MAX_CHARACTERS;
        quillEditor?.deleteText(MAX_CHARACTERS, delta);
        setCharacterCount(MAX_CHARACTERS);
      }
    });
  }, [text, setText]);

  const handleColor = () => {
    const randomHexColor =
      "#" + Math?.floor(Math.random() * 16777215).toString(16);
    setRandomColor(randomHexColor);
  };

  // browsing file
  const handleFileChange = (event) => {
    const files = event.target.files[0];
    setFile(files);
    const imageUrl = URL.createObjectURL(files);
    setImageUrl(imageUrl);
    event.target.value = null
  };

  // handle image file delete
  const handleImgFileDelete = () => {
    setImageUrl(null);
    setFile(null)
  }
  // keyboard clicked
  const onClickKeyboard = () => {
    if (selectedLanguage === "") {
      setSelectedLanguage("English");
    }
    setKeyboardVisible(!keyboardVisible);
  };

  const handlePreview = () => {
    setPreview(true);
    setKeyboardVisible(false);
    let modifiedText = editorContent;

    modifiedText = modifiedText.replace(/what if/gi, "");
    modifiedText = modifiedText.replace(/[!?.,]+/g, "");
    modifiedText = `What if&nbsp;${modifiedText.trim()}?`;

    setText(modifiedText);
  };

  const handleGoBack = () => {
    setText("");
    setPreview(false);
  };

  const handleChange = (value) => {
    const quillEditor = quillRef?.current?.getEditor();
    const plainText = quillEditor?.getText();
    const wordCount = plainText
      ?.trim()
      .split(/\s+/)
      .filter((word) => word !== "").length;

    if (wordCount <= 20) {
      setEditorContent(value);
      if (wordCount >= 6) {
        setConfirmDisable(false);
      } else {
        setConfirmDisable(true);
      }
    }
  };

  const modules = {
    toolbar: [
      // [{ header: [1, 2, false] }],  // Header options
      // [{ size: ["small", false, "large", "huge"] }], // Font size options
      ["bold", "italic", "underline"], // Text formatting options
      [{ color: [] }], // Text color option
    ],
  };

  let editedData = {
    text: text,
    bg_color: randomColor ? randomColor : "#fff",
    bg_img: file,
    imgUrl: imgUrl,
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-60 z-[1]">
      <div className=" bg-slate-100 p-6 rounded-[2px] shadow-lg max-h-[80vh] overflow-y-auto premiseScroll overflow-x-hidden">
        <div className=" flex justify-between items-center pr-2 ">
          <div className="text-center mx-auto">
            <p className="bg-white font-bold text-lg px-5 py-1 text-slate-600 rounded">
              {preview ? "Preview" : "Editing"}
            </p>
          </div>
          <div className="text-right flex justify-end">
            <FaTimesCircle
              className=" text-red-500  w-5 h-5 cursor-pointer"
              onClick={() => setAddPopup(false)}
            />
          </div>
        </div>

        {preview ? (
          <PremisePreview
            id={id}
            editedData={editedData}
            editorContent={text}
            setAddPopup={setAddPopup}
            handleGoBack={handleGoBack}
          />
        ) : (
          <div className=" m-10 ">
            <div className="bg-[#FFE2E5] flex justify-between items-center p-1 cursor-pointer">
              <div className="flex gap-3">
                {/* browsing */}
                <FaRegImage
                  className="w-7 h-7"
                  onClick={() => document.getElementById("file-input").click()}
                />
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {/* color plate */}
                <img
                  src={`${baseURL}/media/img/Icons/color-palette.png`}
                  alt=""
                  className="w-7 h-7"
                  onClick={handleColor}
                />
              </div>
              {/* keyboard */}
              <div className="flex gap-3 items-center">
                <LanguageSelector
                  setSelectedLanguage={setSelectedLanguage}
                  setKeyboardVisible={setKeyboardVisible}
                />
                <FaKeyboard
                  className={`w-7 h-7 ${keyboardVisible && "text-[#33B0CA]"}`}
                  onClick={onClickKeyboard}
                />
              </div>
            </div>
            <div
              className="px-10 w-[420px]"
              style={
                imgUrl
                  ? { backgroundImage: `url(${imgUrl})` }
                  : { backgroundColor: randomColor }
              }
            >
              <div className="flex justify-between">

              <p className="font-bold text-xl pt-2">What If </p>
              {/* editor */}
              {imgUrl ? 
              
              <button onClick={handleImgFileDelete}><FaRegTrashAlt /> </button>
              :
              <></>
              }
              </div>
              <div className="flex-1 ">
                <ReactQuill
                  value={editorContent}
                  onChange={handleChange}
                  modules={modules}
                  ref={quillRef}
                  theme="snow"
                  preserveWhitespace={true}
                  className="h-[200px]"
                />
              </div>
              <p className="text-right mt-10">
                {characterCount}/{MAX_CHARACTERS}
              </p>
              <p className="font-bold text-xl text-right">?</p>
            </div>
            {/* button part */}
            <div className="bg-[#FFE2E5] flex gap-5 justify-center py-1 text-center">
              <button
                disabled={confirmDisable}
                onClick={handlePreview}
                className={`${confirmDisable ? "bg-[#fa7885]": "bg-[#33B0CA]"}  text-white  rounded-[2px] px-4 btn-sm`}
              >
                {id ? "Next" : "Next"}
              </button>

              <button
                className="bg-[#33B0CA] btn-sm text-white px-4 rounded"
                onClick={() => setAddPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div>
          {selectedLanguage && keyboardVisible && (
            <Keyboard
              setText={setText}
              text={text}
              selectedLanguage={selectedLanguage}
              quillRef={quillRef}
              setCharacterCount={setCharacterCount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPremise;
