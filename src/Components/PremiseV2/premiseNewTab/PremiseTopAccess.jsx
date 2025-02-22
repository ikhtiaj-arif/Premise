import React, { useContext, useEffect, useRef, useState } from "react";
import mailCartQ from "../../../img/Icons/mailCartQ.png";
import transCartQ from "../../../img/Icons/transCartQ.png";
import translateCart from "../../../img/Icons/translateCart.png";
import msgIcon from "../../../img/Icons/msgIcon.png";
import { FaEllipsisV } from "react-icons/fa";
import UserMail from "../../Premisepool/UserMail";
import TransInOtherLang from "../Popups/TransInOtherLang.pop";
import MonetizePreferencePop from "../Popups/MonetizePreferencePop";
import ViewTranslationPop from "../Popups/ViewTranslation.pop";
import { useDeletePremiseMutation } from "../../../app/EndPoints/premisePoolApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../utils";
import { fetchUserAccess, MyContext } from "../../../App";
import NoAccessPopUp from "../../PricingModel/NoAccessPopUp";

const PremiseTopAccess = ({ user, premiseOwner, id, project_id }) => {
  const [openDotMenu, setOpenDotMenu] = useState(false);
  const [userMail, setUserMail] = useState(false);
  const [openTransOtherPop, setOpenTransOtherPop] = useState(false);
  const [openMonetizingPreferencesPop, setOpenMonetizingPreferencesPop] =
    useState(false);
  const [openViewTranslationsPop, setOpenViewTranslationsPop] = useState(false);
  const [viewTransactionPId, setViewTransactionPId] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  const { currentUser } = useContext(MyContext);

  const [deletePremise, { isLoading }] = useDeletePremiseMutation();

  const { allspProjectJSON } = useContext(MyContext);

  const currentProjectData = allspProjectJSON?.projects?.find(
    (item) => item.pro_uuid === project_id
  );

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

  const handleViewTransaction = (id) => {
    // console.log(id);
    setViewTransactionPId(id);
    setOpenViewTranslationsPop(!openViewTranslationsPop);
    setOpenDotMenu(null);
  };
  const handleDelete = async (id) => {
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

  return (
    <div className="flex gap-[3px] items-center justify-between pb-1">
      <p className=" text-[16px] font-semibold leading-6 text-[#616161]">
        Premise
      </p>
      <div className="flex gap-[3px] items-center">
        <img
          data-te-toggle="tooltip"
          title="Check Mails"
          src={transCartQ}
          className="w-8 h-8 cursor-pointer"
          alt=""
          // onClick={() => setOwnerMail(true)}
        />
        <img
          data-te-toggle="tooltip"
          title="Check Mails"
          src={translateCart}
          className="w-8 h-8 cursor-pointer"
          alt=""
          // onClick={() => setOwnerMail(true)}
        />
        <img
          data-te-toggle="tooltip"
          title="Check Mails"
          src={mailCartQ}
          className="w-9 h-9 cursor-pointer"
          alt=""
          // onClick={() => setOwnerMail(true)}
        />

        {premiseOwner?.id == user ? (
          <div className=" relative">
            <FaEllipsisV
              onMouseDown={(e) => {
                e.stopPropagation();
                setOpenDotMenu((prev) => !prev);
              }}
              className="w-5 h-5 cursor-pointer"
            />
            {openDotMenu && (
              <div
                ref={dotPopupRef}
                className="absolute w-[197px] flex flex-col font-[400] text-[#616161] px-3 bg-[#fafafa] rounded-[8px] shadow-md border border-[#eaeaea] top-[25px] right-[3px] py-[8px] z-10"
              >
                <button
                  onClick={() => {
                    setOpenTransOtherPop(!openTransOtherPop);
                    setOpenDotMenu(false);
                  }}
                  className="cursor-pointer w-full"
                >
                  <p className="text-[14px] w-full font-[500] break-none hover:text-[#33B0CA] text-[#252525]">
                    {" "}
                    Copy in new Language
                  </p>{" "}
                </button>
                <button
                  onClick={() => {
                    setOpenMonetizingPreferencesPop(
                      !openMonetizingPreferencesPop
                    );
                    setOpenDotMenu(null);
                  }}
                  className="cursor-pointer w-full"
                >
                  <p className="text-[14px] w-full font-[500]  hover:text-[#33B0CA] break-none text-[#252525]">
                    {" "}
                    Monetizing Preferences
                  </p>{" "}
                </button>
                <button
                  onClick={() => {
                    handleViewTransaction(id);
                    setOpenDotMenu(null);
                  }}
                  className="cursor-pointer w-full"
                >
                  <p className="text-[14px] w-full font-[500]  hover:text-[#33B0CA] break-none text-[#252525]">
                    {" "}
                    View and Translations
                  </p>{" "}
                </button>
                <button
                  onClick={() => {
                    setIsDelete(id);
                    setOpenDotMenu(false);
                  }}
                  className="cursor-pointer w-full"
                >
                  <p className="text-[14px] w-full font-[500]  hover:text-[#33B0CA] break-none text-[#252525]">
                    {" "}
                    Delete Premise
                  </p>{" "}
                </button>

                <button
                  onClick={() => {
                    handleOpenSp();
                    setOpenDotMenu(false);
                  }}
                  className="cursor-pointer w-full "
                >
                  <p className="text-[14px] w-full font-[500]  hover:text-[#33B0CA] break-none text-[#252525]">
                    {" "}
                    Open <span className="scriptpad-m">Script Pad</span>
                  </p>{" "}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <img
              data-te-toggle="tooltip"
              title="Send Message"
              src={msgIcon}
              className="w-8 h-8 cursor-pointer"
              alt=""
              onClick={handleUserMail}
            />
            {userMail == "Yes" && (
              <UserMail
                recipient={premiseOwner}
                data={{ user, id }}
                setUserMail={setUserMail}
              />
            )}
            {userMail?.msg == "ShowBecomePrivilege" && (
              <NoAccessPopUp noAccessPopup={userMail} setNoAccessPopup={setUserMail} />
            )}
          </div>
        )}
      </div>

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
        <div className="fixed top-0 left-0 w-full h-full flex items-center bg-[#252525b0] justify-center z-[1]">
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
      )}
    </div>
  );
};

export default PremiseTopAccess;
