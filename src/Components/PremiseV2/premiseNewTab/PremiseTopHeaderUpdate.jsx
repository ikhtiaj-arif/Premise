import { useContext, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { PiShareFat } from "react-icons/pi";
import { useSelector } from "react-redux";
import { fetchUserAccess, MyContext } from "../../../App";
import { useGetPremiseUserQuery } from "../../../app/EndPoints/premisePoolApi";
import { GlobalContext } from "../../../app/Hooks/Global";
import engagementImg from "../../../img/Icons/Engagements.png";
import beatsImg from "../../../img/Icons/beats.png";
import admin from "../../../img/Icons/Admin.png";
import brainImg from "../../../img/Icons/brainstorme.png";
import mailCart from "../../../img/Icons/mailCart.png";
import msgIcon from "../../../img/Icons/msgIcon.png";
import sendSaleReq from "../../../img/Icons/sendSaleReq.png";
import sourceIcn from "../../../img/Icons/sourceIcn.png";
import transCartQ from "../../../img/Icons/transCartQ.png";
import translateCart from "../../../img/Icons/translateCart.png";
import GridIcon from "../../../img/grid-icon.png";
import HideOptionPop from "../../Premisepool/Components/HideOptionPop";
import NoAccessLbPopUp from "../../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import BeatsPop from "../Popups/newTab/BeatsPop";
import BrainstormEngagementsPop from "../Popups/newTab/BrainstormEngagementsPop";
import SharePopup from "../Popups/newTab/SharePopup";
import { handlePremiseOpenNewTab } from "../utilityFuncitons/functions";

const PremiseTopHeaderUpdate = ({
  handleSearch,
  id,
  setSearchTerm,
  refetch,
  viewTrnRequests,
  setViewTrnRequests,
  viewTransactionPId,
  setViewTransactionPId,
  setViewSaleRequests,
  openTransOtherPop,
  setOpenTransOtherPop,
  handleDelete,
  setOpenCharacterChart,
  openViewTranslationsPop,
  openAvailableForTranslationPop,
  setOpenAvailableForTranslationPop,
  setOpenViewTranslationsPop,
  setOpenMonetizingPreferencesPop,
  setNoAccessLbPopUp,
  setUserMail,
  setSaleId,
  setViewSale,
  setSaleRequestPop,
  setTranslationRequestPop,
  isProjectLocked,

  premiseOwner,
  filter_flag,
  visible_to,
  comment_filter_flag,
  project_id,
  available_for_sale,
  available_for_translation,
  premise_source_id,
  translation_request_count,
  no_of_times_translated,
  sale_request_count,
  is_requested_for_sale,
  is_translated_languages,
  dotPopupRef,
  setOpenDotMenu,
  setOpenHidePop,
  openHidePop,
  openDotMenu,
  addPopup,
  setAddPopup,
  setNotifyPopup,
  is_read_only,
}) => {
  const [beatsPopup, setBeatsPopup] = useState(false);
  const [commonPopup, setCommonPopup] = useState("");
  const [showSharePopup, setShowSharePopup] = useState(false);

  const { toggleCharactersPopup } = useContext(GlobalContext);

  const { currentUser } = useContext(MyContext);
  const {
    data: userQuery,
    isUserLoading,
    refetch: userRefetch,
  } = useGetPremiseUserQuery();

  const userFirstName = userQuery?.first_name;
  // const userFirstName = useSelector((state) => state?.user?.firstName);
  const user = useSelector((state) => state?.user?.id);

  //! states
  // const [openDotMenu, setOpenDotMenu] = useState(null);
  // const [openHidePop, setOpenHidePop] = useState(null);

  //! side effects
  // useEffect(() => {
  //   const closeMenu = (e) => {
  //     if (!dotPopupRef?.current?.contains(e.target)) {
  //       if (!e.target.closest(".absolute")) {
  //         setOpenDotMenu(null);
  //       }
  //     }
  //   };
  //   document.body.addEventListener("mousedown", closeMenu);

  //   return () => document.body.removeEventListener("mousedown", closeMenu);
  // }, []);

  //!handler functions
  const handleViewTransaction = (id) => {
    // console.log(id);
    setViewTransactionPId(id);
    setOpenViewTranslationsPop(!openViewTranslationsPop);
    setOpenDotMenu(null);
  };

  const handleVisibility = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Privacy`);
    console.log("visibility res", res);
    if (res?.access === "No") {
      setOpenHidePop(res);
    } else {
      setOpenHidePop("Yes");
    }

    setOpenDotMenu(null);
  };

  const handleSale = async (id) => {
    setSaleId(id);
    setViewSale(true);
  };

  const handleMonetizing = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Monitize`);
    console.log("visibility res", res);
    if (res?.access === "No") {
      setOpenMonetizingPreferencesPop(res);
    } else {
      setOpenMonetizingPreferencesPop("Yes");
    }
    setOpenDotMenu(null);
  };

  const handleOpenSp = () => {
    // console.log("object", p);
    if (isProjectLocked) {
      window.open(`${URL}/scriptpad2/#/myscript`);
    }
    window.open(
      `${URL}/scriptpad2/#/${project_id}/0x0d2a90b8da670ddad09e2d7b719779a41687515aa196cb35568f20659b204de6/premise`
    );
  };

  const handleUserMail = async () => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_MessageOwner`);
    console.log("message rs", res);
    if (res?.access === "No") {
      setUserMail(res);
    } else {
      setUserMail("Yes");
    }
  };

  const checkAllowance = async (state, id) => {
    if (userFirstName) {
      const res = await fetchUserAccess(
        `${currentUser?.id}/PP_SaleRequest_and_Translate`
      );
      console.log("PP_SaleRequest_and_Translate res", res);
      if (res?.access === "No") {
        setNoAccessLbPopUp(res);
      } else {
        state(id);
      }
    } else {
      setAddPopup("noUserName");
    }
  };

  const handleSendSaleRequest = async () => {
    if (is_requested_for_sale) {
      setNotifyPopup(true);
    } else {
      checkAllowance(setSaleRequestPop, id);
      refetch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-3/5 flex items-center gap-2">
        <div
          data-te-toggle="tooltip"
          title="Share"
          onClick={() => setShowSharePopup(true)}
          className={`h-[32px] w-[32px] rounded-full cursor-pointer relative border border-[#33b0ca]`}
        >
          <PiShareFat className="h-[26px] w-[21px] pt-1 mx-auto text-[#33b0ca]" />
        </div>
        <div
          data-te-toggle="tooltip"
          title="Engagements"
          onClick={() => {
            setCommonPopup("engagements");
          }}
          className={`h-[32px] w-[32px] rounded-full cursor-pointer relative  border border-[#eaeaea] 
              `}
        >
          <img
            src={engagementImg}
            alt=""
            className="h-[26px] w-[26px] mx-auto mt-[2px]"
          />
        </div>
        <div
          data-te-toggle="tooltip"
          title="Brainstorms"
          onClick={() => {
            setCommonPopup("brainstorms");
          }}
          className={`h-[32px] w-[32px] rounded-full cursor-pointer relative  border border-[#eaeaea]  
              `}
        >
          <img src={brainImg} alt="" className="h-[31px] w-[31px] mx-auto  " />
        </div>
        <div
          data-te-toggle="tooltip"
          title="Beats"
          onClick={() => {
            setBeatsPopup(true);
          }}
          className={`h-[32px] w-[32px] rounded-full cursor-pointer relative  border border-[#eaeaea]
              `}
        >
          <img
            src={beatsImg}
            alt=""
            className="h-[21px] w-[21px] mx-auto  mt-[6px] ml-[7px]"
          />
        </div>

        {/* Updated Code */}

        <div>
          {" "}
          {premiseOwner?.id === user ? (
            <div   className={`h-[32px] w-[32px] rounded-full cursor-pointer relative  border border-[#eaeaea]`}>
              <img
                src={admin}
                alt=""
                className="h-[21px] w-[21px] mx-auto  mt-[6px] ml-[7px]"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setOpenDotMenu((prevId) => (prevId === id ? null : id));
                }}
                // className="w-5 h-5 cursor-pointer"
              />
              {openDotMenu === id && (
                <div
                  ref={dotPopupRef}
                  className="absolute flex flex-col w-[197px] font-[400] text-[#616161] px-3 bg-[#fafafa] rounded-[8px] shadow-md border border-[#eaeaea] top-[25px] right-[-20px] py-[8px] z-10"
                >
                  <button
                    disabled={is_read_only}
                    onClick={handleVisibility}
                    className={`${
                      is_read_only ? "cursor-default" : "cursor-pointer "
                    } w-full`}
                  >
                    <p
                      className={`text-[14px] w-full font-[500] break-none text-left ${
                        is_read_only
                          ? "text-[#818181]"
                          : "hover:text-[#33B0CA] text-[#252525]"
                      }  `}
                    >
                      {" "}
                      Visibility Settings
                    </p>{" "}
                  </button>

                  <button
                    onClick={() => {
                      setOpenTransOtherPop(!openTransOtherPop);
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] break-none text-left hover:text-[#33B0CA] text-[#252525]">
                      {" "}
                      Copy in new Language
                    </p>{" "}
                  </button>

                  <button
                    onClick={handleMonetizing}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] break-none text-left hover:text-[#33B0CA] text-[#252525]">
                      {" "}
                      Monetizing Preferences
                    </p>{" "}
                  </button>
                  <button
                    onClick={() => {
                      handleViewTransaction(id);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] break-none text-left hover:text-[#33B0CA] text-[#252525]">
                      {" "}
                      View Translations
                    </p>{" "}
                  </button>

                  <button
                    onClick={() => {
                      handleDelete(id);
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] text-left hover:text-[#33B0CA] break-none text-[#252525]">
                      {" "}
                      Delete Premise
                    </p>{" "}
                  </button>
                  <button
                    onClick={() => {
                      setOpenCharacterChart(project_id);
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] text-left hover:text-[#33B0CA] break-none text-[#252525]">
                      {" "}
                      Characters and Roles
                    </p>{" "}
                  </button>
                  <button
                    onClick={() => {
                      handleOpenSp();
                      setOpenDotMenu(null);
                    }}
                    className="cursor-pointer  w-full"
                  >
                    <p className="text-[14px] w-full font-[500] text-left hover:text-[#33B0CA] break-none text-[#252525]">
                      {" "}
                      Open <span className="scriptpad-m">Script Pad</span>
                    </p>{" "}
                  </button>

                  {/* */}
                </div>
              )}
              {/* <FaEllipsisV
                onClick={() => setOpenHidePop(!openHidePop)}
                className="w-5 h-5 cursor-pointer"
              /> */}
              {openHidePop?.msg === "ShowBecomePrivilege" ? (
                <NoAccessPopUp
                  noAccessPopup={openHidePop}
                  setNoAccessPopup={setOpenHidePop}
                />
              ) : openHidePop?.msg === "LB" ||
                openHidePop?.msg === "ShowBuyPackage_and_Allacarte" ? (
                <NoAccessLbPopUp
                  noAccessLbPopup={openHidePop}
                  setNoAccessPopup={setOpenHidePop}
                  service="PP_Private"
                />
              ) : (
                openHidePop === "Yes" && (
                  <HideOptionPop
                    setOpenHidePop={setOpenHidePop}
                    id={id}
                    refetch={refetch}
                    user={user}
                    filter_flag={filter_flag}
                    comment_filter_flag={comment_filter_flag}
                    visible_to={visible_to}
                  />
                )
              )}
            </div>
          ) : (
            <div className="flex gap-[3px] items-center  mr-[2px] relative ">
                  <img
                data-te-toggle="tooltip"
                title="Send Message"
                src={msgIcon}
                className="w-8 h-8  cursor-pointer"
                alt=""
                onClick={handleUserMail}
              />
            </div>
          )}
        </div>
      </div>
      <div
        className={` border w-[110px] md:w-[146px] border-[#B4B4B4] mx-auto px-[14px] h-[32px] my-2 rounded-full`}
      >
        <form className="flex items-center" onSubmit={handleSearch}>
          <input
            type="text"
            className="w-full flex-1 px-2 h-[28px] text-[14px]  focus:outline-none"
            name="search"
            id=""
            maxLength="30"
            placeholder="Search"
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button type="submit" className="ml-2">
            <FiSearch className="h-[20px] w-[20px]" />
          </button>
        </form>
      </div>

      {/* <img
        src={GridIcon}
        alt="char_image"
        className="inline md:hidden w-[22px] h-[22px] cursor-pointer"
        onClick={toggleCharactersPopup}
      /> */}

      {beatsPopup && <BeatsPop popClose={setBeatsPopup} id={id} />}

      {commonPopup === "brainstorms" && (
        <BrainstormEngagementsPop
          popClose={setCommonPopup}
          id={id}
          commonPopup={commonPopup}
        />
      )}
      {commonPopup === "engagements" && (
        <BrainstormEngagementsPop
          popClose={setCommonPopup}
          id={id}
          commonPopup={commonPopup}
        />
      )}

      {showSharePopup && <SharePopup popClose={setShowSharePopup} />}
    </div>
  );
};

export default PremiseTopHeaderUpdate;
