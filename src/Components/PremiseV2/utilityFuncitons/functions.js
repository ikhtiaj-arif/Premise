import { Languages } from "../../Premisepool/Languages";

export const handlePremiseOpenNewTab = (id) => {
    // let host = window.location.origin + `/#/new-tab/${id}`;
    // window.open(host, "_blank");

    // console.log(id);
    // // const url = `${baseURL}/new-tab/${id}`; // Use `id` if provided; fallback to current page URL
    const url = `${window.location.origin}/brainstorm/#/new-tab/${id}`; // Use `id` if provided; fallback to current page URL

    // // Open the URL in a new tab
    window.open(url, "_blank");
  };


  export const getLanguageName = (code) => {
    return Languages[code] || "Unknown Language";
  };

  const options = {
    "Short film": [
    { text: "2 Minutes", value: "Upto 2 Minutes" },
      { text: "5 Minutes", value: "2 to 4 Minutes" },
      { text: "15 Minutes", value: "5 to 14 Minutes" },
      { text: "25 Minutes", value: "15 to 29 Minutes" },
      { text: "30 Minutes", value: "30 Minutes" },
    ],
    "Feature film": [
      { text: "1 Hour", value: "1 Hour" },
      { text: "2 Hours", value: "2 Hours" },
      { text: "3 Hours", value: "3 Hours" },
    ],
  };
  
  export const getTextFromValue = (value) => {
    for (const category in options) {
      const foundOption = options[category].find(
        (option) => option.value === value
      );
      if (foundOption) {
        return foundOption.text;
      }
    }
    return value;
  };
