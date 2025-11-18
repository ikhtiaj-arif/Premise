const TranslateLangDrop = ({
  sortedLanguages,
  source_language,
  setSelectedOption,
  setTransPopClose,
}) => {
  return (
    <div className="absolute top-[32px] right-0 z-50 w-[135px] h-[27vh] overflow-x-hidden md:h-[40vh] overflow-y-auto border bg-[#fafafa]">
      {Object.entries(sortedLanguages)?.map(([key, name]) =>
        key !== source_language ? (
          <li
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOption(key);
              setTransPopClose(null);
            }}
            className="cursor-pointer  text-[14px] text-[#252525] hover:bg-[#00c3ff] hover:text-[#fafafa] list-none pl-[8px] border-b"
            key={key}
            value={key}
          >
            {name}
          </li>
        ) : null
      )}
    </div>
  );
};

export default TranslateLangDrop;
