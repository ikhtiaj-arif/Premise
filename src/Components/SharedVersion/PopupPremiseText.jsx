import React from "react";

const PopupPremiseText = ({
  data,
  bg_img,
  bg_color,
  stylings,
  viewText,
  dText,
  className,
  className2,
}) => {
  const { boldStyle, italicStyle, underlineStyle, hexColor } = stylings;
  return (
    <div
      className={`mx-auto h-[187px] w-full ${data && 'lg:w-[88%]'}  lg:my-auto border border-[#eaeaea]  relative  rounded-[8px] ${className}`}
      style={{
        background: `${
          bg_img
            ? `url(${bg_img})`
            : bg_color
            ? bg_color
            : `url(${data?.backgroundImage})`
        }`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        borderRadius: "8px",
        backgroundPosition: "center",
      }}
      //   style={{
      //     background: `${
      //       bg_color && bg_color

      //     }`,

      //     borderRadius: "8px",

      //   }}
    >
      {/* {bg_img &&  <img src={bg_img} alt="" className="rounded-[8px] bg-cover bg-no-repeat h-[25.6vh] lg:h-[270px]  w-full " />} */}
      <div
        // className="absolute inset-0 flex items-center justify-center backdrop-blur-sm px-2 md:text-xl lg:text-xl border border-[#EAEAEA] bg-[#FAFAFA] rounded-[8px] max-w-[383px]"
        className={`${
          bg_img || bg_color !== "#FAFAFA" ? "p-[12px]" : "px-[18px] "
        } absolute inset-0  backdrop-blur-sm  text-[14px] rounded-[8px] overflow-hidden break-words`}
      >
        {/* premise text */}
        {viewText ? (
          <p
            className={`${boldStyle} ${italicStyle} ${underlineStyle} ${hexColor} text-[14px] ${className2} notranslate `}
          >
            {viewText}
          </p>
        ) : (
          <p
            className={`${boldStyle} ${italicStyle} ${underlineStyle} ${hexColor} text-[14px] ${className2} notranslate`}
          >
            {dText}
          </p>
        )}
      </div>
    </div>
  );
};

export default PopupPremiseText;
