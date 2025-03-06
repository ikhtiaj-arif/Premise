import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../../App";
import {
  useGetSavedCharactersQuery,
  useSaveCharactersMutation,
} from "../../../app/EndPoints/Characters/Characters";
import {
  useDeletePremiseMutation,
  useGetPremiseUserQuery,
} from "../../../app/EndPoints/premisePoolApi";
import CharacterEditablePop from "../../Premisepool/Character/CharacterEditablePop";
import DeletePremise from "../../Premisepool/DeletePremise";
import OwnerMail from "../../Premisepool/OwnerMail";
import UserMail from "../../Premisepool/UserMail";
import NoAccessLbPopUp from "../../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import { baseURL } from "../../utils";
import CardHeadOptions from "../Card/CardHeadOptions";
import AvailableForTranslationPop from "../Popups/AvailableForTranslationPop";
import BankDetailsPop from "../Popups/BankDetails/BankDetailsPop";
import MonetizePreferencePop from "../Popups/MonetizePreferencePop";
import PaySalePopup from "../Popups/PaySalePopup";
import ReqSalePop from "../Popups/ReqSalePop";
import ReqTranslationPop from "../Popups/ReqTranslationPop";
import SaleRequestedOwner from "../Popups/SaleRequestedOwner";
import TransInOtherLang from "../Popups/TransInOtherLang.pop";
import ViewTranslationPop from "../Popups/ViewTranslation.pop";

