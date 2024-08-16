import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

const Pagination = () => {
    return (
        <div>
            <div className="mb-5">
          <div className="flex items-center gap-5">
            <div className="flex items-center border bg-[#EAEAEA] px-[8px] py-[6px] rounded-[10px]">
              <p className=" text-[14px] font-[600] text-[#252525] mr-[4px]">
                Page
              </p>
              <ReactPaginate
                previousLabel={
                  <FaChevronLeft
                    className={
                      pre === null &&
                      "cursor-disabled-PremisePool text-[12px] text-[#9a9797]"
                    }
                  />
                }
                nextLabel={
                  <FaChevronRight
                    className={
                      next === null &&
                      "cursor-disabled-PremisePool text-[#9a9797]"
                    }
                  />
                }
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={"pagination-premise"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
                forcePage={currentPage - 1}
              />
            </div>
          </div>
        </div>
            
        </div>
    );
};

export default Pagination;