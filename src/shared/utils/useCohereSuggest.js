// hooks/useCohereSuggest.js
import axios from "axios";
import { useEffect, useState } from "react";

const COHERE_API_KEY = "kuKQI5hktCRGrYDj2kDtHO0U5LNDDYLsX8KO5iQb"; // Replace safely in backend for production

export const useCohereSuggest = (inputText, delay = 800) => {
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    if (!inputText?.trim() || inputText.length < 5) {
      setSuggestion("");
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestion(inputText);
    }, delay);

    return () => clearTimeout(timer); // Cancel if user keeps typing
  }, [inputText]);

  const fetchSuggestion = async (text) => {
    try {
      const res = await axios.post(
        "https://api.cohere.ai/v1/generate",
        {
          model: "command-r-plus",
          prompt: text,
          max_tokens: 20,
          temperature: 0.4,
          stop_sequences: ["\n"],
        },
        {
          headers: {
            Authorization: `Bearer ${COHERE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const generated = res.data.generations?.[0]?.text?.trim();
      setSuggestion(generated || "");
    } catch (err) {
      console.error("Cohere error:", err.message);
      setSuggestion("");
    }
  };

  return suggestion;
};
