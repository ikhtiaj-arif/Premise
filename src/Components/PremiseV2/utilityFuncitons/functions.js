
export const handlePremiseOpenNewTab = (id) => {
    // let host = window.location.origin + `/#/new-tab/${id}`;
    // window.open(host, "_blank");

    // console.log(id);
    // // const url = `${baseURL}/new-tab/${id}`; // Use `id` if provided; fallback to current page URL
    const url = `${window.location.origin}/ideamall/#/new-tab/${id}`; // Use `id` if provided; fallback to current page URL

    // // Open the URL in a new tab
    window.open(url, "_blank");
  };