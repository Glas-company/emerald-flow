import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CreditCard, Shield, Clock, Calendar, Lock, X } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

// Tipos
type Plan = {
  id: "monthly" | "yearly";
  name: string;
  price: number;
  originalPrice: number;
  period: string;
  periodLabel: string;
  saveLabel?: string;
  trialDays: number;
};

const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Mensal",
    price: 19.90, // Valor promocional
    originalPrice: 49.90,
    period: "/mês",
    periodLabel: "mensal",
    trialDays: 7
  },
  {
    id: "yearly",
    name: "Anual",
    price: 199.90, // Valor promocional (~16,65/mês)
    originalPrice: 499.90,
    period: "/ano",
    periodLabel: "anual",
    saveLabel: "Economize 60%",
    trialDays: 7
  }
];

export default function Checkout() {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboarding();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  
  // State for flow control
  const [step, setStep] = useState<"plans" | "payment">("plans");
  const [selectedPlanId, setSelectedPlanId] = useState<"monthly" | "yearly">("yearly");
  
  // State for payment form
  const [selectedType] = useState<"card">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveForFuture, setSaveForFuture] = useState(true);
  
  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState("23:59:59.00");
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      const milliseconds = Math.floor((diff % 1000) / 10);
      
      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const selectedPlan = PLANS.find(p => p.id === selectedPlanId) || PLANS[1];
  const trialEndDate = format(addDays(new Date(), selectedPlan.trialDays), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const handleBackClick = () => {
    if (step === "payment") {
      setStep("plans");
    } else {
      const fallback = '/onboarding/payment-selection';
      const hasHistory = typeof window !== 'undefined' && window.history.length > 1;
      if (hasHistory) {
        navigate(-1);
      } else {
        navigate(fallback, { replace: true });
      }
    }
  };
  
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(" ").substring(0, 19) : "";
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + "/" + numbers.substring(2, 4);
    }
    return numbers;
  };

  const handleContinueToPayment = async () => {
    if (isSubmitting) return;
    const digits = cardNumber.replace(/\s/g, "");
    const numOk = digits.length >= 13;
    const expOk = cardExpiry.length === 5;
    const nameOk = cardName.trim().length > 2;
    const cvvOk = cardCvv.length === 3;
    if (!numOk || !expOk || !nameOk || !cvvOk) {
      toast({
        title: "Dados do cartão inválidos",
        description: "Preencha número, validade, nome e CVV para continuar.",
        variant: "destructive",
      });
      return;
    }
    if (!supabase) {
      toast({
        title: "Serviço indisponível",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (sessionError || !accessToken) {
        toast({
          title: "Sessão expirada",
          description: "Faça login novamente para iniciar seu teste.",
          variant: "destructive",
        });
        return;
      }
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
      if (!supabaseUrl) {
        toast({
          title: "Configuração inválida",
          description: "Supabase não configurado corretamente.",
          variant: "destructive",
        });
        return;
      }
      const functionsBaseUrl = supabaseUrl.replace(".supabase.co", ".functions.supabase.co");
      const endpoint = `${functionsBaseUrl}/mercadopago-subscription`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          cardNumber,
          cardExpiry,
          cardCvv,
          cardHolderName: cardName,
          planAmount: selectedPlan.price,
          currencyId: "BRL",
          trialDays: selectedPlan.trialDays,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        toast({
          title: "Não foi possível iniciar o teste",
          description: "Verifique os dados do cartão ou tente novamente.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Teste gratuito iniciado",
        description: `Você terá ${selectedPlan.trialDays} dias grátis. Cobrança prevista para ${trialEndDate}.`,
      });
      await refreshUser();
      completeOnboarding();
      navigate('/app/home', { replace: true });
    } catch (error) {
      console.error("Erro ao iniciar trial:", error);
      toast({
        title: "Erro ao iniciar teste",
        description: "Ocorreu um erro ao processar seu teste grátis.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Plan Selection Step
  if (step === "plans") {
    return (
      <div className="min-h-[100svh] bg-white flex flex-col relative">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-gray-50 to-white -z-10" />
        
        {/* Header with Close Button */}
        <div className="px-6 pt-6 pb-2 flex justify-end">
          <button onClick={() => navigate('/auth/login')} className="p-2 -mr-2 text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 pt-4 pb-8 overflow-y-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-[24px] font-bold text-[#1a1a1a] mb-2">
              Acesso ilimitado
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[28px] font-[900] text-[#1a1a1a] italic tracking-tighter">Calc</span>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="w-full max-w-sm grid grid-cols-2 gap-4 mb-8">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                  selectedPlanId === plan.id
                    ? "border-[#1a1a1a] bg-white shadow-lg scale-[1.02]"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                {plan.saveLabel && (
                  <div className="absolute -top-3 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    {plan.saveLabel}
                  </div>
                )}
                
                <span className="text-[15px] font-bold text-[#1a1a1a] mb-1">
                  {plan.name}
                </span>
                
                <div className="flex flex-col items-center mb-1">
                  <span className="text-[11px] text-gray-400 line-through">
                    R$ {plan.originalPrice.toFixed(2).replace('.', ',')}
                    {plan.period}
                  </span>
                  <span className="text-[14px] font-bold text-[#1a1a1a]">
                    R$ {plan.price.toFixed(2).replace('.', ',')}
                    {plan.period}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Countdown Timer */}
          <div className="text-center mb-8">
            <p className="text-[13px] font-medium text-gray-900 tabular-nums tracking-wide">
              {timeLeft} restante
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setStep("payment")}
            className="w-full max-w-sm py-4 px-8 text-[16px] font-bold rounded-[30px] transition-all duration-300 active:scale-[0.98] mb-6 bg-black text-white hover:bg-gray-900 shadow-lg"
          >
            Obtenha 60% de desconto Premium
          </button>

          {/* Footer Links */}
          <div className="flex flex-col items-center gap-2 text-[11px] text-gray-400 font-medium">
            <button className="hover:text-gray-600">Restaurar compras</button>
            <div className="flex gap-4">
              <button className="hover:text-gray-600">Termos de serviço</button>
              <button className="hover:text-gray-600">Política de privacidade</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Payment Form Step
  return (
    <div className="min-h-[100svh] bg-[#f9f9f9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={handleBackClick} className="p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[18px] font-bold text-gray-900">Pagamento</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-bold text-gray-900">Pagamento</h2>
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <CreditCard size={16} className="text-gray-700" />
              <span>Cartão de crédito obrigatório</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[13px] font-semibold text-gray-500 mb-2 block">Número do cartão</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="2048 0348 3409 0348"
                  maxLength={19}
                  className="w-full p-4 bg-gray-50 rounded-xl text-[16px] border-2 border-transparent focus:border-indigo-600 focus:outline-none transition-colors pr-12"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-500" />
              </div>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-gray-500 mb-2 block">Nome do titular</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Kelly Aniston Jade"
                className="w-full p-4 bg-gray-50 rounded-xl text-[16px] border-2 border-transparent focus:border-indigo-600 focus:outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-semibold text-gray-500 mb-2 block">Expira em</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="09/30"
                    maxLength={5}
                    className="w-full p-4 bg-gray-50 rounded-xl text-[16px] border-2 border-transparent focus:border-indigo-600 focus:outline-none transition-colors pr-12"
                  />
                  <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-gray-500 mb-2 block">CVV de 3 dígitos</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0,3))}
                    placeholder="942"
                    maxLength={3}
                    className="w-full p-4 bg-gray-50 rounded-xl text-[16px] border-2 border-transparent focus:border-indigo-600 focus:outline-none transition-colors pr-12"
                  />
                  <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={saveForFuture}
                onChange={(e) => setSaveForFuture(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-[13px] font-semibold text-gray-600">Salvar cartão para o futuro</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="py-2 rounded-lg text-[14px] font-semibold bg-indigo-50 text-indigo-700 text-center">
                Crédito
              </div>
              <div className="py-2 rounded-lg text-[14px] font-semibold bg-gray-100 text-gray-400 text-center">
                Pix indisponível para o teste grátis
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <Clock size={20} className="text-[#22c55e] flex-shrink-0" />
            <p className="text-[13px] text-gray-700">
              Você selecionou o plano <strong>{selectedPlan.name}</strong> com {selectedPlan.trialDays} dias grátis. 
              Após o trial, será cobrado R$ {selectedPlan.price.toFixed(2).replace(".", ",")}{selectedPlan.period}.
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
            <Shield size={20} className="text-blue-500 flex-shrink-0" />
            <p className="text-[13px] text-gray-700">
              Você não será cobrado agora e pode cancelar antes de {trialEndDate}.
            </p>
          </div>
        </div>
      </div>

      {/* Botão Continuar */}
      <div className="px-6 pb-10 pt-4 bg-white border-t border-gray-100">
        <button
          onClick={handleContinueToPayment}
          disabled={
            !cardNumber || !cardExpiry || !cardName || cardCvv.length < 3 || isSubmitting
          }
          className={`w-full py-5 px-8 text-white text-[18px] font-bold rounded-[20px] transition-all duration-300 ${
            cardNumber && cardExpiry && cardName && cardCvv.length === 3 && !isSubmitting
              ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-xl'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Iniciar 7 dias grátis
        </button>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
