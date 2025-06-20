import { useEffect } from "react";
import { useGetSavedCharactersQuery } from "../../../app/EndPoints/Characters/Characters";
import CharacterEditablePop from "./CharacterEditablePop";

const CharacterEditableWrapper = ({
  setCharacterEditPop,
  currentProjectData,
  setCharacterArray,
  onlyAdd,
  handleUpdateSavedChar,
  handleSaveAsDraft,
  characterArray,
  project_id,
  source_language,
  setPreviewAfterDraft,
  is_draft,
}) => {
  const { data: characters, isCharLoading } =
    useGetSavedCharactersQuery(project_id);

  useEffect(() => {
    if (characters) setCharacterArray(characters);
  }, [characters]);

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
