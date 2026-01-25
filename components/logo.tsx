import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">H3</span>
      </div>
      <span className="font-bold text-foreground">Harvest 3</span>
    </Link>
  )
}
