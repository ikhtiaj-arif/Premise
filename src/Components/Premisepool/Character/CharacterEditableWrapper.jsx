import { useEffect, useState } from "react";
import {
  useGetSavedCharactersQuery,
  useSaveCharactersMutation,
} from "../../../app/EndPoints/Characters/Characters";
import CharacterEditablePop from "./CharacterEditablePop";

const CharacterEditableWrapper = ({
  setCharacterEditPop,
  currentProjectData,
  setCharacterArray,
  onlyAdd,
  // handleUpdateSavedChar,
  // handleSaveAsDraft,
  characterArray,
  project_id,
  source_language,
  setPreviewAfterDraft,
  is_draft,
  id,
  setOpenCharacterChart,
  refetch,
}) => {
  const [saveCharacter, savedCharInfo] = useSaveCharactersMutation();
  const [characterLoading, setCharacterLoading] = useState(true);
  const {
    data: characters,
    isCharLoading,
    refetch: charRefetch,
  } = useGetSavedCharactersQuery(project_id);

  useEffect(() => {
    if (characters) setCharacterArray(characters);
  }, [characters]);

  const handleUpdateSavedChar = async () => {
    setCharacterLoading(true);
    try {
      characterArray.forEach((character) => {
        if (character.is_ai_generated === undefined) {
          character.is_ai_generated = false;
        }
      });
      characterArray.forEach((character) => {
        if (character.is_ai_generated === undefined) {
          character.is_ai_generated = false;
        }
      });
      const charArr = JSON.stringify(characterArray);
      const data = {
        // id: premiseID,
        id: project_id,
        // body: { char_data: charArr },
        body: { char_data: charArr, is_draft: false, premise_id: id },
      };

      const response = await saveCharacter(data);

      if (response) {
        // setAddNewCharacter(false)
        // setEditPopupOpen(false)
        setOpenCharacterChart(false);
        // setCharSaveDisable(true);
        setCharacterLoading(false);
        charRefetch();
        // toast.success("characters updated!")
      }
      return response;
    } catch (error) {
      setCharacterLoading(false);
      // console.error("Error updating characters:", error);
    }
  };

  // console.log("premiseData?.visible_to", p?.visible_to);

  const handleSaveAsDraft = async () => {
    console.log("inside function", characterArray);
    setCharacterLoading(true);
    try {
      characterArray.forEach((character) => {
        if (character.is_ai_generated === undefined) {
          character.is_ai_generated = false;
        }
      });

      const charArr = JSON.stringify(characterArray);

      const data = {
        id: project_id,
        body: { char_data: charArr, is_draft: true, premise_id: id },
        is_draft: true,
      };

      const response = await saveCharacter(data);

      if (response) {
        // setAddNewCharacter(false)
        // setEditPopupOpen(false)
        // setOpenCharacterChart(false);
        // setCharSaveDisable(true);
        setOpenCharacterChart(false);
        // setCharSaveDisable(true);
        setCharacterLoading(false);
        refetch();
        charRefetch();
        // toast.success("characters updated!")
      }
      return response;
    } catch (error) {
      setCharacterLoading(false);
      // console.error("Error updating characters:", error);
    }
  };

  console.log("characterArray", characterArray);

  return (
    <div>
      {!isCharLoading && (
        <CharacterEditablePop
          setCharacterEditPop={setCharacterEditPop}
          characterArray={characterArray}
          currentProjectData={currentProjectData}
          handleUpdateSavedChar={handleUpdateSavedChar}
          handleSaveAsDraft={handleSaveAsDraft}
          setCharacterArray={setCharacterArray}
          characterLoading={isCharLoading}
          onlyAdd={onlyAdd}
          project_id={project_id}
          source_language={source_language}
          is_draft={is_draft}
          setPreviewAfterDraft={setPreviewAfterDraft}
        />
      )}
    </div>
  );
};

export default CharacterEditableWrapper;
