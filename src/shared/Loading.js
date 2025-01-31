import React from "react";
import ReactLoading from "react-loading";

const Loading = () => {
  return (
   
    <div className="flex justify-center items-center h-[270px] max-h-[500px]">
      <h1 className="flex justify-center items-center z-[1]">
        <ReactLoading
          type={"spinningBubbles"}
          color={"#33B0CA"}
          height={100}
          width={100}
        />
      </h1>
    </div>
  );
};

export default Loading;
