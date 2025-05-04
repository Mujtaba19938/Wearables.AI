"use client"

import { Logo } from "./logo"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Guide",
      href: "/guide",
    },
    {
      name: "Frames",
      href: "/frames",
    },
    {
      name: "About",
      href: "/about",
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo className="mr-8" />

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground" : "text-foreground/60",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link href="/analyzer">
            <Button>Try Now</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
