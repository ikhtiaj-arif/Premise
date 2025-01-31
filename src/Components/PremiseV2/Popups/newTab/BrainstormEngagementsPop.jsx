import React from "react";
import { ToastContainer } from "react-toastify";
import crossIcon from "../../../../img/Icons/crossIcon.png";

const BrainstormEngagementsPop = ({ popClose, id, data, commonPopup }) => {
  console.log(data);
  const headerText =
    commonPopup === "brainstorms" ? "Brainstorm" : "Engagements";

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center mt-[80px] lg:mt-[0px] bg-[#252525b0] justify-center z-[1]">
      <ToastContainer />
      <div className="h-[100vh] lg:h-[253px] mb-[20px] px-[22px] lg:mb-0 lg:mt-[100px] xl:mt-[85px] w-full bg-[#fff] lg:w-[498px] md:mx-auto relative lg:rounded-[8px]">
        {/* Close Popup */}
        <img
          src={crossIcon}
          alt="Close"
          className="text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer"
          onClick={() => {
            popClose(false);
          }}
        />

        {/* Table */}
        <div className="overflow-x-auto mt-10 px-8">
          {commonPopup === "brainstorms" ? (
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
                    {data?.setup?.generated || 0}
                  </td>
                  <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                    {data?.conflict?.generated || 0}
                  </td>
                  <td className="border border-[#616161] px-2 py-[6px] text-[14px]">
                    {data?.resolution?.generated || 0}
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
        </div>

        {/* Footer Note */}
        {commonPopup !== "brainstorms" && (
          <p className="text-[12px] text-[#616161] text-right  pr-8">
            *Buddies whom this premise is visible.
          </p>
        )}
      </div>
    </div>
  );
};

export default BrainstormEngagementsPop;
