import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOnePremiseQuery,
  useGetPremiseUserQuery,
} from "../../../app/EndPoints/premisePoolApi";
import PremiseNewTab from "./PremiseNewTab";

const PremiseNewTabAccessChecker = () => {
  const [popup, setPopup] = useState(false);
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
    if (
      !isUserLoading &&
      !isPremiseLoading &&
      userQuery?.id !== undefined &&
      premiseData?.premiseOwner?.id !== undefined
    ) {
      if (userQuery?.id !== premiseData?.premiseOwner?.id) {
        navigate(`/${id}/scriptpad`);
      }
    }
  }, []);

  if (isPremiseLoading || isUserLoading) {
    return <div>Loading...</div>;
  }

  return <PremiseNewTab id={id} user={userQuery?.id} />;
};

export default PremiseNewTabAccessChecker;
