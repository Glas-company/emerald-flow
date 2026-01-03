import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";
import droneIcon from "@/assets/tela.png";

export default function Welcome() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Se usuário já está logado, redirecionar para o app
  useEffect(() => {
    if (user && !loading) {
      const checkProfile = async () => {
        const { isProfileComplete } = await import("@/lib/userProfile");
        const profileComplete = await isProfileComplete();
        if (profileComplete) {
          navigate("/app/home", { replace: true });
        } else {
          navigate("/auth/profile-setup", { replace: true });
        }
      };
      checkProfile();
    }
  }, [user, loading, navigate]);

  if (user) {
    return <SplashScreen />;
  }

  const handleContinue = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header com indicador de progresso */}
      <div className="pt-12 pb-6 px-6">
        {/* Indicador de progresso */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-1 bg-[#22c55e] rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Conteúdo central */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Ícone grande centralizado */}
        <div 
          className={`mb-12 transition-all duration-600 ease-out ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <img 
            src={droneIcon} 
            alt="Calc" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain"
            style={{ 
              filter: 'brightness(0) saturate(100%)',
              opacity: 0.9
            }}
          />
        </div>

        {/* Título */}
        <h1 
          className={`text-3xl md:text-4xl font-semibold text-[#1D1D1F] mb-4 text-center transition-all duration-600 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ 
            transitionDelay: '200ms',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
            letterSpacing: '-0.02em',
            fontWeight: 600
          }}
        >
          Bem-vindo ao Calc
        </h1>

        {/* Texto descritivo */}
        <p 
          className={`text-base text-[#6E6E73] text-center max-w-sm mb-16 leading-relaxed transition-all duration-600 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ 
            transitionDelay: '400ms',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
            fontWeight: 400
          }}
        >
          Simplifique seus cálculos agrícolas com tecnologia de ponta e precisão.
        </p>

        {/* Botão Continue */}
        <button
          onClick={handleContinue}
          className={`w-full max-w-sm py-4 px-8 bg-[#22c55e] hover:bg-[#16a34a] text-white text-base font-semibold rounded-full transition-all duration-300 ease-out active:scale-[0.98] ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ 
            transitionDelay: '600ms',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
            letterSpacing: '0.01em',
            fontWeight: 600
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
