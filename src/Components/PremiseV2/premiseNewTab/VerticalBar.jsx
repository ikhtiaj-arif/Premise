import React, { useState } from "react";

const VerticalBar = ({ comments, currentCommentRef, handleOpenAllReplies }) => {
  const [focusedComment, setFocusedComment] = useState(null);
  const handleFocusComment = (id) => {
    const currentCommentId = comments.filter(commit => commit.id === id)
    const commentOwnerName = `${currentCommentId[0]?.user?.first_name} ${currentCommentId[0]?.user?.last_name}`;
    setFocusedComment(id);
    handleOpenAllReplies(id, commentOwnerName)
    const ref = currentCommentRef.current[id];
    if (ref) {
      ref.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  return (
    <div className="absolute top-0 right-0 bg-[#eaeaea] w-[37px] hidden lg:block h-full overflow-y-auto overflow-x-hidden">
      {[...(comments || [])]
        .sort((a, b) => a.c_value - b.c_value)
        .map((comment, index) => (
          <div className={`px-3 ${focusedComment === comment.id ? 'text-[#33b0ca]' : 'text-[#252525]'}`}>
            <button
              key={comment.c_value}
              onClick={() => handleFocusComment(comment.id)}
              className="text-[14px]"
            >
              {comment.c_value}
            </button>
          </div>
        ))}
    </div>
  );
};

export default VerticalBar;
