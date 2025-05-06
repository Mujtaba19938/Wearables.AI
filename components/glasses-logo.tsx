import { cn } from "@/lib/utils"

interface GlassesLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function GlassesLogo({ className, size = "md", animated = false }: GlassesLogoProps) {
  const sizeMap = {
    sm: "w-8 h-4",
    md: "w-12 h-6",
    lg: "w-20 h-10",
  }

  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], animated && "glasses-animation", className)}
    >
      <g className="glasses">
        {/* Left lens */}
        <circle
          cx="30"
          cy="30"
          r="25"
          stroke="currentColor"
          strokeWidth="5"
          className={cn("text-primary", animated && "lens left-lens")}
        />
        {/* Right lens */}
        <circle
          cx="90"
          cy="30"
          r="25"
          stroke="currentColor"
          strokeWidth="5"
          className={cn("text-primary", animated && "lens right-lens")}
        />
        {/* Bridge */}
        <line
          x1="55"
          y1="30"
          x2="65"
          y2="30"
          stroke="currentColor"
          strokeWidth="5"
          className={cn("text-primary", animated && "bridge")}
        />
        {/* Left temple */}
        <line
          x1="5"
          y1="30"
          x2="15"
          y2="30"
          stroke="currentColor"
          strokeWidth="5"
          className={cn("text-primary", animated && "temple left-temple")}
        />
        {/* Right temple */}
        <line
          x1="105"
          y1="30"
          x2="115"
          y2="30"
          stroke="currentColor"
          strokeWidth="5"
          className={cn("text-primary", animated && "temple right-temple")}
        />
        {/* Left eye */}
        <circle cx="30" cy="30" r="5" fill="currentColor" className={cn("text-primary", animated && "eye left-eye")} />
        {/* Right eye */}
        <circle cx="90" cy="30" r="5" fill="currentColor" className={cn("text-primary", animated && "eye right-eye")} />
      </g>
    </svg>
  )
}
