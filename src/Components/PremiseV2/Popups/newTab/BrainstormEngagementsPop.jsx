import { ToastContainer } from "react-toastify";
import crossIcon from "../../../../img/Icons/crossIcon.png";
import BrainstromTable from "../../premiseNewTab/BrainstromTable";
import EngagementTable from "../../premiseNewTab/EngagementTable";

const BrainstormEngagementsPop = ({ popClose, id, commonPopup }) => {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-screen flex items-center bg-[#252525b0] justify-center z-[21]">
      <ToastContainer />
      <div className="h-[253px] lg:px-[22px] w-full bg-[#fff] lg:w-[498px] md:mx-auto relative lg:rounded-[8px]">
        {/* Close Popup */}
        <img
          src={crossIcon}
          alt="Close"
          className="text-red-500 w-8 h-8 top-[-60px] right-[50%] translate-x-[50%] lg:translate-x-0 lg:top-[-15px] lg:right-[-15px] absolute z-[1] m-1 cursor-pointer"
          onClick={() => {
            popClose(false);
          }}
        />

        {/* Table */}
        <div className="ml-[-12px] mt-10 px-8">
          {commonPopup === "brainstorms" ? (
            <BrainstromTable {...{ id }} headerText="Brainstorm" />
          ) : (
            <EngagementTable {...{ id }} headerText="Engagements" />
          )}
        </div>

        {/* Footer Note */}
        {commonPopup !== "brainstorms" && (
          <p className="text-[12px] italic text-[#616161] text-right  pr-8">
            *Buddies whom this premise is visible.
          </p>
        )}
      </div>
    </div>
  );
};

export default BrainstormEngagementsPop;
