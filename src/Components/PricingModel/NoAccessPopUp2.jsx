import React from "react";
import crossIcon from "../../img/croos_icon.png";
import { useNavigate } from "react-router-dom";
import { URL } from "../utils";

const NoAccessPopUp = ({ setNoAccessPopup }) => {
  const navigate = useNavigate();

  const redirectToPrivileges = () => {
    window.location.href = URL + "/pay/pricing";
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[2]">
      <div className=" md:static lg:mt-0 absolute bottom-0 bg-white rounded-[12px] w-[100%] md:w-[612px]">
        <div className="relative">
          <div className="absolute right-[45%] top-[-60px] md:top-[-10px] md:right-[-10px]">
            <img
              src={crossIcon}
              alt=""
              className="w-[40px] h-[40px] z-[99999999] cursor-pointer"
              onClick={() => {
                setNoAccessPopup(null);
              }}
            />
          </div>

          <div className="p-10 text-center">
            <h1 className="text-[#252525] font-[600] leading-[36px] text-[24px]">
              {`Please Become a Privileged Member`}
            </h1>
            <button
              className="bg-[#33b0ca] text-[#fafafa] font-semibold leading-6 text-[16px] rounded-[4px] mt-6 py-[8px] px-[10px]"
              onClick={redirectToPrivileges}
            >
              Become Privileged Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoAccessPopUp;
