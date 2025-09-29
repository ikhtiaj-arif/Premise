import { useContext, useState } from "react";
import { fetchUserAccess, MyContext, TranslationContext } from "../../../App"; // Import new context
import transIcon from "../../../img/Icons/transIcon.png";
import { sortedLanguages } from "../../Premisepool/Languages";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";

// const CommentTranslator = ({
//   comment,
//   translateComment,
//   commentRefetch,
//   setCommentText,
//   setCommentPrefix,
// }) => {
//   const { currentUser } = useContext(MyContext);
//   const { openDropdownId, setOpenDropdownId } = useContext(TranslationContext); // Use global dropdown state
//   const [selectedLanguage, setSelectedLanguage] = useState("bn");
//   const [noAccessPopup, setNoAccessPopup] = useState(false);

//   const handleTranslateComment = async (lang) => {
//     const data = { text_id: comment.id, tar_lang: lang };
//     try {
//       const res = await translateComment(data);
//       const translatedText = res?.data?.text;
//       const translatedPrefix = res?.data?.text_prefix;

//       if (res?.data?.text_prefix) {
//         setCommentText(translatedText);
//         setCommentPrefix(translatedPrefix);
//       } else {
//         setCommentText(res?.data?.text);
//       }
//       commentRefetch();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleLanguageSelect = (key) => {
//     setSelectedLanguage(key);
//     setOpenDropdownId(null); // Close the dropdown after selection
//     handleTranslateComment(key);
//   };

//   const handleTranslate = async () => {
//     const res = await fetchUserAccess(`${currentUser?.id}/PP_Translate`);
//     if (res?.access === "No") {
//       setNoAccessPopup(res);
//     } else {
//       setOpenDropdownId(openDropdownId === comment.id ? null : comment.id); // Open new dropdown & close previous
//     }
//   };

//   return (
//     <div className="relative">
//       <img
//         data-te-toggle="tooltip"
//         title="Translate"
//         src={transIcon}
//         onClick={() => handleTranslate(comment)}
//         className="w-[22px] h-[22px] ml-auto cursor-pointer"
//         alt=""
//       />
//       {openDropdownId === comment.id && (
//         <div className="absolute top-[32px] right-0 z-20 w-[135px] h-[27vh] md:h-[40vh] overflow-y-auto border bg-[#fafafa]">
//           {Object.entries(sortedLanguages).map(([key, name]) => (
//             <li
//               key={key}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleLanguageSelect(key);
//               }}
//               className="cursor-pointer text-[14px] text-[#252525] hover:bg-[#33B0CA] hover:text-[#fafafa] list-none pl-[8px] border-b"
//             >
//               {name}
//             </li>
//           ))}
//         </div>
//       )}
//       {noAccessPopup?.msg === "ShowBecomePrivilege" && (
//         <NoAccessPopUp
//           noAccessPopup={noAccessPopup}
//           setNoAccessPopup={setNoAccessPopup}
//         />
//       )}
//     </div>
//   );
// };

// export default CommentTranslator;

const CommentTranslator = ({
  comment,
  translateComment,
  commentRefetch,
  setCommentText,
  setCommentPrefix,
}) => {
  const { currentUser } = useContext(MyContext);
  const { openDropdownId, setOpenDropdownId } = useContext(TranslationContext);
  const [selectedLanguage, setSelectedLanguage] = useState("bn");
  const [noAccessPopup, setNoAccessPopup] = useState(false);
  const [showMobileSelect, setShowMobileSelect] = useState(false); // ✅ new state

  const handleTranslateComment = async (lang) => {
    const data = { text_id: comment.id, tar_lang: lang };
    try {
      const res = await translateComment(data);
      const translatedText = res?.data?.text;
      const translatedPrefix = res?.data?.text_prefix;

      if (res?.data?.text_prefix) {
        setCommentText(translatedText);
        setCommentPrefix(translatedPrefix);
      } else {
        setCommentText(res?.data?.text);
      }
      commentRefetch();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLanguageSelect = (key) => {
    setSelectedLanguage(key);
    handleTranslateComment(key);
    setShowMobileSelect(false); // ✅ go back to showing image after select
    setOpenDropdownId(null);
  };

  const handleTranslate = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Translate`);
    if (res?.access === "No") {
      setNoAccessPopup(res);
    } else {
      // Desktop logic (open/close dropdown)
      setOpenDropdownId(openDropdownId === comment.id ? null : comment.id);
      // Mobile logic handled separately with showMobileSelect
    }
  };

  return (
    <div className="relative">
      {/* ✅ Desktop Dropdown */}
      <div className="hidden lg:block">
        <img
          data-te-toggle="tooltip"
          title="Translate"
          src={transIcon}
          onClick={() => handleTranslate(comment)}
          className="w-[22px] h-[22px] ml-auto cursor-pointer"
          alt=""
        />
        {openDropdownId === comment.id && (
          <div className="absolute top-[32px] right-0 z-20 w-[135px] h-[27vh] md:h-[40vh] overflow-y-auto border bg-[#fafafa]">
            {Object.entries(sortedLanguages).map(([key, name]) => (
              <li
                key={key}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLanguageSelect(key);
                }}
                className="cursor-pointer text-[14px] text-[#252525] hover:bg-[#33B0CA] hover:text-[#fafafa] list-none pl-[8px] border-b"
              >
                {name}
              </li>
            ))}
          </div>
        )}
      </div>
      {/* ✅ Mobile / Tab → click anywhere on box → show select */}
      <div className="lg:hidden relative p-1  rounded-[4px] flex items-center justify-center">
        {/* Icon (just visual now, not clickable) */}
        <img
          data-te-toggle="tooltip"
          title="Translate"
          src={transIcon}
          className="w-[22px] h-[22px] pointer-events-none" // not blocking clicks
          alt=""
        />

        {/* Full clickable select */}
        <select
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => handleLanguageSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled></option>
          {Object.entries(sortedLanguages).map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {noAccessPopup?.msg === "ShowBecomePrivilege" && (
        <NoAccessPopUp
          noAccessPopup={noAccessPopup}
          setNoAccessPopup={setNoAccessPopup}
        />
      )}
    </div>
  );
};

export default CommentTranslator;
