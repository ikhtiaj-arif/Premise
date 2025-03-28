import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useDeletePremiseMutation,
  useGetFilteredLangQuery,
} from "../../app/EndPoints/premisePoolApi";
import { useDeleteProjectMutation } from "../../app/EndPoints/ScriptPad/project";

const DeletePremise = ({
  setIsDelete,
  isDelete,
  refetch,
  hiddenCountRefetch,
  deleteId,
  projectName,
  popClose,
}) => {
  const [deleteProject, resDeleteProject] = useDeleteProjectMutation();
  const [deletePremise, resInfo] = useDeletePremiseMutation();
  const {
    data: lang,
    isLangLoading,
    refetch: langRefetch,
  } = useGetFilteredLangQuery();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePopupConfirm = async () => {

    setLoading(true);
    const data = {
      project: deleteId,
    };
    await deleteProject(data);
    const res = await deletePremise(isDelete);
    // console.log(res);
    if (res) {
      setLoading(false);
      setIsDelete(false);

      refetch();
      // hiddenCountRefetch()
      langRefetch();
      if (popClose) {
        popClose(false);
      }
      navigate("/");
      toast.success("Successfully deleted your Premise", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
      return;
    } else {
      setLoading(false);
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
      setIsDelete(false);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center bg-[#252525b0] justify-center z-[21]">
      <div className="modal_css fixed inset-0 flex items-center justify-center z-50">
        <div className="w-[90%] mx-auto max-w-[510px] bg-[#fafafa]  rounded-xl ">
          <div className="flex flex-col justify-between h-auto px-[18px]">
            <p className="text-[14px] lg:text-[24px] text-[#252525] text-center lg:leading-10 font-[500] mt-10">
              If you delete
              premise, related project <span className="font-bold">{projectName}</span> will also get deleted? 
            </p>
            <div className="h-[93px] pb-[14px] flex items-center gap-10 justify-center px-[40px]">
              <button
                onClick={() => setIsDelete(false)}
                className=" font-[500] border !border-[#33B0CA] text-[#33B0CA] h-[34px] w-[99px] text-[14px] rounded-[8px]   hover:text-white hover:bg-[#33B0CA] "
              >
                No
              </button>
              <button
                className={`${
                  loading ? "cursor-disabled-PremisePool " : "cursor-pointer"
                } bg-[#33B0CA]  font-[500] text-white h-[34px] w-[99px]   px-4 py-1  text-[14px]  rounded-[8px] `}
                onClick={handlePopupConfirm}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#252525b0]  z-[1]">
    //   <div className="bg-[#FAFAFA] p-6 rounded-[8px] shadow-lg ">
    //     <h2 className=" text-[16px] font-[500] ">Delete premise</h2>
    //     <p className="text-[14px] mb-4">
    //
    //     </p>
    //     <div className="flex justify-end ">
    //       <button
    //         className="px-4 py-1 mr-2 bg-[#67727E] text-[14px] text-white rounded-[8px] font-[500]"
    //         onClick={() => setIsDelete(false)}
    //       >
    //         CANCEL
    //       </button>
    //       <button
    //         className={`${loading ? "cursor-disabled-PremisePool ": "cursor-pointer"}  px-4 py-1 bg-[#ED6368] text-[14px] text-white rounded-[8px] font-[500]`}
    //         onClick={handlePopupConfirm}
    //       >
    //         {loading ? "DELETING..."  : "DELETE"}
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default DeletePremise;
