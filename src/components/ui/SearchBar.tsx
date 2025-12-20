import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  showFilter?: boolean;
  onFilterClick?: () => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Buscar...",
  value,
  onChange,
  showFilter = false,
  onFilterClick,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative flex items-center gap-3", className)}>
      <div className="flex-1 relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="search-mobile"
        />
      </div>
      
      {showFilter && (
        <button
          onClick={onFilterClick}
          className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-md transition-transform active:scale-95"
        >
          <SlidersHorizontal size={20} className="text-primary-foreground" />
        </button>
      )}
    </div>
  );
}
