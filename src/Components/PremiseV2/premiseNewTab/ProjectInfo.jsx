import newTabDoodle from "../../../img/new-tab-doodle.webp";
import {
  getLanguageName,
  getTextFromValue,
} from "../utilityFuncitons/functions";

const ProjectInfo = ({ premiseData }) => {
  const {
    nature_of_project,
    minutes,
    text,
    last_worked_on,
    period,
    duration,
    geography,
    premiseOwner,
    project_name,
    genre,
    sub_genre,
    source_language,
  } = premiseData;
  const splitText = text.split("+");
  const dText = splitText[1];
  return (
    <div className="flex items-center gap-2 lg:px-6 my-3">
      <div>
        <div className="mr-4">
          <img
            src={newTabDoodle}
            alt="premise doodle"
            className="w-[61px] md:w-[102px]"
          />
        </div>
      </div>
    <div>
        <h3 className="text-[14px]  text-[#252525] font-normal w-[80%] md:w-full">
        <span
          className="text-[#252525] font-bold notranslate"
          data-te-toggle="tooltip"
          title={`${`${project_name} `}`}
        >
          {project_name.slice(0, 15)}{" "}
        </span>
        of {}
        <span className="text-[#252525] font-bold">
          {" "}
          {premiseOwner?.first_name} {premiseOwner?.last_name}:
        </span>{" "}
        A {sub_genre} ({genre}) of {getTextFromValue(duration)} {}
        in {getLanguageName(source_language)} language set in {period}{" "}
        {geography}.
      </h3>
    </div>
    </div>
  );
};

export default ProjectInfo;
