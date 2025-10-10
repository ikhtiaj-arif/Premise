import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../App";
import { useTranslatePremiseMutation } from "../../app/EndPoints/premisePoolApi";
import transIcon from "../../img/Icons/transIcon.png";
import NoAccessPopUp from "../PricingModel/NoAccessPopUp";

import TranslateLangDrop from "./TranslateLangDrop";
import { sortedLanguages } from "./Languages";

const TranslatePremise = ({
  data,
  transPopClose,
  setTransPopClose,
  setViewText,
  className,
  selectedOption,
  setSelectedOption,
  noAccessPopup,
  setNoAccessPopup,
}) => {
  const { id, dText, source_language, project_id } = data;

  const { setSelectedPremiseObj, setSelectedPremiseSpProjectId, currentUser } =
    useContext(MyContext);

  const [translatePremise, translateInfo] = useTranslatePremiseMutation();
  // const [selectedOption, setSelectedOption] = useState("");
  const [transPopup, setTransPopup] = useState(false);
  const [transText, setTransText] = useState("");
  const [loading, setLoading] = useState(false);
  // const [noAccessPopup, setNoAccessPopup] = useState(false);
  const btnRef = useRef();
  // console.log("translatePremise", project_id)

  // console.log("translatePremise", transText)

  const fetchData = async () => {
    const body = {
      text: dText,
      tar_lang: selectedOption,
    };

    setLoading(true);

    try {
      const res = await translatePremise(body);
      if (res?.data?.translated) {
        setTransText(res?.data?.translated);
        setViewText(res?.data?.translated);
        setTransPopup(true);
        setSelectedOption("");
        setSelectedPremiseSpProjectId(project_id);
      } else {
        toast.error("Translation failed", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
      }
    } catch (error) {
      // console.error("Translation error:", error);
      toast.error("Translation failed", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOption) {
      fetchData();
    }
  }, [selectedOption]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (!btnRef?.current?.contains(e.target)) {
        if (!e.target.closest(".absolute")) {
          setTransPopClose(null);
        }
      }
    };
    document.body.addEventListener("mousedown", closeMenu);

    return () => document.body.removeEventListener("mousedown", closeMenu);
  }, []);

  const handleTranslate = async (id) => {
    const res = await fetchUserAccess(`${currentUser?.id}/PP_Translate`);
    if (res?.access === "No") {
      setNoAccessPopup(res);
    } else {
      setTransPopClose(id);
    }
  };

  return (
    // <div ref={btnRef} className="relative">
    //   {loading ? (
    //     <span className="loading loading-spinner text-[#33B0CA] h-[20px] w-[20px] my-auto "></span>
    //   ) : (
    //     <img
    //       data-te-toggle="tooltip"
    //       title="Translate"
    //       src={transIcon}
    //       // onClick={() => setShowSelectBox(!showSelectBox)}
    //       onClick={() => handleTranslate(id)}
    //       className={`w-8 h-8 ml-auto cursor-pointer ${className}`}
    //       alt=""
    //     />
    //   )}
 
    // </div>
     <div ref={btnRef} className="relative flex items-center">
      {/* ✅ Desktop → show translate icon */}
      <div className="lgVisible">
        {loading ? (
          <span className="loading loading-spinner text-[#33B0CA] h-[20px] w-[20px] my-auto "></span>
        ) : (
          <img
            data-te-toggle="tooltip"
            title="Translate"
            src={transIcon}
            onClick={() => setTransPopClose(id)}
            className={`w-8 h-8 ml-auto cursor-pointer ${className}`}
            alt="Translate"
          />
        )}
      </div>

      {/* ✅ Mobile → show select field */}
      <div className="lgFlxHidden p-1 w-[44px] rounded-[4px]  items-center justify-center">
         <img
          data-te-toggle="tooltip"
          title="Translate"
          src={transIcon}
          className="w-[22px] h-[22px] pointer-events-none" // not blocking clicks
          alt=""
        />

        <select
          className="text-sm absolute inset-0 opacity-0 cursor-pointer"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <option value="">Select</option>
          {Object.entries(sortedLanguages)?.map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TranslatePremise;
