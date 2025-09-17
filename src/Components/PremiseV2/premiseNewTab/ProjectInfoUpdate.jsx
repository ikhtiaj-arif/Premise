import { useState } from "react";
import { useSelector } from "react-redux";
import newTabDoodle from "../../../img/new-tab-doodle.webp";
import LikePopup from "../../Premisepool/LikePopup";
import LikePremise from "../../Premisepool/LikePremise";
import TranslatePremiseNewTab from "../../Premisepool/TranslatePremiseNewTab";
import PopupComment from "../../SharedVersion/PopupComment";
import {
  getLanguageName,
  getTextFromValue,
} from "../utilityFuncitons/functions";
import PremiseTopAccess from "./PremiseTopAccess";

const ProjectInfoUpdate = ({
  premiseData,
  premiseRefetch,
  setOpenReplyField,
  commentsData,
  commentField,
  setCommentField,
}) => {
  const {
    id,
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
    project_id,
  } = premiseData;
  const [likePopup, setLikePopup] = useState(false);
  const [transText, setTransText] = useState("");

  const splitText = text.split("+");
  const dText = splitText[1];
  const user = useSelector((state) => state?.user?.id);
  // const [commentField, setCommentField] = useState(true);
  const finalCount = commentsData?.counts;
  const [viewText, setViewText] = useState(splitText[1]);
  const [transPopClose, setTransPopClose] = useState({});

  return (
    <div>
      <div className="flex items-center gap-2 lg:pl-6 my-3">
        <div>
          <div className="mr-4 w-[61px] md:w-[102px]">
            <img
              src={newTabDoodle}
              alt="premise doodle"
              className="w-[61px] md:w-[102px]"
            />
          </div>
        </div>
        <div className="lg:flex items-center justify-between gap-12">
          <h3 className="text-[12px] leading-4 xl:text-[14px]  text-[#252525] xl:leading-[21px] font-normal w-[100%] md:w-[70%] lg:w-[63%] xl:w-[67%]">
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
            A {sub_genre} ({genre}) of {getTextFromValue(duration)}, {}
            in {getLanguageName(source_language)} language, set in {period}{" "}
            {geography}, on the premise -{" "}
            <span className="font-bold">{viewText}</span>
          </h3>
          <div>
            <div className="hidden lgVisible lg:flex justify-between items-center mt-[14px] rounded-b-[8px] pl-1 pr-4 pb-2 pt-1 lg:w-full ">
              {/* 1st div */}
              <div className="flex gap-1 space-x-4 items-center">
                {/* like */}
                {/* <PopupLike {...{ user, id, premiseRefetch, premiseData }} /> */}
                <LikePremise
                  data={{
                    user,
                    ...premiseData,
                    likePopup,
                    setLikePopup,
                  }}
                  refetch={premiseRefetch}
                />
                {/* comment */}
                <PopupComment
                  {...{
                    setOpenReplyField,
                    setCommentField,
                    commentField,
                    finalCount,
                  }}
                />
              </div>

              <div className="ml-[15px] flex gap-2 items-center ">
                <TranslatePremiseNewTab
                  {...{
                    transPopClose,
                    setTransPopClose,
                    setViewText,
                    transText,
                    setTransText,
                  }}
                  data={{
                    id,
                    dText,
                    source_language,
                    project_id,
                  }}
                  className="premise-translate-wh-24"
                />
              </div>
            </div>
            <div className="pr-3 ">
              <PremiseTopAccess
                {...{
                  premiseOwner,
                  user,
                  id,
                  project_id,
                  premiseData,
                  premiseRefetch,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex lg:hidden justify-between items-center mt-[-12px] md:mt-[14px] rounded-b-[8px] px-[4px] pb-[8px] pt-[4px] lg:w-[300px]">
        {/* 1st div */}
        <div className="flex gap-1 space-x-4 items-center">
          {/* like */}
          {/* <PopupLike {...{ user, id, premiseRefetch, premiseData }} /> */}
          <LikePremise
            data={{
              user,
              ...premiseData,
              likePopup,
              setLikePopup,
            }}
            refetch={premiseRefetch}
          />
          {/* comment */}
          <PopupComment
            {...{
              setOpenReplyField,
              setCommentField,
              commentField,
              finalCount,
            }}
          />
        </div>

        <div className="ml-[15px] flex gap-2 items-center ">
          <TranslatePremiseNewTab
            {...{
              transPopClose,
              setTransPopClose,
              setViewText,
              transText,
              setTransText,
            }}
            data={{
              id,
              dText,
              source_language,
              project_id,
            }}
            className="premise-translate-wh-24"
          />
        </div>
      </div>

      {likePopup && <LikePopup setLikePopup={setLikePopup} id={id} />}
    </div>
  );
};

export default ProjectInfoUpdate;
