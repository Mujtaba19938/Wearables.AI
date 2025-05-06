import type { LightbulbIcon as LucideProps } from "lucide-react"

export function Camera3d(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 10h12" />
      <path d="M4 14h9" />
      <path d="M19 6l-3 12a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1l3-12a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1z" />
      <path d="M4 18V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    </svg>
  )
}
