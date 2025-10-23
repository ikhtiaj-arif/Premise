import React from "react";

const ShowBeats = ({ item, title, length }) => {
  return (
    <tr
      key={item?.id}
      className="last:border-b-[#616161] last:border-b flex flex-wrap justify-between md:table-row"
    >
      <td className="border-l border-[#616161] text-[12px] text-center text-[#252525] w-[50px]">
        {length}
      </td>
      <div className="flex flex-col md:flex-row w-[calc(100%-50px)] md:w-[100%] h-full md:h-auto">
        <td className="border-l border-l-[#616161] text-left py-2 px-2 text-[#252525] flex-1">
          <p className="text-[#00c3ff] font-bold text-[16px]">{title}</p>
          <p className="text-[12px] leading-[18px] text-[#666666] font-[400]">
            {item?.text}
          </p>
        </td>
        <td className="text-[12px] leading-[18px] text-[#666666] py-2 px-2 font-[400] border-l border-l-[#616161] flex-1 bg-[#00c3ff] bg-opacity-20 md:bg-transparent">
          {item?.add_to_beat_text}
        </td>
      </div>
    </tr>
  );
};

export default ShowBeats;
