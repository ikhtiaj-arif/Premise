import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { fetchUserAccess, MyContext } from "../../App";
import { useTranslatePremiseMutation } from "../../app/EndPoints/premisePoolApi";
import transIcon from "../../img/Icons/transIcon.png";
import { sortedLanguages } from "./Languages";
import NoAccessPopUp from "../PricingModel/NoAccessPopUp";

const TranslatePremise = ({
  data,
  transPopClose,
  setTransPopClose,
  setViewText,
}) => {
  const {
    id,
    dText,
    source_language,
    project_id,
  } = data;

  const { setSelectedPremiseObj, setSelectedPremiseSpProjectId,currentUser } =
    useContext(MyContext);

  const [translatePremise, translateInfo] = useTranslatePremiseMutation();
  const [selectedOption, setSelectedOption] = useState("");
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
        setViewText(res?.data?.translated)
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
    if (res?.access == "No"&& res?.msg=='ShowBecomePrivilege') {
      setNoAccessPopup(true);
    } else {
      setTransPopClose(id)
    }
  };

  return (
    // <div className="">
    //   {transPopup ? (
    //     <Popup
    //       popClose={setTransPopup}
    //       setIsLiked={setIsLiked}
    //       data={data}
    //       refetch={refetch}
    //       transText={transText}
    //     />
    //   ) : (
    //     <div ref={btnRef} className="relative">
    //       {/* {showSelectBox ? (
    //         <select
    //           value={selectedOption}
    //           onChange={handleOptionChange}
    //           className="border border-[#EAEAEA] p-1 rounded-[4px] w-full max-w-[81px] text-[12px] cursor-pointer"
    //         >
    //           {Object.entries(sortedLanguages)?.map(([key, name]) =>
    //             key !== source_language ? (
    //               <option key={key} value={key}>
    //                 {name}
    //               </option>
    //             ) : null
    //           )}
    //         </select>
    //       ) : (
    //         <div className="w-[81px] lg:w-[41px] mx-auto">

    //         <img
    //         data-te-toggle="tooltip"
    //         title="Translate"
    //         src={transIcon}
    //         onClick={() => setShowSelectBox(true)}
    //         className="w-8 h-8 ml-auto relative cursor-pointer"
    //         alt=""
    //         />
    //         </div>
    //       )} */}
    //       {loading ? (
    //         <span className="loading loading-spinner text-[#33B0CA] h-[20px] w-[20px] my-auto "></span>
    //       ) : (
    //         <img
    //           data-te-toggle="tooltip"
    //           title="Translate"
    //           src={transIcon}
    //           // onClick={() => setShowSelectBox(!showSelectBox)}
    //           onClick={() => setTransPopClose(id)}
    //           className="w-8 h-8 ml-auto  cursor-pointer"
    //           alt=""
    //         />
    //       )}
    //       {transPopClose === id && (
    //         <div className="absolute top-[32px] left-[-77px] z-20 w-[124px]  h-[27vh] overflow-x-hidden md:h-[40vh] overflow-y-auto border bg-[#fafafa]">
    //           {Object.entries(sortedLanguages)?.map(([key, name]) =>
    //             key !== source_language ? (
    //               <li
    //                 onClick={(e) => {
    //                   e.stopPropagation();
    //                   setSelectedOption(key);
    //                   setTransPopClose(null);
    //                 }}
    //                 className="cursor-pointer text-[14px] text-[#252525] hover:bg-[#33B0CA] hover:text-[#fafafa] list-none pl-[8px] border-b"
    //                 key={key}
    //                 value={key}
    //               >
    //                 {name}
    //               </li>
    //             ) : null
    //           )}
    //         </div>
    //       )}
    //     </div>
    //   )}
    // </div>
    <div ref={btnRef} className="relative">
          {/* {showSelectBox ? (
            <select
              value={selectedOption}
              onChange={handleOptionChange}
              className="border border-[#EAEAEA] p-1 rounded-[4px] w-full max-w-[81px] text-[12px] cursor-pointer"
            >
              {Object.entries(sortedLanguages)?.map(([key, name]) =>
                key !== source_language ? (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ) : null
              )}
            </select>
          ) : (
            <div className="w-[81px] lg:w-[41px] mx-auto">

            <img
            data-te-toggle="tooltip"
            title="Translate"
            src={transIcon}
            onClick={() => setShowSelectBox(true)}
            className="w-8 h-8 ml-auto relative cursor-pointer"
            alt=""
            />
            </div>
          )} */}
          {loading ? (
            <span className="loading loading-spinner text-[#33B0CA] h-[20px] w-[20px] my-auto "></span>
          ) : (
            <img
              data-te-toggle="tooltip"
              title="Translate"
              src={transIcon}
              // onClick={() => setShowSelectBox(!showSelectBox)}
              onClick={() => handleTranslate(id)}
              className="w-8 h-8 ml-auto  cursor-pointer"
              alt=""
            />
          )}
          {transPopClose === id && (
            <div className="absolute top-[32px] left-0 z-20 w-[124px]  h-[27vh] overflow-x-hidden md:h-[40vh] overflow-y-auto border bg-[#fafafa]">
              {Object.entries(sortedLanguages)?.map(([key, name]) =>
                key !== source_language ? (
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOption(key);
                      setTransPopClose(null);
                    }}
                    className="cursor-pointer text-[14px] text-[#252525] hover:bg-[#33B0CA] hover:text-[#fafafa] list-none pl-[8px] border-b"
                    key={key}
                    value={key}
                  >
                    {name}
                  </li>
                ) : null
              )}
            </div>
          )}
          {
            noAccessPopup && <NoAccessPopUp setNoAccessPopup={setNoAccessPopup}/>
          }
        </div>
  );
};

export default TranslatePremise;
