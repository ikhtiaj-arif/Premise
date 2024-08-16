// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { useAddUserNamePremiseMutation } from "../../app/EndPoints/premisePoolApi";
// import arrowRight from "../../img/Icons/ArrowRicon.png";
// import crossIcon from "../../img/Icons/crossIcon.png";

// const UserNamePopup = ({ setAddPopup, setIsUserName }) => {
//   const [userName, userInfo] = useAddUserNamePremiseMutation();

//   const userId = useSelector((state) => state.user.id);
//   const username = useSelector((state) => state.user.id);

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");

//   const handleSubmit = async () => {
//     const body = {
//       first_name: firstName,
//       last_name: lastName,
//       username: username,
//     };
//     const data = {
//       id: userId,
//       body: body,
//     };
//     const res = await userName(data);

//     if (res?.data) {
//       toast.success(`Successfully updated your username`, {
//         position: toast.POSITION.TOP_CENTER,
//       });
//       setIsUserName(data?.first_name);
//       setAddPopup(false);
//       window.location.reload();
//       return;
//     } else {
//       toast.error("Something went wrong", {
//         position: toast.POSITION.TOP_CENTER,
//       });
//     }
//   };
//   return (
//     // <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0] bg-opacity-60 z-[1]">
//     //   <div className=" bg-slate-100 p-6 rounded-[2px] shadow-lg w-1/2">
//     //     <div className=" flex justify-between items-center pr-2 ">
//     //       <div className="text-center mx-auto">
//     //         <p className="bg-white font-bold px-5 py-1 text-slate-600 rounded">
//     //           Add Your name
//     //         </p>
//     //       </div>
//     //       <div className="text-right flex justify-end">
//     //         <FaTimesCircle
//     //           className=" text-red-500  w-5 h-5 cursor-pointer"
//     //           onClick={() => setAddPopup(false)}
//     //         />
//     //       </div>
//     //     </div>

//     //     <div className=" py-5">
//     //       <div className="flex gap-5 mt-4">
//     //         <input
//     //           type="text"
//     //           name="firstName"
//     //           placeholder="Enter your first name"
//     //           required
//     //           id=""
//     //           maxLength={50}
//     //           //pattern="^[A-Za-z]+(?:[ -][A-Za-z]+)*$"
//     //           className="px-2 w-full py-1 border border-green-600"
//     //           onChange={(e) => setFirstName(e.target.value)}
//     //         />

//     //         <input
//     //           type="text"
//     //           required
//     //           name="lastName"
//     //           placeholder="Enter your last name"
//     //           id=""
//     //           maxLength={50}
//     //           //pattern="^[A-Za-z]+(?:[ -][A-Za-z]+)*$"
//     //           className="px-2 w-full py-1 border border-green-600"
//     //           onChange={(e) => setLastName(e.target.value)}
//     //         />
//     //       </div>

//     //       <div className=" flex gap-5 mt-5 justify-center py-1 text-center">
//     //         <button
//     //           onClick={handleSubmit}
//     //           className="text-white  rounded-[2px] px-4 bg-green-600 btn-sm"
//     //         >
//     //           Confirm
//     //         </button>

//     //         <button
//     //           onClick={() => setAddPopup(false)}
//     //           className="bg-[#33B0CA] btn-sm text-white px-4 rounded"
//     //         >
//     //           Cancel
//     //         </button>
//     //       </div>
//     //     </div>
//     //   </div>
//     // </div>
//     <div className="fixed top-0 left-0 w-full h-[100vh] flex items-center bg-[#252525b0] justify-center z-[1] ">
      
//         <div className="w-full  max-w-[439px] max-h-[539px] pt-[53px] sm:pt-[30px]  relative">
//           {/* close popup */}
//           <div className="text-right flex justify-end h-0 ">
//             <img
//               src={crossIcon}
//               alt=""
//               className="text-red-500 w-8 h-8 top-[-6px] sm:top-[17px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px] absolute z-[1] m-1 cursor-pointer"
//               onClick={() => setAddPopup(false)}
//             />
//           </div>
//           <div className=" bg-[#FAFAFA] h-[301px] rounded-[8px]">
//             <div className=" py-[31px] w-[361px] sm:w-[381px] mx-auto">
//               <p className="text-[#353535] font-[700] text-[18px] text-center">
//                 Please Add Your Name{" "}
//               </p>
//               <div className="  flex flex-col gap-[18px] mt-[39px]">
//                 <input
//                   type="text"
//                   name="firstName"
//                   placeholder="Enter your first name"
//                   required
//                   id=""
//                   maxLength={50}
//                   //pattern="^[A-Za-z]+(?:[ -][A-Za-z]+)*$"
//                   className="px-4 w-full h-[45px] text-[16px] text-[#616161] border border-[#eaeaea] rounded-[8px] focus:outline-none"
//                   onChange={(e) => setFirstName(e.target.value)}
//                 />

