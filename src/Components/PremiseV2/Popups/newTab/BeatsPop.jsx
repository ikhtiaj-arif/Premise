import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { ToastContainer } from "react-toastify";
import { useGetPremiseBeatsDataQuery } from "../../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import TypingLoader from "../../../TypingLoader";
import ShowBeats from "./ShowBeats";

const BeatsPop = ({ popClose, id }) => {
  const {
    data: beatsDataJson,
    isLoading: isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetPremiseBeatsDataQuery(id);

  const [beatsData, setBeatsData] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (id) {
      premiseRefetch();
    }
  }, [id]);

  useEffect(() => {
    if (beatsDataJson) {
      setBeatsData(beatsDataJson?.data);
    }
  }, [beatsDataJson]);

  // Check if there's no beats data in any category
  const isNoBeatsAvailable = !(
    beatsData?.setup?.length > 0 ||
    beatsData?.conflict?.length > 0 ||
    beatsData?.resolution?.length > 0
  );

  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-screen flex items-center bg-[#252525b0] justify-center z-[21]">
      <ToastContainer />
      <div className="h-[550px] px-[12px] md:px-[32px] w-full bg-[#fff] md:w-[700px] lg:w-[1052px] lg:max-w-[90%] md:mx-auto relative md:rounded-[8px]">
        {/* close popup */}
        <img
          src={crossIcon}
          alt=""
          className="hidden md:inline text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer lgVisible  "
          onClick={() => {
            popClose(false);
          }}
        />

        <FaArrowLeft
          className="inline md:hidden text-[#252525] text-[20px] cursor-pointer"
          onClick={() => {
            popClose(false);
          }}
        />

        {isPremiseLoading ? (
          <div>
            <TypingLoader />
          </div>
        ) : (
          <div>
            {/* header */}
            <div className="flex flex-col gap-4 md:flex-row justify-between items-center mb-6 md:mt-8">
              <h2 className="text-[16px] md:text-[24px] font-semibold">
                Content added to Beat sheet :
              </h2>
              <div className="space-x-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-[12px] py-[2px] text-[12px] md:text-[16px] rounded-[4px] md:rounded-[8px] ${
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
                  className={`px-[12px] py-[2px] text-[12px] md:text-[16px] rounded-[4px] md:rounded-[8px] ${
                    activeTab === "setup"
                      ? "border-none bg-[#33b0ca] text-[#fafafa] "
                      : "border border-[#616161] text-[#616161] bg-white"
                  } `}
                >
                  Setup ({beatsData?.setup?.length})
                </button>
                <button
                  onClick={() => setActiveTab("conflict")}
                  className={`px-[12px] py-[2px] text-[12px] md:text-[16px] rounded-[4px] md:rounded-[8px] ${
                    activeTab === "conflict"
                      ? "border-none bg-[#33b0ca] text-[#fafafa] "
                      : "border border-[#616161] text-[#616161] bg-white"
                  } `}
                >
                  Conflict ({beatsData?.conflict?.length})
                </button>
                <button
                  onClick={() => setActiveTab("resolution")}
                  className={`px-[12px] py-[2px] text-[12px] md:text-[16px] rounded-[4px] md:rounded-[8px] ${
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
            <div className="w-[97%] mx-auto mt-3 overflow-auto h-[400px] overflow-y-auto ">
              <table className="border-collapse border-[#616161] border w-full">
                <thead className="">
                  <tr className="bg-[#fafafa] flex flex-wrap justify-between md:table-row border border-[#616161]">
                    <th className="border-r-[1px] md:border text-[12px] md:text-[16px] font-medium border-[#616161] px-2 md:py-2 w-[50px] text-center">
                      S.No
                    </th>

                    <div className="flex flex-col md:flex-row w-[calc(100%-50px)] md:w-[100%] h-full md:h-auto">
                      <th className="border text-[12px] md:text-[16px] font-medium px-[7px] md:py-2 text-left md:text-center flex-1">
                        Comment/Reply/Brainstorm
                      </th>
                      <th className="text-[12px] md:text-[16px] font-medium md:border-l-[1px] border-[#616161] px-2 md:py-2 text-right md:text-center flex-1 bg-[#33b0ca] bg-opacity-20 md:bg-transparent">
                        Beat Text
                      </th>
                    </div>
                  </tr>
                </thead>
                {isNoBeatsAvailable ? (
                  <tbody>
                    <tr>
                      <td colSpan="4" className="text-center text-[16px] py-4">
                        No beats available
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <>
                    {activeTab === "all" && (
                      <tbody>
                        {/* Map over Setup */}
                        {beatsData?.setup?.length > 0 && (
                          <ShowBeats title="Setup:" />
                        )}
                        {beatsData?.setup?.map((item, index) => (
                          <ShowBeats length={index + 1} {...{ item }} />
                        ))}

                        {/* Map over Conflict */}
                        {beatsData?.conflict?.length > 0 && (
                          <ShowBeats title="Conflict:" />
                        )}
                        {beatsData?.conflict?.map((item, index) => (
                          <ShowBeats
                            length={beatsData?.setup?.length + index + 1}
                            {...{ item }}
                          />
                        ))}

                        {/* Map over Resolution */}
                        {beatsData?.resolution?.length > 0 && (
                          <ShowBeats title="Resolution:" />
                        )}

                        {beatsData?.resolution?.map((item, index) => (
                          <ShowBeats
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
                        {beatsData?.setup?.length > 0 && (
                          <ShowBeats title="Setup:" />
                        )}
                        {beatsData?.setup?.map((item, index) => (
                          <ShowBeats length={index + 1} {...{ item }} />
                        ))}
                      </tbody>
                    )}
                    {activeTab === "conflict" && (
                      <tbody>
                        {/* Map over Conflict */}
                        {beatsData?.conflict?.length > 0 && (
                          <ShowBeats title="Conflict:" />
                        )}
                        {beatsData?.conflict?.map((item, index) => (
                          <ShowBeats
                            length={beatsData?.setup?.length + index + 1}
                            {...{ item }}
                          />
                        ))}
                      </tbody>
                    )}
                    {activeTab === "resolution" && (
                      <tbody>
                        {/* Map over Resolution */}
                        {beatsData?.resolution?.length > 0 && (
                          <ShowBeats title="Resolution:" />
                        )}
                        {beatsData?.resolution?.map((item, index) => (
                          <ShowBeats
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
                  </>
                )}
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeatsPop;
