import { ToastContainer } from "react-toastify";
import crossIcon from "../../../img/Icons/crossIcon.png";
import Congrats from "../../../img/thumb.webp";

const SuccessPop = ({ popClose, requestType, parentClose }) => {
  const handleClose = () => {
    popClose(null);
    parentClose(null);
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center xl:mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[21] ">
      <ToastContainer />
      <div className=" h-[50vh] sm:h-[300px] p-5 mb-[20px] px-[22px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full sm:w-[90%] bg-[#fff] max-w-[605px]  md:mx-auto relative rounded-[8px]">
        {/* close popup */}
        <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
          <img
            src={crossIcon}
            alt=""
            className=" text-red-500  w-8 h-8 cursor-pointer"
            onClick={handleClose}
          />
        </div>

        <div className="flex flex-col  items-center justify-start">
          <img className="w-[140px] " src={Congrats} alt="Congrats"></img>
          {requestType === "translation" ? (
            <h2 className="font-[500] text-[20px]  text-center ">
              Translation Request Sent.
            </h2>
          ) : (
            <h2 className="font-[500] text-[20px]  text-center ">
              Purchase Request Sent.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPop;
