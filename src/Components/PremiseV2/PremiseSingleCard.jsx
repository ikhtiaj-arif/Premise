import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetLatestPremiseQuery,
  useGetPremiseUserQuery,
} from "../../app/EndPoints/premisePoolApi";
import PremiseCardV2 from "./Card/PremiseCardV2";

const PremiseSingleCard = () => {
  const {
    data: premiseData,
    isPremiseLoading,
    refetch: premiseRefetch,
  } = useGetLatestPremiseQuery();

  const id = premiseData?.id;
  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();
  const userFirstName = userQuery?.first_name;
  const userLastName = userQuery?.last_name;
  const user = useSelector((state) => state?.user?.id);

  const [showRefine, setShowRefine] = useState(false);
  const [activeSearch, setActiveSearch] = useState(false);
  const [transPopClose, setTransPopClose] = useState({});

  // Hide the .post-mega-menu-nav class
  useEffect(() => {
    const menuElement = document.querySelector(".post-mega-menu-nav");
    if (menuElement) {
      menuElement.style.display = "none";
    }
  }, []);

  if (isPremiseLoading) return <>loading</>;
  return (
    <div className="w-[360px] ml-0 fixed top-0 left-0">
      <p className="hidden" id="premise_id">
        {id}
      </p>
      {premiseData && (
        <PremiseCardV2
          setShowRefine={setShowRefine}
          p={premiseData}
          refetch={premiseRefetch}
          userQuery={userQuery}
          owner={{ user, userFirstName, userLastName }}
          activeSearch={activeSearch}
          transPopClose={transPopClose}
          setTransPopClose={setTransPopClose}
          // hiddenCountRefetch={hiddenCountRefetch}
          // addPopup={addPopup}
          // setAddPopup={setAddPopup}
          // draftOpenFromSp={draftOpenFromSp}
        />
      )}
    </div>
  );
};

export default PremiseSingleCard;
