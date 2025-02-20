import React from "react";
import walletDoodle from "../../../img/wallet_doodle.png";

const ProjectInfo = ({ premiseData }) => {
  const {
    nature_of_project,
    minutes,
    period,
    duration,
    geography,
    premiseOwner,
    project_name,
    genre,
    sub_genre,
    source_language,
  } = premiseData;
  return (
    <div className="flex items-center gap-2">
      <div>
        <div className="relative mr-[43px]">
          <img
            src={`https://uidemos.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-12-06+at+18.04+10.png`}
            alt="premise doodle"
            className="w-[110px] h-auto md:h-[103.72px] md:w-[115.07px] ml-[10px] md:ml-[0px]"
          />
          <img
            // src={premiseImage}
            src={walletDoodle}
            alt="premise doodle"
            className="w-[35px] md:w-[51px] md:h-[77px] absolute bottom-[3px] right-[-36px]"
          />
        </div>
      </div>
      <h3 className="text-[14px] md:text-[20px] text-[#252525] font-normal w-[80%] md:w-auto">
        <span className="text-5 text-[#252525] font-bold">{project_name} </span>
        of {}
        <span className="text-5 text-[#252525] font-bold"> {premiseOwner?.first_name} {premiseOwner?.last_name}:</span> A {sub_genre} (
        {genre}) of {duration} {}
        in {source_language} language set in {period} {geography} on the premise
        ‘What if......’
      </h3>
    </div>
  );
};

export default ProjectInfo;
