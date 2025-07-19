// components/GrammarChecker.tsx
import axios from "axios";

export const checkGrammar = async (text)=> {
  try {
    const response = await axios.post(
      "https://api.languagetoolplus.com/v2/check",
      null,
      {
        params: {
          text,
          language: "en-US",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const matches = response.data.matches;
    let correctedText = text;

    // Apply replacements in reverse order
    matches
      .sort((a, b) => b.offset - a.offset)
      .forEach((match) => {
        const { offset, length, replacements } = match;
        if (replacements.length > 0) {
          correctedText =
            correctedText.slice(0, offset) +
            replacements[0].value +
            correctedText.slice(offset + length);
        }
      });

    return correctedText;
  } catch (error) {
    console.error("Grammar check failed:", error);
    return text; // fallback to original text
  }
};
