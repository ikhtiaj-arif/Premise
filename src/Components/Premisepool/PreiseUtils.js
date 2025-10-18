import { URL } from "../utils";
const hideUnhidePremise = async (
  id,
  setHideDisable,
  refetch,
  setOpenDotMenu
) => {
  setHideDisable(true);
  const accessToken = localStorage.getItem("accessToken");
  const flag = "visible_to";

  try {
    let response;
    if (flag === "hide_from_all") {
      response = await fetch(
        `${URL}/brainstorm/hide-premise/${id}?flag=${flag}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (flag === "show_buddies") {
      response = await fetch(
        `${URL}/brainstorm/hide-premise/${id}?flag=${flag}&central_db_id=3`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (flag === "visible_to") {
      response = await fetch(
        `${URL}/brainstorm/hide-premise/${id}?flag=${flag}&visible_to=[144,153]`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data) {
      setHideDisable(false);
      setOpenDotMenu(null);
    }
    // console.log(data);
    refetch();
  } catch (error) {
    // console.error("Error fetching data:", error);
    setHideDisable(false);
  }
};

export { hideUnhidePremise };

