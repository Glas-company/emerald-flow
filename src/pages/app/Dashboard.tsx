import { useState } from "react";
import { Search, SlidersHorizontal, Heart, Star, ArrowRight, Home, Bookmark, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const categories = ["Todos", "Automação", "Equipe", "Relatórios", "Vendas"];

const featuredCard = {
  id: 1,
  title: "Dashboard Pro",
  subtitle: "Produtividade",
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
  rating: 5.0,
  reviews: 143,
  tag: "Popular",
};

export default function Dashboard() {
  const [category, setCategory] = useState("Todos");
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      {/* Mobile Phone Container */}
      <div className="w-full max-w-[390px] min-h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative">
        {/* Status Bar / Notch */}
        <div className="h-12 bg-white flex items-center justify-center">
          <div className="w-[120px] h-[34px] bg-black rounded-full" />
        </div>

        {/* Main Content */}
        <div className="px-5 pb-28 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[20px] font-bold text-[#1a1a1a]">Olá, Carlos</h1>
              <p className="text-[12px] text-[#8a8a8a]">Bem-vindo ao ELO</p>
            </div>
            <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
              <input
                type="text"
                placeholder="Search"
                className="w-full h-11 pl-10 pr-4 bg-[#f5f5f5] rounded-full text-[14px] text-[#1a1a1a] placeholder:text-[#8a8a8a] focus:outline-none"
              />
            </div>
            <button className="w-11 h-11 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-lg">
              <SlidersHorizontal size={16} className="text-white" />
            </button>
          </div>

          {/* Section Title */}
          <h2 className="text-[15px] font-semibold text-[#1a1a1a] mb-3">
            Selecione sua categoria
          </h2>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 -mx-5 px-5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all",
                  category === cat
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-[#f5f5f5] text-[#1a1a1a]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Hero Card */}
          <div className="relative rounded-[24px] overflow-hidden shadow-xl">
            {/* Background Image */}
            <div className="relative h-[280px]">
              <img
                src={featuredCard.image}
                alt={featuredCard.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
              >
                <Heart
                  size={18}
                  className={cn(
                    "transition-colors",
                    isFavorite ? "fill-red-500 text-red-500" : "text-[#1a1a1a]"
                  )}
                />
              </button>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Tag */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium rounded-full mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {featuredCard.tag}
                </span>

                {/* Title */}
                <h3 className="text-[22px] font-bold text-white mb-1.5">
                  {featuredCard.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] font-semibold text-white">
                      {featuredCard.rating}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/80">
                    {featuredCard.reviews} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* See More Button */}
            <div className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between">
              <span className="text-white text-[13px] font-medium">Ver mais</span>
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <ArrowRight size={16} className="text-[#1a1a1a]" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-8 pt-3">
          <div className="bg-[#1a1a1a] rounded-full px-3 py-1.5 flex items-center justify-around">
            <Link to="/app" className="p-2.5">
              <Home size={20} className="text-white" />
            </Link>
            <Link to="/app/chat" className="p-2.5">
              <Bookmark size={20} className="text-white/50" />
            </Link>
            <Link to="/app/admin/metricas" className="p-2.5">
              <Heart size={20} className="text-white/50" />
            </Link>
            <Link to="/app/configuracoes" className="p-2.5">
              <User size={20} className="text-white/50" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
