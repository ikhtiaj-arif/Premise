import React from "react";
import { IoMdArrowDropup, IoMdArrowDropdown,IoMdArrowDropleft } from "react-icons/io";

const Tooltip = ({ text, children, position }) => {
  const tooltipWidth = text.length < 5 ? 45 : Math.ceil(text.length * 8);
  const tooltipStyle = {
    left: '50%',
    transform: 'translateX(-50%)',
    width: `${tooltipWidth}px`,
    userDrag: "none",
    zIndex: '2222'
  };

  return (
    <div className=''>

      <div className={`custom_tooltip  tooltip-${position}`}>
        {children}
        <span className="tooltiptext z-[2]" style={tooltipStyle}>
          
          {text}
          {position === 'bottom' && <IoMdArrowDropup className='absolute top-[-17px] text-[28px] text-[#474747] left-[50%] ml-[-14px]' />}
          {position === 'top' && <IoMdArrowDropdown className='absolute bottom-[-16px] text-[28px] text-[#474747] left-[50%] ml-[-14px]' />}
          {position === 'left' && <IoMdArrowDropleft className='absolute bottom-[-16px] text-[28px] text-[#474747] left-[50%] ml-[-14px]' />}
        </span>
      </div>
    </div>
  );
};

export default Tooltip