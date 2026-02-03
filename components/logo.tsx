import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "gradient" | "minimal" | "icon-only"
  className?: string
  showText?: boolean
}

export function Logo({
  size = "md",
  variant = "default",
  className,
  showText = true
}: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-sm" },
    md: { icon: 32, text: "text-base" },
    lg: { icon: 40, text: "text-lg" },
    xl: { icon: 48, text: "text-xl" },
  }

  const sizeConfig = sizes[size]

  if (variant === "default") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <svg
          width={sizeConfig.icon}
          height={sizeConfig.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#008793" />
              <stop offset="50%" stopColor="#05C3B8" />
              <stop offset="100%" stopColor="#A8EB12" />
            </linearGradient>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0FFE0" />
            </linearGradient>
          </defs>

          <rect
            x="5"
            y="5"
            width="90"
            height="90"
            rx="20"
            fill="url(#logoGradient)"
          />

          <rect x="20" y="25" width="8" height="50" fill="url(#textGradient)" rx="2" />

          <rect x="42" y="25" width="8" height="50" fill="url(#textGradient)" rx="2" />

          <rect x="20" y="47" width="30" height="6" fill="url(#textGradient)" rx="2" />

          <path
            d="M 60 30 Q 75 30 75 42 Q 75 47 70 49 Q 75 51 75 58 Q 75 70 60 70 L 58 70 L 58 64 L 60 64 Q 68 64 68 58 Q 68 52 60 52 L 58 52 L 58 46 L 60 46 Q 68 46 68 42 Q 68 36 60 36 L 58 36 L 58 30 Z"
            fill="url(#textGradient)"
          />

          <circle cx="15" cy="15" r="3" fill="#A8EB12" opacity="0.6" />
          <circle cx="85" cy="85" r="3" fill="#A8EB12" opacity="0.6" />
        </svg>

        {showText && (
          <span className={cn(
            "font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent",
            sizeConfig.text
          )}>
            Harvest 3
          </span>
        )}
      </div>
    )
  }

  if (variant === "gradient") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <svg
          width={sizeConfig.icon}
          height={sizeConfig.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#051937" />
              <stop offset="50%" stopColor="#008793" />
              <stop offset="100%" stopColor="#A8EB12" />
            </linearGradient>
          </defs>

          <path
            d="M 50 5 L 90 27.5 L 90 72.5 L 50 95 L 10 72.5 L 10 27.5 Z"
            fill="url(#growthGradient)"
          />

          <path
            d="M 30 60 L 40 50 L 50 55 L 60 40 L 70 45"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          <path
            d="M 70 45 L 65 50 M 70 45 L 75 50"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <text
            x="50"
            y="80"
            textAnchor="middle"
            fill="white"
            fontSize="20"
            fontWeight="bold"
            fontFamily="system-ui"
          >
            H3
          </text>
        </svg>

        {showText && (
          <span className={cn(
            "font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent",
            sizeConfig.text
          )}>
            Harvest 3
          </span>
        )}
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <svg
          width={sizeConfig.icon}
          height={sizeConfig.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#008793" />
              <stop offset="100%" stopColor="#A8EB12" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="45" fill="url(#minimalGradient)" />

          <text
            x="50"
            y="63"
            textAnchor="middle"
            fill="white"
            fontSize="36"
            fontWeight="bold"
            fontFamily="system-ui"
          >
            H3
          </text>

          <rect x="25" y="70" width="50" height="3" rx="1.5" fill="white" opacity="0.8" />
        </svg>

        {showText && (
          <span className={cn(
            "font-bold tracking-tight",
            sizeConfig.text
          )}>
            Harvest 3
          </span>
        )}
      </div>
    )
  }

  return (
    <svg
      width={sizeConfig.icon}
      height={sizeConfig.icon}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#008793" />
          <stop offset="50%" stopColor="#05C3B8" />
          <stop offset="100%" stopColor="#A8EB12" />
        </linearGradient>
      </defs>

      <rect width="100" height="100" rx="22" fill="url(#iconGradient)" />

      <rect x="18" y="25" width="10" height="50" fill="white" rx="3" />
      <rect x="42" y="25" width="10" height="50" fill="white" rx="3" />
      <rect x="18" y="47" width="34" height="8" fill="white" rx="3" />

      <path
        d="M 62 30 Q 80 30 80 42 Q 80 48 74 50 Q 80 52 80 60 Q 80 72 62 72 L 60 72 L 60 64 L 62 64 Q 72 64 72 60 Q 72 52 62 52 L 60 52 L 60 44 L 62 44 Q 72 44 72 42 Q 72 36 62 36 L 60 36 L 60 30 Z"
        fill="white"
      />
    </svg>
  )
}