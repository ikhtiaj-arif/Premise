import React, { useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import arabic from "simple-keyboard-layouts/build/layouts/arabic";
import assamese from "simple-keyboard-layouts/build/layouts/assamese";
import belarusian from "simple-keyboard-layouts/build/layouts/belarusian";
import bengali from "simple-keyboard-layouts/build/layouts/bengali";
import burmese from "simple-keyboard-layouts/build/layouts/burmese";
import english from "simple-keyboard-layouts/build/layouts/english";
import farsi from "simple-keyboard-layouts/build/layouts/farsi";
import georgian from "simple-keyboard-layouts/build/layouts/georgian";
import hebrew from "simple-keyboard-layouts/build/layouts/hebrew";
import hindi from "simple-keyboard-layouts/build/layouts/hindi";
import hungarian from "simple-keyboard-layouts/build/layouts/hungarian";
import italian from "simple-keyboard-layouts/build/layouts/italian";
import japanese from "simple-keyboard-layouts/build/layouts/japanese";
import kannada from "simple-keyboard-layouts/build/layouts/kannada";
import korean from "simple-keyboard-layouts/build/layouts/korean";
import malayalam from "simple-keyboard-layouts/build/layouts/malayalam";
import norwegian from "simple-keyboard-layouts/build/layouts/norwegian";
import russian from "simple-keyboard-layouts/build/layouts/russian";
import sindhi from "simple-keyboard-layouts/build/layouts/sindhi";
import spanish from "simple-keyboard-layouts/build/layouts/spanish";
import thai from "simple-keyboard-layouts/build/layouts/thai";
import turkish from "simple-keyboard-layouts/build/layouts/turkish";
import ukrainian from "simple-keyboard-layouts/build/layouts/ukrainian";
import urdu from "simple-keyboard-layouts/build/layouts/urdu";
import uyghur from "simple-keyboard-layouts/build/layouts/uyghur";
import greek from "simple-keyboard-layouts/build/layouts/greek";
// import brazilian from "simple-keyboard-layouts/build/layouts/czech";
// import gilaki from "simple-keyboard-layouts/build/layouts/gilaki";
// import nigerian from "simple-keyboard-layouts/build/layouts/nigerian";
// import nko from "simple-keyboard-layouts/build/layouts/nko";
import armenianEastern from "simple-keyboard-layouts/build/layouts/armenianEastern";
// import armenianWestern from "simple-keyboard-layouts/build/layouts/armenianWestern";
import balochi from "simple-keyboard-layouts/build/layouts/balochi";
import chinese from "simple-keyboard-layouts/build/layouts/chinese";
import czech from "simple-keyboard-layouts/build/layouts/czech";
import french from "simple-keyboard-layouts/build/layouts/french";
import german from "simple-keyboard-layouts/build/layouts/german";
// import kurdish from "simple-keyboard-layouts/build/layouts/kurdish";
import macedonian from "simple-keyboard-layouts/build/layouts/macedonian";
import odia from "simple-keyboard-layouts/build/layouts/odia";
import polish from "simple-keyboard-layouts/build/layouts/polish";
import punjabi from "simple-keyboard-layouts/build/layouts/punjabi";
// import russianOld from "simple-keyboard-layouts/build/layouts/russianOld";
import swedish from "simple-keyboard-layouts/build/layouts/swedish";
import telugu from "simple-keyboard-layouts/build/layouts/telugu";
// import urduStandard from "simple-keyboard-layouts/build/layouts/urduStandard";




const layouts = {
    Afrikaans: english,
    Albanian: english,
    Amharic: english,
    Arabic: arabic,
    Armenian: armenianEastern,
    Assamese: assamese,
    Azerbaijani: english,
    Basque: english,
    Baluchi: balochi,
    Belarusian: belarusian,
    Bengali: bengali,
    Bosnian: english,
    Bulgarian: english,
    Burmese: burmese,
    Catalan: english,
    Cebuano: english,
    'Chinese-Simplified': chinese,
    'Chinese-Traditional': chinese,
    Corsican: english,
    Croatian: english,
    Czech: czech,
    Danish: english,
    Dutch: english,
    English: english,
    Esperanto: english,
    Estonian: english,
    Filipino: english,
    Finnish: english,
    French: french,
    Frisian: english,
    Gaelic: english,
    Galician: english,
    Georgian: georgian,
    German: german,
    Greek: greek,
    Gujarati: hindi,
    Haitian: english,
    Hausa: english,
    Hawaiian: english,
    Hebrew: hebrew,
    Hindi: hindi,
    Hmong: english,
    Hungarian: hungarian,
    Icelandic: english,
    Igbo: english,
    Indonesian: english,
    Irish: english,
    Italian: italian,
    Japanese: japanese,
    Javanese: english,
    Kannada: kannada,
    Kazakh: english,
    Khmer: english,
    Kinyarwanda: english,
    Korean: korean,
    Kyrgyz: english,
    Lao: english,
    Latin: english,
    Latvian: english,
    Lithuanian: english,
    Luxembourgish: english,
    Macedonian: macedonian,
    Malagasy: english,
    Malay: english,
    Malayalam: malayalam,
    Maltese: english,
    Maori: english,
    Marathi: hindi,
    Mongolian: english,
    Myanmar: burmese,
    Nepali: hindi,
    Norwegian: norwegian,
    Oriya: odia,
    Pashto: arabic,
    Persian: farsi,
    Polish: polish,
    Portuguese: english,
    Punjabi: punjabi,
    Romanian: english,
    Russian: russian,
    Samoan: english,
    Scots: english,
    Serbian: english,
    Sesotho: english,
    Shona: english,
    Sindhi: sindhi,
    Sinhala: english,
    Slovak: english,
    Slovenian: english,
    Somali: english,
    Spanish: spanish,
    Sundanese: english,
    Swahili: swedish,
    Swedish: english,
    Tamil: hindi,
    Tatar: hindi,
    Telugu: telugu,
    Thai: thai,
    Turkish: turkish,
    Turkmen: english,
    Ukrainian: ukrainian,
    Urdu: urdu,
    Uyghur: uyghur,
    Uzbek: english,
    Vietnamese: english,
    Welsh: english,
    Xhosa: english,
    Yiddish: hebrew,
    Yoruba: english,
    Zulu: english,
};

const KeyboardComponent = ({ language = "English", onKeyPress, layoutName }) => {
    const keyboard = useRef();
    const [layout, setLayout] = useState(null);
    useEffect(() => {
        const selectedLayout = layouts[language];
        if (!selectedLayout) {
            console.error(`Layout for ${language} not found, falling back to English.`);
            // setLayout(english);
        } else {
            setLayout(selectedLayout);
        }
    }, [language]);

    if (!layout) {
        return <div>Loading keyboard...</div>;
    }


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
};

export default KeyboardComponent;
