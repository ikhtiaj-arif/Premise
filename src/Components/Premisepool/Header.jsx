// import React, { useState } from 'react';
// import { FaEllipsisV, FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useDispatch } from 'react-redux';
// import msgIcon from "../../img/Icons/msgIcon.png";
// import userImg from "../../img/Icons/userImg.png";

// const Header = ({created_by,formattedDate,formattedTime, user }) => {
//     const [premiseOwner, setPremiseOwner] = useState(false);
//     const [isLiked, setIsLiked] = useState(false);
  
//     const [imageLoaded, setImageLoaded] = useState(false);
//     // const {data: isHideUnhide, isLoading, refetch: hideUnhideRefetch} = useGetHideUnhidePremiseQuery(id)
//     // console.log("isHideUnhide", isHideUnhide);
  
//     const [editMode, setEditMode] = useState(false);
//     const [userMail, setUserMail] = useState(false);
//     const [ownerMail, setOwnerMail] = useState(false);
//     const dispatch = useDispatch();
//     const [openDotMenu, setOpenDotMenu] = useState(null);
//     // const dotPopupRef = useRef(null);
//     const [premiseId, setPremiseId] = useState(null);
//     return (
//         <div>
//               <div className="block ">
//         <a
//               target="_blank"
//               rel="noreferrer"
//               href={`${URL}/memberpage/#/user/${created_by?.id}`}
//             >
//           <div className="flex-1 flex gap-1 items-center">
            
            
//               <img src={userImg} className="w-[32px]" alt="" />
//               <h4 className="text-[#252525] font-[500] text-[14px] capitalize cursor-pointer">
//                 {created_by?.first_name} {created_by?.last_name}
//               </h4>
//           </div>
//             </a>

//           <div className="text-[#616161] text-[12px] flex gap-[8px] font-[400]  ml-[36px] leading-3">
//             <p>{formattedDate},{" "}
//             {formattedTime} GMT</p>
//           </div>
//         </div>
//         <div>
//           {" "}
//           {created_by.id === user ? (
//             <div className="flex gap-[3px] items-center mr-[2px] relative ">
//               <img
//                 data-te-toggle="tooltip"
//                 title="Check Mails"
//                 src={msgIcon}
//                 className="w-8 h-8 cursor-pointer"
//                 alt=""
//                 onClick={() => setOwnerMail(true)}
//               />
//               {/* <FaRegTrashAlt
//                 data-te-toggle="tooltip"
//                 title="Delete"
                
//                 onClick={() => handleDelete(id)}
//                 className="w-5 h-5 cursor-pointer "
//                 alt=""
//               /> */}
//               <FaEllipsisV
//                 onClick={() => {
//                   setOpenDotMenu((prevIndex) =>
//                     prevIndex === index ? null : index
//                   );
//                 }}
//                 className="w-5 h-5 cursor-pointer"
//               />
//               {openDotMenu === index && (
//                 <div
//                   // ref={dotPopupRef}

//                   className="absolute   w-[172.99px] text-[14px] font-[400] text-[#616161] px-3 bg-[#fafafa] rounded-[8px] shadow-md border border-[#eaeaea] top-[33px] right-[6px] z-10"
//                 >
//                   {hidden ? (
//                     <button
//                       className="cursor-pointer flex items-center  gap-[8px] py-2"
//                       onClick={() => handleHideUnhidePremise(id)}
//                     >
//                       {" "}
//                       <FaEye className="h-3 w-3 mt-[2px]" />{" "}
//                       <p> Unhide From Others</p>{" "}
//                     </button>
//                   ) : (
//                     <button
//                       className="cursor-pointer flex items-center  gap-[8px] py-2"
//                       onClick={() => handleHideUnhidePremise(id)}
//                     >
//                       {" "}
//                       <FaEyeSlash className="h-3 w-3 mt-[2px]" />{" "}
//                       <p className=""> Hide From Others</p>
//                     </button>
//                   )}

//                   {/* */}
//                 </div>
//               )}
//             </div>
//           ) : (
//             <img
//               data-te-toggle="tooltip"
//               title="Send Mail"
//               src={msgIcon}
//               className="w-8 h-8 cursor-pointer"
//               alt=""
//               onClick={() => setUserMail(true)}
//             />
//           )}
//         </div>
//         </div>
//     );
// };

// export default Header;