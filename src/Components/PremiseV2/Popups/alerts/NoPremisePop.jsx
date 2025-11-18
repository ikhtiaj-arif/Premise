import { useNavigate } from "react-router-dom";
import oppsPopup from "../../../../img/oopsImg.webp";
import { baseURL } from "../../../utils";

const NoPremisePop = ({ popClose }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (popClose) {
      popClose();
    }
    // navigate("/");
    window.location.href = `${baseURL}/scriptpad`;
  };
  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21]">
      <div className="h-auto mb-[20px] px-[22px] bottom-0 lg:mb-0 lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA] max-w-[634px] md:mx-auto relative rounded-[8px] ">
        <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
          {/* <img
            src={crossIcon}
            alt="Close"
            className="text-red-500 w-8 h-8 cursor-pointer"
            onClick={handleBack}
          /> */}
        </div>
        <div className="px-[14px] md:px-[20px] py-12 md:py-[30px]">
          <div className="flex items-center justify-center pt-[10px] pb-[26px]">
            <img className="w-[124px] h-[129px]" src={oppsPopup} alt="Oops" />
          </div>
          <div>
            <h1 className="text-[16px] text-center font-[400]">
              The requested premise is not available.
            </h1>
            <h1 className="text-[16px] font-[600] text-center mb-6">
              Please try again.
            </h1>
            {/* <h1 className="text-[16px] font-[600] text-center mb-6">
              It may have been deleted by the owner or set to private.
            </h1> */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleBack}
                className="bg-[linear-gradient(30deg,#741CFF,#00c3ff)]  text-white text-[16px] font-[600] py-2 px-4 rounded-md"
              >
                {/* Back to Premise (idea) Pool */}
                Back To Scriptpad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoPremisePop;
