import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Heart, Star, ArrowRight, Calculator, Droplets, Plane, Calendar, ChevronRight, BookOpen, FlaskConical, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, UserProfile } from "@/lib/userProfile";
import { getSavedCalculations, formatCalculationDate as formatDate, type SavedCalculationData } from "@/lib/favoritesService";
import { getRecipes, type Recipe } from "@/lib/recipesService";
import { getAllProducts, type CatalogProduct } from "@/lib/productCatalogService";
import { Operacoes } from "@/components/home/Operacoes";
import { Relatorios } from "@/components/home/Relatorios";
import { Avatar } from "@/components/profile/Avatar";
import { useNavigate } from "react-router-dom";
import dronePainelImg from "@/assets/drone painel 1.webp";

const categories = ["Todos", "Cálculos", "Operações", "Relatórios"];

const quickActions = [
  {
    id: 1,
    title: "Calculadora de Calda",
    description: "Calcule a mistura ideal",
    icon: Calculator,
    path: "/app/calc",
    color: "bg-primary",
  },
  {
    id: 2,
    title: "Histórico",
    description: "Últimos cálculos",
    icon: Droplets,
    path: "/app/favoritos",
    color: "bg-blue-500",
  },
];

const featuredCard = {
  id: 1,
  title: "Pulverização Agrícola",
  subtitle: "Drones",
  image: dronePainelImg,
  rating: 5.0,
  reviews: 143,
  tag: "Novo",
};

