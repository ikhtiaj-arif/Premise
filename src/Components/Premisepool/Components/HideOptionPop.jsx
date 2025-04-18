import React, { useContext, useEffect, useState } from "react";
import { HiMiniUserMinus, HiMiniUsers } from "react-icons/hi2";
import { IoLockClosed } from "react-icons/io5";
import {
  useCreateHideUnhideMutation,
  useGetAllBuddiesQuery,
  useGetAllUsersQuery,
} from "../../../app/EndPoints/MemberPage/Buddies";
import crossIcon from "../../../img/Icons/crossIcon.png";
import lockImg from "../../../img/lockImg.png";

import { BsGlobeCentralSouthAsia } from "react-icons/bs";
import { CgSearch } from "react-icons/cg";
import { useGetHiddenPremiseCountQuery } from "../../../app/EndPoints/premisePoolApi";
import { hideUnhidePremiseCustom } from "../hideUnhidePremiseCustom";
import HideUnhideUesr from "./HideUnhideUesr";
import { MyContext } from "../../../App";
import WentWrongPop from "../../PremiseV2/Popups/alerts/WentWrongPop";

const HideOptionPop = ({
  openHidePop,
  setOpenHidePop,
  id,
  refetch,
  user,
  filter_flag,
  visible_to,
  comment_filter_flag,
}) => {
  // const user = useSelector((state) => state?.user?.id)
  const { addedByMeCondition, currentUser } = useContext(MyContext);
  const {
    data: hiddenCountRes,
    isLoading: countLoading,
    refetch: hiddenCountRefetch,
  } = useGetHiddenPremiseCountQuery({
    user_id: currentUser?.id,
    shared: addedByMeCondition,
  });
  const [createHideUnhide, ishideUnhide] = useCreateHideUnhideMutation();
  const usersData = useGetAllUsersQuery();
  const buddiesData = useGetAllBuddiesQuery(user);
  const [option, setOption] = useState("");
  const [commentHide, setCommentHide] = useState(comment_filter_flag ? 1 : 0);
  const [btnDisable, setBtnDisable] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const allSelectedUserIds = selectedUserIds.filter(
    (userId) => userId !== user
  );
  // console.log("comment_filter_flag", comment_filter_flag);
  useEffect(() => {
    if (filter_flag === 0) {
      setOption("show_buddies");
    } else if (filter_flag === 1) {
      setOption("hide_from_all");
    } else if (filter_flag === 2) {
      setOption("visible_to");
    } else if (filter_flag === 3) {
      setOption("visible_all");
    } else {
      setOption("visible_all");
    }
  }, [filter_flag]);

  useEffect(() => {}, [comment_filter_flag, commentHide]);

  useEffect(() => {
    if (visible_to && visible_to.length > 0) {
      const userIds = visible_to.map((item) => item.id); // Assuming the ID field is named 'id'
      setSelectedUserIds(userIds);
    }
  }, [visible_to]);

  // const [hiddenFromAll, setHiddenFromAll] = useState(false);
  // const [hiddenButBuddy, setHiddenButBuddy] = useState(false);
  // const [hiddenButUsers, setHiddenButUsers] = useState(false);

  const handleOptionSelect = (value) => {
    setOption(value);
    hiddenCountRefetch();
  };

  const handleSelectionChange = (value) => {
    setCommentHide(value);
    hiddenCountRefetch();
  };

  const handleToggleCheck = (id) => {
    setSelectedUserIds((prevSelectedUserIds) => {
      if (prevSelectedUserIds.includes(id)) {
        return prevSelectedUserIds.filter((userId) => userId !== id);
      } else {
        return [...prevSelectedUserIds, id];
      }
    });
  };
  const [wentWrongPop, setWentWrongPop] = useState(false);

  const handlePostHideUnhide = async (id, refetch, user) => {
    // setWentWrongPop(true)
    // return
    // console.log(id, user, option,selectedUserIds, "SDfsdfdfsdf");
    hideUnhidePremiseCustom(
      id,
      refetch,
      user,
      option,
      selectedUserIds,
      setBtnDisable,
      setOpenHidePop,
      commentHide,
      setWentWrongPop
    );
    hiddenCountRefetch();
  };
  // console.log("Selected User IDs:");

  const filteredBuddies = buddiesData?.data?.filter(
    (buddy) =>
      buddy.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buddy.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buddy.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed top-0 left-0 w-full h-full flex  items-center bg-[#252525b0] justify-center z-[40]  ">
      <div className="h-[550px] md:h-[620px] w-[439px] md:mx-auto mt-0 md:mt-[108px] xl:mt-0">
        <div className=" w-full max-w-[1165px] max-h-[539px] pt-[63px] sm:pt-[30px]  relative">
          {/* close popup */}
          <div className="text-right flex justify-end h-0 ">
            <img
              src={crossIcon}
              alt=""
              className="text-red-500 w-8 h-8 top-[22px] sm:top-[31px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px] absolute z-[1] m-1 cursor-pointer"
              onClick={() => setOpenHidePop(null)}
            />
          </div>
          <div
            className={`bg-[#fff] h-[80vh] ${
              option === "visible_to"
                ? "  md:h-[504px] xl:h-[547px]"
                : "  md:h-[530px]"
            }
            
              sm:rounded-[8px] `}
          >
            <div className="mt-[16px] mx-auto w-full  flex justify-center">
              <img className="w-[35px] h-[40px] mt-2" src={lockImg} alt="" />
            </div>
            <div className=" w-[90%] max-w-[374.86px] mx-auto">
              {option === "visible_to" ? (
                <div>
                  <p className="text-[16px] text-center pt-[4px]  px-[12px] font-[500] text-[#252525] ">
                    Visibility Settings
                  </p>
                  <p className=" text-center leading-4 pb-[8px] px-[12px] text-[14px] font-[400] text-[#616161] ">
                    (Visible only to selected buddies)
                  </p>
                  <div className="h-[1px] w-[353px] bg-[#616161] mx-auto" />
                </div>
              ) : (
                <div>
                  <p className="text-[16px] text-center pt-[4px]  px-[12px] font-[500] text-[#252525] ">
                    Visibility Settings
                  </p>

                  <p className="text-[14px] text-center leading-4 pt-[3px] pb-[5px] px-[8px] font-[400] text-[#616161] ">
                    Who can see the premise and the comments ?
                  </p>
                  <div className="h-[1px] w-[353px] bg-[#616161] mx-auto" />
                </div>
              )}
            </div>
            {option === "visible_to" ? (
              <div className="overflow-y-auto h-auto max-h-[232px]">
                {
                  <>
                    {" "}
                    <div className="flex border items-center border-[#B4B4B4] px-[14px] h-[32px] rounded-full font-[500] w-[251.86px] mx-auto  mt-[8px] py-[5px]">
                      <input
                        type="text"
                        placeholder="Search buddies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-[14px] px-3  focus:outline-none rounded-md"
                      />
                      <CgSearch
                        // onClick={handleFilterSubmit}
                        className="h-[20px] w-[20px] "
                      />
                    </div>
                    {filteredBuddies?.map((user, index) => (
                      <div key={index}>
                        <HideUnhideUesr
                          user={user}
                          handleToggleCheck={handleToggleCheck}
                          selectedUserIds={selectedUserIds}
                        />
                      </div>
                    ))}
                    {/* {buddiesData?.data &&
                      buddiesData?.data?.map((user, index) => (
                        <div key={index} className="">
                          <HideUnhideUesr
                            user={user}
                            handleToggleCheck={handleToggleCheck}
                            selectedUserIds={selectedUserIds}
                          />
                        </div>
                      ))} */}
                  </>
                }
              </div>
            ) : (
              <div className="overflow-y-auto h-[50vh] md:h-[333px]">
                <div
                  onClick={() => handleOptionSelect("visible_all")}
                  className={`flex justify-between items-center cursor-pointer font-[500] w-[90%] max-w-[374.86px] mx-auto px-[12px] my-[6px] py-[10px] rounded-[8px]  hover:bg-[#f8f8f8] `}
                >
                  <div className="flex items-center gap-[8px]">
                    <div className="bg-[#eaeaea] h-[38px] w-[38px] border  rounded-full relative">
                      {" "}
                      <BsGlobeCentralSouthAsia className="text-[21px] absolute top-[7px] left-[50%] ml-[-10px]" />{" "}
                    </div>
                    <div className="mt-[-5px]">
                      <p className="text-[16px] text-[#252525] leading-[22px]">
                        Everyone
                      </p>
                      {/* <p className="text-[12px] text-[#616161] font-[400] leading-[12px]">
                        Everyone will be able to see your premise.
                      </p> */}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="radio-2"
                    className=""
                    checked={option === "visible_all"}
                    readOnly
                  />
                </div>

                <div className="h-[1px] w-full max-w-[353px] bg-[#EAEAEA] mx-auto" />

                <div
                  onClick={() => handleOptionSelect("show_buddies")}
                  className={`flex justify-between items-center cursor-pointer font-[500] w-[90%] max-w-[374.86px] mx-auto px-[12px] my-[6px] py-[10px] rounded-[8px]  hover:bg-[#f8f8f8] `}
                >
                  <div className="flex items-center gap-[8px]">
                    <div className="bg-[#eaeaea] h-[38px] w-[38px] border  rounded-full relative">
                      {" "}
                      <HiMiniUsers className="text-[21px] absolute top-[7px] left-[50%] ml-[-10px]" />{" "}
                    </div>
                    <div className="mt-[-5px]">
                      <p className="text-[16px] text-[#252525] leading-[22px]">
                        All Buddies
                      </p>
                      {/* <p className="text-[12px] text-[#616161] font-[400] leading-[12px]">
                        All your buddies can see your premise.
                      </p> */}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="radio-2"
                    className=""
                    checked={option === "show_buddies"}
                    readOnly
                  />
                </div>

                <div className="h-[1px] w-full max-w-[353px] bg-[#EAEAEA] mx-auto" />

                <div
                  onClick={() => handleOptionSelect("visible_to")}
                  className={`flex justify-between items-center cursor-pointer font-[500]  w-[90%] max-w-[374.86px] mx-auto px-[12px] my-[6px] py-[10px] rounded-[8px]  hover:bg-[#f8f8f8] `}
                >
                  <div className="flex items-center gap-[8px]">
                    <div className="bg-[#eaeaea] h-[38px] w-[38px] border  rounded-full relative">
                      {" "}
                      <HiMiniUserMinus className="text-[21px] absolute top-[7px] left-[50%] ml-[-10px]" />{" "}
                    </div>
                    <div className="mt-[-5px]">
                      <p className="text-[16px] text-[#252525] leading-[22px]">
                        Selected Buddies
                      </p>
                      {/* <p className="text-[12px] text-[#616161] font-[400] leading-[12px]">
                        Only selected buddies can view your premise.
                      </p> */}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="radio-2"
                    className=""
                    checked={option === "visible_to"}
                    readOnly
                  />
                </div>

                <div className="h-[1px] w-full max-w-[353px] bg-[#EAEAEA] mx-auto" />
                <div
                  onClick={() => handleOptionSelect("hide_from_all")}
                  className={`flex justify-between items-center cursor-pointer font-[500] w-[90%] max-w-[374.86px] mx-auto px-[12px] my-[6px] py-[10px] rounded-[8px]  hover:bg-[#f8f8f8] `}
                >
                  <div className="flex items-center gap-[8px]">
                    <div className="bg-[#eaeaea] h-[38px] w-[38px] border  rounded-full relative">
                      {" "}
                      <IoLockClosed className="text-[21px] absolute top-[7px] left-[50%] ml-[-10px]" />{" "}
                    </div>
                    <div className="mt-[-5px]">
                      <p className="text-[16px] text-[#252525] leading-[22px]">
                        Only Me
                      </p>
                      {/* <p className="text-[12px] text-[#616161] font-[400] leading-[12px]">
                        No one will be able to see your premise.
                      </p> */}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="radio-2"
                    className=""
                    checked={option === "hide_from_all"}
                    readOnly
                  />
                </div>
                <div className="h-[1px] w-full max-w-[353px] bg-[#EAEAEA] mx-auto" />
                {option !== "hide_from_all" && (
                  <div className="flex items-center justify-center gap-2 pt-[20px] w-[90%]  mx-auto">
                    <p className="text-[16px] text-[#252525] leading-[22px] font-[500]">
                      Apply To:
                    </p>
                    <div className="flex gap-2 items-center ">
                      <div className="flex gap-[4px] items-center ">
                        <input
                          className="cursor-pointer "
                          type="radio"
                          id="entirePremise"
                          name="applyTo"
                          checked={commentHide === 0}
                          onChange={() => handleSelectionChange(0)}
                        />
                        <label
                          htmlFor="entirePremise"
                          className="text-[12px]  md:text-[14px] cursor-pointer"
                        >
                          Premise & comments
                        </label>
                      </div>
                      <div className="flex gap-[4px] items-center ">
                        <input
                          className="cursor-pointer "
                          type="radio"
                          id="onlyComments"
                          name="applyTo"
                          checked={commentHide === 1}
                          onChange={() => handleSelectionChange(1)}
                        />
                        <label
                          htmlFor="onlyComments"
                          className="text-[12px] md:text-[14px] cursor-pointer"
                        >
                          Only Premise
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {option === "visible_to" && (
              <div className="border mt-[8px] rounded-[8px] bg-[#fafafa] flex flex-wrap gap-[8px] p-[12px] h-[70px] max-h-[90px] w-[90%] mx-auto overflow-x-auto overflow-y-auto ">
                {allSelectedUserIds?.map((userId, index) => {
                  // const user = usersData?.data?.merged_records?.find(
                  const user = buddiesData?.data?.find(
                    (user) => user.user_id === userId
                  );
                  return (
                    <div
                      className="border rounded-[4px] h-[18px] px-[6px] bg-[#eaeaea] min-w-min"
                      key={index}
                    >
                      {user && user?.firstName ? (
                        <p className="text-[12px] text-[#252525] font-[500] leading-[15px] m-0">
                          {user?.firstName} {user?.lastName}
                        </p>
                      ) : (
                        <p className="text-[12px] text-[#252525] font-[500] leading-[15px] m-0">
                          {user?.email?.split("@")[0]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {option === "visible_to" && (
              <div className="flex items-center justify-center gap-2 pt-[12px] w-[90%]  mx-auto">
                <p className="text-[16px] text-[#252525] leading-[22px] font-[500]">
                  Apply To:
                </p>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-[4px] items-center ">
                    <input
                      className="cursor-pointer "
                      type="radio"
                      id="entirePremise"
                      name="applyTo"
                      checked={commentHide === 0}
                      onChange={() => handleSelectionChange(0)}
                    />
                    <label
                      htmlFor="entirePremise"
                      className="text-[12px] md:text-[14px]  cursor-pointer"
                    >
                      Premise & comments
                    </label>
                  </div>
                  <div className="flex gap-[4px] items-center ">
                    <input
                      className="cursor-pointer "
                      type="radio"
                      id="onlyComments"
                      name="applyTo"
                      checked={commentHide === 1}
                      onChange={() => handleSelectionChange(1)}
                    />
                    <label
                      htmlFor="onlyComments"
                      className="text-[12px] md:text-[14px]  cursor-pointer"
                    >
                      Only Premise
                    </label>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`  w-[90%] gap-[12px] flex flex-row-reverse mt-[10px]  md:absolute ${
                option === "visible_to"
                  ? "md:bottom-0 xl:bottom-[-38px]"
                  : "md:bottom-[-10px]"
              }    md:right-[21px]  mx-auto`}
            >
              <button
                disabled={btnDisable}
                onClick={() =>
                  handlePostHideUnhide(id, refetch, user, selectedUserIds)
                }
                className={`${
                  btnDisable ? "bg-[#b4bdbf] " : "bg-[#33B0CA] "
                } font-[500] text-white h-[34px] w-[99px] text-[14px] rounded-[8px]`}
              >
                Save
              </button>{" "}
              {option === "visible_to" ? (
                <button
                  onClick={() => {
                    setOption("hide_from_all");
                  }}
                  className="font-[500] border !border-[#33B0CA] text-[#33B0CA] h-[34px] w-[99px] text-[14px] rounded-[8px] hover:text-white hover:bg-[#33B0CA]"
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={() => {
                    setOpenHidePop(null);
                  }}
                  className="font-[500] border !border-[#33B0CA] text-[#33B0CA] h-[34px] w-[99px] text-[14px] rounded-[8px] hover:text-white hover:bg-[#33B0CA]"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {wentWrongPop && <WentWrongPop popClose={setWentWrongPop} />}
    </div>
  );
};

export default HideOptionPop;
