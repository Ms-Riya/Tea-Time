import { cn } from "@/lib/utils";

interface RibbonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "pink" | "lavender" | "peach" | "mint";
  size?: "sm" | "md" | "lg";
}

export function Ribbon({
  children,
  className,
  variant = "pink",
  size = "md",
}: RibbonProps) {
  const baseStyles = "relative inline-block font-medium text-white shadow-lg";

  const variantStyles = {
    pink: "bg-gradient-to-r from-munchkin-pink-400 to-munchkin-pink-500",
    lavender: "bg-gradient-to-r from-munchkin-pastel-lavender to-purple-400",
    peach: "bg-gradient-to-r from-munchkin-pastel-peach to-orange-300",
    mint: "bg-gradient-to-r from-munchkin-pastel-mint to-green-300",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {/* Left ribbon fold */}
      <div className="absolute left-0 top-0 w-0 h-0 border-l-[8px] border-l-transparent border-b-[100%] border-b-black/20 -translate-x-2"></div>

      {/* Right ribbon fold */}
      <div className="absolute right-0 top-0 w-0 h-0 border-r-[8px] border-r-transparent border-b-[100%] border-b-black/20 translate-x-2"></div>

      {/* Ribbon content */}
      <span className="relative z-10">{children}</span>

      {/* Bottom ribbon points */}
      <div className="absolute left-0 bottom-0 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-black/30 -translate-x-2 translate-y-2"></div>
      <div className="absolute right-0 bottom-0 w-0 h-0 border-r-[6px] border-r-transparent border-t-[8px] border-t-black/30 translate-x-2 translate-y-2"></div>
    </div>
  );
}
