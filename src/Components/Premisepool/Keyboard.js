import React from "react";
import Arabic from "../Keyboard/Arabic";
import Assamese from "../Keyboard/Assamese";
import Bengali from "../Keyboard/Bengali";
import Burmese from "../Keyboard/Burmese";
import English from "../Keyboard/English";
import Farsi from "../Keyboard/Farsi";
import Georgian from "../Keyboard/Georgian";
import Gilaki from "../Keyboard/Gilaki";
import Greek from "../Keyboard/Greek";
import Hebrew from "../Keyboard/Hebrew";
import Hindi from "../Keyboard/Hindi";
import Hungarian from "../Keyboard/Hungarian";
import Italian from "../Keyboard/Italian";
import Japanese from "../Keyboard/Japanese";
import Kannada from "../Keyboard/Kannada";
import Korean from "../Keyboard/Korean";
import Malayalam from "../Keyboard/Malayalam";
import Nigerian from "../Keyboard/Nigerian";
import Nko from "../Keyboard/Nko";
import Norwegian from "../Keyboard/Norwegian";
import Sindhi from "../Keyboard/Sindhi";
import Spanish from "../Keyboard/Spanish";
import Thai from "../Keyboard/Thai";
import Urdu from "../Keyboard/Urdu";
import Uyghur from "../Keyboard/Uyghur";
import './Premise.css';

const Keyboard = ({ selectedLanguage, setText, inputRef }) => {
  
  return (
    <div className="notranslate">
      <div className="notranslate">
        {selectedLanguage === "Arabic" && (
          <Arabic  setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Assamese" && (
          <Assamese setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Bengali" && (
          <Bengali setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Burmese" && (
          <Burmese setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "English" && (
          <English setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Farsi" && (
          <Farsi setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Georgian" && (
          <Georgian setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Gilaki" && (
          <Gilaki setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Greek" && (
          <Greek setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Hebrew" && (
          <Hebrew setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Hindi" && (
          <Hindi setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Hungarian" && (
          <Hungarian setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Italian" && (
          <Italian setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Japanese" && (
          <Japanese setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Kannada" && (
          <Kannada setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Korean" && (
          <Korean setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Malayalam" && (
          <Malayalam setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Nigerian" && (
          <Nigerian setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Nko" && (
          <Nko setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Norwegian" && (
          <Norwegian setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Sindhi" && (
          <Sindhi setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Spanish" && (
          <Spanish setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Thai" && (
          <Thai setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Urdu" && (
          <Urdu setText={setText} inputRef={inputRef} />
        )}
      </div>
      <div className="notranslate">
        {selectedLanguage === "Uyghur" && (
          <Uyghur setText={setText} inputRef={inputRef} />
        )}
      </div>
    </div>
  );
};

export default Keyboard;
