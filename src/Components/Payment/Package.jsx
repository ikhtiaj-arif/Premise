import React from "react";

export const Package = ({ data, typeOfRequest, fromLimit }) => {
  return (
    <div className="w-full lg:w-[80%] h-full">
      <p
        style={{
          clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 0% 50%)",
          maxWidth: "60%",
          padding: "0.3rem 25px 0.3rem 0",
        }}
        className="bg-[#33B0CA] text-[#fafafa] text-center text-[16px] font-[600]  relative border-none bottom-[-17px]"
      >
        Package Details
      </p>

      <div className=" border-2 rounded-[8px] min-h-[285px] border-[#ccc] w-full p-5">
        <h2 className="text-[20px] font-[600] leading-6 text-[#252525] ">
          Premisepool <span className=" capitalize">{typeOfRequest}</span>
        </h2>

        {!fromLimit ? (
          <div>
            <div className="flex items-center justify-between py-2">
              <h3 className="text-[14px]">Project Name :</h3>
              <div className="text-right">
                <p className="text-[14px] font-medium">{data?.projet_name}</p>
              </div>
            </div>
          </div>
        ) : (
          ["PD_loglines", "PD_OnePagers", "PD_Pitches"]?.map((serviceName) =>
            data
              ?.filter((item) => item?.service_name == serviceName)
              .map((item, index) => (
                <div
                  key={`${item?.service_name}-${index}`}
                  className="flex items-center justify-between py-2"
                >
                  <h3 className="text-[14px]">
                    {item?.service_name === "PD_loglines" && "Logline "}
                    {item.service_name === "PD_OnePagers" && "Onepager "}
                    {item.service_name === "PD_Pitches" && "Elevator Pitch "}
                  </h3>
                  <div className="text-right">
                    <p className="text-[14px] font-medium">
                      {item?.service_count}
                    </p>
                  </div>
                </div>
              ))
          )
        )}
      </div>
    </div>
  );
};
