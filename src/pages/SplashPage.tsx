import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function SplashPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const hasRedirected = useRef(false);
  const [progress, setProgress] = useState(0);

  // Animação de progresso
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        // Acelera no final
        const increment = prev < 70 ? 3 : prev < 90 ? 5 : 10;
        return Math.min(100, prev + increment);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Redirecionamento garantido
  useEffect(() => {
    // Safety timeout: SEMPRE redireciona após 2.5 segundos
    const safetyTimer = setTimeout(() => {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        if (user) {
          navigate("/app/home", { replace: true });
        } else {
          navigate("/auth/login", { replace: true });
        }
      }
    }, 2500);

    return () => clearTimeout(safetyTimer);
  }, [navigate, user]);

  // Redireciona quando loading terminar E progresso chegar a 100%
  useEffect(() => {
    if (loading || hasRedirected.current || progress < 100) return;

    hasRedirected.current = true;
    if (user) {
      navigate("/app/home", { replace: true });
    } else {
      navigate("/auth/login", { replace: true });
    }
  }, [navigate, user, loading, progress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#15803d] flex flex-col items-center justify-center">
      {/* Logo container */}
      <div className="w-24 h-24 bg-white rounded-[28px] flex items-center justify-center shadow-2xl mb-8 relative">
        {/* Spinner animado ao redor do logo */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          style={{ animationDuration: "2s" }}
          viewBox="0 0 96 96"
        >
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="rgba(34, 197, 94, 0.2)"
            strokeWidth="4"
          />
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="70 206"
          />
        </svg>
        
        {/* Ícone interno */}
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="#22c55e"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="#16a34a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Nome do app */}
      <h1 className="text-white text-3xl font-bold tracking-tight mb-2">Calc</h1>
      <p className="text-white/70 text-sm mb-8">Pulverização Inteligente</p>

      {/* Barra de progresso */}
      <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Texto de loading */}
      <p className="text-white/60 text-xs mt-4">
        {progress < 100 ? "Carregando..." : "Pronto!"}
      </p>
    </div>
  );
}
