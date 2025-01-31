import React from "react";
import { useGetSavedCharactersQuery } from "../../../app/EndPoints/Characters/Characters";
import crossIcon from "../../../img/Icons/crossIcon.png";

const ViewCharacters = ({ id, setOpenCharacterChart }) => {
  const { data: characters, isLoading } = useGetSavedCharactersQuery(id);

  // console.log(characters, "characters");

  return (
    // <div className="fixed top-0 left-0 w-full h-full mt-[80px] lg:mt-[0px] flex items-center justify-center bg-[#252525b0] z-[10]">
    //   <div className="bg-[#FAFAFA] w-full  lg:w-[466px] rounded-[8px] h-[100vh] lg:h-[361px] relative">
    //     <img
    //       src={crossIcon}
    //       alt=""
    //       className="w-8 h-8 cursor-pointer "
    //       onClick={() => setOpenCharacterChart(null)}
    //     />
    //     <div>
    //       <p className="text-center text-[#252525] text-[14px] font-[600] mt-[23px] mb-[8px] ">
    //         Characters and Roles
    //       </p>
    //       <div className="h-[1px] w-[90%] mx-auto bg-[#eaeaea] " />
    //     </div>
    //     <div className="lg:h-[293px] overflow-auto">
    //       {characters?.map((character, index) => (
    //         <p className="text-[12px] leading-[22.26px] mx-[40px] font-[400] text-[#252525]   h-[32px] pr-[10px] ">
    //           {character?.name} - {character?.role}
    //         </p>
    //       ))}
    //     </div>
    //   </div>
    // </div>
    <div className="fixed top-0 left-0 w-full h-full flex items-end sm:items-center justify-center bg-[#252525b0] bg-opacity-60 z-[1]">
      <div className="bg-[#fafafa]  rounded-[8px]  shadow-lg w-full h-[65vh] sm:h-auto sm:w-[400px] relative">
        <div className="mt-[15px] mx-[30px]">
          <div className="font-[500] ">
            <p className="text-center text-[#252525] text-[14px] font-[600] mt-[23px] mb-[8px] ">
              Characters and Roles
            </p>
            <div className="h-[1px] bg-[#eaeaea] w-full " />
          </div>
          <div className="absolute top-[-76px] sm:top-[-12px] right-[45%] ml-4 sm:ml-0 sm:right-[-15px]">
            <img
              src={crossIcon}
              alt=""
              className="  w-8 h-8 cursor-pointer "
              onClick={() => setOpenCharacterChart(null)}
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-center pb-6 font-bold">Loading...</p>
        ) : (
          <div className="h-[53vh] md:h-[300px] overflow-y-auto pb-6 gap-5 mx-[30px]">
            {characters?.map((character, index) => (
              <p className="text-[12px] leading-[22.26px]  font-[400] text-[#252525]   h-[32px] pr-[10px] ">
                {character?.name} - {character?.role}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCharacters;