//                 <input
//                   type="text"
//                   required
//                   name="lastName"
//                   placeholder="Enter your last name"
//                   id=""
//                   maxLength={50}
//                   //pattern="^[A-Za-z]+(?:[ -][A-Za-z]+)*$"
//                   className="px-4 w-full h-[45px] text-[16px] text-[#616161] border border-[#eaeaea] rounded-[8px] focus:outline-none "
//                   onChange={(e) => setLastName(e.target.value)}
//                 />
//               </div>
//               <div className=" flex flex-row-reverse  mt-[7px]">
//                 <button
//                   onClick={handleSubmit}
//                   type="submit"
//                   className={` bg-[#33B0CA] text-white rounded-[8px] h-[32px] px-[12px] text-[14px] font-[600] flex gap-[12px] items-center `}
//                 >
//                   Next <img src={arrowRight} alt="" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
      
//     </div>
//   );
// };

// export default UserNamePopup;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAddUserNamePremiseMutation, useGetPremiseUserQuery } from "../../app/EndPoints/premisePoolApi";
import { setUser } from "../../app/Slices/userSlice";
import arrowRight from "../../img/Icons/ArrowRicon.png";
import crossIcon from "../../img/Icons/crossIcon.png";
import AddPremise2 from "./Components/AddPremise2";

const UserNamePopup = ({ setAddPopup, setIsUserName,refetch }) => {
  const [userName, userInfo] = useAddUserNamePremiseMutation();
  const { data: userQuery, isUserLoading, refetch:userRefetch } = useGetPremiseUserQuery();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state?.user?.id);
  const userFirstName = userQuery?.first_name;
  const userLastName = userQuery?.last_name;
  // const userLastName = useSelector((state) => state?.user?.lastName);


  const [firstName, setFirstName] = useState(userFirstName || "");
  const [lastName, setLastName] = useState(userLastName || "");
  const [addPrePop, setAddPrePop] = useState(false);
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);

  useEffect(()=>{
if(userLastName && userFirstName){
  setAddPrePop(true)
}

  },[userFirstName, userLastName, userRefetch])

  const handleFirstNameChange = (event) => {
    const value = event.target.value;
    setFirstName(value);
    setIsNextButtonEnabled(value.trim() !== "" && lastName.trim() !== "");
  };

  const handleLastNameChange = (event) => {
    const value = event.target.value;
    setLastName(value);
    setIsNextButtonEnabled(firstName.trim() !== "" && value.trim() !== "");
  };



  const handleSubmit = async () => {
    const body = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      // username: username,
    };
    const data = {
      id: userId,
      body: body,
    };
    const res = await userName(data);

    if (res?.data) {
      toast.success(`Username added successfully!`, {
        position: toast.POSITION.TOP_CENTER,autoClose: 800,
      });
      setIsUserName(data?.first_name);
      setAddPrePop(true);
      userRefetch()
      dispatch(setUser(userQuery));
      
      // window.location.reload();
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,autoClose: 800,
      });
    }
    
  };


  

  return (
    <>
    {addPrePop ? <AddPremise2 setAddPopup={setAddPopup} refetch={refetch} /> :
    <div className="fixed top-0 left-0 w-full h-full flex items-center bg-[#252525b0] justify-center z-[1] ">
      <div className="w-full  max-w-[439px] max-h-[539px] pt-[53px] sm:pt-[30px] relative">
        <div className="text-right flex justify-end h-0">
          <img
            src={crossIcon}
            alt=""
            className="text-red-500 w-8 h-8 top-[-6px] sm:top-[17px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px] absolute z-[1] m-1 cursor-pointer"
            onClick={() => setAddPopup(false)}
          />
        </div>
        <div className="bg-[#FAFAFA] h-[301px] rounded-[8px]">
          <div className="py-[31px] w-[361px] sm:w-[381px] mx-auto">
            <p className="text-[#353535] font-[700] text-[18px] text-center">
              Please Add Your Name{" "}
            </p>
            <div className="flex flex-col gap-[18px] mt-[39px]">
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                required
                id=""
                maxLength={50}
                className="px-4 w-full h-[45px] text-[16px] text-[#616161] bg-[#fafafa] border border-[#eaeaea] rounded-[8px] focus:outline-none"
                onChange={handleFirstNameChange}
              />

              <input
                type="text"
                required
                name="lastName"
                placeholder="Enter your last name"
                id=""
                maxLength={50}
                className="px-4 w-full h-[45px] text-[16px] text-[#616161] bg-[#fafafa] border border-[#eaeaea] rounded-[8px] focus:outline-none "
                onChange={handleLastNameChange}
              />
            </div>
            <div className="flex justify-end mt-[29px]">
              <button
                onClick={handleSubmit}
                type="submit"
                className={`${
                  isNextButtonEnabled
                    ? "bg-[#33B0CA] cursor-pointer"
                    : "bg-[#B0B0B0] cursor-not-allowed"
                } text-white rounded-[8px] h-[34px] px-[12px] text-[14px] font-[600] flex gap-[12px] items-center`}
                disabled={!isNextButtonEnabled}
              >
                Next <img src={arrowRight} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>}
    </>
  );
};

export default UserNamePopup;
