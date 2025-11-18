import crossIcon from "../../../img/Icons/crossIcon.png";

const BeatProjectPop = ({ popClose }) => {
  const projects = [
    { name: "Avatar" },
    { name: "Mission Impossible" },
    { name: "Dark Knight" },
    { name: "Dark Knight Rises" },
    { name: "The 7 Miles" },
    { name: "Se7en" },
    { name: "Silence Of The Lambs" },
  ];
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center bg-[#252525b0] justify-center z-[21] ">
      <div className=" h-[520px]  w-[380px] md:mx-auto  ">
        <div className="w-full h-[500px] max-h-[539px] bg-[#fafafa] rounded-[8px] relative">
          {/* close popup */}
          <div className="text-right flex justify-end h-0 ">
            <img
              src={crossIcon}
              alt=""
              className="text-red-500 w-8 h-8 top-[-15px] right-[-15px] absolute z-[1] m-1 cursor-pointer"
              onClick={() => popClose()}
            />
          </div>
          {/* container for projects */}
          {/* container for projects */}
          <div className="overflow-y-auto premiseScroll h-[500px]">
            <div className="mt-[16px]">
              <p className="text-[16px] font-[500] text-[#252525] ml-[30px]">
                Select Project
              </p>
              <div className="h-[1px] w-[332px] bg-[#616161] mx-auto" />
            </div>
            {projects.map((project, index) => (
              <div>
                <p className="text-[14px] font-[500] ml-[30px] py-[5px]">
                  <button>{project.name}</button>
                </p>
                <div className="h-[1px] w-[332px] bg-[#EAEAEA] mx-auto" />
              </div>
            ))}
            <div className="flex gap-[26px] absolute bottom-[30px] right-[30px]">
              <button className="bg-[#00c3ff] flex items-center justify-center text-[#FAFAFA] text-[14px] font-[600]  rounded-[8px] w-[170px] h-[32px] hover:shadow-md shadow-[#252525]">
                <span className="mr-[8px] text-2xl mt-[-5px]">+</span> Add New
                Project
              </button>
              <button className="text-[#00c3ff] bg-[#FAFAFA] border border-[#00c3ff] text-[14px] font-[600]  rounded-[8px] w-[74px] h-[32px] hover:shadow-md shadow-[#252525] hover:bg-[#00c3ff] hover:text-[#FAFAFA]">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatProjectPop;
