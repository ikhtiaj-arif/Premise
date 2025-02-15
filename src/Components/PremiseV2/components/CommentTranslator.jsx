import { useState } from "react";
import transIcon from "../../../img/Icons/transIcon.png";
import { sortedLanguages } from "../../Premisepool/Languages";

const CommentTranslator = ({
  comment,
  translateComment,
  loading,
  commentRefetch,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("bn");
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track which comment's dropdown is open

  const handleTranslateComment = async (lang) => {
    const data = {
      text_id: comment.id,
      tar_lang: lang,
    };

    try {
      const res = await translateComment(data);
      console.log(res);
      commentRefetch();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLanguageSelect = (key) => {
    setSelectedLanguage(key);
    setOpenDropdownId(null); // Close the dropdown
    handleTranslateComment(key); // Call the translation function
  };

  return (
    <div className="relative">
      {/* {loading ? (
        <span className="loading loading-spinner text-[#33B0CA] h-[20px] w-[20px] my-auto"></span>
      ) : ( */}
      <img
        data-te-toggle="tooltip"
        title="Translate"
        src={transIcon}
        onClick={() => {
          // If another dropdown is open, close it and open the current one
          setOpenDropdownId(openDropdownId === comment.id ? null : comment.id);
        }}
        className="w-5 h-5 ml-auto cursor-pointer"
        alt=""
      />
      {/* )} */}
      {openDropdownId === comment.id && (
        <div className="absolute top-[32px] right-0 z-20 w-[124px] h-[27vh] overflow-x-hidden md:h-[40vh] overflow-y-auto border bg-[#fafafa]">
          {Object.entries(sortedLanguages)?.map(([key, name]) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                handleLanguageSelect(key);
              }}
              className="cursor-pointer text-[14px] text-[#252525] hover:bg-[#33B0CA] hover:text-[#fafafa] list-none pl-[8px] border-b"
              key={key}
              value={key}
            >
              {name}
            </li>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentTranslator;
