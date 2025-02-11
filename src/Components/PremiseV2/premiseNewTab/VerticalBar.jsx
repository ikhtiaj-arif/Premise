import React from "react";

const VerticalBar = ({ comments,onFocusComment  }) => {
 
  return (
    <div className="h-screen absolute left-0 bg-[#eaeaea] w-[37px] hidden lg:block">
      {[...(comments || [])]
        .sort((a, b) => a.c_value - b.c_value)
        .map((comment, index) => (
          <div className="px-3 py-3 text-[#33b0ca]">
                  <button key={comment.c_value} onClick={() => onFocusComment(comment.id)}>
          {comment.c_value}
        </button></div>
        ))}
    </div>
  );
};

export default VerticalBar;
