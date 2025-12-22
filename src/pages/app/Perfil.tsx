import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle,
  LogOut,
  ChevronRight,
  Camera,
  User as UserIcon,
  Edit2,
  Building2,
  Plane,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, UserProfile } from "@/lib/userProfile";
import { getUserStats, UserStats } from "@/lib/userStats";
import { uploadUserAvatar, getUserAvatarUrl, updateUserName } from "@/lib/userAvatar";

const menuItems = [
  {
    id: "notifications",
    icon: Bell,
    label: "Notificações",
    description: "Gerenciar alertas",
  },
  {
    id: "security",
    icon: Shield,
    label: "Segurança",
    description: "Senha e privacidade",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Configurações",
    description: "Preferências do app",
  },
  {
    id: "help",
    icon: HelpCircle,
    label: "Ajuda",
    description: "Suporte e FAQ",
  },
];

export default function Perfil() {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // Buscar perfil do usuário
        const { profile } = await getUserProfile();
        if (profile) {
          setUserProfile(profile);
          setEditedName(profile.fullName);
        }

        // Buscar estatísticas do usuário
        const { stats } = await getUserStats();
        if (stats) {
          setUserStats(stats);
        }

        // Buscar avatar
        const avatar = await getUserAvatarUrl();
        if (avatar) {
          setAvatarUrl(avatar);
        }
      }
    };
    fetchData();
  }, [user]);

  const handleMenuClick = (itemId: string) => {
    toast({
      title: "Em breve",
      description: "Esta funcionalidade será implementada em breve.",
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    toast({
      title: "Logout",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/welcome", { replace: true });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    const { url, error } = await uploadUserAvatar(file);

    if (error) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer upload da foto.",
        variant: "destructive",
      });
    } else if (url) {
      setAvatarUrl(url);
      toast({
        title: "Sucesso",
        description: "Foto atualizada com sucesso!",
      });
    }

    setIsUploadingAvatar(false);
    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      toast({
        title: "Erro",
        description: "O nome não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingName(true);
    const { error } = await updateUserName(editedName);

    if (error) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar nome.",
        variant: "destructive",
      });
      setIsSavingName(false);
    } else {
      // Atualizar perfil local
      if (userProfile) {
        setUserProfile({ ...userProfile, fullName: editedName.trim() });
      }
      setIsEditingName(false);
      setIsSavingName(false);
      toast({
        title: "Sucesso",
        description: "Nome atualizado com sucesso!",
      });
    }
  };

  const handleCancelEditName = () => {
    setEditedName(userProfile?.fullName || "");
    setIsEditingName(false);
  };

  // Get user data
  const userEmail = user?.email || "usuario@exemplo.com";
  const userName = userProfile?.fullName || userEmail.split("@")[0] || "Usuário";
  const companyName = userProfile?.companyName || "";
  const drones = userProfile?.drones || "";
  const totalCalculations = userStats?.totalCalculations || 0;
  const savedCalculations = userStats?.savedCalculations || 0;
  const totalHectares = userStats?.totalHectares || 0;

  return (
    <div className="space-y-6 pt-4 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-[20px] font-bold text-[#1a1a1a]">Meu Perfil</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
                  <UserIcon size={40} className="text-white" />
                </div>
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#22c55e] flex items-center justify-center shadow-md hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadingAvatar ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Camera size={14} className="text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Name & Email */}
          <div className="flex flex-col items-center mb-2">
            {isEditingName ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-[18px] font-bold text-[#1a1a1a] text-center border-b-2 border-[#22c55e] focus:outline-none bg-transparent"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  disabled={isSavingName}
                  className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isSavingName ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check size={12} className="text-white" />
                  )}
                </button>
                <button
                  onClick={handleCancelEditName}
                  className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[18px] font-bold text-[#1a1a1a] capitalize">{userName}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Edit2 size={10} className="text-gray-600" />
                </button>
              </div>
            )}
            {companyName && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-200">
                <Building2 size={12} className="text-green-600" />
                <span className="text-[11px] font-medium text-green-700">{companyName}</span>
              </div>
            )}
          </div>
          <p className="text-[13px] text-[#8a8a8a] mb-4">{userEmail}</p>

          {/* Company and Drones Info */}
          {(companyName || drones) && (
            <div className="w-full space-y-3 mb-4 pt-4 border-t border-gray-100">
              {companyName && (
                <div className="flex items-start gap-3 text-gray-700">
                  <Building2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[12px] text-gray-500 mb-0.5">Empresa</p>
                    <p className="text-[13px] font-medium text-[#1a1a1a]">{companyName}</p>
                  </div>
                </div>
              )}
              {drones && (
                <div className="flex items-start gap-3 text-gray-700">
                  <Plane size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[12px] text-gray-500 mb-0.5">Drones utilizados</p>
                    <p className="text-[13px] font-medium text-[#1a1a1a]">{drones}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-8 pt-4 border-t border-gray-100 w-full justify-center">
            <div className="text-center">
              <p className="text-[20px] font-bold text-primary">{totalCalculations}</p>
              <p className="text-[11px] text-[#8a8a8a]">Cálculos</p>
            </div>
            <div className="text-center">
              <p className="text-[20px] font-bold text-primary">{savedCalculations}</p>
              <p className="text-[11px] text-[#8a8a8a]">Salvos</p>
            </div>
            <div className="text-center">
              <p className="text-[20px] font-bold text-primary">{totalHectares.toFixed(1)}</p>
              <p className="text-[11px] text-[#8a8a8a]">Hectares</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors",
                index !== menuItems.length - 1 && "border-b border-gray-100"
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Icon size={20} className="text-[#1a1a1a]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[14px] font-medium text-[#1a1a1a]">{item.label}</p>
                <p className="text-[12px] text-[#8a8a8a]">{item.description}</p>
              </div>
              <ChevronRight size={18} className="text-[#8a8a8a]" />
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 rounded-2xl text-red-600 font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        <LogOut size={18} />
        <span className="text-[14px]">{isLoggingOut ? "Saindo..." : "Sair da conta"}</span>
      </button>

      {/* Version */}
      <p className="text-center text-[11px] text-[#8a8a8a]">
        Calc v1.0.0 • Pulverização Agrícola
      </p>
    </div>
  );
}

