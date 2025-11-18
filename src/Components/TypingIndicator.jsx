const TypingIndicator = () => {
  return (
    <div className="flex items-center py-6 pl-7 pr-10 bg-[#EFF6FF] border border-[#FAF5FF] shadow-md rounded-tl-[6px] rounded-tr-[14px] rounded-b-[14px]">
      <div className="flex gap-2">
        <span className="w-3 h-3 bg-[linear-gradient(30deg,#741CFF_0%,#00C3FF_70%)] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-3 h-3 bg-[linear-gradient(30deg,#741CFF_0%,#00C3FF_70%)] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-3 h-3 bg-[linear-gradient(30deg,#741CFF_0%,#00C3FF_70%)] rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default TypingIndicator;
