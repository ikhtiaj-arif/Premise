import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOnePremiseQuery,
  useGetPremiseUserQuery,
} from "../../../app/EndPoints/premisePoolApi";
import PremiseNewTab from "./PremiseNewTab";

const PremiseNewTabAccessChecker = () => {
  const [newTab, setNewTab] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams(); // Extract the ID from the route

  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(id);
  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();

  // console.log("premiseData", premiseData?.premiseOwner?.id);
  // console.log("user", userQuery?.id);

  useEffect(() => {
    // console.log("user", userQuery?.id);
    // console.log("owner", premiseData?.premiseOwner?.id);
    // if (!isUserLoading && !isPremiseLoading) return;
    if (
      !isUserLoading &&
      !isPremiseLoading &&
      userQuery?.id !== undefined &&
      premiseData?.premiseOwner?.id !== undefined
    ) {
      setNewTab(false);
      if (userQuery?.id !== premiseData?.premiseOwner?.id) {
        navigate(`/${id}/scriptpad`);
        // window.open(`${window.location.origin}/ideamall/#/${id}/scriptpad`);
      } else {
        setNewTab(true);
      }
    }
  }, [premiseData, userQuery]);

  if (isPremiseLoading || isUserLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {newTab && (
        <PremiseNewTab
          id={id}
          user={userQuery?.id}
          premiseData={premiseData}
          isPremiseLoading={isPremiseLoading}
          premiseRefetch={premiseRefetch}
        />
      )}
    </div>
  );
};

export default PremiseNewTabAccessChecker;
