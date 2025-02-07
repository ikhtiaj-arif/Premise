import React, { useEffect, useState } from "react";
import { useGetPremiseEngagementsDataQuery } from "../../../app/EndPoints/premisePoolApi";

const EngagementTable = ({ id, headerText }) => {
  const {
    data: engagementsData,
    isEngagementsDataLoading,
    // refetch: premiseRefetch,
  } = useGetPremiseEngagementsDataQuery(id);

  const [data, setData] = useState();

  useEffect(() => {
    if (engagementsData) {
      setData(data);
    }
  }, [engagementsData]);
  return (
    <>
      {isEngagementsDataLoading ? (
        <div>Loading...</div>
      ) : (
        <table className="table-auto border-collapse border border-[#616161] w-full text-center">
          <thead>
            <tr>
              <th className="border border-[#616161] text-left border-t-[#fafafa] border-l-[#fafafa] px-2 py-[6px] text-[14px] font-bold">
                {headerText.toUpperCase()}
              </th>
              <th className="border border-[#616161] px-2 py-[6px] text-[14px] font-medium">
                Owner
              </th>
              <th className="border border-[#616161] px-2 py-[6px] text-[14px] font-medium">
                Buddies*
              </th>
              <th className="border border-[#616161] px-2 py-[6px] text-[14px] font-medium">
                Viewers
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[#616161] text-left px-2 py-[6px] text-[14px]">
                Comments
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.owner?.comments || 0}
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.buddies?.comments || 0}
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.viewers?.comments || 0}
              </td>
            </tr>
            <tr>
              <td className="border border-[#616161] text-left px-2 py-[6px] text-[14px]">
                Likes
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.owner?.likes || 0}
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.buddies?.likes || 0}
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.viewers?.likes || 0}
              </td>
            </tr>
            <tr>
              <td className="border border-[#616161] text-left px-2 py-[6px] text-[14px]">
                Replies
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.owner?.replies || 0}
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.buddies?.replies || 0}
              </td>
              <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                {data?.viewers?.replies || 0}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default EngagementTable;
