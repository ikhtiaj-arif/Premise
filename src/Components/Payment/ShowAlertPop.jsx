import crossIcon from "../../img/Icons/crossIcon.png";

const ShowAlertPop = ({ setPaymentConditionPop, title }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[99999999] ">
      <div className=" bg-white rounded-[12px] w-[90%] lg:w-[612px] relative">
        {/* close popup */}
        <div className="absolute right-[45%] top-[-60px] md:top-[-10px] md:right-[-10px]">
          <img
            src={crossIcon}
            alt=""
            className=" w-[40px] h-[40px] z-[99999999] cursor-pointer"
            onClick={() => {
              setPaymentConditionPop(null);
            }}
          />
        </div>
        <div className="p-[40px] text-center">
          <h2 class="text-[#252525] font-[500] text-[16px] mb-[14px]">
            {title}
          </h2>
          <button
            onClick={() => {
              setPaymentConditionPop(null);
            }}
            className=" bg-[#00c6ff] hover:shadow-md shadow-[#616161]  text-white w-[74px] h-[32px] rounded-[8px] font-[600] text-[14px]"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowAlertPop;
