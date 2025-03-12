import React from "react";

export const HeaderOptions = ({ currentUser, data, mnf }) => {
  //console.log("currentUser", currentUser);
  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <div>
      <div className="  lg:text-[16px] text-[12px] font-[400] mt-4 md:mt-0">
        <div className="grid grid-cols-[40%_minmax(60%,_1fr)] mb-1 ">
          <p className=" w-[130px] md:w-[180px] text-[#000000]">
            Bill {mnf ? "by" : "to"} :
          </p>
          <div>
            <p className="text-[#252525]">
              {mnf
                ? "My Next Film Private Limited"
                : `${
                    currentUser?.first_name ||
                    data?.first_name ||
                    data?.firstName ||
                    "N/A"
                  } 
              ${currentUser?.last_name || data?.last_name || data?.lastName}`}
            </p>
          </div>
        </div>

        <div className="  grid grid-cols-[40%_minmax(60%,_1fr)] mb-1">
          <p className=" w-[130px] md:w-[180px] text-[#000000]">
            {mnf ? "Company Address" : "Email Id"} :
          </p>
          <p className="break-words whitespace-normal text-[#252525]">
            {mnf
              ? `4/1, Prem Nagar, New Delhi, Delhi, PIN: 110058, India `
              : currentUser?.email}
          </p>
        </div>
        <div className="  grid grid-cols-[40%_minmax(60%,_1fr)] mb-1">
          <p className=" w-[130px] md:w-[180px] text-[#000000]">
            {mnf ? "GST " : "Contact"} Number :
          </p>
          <div>
            <p className="text-[#252525]">
              {mnf ? "07AAOCM6290K1ZT" : data?.contact || "N/A"}
            </p>
          </div>
        </div>
        {mnf ? (
          <div className="  grid grid-cols-[40%_minmax(60%,_1fr)] mb-1">
            <p className=" w-[130px] md:w-[180px]">State Code :</p>
            <div>
              <p className="">07</p>
            </div>
          </div>
        ) : (
          <div className="  grid grid-cols-[40%_minmax(60%,_1fr)] mb-1">
            <p className=" w-[130px] md:w-[180px] text-[#000000]">Address :</p>
            <div>
              <p className="text-[#252525]">{data?.address || "N/A"}</p>
            </div>
          </div>
        )}
        {mnf ? (
          <div className="  md:hidden grid grid-cols-[40%_minmax(60%,_1fr)] mb-1">
            <p className=" w-[130px] md:w-[180px] text-[#000000]">
              Bill Date :
            </p>
            <div>
              <p className="text-[#252525]">{getFormattedDate()}</p>
            </div>
          </div>
        ) : (
          <>
            {data?.currency_code == "INR" ? (
              <>
                <div className="  grid grid-cols-[40%_minmax(60%,_1fr)] mb-1">
                  <p className=" w-[130px] md:w-[180px] text-[#000000]">
                    GST Number :
                  </p>
                  <div>
                    <p className="text-[#252525]">N/A</p>
                  </div>
                </div>
                <div className="   grid grid-cols-[40%_minmax(60%,_1fr)] mb-1">
                  <p className=" w-[130px] md:w-[180px] text-[#000000]">
                    State Code :
                  </p>
                  <div>
                    <p className="text-[#252525]">{data?.state_code}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className=" grid grid-cols-[40%_minmax(60%,_1fr)] mb-1">
                  <p className=" w-[130px] md:w-[180px] text-[#000000]">
                    LUT ARN :
                  </p>
                  <div className="text-[#252525]">
                    <p className="">AD0702250158447</p>
                  </div>
                </div>
                <p className=" text-[12px] font-[400] text-[#252525]">
                  Supply meant for export under LUT without payment of IGST
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
