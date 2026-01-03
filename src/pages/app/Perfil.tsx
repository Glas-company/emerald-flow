import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings, HelpCircle, ChevronRight, LogOut, Pencil, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, saveUserProfile, UserProfile } from "@/lib/userProfile";
import { getUserStats, UserStats } from "@/lib/userStats";
import { getAvatarUrl } from "@/lib/avatarService";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    id: "settings",
    icon: Settings,
    label: "Configurações",
    description: "Preferências do app",
    path: "/app/configuracoes",
  },
  {
    id: "help",
    icon: HelpCircle,
    label: "Ajuda",
    description: "Suporte e FAQ",
    path: "/app/ajuda",
  },
];

export default function Perfil() {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const { profile } = await getUserProfile();
        if (profile) {
          setUserProfile(profile);
          setEditedName(profile.fullName);
        }

        const { stats } = await getUserStats();
        if (stats) {
          setUserStats(stats);
        }

        const avatar = await getAvatarUrl();
        setAvatarUrl(avatar);
      }
    };
    fetchData();
  }, [user]);

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    navigate("/auth/login", { replace: true });
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
    const { error } = await saveUserProfile({ fullName: editedName.trim(), companyName: userProfile?.companyName || "" });
    setIsSavingName(false);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o nome.",
        variant: "destructive",
      });
    } else {
      setUserProfile((prev) => prev ? { ...prev, fullName: editedName.trim() } : null);
      setIsEditingName(false);
      toast({
        title: "Sucesso",
        description: "Nome atualizado com sucesso!",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userProfile?.fullName || "");
    setIsEditingName(false);
  };

  const handleAvatarChange = (newUrl: string | null) => {
    setAvatarUrl(newUrl);
  };

  return (
    <div className="pt-4 pb-8 animate-fade-in">
      {/* Header */}
      <h1 className="text-[20px] font-bold text-[#1a1a1a] mb-6">Meu Perfil</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-4">
          <AvatarPicker
            avatarUrl={avatarUrl}
            onAvatarChange={handleAvatarChange}
            size="lg"
            showControls={true}
          />
        </div>

        {/* Name */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="h-9 text-center font-semibold"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleSaveName}
                disabled={isSavingName}
              >
                <Check size={16} className="text-green-500" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleCancelEdit}
              >
                <X size={16} className="text-red-500" />
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-[#1a1a1a]">
                {userProfile?.fullName || "Usuário"}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Pencil size={14} className="text-gray-400" />
              </button>
            </>
          )}
        </div>

        {/* Company Badge */}
        {userProfile?.companyName && (
          <div className="flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              {userProfile.companyName}
            </span>
          </div>
        )}

        {/* Email */}
        <p className="text-center text-gray-500 text-sm mt-2">
          {user?.email}
        </p>
      </div>

      {/* Stats */}
      {userStats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-[#1a1a1a]">{userStats.totalCalculations}</p>
            <p className="text-sm text-gray-500">Cálculos</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-[#1a1a1a]">{userStats.savedCalculations}</p>
            <p className="text-sm text-gray-500">Salvos</p>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="space-y-2 mb-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Icon size={20} className="text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-medium text-[#1a1a1a]">{item.label}</p>
                  <p className="text-[12px] text-gray-500">{item.description}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full bg-red-50 text-red-600 rounded-xl p-4 flex items-center justify-center gap-2 font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        <LogOut size={20} />
        {isLoggingOut ? "Saindo..." : "Sair da conta"}
      </button>
    </div>
  );
}
