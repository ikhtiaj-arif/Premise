import React from "react";

export const Package = ({ data, typeOfRequest, fromLimit }) => {
  return (
    <div className="w-full lg:w-[80%] h-full">
      <p
        style={{
          clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 0% 50%)",
          maxWidth: "70%",
          padding: "0.3rem 25px 0.3rem 0",
        }}
        className="bg-[#33B0CA] text-[#fafafa] text-center lg:text-[22px] text-[16px] font-[600]  relative border-none lg:bottom-[-22px] bottom-[-17px]"
      >
        Package Details
      </p>

      <div className=" border-2 rounded-[8px] min-h-[285px] border-[#ccc] w-full p-5">
        <h2 className="lg:text-[20px] text-[16px] font-[600] leading-6 text-[#252525] mt-3">
          The Premisepool (HSN : 998316){" "}
          {/* <span className=" capitalize">{typeOfRequest}</span> */}
        </h2>

        {!fromLimit ? (
          <>
            <div className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] font-[400] text-[#616161]">
              <h3>Project Name :</h3>
              <p className="text-right font-semibold text-[#252525]">
                {data?.project_name}
              </p>
            </div>
            {/* <div className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] font-[400] text-[#616161]">
              <h3>Project Name :</h3>
              <p className="text-right font-semibold text-[#252525]">
                {typeOfRequest}
              </p>
            </div> */}
          </>
        ) : (
          [
            "PP_Brainstrom",
            "PP_Monitizes",
            "PP_Premises",
            "PP_interactions",
            "PP_Private",
            "PP_Beats",
          ]?.map((serviceName) =>
            data
              ?.filter((item) => item?.service_name == serviceName)
              .map((item, index) => (
                <div
                  key={`${item?.service_name}-${index}`}
                  className="flex items-center justify-between py-2 lg:text-[16px] text-[14px] font-[400] text-[#616161]"
                >
                  <h3>{item?.filedName}</h3>
                  <p className="text-right font-semibold text-[#252525]">
                    {item?.service_count}
                  </p>
                </div>
              ))
          )
        )}
      </div>
    </div>
  );
};
