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
import ProjectInfo from "./ProjectInfo";
import TypingLoader from "../../TypingLoader";
import { loadingData } from "../Premsie.v2";

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
      {!isPremiseLoading && premiseData ? (
        <>
          <ProjectInfo {...{ premiseData }} />
          <div className="w-full flex items-start gap-4 mt-2 h-[calc(100vh-78px)]">
            {/* Left Sidebar */}
            <div className="leftSection bg-[#fff] w-[30%] p-2 pr-0 flex justify-end h-full  overflow-y-auto">
              <LeftSideBar
                {...{
                  premiseRefetch,
                  premiseData,
                  setBeatsPopup,
                  setCommonPopup,
                }}
              />
              <VerticalBar />
            </div>

            {/* right Comment Section */}
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
        </>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center mx-auto z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative rounded-[8px] h-[100px] bg-[#fafafa] w-[90%] lg:w-[35%] flex items-center">
            <TypingLoader data={loadingData} />
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
