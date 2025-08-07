import axios from "axios";
import { useState } from "react";

// Grammar check with Cohere API
const checkGrammarWithCohere = async (text) => {
  if (!text.trim()) return "";

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        model: "command-r",
        message: `Please correct the grammar of this text:\n\n"${text}"\n\nOnly respond with the corrected version.`,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer kuKQI5hktCRGrYDj2kDtHO0U5LNDDYLsX8KO5iQb`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.text?.trim() || text;
  } catch (err) {
    console.error("Cohere error:", err);
    return text;
  }
};

const GrammarChecker = ({
  correctedText,
  setCorrectedText,
  text,
  setText,
  inputRef,
}) => {
  const [showCorrectionOptions, setShowCorrectionOptions] = useState(false);
  const [suggestClicked, setSuggestClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTextChange = (e) => {
    const value = e.target.value.replace(/\s{2,}/g, " ");
    setText(value);
    setCorrectedText("");
    setShowCorrectionOptions(false);
    // 🚫 Do NOT reset suggestClicked — enforce one-time rule
  };

  const handleSuggestClick = async () => {
    if (!text?.trim()) return;

    setSuggestClicked(true); // Permanently disable button
    setIsLoading(true);

    const result = await checkGrammarWithCohere(text);
    setIsLoading(false);

    if (result !== text.trim()) {
      setCorrectedText(result);
      setShowCorrectionOptions(true);
    } else {
      setCorrectedText("");
      setShowCorrectionOptions(false);
    }
  };

  const handleAcceptCorrection = () => {
    setText(correctedText);
    setCorrectedText("");
    setShowCorrectionOptions(false);
  };

  const handleRejectCorrection = () => {
    setCorrectedText("");
    setShowCorrectionOptions(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <textarea
        onChange={handleTextChange}
        rows={7}
        className="text-[16px] leading-[24px] md:leading-[28px] bg-transparent border border-[#eaeaea] shadow-md rounded-[8px] w-full h-[170px] xl:h-[200px] resize-none text-[#616161] focus:outline-none px-[20px] py-[12px] overflow-hidden break-words relative z-10"
        maxLength={200}
        value={text}
        spellCheck={true}
        ref={inputRef}
      />

      {/* Character Info */}
      <div className="text-[14px] leading-[18px] font-[400] mt-[-4px]">
        <div className="flex flex-row-reverse items-center gap-5 mt-[-7px]">
          <p className="pt-[10px] md:pt-[1.5px]">{(text?.length ?? 0)}/200</p>
          {(text?.length ?? 0) > 20 ? (
            <p className="text-[#EE3C4D] pt-[10px] md:pt-[1.5px]">
              Maximum 200 characters
            </p>
          ) : (
            <p className="text-[#EE3C4D] pt-[10px] md:pt-[1.5px]">
              Minimum 20 characters
            </p>
          )}
        </div>
      </div>

      {/* Suggest Button — One-time only */}
      {!suggestClicked && (text?.length ?? 0) >= 20 && (
        <button
          onClick={handleSuggestClick}
          className="mt-4 px-4  text-[12px] bg-[#33B0CA] text-white rounded  disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Checking..." : "Suggest"}
        </button>
      )}

      {/* Correction Output */}
      {correctedText && showCorrectionOptions && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner text-sm text-gray-800 whitespace-pre-wrap mt-4 relative">
          <p className="font-medium text-green-700 mb-2">
            Suggested Correction:
          </p>
          <p className="mb-2">{correctedText}</p>

          <div className="flex gap-3 absolute top-2 right-2">
            <button
              onClick={handleAcceptCorrection}
              className="text-green-600 hover:text-green-800 text-xl"
              title="Accept"
            >
              ✔️
            </button>
            <button
              onClick={handleRejectCorrection}
              className="text-red-500 hover:text-red-700 text-xl"
              title="Reject"
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrammarChecker;