const PremiseTopAccess = ({
  user,
  premiseOwner,
  id,
  project_id,
  premiseData,
  premiseRefetch,
}) => {
  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();

  const { currentUser } = useContext(MyContext);
  const userFirstName = userQuery?.first_name;
  const userLastName = userQuery?.last_name;

  const [userMail, setUserMail] = useState(false);
  const [openDotMenu, setOpenDotMenu] = useState(false);
  const [openTransOtherPop, setOpenTransOtherPop] = useState(false);
  const [openMonetizingPreferencesPop, setOpenMonetizingPreferencesPop] =
    useState(false);
  const [openViewTranslationsPop, setOpenViewTranslationsPop] = useState(false);
  const [viewTransactionPId, setViewTransactionPId] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [openHidePop, setOpenHidePop] = useState(null);
  const [characterArray, setCharacterArray] = useState([]);
  const [onlyAdd, setOnlyAdd] = useState(true);
  const splitText = premiseData?.text?.split("+");
  const dText = splitText[1];
  const stylings = JSON?.parse(splitText[0]);
  const [viewText, setViewText] = useState(splitText[1]);
  const [deletePremise, { isLoading }] = useDeletePremiseMutation();
  const [characterLoading, setCharacterLoading] = useState(true);
  const { allspProjectJSON } = useContext(MyContext);
  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();
  const currentProjectData = allspProjectJSON?.projects?.find(
    (item) => item.pro_uuid === project_id
  );

  const [ownerMail, setOwnerMail] = useState(false);
  const { data: characters, isCharLoading } =
    useGetSavedCharactersQuery(project_id);
  const currentProjectName = currentProjectData?.name;
  const isProjectLocked = currentProjectData?.locked;

  //console.log("currentProjectName", currentProjectName, isProjectLocked);

  const dotPopupRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const closeMenu = (e) => {
      if (!dotPopupRef?.current?.contains(e.target)) {
        if (!e.target.closest(".absolute")) {
          setOpenDotMenu(false);
        }
      }
    };
    document.body.addEventListener("mousedown", closeMenu);

    return () => document.body.removeEventListener("mousedown", closeMenu);
  }, []);

  const handleUpdateSavedChar = async () => {
    setCharacterLoading(true);
    try {
      const charArr = JSON.stringify(characterArray);
      const data = {
        // id: premiseID,
        id: project_id,
        body: { char_data: charArr },
      };

      const response = await saveCharacter(data);

      if (response) {
        // setAddNewCharacter(false)
        // setEditPopupOpen(false)
        setOpenCharacterChart(false);
        // setCharSaveDisable(true);
        setCharacterLoading(false);

        // toast.success("characters updated!")
      }
      return response;
    } catch (error) {
      setCharacterLoading(false);
      // console.error("Error updating characters:", error);
    }
  };

  const handleViewTransaction = (id) => {
    // console.log(id);
    setViewTransactionPId(id);
    setOpenViewTranslationsPop(!openViewTranslationsPop);
    setOpenDotMenu(null);
  };
  const handleDelete = async (id) => {
    console.log(id);
    setIsDelete(id);
    return;
    const res = await deletePremise(id);
    if (res) {
      setIsDelete(false);
      toast.success("Successfully deleted your Premise", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      navigate(`/premise-pool-v2`);
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setIsDelete(false);
    }
  };

  const handleOpenSp = () => {
    // console.log("object", p);
    if (isProjectLocked) {
      window.open(`${baseURL}/scriptpad2/#/myscript`);
    }
    window.open(
      `${baseURL}/scriptpad2/#/${project_id}/0x0d2a90b8da670ddad09e2d7b719779a41687515aa196cb35568f20659b204de6/premise`
    );
  };

  const handleUserMail = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_MessageOwner`);
    console.log("message res", res);
    if (res?.access == "No") {
      setUserMail(res);
    } else {
      setUserMail("Yes");
    }
  };

  const handleMonetizing = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Monitize`);

    if (res?.access === "No") {
      setOpenMonetizingPreferencesPop(res);
    } else {
      setOpenMonetizingPreferencesPop("Yes");
    }
    setOpenDotMenu(null);
  };

  const handleVisibility = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Privacy`);

    if (res?.access === "No") {
      setOpenHidePop(res);
    } else {
      setOpenHidePop("Yes");
    }
    setOpenDotMenu(null);
  };

  const [translationRequestPop, setTranslationRequestPop] = useState("");
  const [noAccessLbPopUp, setNoAccessLbPopUp] = useState(null);

  const [viewTrnRequests, setViewTrnRequests] = useState("");
  const [viewSaleRequests, setViewSaleRequests] = useState("");
  const [saleRequestedOwner, setSaleRequestedOwner] = useState(true);
  const [openCharacterChart, setOpenCharacterChart] = useState(null);
  const [openPop, setOpenPop] = useState(false);
  const [openAvailableForTranslationPop, setOpenAvailableForTranslationPop] =
    useState(false);
  const [saleId, setSaleId] = useState("");
  const [viewSale, setViewSale] = useState(false);

  const [saleRequestPop, setSaleRequestPop] = useState("");

  return (
    <div className="flex gap-[3px] items-center justify-between pb-1 mt-2">
      <p className=" text-[16px] font-semibold leading-6 text-[#616161]">
        Premise
      </p>

      <CardHeadOptions
        owner={{ user, userFirstName, userLastName }}
        // index={index}
        // refetch={refetch}
        viewTrnRequests={viewTrnRequests}
        setViewTrnRequests={setViewTrnRequests}
        viewTransactionPId={viewTransactionPId}
        setViewTransactionPId={setViewTransactionPId}
        setViewSaleRequests={setViewSaleRequests}
        openTransOtherPop={openTransOtherPop}
        setOpenTransOtherPop={setOpenTransOtherPop}
        handleDelete={handleDelete}
        setOpenCharacterChart={setOpenCharacterChart}
        openViewTranslationsPop={openViewTranslationsPop}
        openAvailableForTranslationPop={openAvailableForTranslationPop}
        setOpenAvailableForTranslationPop={setOpenAvailableForTranslationPop}
        setOpenViewTranslationsPop={setOpenViewTranslationsPop}
        setOpenMonetizingPreferencesPop={setOpenMonetizingPreferencesPop}
        setNoAccessLbPopUp={setNoAccessLbPopUp}
        setUserMail={setUserMail}
        setSaleId={setSaleId}
        setViewSale={setViewSale}
        setSaleRequestPop={setSaleRequestPop}
        setTranslationRequestPop={setTranslationRequestPop}
        isProjectLocked={isProjectLocked}
        id={id}
        premiseOwner={premiseOwner}
        filter_flag={premiseData?.filter_flag}
        visible_to={premiseData?.visible_to}
        comment_filter_flag={premiseData?.comment_filter_flag}
        project_id={project_id}
        available_for_sale={premiseData?.available_for_sale}
        available_for_translation={premiseData?.available_for_translation}
        premise_source_id={premiseData?.premise_source_id}
        translation_request_count={premiseData?.translation_request_count}
        sale_request_count={premiseData?.sale_request_count}
        is_requested_for_sale={premiseData?.is_requested_for_sale}
        is_translated_languages={premiseData?.is_translated_languages}
        dotPopupRef={dotPopupRef}
        setOpenDotMenu={setOpenDotMenu}
        openDotMenu={openDotMenu}
        setOpenHidePop={setOpenHidePop}
        openHidePop={openHidePop}
      />

      {openTransOtherPop && (
        <TransInOtherLang popClose={setOpenTransOtherPop} />
      )}
      {openViewTranslationsPop && (
        <ViewTranslationPop
          popClose={setOpenViewTranslationsPop}
          premiseId={id}
        />
      )}
      {openMonetizingPreferencesPop && (
        <MonetizePreferencePop
          popClose={setOpenMonetizingPreferencesPop}
          id={id}
          user={user}
        />
      )}

      {isDelete && (
        <DeletePremise
          setIsDelete={setIsDelete}
          refetch={premiseRefetch}
          isDelete={isDelete}
          popClose={setIsDelete}
        />
      )}

      {openCharacterChart && (
        <CharacterEditablePop
          setCharacterEditPop={setOpenCharacterChart}
          characterArray={characterArray}
          currentProjectData={currentProjectData}
          setCharacterArray={setCharacterArray}
          onlyAdd={onlyAdd}
          handleUpdateSavedChar={handleUpdateSavedChar}
          characterLoading={isCharLoading}
          project_id={project_id}
        />
      )}
      {openViewTranslationsPop && (
        <ViewTranslationPop
          popClose={setOpenViewTranslationsPop}
          premiseId={viewTransactionPId}
        />
      )}
      {userMail === "Yes" && (
        <UserMail
          recipient={premiseOwner}
          data={{ user, id, userFirstName, userLastName }}
          setUserMail={setUserMail}
        />
      )}
      {userMail?.msg === "ShowBecomePrivilege" && (
        <NoAccessPopUp
          noAccessPopup={userMail}
          setNoAccessPopup={setUserMail}
        />
      )}
      {ownerMail && (
        <OwnerMail data={{ user, id }} setOwnerMail={setOwnerMail} />
      )}
      {/* {openPop && (
        <Popup
          popClose={() => setOpenPop(false)}
          {...{
            handleVisibility,
            handleMonetizing,
            setIsLiked,
            refetch,
            viewText,
          }}
          data={popupData}
          p={p}
        />
      )} */}
      {openCharacterChart && (
        <CharacterEditablePop
          setCharacterEditPop={setOpenCharacterChart}
          characterArray={characterArray}
          currentProjectData={currentProjectData}
          setCharacterArray={setCharacterArray}
          onlyAdd={onlyAdd}
          handleUpdateSavedChar={handleUpdateSavedChar}
          characterLoading={isCharLoading}
          project_id={premiseData?.project_id}
        />
      )}
      {openTransOtherPop && (
        <TransInOtherLang
          refetch={premiseRefetch}
          popClose={setOpenTransOtherPop}
          id={id}
          user={user}
          source_language={premiseData?.source_language}
          project_id={project_id}
        />
      )}
      {openAvailableForTranslationPop && (
        <AvailableForTranslationPop
          popClose={setOpenAvailableForTranslationPop}
          id={id}
          user={user}
          source_language={premiseData?.source_language}
          project_id={project_id}
          refetch={premiseRefetch}
        />
      )}
      {openViewTranslationsPop && (
        <ViewTranslationPop
          popClose={setOpenViewTranslationsPop}
          premiseId={viewTransactionPId}
          popCloseCmnt={() => setOpenPop(false)}
          {...{
            handleVisibility,
            handleMonetizing,
            // setIsLiked,
            premiseRefetch,
            viewText,
          }}
        />
      )}
      {openMonetizingPreferencesPop?.msg === "ShowBecomePrivilege" ? (
        <NoAccessPopUp
          noAccessPopup={openMonetizingPreferencesPop}
          setNoAccessPopup={setOpenMonetizingPreferencesPop}
        />
      ) : openMonetizingPreferencesPop?.msg === "LB" ||
        openMonetizingPreferencesPop?.msg === "ShowBuyPackage_and_Allacarte" ? (
        <NoAccessLbPopUp
          noAccessLbPopUp={openMonetizingPreferencesPop}
          setNoAccessPopup={setOpenMonetizingPreferencesPop}
          service="PP_Monitizes"
        />
      ) : (
        openMonetizingPreferencesPop === "Yes" && (
          <MonetizePreferencePop
            popClose={setOpenMonetizingPreferencesPop}
            id={id}
            user={user}
          />
        )
      )}
      {noAccessLbPopUp?.msg === "ShowBecomePrivilege" ? (
        <NoAccessPopUp
          noAccessPopup={noAccessLbPopUp}
          setNoAccessPopup={setNoAccessLbPopUp}
        />
      ) : (
        (noAccessLbPopUp?.msg === "LB" ||
          noAccessLbPopUp?.msg === "ShowBuyPackage_and_Allacarte") && (
          <NoAccessLbPopUp
            noAccessLbPopup={noAccessLbPopUp}
            setNoAccessPopup={setNoAccessLbPopUp}
            service="PP_interactions"
          />
        )
      )}
      {translationRequestPop && (
        <ReqTranslationPop
          popClose={setTranslationRequestPop}
          id={id}
          user={user}
          source_language={premiseData?.source_language}
          project_id={project_id}
        />
      )}
      {saleRequestPop && (
        <ReqSalePop
          popClose={setSaleRequestPop}
          id={id}
          user={user}
          source_language={premiseData?.source_language}
          project_id={project_id}
        />
      )}
      {viewTrnRequests && (
        <BankDetailsPop
          // translationRequest={translationRequest}
          popClose={setViewTrnRequests}
          premiseId={viewTrnRequests}
        />
      )}
      {viewSaleRequests && (
        <SaleRequestedOwner
          popClose={setViewSaleRequests}
          setSaleIcon={setSaleRequestedOwner}
          premiseId={id}
        />
      )}
      {viewSale && (
        <PaySalePopup
          refetch={premiseRefetch}
          premiseId={saleId}
          popClose={setViewSale}
          sellingValue={premiseData?.sellingPrice}
          Userid={user}
        />
      )}

      {/* {isDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center bg-[#252525b0] justify-center z-[21]">
          <div className="modal_css fixed inset-0 flex items-center justify-center z-50">
            <div className="w-[90%] mx-auto max-w-[510px] bg-[#fafafa]  rounded-xl ">
              <div className="flex flex-col justify-between h-auto px-[18px]">
                <p className="text-[14px] lg:text-[24px] text-[#252525] text-center lg:leading-10 font-[500] mt-10">
                  Are you sure you want to delete this premise?
                </p>
                <div className="h-[93px] pb-[14px] flex items-center gap-10 justify-center px-[40px]">
                  <button
                    onClick={() => setIsDelete(false)}
                    className=" font-[500] border !border-[#33B0CA] text-[#33B0CA] h-[34px] w-[99px] text-[14px] rounded-[8px]   hover:text-white hover:bg-[#33B0CA] "
                  >
                    No
                  </button>
                  <button
                    className={`${
                      isLoading
                        ? "cursor-disabled-PremisePool "
                        : "cursor-pointer"
                    } bg-[#33B0CA]  font-[500] text-white h-[34px] w-[99px]   px-4 py-1  text-[14px]  rounded-[8px] `}
                    onClick={() => handleDelete(id)}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default PremiseTopAccess;
