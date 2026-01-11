import { useNavigate } from "react-router-dom";
import { Check, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function PlanReady() {
  const navigate = useNavigate();
  const { answers } = useOnboarding();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dados de análise baseados no perfil do usuário
  const analysisData = [
    { label: "Tempo", value: "85%", color: "#1a1a1a", percent: 85, desc: "Ganho de eficiência" },
    { label: "Precisão", value: "99%", color: "#22c55e", percent: 99, desc: "Redução de erros" },
    { label: "Histórico", value: "100%", color: "#f19066", percent: 100, desc: "Dados protegidos" },
    { label: "Padrão", value: "Alto", color: "#546de5", percent: 90, desc: "Nível profissional" },
  ];

  // Dicas personalizadas com base nas respostas do quiz
  const getPersonalizedTips = () => {
    const tips = [];
    
    if (answers.problem === 'tempo') {
      tips.push("Reduza o tempo de preenchimento manual em até 40% usando nossos templates.");
    } else if (answers.problem === 'erros') {
      tips.push("Nossa validação inteligente impede 99% dos erros de dosagem em campo.");
    }

    if (answers.goal === 'profissionalizar') {
      tips.push("Gere relatórios em PDF com sua marca para profissionalizar sua entrega.");
    } else if (answers.goal === 'escalar') {
      tips.push("Compartilhe receitas com sua equipe e mantenha o padrão de qualidade.");
    }

    // Dica padrão se não houver muitas respostas
    if (tips.length < 2) {
      tips.push("Acesse seu histórico de qualquer lugar, mesmo sem internet no campo.");
    }

    return tips;
  };

  return (
    <div className="min-h-[100svh] bg-white flex flex-col px-6">
      <div className="flex-1 flex flex-col items-center pt-12 pb-10 overflow-y-auto">
        {/* Ícone de Checkmark Preto */}
        <div className={`mb-6 w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center transition-all duration-700 scale-in ${mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <Check size={32} className="text-white" strokeWidth={3} />
        </div>

        <h1 className="text-[32px] font-extrabold text-[#1a1a1a] text-center mb-2 leading-tight">
          Parabéns!
        </h1>
        
        <p className="text-[18px] font-semibold text-[#1a1a1a] text-center mb-8 px-4">
          Seu plano personalizado de produtividade está pronto!
        </p>

        {/* Card Principal de Análise Operacional */}
        <div className="w-full bg-[#f8f8fb] rounded-[24px] p-6 mb-6">
          <div className="mb-6">
            <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-1">
              Análise do seu perfil
            </h3>
            <p className="text-gray-400 text-[14px]">
              Estimativa de ganhos operacionais
            </p>
          </div>

          {/* Grid de Análise (Estilo FitCal) */}
          <div className="grid grid-cols-2 gap-4">
            {analysisData.map((item, i) => (
              <div key={i} className="bg-white rounded-[20px] p-4 relative flex flex-col items-center shadow-sm">
                <span className="text-[14px] font-bold text-gray-400 mb-4">{item.label}</span>
                
                <div className="relative w-24 h-24 mb-2 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r={40}
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="6"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r={40}
                      fill="none"
                      stroke={item.color}
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - item.percent / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[16px] font-bold text-[#1a1a1a]">{item.value}</span>
                  </div>
                </div>
                <span className="text-[11px] text-gray-400 mt-1">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Dicas */}
        <div className="w-full space-y-4 mb-6">
          <div className="flex items-center gap-2 px-2">
            <Lightbulb className="text-yellow-500" size={20} />
            <h4 className="text-[16px] font-bold text-[#1a1a1a]">Dicas para você</h4>
          </div>
          
          <div className="space-y-3">
            {getPersonalizedTips().map((tip, index) => (
              <div key={index} className="p-4 bg-green-50/50 border border-green-100 rounded-2xl">
                <p className="text-[14px] text-gray-700 leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botão Fixo Inferior */}
      <div className="pb-10 pt-4 bg-white">
        <button
          onClick={() => navigate('/onboarding/start-experience')}
          className="w-full py-5 px-8 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-[18px] font-bold rounded-[20px] shadow-xl transition-all duration-300 active:scale-[0.98]"
        >
          Pegue os seus 7 dias grátis
        </button>
      </div>
    </div>
  );
}
