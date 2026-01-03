import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BouncingBallsLoader } from "@/components/ui/BouncingBallsLoader";
import { isProfileComplete } from "@/lib/userProfile";

/**
 * Página de loading que aparece após login
 * Mostra animação de splash e redireciona para o app ou onboarding
 */
export default function LoadingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Safety timeout - nunca ficar nesta página por mais de 3 segundos
    const safetyTimeout = setTimeout(() => {
      console.warn("⚠️ [LoadingPage] Safety timeout - redirecting to home");
      if (!hasRedirected) {
        setHasRedirected(true);
        if (user) {
          navigate("/app/home", { replace: true });
        } else {
          navigate("/auth/login", { replace: true });
        }
      }
    }, 3000);

    return () => clearTimeout(safetyTimeout);
  }, [user, navigate, hasRedirected]);

  useEffect(() => {
    // Se já redirecionou, não fazer nada
    if (hasRedirected) return;

    // Se ainda está carregando auth, aguardar (mas safety timeout cuida)
    if (loading) return;

    const doRedirect = async () => {
      // Pequeno delay para mostrar o loader
      await new Promise(resolve => setTimeout(resolve, 800));

      if (hasRedirected) return;
      setHasRedirected(true);

      // Se não tem usuário, redirecionar para login
      if (!user) {
        navigate("/auth/login", { replace: true });
        return;
      }

      // Se tem usuário, verificar perfil e redirecionar
      try {
        const profileComplete = await isProfileComplete();
        if (profileComplete) {
          navigate("/app/home", { replace: true });
        } else {
          navigate("/auth/profile-setup", { replace: true });
        }
      } catch (error) {
        console.error("❌ [LoadingPage] Error checking profile:", error);
        navigate("/app/home", { replace: true });
      }
    };

    doRedirect();
  }, [user, loading, navigate, hasRedirected]);

  return <BouncingBallsLoader />;
}
