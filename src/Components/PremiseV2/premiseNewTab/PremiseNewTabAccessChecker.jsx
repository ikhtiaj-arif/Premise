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
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const navigate = useNavigate();
  const { id,sceneNumber } = useParams();

  console.log("sceneNumber",sceneNumber);

  // Fetch premise
  const {
    data: premiseData,
    isLoading: isPremiseLoading,
    isError: isPremiseError,
    error: premiseError,
    refetch: premiseRefetch,
  } = useGetOnePremiseQuery(id);

  // Fetch current user
  const { data: userQuery, isLoading: isUserLoading } =
    useGetPremiseUserQuery();

  useEffect(() => {
    // Wait until both queries finish
    if (isPremiseLoading || isUserLoading) return;

    // Once both are done:
    if (isPremiseError && premiseError?.status === 404) {
      // Only mark noPremise true after both queries fully resolved
      setNoPremise(true);
      setIsCheckingAccess(false);
      return;
    }

    // Don’t proceed until both have data
    if (!userQuery?.id || !premiseData?.premiseOwner?.id) {
      setIsCheckingAccess(false);
      return;
    }

    // Access check
    if (userQuery.id === premiseData.premiseOwner.id) {
      setPremiseDataState(premiseData);
      setShowPremiseTab(true);
    } else {
      navigate(`/${id}/scriptpad`);
    }

    setIsCheckingAccess(false);
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

  // ✅ Loader stays visible until everything is checked
  if (isPremiseLoading || isUserLoading || isCheckingAccess) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#f8f8f8]">
        <TypingLoader />{" "}
      </div>
    );
  }

  // ✅ Show 404 popup *only* after everything finished and access check is complete
  if (noPremise && !isPremiseLoading && !isUserLoading && !isCheckingAccess) {
    return <NoPremisePop />;
  }

  // ✅ Show tab if access granted
  if (showPremiseTab && premiseDataState) {
    return (
      <PremiseNewTab
        id={id}
        sceneNumber={sceneNumber}
        user={userQuery?.id}
        premiseData={premiseDataState}
        isPremiseLoading={isPremiseLoading}
        premiseRefetch={premiseRefetch}
      />
    );
  }

  return (
    <div className="h-screen flex justify-center items-center bg-[#f8f8f8]">
      <TypingLoader />{" "}
    </div>
  );
};

export default PremiseNewTabAccessChecker;
