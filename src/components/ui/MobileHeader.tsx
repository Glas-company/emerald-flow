import { ChevronLeft, Heart, Share, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showFavorite?: boolean;
  showShare?: boolean;
  showMore?: boolean;
  transparent?: boolean;
  onFavorite?: () => void;
  onShare?: () => void;
  onMore?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export function MobileHeader({
  title,
  subtitle,
  showBack = false,
  showFavorite = false,
  showShare = false,
  showMore = false,
  transparent = false,
  onFavorite,
  onShare,
  onMore,
  rightContent,
  className,
}: MobileHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-4 py-3 flex items-center justify-between",
        transparent ? "bg-transparent" : "bg-background/90 backdrop-blur-xl",
        className
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <ChevronLeft size={24} className="text-foreground" />
          </button>
        )}
        {title && (
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {rightContent}
        {showShare && (
          <button onClick={onShare} className="favorite-button">
            <Share size={20} className="text-foreground" />
          </button>
        )}
        {showFavorite && (
          <button onClick={onFavorite} className="favorite-button">
            <Heart size={20} className="text-foreground" />
          </button>
        )}
        {showMore && (
          <button onClick={onMore} className="favorite-button">
            <MoreHorizontal size={20} className="text-foreground" />
          </button>
        )}
      </div>
    </header>
  );
}
