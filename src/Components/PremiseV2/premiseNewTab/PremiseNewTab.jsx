import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useGetCommentByPremiseIdQuery,
  useGetOnePremiseQuery,
  useGetPremiseBrainstormsDataQuery,
  useGetPremiseEngagementsDataQuery,
} from "../../../app/EndPoints/premisePoolApi";

import BeatsPop from "../Popups/newTab/BeatsPop";
import BrainstormEngagementsPop from "../Popups/newTab/BrainstormEngagementsPop";
import LeftSideBar from "./LeftSideBar";
import VerticalBar from "./VerticalBar";
import MainComment from "./MainComment";

const PremiseNewTab = () => {
  const { id } = useParams(); // Extract the ID from the route
  const { state } = useLocation();

  const params = state || {};
  const { project_id } = params;

  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(id);

  const {
    data: commentsData,
    isCommentLoading,
    refetch: commentRefetch,
  } = useGetCommentByPremiseIdQuery(id);

  const {
    data: brainstormData,
    isBrainstormDataLoading,
    // refetch: premiseRefetch,
  } = useGetPremiseBrainstormsDataQuery(id);

  const {
    data: engagementsData,
    isEngagementsDataLoading,
    // refetch: premiseRefetch,
  } = useGetPremiseEngagementsDataQuery(id);

  // const {
  //   data: profileImg,
  //   profileImgLoading,
  //   refetch: profileRefetch,
  // } = useGetPremiseUserPictureQuery(created_by?.id);

  const [beatsPopup, setBeatsPopup] = useState(false);
  const [commonPopup, setCommonPopup] = useState(""); // For "Brainstorms" and "Engagements"

  return (
    <div className="lg:w-[90%] xl:w-3/4 mx-auto h-screen overflow-hidden">
      <p className="mt-[78px]">
        Brainstorming to develop (Project Name): A romantic comedy of 30 minutes
        in German language set in contemporary Russia on the premise ‘What
        if......’
      </p>
      {!isPremiseLoading && premiseData && (
        <div className="w-full flex items-start gap-4 mt-2 h-[calc(100vh-78px)]">
          {/* Left Sidebar */}
          <div className="leftSection bg-[#fff] w-[30%] p-2 pr-0 flex justify-end h-full  overflow-y-auto">
            <LeftSideBar
              premiseData={premiseData}
              setBeatsPopup={setBeatsPopup}
              setCommonPopup={setCommonPopup}
            />
            <VerticalBar />
          </div>

          {/* Comment Section */}
          <div
            style={{
              boxShadow: "0px 0px 10px 2px #eaeaea",
            }}
            className="commentSection bg-[#fff] py-2 px-4 rounded-lg rounded-2 w-[68%] h-full overflow-y-auto"
          >
            {/* Content of comment section */}
            {[...(commentsData?.comments || [])] // Create a shallow copy of the array to avoid modifying the original
              .sort((a, b) => a.c_value - b.c_value) // Sort comments by c_value in ascending order
              .map((comment, index) => (
                <MainComment comment={comment} />
              ))}
          </div>
        </div>
      )}
      {beatsPopup && id && <BeatsPop popClose={setBeatsPopup} id={id} />}
      {commonPopup === "brainstorms" && !isBrainstormDataLoading && id && (
        <BrainstormEngagementsPop
          popClose={setCommonPopup}
          id={id}
          data={brainstormData?.data}
          commonPopup={commonPopup}
        />
      )}
      {commonPopup === "engagements" && !isEngagementsDataLoading && id && (
        <BrainstormEngagementsPop
          popClose={setCommonPopup}
          id={id}
          data={engagementsData}
          commonPopup={commonPopup}
        />
      )}
    </div>
  );
};

export default PremiseNewTab;
