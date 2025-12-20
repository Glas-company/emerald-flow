import { Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileCardProps {
  image?: string;
  title: string;
  subtitle?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  price?: string;
  tag?: string;
  onClick?: () => void;
  variant?: "horizontal" | "vertical";
  className?: string;
}

export function MobileCard({
  image,
  title,
  subtitle,
  description,
  rating,
  reviews,
  price,
  tag,
  onClick,
  variant = "vertical",
  className,
}: MobileCardProps) {
  if (variant === "horizontal") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "card-interactive flex gap-4 p-4 cursor-pointer",
          className
        )}
      >
        {image && (
          <img
            src={image}
            alt={title}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          {tag && (
            <span className="inline-block px-2 py-0.5 bg-accent/20 text-accent text-xs font-medium rounded-full mb-1">
              {tag}
            </span>
          )}
          <h4 className="font-semibold text-foreground truncate">{title}</h4>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {rating && (
              <div className="flex items-center gap-1">
                <Star size={14} className="text-accent fill-accent" />
                <span className="text-sm font-medium text-foreground">{rating}</span>
                {reviews && (
                  <span className="text-xs text-muted-foreground">({reviews})</span>
                )}
              </div>
            )}
            {price && (
              <span className="text-sm font-semibold text-foreground">{price}</span>
            )}
          </div>
        </div>
        <ChevronRight size={20} className="text-muted-foreground flex-shrink-0 self-center" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "card-interactive overflow-hidden cursor-pointer",
        className
      )}
    >
      {image && (
        <div className="relative aspect-[4/3]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {tag && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-card/90 backdrop-blur-sm text-xs font-medium rounded-full">
              {tag}
            </span>
          )}
        </div>
      )}
      <div className="p-4">
        <h4 className="font-semibold text-foreground">{title}</h4>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          {rating && (
            <div className="flex items-center gap-1">
              <Star size={14} className="text-accent fill-accent" />
              <span className="text-sm font-medium text-foreground">{rating}</span>
              {reviews && (
                <span className="text-xs text-muted-foreground">{reviews} reviews</span>
              )}
            </div>
          )}
          {price && (
            <span className="text-sm font-semibold text-foreground">{price}</span>
          )}
        </div>
      </div>
    </div>
  );
}
