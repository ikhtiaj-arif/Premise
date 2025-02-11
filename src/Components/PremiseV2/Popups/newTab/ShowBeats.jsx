import React from "react";

const ShowBeats = ({ item, title, length }) => {
  return (
    <tr key={item?.id} className="last:border-b-[#616161] last:border-b">
      <td className="border-l border-r border-r-[#616161] border-[#616161] text-[12px] text-center text-[#252525]">
        {length}
      </td>
      <td className="border-l border-r border-r-[#616161] border-l-[#616161] text-left px-2 text-[#252525]">
        <p className="text-[#33b0ca] font-bold text-[16px]">{title}</p>
        <p className="text-[12px] leading-[18px] text-[#666666] font-[400]">
          {item?.text}
        </p>
      </td>
      <td className="text-[12px] leading-[18px] text-[#666666] font-[400] border-l border-r border-r-[#616161] border-l-[#616161]">
        {item?.add_to_beat_text}
      </td>
    </tr>
  );
};

export default ShowBeats;
