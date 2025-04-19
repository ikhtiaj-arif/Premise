import React, { useEffect, useState } from "react";
import "./TypingLoader.css";

const TypingLoader = ({
  data = [
    "Initializing...",
    "Creating Structures...",
    "Collecting Data...",
    "Analyzing Data...",
    "Finishing!...",
  ],
}) => {
  // const data = [
  //   "Initializing",
  //   "Analyzing Premise",
  //   "Analyzing other Inputs",
  //   "Brainstorming",
  //   "Creating Story-Arc",
  //   "Defining Characters",
  //   "Drawing Character Sketches",
  //   "Establishing Relationships among Characters",
  //   "Incorporating Geography",
  //   "Customizing Period",
  //   "Customizing for Genre and Sub-Genre",
  //   "Defining Narrative Structure",
  //   "Brainstorming",
  //   "Generating Pointed Queries",
  // ];

  // const dataPremise =[
  //   "Initializing",
  //   "Creating Structures",
  //   "Collecting Data",
  //   "Analyzing Data",
  //   "Finishing!",
  // ]

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const typingSpeed = 120; // Speed of typing effect in ms
  const pauseDuration = 300; // Pause duration after full text is typed

  useEffect(() => {
    let isCancelled = false;

    const typeText = async () => {
      for (let i = 0; i <= data[currentIndex].length; i++) {
        if (isCancelled) return; // Exit if component unmounts
        setDisplayedText(data[currentIndex].slice(0, i));
        await new Promise((resolve) => setTimeout(resolve, typingSpeed));
      }

      // Wait after the full message is typed out
      await new Promise((resolve) => setTimeout(resolve, pauseDuration));

      // Move to the next message
      if (!isCancelled && currentIndex < data.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    };

    typeText();

    return () => {
      isCancelled = true; // Clean up if the component unmounts
    };
  }, [currentIndex]);

  return (
    <div className="relative rounded-[8px]  h-[100px] bg-[#fff] lg:bg-[#fafafa]  flex items-center">
      <div className="">
        <h2 className="text-[16px] lg:text-[24px] ml-[40px] font-[500] text-[#33B0CA]">
          {displayedText}
          <span className="blinking-cursor">|</span>
        </h2>
      </div>
    </div>
  );
};

export default TypingLoader;
