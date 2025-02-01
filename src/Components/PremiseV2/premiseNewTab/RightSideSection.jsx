// import React from "react";
// import AllComments from "../AllComments";
// import { motion } from "framer-motion";

// const RightSideSection = ({ commentsData }) => {
//   return (
//     <div>
//       {" "}
//       {commentsData?.comments?.map((comments, commentIdx) => (
//         <motion.div
//           key={commentIdx + 1}
//           initial={{ opacity: 0, y: 70 }} // Start from slightly below the final position
//           animate={{ opacity: 1, y: 0 }} // Move to the final position
//           exit={{ opacity: 0, y: -50 }} // Exit by moving above the screen
//           transition={{ duration: 0.5 }} // Adjust the duration as needed
//         >
//           <AllComments
//             commentIdx={commentIdx + 1}
//             comments={comments}
//             data={data}
//             refetch={refetch}
//             openReplyField={openReplyField}
//             setOpenReplyField={setOpenReplyField}
//             replyToCommentID={replyToCommentID}
//             setReplyToCommentID={setReplyToCommentID}
//             replyResStat={replyResStat}
//             setCommentOwner={setCommentOwner}
//             setOpenAllReplies={setOpenAllReplies}
//             openAllReplies={openAllReplies}
//             commentRefetch={commentRefetch}
//             proImgUrl={proImgUrl}
//             setReplyField={setReplyField}
//             replyField={replyField}
//             replyRef={replyRef}
//             handleReplyTextChange={handleReplyTextChange}
//             handlePostReplyToComment={handlePostReplyToComment}
//             replyLoading={replyLoading}
//             premiseData={premiseData}
//             replyTextCount={replyTextCount}
//             setReplyTextCount={setReplyTextCount}
//             openReplyFieldID={openReplyFieldID}
//             setOpenReplyFieldID={setOpenReplyFieldID}
//             project_id={project_id}
//           />
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default RightSideSection;
