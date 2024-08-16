import React, { useEffect, useState } from "react";

const TimeAgo = ({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const currentTime = new Date();
    const serverTime = new Date(timestamp);
    const timeDifference = currentTime - serverTime;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
      setTimeAgo(`one minute ago`);
    } else if (minutes < 60) {
      if (minutes === 1) {
        setTimeAgo(`1 minute ago`);
      } else {
        setTimeAgo(`${minutes} minutes ago`);
      }
    } else if (hours < 24) {
      if (hours === 1) {
        setTimeAgo(`1 hour ago`);
      } else {
        setTimeAgo(`${hours} hours ago`);
      }
    } else if (days < 30) {
      if (days === 1) {
        setTimeAgo(`1 day ago`);
      } else {
        setTimeAgo(`${days} days ago`);
      }
    } else if (months < 12) {
      if (months === 1) {
        setTimeAgo(`1 month ago`);
      } else {
        setTimeAgo(`${months} months ago`);
      }
    } else {
      if (years === 1) {
        setTimeAgo(`one year ago`);
      } else {
        setTimeAgo(`${years} years ago`);
      }
    }
  }, [timestamp]);

  return <span>{timeAgo}</span>;
};

export default TimeAgo;
