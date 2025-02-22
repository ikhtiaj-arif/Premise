import React from "react";
import { FaComment } from "react-icons/fa";

const PopupComment = ({
  setOpenReplyField,
  setCommentField,
  commentField,
  finalCount,
}) => {
  return (
    <div className=" defaultCursor flex gap-2">
      <button
        onClick={() => {
          setOpenReplyField(null);
          setCommentField(!commentField);
        }}
      >
        <FaComment className=" text-[24px]" />
      </button>
      <p className=" text-[14px] font-[500]">
        {finalCount}{" "}
        {finalCount > 1 ? (
          <span className="comments-m">Brainstorms</span>
        ) : (
          <span className="comments-m"> Brainstorm</span>
        )}
      </p>
    </div>
  );
};

export default PopupComment;
