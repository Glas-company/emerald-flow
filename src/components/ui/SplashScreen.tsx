import { Logo } from "@/components/Logo";

/**
 * Tela de carregamento minimalista estilo iOS/Android
 * Duração visual: pelo menos 4 segundos
 */
export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-[#6ee7b7] flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Card branco com loader */}
        <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-xl">
          {/* Loader ring SVG minimalista */}
          <svg
            className="animate-spin-slow"
            style={{ animationDuration: "1.8s" }}
            width="56"
            height="56"
            viewBox="0 0 56 56"
          >
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="#e0f7ef"
              strokeWidth="6"
            />
            {/* Gradiente animado */}
            <defs>
              <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="url(#loaderGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="108"
              strokeDashoffset="32"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
