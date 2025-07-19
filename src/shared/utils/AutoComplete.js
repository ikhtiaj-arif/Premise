// // components/useSmartSuggest.js
// import { useEffect, useState } from "react";

// // Dummy Suggestion Logic — Replace with OpenAI/real API
// const dummySuggestAPI = async (text) => {
//   if (text.endsWith("I want to")) return " learn React";
//   if (text.endsWith("We are")) return " building a platform";
//   return "";
// };

// export const useSmartSuggest = (inputText, delay = 500) => {
//   const [suggestion, setSuggestion] = useState("");

//   useEffect(() => {
//     if (!inputText.trim()) {
//       setSuggestion("");
//       return;
//     }

//     const timer = setTimeout(async () => {
//       const result = await dummySuggestAPI(inputText);
//       setSuggestion(result);
//     }, delay);

//     return () => clearTimeout(timer);
//   }, [inputText, delay]);

//   return { suggestion };
// };
// components/useSmartSuggest.js


import { useEffect, useState } from "react";

const fetchSuggestionFromHF = async (inputText) => {
  const response = await fetch("https://api-inference.huggingface.co/models/bigscience/bloomz-560m", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: inputText,
      parameters: {
        return_full_text: false,
        max_new_tokens: 10,
      },
    }),
  });

  if (!response.ok) {
    console.warn("Suggestion API failed");
    return "";
  }

  const result = await response.json();

  if (Array.isArray(result) && result.length > 0) {
    return result[0].generated_text.trimStart();
  }

  return "";
};

export const useSmartSuggest = (inputText, delay = 800) => {
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    if (!inputText?.trim() || inputText.length < 5) {
      setSuggestion("");
      return;
    }

    const timer = setTimeout(async () => {
      const suggested = await fetchSuggestionFromHF(inputText);
      setSuggestion(suggested);
    }, delay);

    return () => clearTimeout(timer);
  }, [inputText, delay]);

  return { suggestion };
};
