
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAddUserNamePremiseMutation, useGetPremiseUserQuery } from "../../app/EndPoints/premisePoolApi";
import { setUser } from "../../app/Slices/userSlice";
import arrowRight from "../../img/Icons/ArrowRicon.png";
import crossIcon from "../../img/Icons/crossIcon.png";
import AddPremise2 from "./Components/AddPremise2";
import { fetchUserAccess, MyContext } from "../../App";
import NoAccessLbPopUp from "../PricingModel/NoAccessLbPopUp";

const UserNamePopup = ({ setAddPopup,refetch }) => {
  const [userName, userInfo] = useAddUserNamePremiseMutation();
  const { data: userQuery, isUserLoading, refetch:userRefetch } = useGetPremiseUserQuery();
  const dispatch = useDispatch();
  const {
      currentUser,
    } = useContext(MyContext);

  const userId = useSelector((state) => state?.user?.id);
  const userFirstName = userQuery?.first_name;
  const userLastName = userQuery?.last_name;
  // const userLastName = useSelector((state) => state?.user?.lastName);


  const [firstName, setFirstName] = useState(userFirstName || "");
  const [lastName, setLastName] = useState(userLastName || "");
  const [addPrePop, setAddPrePop] = useState(null);
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);

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
      handleAddPopup();
      userRefetch()
      dispatch(setUser(userQuery));
      
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,autoClose: 800,
      });
    }
    
  };

  const handleAddPopup = async () => {
        const res = await fetchUserAccess(`${currentUser?.id}/PP_PostPremise`);
        console.log("add premise res", res);
        if (res?.access == "No") {
          setAddPrePop("No");
        } else {
          setAddPrePop("Yes");
        }
    };


  

  return (
    <>
    {addPrePop =='No' ? <NoAccessLbPopUp setNoAccessPopup={setAddPopup} service='PP_Premises'/> 
    : addPrePop =='Yes' ? <AddPremise2 setAddPopup={setAddPopup} refetch={refetch} /> 
    :
    <div className="fixed top-0 left-0 w-full h-full flex items-center bg-[#252525b0] justify-center z-[1] ">
      <div className="w-full  max-w-[439px] max-h-[539px] pt-[53px] sm:pt-[30px] relative">
        <div className="text-right flex justify-end h-0">
          <img
            src={crossIcon}
            alt=""
            className="text-red-500 w-8 h-8 top-[-6px] sm:top-[17px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px] absolute z-[1] m-1 cursor-pointer"
            onClick={() => setAddPopup(null)}
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
