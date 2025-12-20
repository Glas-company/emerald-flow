import { useState } from "react";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/ui/SearchBar";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { HeroCard } from "@/components/ui/HeroCard";
import { MobileCard } from "@/components/ui/MobileCard";

const categories = ["Todos", "Automação", "Equipe", "Relatórios", "Vendas"];

const featuredItems = [
  {
    id: 1,
    title: "Dashboard Pro",
    subtitle: "Métricas em tempo real",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 324,
    tag: "Popular",
  },
  {
    id: 2,
    title: "Automação de Vendas",
    subtitle: "Aumente sua conversão",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: 256,
    tag: "Novo",
  },
];

const recentItems = [
  {
    id: 1,
    title: "Relatório Mensal",
    subtitle: "Atualizado há 2 horas",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews: 56,
  },
  {
    id: 2,
    title: "Pipeline de Vendas",
    subtitle: "12 oportunidades ativas",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: 128,
  },
];

const quickActions = [
  {
    id: 1,
    title: "Chat com IA",
    description: "Tire dúvidas instantâneas",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop&q=80",
    tag: "IA",
  },
  {
    id: 2,
    title: "Criar Relatório",
    description: "Gere insights automaticamente",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
  },
];

export default function Dashboard() {
  const [category, setCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-5 pt-12 pb-4 safe-area-top">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-secondary overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Olá, Carlos</h1>
              <p className="text-sm text-muted-foreground">Bem-vindo ao ELO</p>
            </div>
          </div>
          <Link 
            to="/app/configuracoes"
            className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-md"
          >
            <Settings size={20} className="text-primary-foreground" />
          </Link>
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Buscar recursos..."
          value={searchQuery}
          onChange={setSearchQuery}
          showFilter
        />
      </header>

      {/* Content */}
      <main className="px-5 pb-8 space-y-8">
        {/* Categories */}
        <section className="animate-fade-up">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Selecione uma categoria
          </h2>
          <ChipGroup
            options={categories}
            value={category}
            onChange={setCategory}
          />
        </section>

        {/* Featured Hero Card */}
        <section className="animate-fade-up" style={{ animationDelay: "50ms" }}>
          <HeroCard
            image={featuredItems[0].image}
            title={featuredItems[0].title}
            subtitle={featuredItems[0].subtitle}
            rating={featuredItems[0].rating}
            reviews={featuredItems[0].reviews}
            tag={featuredItems[0].tag}
          />
        </section>

        {/* Quick Actions */}
        <section className="animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Ações rápidas</h2>
            <button className="text-sm font-medium text-muted-foreground">Ver tudo</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((item) => (
              <MobileCard
                key={item.id}
                image={item.image}
                title={item.title}
                subtitle={item.description}
                tag={item.tag}
              />
            ))}
          </div>
        </section>

        {/* Recent */}
        <section className="animate-fade-up" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recentes</h2>
            <button className="text-sm font-medium text-muted-foreground">Ver tudo</button>
          </div>
          <div className="space-y-3">
            {recentItems.map((item) => (
              <MobileCard
                key={item.id}
                variant="horizontal"
                image={item.image}
                title={item.title}
                subtitle={item.subtitle}
                rating={item.rating}
                reviews={item.reviews}
              />
            ))}
          </div>
        </section>

        {/* Secondary Hero */}
        <section className="animate-fade-up" style={{ animationDelay: "200ms" }}>
          <HeroCard
            image={featuredItems[1].image}
            title={featuredItems[1].title}
            subtitle={featuredItems[1].subtitle}
            rating={featuredItems[1].rating}
            reviews={featuredItems[1].reviews}
            tag={featuredItems[1].tag}
            size="md"
          />
        </section>
      </main>
    </div>
  );
}
