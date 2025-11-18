// PremiseTopHeader Component
//
// Provides the main interactive header section for the Premise New Tab view.
// Includes quick-access icons for sharing, engagements, brainstorming, and beats,
// along with a lightweight search input and responsive character toggle.
//
// ------------------------------------------------------------
// Overview
// ------------------------------------------------------------
// - Displays a compact top toolbar with 4 action buttons + search input.
// - Handles modals for "Share", "Engagements", "Brainstorms", and "Beats".
// - Integrates with Global Context to toggle the character sidebar (mobile).
//
// ------------------------------------------------------------
// Core Functionalities
// ------------------------------------------------------------
//
// 1. **Share Popup**
//    - Opens `SharePopup` when clicking the Share (PiShareFat) icon.
//    - Used for sharing premise links or collaboration access.
//
// 2. **Engagements / Brainstorms**
//    - Both use `BrainstormEngagementsPop` popup.
//    - `commonPopup` state determines which mode is active.
//    //! Important: `commonPopup` is reused for both engagement and brainstorm actions.
//
// 3. **Beats Management**
//    - Opens `BeatsPop` for managing story beats associated with the current premise.
//    - Controlled by `beatsPopup` boolean state.
//
// 4. **Search Input**
//    - Text input for filtering or locating comments, characters, or sections.
//    - Controlled by `setSearchTerm` and submitted via `handleSearch()` callback.
//
// 5. **Responsive Character Toggle**
//    - Shows `GridIcon` (visible only on mobile).
//    - Toggles character sidebar using `toggleCharactersPopup` from GlobalContext.
//
// ------------------------------------------------------------
// Props Overview
// ------------------------------------------------------------
// - `handleSearch`: Form submit handler for search queries.
// - `setSearchTerm`: Updates parent search term state.
// - `id`: Premise identifier used for popups (Beats, Engagements, Brainstorms).
//
// ------------------------------------------------------------
// Summary
// ------------------------------------------------------------
// `PremiseTopHeader` serves as the action hub at the top of the Premise tab.
// It kee

import { useContext, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { fetchUserAccess, MyContext } from "../../../App";
import { useGetPremiseUserQuery } from "../../../app/EndPoints/premisePoolApi";
import { GlobalContext } from "../../../app/Hooks/Global";
import beatsImg from "../../../img/Icons/beats.png";
import brainImg from "../../../img/Icons/brainstorme.png";
import BeatsPop from "../Popups/newTab/BeatsPop";
import BrainstormEngagementsPop from "../Popups/newTab/BrainstormEngagementsPop";
import SharePopup from "../Popups/newTab/SharePopup";

const PremiseTopHeaderUpdate = ({
  handleSearch,
  handleClear,
  id,
  setSearchTerm,
  searchTerm,
  refetch,
  setViewTransactionPId,
  openTransOtherPop,
  setOpenTransOtherPop,
  handleDelete,
  setOpenCharacterChart,
  openViewTranslationsPop,
  setOpenViewTranslationsPop,
  setOpenMonetizingPreferencesPop,
  setNoAccessLbPopUp,
  setUserMail,
  setSaleId,
  setViewSale,
  setSaleRequestPop,
  isProjectLocked,
  premiseOwner,
  filter_flag,
  visible_to,
  comment_filter_flag,
  project_id,
  is_requested_for_sale,
  dotPopupRef,
  setOpenDotMenu,
  setOpenHidePop,
  openHidePop,
  openDotMenu,
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
    <div className="hidden lg:flex items-center gap-2 justify-between">
      <div className="w-2/6 flex items-center gap-2">
        {/* this section is commented out due to the new design changes*/}
        {/* <div
          data-te-toggle="tooltip"
          title="Share"
          onClick={() => setShowSharePopup(true)}
          className={`h-[32px] w-[32px] rounded-full cursor-pointer relative border border-[#00c3ff]`}
        >
          <PiShareFat className="h-[26px] w-[21px] pt-1 mx-auto text-[#00c3ff]" />
        </div> */}
        {/*  */}
        {/* <div
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
        </div> */}
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

      
      </div>
      <div
        className={` border w-[224px] md:w-[206px] border-[#B4B4B4] lg:mx-auto px-[14px] h-[32px] my-2 rounded-full`}
      >
        <form className="flex items-center" onSubmit={handleSearch}>
          <input
            type="text"
            className="w-full flex-1 px-2 h-[28px] text-[14px]  focus:outline-none"
            name="search"
            id=""
            maxLength="30"
            placeholder="Search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {searchTerm ? (
            <button
              type="button"
              onClick={() => {
                handleClear();
              }}
              className="ml-2"
            >
              <IoMdClose className="h-[20px] w-[20px] text-gray-600 hover:text-red-500 transition" />
            </button>
          ) : (
            <button type="submit" className="ml-2">
              <FiSearch className="h-[20px] w-[20px] text-gray-600 hover:text-blue-500 transition" />
            </button>
          )}
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
