import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

export default function QuizLoading() {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 3000; // 3 segundos
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate('/onboarding/plan-ready'), 500);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    if (progress > 25) setStep(1);
    if (progress > 50) setStep(2);
    if (progress > 75) setStep(3);
    if (progress === 100) setStep(4);
  }, [progress]);

  // Cálculo do círculo SVG
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const checklistItems = [
    "Analisando seus dados",
    "Calculando o plano ideal",
    "Otimizando sua produtividade",
    "Revisando tudo"
  ];

  return (
    <div className="min-h-[100svh] bg-white flex flex-col items-center justify-center px-8 text-center">
      {/* Círculo de Progresso */}
      <div className="relative w-44 h-44 mb-12 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Círculo de fundo (Cinza claro) */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="8"
          />
          {/* Círculo de progresso (Preto) */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-75 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[42px] font-bold text-[#1a1a1a] tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <h2 className="text-[26px] font-extrabold text-[#1a1a1a] mb-12 leading-tight">
        {progress < 100 ? "Finalizando os preparativos..." : "Tudo pronto!"}
      </h2>

      {/* Checklist */}
      <div className="w-full max-w-xs space-y-5 text-left ml-4">
        {checklistItems.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${step >= index + 1 ? 'bg-[#22c55e]' : 'bg-gray-100'}`}>
              <Check size={16} className={`${step >= index + 1 ? 'text-white' : 'text-transparent'}`} strokeWidth={3} />
            </div>
            <span className={`text-[17px] font-medium transition-colors duration-300 ${step >= index + 1 ? 'text-[#22c55e]' : 'text-gray-300'}`}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
