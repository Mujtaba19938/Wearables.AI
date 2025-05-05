import type React from "react"
import { cn } from "@/lib/utils"

interface UICardProps {
  children: React.ReactNode
  className?: string
}

export function UICard({ children, className }: UICardProps) {
  return <div className={cn("bg-card border border-border rounded-xl", className)}>{children}</div>
}

interface UICardContentProps {
  children: React.ReactNode
  className?: string
}

export function UICardContent({ children, className }: UICardContentProps) {
  return <div className={cn("p-4 sm:p-6", className)}>{children}</div>
}

interface UIInnerCardProps {
  children: React.ReactNode
  className?: string
}

export function UIInnerCard({ children, className }: UIInnerCardProps) {
  return <div className={cn("bg-muted p-3 sm:p-4 rounded-lg", className)}>{children}</div>
}