export default function Home() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Todos");
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [search, setSearch] = useState("");
  const [allCalculations, setAllCalculations] = useState<SavedCalculationData[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [allProducts, setAllProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { profile } = await getUserProfile();
        if (profile) {
          setUserProfile(profile);
        }
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    const handleCalculationSaved = () => {
      if (user) {
        loadData();
      }
    };
    window.addEventListener("calculationSaved", handleCalculationSaved);
    return () => {
      window.removeEventListener("calculationSaved", handleCalculationSaved);
    };
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carregar produtos (padrão + custom se user existir)
      const products = await getAllProducts(user?.id || "");
      setAllProducts(products);

      // Carregar cálculos e receitas apenas se usuário logado
      if (user) {
        const [calculations, recipes] = await Promise.all([
          getSavedCalculations(),
          getRecipes(user.id),
        ]);
        setAllCalculations(calculations);
        setAllRecipes(recipes);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const userName = userProfile?.fullName || "Piloto";

  const filteredCalculations = allCalculations.filter((calc) =>
    calc.title.toLowerCase().includes(search.toLowerCase()) ||
    calc.input.products.some((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredRecipes = allRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(search.toLowerCase()) ||
    recipe.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
    recipe.products.some((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase()) ||
    product.indication.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pt-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[#1a1a1a]">Olá, {userName}</h1>
          <p className="text-[12px] text-[#8a8a8a]">Bem-vindo ao Calc</p>
        </div>
        <Avatar linkTo="/app/perfil" size="md" />
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
          <input
            type="text"
            placeholder="Buscar produtos, receitas, cálculos..."
            className="w-full h-11 pl-10 pr-4 bg-white rounded-full text-[14px] text-[#1a1a1a] placeholder:text-[#8a8a8a] focus:outline-none shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="w-11 h-11 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-lg">
          <SlidersHorizontal size={16} className="text-white" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              to={action.path}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", action.color)}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="text-[14px] font-semibold text-[#1a1a1a]">{action.title}</h3>
              <p className="text-[12px] text-[#8a8a8a]">{action.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Busca ativa */}
      {search && (
        <SearchResults
          calculations={filteredCalculations}
          recipes={filteredRecipes}
          products={filteredProducts}
          isLoading={isLoading}
          searchTerm={search}
        />
      )}

      {/* Conteúdo quando NÃO há busca ativa */}
      {!search && (
        <>
          {/* Recent Calculations */}
          {category === "Todos" && <RecentCalculations />}

          {/* Section Title */}
          <h2 className="text-[15px] font-semibold text-[#1a1a1a] -mb-3">Categorias</h2>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all",
                  category === cat
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-white text-[#1a1a1a] shadow-sm"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Conteúdo Filtrado por Categoria */}
          {category === "Cálculos" && (
            <FilteredCalculations calculations={allCalculations.slice(0, 5)} isLoading={isLoading} />
          )}
          {category === "Operações" && <Operacoes isLoading={isLoading} />}
          {category === "Relatórios" && <Relatorios isLoading={isLoading} />}
        </>
      )}

      {/* Hero Card */}
      {!search && category === "Todos" && (
        <div className="relative rounded-[24px] overflow-hidden shadow-xl">
          <div className="relative h-[240px]">
            <img src={featuredCard.image} alt={featuredCard.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
            >
              <Heart size={18} className={cn("transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-[#1a1a1a]")} />
            </button>
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center">
              <Plane size={18} className="text-white" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium rounded-full mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {featuredCard.tag}
              </span>
              <h3 className="text-[22px] font-bold text-white mb-1.5">{featuredCard.title}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-semibold text-white">{featuredCard.rating}</span>
                </div>
                <span className="text-[10px] text-white/80">{featuredCard.reviews} usuários</span>
              </div>
            </div>
          </div>
          <Link to="/app/calc" className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between">
            <span className="text-white text-[13px] font-medium">Abrir Calculadora</span>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <ArrowRight size={16} className="text-white" />
            </div>
          </Link>
        </div>
      )}

    </div>
  );
}

interface SearchResultsProps {
  calculations: SavedCalculationData[];
  recipes: Recipe[];
  products: CatalogProduct[];
  isLoading: boolean;
  searchTerm: string;
}

function SearchResults({ calculations, recipes, products, isLoading, searchTerm }: SearchResultsProps) {
  const navigate = useNavigate();
  const totalResults = calculations.length + recipes.length + products.length;

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-[#8a8a8a]">Buscando...</p>
      </div>
    );
  }

  if (totalResults === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
        <Search size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm font-medium text-[#1a1a1a] mb-1">Nenhum resultado encontrado</p>
        <p className="text-xs text-[#8a8a8a]">
          Tente buscar por "{searchTerm}" com outros termos
        </p>
      </div>
    );
  }

  // Mapeamento de cores por categoria de produto
  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Herbicida: { bg: "bg-orange-100", text: "text-orange-600" },
      Inseticida: { bg: "bg-red-100", text: "text-red-600" },
      Fungicida: { bg: "bg-blue-100", text: "text-blue-600" },
      Fertilizante: { bg: "bg-emerald-100", text: "text-emerald-600" },
      Adjuvante: { bg: "bg-cyan-100", text: "text-cyan-600" },
    };
    return colors[category] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  return (
    <div className="space-y-4">
      {/* Header de resultados */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-[#8a8a8a]">
          {totalResults} resultado{totalResults !== 1 ? 's' : ''} para "{searchTerm}"
        </span>
      </div>

      {/* Produtos */}
      {products.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={14} className="text-amber-600" />
              <h2 className="text-[15px] font-semibold text-[#1a1a1a]">Produtos</h2>
              <span className="text-[11px] text-[#8a8a8a] bg-gray-100 px-2 py-0.5 rounded-full">
                {products.length}
              </span>
            </div>
            <Link to="/app/produtos" className="text-[12px] text-amber-600 font-medium">Ver todos</Link>
          </div>
          {products.slice(0, 3).map((product) => {
            const categoryColor = getCategoryColor(product.category);
            return (
              <div
                key={product.id}
                onClick={() => navigate("/app/produtos")}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:border-amber-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#1a1a1a] truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded", categoryColor.bg, categoryColor.text)}>
                          {product.category}
                        </span>
                        <span className="text-[10px] text-[#8a8a8a]">
                          {product.doseValue} {product.doseUnit}/ha
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#8a8a8a] flex-shrink-0 ml-2" />
                </div>
              </div>
            );
          })}
          {products.length > 3 && (
            <button
              onClick={() => navigate("/app/produtos")}
              className="w-full py-2 text-[12px] text-amber-600 font-medium bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
            >
              Ver mais {products.length - 3} produto{products.length - 3 !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      {/* Receitas */}
      {recipes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical size={14} className="text-purple-600" />
              <h2 className="text-[15px] font-semibold text-[#1a1a1a]">Receitas</h2>
              <span className="text-[11px] text-[#8a8a8a] bg-gray-100 px-2 py-0.5 rounded-full">
                {recipes.length}
              </span>
            </div>
            <Link to="/app/receitas" className="text-[12px] text-purple-600 font-medium">Ver todas</Link>
          </div>
          {recipes.slice(0, 3).map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => navigate("/app/receitas")}
              className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#1a1a1a] truncate">{recipe.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#8a8a8a]">
                        {recipe.products.length} produto{recipe.products.length !== 1 ? 's' : ''}
                      </span>
                      {recipe.tags && recipe.tags.length > 0 && (
                        <>
                          <span className="text-[#d4d4d4]">•</span>
                          <span className="text-[10px] text-purple-600">
                            {recipe.tags.slice(0, 2).join(", ")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#8a8a8a] flex-shrink-0 ml-2" />
              </div>
            </div>
          ))}
          {recipes.length > 3 && (
            <button
              onClick={() => navigate("/app/receitas")}
              className="w-full py-2 text-[12px] text-purple-600 font-medium bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              Ver mais {recipes.length - 3} receita{recipes.length - 3 !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      {/* Cálculos */}
      {calculations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator size={14} className="text-green-600" />
              <h2 className="text-[15px] font-semibold text-[#1a1a1a]">Cálculos</h2>
              <span className="text-[11px] text-[#8a8a8a] bg-gray-100 px-2 py-0.5 rounded-full">
                {calculations.length}
              </span>
            </div>
            <Link to="/app/calculos" className="text-[12px] text-green-600 font-medium">Ver todos</Link>
          </div>
          {calculations.slice(0, 3).map((calc) => (
            <div
              key={calc.id}
              onClick={() => navigate(`/app/favoritos/${calc.id}`)}
              className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Calculator size={16} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#1a1a1a] truncate">{calc.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar size={10} className="text-[#8a8a8a]" />
                      <span className="text-[10px] text-[#8a8a8a]">{formatDate(calc.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#8a8a8a] flex-shrink-0 ml-2" />
              </div>
            </div>
          ))}
          {calculations.length > 3 && (
            <button
              onClick={() => navigate("/app/calculos")}
              className="w-full py-2 text-[12px] text-green-600 font-medium bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              Ver mais {calculations.length - 3} cálculo{calculations.length - 3 !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FilteredCalculations({ calculations, isLoading }: { calculations: SavedCalculationData[]; isLoading: boolean }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-[#8a8a8a]">Carregando...</p>
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
        <Calculator size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-[#8a8a8a]">Nenhum cálculo encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-[#1a1a1a]">Cálculos</h2>
        <Link to="/app/calculos" className="text-[12px] text-green-600 font-medium">Ver todos</Link>
      </div>
      {calculations.map((calc) => (
        <div
          key={calc.id}
          onClick={() => navigate(`/app/favoritos/${calc.id}`)}
          className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <Calculator size={16} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#1a1a1a] truncate">{calc.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar size={10} className="text-[#8a8a8a]" />
                  <span className="text-[10px] text-[#8a8a8a]">{formatDate(calc.timestamp)}</span>
                </div>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#8a8a8a] flex-shrink-0 ml-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentCalculations() {
  const navigate = useNavigate();
  const [recentCalculations, setRecentCalculations] = useState<SavedCalculationData[]>([]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const all = await getSavedCalculations();
        setRecentCalculations(all.slice(0, 3));
      } catch (error) {
        console.error("Erro ao carregar cálculos recentes:", error);
      }
    };
    loadRecent();

    const handleCalculationSaved = () => loadRecent();
    window.addEventListener("calculationSaved", handleCalculationSaved);
    return () => window.removeEventListener("calculationSaved", handleCalculationSaved);
  }, []);

  if (recentCalculations.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-[#1a1a1a]">Cálculos Recentes</h2>
        <Link to="/app/favoritos" className="text-[12px] text-green-600 font-medium">Ver todos</Link>
      </div>
      <div className="space-y-2">
        {recentCalculations.map((calc) => (
          <div
            key={calc.id}
            onClick={() => navigate(`/app/favoritos/${calc.id}`)}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Calculator size={16} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#1a1a1a] truncate">{calc.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Calendar size={10} className="text-[#8a8a8a]" />
                    <span className="text-[10px] text-[#8a8a8a]">{formatDate(calc.timestamp)}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#8a8a8a] flex-shrink-0 ml-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
