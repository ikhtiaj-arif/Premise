import React from "react";

export const HeaderOptions = ({ currentUser, data }) => {
  console.log(currentUser);
  return (
    <div>
      <div className=" my-[1.3rem]">
        <div className="flex  items-center">
          <p className="text-[13px] w-[130px] md:w-[180px]">Bill to</p>
          <div>
            {currentUser?.firstName && currentUser?.lastName ? (
              <p className="text-[13px]">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <p className="text-[13px] w-[130px] md:w-[180px]">Email Id</p>
          <p className="text-[13px] text-right">
            {currentUser?.email || "N/A"}
          </p>
        </div>
        <div className="flex items-center">
          <p className="text-[13px] w-[130px] md:w-[180px]">Contact Number</p>
          <div>
            <p className="text-[13px]">{data?.contact || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="text-[13px] w-[130px] md:w-[180px]">Address</p>
          <div>
            <p className="text-[13px]">{data?.address || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="text-[13px] w-[130px] md:w-[180px]">Invoice For</p>
          <p className="text-[13px]">Premisepool</p>
        </div>
      </div>
    </div>
  );
};
