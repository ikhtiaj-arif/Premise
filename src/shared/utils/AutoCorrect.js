// utils/autoCorrectText.ts
import axios from 'axios';

export const autoCorrectText = async (text) => {
  try {
    const response = await axios.post(
      'https://api.languagetoolplus.com/v2/check',
      new URLSearchParams({
        text,
        language: 'en-US',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { matches } = response.data;
    let correctedText = text;

    for (const match of matches.reverse()) {
      if (match.replacements.length > 0) {
        correctedText =
          correctedText.slice(0, match.offset) +
          match.replacements[0].value +
          correctedText.slice(match.offset + match.length);
      }
    }

    return correctedText;
  } catch (error) {
    console.error('Auto-correction error:', error);
    return text;
  }
};
