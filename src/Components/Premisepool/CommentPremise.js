import { motion, useAnimation } from "framer-motion";
import React, { useContext, useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import { MyContext } from "../../App";
import Popup from "./Popup";
import { useEffect } from "react";

const CommentPremise = ({  data, setIsLiked, refetch  }) => {
  const { comments, bg_img, bg_color, dText, id,shouldBlink,setHideDisable,
    hideDisable } = data;
  const { isAddNew, setIsAddNew } = useContext(MyContext);
  const [cmntPopup, setCmntPopup] = useState(false);
  const controls = useAnimation();

  //console.log('in comment',shouldBlink);
  // useEffect(() => {
  //   if (!cmntPopup && shouldBlink) {
  //     const blinkingInterval = setInterval(() => {
  //       controls.start({ color: "#33B0CA" }); // black color
  //       setTimeout(() => controls.start({ color: "#000000" }), 500); // Red color after 500ms

  //     }, 1000); // Blink every second

  //     const blinkingTimeout = setTimeout(() => {
  //       clearInterval(blinkingInterval);
  //       refetch();
  //       setIsAddNew(false);
  //     }, 20000); // 20 seconds

  //     return () => {
  //       clearInterval(blinkingInterval);
  //       clearTimeout(blinkingTimeout);
  //     };
  //   }
  // }, [cmntPopup, controls, refetch,shouldBlink,setIsAddNew]);
useEffect(() => {
  refetch()
}, [cmntPopup, refetch])

  return (
    <div>
      <motion.div
        className="notranslate flex gap-2"
        onClick={() => setCmntPopup(true)}
        animate={controls}
      >
        <button>
          <FaCommentDots
            src={`${URL}/media/img/Icons/comment_not_made_owner.png`}
            className="w-8 h-8 ml-4 cursor-pointer"
            alt=""
          />
        </button>

        <div className="flex items-center cursor-pointer text-[14px] font-[500]">
          <span className="mr-1">{comments}</span>
          {comments > 1 ? "Comments" : "Comment"}
        </div>
      </motion.div>
      {cmntPopup && (
         <Popup popClose={() => setCmntPopup(false)} setIsLiked={setIsLiked} data={data} refetch={refetch}/>
      )}
    </div>
  );
};

export default CommentPremise;
