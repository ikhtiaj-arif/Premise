import { useEffect } from "react";
import { useGetSavedCharactersQuery } from "../../../app/EndPoints/Characters/Characters";
import CharacterEditablePop from "./CharacterEditablePop";

const CharacterEditableWrapper = ({
  setCharacterEditPop,
  currentProjectData,
  setCharacterArray,
  onlyAdd,
  handleUpdateSavedChar,
  characterArray,
  project_id,
  source_language,
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
          setCharacterArray={setCharacterArray}
          onlyAdd={onlyAdd}
          handleUpdateSavedChar={handleUpdateSavedChar}
          characterLoading={isCharLoading}
          project_id={project_id}
          source_language={source_language}
        />
      )}
    </div>
  );
};

export default CharacterEditableWrapper;
