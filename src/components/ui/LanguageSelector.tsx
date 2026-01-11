import { Globe } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import bandeiraBrasil from "@/assets/bandeira brasil.png";
import bandeiraEUA from "@/assets/EUA.png";
import bandeiraEspanha from "@/assets/ES.png";

const languages = [
  { code: "pt" as const, name: "PT", flag: bandeiraBrasil },
  { code: "en" as const, name: "EN", flag: bandeiraEUA },
  { code: "es" as const, name: "ES", flag: bandeiraEspanha },
];

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();
  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-auto h-10 px-3 gap-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-full"
        >
          <img src={currentLang.flag} alt={currentLang.name} className="w-5 h-5 object-cover rounded" />
          <span className="text-sm font-medium text-gray-700">{currentLang.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              language === lang.code ? "bg-primary/10 text-primary font-semibold" : ""
            }`}
          >
            <img src={lang.flag} alt={lang.name} className="w-5 h-5 object-cover rounded" />
            <span>{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
