import { cn } from "@/lib/utils"
import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
  textClassName?: string
}

export function Logo({ className, size = "md", showText = true, textClassName }: LogoProps) {
  // Size mappings
  const sizes = {
    sm: {
      container: "h-6 sm:h-8",
      svg: "w-6 h-6 sm:w-8 sm:h-8",
      text: "text-base sm:text-lg ml-1.5 sm:ml-2",
    },
    md: {
      container: "h-8 sm:h-10",
      svg: "w-8 h-8 sm:w-10 sm:h-10",
      text: "text-lg sm:text-xl ml-2 sm:ml-2.5",
    },
    lg: {
      container: "h-10 sm:h-12",
      svg: "w-10 h-10 sm:w-12 sm:h-12",
      text: "text-xl sm:text-2xl ml-2.5 sm:ml-3",
    },
  }

  return (
    <Link href="/" className={cn("flex items-center", sizes[size].container, className)}>
      <div className="relative">
        <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(sizes[size].svg)}>
          {/* Left lens */}
          <circle cx="35" cy="30" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" />

          {/* Right lens */}
          <circle cx="85" cy="30" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" />

          {/* Bridge */}
          <path d="M55 30 H65" stroke="currentColor" strokeWidth="3" />

          {/* Temple arms */}
          <path d="M15 30 H25" stroke="currentColor" strokeWidth="3" />
          <path d="M95 30 H105" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>

      {showText && (
        <span className={cn("font-bold tracking-tight", sizes[size].text, textClassName)}>wearables.ai</span>
      )}
    </Link>
  )
}
