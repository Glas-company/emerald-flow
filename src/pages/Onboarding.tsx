import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
  multiple?: boolean;
}

const questions: Question[] = [
  {
    id: "business_type",
    question: "Qual é o tipo do seu negócio?",
    options: [
      { value: "saas", label: "SaaS / Software", description: "Empresa de tecnologia" },
      { value: "ecommerce", label: "E-commerce", description: "Loja online" },
      { value: "services", label: "Serviços", description: "Consultoria ou agência" },
      { value: "industry", label: "Indústria", description: "Fabricação" },
      { value: "other", label: "Outro", description: "Outro tipo" },
    ]
  },
  {
    id: "team_size",
    question: "Quantas pessoas na equipe?",
    options: [
      { value: "1", label: "Só eu" },
      { value: "2-5", label: "2 a 5 pessoas" },
      { value: "6-20", label: "6 a 20 pessoas" },
      { value: "21-50", label: "21 a 50 pessoas" },
      { value: "50+", label: "Mais de 50" },
    ]
  },
  {
    id: "goals",
    question: "Seus principais objetivos?",
    multiple: true,
    options: [
      { value: "automation", label: "Automatizar processos" },
      { value: "analytics", label: "Melhorar análise de dados" },
      { value: "team", label: "Organizar a equipe" },
      { value: "customers", label: "Atender melhor clientes" },
      { value: "growth", label: "Crescer o negócio" },
    ]
  },
  {
    id: "features",
    question: "Recursos que mais precisa?",
    multiple: true,
    options: [
      { value: "chat_ai", label: "Chat com IA" },
      { value: "documents", label: "Gestão de documentos" },
      { value: "team_management", label: "Gestão de equipe" },
      { value: "analytics", label: "Métricas e relatórios" },
      { value: "integrations", label: "Integrações" },
    ]
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelect = (value: string) => {
    if (currentQuestion.multiple) {
      const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [currentQuestion.id]: newAnswers });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    }
  };

  const isSelected = (value: string) => {
    const answer = answers[currentQuestion.id];
    if (Array.isArray(answer)) {
      return answer.includes(value);
    }
    return answer === value;
  };

  const canContinue = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.multiple) {
      return Array.isArray(answer) && answer.length > 0;
    }
    return !!answer;
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Onboarding complete:", answers);
      navigate("/app");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-5 pt-12 pb-4 safe-area-top">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`back-button ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <span className="text-sm text-muted-foreground font-medium">
            {currentStep + 1} de {questions.length}
          </span>
          <div className="w-10" />
        </div>
        <Progress value={progress} className="h-1 rounded-full" />
      </header>

      {/* Content */}
      <main className="flex-1 px-5 py-8 animate-fade-in" key={currentStep}>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {currentQuestion.question}
        </h1>
        {currentQuestion.multiple && (
          <p className="text-muted-foreground mb-6">
            Selecione todas que se aplicam
          </p>
        )}

        <div className="space-y-3 mt-8">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full p-5 rounded-2xl text-left transition-all flex items-center justify-between ${
                isSelected(option.value)
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-secondary border-2 border-transparent"
              }`}
            >
              <div>
                <p className="font-semibold text-foreground">{option.label}</p>
                {option.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                )}
              </div>
              {isSelected(option.value) && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 py-6 safe-area-bottom">
        <Button 
          onClick={handleNext} 
          disabled={!canContinue()}
          className="w-full h-14 rounded-2xl text-base font-semibold"
        >
          {currentStep === questions.length - 1 ? "Concluir" : "Continuar"}
        </Button>
      </footer>
    </div>
  );
}
