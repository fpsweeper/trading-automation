"use client"

import { useState, useEffect } from "react"

const translations = {
  en: {
    company: "Harvest 3",
    product: "Product",
    company_nav: "Company",
    legal: "Legal",
    productLinks: ["Features", "Pricing", "API", "Security"],
    companyLinks: ["About", "Blog", "Careers", "Contact"],
    legalLinks: ["Privacy", "Terms", "Disclaimer", "Compliance"],
    copyright: "© 2026 Harvest 3. All rights reserved.",
  },
  es: {
    company: "Harvest 3",
    product: "Producto",
    company_nav: "Empresa",
    legal: "Legal",
    productLinks: ["Características", "Precios", "API", "Seguridad"],
    companyLinks: ["Acerca de", "Blog", "Carreras", "Contacto"],
    legalLinks: ["Privacidad", "Términos", "Aviso Legal", "Cumplimiento"],
    copyright: "© 2026 Harvest 3. Todos los derechos reservados.",
  },
  fr: {
    company: "Harvest 3",
    product: "Produit",
    company_nav: "Entreprise",
    legal: "Légal",
    productLinks: ["Fonctionnalités", "Tarification", "API", "Sécurité"],
    companyLinks: ["À propos", "Blog", "Carrières", "Contact"],
    legalLinks: ["Confidentialité", "Conditions", "Avis", "Conformité"],
    copyright: "© 2026 Harvest 3. Tous droits réservés.",
  },
  de: {
    company: "Harvest 3",
    product: "Produkt",
    company_nav: "Unternehmen",
    legal: "Recht",
    productLinks: ["Funktionen", "Preisgestaltung", "API", "Sicherheit"],
    companyLinks: ["Über", "Blog", "Karriere", "Kontakt"],
    legalLinks: ["Datenschutz", "Bedingungen", "Haftungsausschluss", "Compliance"],
    copyright: "© 2026 Harvest 3. Alle Rechte vorbehalten.",
  },
  ja: {
    company: "Harvest 3",
    product: "製品",
    company_nav: "企業",
    legal: "法務",
    productLinks: ["機能", "価格", "API", "セキュリティ"],
    companyLinks: ["について", "ブログ", "キャリア", "お問い合わせ"],
    legalLinks: ["プライバシー", "利用規約", "免責事項", "コンプライアンス"],
    copyright: "© 2026 Harvest 3. すべての権利予約済み。",
  },
  pt: {
    company: "Harvest 3",
    product: "Produto",
    company_nav: "Empresa",
    legal: "Legal",
    productLinks: ["Recursos", "Preços", "API", "Segurança"],
    companyLinks: ["Sobre", "Blog", "Carreiras", "Contato"],
    legalLinks: ["Privacidade", "Termos", "Aviso Legal", "Conformidade"],
    copyright: "© 2026 Harvest 3. Todos os direitos reservados.",
  },
  zh: {
    company: "Harvest 3",
    product: "产品",
    company_nav: "公司",
    legal: "法律",
    productLinks: ["功能", "价格", "API", "安全"],
    companyLinks: ["关于", "博客", "职业生涯", "联系"],
    legalLinks: ["隐私", "条款", "免责声明", "合规性"],
    copyright: "© 2026 Harvest 3. 版权所有。",
  },
}

export default function Footer() {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en"
    setLanguage(savedLang)
    const handleStorageChange = () => {
      const lang = localStorage.getItem("language") || "en"
      setLanguage(lang)
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
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">H3</span>
              </div>
              <span className="font-bold text-lg">{t.company}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Automate your trading strategy with advanced tools and AI-powered insights.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t.product}</h4>
            <ul className="space-y-2">
              {t.productLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t.company_nav}</h4>
            <ul className="space-y-2">
              {t.companyLinks.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t.legal}</h4>
            <ul className="space-y-2">
              <li>
                <a href="/terms-privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t.legalLinks[0]}
                </a>
              </li>
              <li>
                <a href="/terms-privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t.legalLinks[1]}
                </a>
              </li>
              {t.legalLinks.slice(2).map((link, idx) => (
                <li key={idx + 2}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground text-center">{t.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
