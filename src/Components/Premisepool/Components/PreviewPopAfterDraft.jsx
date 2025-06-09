import { useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { usePostPremiseWithCharactersMutation } from "../../../app/EndPoints/Characters/Characters";
import { useDeletePremiseMutation } from "../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../img/Icons/crossIcon.png";

const PreviewPopAfterDraft = ({
  popClose,
  setOpenPop,
  premise,
  charSaveDisable,
  finalPostPremiseDemoPop,
  setFinalPostPremiseDemoPop,
  setCharacterEditPop,
  setOpenCharacterChart,
  refetch,
}) => {
  const [finalSubmitLoading, setFinalSubmitLoading] = useState(false);
  const [agreeToPost, setAgreeToPost] = useState(false);
  const splitText = premise.text.split("+");
  const dText = splitText[1];
  const stylings = JSON?.parse(splitText[0]);
  const [viewText, setViewText] = useState(splitText[1]);
  const { boldStyle, italicStyle, underlineStyle, hexColor } = stylings;

  const [postPremiseWithCharacters, updatePostPremiseResInfo] =
    usePostPremiseWithCharactersMutation();
  const [deletePremise] = useDeletePremiseMutation();

  const deletePremiseWhenFailed = async (id) => {
    const response = await deletePremise(id);
    if (response) {
      popClose();
    }
  };

  const handlePremisePostToGetComments = async () => {
    setFinalSubmitLoading(true);
    try {
      const data = {
        id: premise.id,
      };

      try {
        const response = await postPremiseWithCharacters(data);
        if (response.error) {
          await deletePremiseWhenFailed(premise.id);
          return;
        }
        if (response) {
          console.log("response");
          setOpenPop(true);
          setOpenCharacterChart(false);
          popClose();
          const finalPostDemoPop = localStorage.getItem("finalPostDemoPop");
          if (
            (!finalPostDemoPop || finalPostDemoPop === "false") &&
            !finalPostPremiseDemoPop
          ) {
            setFinalPostPremiseDemoPop(true);
          }
          setFinalSubmitLoading(false);

          //   const afterFinalPopDemo = localStorage.getItem(
          //     "afterFinalPostPremise"
          //   );
          //   if (
          //     (!afterFinalPopDemo || afterFinalPopDemo === "false") &&
          //     !finalPostPremiseDemoPop
          //   ) {
          //     setAfterFinalPostPremiseDemoPop(true);
          //   }

          refetch();
        } else {
          throw new Error("Failed to post premise with characters");
        }
      } catch (error) {
        // console.error("An error occurred:", error);
        setFinalSubmitLoading(false);
        // Handle any additional error cases here
      }
    } catch (error) {
      setFinalSubmitLoading(false);
      deletePremiseWhenFailed(premise.id);
      // console.error("Error in handlePremisePostToGetComments:", error);
    }
  };
  console.log(premise);
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21]">
      <div
        className=" h-[100vh] lg:h-auto  mb-[20px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA] 
       lg:w-[676px]  md:mx-auto relative lg:rounded-[8px]"
      >
        <div className="hidden md:absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
          <img
            src={crossIcon}
            alt=""
            className=" text-red-500  w-8 h-8 cursor-pointer"
            onClick={() => popClose(null)}
          />
        </div>
        <MdKeyboardBackspace
          src={crossIcon}
          alt=""
          className="text-[#33B0CA] ml-[20px] text-left text-[38px] z-[1] absolute cursor-pointer mdHidden"
          onClick={() => {
            popClose(null);
          }}
        />

        <div>
          <div>
            {" "}
            <p className="block text-[17px] text-center my-2 mx-auto font-[500] text-[#252525] ">
              Preview your Imagination
            </p>
          </div>
          {/* center */}
          <div
            className={`bg-[#FAFAFA] mt-2 
             h-[184px]
          flex justify-center items-center relative mx-[18px] md:mx-[28px] rounded-[8px] `}
            style={
              premise.bg_img
                ? {
                    backgroundImage: `url(${premise.bg_img})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "88%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }
                : {
                    //   backgroundColor: randomColor,
                    boxShadow: `0 0 12px rgba(0, 0, 0, 0.08)`,
                  }
            }
          >
            {/* edited text */}
            <div
              style={{ boxShadow: `0 0 12px rgba(0, 0, 0, 0.08)` }}
              // className="absolute shadow-md inset-0 text-[14px] backdrop-filter backdrop-blur-sm flex p-5 rounded-[8px]">
              className="absolute inset-0  backdrop-blur-sm  text-[14px]  rounded-[8px] overflow-hidden break-words px-[20px] py-[12px]"
            >
              <p
                className={`${boldStyle} ${italicStyle} ${underlineStyle} ${hexColor} notranslate`}
                style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
              >
                {viewText}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-[8px] ml-8 mr-2">
            <input
              className=" cursor-pointer"
              type="checkbox"
              id="checkbox"
              onChange={() => setAgreeToPost(!agreeToPost)}
              checked={agreeToPost}
            />
            <p htmlFor="checkbox" className="text-[12px] leading-4">
              I understand that after posting the Premise, I will not be able to
              edit the proposed characters.
            </p>
          </div>
          {/* button div */}
          <div className={` w-[96%] flex justify-end mr-3  text-center my-3`}>
            {finalSubmitLoading ? (
              <div
                disabled={finalSubmitLoading}
                className={` text-white cursor-auto max-w-[120px] rounded-[8px] h-[32px] px-[28px] text-[14px] font-[600] bg-[#33B0CA]`}
              >
                Posting...
              </div>
            ) : (
              <div className="flex gap-2 items-center ">
                <div
                  onClick={() => {
                    // setFinalSubmitLoading(false);
                    // setCharacterEditPop(true);
                    popClose();
                  }}
                  // disabled={}
                  className={`  flex justify-center items-center cursor-pointer rounded-[8px] h-[32px] px-[28px]
                             text-[14px] font-[600] border border-[#33B0CA]  text-[#33B0CA] `}
                >
                  Back To Character List
                </div>

                <button
                    disabled={!agreeToPost}
                        onClick={handlePremisePostToGetComments}
                        className={` text-white flex justify-center items-center  rounded-[8px] h-[32px] px-[28px] text-[14px] 
                          font-[600] ${
                            agreeToPost ? "bg-[#33B0CA] " : "bg-[#ACDDE7]"
                          }`}
                >
                  Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPopAfterDraft;
