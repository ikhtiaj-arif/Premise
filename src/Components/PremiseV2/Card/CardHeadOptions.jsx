import React, { useContext } from "react";
import { FaEllipsisV } from "react-icons/fa";

import mailCart from "../../../img/Icons/mailCart.png";
import mailCartQ from "../../../img/Icons/mailCartQ.png";
import sendSaleReq from "../../../img/Icons/sendSaleReq.png";
// import transCartQ from "../../../img/Icons/transCartQ.png";
import msgIcon from "../../../img/Icons/msgIcon.png";
import sourceIcn from "../../../img/Icons/sourceIcn.png";
import transCartQ from "../../../img/Icons/transCartQ.png";
import translateCart from "../../../img/Icons/translateCart.png";
import transReqQ from "../../../img/Icons/transReqQ.png";

import { useSelector } from "react-redux";
import { fetchUserAccess, MyContext } from "../../../App";
import HideOptionPop from "../../Premisepool/Components/HideOptionPop";
import NoAccessLbPopUp from "../../PricingModel/NoAccessLbPopUp";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";
import { URL } from "../../utils";
import { handlePremiseOpenNewTab } from "../utilityFuncitons/functions";

const CardHeadOptions = ({
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
  id,
  premiseOwner,
  filter_flag,
  visible_to,
  comment_filter_flag,
  project_id,
  available_for_sale,
  available_for_translation,
  premise_source_id,
  translation_request_count,
  sale_request_count,
  is_requested_for_sale,
  is_translated_languages,
  dotPopupRef,
  setOpenDotMenu,
  setOpenHidePop,
  openHidePop,
  openDotMenu,
}) => {
  // const {

  // } = p;
  const { currentUser } = useContext(MyContext);

  // const dotPopupRef = useRef();

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
    const res = await fetchUserAccess(`${currentUser?.id}/PP_AllowInteraction`);
    console.log("AllowInteraction res", res);
    if (res?.access === "No") {
      setNoAccessLbPopUp(res);
    } else {
      state(id);
    }
  };

  //console.log("dotId", openDotMenu);

  return (
    <div>
      <div>
        {" "}
        {premiseOwner?.id === user ? (
          <div className="flex gap-[3px] items-center mt-[-13px] mr-[2px] relative ">
            {translation_request_count > 0 && (
              <div className="relative">
                <span className="absolute top-[-17px] right-0 text-[12px] font-[700] text-[#252525]">
                  {translation_request_count > 1 && (
                    <>{translation_request_count}</>
                  )}
                </span>
                <img
                  data-te-toggle="tooltip"
                  title="Translation Requests"
                  src={transReqQ}
                  className="w-8 h-8 cursor-pointer"
                  alt=""
                  onClick={() => setViewTrnRequests(id)}
                />
              </div>
            )}
            {is_translated_languages > 0 && (
              <img
                data-te-toggle="tooltip"
                title="Translated Languages"
                src={translateCart}
                className="w-8 h-8 cursor-pointer"
                alt=""
                onClick={() => handleViewTransaction(id)}
              />
            )}

            {premise_source_id && (
              <img
                data-te-toggle="tooltip"
                title="View Source"
                src={sourceIcn}
                className="w-8 h-8 cursor-pointer"
                alt=""
                onClick={() => handlePremiseOpenNewTab(premise_source_id)}
              />
            )}
            {sale_request_count > 0 && (
              <div className="">
                <img
                  data-te-toggle="tooltip"
                  title="Sale Requested"
                  src={mailCartQ}
                  className="w-9 h-9 cursor-pointer"
                  alt=""
                  onClick={() => setViewSaleRequests(true)}
                />
              </div>
            )}
            {/* 
            <FaEllipsisV
              onMouseDown={(e) => {
                e.stopPropagation();
                setOpenDotMenu((prevIndex) =>
                  prevIndex === index ? null : index
                );
              }}
              className="w-5 h-5 cursor-pointer"
            /> */}
            <FaEllipsisV
              onMouseDown={(e) => {
                e.stopPropagation();
                setOpenDotMenu((prevId) => (prevId === id ? null : id));
              }}
              className="w-5 h-5 cursor-pointer"
            />
            {openDotMenu === id && (
              <div
                ref={dotPopupRef}
                className="absolute flex flex-col w-[197px] font-[400] text-[#616161] px-3 bg-[#fafafa] rounded-[8px] shadow-md border border-[#eaeaea] top-[25px] right-[3px] py-[8px]  z-10"
              >
                <button
                  onClick={handleVisibility}
                  className="cursor-pointer  w-full"
                >
                  <p className="text-[14px] w-full font-[500] break-none text-left hover:text-[#33B0CA] text-[#252525]">
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
            {available_for_translation ? (
              <img
                data-te-toggle="tooltip"
                title="Available for Translation"
                src={translateCart}
                className="w-8 h-8 mt-[-13px] cursor-pointer"
                alt=""
                onClick={() => {
                  setOpenAvailableForTranslationPop(
                    !openAvailableForTranslationPop
                  );
                  // setOpenDotMenu(null);
                }}
              />
            ) : (
              <div className="relative">
                <img
                  data-te-toggle="tooltip"
                  title="Send Translation Request"
                  src={transCartQ}
                  className="w-8 h-8 mt-[-13px] cursor-pointer"
                  alt=""
                  onClick={() => checkAllowance(setTranslationRequestPop, id)}
                />
              </div>
            )}

            {available_for_sale ? (
              <img
                data-te-toggle="tooltip"
                title="Available for Sale"
                src={mailCart}
                className="w-8 h-8 mt-[-13px] cursor-pointer"
                onClick={() => handleSale(id)}
                alt="for sale"
              />
            ) : (
              <>
                {
                  <button
                    className={`${
                      is_requested_for_sale
                        ? "cursor-default"
                        : " cursor-pointer"
                    }`}
                    data-te-toggle="tooltip"
                    title="Send Sale Request"
                    disabled={is_requested_for_sale}
                    onClick={() => {
                      checkAllowance(setSaleRequestPop, id);
                      refetch();
                    }}
                  >
                    <img
                      src={sendSaleReq}
                      className={`w-8 h-8 mt-[-13px]`}
                      alt="send sale request"
                    />
                  </button>
                }
              </>
            )}
            {premise_source_id && (
              <img
                data-te-toggle="tooltip"
                title="View Source"
                src={sourceIcn}
                className="w-8 h-8 mt-[-13px] cursor-pointer"
                alt=""
                onClick={() => handlePremiseOpenNewTab(premise_source_id)}
              />
            )}
            <img
              data-te-toggle="tooltip"
              title="Send Message"
              src={msgIcon}
              className="w-8 h-8 mt-[-13px] cursor-pointer"
              alt=""
              onClick={handleUserMail}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardHeadOptions;
