import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { CircularLoader } from "@/components/ui/CircularLoader";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { useI18n } from "@/contexts/I18nContext";
import inicialImage from "@/assets/inicial.png";

// Versão do Welcome - deve ser a mesma do SplashPage
const WELCOME_VERSION = "v2";
const WELCOME_STORAGE_KEY = "calc_welcome_seen_version";

export default function Welcome() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  // Log inicial
  useEffect(() => {
    console.log("📍 [Welcome] Componente montado");
    console.log("📍 [Welcome] Welcome version:", WELCOME_VERSION);
    console.log("📍 [Welcome] User:", user ? "logado" : "não logado");
    console.log("📍 [Welcome] Loading:", loading);
    setMounted(true);
  }, [user, loading]);

  // Se usuário já está logado, redirecionar para o app
  useEffect(() => {
    if (user && !loading) {
      console.log("🔄 [Welcome] Usuário logado, verificando perfil...");
      const checkProfile = async () => {
        const { isProfileComplete } = await import("@/lib/userProfile");
        const profileComplete = await isProfileComplete();
        console.log("📍 [Welcome] Perfil completo:", profileComplete);
        if (profileComplete) {
          console.log("✅ [Welcome] Redirecionando para /app/home");
          navigate("/app/home", { replace: true });
        } else {
          console.log("✅ [Welcome] Redirecionando para /auth/profile-setup");
          navigate("/auth/profile-setup", { replace: true });
        }
      };
      checkProfile();
    }
  }, [user, loading, navigate]);

  if (user && !loading) {
    return <CircularLoader />;
  }

  const handleStartQuiz = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("✅ [Welcome] Iniciando Quiz - Navegando para /onboarding/quiz");
    navigate('/onboarding/quiz');
  };

  const handleLogin = () => {
    console.log("✅ [Welcome] Navegando para /auth/login");
    navigate('/auth/login');
  };

  return (
    <div className="min-h-[100svh] h-[100svh] bg-white flex flex-col overflow-hidden">
      {/* Header com seletor de idioma */}
      <div className="pt-6 pb-2 px-6">
        <div className="flex items-center justify-end">
          <LanguageSelector />
        </div>
      </div>

      {/* Conteúdo central */}
      <div className="flex-1 flex flex-col items-center justify-end px-6 pb-6 overflow-hidden">
        {/* Imagem maior, mais colada na lateral e celular no centro */}
        <div 
          className={`relative flex items-end justify-start transition-all duration-600 ease-out w-full ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ 
            transitionDelay: '100ms',
            height: '74vh', // Aumentado um pouco mais
            maxHeight: '74vh',
            marginLeft: '-4rem', // Aumentado mais para a lateral
            width: 'calc(100% + 4rem)',
            marginBottom: '-3rem', // Abaixado para ficar mais perto do texto
            zIndex: 1
          }}
        >
          <img 
            src={inicialImage} 
            alt="Calc" 
            className="w-auto h-full max-w-[680px] object-contain object-left-bottom" 
            style={{ 
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))',
              transform: 'translateX(14%)' // Ajustado para manter o celular centralizado após mover mais para lateral
            }}
          />
        </div>

        {/* Conteúdo de texto - textos um embaixo do outro */}
        <div className="flex flex-col items-center w-full">
          {/* Título principal - estilo do exemplo */}
          <h1 
            className={`text-[28px] md:text-[32px] font-bold text-[#1a1a1a] mb-4 text-center leading-[1.1] transition-all duration-600 ease-out whitespace-pre-line ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ 
              transitionDelay: '300ms',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '-0.02em',
              fontWeight: 800
            }}
          >
            {t("welcome.title")}
          </h1>

          {/* Botão Quiz */}
          <button
            onClick={handleStartQuiz}
            className={`w-full max-w-sm py-4 px-8 text-black text-[16px] font-semibold rounded-xl transition-all duration-300 ease-out active:scale-[0.98] mb-3 shadow-md shadow-[#A3FF3F]/40 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ 
              transitionDelay: '500ms',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              letterSpacing: '0em',
              fontWeight: 600,
              backgroundColor: '#A3FF3F'
            }}
          >
            {t("welcome.startQuiz")}
          </button>

          {/* Link para login */}
          <button
            onClick={handleLogin}
            className={`text-[#1a1a1a] text-[14px] font-semibold transition-all duration-300 ease-out hover:opacity-70 cursor-pointer ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ 
              transitionDelay: '600ms',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 700
            }}
          >
            {t("welcome.alreadyHaveAccount")}
          </button>
        </div>
      </div>
    </div>
  );
}
