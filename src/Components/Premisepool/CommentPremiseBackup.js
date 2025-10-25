import { motion, useAnimation } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import { MyContext } from "../../App";
import Popup from "./Popup";

const CommentPremise = ({ data, setIsLiked, refetch }) => {
  const { comments, bg_img, bg_color, dText, id,shouldBlink } = data;
  const { isAddNew, setIsAddNew } = useContext(MyContext);
  const [cmntPopup, setCmntPopup] = useState(false);
  const controls = useAnimation();

  //console.log('in comment',shouldBlink);
  useEffect(() => {
    if (!cmntPopup && shouldBlink) {
      const blinkingInterval = setInterval(() => {
        controls.start({ color: "#00c3ff" }); // black color
        setTimeout(() => controls.start({ color: "#000000" }), 500); // Red color after 500ms

      }, 1000); // Blink every second

      const blinkingTimeout = setTimeout(() => {
        clearInterval(blinkingInterval);
        refetch();
        setIsAddNew(false);
      }, 20000); // 20 seconds

      return () => {
        clearInterval(blinkingInterval);
        clearTimeout(blinkingTimeout);
      };
    }
  }, [cmntPopup, controls, refetch,shouldBlink,setIsAddNew]);

  return (
    <div>
      <motion.div
        className="flex gap-2"
        onClick={() => setCmntPopup(true)}
        animate={controls}
      >
        <button>
          <FaCommentDots
            // src={`${URL}/media/img/Icons/comment_not_made_owner.png`}
            className="w-8 h-8 ml-4 cursor-pointer"
            alt=""
          />
        </button>

        <div className="lg:mt-5 flex cursor-pointer text-[12px] font-[400]">
          <span className="mr-1">{comments}</span>
          {comments > 1 ? "Comments" : "Comment"}
        </div>
      </motion.div>
      {cmntPopup && (
        <Popup popClose={() => setCmntPopup(false)} setIsLiked={setIsLiked} data={data} />
      )}
    </div>
  );
};


