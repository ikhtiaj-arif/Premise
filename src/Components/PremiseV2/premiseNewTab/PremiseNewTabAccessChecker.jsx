// PremiseNewTabAccessChecker Component
//
// This component acts as a secure “gatekeeper” before loading the main `PremiseNewTab` view.
// It ensures only the rightful owner of a premise can access its New Tab version.
//
// ------------------------------------------------------------
// Overview
// ------------------------------------------------------------
// - Fetches both the current logged-in user and the requested premise by ID.
// - Verifies ownership and controls navigation accordingly.
// - Handles loading, error, and unauthorized access gracefully.
//
// ------------------------------------------------------------
// Core Logic
// ------------------------------------------------------------
//
// 1. **Data Fetching**
//    - Uses `useGetOnePremiseQuery(id)` to fetch the selected premise.
//    - Uses `useGetPremiseUserQuery()` to identify the currently logged-in user.
//    - Waits until both requests finish before proceeding.
//
// 2. **Access Control**
//    - Compares `userQuery.id` (current user) with `premiseData.premiseOwner.id`.
//    //! If they match → access granted → render <PremiseNewTab>.
//    //! If not → automatically redirects the user to `/{id}/scriptpad`.
//
// 3. **Error & Loading Handling**
//    - Displays `TypingLoader` while fetching data.
//    - Shows `NoPremisePop` if a 404 (premise not found) occurs.
//    - Uses state flags like `showPremiseTab` and `noPremise` to track view state.
//
// 4. **Conditional Rendering**
//    - Only renders `PremiseNewTab` after all access checks pass.
//    - Provides a clean fallback (`return null`) for unexpected states.
//
// ------------------------------------------------------------
// Summary
// ------------------------------------------------------------
// This component acts as a lightweight security layer around `PremiseNewTab`.
// It prevents unauthorized users from viewing another user’s private premise
// and ensures the correct user experience for premise owners.
//
// //! Key takeaway: Only the premise owner can access the “New Tab” view.
//    Others are safely redirected to the “Scriptpad” route.





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
  const [showPremiseTab, setShowPremiseTab] = useState(false);
  const [premiseDataState, setPremiseDataState] = useState(null);
  const [noPremise, setNoPremise] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: premiseData,
    isLoading: isPremiseLoading,
    isError: isPremiseError,
    error: premiseError,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(id);

  const { data: userQuery, isLoading: isUserLoading } =
    useGetPremiseUserQuery();

  useEffect(() => {
    // Wait until both queries are finished
    if (isPremiseLoading || isUserLoading) return;

    // Handle 404 only after premise query is done
    if (isPremiseError && premiseError?.status === 404) {
      setNoPremise(true);
      return;
    }

    // Prevent running logic if required data missing
    if (!userQuery?.id || !premiseData?.premiseOwner?.id) return;

    // Access check logic
    if (userQuery.id === premiseData.premiseOwner.id) {
      setPremiseDataState(premiseData);
      setShowPremiseTab(true);
    } else {
      navigate(`/${id}/scriptpad`);
    }
  }, [
    isPremiseLoading,
    isUserLoading,
    isPremiseError,
    premiseError,
    userQuery,
    premiseData,
    id,
    navigate,
  ]);

  // While loading, show loader
  if (isPremiseLoading || isUserLoading) {
    return <TypingLoader />;
  }

  // Show 404 popup
  if (noPremise) {
    return <NoPremisePop />;
  }

  // Show new tab if access granted
  if (showPremiseTab) {
    return (
      <PremiseNewTab
        id={id}
        user={userQuery?.id}
        premiseData={premiseDataState}
        isPremiseLoading={isPremiseLoading}
        premiseRefetch={premiseRefetch}
      />
    );
  }

  // Fallback (should rarely hit)
  return null;
};

export default PremiseNewTabAccessChecker;
