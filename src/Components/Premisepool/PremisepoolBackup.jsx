import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { MyContext } from "../../App";
import {
  useGetPremiseQuery,
  useGetPremiseUserQuery,
} from "../../app/EndPoints/premisePoolApi";
import { setUser } from "../../app/Slices/userSlice";
import Loading from "../../shared/Loading";
import AddPremise2 from "./Components/AddPremise2";
import DeletePremise from "./DeletePremise";
import PremiseCard from "./PremiseCard";
import SortPagination from "./SortPagination/SortPagination";
import UserNamePopup from "./UserNamePopup";

const Premisepool = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [sortedData, setSortedData] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [showRefine, setShowRefine] = useState(false);

  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const { isAddNew, setIsAddNew } = useContext(MyContext);
  const [isFirstCardBlinking, setIsFirstCardBlinking] = useState(false);

  const [queryUser, setQueryUser] = useState(null);
  const [refetching, setRefetching] = useState(false);
  const [querying, setQuerying] = useState(true);

  const [query, setQuery] = useState({
    pn: currentPage,
    ps: itemsToShow,
    sort: sortedData,
    order: sortOrder,
    text: text,
    user: queryUser,
    language: language,
  });
  useEffect(() => {
    // console.log("aaaaaaaaaaaaaaaaaaaaaaa", itemsToShow);
  }, [sortOrder, sortedData, itemsToShow, currentPage]);

  const res = useGetPremiseQuery(query);
  const { data: premiseData, isLoading, refetch } = res;

  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();

  const user = useSelector((state) => state?.user?.id);
  const dispatch = useDispatch();

  // const userFirstName = useSelector((state) => state?.user?.firstName);
  // const userLastName = useSelector((state) => state?.user?.lastName);
  const userFirstName = userQuery?.first_name;
  const userLastName = userQuery?.last_name;

  const [isDelete, setIsDelete] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [userNamePop, setUserPop] = useState(false);

  const [dataCount, setDataCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [addPopup, setAddPopup] = useState();
  const [isUserName, setIsUserName] = useState(true);

  // console.log(queryUser);

  useEffect(() => {
    setQuery({
      pn: currentPage,
      ps: itemsToShow,
      sort: sortedData,
      order: sortOrder,
      text: text,
      language: language,
      user: queryUser,
    });
    setTotalPages(Math.ceil(dataCount / itemsToShow));
  }, [
    currentPage,
    itemsToShow,
    dataCount,
    sortedData,
    sortOrder,
    text,
    language,
    queryUser,
  ]);

  useEffect(() => {
    if (res?.status === "fulfilled") {
      setRefetching(false);
      setQuerying(false);
    }
  }, [res]);

  useEffect(() => {
    if (!user) {
      dispatch(setUser(userQuery));
    }
  }, [userQuery, dispatch, user]);

  useEffect(() => {
    setDataCount(premiseData?.count);

    setTotalPages(Math.ceil(dataCount / itemsToShow));
    setViewData(premiseData?.results);
    refetch();
  }, [premiseData, dataCount, totalPages, itemsToShow, refetch]);

  // delete premise card
  const handleDelete = (id) => {
    setIsDelete(id);
  };

  const handleShow = () => {
    let newItemsToShow = itemsToShow + 12;
    if (newItemsToShow < premiseData?.count) {
      setItemsToShow(newItemsToShow);
      setHasMore(true);
    } else if (newItemsToShow >= premiseData?.count) {
      setItemsToShow(premiseData?.count);
      setHasMore(false);
    }
  };

  const [activeSearch, setActiveSearch] = useState(false);
  const [transPopClose, setTransPopClose] = useState({});

  const handleScroll = () => {
    setActiveSearch(false);
    setTransPopClose(null);
  };
  const [ttt, setTtt] = useState(false);
  // console.log(userFirstName)
  return (
    <div className=" h-auto overflow-y-hidden md:mr-[30px]" id="premisePool">
      <div className=" overflow-y-hidden overflow-x-hidden lg:px-5 mx-auto w-full md:w-[95%] xl:w-full h-auto max-w-[1580px] ">
        {/* <div className="md:px-5 mx-auto w-full md:w-[95%] xl:w-full h-70vh max-w-[1462px] mt-[22px] "> */}
        <div className="">
          <div className="flex  justify-between items-center h-[124px] ">
            <img
              // src={premiseImage}
              src={`https://uidemos.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-12-06+at+18.04+10.png`}
              alt="premise doodle"
              className="w-[103.07px] h-[103.72px] md:w-[115.07px] ml-[10px] md:ml-[0px]"
            />
            <div className="mr-[20px] md:mr-[0px] md:w-[50%] mt-[19px] xl:mt-[42px]">
              <button
                onClick={() => setAddPopup(true)}
                // className="btn btn"
                className="bg-[#00c3ff] flex items-center justify-center gap-[8px] text-[#FAFAFA] text-[14px] font-[600] rounded-[8px] min-w-[196px] min-h-[34px] md:ml-[-98px] px-[12px]"
              >
                <span className=" text-2xl ">+</span> Add A New Premise
              </button>
              <div className="shortLg-styles">
                <SortPagination
                  data={{
                    totalPages,
                    currentPage,
                    next: premiseData?.next,
                    prev: premiseData?.previous,
                  }}
                  showRefine={showRefine}
                  setShowRefine={setShowRefine}
                  setCurrentPage={setCurrentPage}
                  setViewData={setViewData}
                  setItemsToShow={setItemsToShow}
                  setSortedData={setSortedData}
                  setSortOrder={setSortOrder}
                  refetch={refetch}
                  setRefetching={setRefetching}
                  setText={setText}
                  setQueryUser={setQueryUser}
                  setLanguage={setLanguage}
                  sortOrder={sortOrder}
                  sortedData={sortedData}
                  language={language}
                  activeSearch={activeSearch}
                  setActiveSearch={setActiveSearch}
                />
              </div>
            </div>
          </div>
          <div className="w-full mx-auto h-[1px] bg-[#eaeaea] mt-[4px] barSm-hidden" />
          {addPopup && (
            <>
              {!userFirstName && !userLastName ? (
                <UserNamePopup
                  setIsUserName={setIsUserName}
                  setAddPopup={setAddPopup}
                  refetch={refetch}
                />
              ) : (
                <AddPremise2 setAddPopup={setAddPopup} refetch={refetch} />
                // <AddPremise2 setAddPopup={setAddPopup} refetch={refetch}
                //  setIsAddNew={setIsAddNew}/>
              )}
            </>
          )}

          <div className="shortM-hidden ">
            <SortPagination
              data={{
                totalPages,
                currentPage,
                next: premiseData?.next,
                prev: premiseData?.previous,
              }}
              showRefine={showRefine}
              setShowRefine={setShowRefine}
              setCurrentPage={setCurrentPage}
              setViewData={setViewData}
              setItemsToShow={setItemsToShow}
              setSortedData={setSortedData}
              setSortOrder={setSortOrder}
              refetch={refetch}
              setRefetching={setRefetching}
              setText={setText}
              setQueryUser={setQueryUser}
              setLanguage={setLanguage}
              sortOrder={sortOrder}
              sortedData={sortedData}
              language={language}
              activeSearch={activeSearch}
              setActiveSearch={setActiveSearch}
            />
          </div>
        </div>

        <div
          className="min-h-[66vh] h-[66vh] xl:h-[70vh] 2xl:h-[73vh] 3xl:h-[75vh] overflow-y-auto"
          id="scrollableDiv"
          onScroll={handleScroll}
        >
          {querying || refetching ? (
            <Loading />
          ) : viewData?.length > 0 ? (
            <InfiniteScroll
              // dataLength={premiseData?.count}
              dataLength={viewData?.length}
              // loader={<p className="text-center">Loading....</p>}
              hasMore={hasMore}
              next={handleShow}
              // endMessage={<p>NO MORE DATA!</p>}
              scrollableTarget="scrollableDiv"
            >
              <div
                //  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:w-[1400px] 2xl:w-[97%] gap-[22px] xl:gap-[20px] 2xl:gap-[48px] my-[22px] md:my-10 w-full md:w-[720px] lg:w-[1060px]  justify-center mx-auto"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:w-[1314px] 2xl:w-[97%] gap-[32px] md:gap-x-[30px] xl:gap-[15px] xxl:gap-[30px] 2xl:gap-[38px] my-[22px] md:my-10 w-full md:w-[720px] lg:w-[1060px] justify-center mx-auto"
              >
                {viewData?.map((premise, index) => (
                  <PremiseCard
                    setShowRefine={setShowRefine}
                    key={premise?._id}
                    index={index}
                    p={premise}
                    refetch={refetch}
                    userQuery={userQuery}
                    owner={{ user, userFirstName, userLastName }}
                    handleDelete={handleDelete}
                    shouldBlink={isAddNew && index === 0}
                    activeSearch={activeSearch}
                    transPopClose={transPopClose}
                    setTransPopClose={setTransPopClose}
                  />
                ))}
                {isDelete && (
                  <DeletePremise
                    setIsDelete={setIsDelete}
                    refetch={refetch}
                    isDelete={isDelete}
                  />
                )}
                {/* {srcData.map((item, idx) => {
                return (
                  <div className="px-12 py-2 my-2 border rounded-md">
                    This is no. {idx + 1}
                  </div>
                );
              })} */}
              </div>
            </InfiniteScroll>
          ) : (
            <p className="text-center text-2xl mt-10 text-red-700 font-semibold">
              No premise available
            </p>
          )}
        </div>
      </div>
      {/* footer */}
      {/* <Footer></Footer> */}
    </div>
  );
};
export default Premisepool;
