import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ChevronLeft, AlertCircle, CheckCircle, Building2, Plane, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { user, loading, signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [drone, setDrone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && !loading) {
      navigate("/app/home", { replace: true });
    }
  }, [user, loading, navigate]);

  const validateForm = (): string | null => {
    if (!fullName.trim()) return "Informe seu nome";
    if (!company.trim()) return "Informe o nome da empresa";
    if (!email.trim()) return "Digite seu e-mail";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "E-mail inválido";
    if (!password) return "Digite sua senha";
    if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres";
    if (password !== confirmPassword) return "As senhas não coincidem";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSubmitting(true);
    
    console.log("🔄 [Register] Criando conta com perfil...");
    
    // Criar conta com dados do perfil incluídos
    const { error } = await signUp(email, password, {
      fullName: fullName.trim(),
      companyName: company.trim(),
      drones: drone.trim() || undefined,
    });
    
    if (error) {
      console.error("❌ [Register] Erro ao criar conta:", error);
      setError(error.message.includes("already registered") ? "Este e-mail já está cadastrado" : error.message);
      setIsSubmitting(false);
    } else {
      // Conta criada com sucesso - redirecionar para login
      console.log("✅ [Register] Conta criada com perfil completo!");
      setSuccess(true);
      setIsSubmitting(false);
      
      // Redirecionar para login após 1.5 segundos
      setTimeout(() => {
        console.log("✅ [Register] Redirecionando para login...");
        navigate("/auth/login", { replace: true });
      }, 1500);
    }
  };

  const handleBack = () => {
    navigate("/welcome", { replace: true });
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] flex flex-col bg-black text-white"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex-1 w-full overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center py-10 px-6">
          <div className="w-full max-w-sm relative">
          <button
            type="button"
            onClick={handleBack}
            className="absolute -top-12 left-0 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            className={`space-y-1 mb-6 text-center transition-all duration-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
            <p className="text-sm text-gray-400">Preencha os campos para começar</p>
          </div>

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-100">
              <CheckCircle size={18} />
              <span>Conta criada! Faça login para continuar...</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div
              className={`space-y-1.5 transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-200">
                <User size={16} className="text-gray-500" />
                Seu Nome *
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                disabled={isSubmitting || success}
                autoComplete="name"
                placeholder="Ex: João Silva"
                className="h-11 w-full rounded-full border-0 bg-[#111111] px-4 text-sm text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#A3FF3F]"
              />
            </div>

            <div
              className={`space-y-1.5 transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "260ms" }}
            >
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-200">
                <Building2 size={16} className="text-gray-500" />
                Nome da Empresa *
              </label>
              <Input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                disabled={isSubmitting || success}
                autoComplete="organization"
                placeholder="Ex: Fazenda Boa Colheita"
                className="h-11 w-full rounded-full border-0 bg-[#111111] px-4 text-sm text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#A3FF3F]"
              />
            </div>

            <div
              className={`space-y-1.5 transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "320ms" }}
            >
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-200">
                <Plane size={16} className="text-gray-500" />
                Drone(s) utilizado(s)
                <span className="text-xs font-normal text-gray-500">(Opcional)</span>
              </label>
              <Input
                type="text"
                value={drone}
                onChange={e => setDrone(e.target.value)}
                disabled={isSubmitting || success}
                autoComplete="off"
                placeholder="Ex: DJI AGRAS, XAG, etc."
                className="h-11 w-full rounded-full border-0 bg-[#111111] px-4 text-sm text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#A3FF3F]"
              />
            </div>

            <div
              className={`space-y-1.5 transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "380ms" }}
            >
              <label className="block text-sm font-medium text-gray-200">Email</label>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input
                  type="email"
                  value={email}
                  disabled={isSubmitting || success}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className="h-11 w-full rounded-full border-0 bg-[#111111] pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#A3FF3F]"
                />
              </div>
            </div>

            <div
              className={`space-y-1.5 transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "440ms" }}
            >
              <label className="block text-sm font-medium text-gray-200">Senha</label>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isSubmitting || success}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="min. 6 caracteres"
                  className="h-11 w-full rounded-full border-0 bg-[#111111] pl-11 pr-11 text-sm text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#A3FF3F]"
                />
                <button
                  tabIndex={-1}
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-200 transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Mostrar senha"
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
            </div>

            <div
              className={`space-y-1.5 transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <label className="block text-sm font-medium text-gray-200">Confirmar senha</label>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  disabled={isSubmitting || success}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Repita a senha"
                  className="h-11 w-full rounded-full border-0 bg-[#111111] pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#A3FF3F]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || success}
              size="lg"
              className={`mt-2 w-full rounded-full text-base font-semibold text-black shadow-md shadow-[#A3FF3F]/40 transition-all active:scale-[0.98] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } ${isSubmitting ? "bg-[#86D935] hover:bg-[#86D935]" : "bg-[#A3FF3F] hover:bg-[#93F039]"}`}
            >
              {isSubmitting ? "Criando..." : "Criar conta"}
            </Button>
          </form>

          <div
            className={`mt-6 text-center text-sm transition-all duration-500 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <span className="text-gray-500">Já tem conta? </span>
            <Link 
              to="/auth/login" 
              className="font-semibold text-[#8DFD44] hover:underline"
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
