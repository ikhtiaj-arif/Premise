import React, { useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    useEditPremiseMutation,
    useGetPremiseUserQuery,
    usePostPremiseMutation,
} from "../../app/EndPoints/premisePoolApi";
import { setUser } from "../../app/Slices/userSlice";

const PremisePreview = ({
  editedData,
  setAddPopup,
  id,
  editorContent,
  handleGoBack,
}) => {
  const [previewPremise, premiseInfo] = usePostPremiseMutation();
  const [previewEdit, editInfo] = useEditPremiseMutation();
  const { data: userQuery, isUserLoading } = useGetPremiseUserQuery();
  const user = useSelector((state) => state?.user?.id);
  const dispatch = useDispatch();

  const { bg_img, bg_color, imgUrl } = editedData;
  const editedText = ReactHtmlParser(editorContent);

  useEffect(() => {
    if (!user) {
      dispatch(setUser(userQuery));
    }
  }, [userQuery, dispatch, user]);


   const [wentWrongPop, setWentWrongPop] = useState(false);
  const submitPremise = async () => {
    const formData = new FormData();
    formData.append("text", editorContent);
    if (bg_img) {
      formData.append("bg_img", bg_img);
    } else {
      formData.append("bg_img", "");
    }
    formData.append("bg_color", bg_color);

    formData.append("created_by", user);

    const data = {
      id: id,
      body: formData,
    };

    const res = id ? await previewEdit(data) : await previewPremise(formData);
    if (res?.data?.id) {
      toast.success(`Successfully ${id ? "updated" : "added"} your Premise`, {
        position: toast.POSITION.TOP_CENTER,autoClose: 800,
      });
      setAddPopup(false);
      return;
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,autoClose: 800,
      });
    }
  };

  return (
    <div className=" m-10 rounded">
      <div className="bg-[#FFE2E5] py-4"></div>
      <div
        className={`p-2 h-[330px] w-[420px] `}
        style={{
          background: `${imgUrl ? `url(${imgUrl})` : bg_color}`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex h-full justify-center items-center overflow-hidden break-words">
          <>{editedText}</>
        </div>
      </div>
      <div className="bg-[#FFE2E5] flex gap-5 justify-center py-1 text-center">
        <button
          onClick={submitPremise}
          className={`text-white  rounded-[2px] px-4 btn-sm cursor-pointer bg-green-600`}
        >
          Confirm
        </button>
        <button
          onClick={handleGoBack}
          className="bg-[#33B0CA] btn-sm text-white px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PremisePreview;
