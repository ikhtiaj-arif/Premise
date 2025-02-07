import React from "react";
import { ToastContainer } from "react-toastify";
import { useGetPremiseBeatsDataQuery } from "../../../../app/EndPoints/premisePoolApi";
import crossIcon from "../../../../img/Icons/crossIcon.png";

const BeatsPop = ({ popClose, id }) => {
  const {
    data: beatsDataJson,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetPremiseBeatsDataQuery(id);

  const beatsData = beatsDataJson?.data;
   console.log("beatsData");

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
        {/* header */}
        <div className="flex justify-between items-center mb-6 mt-8">
          <h2 className="text-[24] font-semibold">
            Content added to Beat sheet :
          </h2>
          <div className="space-x-2">
            <button className="px-[12px] py-[2px] border text-[16px]  bg-[#33b0ca] text-[#fafafa] rounded-[8px]">
              All (
              {beatsData?.setup?.length +
                beatsData?.conflict?.length +
                beatsData?.resolution?.length}
              )
            </button>
            <button className="px-[12px] py-[2px] border border-[#616161] text-[#616161] text-[16px]  rounded-[8px]">
              Setup ({beatsData?.setup?.length})
            </button>
            <button className="px-[12px] py-[2px] border border-[#616161] text-[#616161] text-[16px] rounded-[8px]">
              Conflict ({beatsData?.conflict?.length})
            </button>
            <button className="px-[12px] py-[2px] border border-[#616161] text-[#616161] text-[16px] text rounded-[8px]">
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
          <tbody>
            {/* Map over Setup */}
            {beatsData?.setup?.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-b-[#fafafa] border-r-[#616161] border-l-[#616161] text-[12px] text-center text-[#252525]">
                  {index + 1}
                </td>
                <td className="border border-b-[#fafafa] border-r-[#616161] border-l-[#616161] text-left px-2 text-[#252525]">
                  <p className="text-[#33b0ca] font-bold text-[16px]">Setup:</p>
                  <p className="text-[12px] leading-[18px] text-[#666666] font-[400]">
                    {item.text}
                  </p>
                </td>
                <td className="text-[12px] leading-[18px] text-[#666666] font-[400] border border-b-[#fafafa] border-r-[#616161] border-l-[#616161]">
                  {item.text}
                </td>
              </tr>
            ))}

            {/* Map over Conflict */}
            {beatsData?.conflict?.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-b-[#fafafa] border-r-[#616161] border-l-[#616161] text-[12px] text-center text-[#252525]">
                  {beatsData?.setup?.length + index + 1}
                </td>
                <td className="border border-b-[#fafafa] border-r-[#616161] border-l-[#616161] text-left px-2 text-[#252525]">
                  <p className="text-[#33b0ca] font-bold text-[16px]">
                    Conflict:
                  </p>
                  <p className="text-[12px] leading-[18px] text-[#666666] font-[400]">
                    {item.text}
                  </p>
                </td>
                <td className="text-[12px] leading-[18px] text-[#666666] font-[400] border border-b-[#fafafa] border-r-[#616161] border-l-[#616161]">
                  {item.text}
                </td>
              </tr>
            ))}

            {/* Map over Resolution */}
            {beatsData?.resolution?.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-b-[#616161] border-r-[#616161] border-l-[#616161] text-[12px] text-center text-[#252525]">
                  {beatsData?.setup?.length +
                    beatsData?.conflict?.length +
                    index +
                    1}
                </td>
                <td className="border border-b-[#616161] border-r-[#616161] border-l-[#616161] text-left px-2 text-[#252525]">
                  <p className="text-[#33b0ca] font-bold text-[16px]">
                    Resolution:
                  </p>
                  <p className="text-[12px] leading-[18px] text-[#666666] font-[400]">
                    {item.text}
                  </p>
                </td>
                <td className="text-[12px] leading-[18px] text-[#666666] font-[400] border border-b-[#616161] border-r-[#616161] border-l-[#616161]">
                  {item.text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BeatsPop;
