import { toast } from "react-toastify";
import { URL } from "../utils";

const hideUnhidePremiseCustom = async (
  id,
  refetch,
  user,
  option,
  selectedUserIds,
  setBtnDisable,
  setOpenHidePop,
  commentHide
) => {
  const flag = option.toString();

  const accessToken = localStorage.getItem("accessToken");
  let response;
  try {
    setBtnDisable(true);
    if (flag === "hide_from_all") {
      response = await fetch(
        `${URL}/ideamall/hide-premise/${id}?flag=${1}&comment=${commentHide}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setBtnDisable(false);
      setOpenHidePop(false);
      toast.success("Your premise is hidden from everyone!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 800,
      });
    } else if (option === "show_buddies") {
      response = await fetch(
        `${URL}/ideamall/hide-premise/${id}?flag=${0}&central_db_id=${user}&comment=${commentHide}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setBtnDisable(false);
      setOpenHidePop(false);
      if (commentHide === 0) {
        toast.success("Your buddies can see your premise & comments!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
      } else {
        toast.success("Your buddies can see only your premise!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
      }
    } else if (option === "visible_to") {
      response = await fetch(
        `${URL}/ideamall/hide-premise/${id}?flag=${2}&visible_to=${selectedUserIds}&comment=${commentHide}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setBtnDisable(false);
      setOpenHidePop(false);
      if (commentHide === 0) {
        toast.success("Selected buddies can see your premise & comments!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
      } else {
        toast.success("Selected buddies can see only your premise!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
      }
    } else if (option === "visible_all") {
      response = await fetch(
        `${URL}/ideamall/hide-premise/${id}?flag=${3}&comment=${commentHide}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setBtnDisable(false);
      setOpenHidePop(false);
      if (commentHide === 0) {
        toast.success("Everyone can see your premise & comments!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
      } else {
        toast.success("Only your premise is visible to everyone!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 800,
        });
      }
    }

    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    // const data = await response.json();

    // console.log(response);

    refetch();
  } catch (error) {
    // console.error("Error fetching data:", error);
    toast.error("Something went wrong! Please try again.");
  }
};

export { hideUnhidePremiseCustom };

