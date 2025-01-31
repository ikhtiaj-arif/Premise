import React, { useState } from "react";
import crossIcon from "../../../img/Icons/crossIcon.png";

const ProjectNotfound = ({ setProjectNotFound, isProjectLocked }) => {
  // console.log("xcccccc", isProjectLocked);
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setProjectNotFound(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[10]">
      <div className="modal_css flex items-center justify-center z-50">
        <div className=" w-[85%]  md:w-[95%] mx-auto max-w-[700px] bg-[#fafafa] rounded-[8px]">
          <div className="flex flex-col justify-between h-auto px-[18px] relative ">
            <img
              src={crossIcon}
              alt="cross icon"
              className="text-red-500  z- w-8 h-8  right-[-10px] top-[-10px] cursor-pointer absolute md:top-[-12px] md:right-[-12px]"
              onClick={handleClose}
            />
            <img
              src="https://uidemos.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-12-06+at+18.04+10.png"
              className="mix-blend-multiply h-[100px]  w-[150px] md:h-[164px] md:w-[179px] mx-auto mt-[20px]  "
            />
            <p className="text-[40px] md:text-[60px] text-[#252525] text-center font-[400] mt-[20px] ">
              Oops!
            </p>

            <p className="text-[16px] leading-[24px] text-[#252525] text-center  font-[400] mt-[15px] md:leading-[30px] mb-[30px] md:mt-[30px] md:mb-[30px]  px-[5px] md:px-[110px]">
              {isProjectLocked
                ? "This project is currently locked. You cannot add or modify any beats until the project is unlocked"
                : "There is no associated project with this premise. Seems it was deleted. You cannot add to beat. Please create a new premise"}
            </p>
            {/* <div className="h-[55px] pb-[14px] flex items-center gap-10 justify-center px-[40px]"></dihaw */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectNotfound;
