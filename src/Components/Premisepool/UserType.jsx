import { useEffect, useRef, useState } from "react";

const UserType = ({ type, user_type }) => {
  // console.log("from user type", type, user_type);

  const [packageName, setPackageName] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const badgeRef = useRef(null);

  // ✅ Close tooltip on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (badgeRef.current && !badgeRef.current.contains(e.target)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  useEffect(() => {
    if (user_type === "G") {
      setPackageName("Gratis User");
    } else if (user_type === "U") {
      setPackageName("Unprivileged");
    } else if (user_type === "P" && type === "normal") {
      setPackageName("Monthly Privileged");
    } else if (user_type === "P" && type === "yearly") {
      setPackageName("Yearly Privileged");
    } else if (user_type === "P" && type === "Life Member") {
      setPackageName("Life Privileged");
    } else if (user_type === "T") {
      setPackageName("Trial User");
    } else if (user_type === "J") {
      setPackageName("Juggernaut User");
    } else if (user_type === "C") {
      setPackageName("Corporate User");
    } else if (user_type === "I") {
      setPackageName("Institutional Member");
    } else if (user_type === "M") {
      setPackageName("Corporate Member");
    } else if (user_type === "S") {
      setPackageName("Institutional Student");
    } else if (user_type === "O") {
      setPackageName("Other Student");
    }
  }, [type, user_type]);

  return (
    <></>
    // <div>
    //   <span
    //     className="lgFlxVisible notranslate text-[12px]  font-semibold ml-1 border-2 border-solid rounded-full w-[18px] h-[18px]  justify-center items-center text-[#33b0ca] cursor-pointer hover:tooltip-tool hover:tooltip hover:tooltip-bottom lg:hover:tooltip-top"
    //     data-te-toggle="tooltip"
    //     title={packageName}
    //   >
    //     {user_type}
    //   </span>
    //   <div ref={badgeRef} className="relative lgHidden">
    //     <span
    //       onClick={() => setShowTooltip((prev) => !prev)}
    //       className="notranslate text-[12px] font-semibold ml-1 border-2 border-solid rounded-full
    //                w-[18px] h-[18px] flex justify-center items-center
    //                text-[#33b0ca] cursor-pointer"
    //     >
    //       {user_type}
    //     </span>

    //     {/* ✅ Custom tooltip */}
    //     {showTooltip && (
    //       <div
    //         className="absolute z-50 mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap
    //                     bg-[#252525] text-white text-[11px] px-2 py-1 rounded-md shadow-lg"
    //       >
    //         {packageName}
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};

export default UserType;
