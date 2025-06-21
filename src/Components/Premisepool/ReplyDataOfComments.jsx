import { motion } from "framer-motion";
import ReplyToComments from "./Comments/ReplyToComments";
import { useGetAllReplyOfACommentQuery } from "../../app/EndPoints/commentReply/reply";

const ReplyDataOfComments = ({
  comments,
  hasManyReplies,
  latestReplyRef,
  fromNew,
  owner,
  user,
  handleAddToBeat,
  setBeatCommentText,
  setCommentText,
  setProjectBeatOpen,
  replyToCommentID,
  commentRefetch
}) => {
  const {
    data: replyData,
    isLoading: isReplyLoading,
    isError,
    refetch: replyRefetch,
  } = useGetAllReplyOfACommentQuery(comments?.id);
  return (
    <div>
      <div>
        {
          <div
            className={`${
              hasManyReplies
                ? "max-h-[40vh] overflow-y-auto pr-2 overflow-x-hidden"
                : ""
            }`}
          >
            {replyData?.replies
              ?.slice() // Create a shallow copy to avoid mutating the original array
              ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              ?.map((reply, index) => (
                <motion.div
                  // data-reply
                  key={reply.id + index}
                  ref={index === replyData?.replies?.length - 1 ? latestReplyRef : null}
                  initial={{ opacity: 0, y: 70 }} // Start from slightly below the final position
                  animate={{ opacity: 1, y: 0 }} // Move to the final position
                  exit={{ opacity: 0, y: -50 }} // Exit by moving above the screen
                  transition={{ duration: 0.5 }} // Adjust the duration as needed
                >
                  <ReplyToComments
                    fromNew={fromNew}
                    commentIdx={comments?.c_value}
                    // Make sure to provide a unique key when mapping over an array
                    reply={reply}
                    index={index}
                    owner={owner}
                    setProjectBeatOpen={setProjectBeatOpen}
                    setCommentText={setCommentText}
                    setBeatCommentText={setBeatCommentText}
                    replyRefetch={replyRefetch}
                    replyToCommentID={replyToCommentID}
                    user={user}
                    handleAddToBeat={handleAddToBeat}
                    commentRefetch={commentRefetch}
                  />
                </motion.div>
              ))}
          </div>
        }{" "}
      </div>
    </div>
  );
};

export default ReplyDataOfComments;
