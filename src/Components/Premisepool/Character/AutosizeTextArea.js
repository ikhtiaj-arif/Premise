const AutoSizeTextArea = (textAreaRef, value) => {
    if (textAreaRef) {
      textAreaRef.style.height = "0px"; // Reset height
      const scrollHeight = textAreaRef.scrollHeight; // Get the scrollHeight
      textAreaRef.style.height = scrollHeight + "px"; // Set height to scrollHeight
    }
  };
  
  export default AutoSizeTextArea;
  