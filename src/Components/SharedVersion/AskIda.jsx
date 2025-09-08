import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../App";
import { useCommentPremiseMutation } from "../../app/EndPoints/premisePoolApi";
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
    const res = await fetchUserAccess(`${currentUser?.id}/${flag}`);
    console.log(`${flag} res`, res);
    if (res?.access === "No") {
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

    try {
      // Fetch the existing comment data
      const response = await axios.get(
        `${baseURL}/ideamall/GetCommentAPI/${id}`,
        {
          headers: header,
        }
      );

      if (response) {
        const commentText = translations[source_language] || translations["en"];

        const body = {
          premise: id,
          text: commentText,
          ask_ida: true,
          user: user,
          C: response?.data?.counts + 1, // Update the comment count
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
          setOpenAllReplies(true);
          setOpenReplyFieldID(res?.data?.id);
        }, 1000);

        setTimeout(() => {
          if (lastCommentRef.current) {
            lastCommentRef.current.scrollTo({
              top: lastCommentRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
          toast.success("Comment added!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1600,
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
      <div className="my-1 text-center ">
        <button
          disabled={isLoading}
          onClick={handleButtonClick}
          className={` border-none rounded-[8px] px-4 h-[32px] text-white text-[12px] md:text-[14px] font-[600] leading-[21px] ${
            isLoading ? "bg-[#ACDDE7]   cursor-default" : "bg-[#33B0CA]"
          }`}
        >
          Ask Ida for more!
        </button>
      </div>
    </div>
  );
};

export default AskIda;
