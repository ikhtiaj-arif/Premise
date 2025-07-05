import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOnePremiseQuery,
  useGetPremiseUserQuery,
} from "../../../app/EndPoints/premisePoolApi";
import TypingLoader from "../../TypingLoader";
import NoPremisePop from "../Popups/alerts/NoPremisePop";
import PremiseNewTab from "./PremiseNewTab";

const PremiseNewTabAccessChecker = () => {
  const [newTab, setNewTab] = useState(false);
  const [newTabData, setNewTabData] = useState(null);
  const [noPremise, setNoPremise] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams(); // Extract the ID from the route

  const {
    data: premiseData,
    isLoading: isPremiseLoading,
    error,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(id);
  const { data: userQuery, isLoading: isUserLoading } =
    useGetPremiseUserQuery();

  // console.log("premiseData", premiseData);
  // console.log("user", userQuery?.id);

  useEffect(() => {
    if (error?.status === 404) {
      console.log("Premise not found (404)");
      setNoPremise(true);
      return;
    }

    if (
      !isUserLoading &&
      !isPremiseLoading &&
      userQuery?.id !== undefined &&
      premiseData?.premiseOwner?.id !== undefined
    ) {
      setNewTab(false);

      if (userQuery?.id !== premiseData?.premiseOwner?.id) {
        console.log("Redirecting user...");
        navigate(`/${id}/scriptpad`);
      } else {
        setNewTabData(premiseData);
        setNewTab(true);
      }
    }
  }, [premiseData, userQuery, isUserLoading, isPremiseLoading, error]);

  if (isPremiseLoading || isUserLoading) {
    return <TypingLoader />;
  }
  return (
    <div>
      {newTab && (
        <PremiseNewTab
          id={id}
          user={userQuery?.id}
          premiseData={newTabData}
          isPremiseLoading={isPremiseLoading}
          premiseRefetch={premiseRefetch}
        />
      )}
      {noPremise && <NoPremisePop />}
    </div>
  );
};

export default PremiseNewTabAccessChecker;
