import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../App";
import { useTranslatePremiseMutation } from "../../app/EndPoints/premisePoolApi";
import transIcon from "../../img/Icons/transIcon.png";
import NoAccessPopUp from "../PricingModel/NoAccessPopUp";
import { sortedLanguages } from "./Languages";
import TranslateLangDrop from "./TranslateLangDrop";

const TranslatePremise = ({
  data,
  transPopClose,
  setTransPopClose,
  setViewText,
  className,
  selectedOption,
  setSelectedOption,
}) => {
  const { id, dText, source_language, project_id } = data;

  const { setSelectedPremiseObj, setSelectedPremiseSpProjectId, currentUser } =
    useContext(MyContext);

  const [translatePremise, translateInfo] = useTranslatePremiseMutation();
  // const [selectedOption, setSelectedOption] = useState("");
  const [transPopup, setTransPopup] = useState(false);
  const [transText, setTransText] = useState("");
  const [loading, setLoading] = useState(false);
  const [noAccessPopup, setNoAccessPopup] = useState(false);
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
    console.log(`PP_Translate res`, res);
    if (res?.access === "No") {
      setNoAccessPopup(res);
    } else {
      setTransPopClose(id);
    }
  };

  return (
    <div ref={btnRef} className="relative">
      {loading ? (
        <span className="loading loading-spinner text-[#33B0CA] h-[20px] w-[20px] my-auto "></span>
      ) : (
        <img
          data-te-toggle="tooltip"
          title="Translate"
          src={transIcon}
          // onClick={() => setShowSelectBox(!showSelectBox)}
          onClick={() => handleTranslate(id)}
          className={`w-8 h-8 ml-auto cursor-pointer ${className}`}
          alt=""
        />
      )}
      {/* {transPopClose === id && (
        <TranslateLangDrop
          sortedLanguages={sortedLanguages}
          source_language={source_language}
          setSelectedOption={setSelectedOption}
          setTransPopClose={setTransPopClose}
        />

      )} */}
      {noAccessPopup?.msg === "ShowBecomePrivilege" && (
        <NoAccessPopUp
          noAccessPopup={noAccessPopup}
          setNoAccessPopup={setNoAccessPopup}
        />
      )}
    </div>
  );
};

export default TranslatePremise;
