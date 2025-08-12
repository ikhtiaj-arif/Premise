export default function CustomTooltip({ step, tooltipProps }) {
  return (
    <div
      {...tooltipProps}
      onClick={() => {
        if (tooltipProps.closeProps?.onClick) {
          tooltipProps.closeProps.onClick(); // Close via Joyride's close handler
        }
      }}
      className="bg-white rounded shadow-lg p-2 max-w-xs text-sm z-50 cursor-pointer"
    >
      <h4 className="text-center text-[16px] font-semibold mb-2">{step.title}</h4>
    </div>
  );
}
