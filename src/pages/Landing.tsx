import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BarChart3, Users, MessageSquare, Check } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Automação Inteligente",
    description: "Automatize tarefas e foque no que importa",
  },
  {
    icon: BarChart3,
    title: "Métricas em Tempo Real",
    description: "Dashboards intuitivos e personalizados",
  },
  {
    icon: Users,
    title: "Gestão de Equipe",
    description: "Organize sua equipe com eficiência",
  },
  {
    icon: MessageSquare,
    title: "Chat com IA",
    description: "Assistente 24/7 para sua equipe",
  },
];

const benefits = [
  "Sem cartão de crédito",
  "14 dias grátis",
  "Cancele quando quiser",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 px-5 pt-16 pb-8 safe-area-top">
        <div className="animate-fade-up">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">E</span>
            </div>
            <span className="font-bold text-2xl text-foreground">ELO</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
            <Zap size={16} />
            <span>Novo: Integração com IA</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">
            Conecte todas as áreas do seu negócio
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            ELO é a plataforma que simplifica a gestão da sua empresa. Tudo integrado para você crescer mais rápido.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap gap-4 mb-8">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check size={12} className="text-accent" />
                </div>
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button size="lg" className="w-full h-14 rounded-2xl text-base font-semibold" asChild>
              <Link to="/auth/cadastro">
                Começar grátis
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="w-full h-14 rounded-2xl text-base font-semibold" 
              asChild
            >
              <Link to="/auth/login">
                Já tenho uma conta
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-5 py-12 bg-secondary/50">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          Tudo que você precisa
        </h2>
        
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-mobile p-5 flex items-start gap-4 animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <feature.icon size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-5 py-12">
        <div className="grid grid-cols-2 gap-6">
          {[
            { value: "5.000+", label: "Empresas ativas" },
            { value: "98%", label: "Satisfação" },
            { value: "40%", label: "Mais produtivo" },
            { value: "24/7", label: "Suporte" },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 py-8 safe-area-bottom">
        <div className="bg-primary rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground mb-3">
            Pronto para começar?
          </h2>
          <p className="text-primary-foreground/80 mb-6">
            Junte-se a milhares de empresas
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="w-full h-14 rounded-2xl text-base font-semibold bg-background text-foreground hover:bg-background/90"
            asChild
          >
            <Link to="/auth/cadastro">
              Criar conta grátis
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
