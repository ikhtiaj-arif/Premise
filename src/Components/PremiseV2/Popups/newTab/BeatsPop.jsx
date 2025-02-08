import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useGetPremiseBeatsDataQuery } from "../../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import ShowBeats from "./ShowBeats";

const BeatsPop = ({ popClose, id }) => {
  const {
    data: beatsDataJson,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetPremiseBeatsDataQuery(id);

  const beatsData = beatsDataJson?.data;

  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[1] ">
      <ToastContainer />
      <div className=" h-[100vh] lg:h-[80vh] mb-[20px] px-[32px] lg:mb-0  lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:bg-[#FAFAFA]  lg:w-[1052px]  md:mx-auto relative lg:rounded-[8px]">
        {/* close popup */}
        <img
          src={crossIcon}
          alt=""
          className="text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer lgVisible  "
          onClick={() => {
            popClose(false);
          }}
        />
        {isPremiseLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {/* header */}
            <div className="flex justify-between items-center mb-6 mt-8">
              <h2 className="text-[24] font-semibold">
                Content added to Beat sheet :
              </h2>
              <div className="space-x-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-[12px] py-[2px] text-[16px] rounded-[8px] ${
                    activeTab === "all"
                      ? "border-none bg-[#33b0ca] text-[#fafafa] "
                      : "border border-[#616161] text-[#616161] bg-white"
                  } `}
                >
                  All (
                  {beatsData?.setup?.length +
                    beatsData?.conflict?.length +
                    beatsData?.resolution?.length}
                  )
                </button>
                <button
                  onClick={() => setActiveTab("setup")}
                  className={`px-[12px] py-[2px] text-[16px] rounded-[8px] ${
                    activeTab === "setup"
                      ? "border-none bg-[#33b0ca] text-[#fafafa] "
                      : "border border-[#616161] text-[#616161] bg-white"
                  } `}
                >
                  Setup ({beatsData?.setup?.length})
                </button>
                <button
                  onClick={() => setActiveTab("conflict")}
                  className={`px-[12px] py-[2px] text-[16px] rounded-[8px] ${
                    activeTab === "conflict"
                      ? "border-none bg-[#33b0ca] text-[#fafafa] "
                      : "border border-[#616161] text-[#616161] bg-white"
                  } `}
                >
                  Conflict ({beatsData?.conflict?.length})
                </button>
                <button
                  onClick={() => setActiveTab("resolution")}
                  className={`px-[12px] py-[2px] text-[16px] rounded-[8px] ${
                    activeTab === "resolution"
                      ? "border-none bg-[#33b0ca] text-[#fafafa] "
                      : "border border-[#616161] text-[#616161] bg-white"
                  } `}
                >
                  Resolution ({beatsData?.resolution?.length})
                </button>
              </div>
            </div>

            {/* Table */}
            <table className="table-auto h-[65vh] overflow-y-auto border-collapse border border-gray-300 w-full text-left">
              <thead>
                <tr className="bg-[#fafafa]">
                  <th className="border text-[16px] font-medium border-[#616161] px-2 py-2 w-[50px] text-center">
                    S.No
                  </th>
                  <th className="border text-[16px] font-medium border-[#616161] px-2 py-2 text-center">
                    Comment/Reply/Brainstorm
                  </th>
                  <th className="border text-[16px] font-medium border-[#616161] px-2 py-2 text-center">
                    Beat Text
                  </th>
                </tr>
              </thead>
              {activeTab === "all" && (
                <tbody>
                  {/* Map over Setup */}
                  {beatsData?.setup?.map((item, index) => (
                    <ShowBeats title="Setup" length={index + 1} {...{ item }} />
                  ))}

                  {/* Map over Conflict */}
                  {beatsData?.conflict?.map((item, index) => (
                    <ShowBeats
                      title="Conflict"
                      length={beatsData?.setup?.length + index + 1}
                      {...{ item }}
                    />
                  ))}

                  {/* Map over Resolution */}
                  {beatsData?.resolution?.map((item, index) => (
                    <ShowBeats
                      title="Resolution"
                      length={
                        beatsData?.setup?.length +
                        beatsData?.conflict?.length +
                        index +
                        1
                      }
                      {...{ item }}
                    />
                  ))}
                </tbody>
              )}
              {activeTab === "setup" && (
                <tbody>
                  {/* Map over Setup */}
                  {beatsData?.setup?.map((item, index) => (
                    <ShowBeats title="Setup" length={index + 1} {...{ item }} />
                  ))}
                </tbody>
              )}
              {activeTab === "conflict" && (
                <tbody>
                  {/* Map over Conflict */}
                  {beatsData?.conflict?.map((item, index) => (
                    <ShowBeats
                      title="Conflict"
                      length={beatsData?.setup?.length + index + 1}
                      {...{ item }}
                    />
                  ))}
                </tbody>
              )}
              {activeTab === "resolution" && (
                <tbody>
                  {/* Map over Resolution */}
                  {beatsData?.resolution?.map((item, index) => (
                    <ShowBeats
                      title="Resolution"
                      length={
                        beatsData?.setup?.length +
                        beatsData?.conflict?.length +
                        index +
                        1
                      }
                      {...{ item }}
                    />
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeatsPop;
