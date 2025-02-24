import React, { useEffect, useState } from "react";
import { useGetPremiseBrainstormsDataQuery } from "../../../app/EndPoints/premisePoolApi";

const BrainstromTable = ({ headerText, id }) => {
  const {
    data: brainstormData,
    isBrainstormDataLoading,
    refetch: brainstormRefetch,
  } = useGetPremiseBrainstormsDataQuery(id);

  const [data, setData] = useState();

  useEffect(() => {
    if (id) {
      brainstormRefetch();
    }
  }, [id]);

  useEffect(() => {
    if (brainstormData) {
      setData(data);
    }
  }, [brainstormData]);


  return (
    <>
      {isBrainstormDataLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="table-auto border-collapse border border-[#616161] w-full text-center">
          <thead>
            <tr>
              <th className="border border-[#616161] text-left border-t-[#fafafa] border-l-[#fafafa] px-2 py-[6px] text-[14px] font-bold">
                {headerText.toUpperCase()}
              </th>
              <th className="border border-[#616161] px-2 py-[6px] text-[14px] font-medium">
                Set up
              </th>
              <th className="border border-[#616161] px-2 py-[6px] text-[14px] font-medium">
                Conflict
              </th>
              <th className="border border-[#616161] px-2 py-[6px] text-[14px] font-medium">
                Resolution
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[#616161] text-left px-2 py-[6px] text-[14px]">
                Generated
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {brainstormData?.data?.setup?.generated || 0}
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {brainstormData?.data?.conflict?.generated || 0}
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {brainstormData?.data?.resolution?.generated || 0}
              </td>
            </tr>

            {/* <tr>
                  <td className="border border-[#616161] text-left px-2 py-[6px] text-[14px]">
                    Rejected
                  </td>
                  <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                  
                  </td>
                  <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                 
                  </td>
                  <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                  
                  </td>
                </tr>
                 */}

            <tr>
              <td className="border border-[#616161] text-left px-2 py-[6px] text-[14px]">
                Added as Beat
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.setup?.added_to_beat || 0}
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.conflict?.added_to_beat || 0}
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.resolution?.added_to_beat || 0}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default BrainstromTable;
