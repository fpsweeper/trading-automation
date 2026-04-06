"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const translations = {
  en: {
    company: "Harvest 3",
    description: "Build and deploy automated trading bots using DCA, Grid, and Scalping strategies on real market data.",
    platform: "Platform",
    platformLinks: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Bots", href: "/bots" },
      { label: "Wallet", href: "/wallet" },
    ],
    legal: "Legal",
    legalLinks: [
      { label: "Terms of Service", href: "/terms-privacy" },
      { label: "Privacy Policy", href: "/terms-privacy" },
      { label: "Risk Disclaimer", href: "/#disclaimer" },
    ],
    account: "Account",
    accountLinks: [
      { label: "Sign Up", href: "/register" },
      { label: "Sign In", href: "/login" },
      { label: "Profile", href: "/profile" },
    ],
    copyright: "© 2026 Harvest 3. All rights reserved.",
  },
  fr: {
    company: "Harvest 3",
    description: "Créez et déployez des bots de trading automatisés avec des stratégies DCA, Grid et Scalping sur des données de marché réelles.",
    platform: "Plateforme",
    platformLinks: [
      { label: "Tableau de bord", href: "/dashboard" },
      { label: "Mes Bots", href: "/bots" },
      { label: "Portefeuille", href: "/wallet" },
    ],
    legal: "Légal",
    legalLinks: [
      { label: "Conditions d'utilisation", href: "/terms-privacy" },
      { label: "Politique de confidentialité", href: "/terms-privacy" },
      { label: "Avertissement sur les risques", href: "/#disclaimer" },
    ],
    account: "Compte",
    accountLinks: [
      { label: "Créer un compte", href: "/register" },
      { label: "Se connecter", href: "/login" },
      { label: "Profil", href: "/profile" },
    ],
    copyright: "© 2026 Harvest 3. Tous droits réservés.",
  },
  es: {
    company: "Harvest 3",
    description: "Crea y despliega bots de trading automatizados con estrategias DCA, Grid y Scalping en datos de mercado reales.",
    platform: "Plataforma",
    platformLinks: [
      { label: "Panel", href: "/dashboard" },
      { label: "Mis Bots", href: "/bots" },
      { label: "Cartera", href: "/wallet" },
    ],
    legal: "Legal",
    legalLinks: [
      { label: "Términos de servicio", href: "/terms-privacy" },
      { label: "Política de privacidad", href: "/terms-privacy" },
      { label: "Aviso de riesgo", href: "/#disclaimer" },
    ],
    account: "Cuenta",
    accountLinks: [
      { label: "Registrarse", href: "/register" },
      { label: "Iniciar sesión", href: "/login" },
      { label: "Perfil", href: "/profile" },
    ],
    copyright: "© 2026 Harvest 3. Todos los derechos reservados.",
  },
  de: {
    company: "Harvest 3",
    description: "Erstellen und betreiben Sie automatisierte Trading-Bots mit DCA-, Grid- und Scalping-Strategien auf echten Marktdaten.",
    platform: "Plattform",
    platformLinks: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Meine Bots", href: "/bots" },
      { label: "Wallet", href: "/wallet" },
    ],
    legal: "Rechtliches",
    legalLinks: [
      { label: "Nutzungsbedingungen", href: "/terms-privacy" },
      { label: "Datenschutzrichtlinie", href: "/terms-privacy" },
      { label: "Risikohinweis", href: "/#disclaimer" },
    ],
    account: "Konto",
    accountLinks: [
      { label: "Registrieren", href: "/register" },
      { label: "Anmelden", href: "/login" },
      { label: "Profil", href: "/profile" },
    ],
    copyright: "© 2026 Harvest 3. Alle Rechte vorbehalten.",
  },
  ja: {
    company: "Harvest 3",
    description: "DCA、グリッド、スキャルピング戦略を使用して、リアルな市場データで自動取引ボットを作成・展開します。",
    platform: "プラットフォーム",
    platformLinks: [
      { label: "ダッシュボード", href: "/dashboard" },
      { label: "マイボット", href: "/bots" },
      { label: "ウォレット", href: "/wallet" },
    ],
    legal: "法務",
    legalLinks: [
      { label: "利用規約", href: "/terms-privacy" },
      { label: "プライバシー", href: "/terms-privacy" },
      { label: "リスク免責", href: "/#disclaimer" },
    ],
    account: "アカウント",
    accountLinks: [
      { label: "新規登録", href: "/register" },
      { label: "ログイン", href: "/login" },
      { label: "プロフィール", href: "/profile" },
    ],
    copyright: "© 2026 Harvest 3. すべての権利予約済み。",
  },
  pt: {
    company: "Harvest 3",
    description: "Crie e implante bots de trading automatizados com estratégias DCA, Grid e Scalping em dados de mercado reais.",
    platform: "Plataforma",
    platformLinks: [
      { label: "Painel", href: "/dashboard" },
      { label: "Meus Bots", href: "/bots" },
      { label: "Carteira", href: "/wallet" },
    ],
    legal: "Legal",
    legalLinks: [
      { label: "Termos de Serviço", href: "/terms-privacy" },
      { label: "Política de Privacidade", href: "/terms-privacy" },
      { label: "Aviso de Risco", href: "/#disclaimer" },
    ],
    account: "Conta",
    accountLinks: [
      { label: "Cadastrar", href: "/register" },
      { label: "Entrar", href: "/login" },
      { label: "Perfil", href: "/profile" },
    ],
    copyright: "© 2026 Harvest 3. Todos os direitos reservados.",
  },
  zh: {
    company: "Harvest 3",
    description: "使用DCA、网格和剥头皮策略在真实市场数据上创建和部署自动交易机器人。",
    platform: "平台",
    platformLinks: [
      { label: "仪表板", href: "/dashboard" },
      { label: "我的机器人", href: "/bots" },
      { label: "钱包", href: "/wallet" },
    ],
    legal: "法律",
    legalLinks: [
      { label: "服务条款", href: "/terms-privacy" },
      { label: "隐私政策", href: "/terms-privacy" },
      { label: "风险免责", href: "/#disclaimer" },
    ],
    account: "账户",
    accountLinks: [
      { label: "注册", href: "/register" },
      { label: "登录", href: "/login" },
      { label: "个人资料", href: "/profile" },
    ],
    copyright: "© 2026 Harvest 3. 版权所有。",
  },
}

export default function Footer() {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en"
    setLanguage(savedLang)
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem("language") || "en")
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/icon.svg" width="40" height="40" alt="Harvest 3" />
              <span className="font-bold text-lg">{t.company}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t.platform}</h4>
            <ul className="space-y-2">
              {t.platformLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t.account}</h4>
            <ul className="space-y-2">
              {t.accountLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t.legal}</h4>
            <ul className="space-y-2">
              {t.legalLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground text-center">{t.copyright}</p>
        </div>
      </div>
    </footer>
  )
}