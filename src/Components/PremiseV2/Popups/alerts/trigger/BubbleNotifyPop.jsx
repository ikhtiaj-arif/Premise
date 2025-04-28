// import React from "react";
// // import { config, Url } from "../../MyServer";
// import crossIcon from "../../../../../img/Icons/crossIcon.png";
// import premiseSr from "../../../../../img/premise_sr.jpg";

// const BubbleNotifyPop = ({ onClose, }) => {
//   const handleCheckboxChange = (e) => {
//     const isChecked = e.target.checked;
//     if (isChecked) {
//       localStorage.setItem("doNotShowBubblePopup", "true");
//     } else {
//       localStorage.removeItem("doNotShowBubblePopup");
//     }
//   };

//   return (
//     <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[2]">
//       <div className=" lg:static py-8  absolute lg:mt-[50px] bottom-0 bg-white rounded-[12px] w-[100%] lg:w-[643px]">
//         <div className="relative rounded-[8px] py-8 bg-[#fff]">
//           <div className="absolute right-[45%] top-[-90px] md:top-[-48px] md:right-[-18px]">
//             <img
//               src={crossIcon}
//               onClick={onClose}
//               alt=""
//               className="w-[40px] h-[40px]  z-[9] cursor-pointer"
//             />
//           </div>

//           <div className="flex flex-col justify-center items-center">
//             <div className="flex flex-col items-center">
//               <img
//                 src={`https://uidemos.s3.ap-south-1.amazonaws.com/smiley.jpg`}
//                 alt="Smile doodle"
//                 className="w-[130px] h-[118px]"
//               />
//               <p className="text-center text-[16px] font-medium text-[#33b0ca] translate-y-3">
//               Need Help Choosing?
//               </p>
//             </div>

//             <div className="flex flex-col items-center gap-[6px] mb-5 mt-1">
//               <h2 className="text-[16px] font-medium text-[#252525] translate-y-3 text-center">
//               Start with a Premise
//               </h2>
            
//               <img src={premiseSr} alt="" className="max-w-[380.58px] mt-4" />
              
//             </div>

//             <div className="flex flex-col items-center gap-[6px] mb-5">
//               {/* <button
//                 // onClick={() => (window.location.href = Url + "/scriptpad2")}
//                 className="w-[131px] h-[32px] rounded bg-[#33b0ca] text-[14px] font-semibold text-[#fafafa]"
//               >
//                 Let's write
//               </button> */}
//             </div>

//             <div className="flex items-center justify-center gap-2">
//               <input
//                 type="checkbox"
//                 id="do-not-show"
//                 className="cursor-pointer"
//                 onChange={handleCheckboxChange}
//               />
//               <label
//                 htmlFor="do-not-show"
//                 className="cursor-pointer text-sm text-gray-700"
//               >
//                 Do not show this to me again.
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BubbleNotifyPop;
