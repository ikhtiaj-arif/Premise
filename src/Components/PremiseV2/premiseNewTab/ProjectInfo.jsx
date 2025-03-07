import React from "react";
import newTabDoodle from "../../../img/new-tab-doodle.png";
import { getLanguageName } from "../utilityFuncitons/functions";

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
    <div className="flex items-center gap-2 lg:px-6">
      <div>
        <div className="mr-4">
          <img
            src={newTabDoodle}
            alt="premise doodle"
            className="w-[61px] md:w-[102px]"
          />
        </div>
      </div>
      <h3 className="text-[14px] md:text-[18px] text-[#252525] font-normal w-[80%] md:w-auto">
        <span className="text-[#252525] font-bold">{project_name} </span>
        of {}
        <span className="text-[#252525] font-bold"> {premiseOwner?.first_name} {premiseOwner?.last_name}:</span> A {sub_genre} (
        {genre}) of {duration} {}
        in {getLanguageName(source_language)} language set in {period} {geography} on the premise.
        
      </h3>
    </div>
  );
};

export default ProjectInfo;
