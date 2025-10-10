import { useEffect, useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import AllComments from "./AllComments";
import TypingLoader from "../TypingLoader";


const CommentList = ({
  comments,
  handleOpenAllReplies,
  ...props
}) => {
  const [visibleCount, setVisibleCount] = useState(20); // how many comments to show initially
  const loadMoreRef = useRef(null);

  // Sort once for consistent order
  const sortedComments = [...comments].sort((a, b) => a.c_value - b.c_value);

  // Load more comments when scrolling near the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + 20, sortedComments.length)
          );
        }
      },
      { threshold: 0.2 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [sortedComments.length]);

  const visibleComments = sortedComments.slice(0, visibleCount);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center mt-8">
          <TypingLoader />
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {visibleComments.map((comment, index) => (
          <motion.div
            key={comment.id + index}
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <AllComments
              {...props}
              handleOpenAllReplies={handleOpenAllReplies}
              commentIdx={index + 1}
              comments={comment}
            />
          </motion.div>
        ))}

        {/* Lazy load trigger */}
        {visibleCount < sortedComments.length && (
          <div
            ref={loadMoreRef}
            className="flex justify-center my-4 text-gray-400 text-sm"
          >
            Loading more comments...
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default CommentList;
