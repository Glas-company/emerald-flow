import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function Chip({ label, isActive, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "chip whitespace-nowrap transition-all",
        isActive ? "chip-active" : "chip-default"
      )}
    >
      {label}
    </button>
  );
}

interface ChipGroupProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ChipGroup({ options, value, onChange, className }: ChipGroupProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto no-scrollbar pb-1", className)}>
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          isActive={value === option}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  );
}
