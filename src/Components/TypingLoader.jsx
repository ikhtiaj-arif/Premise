import { useEffect, useState } from "react";
import loaderIcon from "../img/loader-icon.png";
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
  const typingSpeed = 200; // Speed of typing effect in ms
  const pauseDuration = 500; // Pause duration after full text is typed
  const [charIndex, setCharIndex] = useState(0);

  // useEffect(() => {
  //   let isCancelled = false;
  //   const typeText = async () => {
  //     for (let i = 0; i <= data[currentIndex].length; i++) {
  //       if (isCancelled) return; // Exit if component unmounts
  //       setDisplayedText(data[currentIndex].slice(0, i));
  //       await new Promise((resolve) => setTimeout(resolve, typingSpeed));
  //     }

  //     // Wait after the full message is typed out
  //     await new Promise((resolve) => setTimeout(resolve, pauseDuration));

  //     // Move to the next message
  //     if (!isCancelled && currentIndex < data.length - 1) {
  //       setCurrentIndex((prevIndex) => prevIndex + 1);
  //     }
  //   };

  //   typeText();

  //   return () => {
  //     isCancelled = true; // Clean up if the component unmounts
  //   };
  // }, [currentIndex]);

  useEffect(() => {
    let isCancelled = false;

    const typeText = () => {
      if (isCancelled) return;

      if (charIndex < data[currentIndex].length) {
        setDisplayedText((prev) => prev + data[currentIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else if (currentIndex < data.length - 1) {
        // Move to the next text if it's not the last one
        setTimeout(() => {
          if (!isCancelled) {
            setDisplayedText("");
            setCharIndex(0);
            setCurrentIndex((prevIndex) => prevIndex + 1);
          }
        }, pauseDuration);
      }
    };

    const typingInterval = setInterval(typeText, typingSpeed);

    return () => {
      isCancelled = true;
      clearInterval(typingInterval);
    };
  }, [charIndex, currentIndex, data]);

  const progressPercent = Math.min(
    (currentIndex / (data.length - 1)) * 100,
    100,
  );

  return (
    // <div className="relative rounded-[8px]  h-[100px] bg-[#fafafa]  flex items-center">
    //   <div className="">
    //     <h2 className="text-[16px] lg:text-[24px] ml-[40px] font-[500] text-[#00c3ff]">
    //       {displayedText}
    //       <span className="blinking-cursor">|</span>
    //     </h2>
    //   </div>
    // </div>
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-[10px] shadow-lg w-[95%] h-auto md:w-[500px] md:h-[371px] flex flex-col justify-between items-center py-8 px-[30px] md:px-[60px]">
        <div className="w-full">
          <img
            src={loaderIcon}
            alt="Icon"
            className="w-[50px] h-[50px] mx-auto mb-4 float-loading"
          />
          <div className="bg-[#7B809A80] h-[1px] w-full mx-auto"></div>
        </div>

        <div className="w-full flex justify-between items-center my-4 md:my-0">
          <span className="text-[#62748E] text-[12px] font-normal">SCENE</span>
          <span className="text-[#62748E] text-[12px] font-normal">INT.</span>
        </div>

        <div className="w-full text-[14px] md:text-[18px] min-h-[32px] text-[#1D293D] font-normal">
          {displayedText || "\u00A0"}
        </div>

        <div className="w-full mb-4 md:mb-0">
          <p className="bg-[#7B809A80] h-[4px] w-[60%] my-3 rounded-[4px]"></p>
          <p className="bg-[#7B809A80] h-[4px] w-[80%] my-3 rounded-[4px]"></p>
          <p className="bg-[#7B809A80] h-[4px] w-[50%] my-3 rounded-[4px]"></p>
        </div>

        <div className="bg-[#7B809A80] h-[4px] w-[60%] mx-auto rounded-[4px] overflow-hidden">
          <div
            className="h-full bg-[#741CFF] transition-all duration-500 ease-out rounded-[4px]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingLoader;
