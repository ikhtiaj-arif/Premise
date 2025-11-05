import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../App";
import { useCommentPremiseMutation } from "../../app/EndPoints/premisePoolApi";
import idaSuggestion from "../../img/Icons/ida_suggestion.png";
import { baseURL } from "../utils";

const AskIda = ({
  id,
  source_language,
  user,
  commentRefetch,
  setOpenAllReplies,
  setOpenReplyFieldID,
  lastCommentRef,
  premiseOwner,
  isLoading,
  setIsLoading,
  setNoAccessPopup,
  setService,
  messagesEndRef,
}) => {
  const { currentUser } = useContext(MyContext);
  const [postComment, { isLoading: isPostLoading }] =
    useCommentPremiseMutation();

  const token = localStorage.getItem("accessToken");
  const header = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    if (premiseOwner?.id === currentUser?.id) {
      checkAllowance("PP_AllowBrainstoming");
    } else {
      checkAllowance("PP_AllowInteraction");
    }
  };

  // console.log(source_language);

  const checkAllowance = async (flag) => {
    const res = await fetchUserAccess(`${flag}`);

    if (res?.has_access === false) {
      setNoAccessPopup(res);
      setService(flag);
      setIsLoading(false);
    } else {
      handleSubmitComment();
    }
  };

  const handleSubmitComment = async () => {
    const translations = {
      ar: "يرجى المتابعة، Ida!", // Corrected Arabic translation
      be: "Калі ласка, працягвайце далей, Ida!", // Belarusian
      bn: "অনুগ্রহ করে আরো এগিয়ে যান, Ida!", // Bengali
      de: "Bitte fahren Sie fort, Ida!", // German
      en: "Please proceed further, Ida!", // English
      es: "¡Por favor, procede más adelante, Ida!", // Spanish
      fr: "Veuillez continuer, Ida!", // French
      gl: "Por favor, continua máis adiante, Ida!", // Galician
      gu: "કૃપા કરીને આગળ વધો, Ida!", // Gujarati
      hi: "कृपया आगे बढ़ें, Ida!", // Hindi
      id: "Silakan lanjutkan lebih jauh, Ida!", // Indonesian
      kn: "ದಯವಿಟ್ಟು ಮುಂದುವರಿಯಿರಿ, Ida!", // Kannada
      ml: "ദയവായി തുടരുക, Ida!", // Malayalam
      mr: "कृपया पुढे जा, Ida!", // Marathi
      ne: "कृपया अगाडि बढ्नुहोस्, Ida!", // Nepali
      or: "ଦୟାକରି ଆଗକୁ ଯାଆନ୍ତୁ, Ida!", // Oriya
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਅੱਗੇ ਵਧੋ, Ida!", // Punjabi
      ru: "Пожалуйста, продолжайте дальше, Ida!", // Russian
      st: "Ka kopo, tsoela pele, Ida!", // Sesotho
      ta: "தயவுசெய்து மேலும் தொடரவும், Ida!", // Tamil
      te: "దయచేసి మరింత కొనసాగించండి, Ida!", // Telugu
      ur: "براہ کرم مزید آگے بڑھیں, Ida!", // Urdu
    };

    setIsLoading(true);
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    try {
      // Fetch the existing comment data
      const response = await axios.get(
        `${baseURL}/brainstorm/GetCommentAPInew/${id}`,
        {
          headers: header,
        }
      );

      if (response) {
        const commentText = translations[source_language] || translations["en"];

        const brainstormData = localStorage.getItem("BrainstormData");
        const sceneData = JSON.parse(brainstormData);

        const updatedPremiseId = sceneData?.premiseId;
        const lastSceneNumber = sceneData?.lastSceneNumber;

        let c_value = response?.data?.count + 1;

        const body = {
          premise: id,
          text: commentText,
          ask_ida: true,
          user: user,
          C: c_value, // Update the comment count
          ...(updatedPremiseId === id && lastSceneNumber
            ? { C_from_scriptpad: lastSceneNumber }
            : {}),
          is_question: false,
        };

        // Post the new comment
        const res = await postComment(body);

        // if (res?.error) {
        //   toast.error("Failed to add comment. Please try again.", {
        //     position: toast.POSITION.TOP_CENTER,
        //     autoClose: 800,
        //   });

        //   setIsLoading(false);
        // } else {
        setIsLoading(false);

        // here scroll all the way down to a div using ref
        setTimeout(() => {
          commentRefetch(); // Refetch the comments after adding the new one

          if (updatedPremiseId === id) {
            localStorage.removeItem("BrainstormData");
          }
          // setOpenAllReplies(true);
          // setOpenReplyFieldID(res?.data?.id);
        }, 1000);
        const crdRes = await fetchUserAccess(`PP_AllowBrainstoming`);
        const remainingCredits = crdRes?.remaining_credits ?? 0;
        const creditElement = document.getElementById("creditBalance");
        if (creditElement) {
          creditElement.textContent = remainingCredits;
        }
        setTimeout(() => {
          // if (lastCommentRef.current) {
          //   lastCommentRef.current.scrollTo({
          //     top: lastCommentRef.current.scrollHeight,
          //     behavior: "smooth",
          //   });
          // }
          toast.success("Comment added!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1600,
          });
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 1100);
        // }
      }
    } catch (error) {
      toast.error("Failed to add comment. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1600,
      });

      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="p-[1px] text-center h-[36px] bg-[linear-gradient(30deg,#741CFF_0%,#00C3FF_70%)] rounded-[8px]">
        <button
          disabled={isLoading}
          onClick={handleButtonClick}
          className={` border-none rounded-[8px] px-4 h-[34px] text-[#741CFF] text-[14px]  font-[500] leading-[21px] ${
            isLoading
              ? "bg-[linear-gradient(30deg,#b38bff,#99e6ff)] cursor-default"
              : "bg-[#fff]"
          } flex items-center justify-center`}
        >
          <img
            src={idaSuggestion}
            alt="idaSuggestin"
            className="mr-2 w-[26px]"
          />
          <h4 class="text-[14px]  font-[500] leading-[21px] w-full  bg-[linear-gradient(30deg,#741CFF,#00C3FF)] bg-clip-text text-transparent">
            Ask Ida for more!
          </h4>
        </button>
      </div>
    </div>
  );
};

export default AskIda;
