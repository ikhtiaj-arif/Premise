import React, { useEffect } from "react";
const loadGoogleTranslate = () => {
  const script = document.createElement("script");
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateInit";
  script.async = true;
  document.body.appendChild(script);
};

const TLanguageSelector = () => {
  useEffect(() => {
    // Initialize Google Translate when the script is loaded
    window.googleTranslateInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en", // Default language
          includedLanguages: "ja,en,bn,hi", // Add languages as needed
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element" // Div ID where the dropdown will be rendered
      );
    };

    // Load the Google Translate script
    loadGoogleTranslate();
  }, []);

  return <div id="google_translate_element"></div>; // Container for the widget
};

export default TLanguageSelector;
