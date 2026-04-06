"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Language = "en" | "es" | "fr" | "de" | "ja" | "pt" | "zh"

type Translations = Record<string, string>

const translations: Record<Language, Translations> = {
  en: {
    createBot: "Create New Bot",
    configureStrategy: "Configure your automated trading strategy",
    backToBots: "Back to Bots",
    botDetails: "Bot Details",
    botName: "Bot Name",
    strategy: "Strategy",

    tradingPair: "Trading Pair",
    selectPair: "Select Pair",
    gridLevels: "Grid Levels",
    gridSpread: "Grid Spread (%)",

    parameters: "Parameters",
    takeProfit: "Take Profit (%)",
    stopLoss: "Stop Loss (%)",
    positionSize: "Position Size (USDT)",
    maxTrades: "Max Active Trades",

    simulationMode: "Simulation Mode",
    runSimulation: "Run in Simulation Mode",
    simulationDesc: "Test your strategy without risking real funds",

    success: "Bot created successfully!",
    redirecting: "Redirecting to bot details...",

    previous: "Previous",
    next: "Next",
    createBotBtn: "Create Bot",

    step: "Step",
    of: "of",

    // strategies
    gridTrading: "Grid Trading",
    gridDesc: "Profit from volatility with grid levels",
    dca: "Dollar Cost Averaging",
    dcaDesc: "Invest fixed amounts at intervals",
    arbitrage: "Arbitrage",
    arbitrageDesc: "Exploit price differences",
    momentum: "Momentum",
    momentumDesc: "Follow market trends",

  },

  fr: {
    createBot: "Créer un bot",
    configureStrategy: "Configurer votre stratégie automatisée",
    backToBots: "Retour aux bots",
    botDetails: "Détails du bot",
    botName: "Nom du bot",
    strategy: "Stratégie",

    tradingPair: "Paire de trading",
    selectPair: "Choisir la paire",
    gridLevels: "Niveaux de grille",
    gridSpread: "Écart (%)",

    parameters: "Paramètres",
    takeProfit: "Take Profit (%)",
    stopLoss: "Stop Loss (%)",
    positionSize: "Taille (USDT)",
    maxTrades: "Trades max actifs",

    simulationMode: "Mode simulation",
    runSimulation: "Activer la simulation",
    simulationDesc: "Tester sans risquer de vrais fonds",

    success: "Bot créé avec succès !",
    redirecting: "Redirection...",

    previous: "Précédent",
    next: "Suivant",
    createBotBtn: "Créer le bot",

    step: "Étape",
    of: "sur",

    gridTrading: "Trading en grille",
    gridDesc: "Profiter de la volatilité",
    dca: "Achat périodique",
    dcaDesc: "Investir à intervalles réguliers",
    arbitrage: "Arbitrage",
    arbitrageDesc: "Exploiter les différences de prix",
    momentum: "Momentum",
    momentumDesc: "Suivre la tendance",
  },

  // fallback languages (reuse EN for now)
  es: {} as any,
  de: {} as any,
  ja: {} as any,
  pt: {} as any,
  zh: {} as any,
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => { },
  t: translations.en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved) setLanguageState(saved)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    window.dispatchEvent(new StorageEvent("storage", { key: "language", newValue: lang }))
  }

  const t = translations[language] || translations.en

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
