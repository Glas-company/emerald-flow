import { Heart, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroCardProps {
  image: string;
  title: string;
  subtitle?: string;
  rating?: number;
  reviews?: number;
  tag?: string;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function HeroCard({
  image,
  title,
  subtitle,
  rating,
  reviews,
  tag,
  showFavorite = true,
  isFavorite = false,
  onFavorite,
  onClick,
  size = "lg",
  className,
}: HeroCardProps) {
  const sizeClasses = {
    sm: "h-40 rounded-2xl",
    md: "h-56 rounded-2xl",
    lg: "h-72 rounded-3xl",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "card-hero relative overflow-hidden cursor-pointer group",
        sizeClasses[size],
        className
      )}
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient Overlay */}
      <div className="hero-overlay" />

      {/* Favorite Button */}
      {showFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.();
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-md transition-transform active:scale-95"
        >
          <Heart
            size={20}
            className={cn(
              "transition-colors",
              isFavorite ? "fill-accent text-accent" : "text-foreground"
            )}
          />
        </button>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {tag && (
          <span className="inline-block px-3 py-1 bg-accent/90 text-accent-foreground text-xs font-medium rounded-full mb-2">
            {tag}
          </span>
        )}
        
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        
        {subtitle && (
          <p className="text-sm text-white/80 mb-2">{subtitle}</p>
        )}

        {(rating || reviews) && (
          <div className="flex items-center gap-2">
            {rating && (
              <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium text-white">{rating}</span>
              </div>
            )}
            {reviews && (
              <span className="text-xs text-white/80">{reviews} reviews</span>
            )}
          </div>
        )}
      </div>

      {/* See More Button */}
      <div className="absolute bottom-5 right-5">
        <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform active:scale-95">
          <ArrowRight size={20} className="text-primary-foreground" />
        </button>
      </div>
    </div>
  );
}
