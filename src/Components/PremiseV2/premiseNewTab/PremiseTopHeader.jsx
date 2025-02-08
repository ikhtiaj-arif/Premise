import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { PiShareFat } from "react-icons/pi";
import engagementImg from "../../../img/Icons/Engagements.png";
import beatsImg from "../../../img/Icons/beats.png";
import brainImg from "../../../img/Icons/brainstorme.png";
import BeatsPop from "../Popups/newTab/BeatsPop";
import BrainstormEngagementsPop from "../Popups/newTab/BrainstormEngagementsPop";

const PremiseTopHeader = ({ handleSearch, id }) => {
  const [beatsPopup, setBeatsPopup] = useState(false);
  const [commonPopup, setCommonPopup] = useState("");
  return (
    <div className="flex items-center gap-2">
      <div className="w-1/2 flex items-center gap-2">
        <div
          data-te-toggle="tooltip"
          title="Share"
          onClick={() => {}}
          className={`h-[32px] w-[32px] rounded-full cursor-pointer relative border border-[#33b0ca] 
              `}
        >
          <PiShareFat className="h-[26px] w-[21px] pt-1 mx-auto text-[#33b0ca]" />
        </div>
        <div
          data-te-toggle="tooltip"
          title="Engagements"
          onClick={() => {
            setCommonPopup("engagements");
          }}
          className={`h-[32px] w-[32px] rounded-full cursor-pointer relative  border border-[#eaeaea] 
              `}
        >
          <img
            src={engagementImg}
            alt=""
            className="h-[26px] w-[26px] mx-auto mt-[2px]"
          />
        </div>
        <div
          data-te-toggle="tooltip"
          title="Brainstorms"
          onClick={() => {
            setCommonPopup("brainstorms");
          }}
          className={`h-[32px] w-[32px] rounded-full cursor-pointer relative  border border-[#eaeaea]  
              `}
        >
          <img src={brainImg} alt="" className="h-[31px] w-[31px] mx-auto  " />
        </div>
        <div
          data-te-toggle="tooltip"
          title="Beats"
          onClick={() => {
            setBeatsPopup(true);
          }}
          className={`h-[32px] w-[32px] rounded-full cursor-pointer relative  border border-[#eaeaea]
              `}
        >
          <img
            src={beatsImg}
            alt=""
            className="h-[21px] w-[21px] mx-auto  mt-[6px] ml-[7px]"
          />
        </div>
      </div>
      <div
        className={` border w-[146px] border-[#B4B4B4] mx-auto px-[14px] h-[32px] my-2 rounded-full`}
      >
        <form className="flex items-center" onSubmit={handleSearch}>
          <input
            type="text"
            className="w-full flex-1 px-2  h-[28px] text-[14px] focus:outline-none"
            name="search"
            id=""
            maxLength="30"
            placeholder="Search"
          />

          <button type="submit" className="ml-2">
            <FiSearch className="h-[20px] w-[20px]" />
          </button>
        </form>
      </div>

      {beatsPopup && <BeatsPop popClose={setBeatsPopup} id={id} />}

      {commonPopup == "brainstorms" && (
        <BrainstormEngagementsPop
          popClose={setCommonPopup}
          id={id}
          commonPopup={commonPopup}
        />
      )}
      {commonPopup == "engagements" && (
        <BrainstormEngagementsPop
          popClose={setCommonPopup}
          id={id}
          commonPopup={commonPopup}
        />
      )}
    </div>
  );
};

export default PremiseTopHeader;
