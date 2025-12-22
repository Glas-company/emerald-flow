import logoCalc from "@/assets/logo-calc.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

const sizeMap = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

export function Logo({ size = "md", className = "", showText = false }: LogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={logoCalc} 
        alt="Calc Logo" 
        className={`${sizeMap[size]} object-contain`}
      />
    </div>
  );
}
