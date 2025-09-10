import Select from "react-select/base";
import { genera, Natureoptions, NProjectOpt } from "../../utils";
import { toast } from "react-toastify";

const CreateProjectDiv = ({finalEdit,}) =>{
    const token = localStorage.getItem("accessToken");
    const header = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
    };
    const handleNatureOfProjectChange = (e) => {
        const selectedProject = e.target.value;
        setNatureOfProject(selectedProject);
        setDurationOptions(Natureoptions[selectedProject] || []);
        setDuration("");
    };
    const submitPremise = async (e) => {
        e.preventDefault();
    
        const languageKey =
          languageOptions.find((option) => option.label === premiseLanguage) ||
          null;
    
        //demo popup
        const newProjectNextDemoPop = localStorage.getItem("newProjectNextDemoPop");
        if (
          (!newProjectNextDemoPop || newProjectNextDemoPop === "false") &&
          !openPreviewNextDemoPop
        ) {
          setOpenPreviewNextDemoPop(true);
        }
        // Disable submit button to prevent multiple clicks
        setIsLoading(true);
        setKeyboardVisible(false);
    
        try {
          const formData = new FormData();
          const text = newText;
          const styling = {
            boldStyle: bold ? "font-bold" : "font-normal",
            italicStyle: italic ? "italic" : "not-italic",
            underlineStyle: underline ? "underline" : "no-underline",
            hexColor,
          };
          const subText = `${JSON.stringify(styling)} + ${text}`;
          formData.append("created_from", "premisePool");
          formData.append("source_language", languageKey.value);
          formData.append("text", subText);
    
          if (file) {
            formData.append("bg_img", file);
          } else if (imgUrl === null) {
            formData.append("bg_img", ""); // Ensure bg_img is set to empty string if no file or imgUrl
          }
    
          if (randomColor) {
            formData.append("bg_color", randomColor);
          }
    
          formData.append("created_by", user);
    
          // Add project-specific data
          formData.append("nature_of_project", natureOfProject);
          if (["TV series", "Web series"].includes(natureOfProject)) {
            formData.append("episodes", noOfEpi);
          } else {
            formData.append("minutes", duration);
          }
          if (createNewProject) {
            formData.append("project_name", spProjectName);
          }
          if (generaItem === "Other") {
            formData.append("genre", "Drama");
            formData.append("sub_genre", subGeneraItemTxt);
          } else if (
            generaItem === "Superhero" ||
            generaItem === "Adventure" ||
            generaItem === "Mystery" ||
            generaItem === "Documentary"
          ) {
            formData.append("genre", "Drama");
            formData.append("sub_genre", subGeneraItem);
          } else {
            formData.append("sub_genre", subGeneraItem);
            formData.append("genre", generaItem);
          }
          formData.append("period", periodSetIn);
          formData.append("geography", geographyItem);
          formData.append("protagonist_type", protagonist);
          formData.append("protagonist_name", protagonistName);
    
          if (protagonist === "Inanimate Object") {
            setProtaAge(0);
          }
          formData.append("protagonist_age", protaAge);
    
          const previewData = {
            // id: data?.id,
            body: formData,
          };
          // Determine whether to call edit or add API based on data.id existence
          // const res = data?.id
          //   ? await previewEdit(previewData)
          //   : await previewPremise(formData);
          let generaValue;
          let subGeneraValue;
          if (generaItem === "Other") {
            generaValue = "Drama";
            subGeneraValue = subGeneraItemTxt;
          } else if (
            generaItem === "Superhero" ||
            generaItem === "Adventure" ||
            generaItem === "Mystery" ||
            generaItem === "Documentary"
          ) {
            generaValue = "Drama";
            subGeneraValue = subGeneraItem;
          } else {
            generaValue = generaItem;
            subGeneraValue = subGeneraItem;
          }
    
          const data = {
            name: spProjectName,
            language: languageKey.value,
            ownername: authorName,
            nature_project: natureOfProject,
            duration: duration,
            genre: generaValue,
            sub_genre: subGeneraValue,
            geography: geographyItem,
            period: periodSetIn,
            protagonist_type: protagonist,
            protagonist_name: protagonistName,
            protagonist_age: protaAge,
            service_name: "premisePool",
            // current_status: "is_draft"
          };
    
          if (createNewProject) {
            // const trimmedName = spProjectName.trim();
            // const nameExists = allspProjectJSON?.projects?.some(
            //   (item) => item.name === trimmedName
            // );
    
            const trimmedName = spProjectName.trim().toLowerCase();
            const nameExists = allspProjectJSON?.projects?.some(
              (item) => item.name.toLowerCase() === trimmedName
            );
    
            const nameSTExists = storyToScriptData?.some(
              (item) => item?.project_name?.toLowerCase() === trimmedName
            );
    
            if (nameExists || nameSTExists) {
              setIsLoading(false);
              setSameNamePop(true);
              return;
              // return alert(
              //   "A project with the same name already exists. Please choose a different name."
              // );
            }
    
            const response = await createProject(data);
            // const response = await console.log(data);
    
            if (response) {
              // refetch();
              setCurrentProjectData(response?.data?.projects);
              setCreatedSpProjectID(response?.data?.projects?.pro_uuid);
              setspID(response?.data?.projects?.pro_uuid);
              formData.append("project_id", response?.data?.projects?.pro_uuid);
              formData.append("PremiseLimitCheck", "NO");
              projectRefetch();
    
              const deleteId = response?.data?.projects?.pro_uuid;
              // post premise
              const res = await previewPremise(formData);
    
              if (res?.data?.id) {
                const {
                  text,
                  bg_color,
                  bg_img,
                  comments,
                  created_at,
                  likes,
                  id,
                  source_language,
                  updated_at,
                  // project_id
                } = res?.data;
                setSelectedPremiseSpProjectId(response?.data?.projects?.pro_uuid);
                setPremiseId(res?.data?.id);
                setPostedPremiseData(res?.data);
                // setMValue(res?.data?.m_value)
    
                const deletePreID = res?.data?.id;
    
                const created_by = userQuery;
                // {
                // id: user,
                // first_name: userFirstName,
                // last_name: userLastName,
                // username: user,
                // };
    
                const formattedDate = new Date(created_at).toLocaleDateString(
                  "en-US",
                  {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    day: "numeric",
                    month: "short",
                  }
                );
                const formattedTime = new Date(created_at).toLocaleTimeString(
                  "en-US",
                  {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    hour: "numeric",
                    minute: "numeric",
                  }
                );
    
                const data = {
                  stylings: JSON.parse(text?.split("+")[0]),
                  bg_color,
                  bg_img,
                  comments,
                  created_at,
                  created_by,
                  likes,
                  id,
                  source_language,
                  updated_at,
                  dText: text?.split("+")[1],
                  formattedDate,
                  formattedTime,
                  user,
                  handleHideUnhidePremise,
                  setHideDisable,
                  hideDisable,
                  openDotMenu,
                  project_id: response?.data?.projects?.pro_uuid,
                  m_value: res?.data?.m_value,
                  hidden: res?.data?.hidden,
                  index: 0,
                  premiseOwner: userQuery,
                  handleUserMail,
                  setOwnerMail,
                };
    
                // Update state with new premise data
                setPremiseData(data);
                userRefetch();
                setIsAddNew(true);
    
                axios
                  .get(`${baseURL}/ideamall/get_characters/${data?.id}`, {
                    headers: header,
                  })
                  .then((response) => {
                    if (response) {
                      const charData = response?.data?.data;
    
                      const updateData = {
                        id: deleteId,
                        name: spProjectName,
                        premise_id: res?.data?.id,
                      };
    
                      updateProject(updateData);
                      setFinalEdit(true);
                      setCharacterArray(charData);
                      setIsLoading(false);
                      setIsOldProject(true);
                    }
                  })
                  .catch((error) => {
                    setIsLoading(false);
                    deleteProject({ project: deleteId });
                    deletePremiseWhenFailed(deletePreID);
                    toast.error("Failed to create Premise", {
                      position: toast.POSITION.TOP_CENTER,
                      autoClose: 1600,
                    });
                    setAddPopup(null);
                  });
              } else {
                // Handle API errors
                setIsLoading(false);
                deleteProject({ project: deleteId });
                toast.error(
                  res?.error?.data?.message || "Failed to create Premise!",
                  {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1600,
                  }
                );
                setAddPopup(null);
              }
            }
          } else {
            data.id = selectedSpProjectID;
            data.name = selectedSpProject;
          
            if(matchingProject?.current_status === "without_premise"){
              data.current_status = null
            }
            // return
            const response = await updateProject(data);
            setCurrentProjectData(data);
            if (response) {
              formData.append("project_id", selectedSpProjectID);
              formData.append("PremiseLimitCheck", "NO");
              setspID(selectedSpProjectID);
              projectRefetch();
    
              // post premise
              const res = await previewPremise(formData);
    
              if (res?.data?.id) {
                const {
                  text,
                  bg_color,
                  bg_img,
                  comments,
                  created_at,
                  likes,
                  id,
                  source_language,
                  updated_at,
                  // project_id,
                } = res?.data;
    
              
                setSelectedPremiseSpProjectId(response?.data?.projects?.pro_uuid);
                setPremiseId(res?.data?.id);
                setPostedPremiseData(res?.data);
                const deletePreID = res?.data?.id;
                // setMValue(res?.data?.m_value)
    
                const created_by = userQuery;
                //  {
                //   id: user,
                //   first_name: userFirstName,
                //   last_name: userLastName,
                //   username: user,
                // };
    
                const formattedDate = new Date(created_at)?.toLocaleDateString(
                  "en-US",
                  {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    day: "numeric",
                    month: "short",
                  }
                );
                const formattedTime = new Date(created_at).toLocaleTimeString(
                  "en-US",
                  {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    hour: "numeric",
                    minute: "numeric",
                  }
                );
    
                const data = {
                  stylings: JSON.parse(text?.split("+")[0]),
                  bg_color,
                  bg_img,
                  comments,
                  created_at,
                  created_by,
                  likes,
                  id,
                  source_language,
                  updated_at,
                  dText: text?.split("+")[1],
                  formattedDate,
                  formattedTime,
                  user,
                  handleHideUnhidePremise,
                  setHideDisable,
                  hideDisable,
                  openDotMenu,
                  project_id: selectedSpProjectID,
                  m_value: res?.data?.m_value,
                  hidden: res?.data?.hidden,
                  index: 0,
                  premiseOwner: userQuery,
                  handleUserMail,
                  setOwnerMail,
                };
    
                // Update state with new premise data
                setPremiseData(data);
                // userRefetch();
                setIsAddNew(true);
                // langRefetch();
    
                axios
                  .get(`${baseURL}/ideamall/get_characters/${data?.id}`, {
                    headers: header,
                  })
                  .then((response) => {
                    if (response) {
                      const charData = response?.data?.data;
    
                      const updateData = {
                        id: selectedSpProjectID,
                        name: selectedSpProject,
                        premise_id: res?.data?.id,
                      };
                      updateProject(updateData);
                      setFinalEdit(true);
                      setCharacterArray(charData);
                      setIsLoading(false);
                      setIsOldProject(true);
                    }
    
                    // Optionally set openPop here if needed
                    // setOpenPop(true);
                  })
                  .catch((error) => {
                    setIsLoading(false);
                    deletePremiseWhenFailed(deletePreID);
                    toast.error("Failed to create Premise", {
                      position: toast.POSITION.TOP_CENTER,
                      autoClose: 1600,
                    });
                  });
              } else {
                // Handle API errors
                setIsLoading(false);
                toast.error(
                  res?.error?.data?.message || "Failed to create Premise!",
                  {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 800,
                  }
                );
              }
            }
          }
        } catch (error) {
          setIsLoading(false);
    
          // console.error("Error submitting premise:", error);
          toast.error("Failed to create Premise!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 800,
          });
        }
    };
    return (
    <form onSubmit={submitPremise}>
            {/* select section */}
            <div
              className={`${
                finalEdit
                  ? "hidden"
                  : " flex flex-col md:w-[600px]  mx-auto sm:gap-[12px] mt-[8px]"
              } `}
            >
              {!createNewProject && !selectedSpProjectID ? (
                <div className="col-span-12"></div>
              ) : (
                <div className="text-[12px] grid grid-cols-12 gap-x-[6px] md:gap-x-[12px] gap-y-[4px]  px-[16px] md:px-0 lg:px-0 mt-[8px] md:mt-[-5px]">
                  {createNewProject && (
                    <div className="flex h-[31px] col-span-5 md:col-span-4">
                      <input
                        type="text"
                        ref={projectNameRef}
                        onFocus={() => setFocusedFieldName("projectName")}
                        // id="spProjectName"
                        className={`h-[30px] relative  text-[12px] md:!text-[14px] leading-tight px-[8px] w-full md:w-[181px] bg-[#fafafa] rounded-[4px] border-[2px] ${
                          spProjectName
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        } focus:outline-none`}
                        placeholder="Project Name"
                        required
                        value={spProjectName}
                        onChange={(e) => {
                          const value = e.target.value
                            .trimStart()
                            .replace(/\s{2,}/g, " ");
                          setSpProjectName(value);
                        }}
                      />
                    </div>
                  )}
                  <div
                    className={`col-span-7 md:col-span-4 md:w-[191px] ${
                      createNewProject && "md:ml-[-5px]"
                    }`}
                  >
                    <div
                      ref={languageRef}
                      className={`h-[31px] relative bg-[#fafafa] rounded-[4px] border-[2px] border-[#33B0CA] 
                      
                      `}
                    >
                      <Select
                        isDisabled={premiseLanguage}
                        // options={languageOptions}
                        // value={
                        //   languageOptions.find(
                        //     (option) => option.value === language
                        //   ) || null
                        // }
                        placeholder={premiseLanguage}
                        // onChange={(selectedOption) => {
                        //   if (selectedOption) {
                        //     setLanguage(selectedOption.value);
                        //     setSelectedSpProjectLanguage(selectedOption.value);
                        //   }
                        //   setIsLanguageOpen(false);
                        // }}
                        // onMenuOpen={() => setIsLanguageOpen(true)}
                        // onMenuClose={() => setIsLanguageOpen(false)}
                        // placeholder="Language"
                        theme={customTheme}
                        menuPortalTarget={document.body} // Render menu to document.body
                        menuPosition="fixed" // Use fixed positioning
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9, // Very high z-index to ensure it's on top
                          }),
                          control: (base) => ({
                            ...base,
                            height: "27px",
                            minHeight: "27px",
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            border: "none",
                            backgroundColor: "#fafafa",
                            boxShadow: "none",
                            padding: "0",
                            margin: "0",
                            width: "100%",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: "0 8px",
                            height: "27px",
                            display: "flex",
                            alignItems: "center",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0",
                            padding: "0",
                          }),
                          indicatorsContainer: () => ({
                            display: "none", // hide default dropdown arrow
                          }),
                          menu: (base) => ({
                            ...base,
                            fontSize: "14px",
                            marginTop: "2px",
                            zIndex: 9, // Very high z-index
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          }),
                          option: (base, state) => ({
                            ...base,
                            fontSize: "14px",
                            padding: "0px 8px",
                            backgroundColor: state.isFocused
                              ? "#33b0ca"
                              : "#fafafa",
                            color: state.isFocused ? "#ffffff" : "#000000",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            height: "32px",
                            lineHeight: "20px",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            margin: "0",
                            padding: "0",
                            lineHeight: "27px",
                          }),
                        }}
                        classNamePrefix="custom-select"
                      />
                    </div>
                    {/* <div
                      ref={languageRef}
                      className={`h-[31px] relative  bg-[#fafafa] rounded-[4px] border-[2px] ${
                        language ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } `}
                    >
                      <select
                        className={`block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]   w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                        value={language}
                        onChange={(e) => {
                          setLanguage(e.target.value);
                          setSelectedSpProjectLanguage(e.target.value);
                        }}
                        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                        required
                      >
                        <option value="" disabled>
                          Language
                        </option>
                        {Object.entries(sortedLanguages)?.map(([key, name]) => (
                          <option key={key} value={key}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center   pointer-events-none">
                        {isLanguageOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                        )}
                      </div>
                    </div> */}
                  </div>
                  <div className="flex h-[31px] col-span-5 md:col-span-4">
                    <input
                      type="text"
                      // id="authorName"
                      ref={authorNameRef}
                      className={`h-[30px] relative text-[12px] md:!text-[14px] leading-tight px-[8px] w-full md:w-[191px] bg-[#fafafa] rounded-[4px] border-[2px] ${
                        authorName ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } focus:outline-none`}
                      placeholder="Author Name"
                      onFocus={() => setFocusedFieldName("authorName")}
                      value={authorName}
                      // onFocus={() => setActiveInput("authorName")}

                      onChange={(e) => {
                        const value = e.target.value
                          .trimStart()
                          .replace(/\s{2,}/g, " ");
                        setAuthorName(value);
                      }}
                      // required
                    />
                  </div>
                  <div
                    className={` col-span-7 ${
                      createNewProject
                        ? "md:col-span-3  md:w-[163px] "
                        : "md:col-span-4"
                    } `}
                  >
                    <div
                      ref={natureProjectRef}
                      className={`h-[31px] relative bg-[#fafafa] rounded-[4px] border-[2px] ${
                        natureOfProject
                          ? "border-[#33B0CA]"
                          : "border-[#EAEAEA]"
                      } `}
                    >
                      <Select
                        options={NProjectOpt?.map((option) => ({
                          value: option?.value,
                          label:
                            baseLanguage === "hi" ? option?.hi : option?.value,
                        }))}
                        value={
                          NProjectOpt?.map((option) => ({
                            value: option?.value,
                            label:
                              baseLanguage === "hi"
                                ? option?.hi
                                : option?.value,
                          })).find(
                            (option) => option.value === natureOfProject
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          handleNatureOfProjectChange({
                            target: { value: selectedOption?.value || "" },
                          });
                        }}
                        onMenuOpen={() => setIsNatureProjectOpen(true)}
                        onMenuClose={() => setIsNatureProjectOpen(false)}
                        placeholder="Nature of project"
                        menuPortalTarget={document.body} // Render menu to document.body
                        menuPosition="fixed" // Use fixed positioning
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9, // Very high z-index to ensure it's on top
                          }),
                          control: (base) => ({
                            ...base,
                            height: "27px",
                            minHeight: "27px",
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            border: "none",
                            backgroundColor: "#fafafa",
                            boxShadow: "none",
                            padding: "0",
                            margin: "0",
                            width: "100%",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: "0 8px",
                            height: "27px",
                            display: "flex",
                            alignItems: "center",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0",
                            padding: "0",
                          }),
                          indicatorsContainer: () => ({
                            display: "none", // hide default dropdown arrow
                          }),
                          menu: (base) => ({
                            ...base,
                            fontSize: "14px",
                            marginTop: "2px",
                            zIndex: 9, // Very high z-index
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          }),
                          option: (base, state) => ({
                            ...base,
                            fontSize: "14px",
                            padding: "0px 8px",
                            backgroundColor: state.isFocused
                              ? "#33b0ca"
                              : "#fafafa",
                            color: state.isFocused ? "#ffffff" : "#000000",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            height: "32px",
                            lineHeight: "20px",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            fontSize: "12px",
                            "@media (min-width: 768px)": {
                              fontSize: "14px",
                            },
                            margin: "0",
                            padding: "0",
                            lineHeight: "27px",
                          }),
                        }}
                        classNamePrefix="custom-select"
                      />

                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                        {isNatureProjectOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px] " />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px] " />
                        )}
                      </div>
                    </div>
                    {/* <div
                      ref={natureProjectRef}
                      className={`h-[31px] relative  bg-[#fafafa] rounded-[4px] border-[2px] ${
                        natureOfProject
                          ? "border-[#33B0CA]"
                          : "border-[#EAEAEA]"
                      } `}
                    >
                      <select
                        className={`block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]   w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                        value={natureOfProject}
                        onChange={handleNatureOfProjectChange}
                        onClick={handleSelectClick}
                        required
                      >
                        <option value="" disabled>
                          Nature of project
                        </option>
                        {/* {Object.keys(options)?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))} 

                        {NProjectOpt?.map((option) => (
                          <>
                            {baseLanguage === "hi" ? (
                              <option key={option?.value} value={option?.value}>
                                {option?.hi}
                              </option>
                            ) : (
                              <option key={option?.value} value={option?.value}>
                                {option?.value}
                              </option>
                            )}
                          </>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center pointer-events-none">
                        {isNatureProjectOpen ? (
                          <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px] " />
                        ) : (
                          <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px] " />
                        )}
                      </div>
                    </div> */}
                  </div>
                  <div
                    className={`h-[31px] relative bg-[#fafafa] rounded-[4px] border-[2px] col-span-4 ${
                      createNewProject
                        ? "md:col-span-3 w-[108px] xxs:w-[120px] md:w-[136px] md:ml-[16px]"
                        : "md:col-span-4"
                    } ${duration ? "border-[#33B0CA]" : "border-[#EAEAEA]"}`}
                    ref={durationRef}
                  >
                    <Select
                      options={durationOptions?.map((option) => ({
                        value: option?.value,
                        label:
                          baseLanguage === "hi" ? option?.hi : option?.text,
                      }))}
                      value={
                        durationOptions
                          ?.map((option) => ({
                            value: option?.value,
                            label:
                              baseLanguage === "hi" ? option?.hi : option?.text,
                          }))
                          .find((option) => option.value === duration) || null
                      }
                      onChange={(selectedOption) => {
                        setDuration(selectedOption?.value || "");
                      }}
                      onMenuOpen={() => setIsdurationOpen(true)}
                      onMenuClose={() => setIsdurationOpen(false)}
                      placeholder="Duration"
                      menuPortalTarget={document.body} // Render menu to document.body
                      menuPosition="fixed" // Use fixed positioning
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9, // Very high z-index to ensure it's on top
                        }),
                        control: (base) => ({
                          ...base,
                          height: "27px",
                          minHeight: "27px",
                          fontSize: "12px",
                          "@media (min-width: 768px)": {
                            fontSize: "14px",
                          },
                          border: "none",
                          backgroundColor: "#fafafa",
                          boxShadow: "none",
                          padding: "0",
                          margin: "0",
                          width: "100%",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "0 8px",
                          height: "27px",
                          display: "flex",
                          alignItems: "center",
                        }),
                        input: (base) => ({
                          ...base,
                          margin: "0",
                          padding: "0",
                        }),
                        indicatorsContainer: () => ({
                          display: "none", // hide default dropdown arrow
                        }),
                        menu: (base) => ({
                          ...base,
                          fontSize: "14px",
                          marginTop: "2px",
                          zIndex: 9, // Very high z-index
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        }),
                        option: (base, state) => ({
                          ...base,
                          fontSize: "14px",
                          padding: "0px 2px",
                          backgroundColor: state.isFocused
                            ? "#33b0ca"
                            : "#fafafa",
                          color: state.isFocused ? "#ffffff" : "#000000",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          height: "32px",
                          lineHeight: "18px",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          fontSize: "12px",
                          "@media (min-width: 768px)": {
                            fontSize: "14px",
                          },
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          fontSize: "12px",
                          "@media (min-width: 768px)": {
                            fontSize: "14px",
                          },
                          margin: "0",
                          padding: "0",
                          lineHeight: "27px",
                        }),
                      }}
                      classNamePrefix="custom-select"
                    />

                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                      {isdurationOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                      )}
                    </div>
                  </div>
                  {/* <div
                    className={`h-[31px] relative  bg-[#fafafa] rounded-[4px] border-[2px] col-span-4 ${
                      createNewProject
                        ? "  md:col-span-3 w-[104px] xxs:w-[120px] md:w-[130px] md:ml-[8px] "
                        : " md:col-span-4"
                    }  ${duration ? "border-[#33B0CA]" : "border-[#EAEAEA]"} `}
                  >
                    <select
                      ref={durationRef}
                      className="block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                      onClick={() => setIsdurationOpen(!isdurationOpen)}
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                    >
                      <option className="" value="" selected disabled>
                        Duration
                      </option>

                      {durationOptions?.map((option, index) => (
                        <>
                          {baseLanguage === "hi" ? (
                            <option key={option?.value} value={option?.value}>
                              {option?.hi}
                            </option>
                          ) : (
                            <option key={option?.value} value={option?.value}>
                              {option?.text}
                            </option>
                          )}
                        </>

                        // <option key={option.value} value={option.value}>
                        //   {option.text}
                        // </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center  pointer-events-none">
                      {isdurationOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      )}
                    </div>
                  </div> */}
                  {generaItem === "Other" ? (
                    <>
                      <div
                        className={`h-[31px] relative col-span-4 ${
                          createNewProject
                            ? " md:col-span-3  w-[130px] ml-[-10px] md:ml-[4px]"
                            : " md:col-span-4 "
                        } bg-[#fafafa] rounded-[4px] border-[2px] ${
                          generaItemTxt
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        } `}
                      >
                        <input
                          type="text"
                          value={generaItemTxt}
                          maxLength={"60"}
                          placeholder="Genre"
                          onChange={(e) => {
                            const updatedValue = e.target.value.replace(
                              /^\s+|\s+(?=\s)/g,
                              ""
                            );
                            setGeneraItemTxt(updatedValue);
                          }}
                          className="focus:outline-none h-[27px] rounded-[4px] w-full px-2 text-[12px] md:!text-[14px] leading-tight"
                        />
                      </div>

                      <div
                        className={`h-[31px]  col-span-4 ${
                          createNewProject
                            ? "md:col-span-3 xxs:w-[139px] md:w-[154px] ml-[0px] md:ml-[-13px] "
                            : " md:col-span-4"
                        }  bg-[#fafafa] rounded-[4px] border-[2px] ${
                          subGeneraItemTxt
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        }`}
                      >
                        <input
                          type="text"
                          value={subGeneraItemTxt}
                          maxLength={"60"}
                          placeholder="Sub-Genre"
                          onChange={(e) => {
                            const updatedValue = e.target.value.replace(
                              /^\s+|\s+(?=\s)/g,
                              ""
                            );
                            setSubGeneraItemTxt(updatedValue);
                          }}
                          className="focus:outline-none h-[27px] rounded-[4px] w-full px-2 text-[12px] md:!text-[14px] leading-tight"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* <div
                        className={`h-[31px] relative col-span-4 ${
                          createNewProject
                            ? " md:col-span-3 w-[104px] xxs:w-[119px] md:w-[126px] ml-[-6px] md:ml-[0px]"
                            : " md:col-span-4 "
                        } bg-[#fafafa] rounded-[4px] border-[2px] ${
                          generaItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                        } `}
                      >
                        <select
                          ref={genreRef}
                          className="block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                          onClick={() => setIsgenreOpen(!isgenreOpen)}
                          value={generaItem}
                          onChange={(e) => setGeneraItem(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Genre
                          </option>

                          {genera?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center  pointer-events-none">
                          {isgenreOpen ? (
                            <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                          ) : (
                            <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                          )}
                        </div>
                      </div> */}

                      <div
                        ref={genreRef}
                        className={`h-[31px] relative col-span-4 ${
                          createNewProject
                            ? "md:col-span-3 w-[106px] xxs:w-[122px] md:w-[130px] ml-[-7px] md:ml-[4px]"
                            : "md:col-span-4"
                        } bg-[#fafafa] rounded-[4px] border-[2px] ${
                          generaItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                        }`}
                      >
                        <Select
                          options={genera?.map((option) => ({
                            value: option,
                            label: option,
                          }))}
                          value={
                            genera
                              ?.map((option) => ({
                                value: option,
                                label: option,
                              }))
                              .find((option) => option.value === generaItem) ||
                            null
                          }
                          onChange={(selectedOption) => {
                            setGeneraItem(selectedOption?.value || "");
                          }}
                          onMenuOpen={() => setIsgenreOpen(true)}
                          onMenuClose={() => setIsgenreOpen(false)}
                          placeholder="Genre"
                          menuPortalTarget={document.body} // Render menu to document.body
                          menuPosition="fixed" // Use fixed positioning
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9, // Very high z-index to ensure it's on top
                            }),
                            control: (base) => ({
                              ...base,
                              height: "27px",
                              minHeight: "27px",
                              fontSize: "12px",
                              "@media (min-width: 768px)": {
                                fontSize: "14px",
                              },
                              border: "none",
                              backgroundColor: "#fafafa",
                              boxShadow: "none",
                              padding: "0",
                              margin: "0",
                              width: "100%",
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              padding: "0 8px",
                              height: "27px",
                              display: "flex",
                              alignItems: "center",
                            }),
                            input: (base) => ({
                              ...base,
                              margin: "0",
                              padding: "0",
                            }),
                            indicatorsContainer: () => ({
                              display: "none", // hide default dropdown arrow
                            }),
                            menu: (base) => ({
                              ...base,
                              fontSize: "14px",
                              marginTop: "2px",
                              zIndex: 9, // Very high z-index
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                            }),
                            option: (base, state) => ({
                              ...base,
                              fontSize: "14px",
                              padding: "0px 8px",
                              backgroundColor: state.isFocused
                                ? "#33b0ca"
                                : "#fafafa",
                              color: state.isFocused ? "#ffffff" : "#000000",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              height: "32px",
                              lineHeight: "20px",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              fontSize: "12px",
                              "@media (min-width: 768px)": {
                                fontSize: "14px",
                              },
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }),
                            singleValue: (base) => ({
                              ...base,
                              fontSize: "12px",
                              "@media (min-width: 768px)": {
                                fontSize: "14px",
                              },
                              margin: "0",
                              padding: "0",
                              lineHeight: "27px",
                            }),
                          }}
                          classNamePrefix="custom-select"
                        />

                        <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                          {isgenreOpen ? (
                            <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                          ) : (
                            <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                          )}
                        </div>
                      </div>

                      <div
                        className={`h-[31px] relative col-span-4 ${
                          createNewProject
                            ? "md:col-span-3 xxs:w-[139px] md:w-[154px] ml-[-14px] md:ml-[-13px]"
                            : "md:col-span-4"
                        } bg-[#fafafa] rounded-[4px] border-[2px] ${
                          subGeneraItem
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        }`}
                      >
                        <Select
                          options={subGeneraOptions?.map((subGenre) => ({
                            value: subGenre,
                            label: subGenre,
                          }))}
                          value={
                            subGeneraOptions
                              ?.map((subGenre) => ({
                                value: subGenre,
                                label: subGenre,
                              }))
                              .find(
                                (option) => option.value === subGeneraItem
                              ) || null
                          }
                          onChange={(selectedOption) => {
                            setSubGeneraItem(selectedOption?.value || "");
                          }}
                          onMenuOpen={() => setIsSubGenreOpen(true)}
                          onMenuClose={() => setIsSubGenreOpen(false)}
                          placeholder="Sub-Genre"
                          menuPortalTarget={document.body} // Render menu to document.body
                          menuPosition="fixed" // Use fixed positioning
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9, // Very high z-index to ensure it's on top
                            }),
                            control: (base) => ({
                              ...base,
                              height: "27px",
                              minHeight: "27px",
                              fontSize: "12px",
                              "@media (min-width: 768px)": {
                                fontSize: "14px",
                              },
                              border: "none",
                              backgroundColor: "#fafafa",
                              boxShadow: "none",
                              padding: "0",
                              margin: "0",
                              width: "100%",
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              padding: "0 8px",
                              height: "27px",
                              display: "flex",
                              alignItems: "center",
                            }),
                            input: (base) => ({
                              ...base,
                              margin: "0",
                              padding: "0",
                            }),
                            indicatorsContainer: () => ({
                              display: "none", // hide default dropdown arrow
                            }),
                            menu: (base) => ({
                              ...base,
                              fontSize: "14px",
                              marginTop: "2px",
                              zIndex: 9, // Very high z-index
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                            }),
                            option: (base, state) => ({
                              ...base,
                              fontSize: "14px",
                              padding: "0px 8px",
                              backgroundColor: state.isFocused
                                ? "#33b0ca"
                                : "#fafafa",
                              color: state.isFocused ? "#ffffff" : "#000000",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              height: "32px",
                              lineHeight: "16px",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              fontSize: "12px",
                              "@media (min-width: 768px)": {
                                fontSize: "14px",
                              },
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }),
                            singleValue: (base) => ({
                              ...base,
                              fontSize: "12px",
                              "@media (min-width: 768px)": {
                                fontSize: "14px",
                              },
                              margin: "0",
                              padding: "0",
                              lineHeight: "27px",
                            }),
                          }}
                          classNamePrefix="custom-select"
                        />

                        <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                          {isSubGenreOpen ? (
                            <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                          ) : (
                            <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                          )}
                        </div>
                      </div>
                      {/* <div
                        className={`h-[31px] relative col-span-4 ${
                          createNewProject
                            ? "md:col-span-3 xxs:w-[139px] md:w-[154px] ml-[-13px] md:ml-[-13px] "
                            : " md:col-span-4"
                        }  bg-[#fafafa] rounded-[4px] border-[2px] ${
                          subGeneraItem
                            ? "border-[#33B0CA]"
                            : "border-[#EAEAEA]"
                        }`}
                      >
                        <select
                          className="block appearance-none bg-[#fafafa] h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                          value={subGeneraItem}
                          onChange={(e) => setSubGeneraItem(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Sub-Genre
                          </option>

                          {subGeneraOptions?.map((subGenre) => (
                            <option
                              className="text-[12px] md:!text-[14px]"
                              key={subGenre}
                              value={subGenre}
                            >
                              {subGenre}
                            </option>
                          ))}
                        </select>

                        <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center pointer-events-none">
                          {isSubGenreOpen ? (
                            <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                          ) : (
                            <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                          )}
                        </div>
                      </div>{" "} */}
                    </>
                  )}
                  <div className="col-span-6 md:col-span-6 mt-[-6px]">
                    <label className="text-[12px] md:!text-[14px] font-[500]">
                      Location
                    </label>
                    {/* <input
                      className={`block bg-[#fafafa] h-[30px] rounded-[4px] border-[2px] ${
                        geographyItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                      placeholder="Country/Region/City"
                      type="text"
                      value={geographyItem}
                      onChange={handleGeographyChange}
                      required
                      maxLength={100}
                    /> */}
                    <input
                      type="text"
                      ref={locationNameRef}
                      className={`block bg-[#fafafa] h-[30px] rounded-[4px] border-[2px] ${
                        geographyItem ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                      } w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                      placeholder="Country/Region/City"
                      value={geographyItem}
                      onFocus={() => {
                        setActiveInput("geographyItem");
                        setFocusedFieldName("locationName");
                      }}
                      onChange={(e) => {
                        const value = e.target.value
                          .trimStart()
                          .replace(/\s{2,}/g, " ");
                        setGeographyItem(value);
                      }}
                      required
                      maxLength={100}
                    />
                  </div>
                  {/* <div
                    className={`h-[31px] mt-[21px] relative col-span-6 md:col-span-3 ${
                      periodSetIn ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                    } rounded-[4px] border-[2px]`}
                  >
                    <select
                      ref={setinPeriodRef}
                      className={`block appearance-none bg-[#fafafa] h-[27px] rounded-[4px] w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                      onClick={() => setSetinPeriodOpen(!isSetinPeriodOpen)}
                      onChange={(e) => setPeriodSetIn(e.target.value)}
                      value={periodSetIn}
                      required
                    >
                      <option className="" value="" selected disabled>
                        Period of time
                      </option>

                      <option className="text-[12px] md:!text-[14px]">
                        Ancient
                      </option>
                      <option className="text-[12px] md:!text-[14px]">
                        Modern
                      </option>
                      <option className="text-[12px] md:!text-[14px]">
                        Contemporary
                      </option>
                      <option className="text-[12px] md:!text-[14px]">
                        Last Century
                      </option>
                      <option className="text-[12px] md:!text-[14px]">
                        Medieval
                      </option>
                      <option className="text-[12px] md:!text-[14px]">
                        Prehistortic
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center  pointer-events-none">
                      {isSetinPeriodOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      )}
                    </div>
                  </div> */}
                  <div
                    ref={setinPeriodRef}
                    className={`h-[31px] mt-[21px] relative col-span-6 md:col-span-3 ${
                      periodSetIn ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                    } rounded-[4px] border-[2px]`}
                  >
                    <Select
                      options={[
                        { value: "Ancient", label: "Ancient" },
                        { value: "Modern", label: "Modern" },
                        { value: "Contemporary", label: "Contemporary" },
                        { value: "Last Century", label: "Last Century" },
                        { value: "Medieval", label: "Medieval" },
                        { value: "Prehistortic", label: "Prehistortic" },
                      ]}
                      value={
                        [
                          { value: "Ancient", label: "Ancient" },
                          { value: "Modern", label: "Modern" },
                          { value: "Contemporary", label: "Contemporary" },
                          { value: "Last Century", label: "Last Century" },
                          { value: "Medieval", label: "Medieval" },
                          { value: "Prehistortic", label: "Prehistortic" },
                        ].find((option) => option.value === periodSetIn) || null
                      }
                      onChange={(selectedOption) => {
                        setPeriodSetIn(selectedOption?.value || "");
                      }}
                      onMenuOpen={() => setSetinPeriodOpen(true)}
                      onMenuClose={() => setSetinPeriodOpen(false)}
                      placeholder="Period of time"
                      menuPortalTarget={document.body} // Render menu to document.body
                      menuPosition="fixed" // Use fixed positioning
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9, // Very high z-index to ensure it's on top
                        }),
                        control: (base) => ({
                          ...base,
                          height: "27px",
                          minHeight: "27px",
                          fontSize: "12px",
                          "@media (min-width: 768px)": {
                            fontSize: "14px",
                          },
                          border: "none",
                          backgroundColor: "#fafafa",
                          boxShadow: "none",
                          padding: "0",
                          margin: "0",
                          width: "100%",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "0 8px",
                          height: "27px",
                          display: "flex",
                          alignItems: "center",
                        }),
                        input: (base) => ({
                          ...base,
                          margin: "0",
                          padding: "0",
                        }),
                        indicatorsContainer: () => ({
                          display: "none", // hide default dropdown arrow
                        }),
                        menu: (base) => ({
                          ...base,
                          fontSize: "14px",
                          marginTop: "2px",
                          zIndex: 9, // Very high z-index
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        }),
                        option: (base, state) => ({
                          ...base,
                          fontSize: "14px",
                          padding: "0px 8px",
                          backgroundColor: state.isFocused
                            ? "#33b0ca"
                            : "#fafafa",
                          color: state.isFocused ? "#ffffff" : "#000000",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          height: "32px",
                          lineHeight: "20px",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          fontSize: "12px",
                          "@media (min-width: 768px)": {
                            fontSize: "14px",
                          },
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          fontSize: "12px",
                          "@media (min-width: 768px)": {
                            fontSize: "14px",
                          },
                          margin: "0",
                          padding: "0",
                          lineHeight: "27px",
                        }),
                      }}
                      classNamePrefix="custom-select"
                    />

                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                      {isSetinPeriodOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                      )}
                    </div>
                  </div>
                  <div
                    className={`col-span-6 md:col-span-5 gap-[12px] mt-[-6px]`}
                  >
                    <p className="text-[12px] md:!text-[14px] font-[500]">
                      Who Is Your Protagonist
                    </p>
                    <input
                      ref={protagonistNameRef}
                      className={`block bg-[#fafafa] w-full h-[30px] rounded-[4px] border-[2px] ${
                        protagonistName
                          ? "border-[#33B0CA]"
                          : "border-[#EAEAEA]"
                      }  px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none`}
                      placeholder="Name"
                      type="text"
                      onFocus={() => setFocusedFieldName("protagonistName")}
                      onChange={(e) => {
                        const value = e.target.value
                          .trimStart()
                          .replace(/\s{2,}/g, " ");
                        setProtagonistName(value);
                      }}
                      value={protagonistName}
                      required
                      maxLength={100}
                    />
                  </div>{" "}
                  {/* <div
                    className={`h-[31px] mt-[21px] relative col-span-6 md:col-span-4  bg-[#fafafa] ${
                      protagonist ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                    } rounded-[4px] border-[2px]`}
                  >
                    <select
                      ref={protagonistRef}
                      className="block appearance-none bg-[#fafafa]  h-[27px] rounded-[4px]  w-full px-[8px] text-[12px] md:!text-[14px] leading-tight focus:outline-none"
                      onClick={() => setIsProtagonistOpen(!isProtagonistOpen)}
                      value={protagonist}
                      onChange={(e) => setProtagonist(e.target.value)}
                      required
                    >
                      <option className="" value="" selected disabled>
                        Gender
                      </option>
                      <option className="text-[12px] md:!text-[14px]">
                        Male
                      </option>
                      <option className="text-[12px] md:!text-[14px]">
                        Female
                      </option>
                      <option className="text-[12px] md:!text-[14px]">
                        Animal
                      </option>
                      <option className="text-[12px] md:!text-[14px]">
                        Inanimate Object
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center pointer-events-none">
                      {isProtagonistOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px]  md:w-[16px] " />
                      )}
                    </div>
                  </div> */}
                  <div
                    ref={protagonistRef}
                    className={`h-[31px] mt-[21px] relative col-span-6 md:col-span-4 bg-[#fafafa] ${
                      protagonist ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                    } rounded-[4px] border-[2px]`}
                  >
                    <Select
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Animal", label: "Animal" },
                        {
                          value: "Inanimate Object",
                          label: "Inanimate Object",
                        },
                      ]}
                      value={
                        [
                          { value: "Male", label: "Male" },
                          { value: "Female", label: "Female" },
                          { value: "Animal", label: "Animal" },
                          {
                            value: "Inanimate Object",
                            label: "Inanimate Object",
                          },
                        ].find((option) => option.value === protagonist) || null
                      }
                      onChange={(selectedOption) => {
                        setProtagonist(selectedOption?.value || "");
                      }}
                      onMenuOpen={() => setIsProtagonistOpen(true)}
                      onMenuClose={() => setIsProtagonistOpen(false)}
                      placeholder="Gender"
                      menuPortalTarget={document.body} // Render menu to document.body
                      menuPosition="fixed" // Use fixed positioning
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9, // Very high z-index to ensure it's on top
                        }),
                        control: (base) => ({
                          ...base,
                          height: "27px",
                          minHeight: "27px",
                          fontSize: "12px",
                          "@media (min-width: 768px)": {
                            fontSize: "14px",
                          },
                          border: "none",
                          backgroundColor: "#fafafa",
                          boxShadow: "none",
                          padding: "0",
                          margin: "0",
                          width: "100%",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "0 8px",
                          height: "27px",
                          display: "flex",
                          alignItems: "center",
                        }),
                        input: (base) => ({
                          ...base,
                          margin: "0",
                          padding: "0",
                        }),
                        indicatorsContainer: () => ({
                          display: "none", // hide default dropdown arrow
                        }),
                        menu: (base) => ({
                          ...base,
                          fontSize: "14px",
                          marginTop: "2px",
                          zIndex: 9, // Very high z-index
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        }),
                        option: (base, state) => ({
                          ...base,
                          fontSize: "14px",
                          padding: "0px 8px",
                          backgroundColor: state.isFocused
                            ? "#33b0ca"
                            : "#fafafa",
                          color: state.isFocused ? "#ffffff" : "#000000",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          height: "32px",
                          lineHeight: "20px",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          fontSize: "12px",
                          "@media (min-width: 768px)": {
                            fontSize: "14px",
                          },
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          fontSize: "12px",
                          "@media (min-width: 768px)": {
                            fontSize: "14px",
                          },
                          margin: "0",
                          padding: "0",
                          lineHeight: "27px",
                        }),
                      }}
                      classNamePrefix="custom-select"
                    />

                    <div className="absolute inset-y-0 right-0 bg-[#fafafa] flex items-center px-2 pointer-events-none">
                      {isProtagonistOpen ? (
                        <IoIosArrowUp className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                      ) : (
                        <IoIosArrowDown className="text-[14px] w-[14px] md:text-[20px] md:w-[16px]" />
                      )}
                    </div>
                  </div>
                  <div className="col-span-12 mb-[12px] md:mt-[21px] md:mb-[0px] md:col-span-3">
                    {" "}
                    <div className="flex h-[31px] gap-[12px] md:w-[185px]">
                      {protagonist !== "Inanimate Object" && (
                        <>
                          <label className="text-[12px] md:!text-[14px] font-[500]">
                            Age
                          </label>
                          <input
                            type="number"
                            id="protaAge"
                            value={protaAge}
                            min="0" // This prevents negative values
                            className={`h-[30px] col-span-4 relative text-[12px] md:!text-[14px] leading-tight px-[8px] w-[57px]  bg-[#fafafa] rounded-[4px] border-[2px] ${
                              protaAge ? "border-[#33B0CA]" : "border-[#EAEAEA]"
                            } focus:outline-none`}
                            placeholder="23"
                            required
                            onChange={(e) => {
                              const value = e.target.value;

                              if (/^\d*$/.test(value)) {
                                if (value === "" || value > 0) {
                                  setProtaAge(value);
                                }
                              }
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* button part */}
            {!finalEdit ? (
              <div className="lg:bg-[#FAFAFA] absolute right-3 md:right-0 bottom-0  flex  justify-end py-1 text-center  md:mx-[28px] mt-[12px] md:mb-[10px]">
                <button
                  disabled={isLoading}
                  className={`${
                    isLoading
                      ? "bg-[#616161] rounded-[8px] h-[32px] px-[12px] text-[14px] font-[600] text-white hover:bg hidden"
                      : "bg-[#FAFAFA] border h-[32px] !border-[#33B0CA] text-[#33B0CA] rounded-[8px]  px-[12px] text-[14px] font-[600]"
                  } mr-4 md:ml-0`}
                  onClick={() => handleGoBack()}
                >
                  Back
                </button>
                {!isLoading && (
                  <button
                    // onClick={submitPremise}
                    disabled={!formValid}
                    type="submit"
                    className={` text-white rounded-[8px] h-[32px] px-[28px] text-[14px] font-[600] ${
                      !formValid ? "bg-[#ACDDE7] " : "bg-[#33B0CA]"
                    }`}
                  >
                    Next
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex w-[88%] mx-auto items-center gap-2 mt-[8px] ml-8">
                  <input
                    className=" cursor-pointer"
                    type="checkbox"
                    id="checkbox"
                    onChange={() => setAgreeToPost(!agreeToPost)}
                    checked={agreeToPost}
                  />
                  <p
                    htmlFor="checkbox"
                    className="text-[12px] leading-4 max-w-[90%]"
                  >
                    I understand that after posting the Premise, I will not be
                    able to edit the proposed characters.
                  </p>
                </div>
                <div
                  className={`lg:bg-[#FAFAFA] absolute right-3 md:right-0 md:bottom-0  flex items-center justify-end pt-[4px] pb-[8px] text-center  md:mx-[28px]  ${
                    charSaveDisable ? " md:top-[23px]" : " md:top-[118px]"
                  } md:mb-[10px]  `}
                >
                  {!charSaveDisable && (
                    <div
                      onClick={handleEditProposedCharacters}
                      className={`position-relative text-[#33B0CA]  cursor-pointer mr-[12px]  h-[32px] px-[10px] text-[14px] font-[500] border border-[#fafafa] border-b-[#33B0CA]
                  `}
                    >
                      Edit Proposed Characters
                    </div>
                  )}
                  {finalSubmitLoading ? (
                    <div
                      disabled={finalSubmitLoading}
                      className={` text-white cursor-auto rounded-[8px] h-[32px] px-[28px] text-[14px] font-[600] bg-[#33B0CA]`}
                    >
                      Posting...
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center ">
                      {charSaveDisable && (
                        <div
                          onClick={() => {
                            setFinalSubmitLoading(false);
                            setCharacterEditPop(true);
                          }}
                          // disabled={}
                          className={`  flex justify-center items-center cursor-pointer rounded-[8px] h-[32px] px-[28px]
                             text-[14px] font-[600] border border-[#33B0CA]  text-[#33B0CA] `}
                        >
                          Back To Character List
                        </div>
                      )}
                      <button
                        disabled={!agreeToPost}
                        onClick={handlePremisePostToGetComments}
                        className={` text-white flex justify-center items-center  rounded-[8px] h-[32px] px-[28px] text-[14px] 
                          font-[600] ${
                            agreeToPost ? "bg-[#33B0CA] " : "bg-[#ACDDE7]"
                          }`}
                      >
                        Post
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </form>
    );
}

export default CreateProjectDiv