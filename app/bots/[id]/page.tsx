"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import {
  ArrowLeft, Play, Pause, Square, Activity, Loader2, RefreshCw, BarChart2,
  Trash2,
  Shield, ChevronLeft, ChevronRight, AlertCircle, Settings2, Pencil,
  Check, ChevronsUpDown, Plus, X, MoreVertical
} from "lucide-react"
import { triggerNotificationRefresh } from "@/lib/notifyRefresh"
import { useLanguage } from "@/contexts/LanguageContext"

// ─── Translations ───────────────────────────────────────────────────────────

const translations = {
  en: {
    backToBots: "Back to Bots",
    refresh: "Refresh", edit: "Edit", start: "Start", pause: "Pause", stop: "Stop", delete: "Delete",
    deleteConfirm: "Delete this bot? All trade history will be permanently lost. This cannot be undone.",
    pauseFirst: "Pause before editing", pauseFirst2: "Pause first",
    editConfig: "Edit Config", startBot: "Start Bot", pauseBot: "Pause Bot", stopBot: "Stop Bot", deleteBot: "Delete Bot",
    balance: "Balance", init: "Init", totalPnl: "Total P&L", winRate: "Win Rate",
    trades: "Trades", open: "open", noTrades: "No trades",
    overview: "overview", tradesTab: "trades", positionsTab: "positions",
    noPriceData: "No price data",
    bull: "Bull", bear: "Bear", buy: "Buy", sell: "Sell",
    noSnapshots: "No snapshots yet — taken hourly",
    equityCurve: "Equity Curve", hourlySnapshots: "Hourly balance snapshots",
    performance: "Performance", configuration: "Configuration",
    indicatorConditions: "Indicator Conditions",
    entryConditions: "Entry Conditions", exitConditions: "Exit Conditions",
    defaultStrategyLogic: "Default strategy logic", slTpOnly: "SL/TP only",
    realizedPnl: "Realized P&L", unrealizedPnl: "Unrealized P&L",
    avgWin: "Avg Win", avgLoss: "Avg Loss", bestTrade: "Best Trade", worstTrade: "Worst Trade",
    openPositionsValue: "Open Positions Value", noStats: "No stats yet",
    strategy: "Strategy", pair: "Pair", timeframe: "Timeframe", initialBal: "Initial Bal",
    stopLoss: "Stop Loss", takeProfit: "Take Profit", maxPosition: "Max Position",
    pointsPerTrade: "Points/Trade", lastRun: "Last Run", nextRun: "Next Run",
    indicatorSnapshot: "Indicator Snapshot at Trade Execution",
    noTradesYet: "No trades yet", noOpenPositions: "No open positions",
    pageOf: "Page", of: "of",
    type: "Type", symbol: "Symbol", amount: "Amount", price: "Price",
    total: "Total", fees: "Fees", time: "Time",
    quantity: "Quantity", entryPrice: "Entry Price", currentPrice: "Current Price",
    entryValue: "Entry Value", currentValue: "Current Value", unrealizedPnlCol: "Unrealized P&L", opened: "Opened",
    // Edit modal
    editBot: "Edit Bot", stepOf: "Step", of2: "of",
    basicConfig: "Basic Configuration", riskSettings: "Risk Settings",
    botName: "Bot Name *", description: "Description", optional: "Optional",
    tradingPair: "Trading Pair", loading: "Loading...", selectPair: "Select pair...",
    searchPair: "Search...", noPair: "No pair found.",
    stopLossPct: "Stop Loss (%)", takeProfitPct: "Take Profit (%)", maxPositionPct: "Max Position (%)",
    slTpNote: "SL/TP checked every execution cycle.",
    savingReplacesAll: "Saving replaces all existing conditions.",
    entryLabel: "Entry", exitLabel: "Exit", conditionsLabel: "Conditions",
    defaultLogic: "Default strategy logic", slTpOnlyShort: "SL/TP only",
    add: "Add", cancel: "Cancel", back: "Back", next: "Next",
    saving: "Saving...", saveChanges: "Save Changes",
    botNameRequired: "Bot name required", failedSave: "Failed",
    botUpdated: "Bot updated — restart to apply",
    changingPairWarning: "Changing pair affects future trades.",
    botNotFound: "Bot not found", backToBots2: "Back to Bots", failedLoad: "Failed to load",
    running: "Running", paused: "Paused", stopped: "Stopped", ready: "Ready",
  },
  fr: {
    backToBots: "Retour aux bots",
    refresh: "Actualiser", edit: "Modifier", start: "Démarrer", pause: "Pause", stop: "Arrêter", delete: "Supprimer",
    deleteConfirm: "Supprimer ce bot ? Tout l'historique sera perdu. Action irréversible.",
    pauseFirst: "Mettez en pause avant de modifier", pauseFirst2: "Mettez en pause d'abord",
    editConfig: "Modifier la config", startBot: "Démarrer le bot", pauseBot: "Mettre en pause", stopBot: "Arrêter le bot", deleteBot: "Supprimer le bot",
    balance: "Solde", init: "Init", totalPnl: "P&L total", winRate: "Taux de réussite",
    trades: "Trades", open: "ouvert", noTrades: "Aucun trade",
    overview: "aperçu", tradesTab: "trades", positionsTab: "positions",
    noPriceData: "Pas de données de prix",
    bull: "Haussier", bear: "Baissier", buy: "Achat", sell: "Vente",
    noSnapshots: "Pas encore de snapshots — pris toutes les heures",
    equityCurve: "Courbe d'équité", hourlySnapshots: "Snapshots de solde horaires",
    performance: "Performance", configuration: "Configuration",
    indicatorConditions: "Conditions d'indicateurs",
    entryConditions: "Conditions d'entrée", exitConditions: "Conditions de sortie",
    defaultStrategyLogic: "Logique de stratégie par défaut", slTpOnly: "SL/TP uniquement",
    realizedPnl: "P&L réalisé", unrealizedPnl: "P&L non réalisé",
    avgWin: "Gain moyen", avgLoss: "Perte moyenne", bestTrade: "Meilleur trade", worstTrade: "Pire trade",
    openPositionsValue: "Valeur positions ouvertes", noStats: "Pas encore de statistiques",
    strategy: "Stratégie", pair: "Paire", timeframe: "Intervalle", initialBal: "Solde initial",
    stopLoss: "Stop Loss", takeProfit: "Take Profit", maxPosition: "Position max",
    pointsPerTrade: "Points/Trade", lastRun: "Dernier run", nextRun: "Prochain run",
    indicatorSnapshot: "Snapshot des indicateurs à l'exécution du trade",
    noTradesYet: "Pas encore de trades", noOpenPositions: "Pas de positions ouvertes",
    pageOf: "Page", of: "sur",
    type: "Type", symbol: "Symbole", amount: "Montant", price: "Prix",
    total: "Total", fees: "Frais", time: "Heure",
    quantity: "Quantité", entryPrice: "Prix d'entrée", currentPrice: "Prix actuel",
    entryValue: "Valeur d'entrée", currentValue: "Valeur actuelle", unrealizedPnlCol: "P&L non réalisé", opened: "Ouvert",
    editBot: "Modifier le bot", stepOf: "Étape", of2: "sur",
    basicConfig: "Configuration de base", riskSettings: "Paramètres de risque",
    botName: "Nom du bot *", description: "Description", optional: "Optionnel",
    tradingPair: "Paire de trading", loading: "Chargement...", selectPair: "Sélectionner une paire...",
    searchPair: "Rechercher...", noPair: "Aucune paire trouvée.",
    stopLossPct: "Stop Loss (%)", takeProfitPct: "Take Profit (%)", maxPositionPct: "Position max (%)",
    slTpNote: "SL/TP vérifié à chaque cycle d'exécution.",
    savingReplacesAll: "La sauvegarde remplace toutes les conditions existantes.",
    entryLabel: "Entrée", exitLabel: "Sortie", conditionsLabel: "Conditions",
    defaultLogic: "Logique de stratégie par défaut", slTpOnlyShort: "SL/TP uniquement",
    add: "Ajouter", cancel: "Annuler", back: "Retour", next: "Suivant",
    saving: "Sauvegarde...", saveChanges: "Sauvegarder",
    botNameRequired: "Nom du bot requis", failedSave: "Échec",
    botUpdated: "Bot mis à jour — redémarrer pour appliquer",
    changingPairWarning: "Changer de paire affecte les trades futurs.",
    botNotFound: "Bot introuvable", backToBots2: "Retour aux bots", failedLoad: "Échec du chargement",
    running: "En cours", paused: "En pause", stopped: "Arrêté", ready: "Prêt",
  },
  es: {
    backToBots: "Volver a bots",
    refresh: "Actualizar", edit: "Editar", start: "Iniciar", pause: "Pausar", stop: "Detener", delete: "Eliminar",
    deleteConfirm: "¿Eliminar este bot? Todo el historial se perderá. Acción irreversible.",
    pauseFirst: "Pausa antes de editar", pauseFirst2: "Pausa primero",
    editConfig: "Editar config", startBot: "Iniciar bot", pauseBot: "Pausar bot", stopBot: "Detener bot", deleteBot: "Eliminar bot",
    balance: "Saldo", init: "Inicial", totalPnl: "P&L total", winRate: "Tasa de éxito",
    trades: "Trades", open: "abierto", noTrades: "Sin trades",
    overview: "resumen", tradesTab: "trades", positionsTab: "posiciones",
    noPriceData: "Sin datos de precio",
    bull: "Alcista", bear: "Bajista", buy: "Compra", sell: "Venta",
    noSnapshots: "Sin instantáneas todavía — tomadas cada hora",
    equityCurve: "Curva de capital", hourlySnapshots: "Instantáneas de saldo por hora",
    performance: "Rendimiento", configuration: "Configuración",
    indicatorConditions: "Condiciones de indicadores",
    entryConditions: "Condiciones de entrada", exitConditions: "Condiciones de salida",
    defaultStrategyLogic: "Lógica de estrategia predeterminada", slTpOnly: "Solo SL/TP",
    realizedPnl: "P&L realizado", unrealizedPnl: "P&L no realizado",
    avgWin: "Ganancia media", avgLoss: "Pérdida media", bestTrade: "Mejor trade", worstTrade: "Peor trade",
    openPositionsValue: "Valor posiciones abiertas", noStats: "Sin estadísticas aún",
    strategy: "Estrategia", pair: "Par", timeframe: "Intervalo", initialBal: "Saldo inicial",
    stopLoss: "Stop Loss", takeProfit: "Take Profit", maxPosition: "Posición máx",
    pointsPerTrade: "Puntos/Trade", lastRun: "Última ejecución", nextRun: "Próxima ejecución",
    indicatorSnapshot: "Instantánea de indicadores al ejecutar el trade",
    noTradesYet: "Sin trades todavía", noOpenPositions: "Sin posiciones abiertas",
    pageOf: "Página", of: "de",
    type: "Tipo", symbol: "Símbolo", amount: "Monto", price: "Precio",
    total: "Total", fees: "Comisiones", time: "Hora",
    quantity: "Cantidad", entryPrice: "Precio de entrada", currentPrice: "Precio actual",
    entryValue: "Valor de entrada", currentValue: "Valor actual", unrealizedPnlCol: "P&L no realizado", opened: "Abierto",
    editBot: "Editar bot", stepOf: "Paso", of2: "de",
    basicConfig: "Configuración básica", riskSettings: "Configuración de riesgo",
    botName: "Nombre del bot *", description: "Descripción", optional: "Opcional",
    tradingPair: "Par de trading", loading: "Cargando...", selectPair: "Seleccionar par...",
    searchPair: "Buscar...", noPair: "Par no encontrado.",
    stopLossPct: "Stop Loss (%)", takeProfitPct: "Take Profit (%)", maxPositionPct: "Posición máx (%)",
    slTpNote: "SL/TP verificado en cada ciclo de ejecución.",
    savingReplacesAll: "Guardar reemplaza todas las condiciones existentes.",
    entryLabel: "Entrada", exitLabel: "Salida", conditionsLabel: "Condiciones",
    defaultLogic: "Lógica de estrategia predeterminada", slTpOnlyShort: "Solo SL/TP",
    add: "Agregar", cancel: "Cancelar", back: "Atrás", next: "Siguiente",
    saving: "Guardando...", saveChanges: "Guardar cambios",
    botNameRequired: "Nombre del bot requerido", failedSave: "Falló",
    botUpdated: "Bot actualizado — reiniciar para aplicar",
    changingPairWarning: "Cambiar el par afecta los trades futuros.",
    botNotFound: "Bot no encontrado", backToBots2: "Volver a bots", failedLoad: "Error al cargar",
    running: "En ejecución", paused: "En pausa", stopped: "Detenido", ready: "Listo",
  },
  de: {
    backToBots: "Zurück zu Bots",
    refresh: "Aktualisieren", edit: "Bearbeiten", start: "Starten", pause: "Pausieren", stop: "Stoppen", delete: "Löschen",
    deleteConfirm: "Diesen Bot löschen? Alle Trade-Daten gehen verloren. Diese Aktion ist unumkehrbar.",
    pauseFirst: "Erst pausieren zum Bearbeiten", pauseFirst2: "Erst pausieren",
    editConfig: "Konfiguration bearbeiten", startBot: "Bot starten", pauseBot: "Bot pausieren", stopBot: "Bot stoppen", deleteBot: "Bot löschen",
    balance: "Guthaben", init: "Start", totalPnl: "Gesamt G&V", winRate: "Gewinnrate",
    trades: "Trades", open: "offen", noTrades: "Keine Trades",
    overview: "Übersicht", tradesTab: "Trades", positionsTab: "Positionen",
    noPriceData: "Keine Preisdaten",
    bull: "Bullen", bear: "Bären", buy: "Kauf", sell: "Verkauf",
    noSnapshots: "Noch keine Snapshots — stündlich aufgenommen",
    equityCurve: "Kapitalkurve", hourlySnapshots: "Stündliche Guthaben-Snapshots",
    performance: "Performance", configuration: "Konfiguration",
    indicatorConditions: "Indikatorbedingungen",
    entryConditions: "Einstiegsbedingungen", exitConditions: "Ausstiegsbedingungen",
    defaultStrategyLogic: "Standard-Strategie-Logik", slTpOnly: "Nur SL/TP",
    realizedPnl: "Realisierte G&V", unrealizedPnl: "Nicht realisierte G&V",
    avgWin: "Ø Gewinn", avgLoss: "Ø Verlust", bestTrade: "Bester Trade", worstTrade: "Schlechtester Trade",
    openPositionsValue: "Wert offener Positionen", noStats: "Noch keine Statistiken",
    strategy: "Strategie", pair: "Paar", timeframe: "Zeitrahmen", initialBal: "Startguthaben",
    stopLoss: "Stop-Loss", takeProfit: "Take-Profit", maxPosition: "Max. Position",
    pointsPerTrade: "Punkte/Trade", lastRun: "Letzter Lauf", nextRun: "Nächster Lauf",
    indicatorSnapshot: "Indikator-Snapshot bei Trade-Ausführung",
    noTradesYet: "Noch keine Trades", noOpenPositions: "Keine offenen Positionen",
    pageOf: "Seite", of: "von",
    type: "Typ", symbol: "Symbol", amount: "Betrag", price: "Preis",
    total: "Gesamt", fees: "Gebühren", time: "Zeit",
    quantity: "Menge", entryPrice: "Einstiegspreis", currentPrice: "Aktueller Preis",
    entryValue: "Einstiegswert", currentValue: "Aktueller Wert", unrealizedPnlCol: "Nicht real. G&V", opened: "Geöffnet",
    editBot: "Bot bearbeiten", stepOf: "Schritt", of2: "von",
    basicConfig: "Grundkonfiguration", riskSettings: "Risikoeinstellungen",
    botName: "Bot-Name *", description: "Beschreibung", optional: "Optional",
    tradingPair: "Handelspaar", loading: "Laden...", selectPair: "Paar auswählen...",
    searchPair: "Suchen...", noPair: "Kein Paar gefunden.",
    stopLossPct: "Stop-Loss (%)", takeProfitPct: "Take-Profit (%)", maxPositionPct: "Max. Position (%)",
    slTpNote: "SL/TP bei jedem Ausführungszyklus geprüft.",
    savingReplacesAll: "Speichern ersetzt alle vorhandenen Bedingungen.",
    entryLabel: "Einstieg", exitLabel: "Ausstieg", conditionsLabel: "Bedingungen",
    defaultLogic: "Standard-Strategie-Logik", slTpOnlyShort: "Nur SL/TP",
    add: "Hinzufügen", cancel: "Abbrechen", back: "Zurück", next: "Weiter",
    saving: "Speichern...", saveChanges: "Änderungen speichern",
    botNameRequired: "Bot-Name erforderlich", failedSave: "Fehlgeschlagen",
    botUpdated: "Bot aktualisiert — neu starten zum Anwenden",
    changingPairWarning: "Paarwechsel betrifft zukünftige Trades.",
    botNotFound: "Bot nicht gefunden", backToBots2: "Zurück zu Bots", failedLoad: "Laden fehlgeschlagen",
    running: "Läuft", paused: "Pausiert", stopped: "Gestoppt", ready: "Bereit",
  },
  ja: {
    backToBots: "ボット一覧に戻る",
    refresh: "更新", edit: "編集", start: "開始", pause: "一時停止", stop: "停止", delete: "削除",
    deleteConfirm: "このボットを削除しますか？全ての取引履歴が失われます。この操作は元に戻せません。",
    pauseFirst: "編集前に一時停止してください", pauseFirst2: "先に一時停止",
    editConfig: "設定を編集", startBot: "ボット開始", pauseBot: "ボット一時停止", stopBot: "ボット停止", deleteBot: "ボット削除",
    balance: "残高", init: "初期", totalPnl: "総損益", winRate: "勝率",
    trades: "取引", open: "未決済", noTrades: "取引なし",
    overview: "概要", tradesTab: "取引", positionsTab: "ポジション",
    noPriceData: "価格データなし",
    bull: "上昇", bear: "下降", buy: "買い", sell: "売り",
    noSnapshots: "スナップショットなし — 毎時間取得",
    equityCurve: "資本曲線", hourlySnapshots: "時間ごとの残高スナップショット",
    performance: "パフォーマンス", configuration: "設定",
    indicatorConditions: "インジケーター条件",
    entryConditions: "エントリー条件", exitConditions: "エグジット条件",
    defaultStrategyLogic: "デフォルト戦略ロジック", slTpOnly: "SL/TPのみ",
    realizedPnl: "実現損益", unrealizedPnl: "未実現損益",
    avgWin: "平均利益", avgLoss: "平均損失", bestTrade: "最良取引", worstTrade: "最悪取引",
    openPositionsValue: "未決済ポジション価値", noStats: "統計なし",
    strategy: "戦略", pair: "ペア", timeframe: "時間枠", initialBal: "初期残高",
    stopLoss: "ストップロス", takeProfit: "テイクプロフィット", maxPosition: "最大ポジション",
    pointsPerTrade: "ポイント/取引", lastRun: "最終実行", nextRun: "次回実行",
    indicatorSnapshot: "取引実行時のインジケータースナップショット",
    noTradesYet: "取引なし", noOpenPositions: "未決済ポジションなし",
    pageOf: "ページ", of: "/",
    type: "種類", symbol: "銘柄", amount: "数量", price: "価格",
    total: "合計", fees: "手数料", time: "時間",
    quantity: "数量", entryPrice: "エントリー価格", currentPrice: "現在価格",
    entryValue: "エントリー価値", currentValue: "現在価値", unrealizedPnlCol: "未実現損益", opened: "開始",
    editBot: "ボット編集", stepOf: "ステップ", of2: "/",
    basicConfig: "基本設定", riskSettings: "リスク設定",
    botName: "ボット名 *", description: "説明", optional: "任意",
    tradingPair: "取引ペア", loading: "読み込み中...", selectPair: "ペアを選択...",
    searchPair: "検索...", noPair: "ペアが見つかりません。",
    stopLossPct: "ストップロス (%)", takeProfitPct: "テイクプロフィット (%)", maxPositionPct: "最大ポジション (%)",
    slTpNote: "SL/TPは実行サイクルごとに確認されます。",
    savingReplacesAll: "保存すると既存の条件がすべて置き換えられます。",
    entryLabel: "エントリー", exitLabel: "エグジット", conditionsLabel: "条件",
    defaultLogic: "デフォルト戦略ロジック", slTpOnlyShort: "SL/TPのみ",
    add: "追加", cancel: "キャンセル", back: "戻る", next: "次へ",
    saving: "保存中...", saveChanges: "変更を保存",
    botNameRequired: "ボット名は必須です", failedSave: "失敗",
    botUpdated: "ボットを更新しました — 再起動して適用",
    changingPairWarning: "ペアの変更は将来の取引に影響します。",
    botNotFound: "ボットが見つかりません", backToBots2: "ボット一覧に戻る", failedLoad: "読み込み失敗",
    running: "実行中", paused: "一時停止", stopped: "停止済み", ready: "準備完了",
  },
  pt: {
    backToBots: "Voltar aos bots",
    refresh: "Atualizar", edit: "Editar", start: "Iniciar", pause: "Pausar", stop: "Parar", delete: "Excluir",
    deleteConfirm: "Excluir este bot? Todo o histórico será perdido. Ação irreversível.",
    pauseFirst: "Pause antes de editar", pauseFirst2: "Pause primeiro",
    editConfig: "Editar config", startBot: "Iniciar bot", pauseBot: "Pausar bot", stopBot: "Parar bot", deleteBot: "Excluir bot",
    balance: "Saldo", init: "Inicial", totalPnl: "L&P total", winRate: "Taxa de acerto",
    trades: "Trades", open: "aberto", noTrades: "Sem trades",
    overview: "visão geral", tradesTab: "trades", positionsTab: "posições",
    noPriceData: "Sem dados de preço",
    bull: "Alta", bear: "Baixa", buy: "Compra", sell: "Venda",
    noSnapshots: "Sem instantâneos ainda — tirados a cada hora",
    equityCurve: "Curva de capital", hourlySnapshots: "Instantâneos de saldo horários",
    performance: "Performance", configuration: "Configuração",
    indicatorConditions: "Condições de indicadores",
    entryConditions: "Condições de entrada", exitConditions: "Condições de saída",
    defaultStrategyLogic: "Lógica de estratégia padrão", slTpOnly: "Apenas SL/TP",
    realizedPnl: "L&P realizado", unrealizedPnl: "L&P não realizado",
    avgWin: "Ganho médio", avgLoss: "Perda média", bestTrade: "Melhor trade", worstTrade: "Pior trade",
    openPositionsValue: "Valor posições abertas", noStats: "Sem estatísticas ainda",
    strategy: "Estratégia", pair: "Par", timeframe: "Intervalo", initialBal: "Saldo inicial",
    stopLoss: "Stop Loss", takeProfit: "Take Profit", maxPosition: "Posição máx",
    pointsPerTrade: "Pontos/Trade", lastRun: "Última execução", nextRun: "Próxima execução",
    indicatorSnapshot: "Instantâneo de indicadores na execução do trade",
    noTradesYet: "Sem trades ainda", noOpenPositions: "Sem posições abertas",
    pageOf: "Página", of: "de",
    type: "Tipo", symbol: "Símbolo", amount: "Valor", price: "Preço",
    total: "Total", fees: "Taxas", time: "Hora",
    quantity: "Quantidade", entryPrice: "Preço de entrada", currentPrice: "Preço atual",
    entryValue: "Valor de entrada", currentValue: "Valor atual", unrealizedPnlCol: "L&P não realizado", opened: "Aberto",
    editBot: "Editar bot", stepOf: "Passo", of2: "de",
    basicConfig: "Configuração básica", riskSettings: "Configurações de risco",
    botName: "Nome do bot *", description: "Descrição", optional: "Opcional",
    tradingPair: "Par de trading", loading: "Carregando...", selectPair: "Selecionar par...",
    searchPair: "Buscar...", noPair: "Par não encontrado.",
    stopLossPct: "Stop Loss (%)", takeProfitPct: "Take Profit (%)", maxPositionPct: "Posição máx (%)",
    slTpNote: "SL/TP verificado em cada ciclo de execução.",
    savingReplacesAll: "Salvar substitui todas as condições existentes.",
    entryLabel: "Entrada", exitLabel: "Saída", conditionsLabel: "Condições",
    defaultLogic: "Lógica de estratégia padrão", slTpOnlyShort: "Apenas SL/TP",
    add: "Adicionar", cancel: "Cancelar", back: "Voltar", next: "Próximo",
    saving: "Salvando...", saveChanges: "Salvar alterações",
    botNameRequired: "Nome do bot obrigatório", failedSave: "Falhou",
    botUpdated: "Bot atualizado — reiniciar para aplicar",
    changingPairWarning: "Mudar o par afeta trades futuros.",
    botNotFound: "Bot não encontrado", backToBots2: "Voltar aos bots", failedLoad: "Falha ao carregar",
    running: "Em execução", paused: "Em pausa", stopped: "Parado", ready: "Pronto",
  },
  zh: {
    backToBots: "返回机器人列表",
    refresh: "刷新", edit: "编辑", start: "启动", pause: "暂停", stop: "停止", delete: "删除",
    deleteConfirm: "删除此机器人？所有交易历史将永久丢失，此操作无法撤销。",
    pauseFirst: "编辑前请先暂停", pauseFirst2: "请先暂停",
    editConfig: "编辑配置", startBot: "启动机器人", pauseBot: "暂停机器人", stopBot: "停止机器人", deleteBot: "删除机器人",
    balance: "余额", init: "初始", totalPnl: "总盈亏", winRate: "胜率",
    trades: "交易", open: "未平仓", noTrades: "无交易",
    overview: "概览", tradesTab: "交易", positionsTab: "仓位",
    noPriceData: "无价格数据",
    bull: "多头", bear: "空头", buy: "买入", sell: "卖出",
    noSnapshots: "暂无快照 — 每小时获取一次",
    equityCurve: "资金曲线", hourlySnapshots: "每小时余额快照",
    performance: "绩效", configuration: "配置",
    indicatorConditions: "指标条件",
    entryConditions: "入场条件", exitConditions: "出场条件",
    defaultStrategyLogic: "默认策略逻辑", slTpOnly: "仅SL/TP",
    realizedPnl: "已实现盈亏", unrealizedPnl: "未实现盈亏",
    avgWin: "平均盈利", avgLoss: "平均亏损", bestTrade: "最佳交易", worstTrade: "最差交易",
    openPositionsValue: "未平仓价值", noStats: "暂无统计数据",
    strategy: "策略", pair: "交易对", timeframe: "时间框架", initialBal: "初始余额",
    stopLoss: "止损", takeProfit: "止盈", maxPosition: "最大仓位",
    pointsPerTrade: "积分/交易", lastRun: "上次运行", nextRun: "下次运行",
    indicatorSnapshot: "交易执行时的指标快照",
    noTradesYet: "暂无交易", noOpenPositions: "无未平仓位",
    pageOf: "第", of: "页/共",
    type: "类型", symbol: "标的", amount: "数量", price: "价格",
    total: "总计", fees: "手续费", time: "时间",
    quantity: "数量", entryPrice: "入场价格", currentPrice: "当前价格",
    entryValue: "入场价值", currentValue: "当前价值", unrealizedPnlCol: "未实现盈亏", opened: "开仓",
    editBot: "编辑机器人", stepOf: "步骤", of2: "/",
    basicConfig: "基本配置", riskSettings: "风险设置",
    botName: "机器人名称 *", description: "描述", optional: "可选",
    tradingPair: "交易对", loading: "加载中...", selectPair: "选择交易对...",
    searchPair: "搜索...", noPair: "未找到交易对。",
    stopLossPct: "止损 (%)", takeProfitPct: "止盈 (%)", maxPositionPct: "最大仓位 (%)",
    slTpNote: "止损/止盈在每个执行周期检查。",
    savingReplacesAll: "保存将替换所有现有条件。",
    entryLabel: "入场", exitLabel: "出场", conditionsLabel: "条件",
    defaultLogic: "默认策略逻辑", slTpOnlyShort: "仅SL/TP",
    add: "添加", cancel: "取消", back: "返回", next: "下一步",
    saving: "保存中...", saveChanges: "保存更改",
    botNameRequired: "机器人名称是必填项", failedSave: "失败",
    botUpdated: "机器人已更新 — 重启以应用",
    changingPairWarning: "更改交易对会影响未来的交易。",
    botNotFound: "未找到机器人", backToBots2: "返回机器人列表", failedLoad: "加载失败",
    running: "运行中", paused: "已暂停", stopped: "已停止", ready: "准备就绪",
  },
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface BotResponse {
  id: string; name: string; strategyType: "DCA" | "GRID" | "SCALPING"
  tradingPair: string; timeframe: string
  status: "CREATED" | "SIMULATING" | "PAUSED" | "STOPPED" | "DELETED"
  initialBalance: number; currentBalance: number; totalPnl: number; totalPnlPercentage: number
  stopLossPercentage?: number; takeProfitPercentage?: number; maxPositionSizePercentage: number
  totalTrades: number; openPositions: number; createdAt: string; startedAt?: string
  lastExecutionTime?: string; nextExecutionTime?: string; pointsPerDay?: number
  configuration: Record<string, unknown>
  tradingMode: "SIMULATION" | "LIVE"; virtualCredit: boolean
}
interface BotTrade {
  id: string; tradeType: "BUY" | "SELL"; symbol: string; amount: number; price: number
  totalValue: number; fees: number; slippage: number; profitLoss?: number
  profitLossPercentage?: number; status: string; executedAt: string
  indicatorValues?: Record<string, number>
}
interface BotPosition {
  id: string; symbol: string; quantity: number; entryPrice: number; entryValue: number
  currentPrice?: number; currentValue?: number; unrealizedPnl?: number
  unrealizedPnlPercentage?: number; status: "OPEN" | "CLOSED"; openedAt: string
}
interface PerformanceSnapshot {
  id: string; snapshotTime: string; balance: number; totalPnl: number
  totalPnlPercentage: number; totalTrades: number; winRate?: number; openPositionsCount: number
}
interface BotStats {
  totalTrades: number; winningTrades: number; losingTrades: number; winRate: number
  totalRealizedPnl: number; totalUnrealizedPnl: number; averageWin?: number; averageLoss?: number
  largestWin?: number; largestLoss?: number; openPositions: number; openPositionsValue: number
}
interface CandleData {
  time: string; rawTime?: string; open: number; high: number; low: number; close: number; volume: number
}
interface EditBotForm {
  name: string; description: string; tradingPair: string; timeframe: string
  stopLossPercentage: number; takeProfitPercentage: number; maxPositionSizePercentage: number
  pointsPerDay: number; entryConditions: ConditionForm[]; exitConditions: ConditionForm[]
}
interface ConditionForm {
  indicatorName: string; operator: string; comparisonValue: number; logicalOperator: "AND" | "OR"
}

// ─── Constants ─────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL
const TIMEFRAMES = ["5m", "15m", "30m", "1h", "4h", "1d"]
const INDICATORS = ["RSI_14", "RSI_7", "MACD", "MACD_HISTOGRAM", "MA_20", "MA_50", "MA_200", "EMA_12", "BB_UPPER", "BB_LOWER", "CLOSE_PRICE"]
const OPERATORS = [
  { value: ">", label: ">" }, { value: "<", label: "<" },
  { value: ">=", label: ">=" }, { value: "<=", label: "<=" },
  { value: "crosses_above", label: "↑ Cross" }, { value: "crosses_below", label: "↓ Cross" },
]
const INDICATOR_LABELS: Record<string, string> = {
  CLOSE_PRICE: "Price", RSI_14: "RSI 14", RSI_7: "RSI 7", MACD: "MACD",
  MACD_SIGNAL: "Signal", MACD_HISTOGRAM: "MACD Hist", MA_20: "MA 20", MA_50: "MA 50",
  MA_200: "MA 200", EMA_12: "EMA 12", EMA_26: "EMA 26",
  BB_UPPER: "BB Upper", BB_MIDDLE: "BB Mid", BB_LOWER: "BB Lower", VOLUME: "Volume",
}
const STRATEGY_COLORS: Record<string, string> = {
  DCA: "text-blue-500", GRID: "text-purple-500", SCALPING: "text-orange-500"
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function authHeader() {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
}
function fmt(n?: number, d = 2) {
  if (n == null) return "—"
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

// ─── Candlestick Chart ────────────────────────────────────────────────────

function CandlestickChart({ candles, trades, symbol, tr }: { candles: CandleData[]; trades: BotTrade[]; symbol: string; tr: typeof translations.en }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<unknown>(null)
  const roRef = useRef<ResizeObserver | null>(null)

  // API returns newest-first (ORDER BY open_time DESC)
  // so candles[0] = most recent, candles[last] = oldest
  const last = candles[0]                        // most recent = current price
  const first = candles[candles.length - 1]       // oldest = start of range
  const change = last && first ? last.close - first.close : 0
  const changePct = first?.close ? (change / first.close) * 100 : 0
  const pos = change >= 0

  useEffect(() => {
    // Always destroy previous chart + observer before creating new one
    if (roRef.current) { roRef.current.disconnect(); roRef.current = null }
    if (chartRef.current) { (chartRef.current as { remove: () => void }).remove(); chartRef.current = null }

    if (!containerRef.current || !candles.length) return

    let cancelled = false

    import("lightweight-charts").then((lwc) => {
      if (cancelled || !containerRef.current) return

      const dark = document.documentElement.classList.contains("dark")
      const bc = dark ? "#1e293b" : "#e2e8f0"
      const tc = dark ? "#94a3b8" : "#64748b"

      const chart = lwc.createChart(containerRef.current, {
        width: containerRef.current.clientWidth || containerRef.current.offsetWidth || 600,
        height: 280,
        layout: { background: { type: lwc.ColorType.Solid, color: "transparent" }, textColor: tc, fontSize: 10 },
        grid: { vertLines: { color: bc }, horzLines: { color: bc } },
        crosshair: { mode: lwc.CrosshairMode.Normal },
        rightPriceScale: { borderColor: bc, scaleMargins: { top: 0.1, bottom: 0.3 } },
        timeScale: { borderColor: bc, timeVisible: true, secondsVisible: false, fixLeftEdge: true, fixRightEdge: true },
      })
      chartRef.current = chart

      const cs = chart.addSeries(lwc.CandlestickSeries, {
        upColor: "#22c55e", downColor: "#ef4444",
        borderUpColor: "#22c55e", borderDownColor: "#ef4444",
        wickUpColor: "#22c55e", wickDownColor: "#ef4444", borderVisible: true,
      })

      type T = number & { readonly __t: unique symbol }
      const toT = (iso: string): T => Math.floor(new Date(iso).getTime() / 1000) as unknown as T

      const sorted = [...candles].sort((a, b) => new Date(a.rawTime ?? a.time).getTime() - new Date(b.rawTime ?? b.time).getTime())
      cs.setData(sorted.map(c => ({ time: toT(c.rawTime ?? c.time), open: c.open, high: c.high, low: c.low, close: c.close })))

      const vs = chart.addSeries(lwc.HistogramSeries, { color: "#3b82f6", priceFormat: { type: "volume" as const }, priceScaleId: "vol" })
      chart.priceScale("vol").applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })
      vs.setData(sorted.map(c => ({ time: toT(c.rawTime ?? c.time), value: c.volume, color: c.close >= c.open ? "#22c55e50" : "#ef444450" })))

      if (trades.length > 0) {
        const markers = trades
          .filter(t => t.executedAt)
          .map(t => ({
            time: toT(t.executedAt),
            position: (t.tradeType === "BUY" ? "belowBar" : "aboveBar") as "belowBar" | "aboveBar",
            color: t.tradeType === "BUY" ? "#22c55e" : "#ef4444",
            shape: (t.tradeType === "BUY" ? "arrowUp" : "arrowDown") as "arrowUp" | "arrowDown",
            text: t.tradeType === "BUY" ? `B $${t.price?.toFixed(0)}` : `S $${t.price?.toFixed(0)}`,
            size: 1,
          }))
          .sort((a, b) => (a.time as unknown as number) - (b.time as unknown as number))
        lwc.createSeriesMarkers(cs, markers as never)
      }

      chart.timeScale().fitContent()

      // Wire up ResizeObserver via ref so cleanup can always reach it
      const ro = new ResizeObserver(entries => {
        if (entries[0] && chartRef.current) {
          const w = entries[0].contentRect.width
          if (w > 0) (chartRef.current as { applyOptions: (o: object) => void }).applyOptions({ width: w })
        }
      })
      ro.observe(containerRef.current)
      roRef.current = ro
    })

    return () => {
      cancelled = true
      if (roRef.current) { roRef.current.disconnect(); roRef.current = null }
      if (chartRef.current) { (chartRef.current as { remove: () => void }).remove(); chartRef.current = null }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles, trades])

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xl sm:text-2xl font-bold font-mono">{last ? `$${fmt(last.close)}` : "—"}</span>
        {last && first && <span className={`text-sm font-medium ${pos ? "text-green-500" : "text-red-500"}`}>{pos ? "+" : ""}{fmt(change)} ({pos ? "+" : ""}{changePct.toFixed(2)}%)</span>}
        <span className="text-xs text-muted-foreground ml-auto">{candles.length} · {symbol}</span>
      </div>
      {candles.length === 0
        ? <div className="flex items-center justify-center h-56 text-muted-foreground text-sm gap-2"><AlertCircle className="w-4 h-4" />{tr.noPriceData}</div>
        : <div ref={containerRef} className="w-full rounded-lg overflow-hidden" style={{ minHeight: 280 }} />}
      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />{tr.bull}</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" />{tr.bear}</span>
        <span className="flex items-center gap-1"><span className="text-green-500 font-bold">▲</span>{tr.buy}</span>
        <span className="flex items-center gap-1"><span className="text-red-500 font-bold">▼</span>{tr.sell}</span>
      </div>
    </div>
  )
}

// ─── Equity Chart ─────────────────────────────────────────────────────────

function EquityChart({ data, initialBalance, tr }: { data: PerformanceSnapshot[]; initialBalance: number; tr: typeof translations.en }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm gap-2">
      <AlertCircle className="w-4 h-4" /> {tr.noSnapshots}
    </div>
  )
  const chartData = [...data].reverse().map(s => ({
    time: new Date(s.snapshotTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    balance: s.balance,
  }))
  const lastBal = chartData[chartData.length - 1]?.balance ?? initialBalance
  const pos = lastBal >= initialBalance
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={pos ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
            <stop offset="95%" stopColor={pos ? "#22c55e" : "#ef4444"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
        <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} width={42} />
        <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`$${fmt(v)}`, tr.balance]} />
        <ReferenceLine y={initialBalance} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" strokeOpacity={0.6} />
        <Area type="monotone" dataKey="balance" stroke={pos ? "#22c55e" : "#ef4444"} strokeWidth={2} fill="url(#eg)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Trades Table ─────────────────────────────────────────────────────────

function TradesTable({ trades, tradePage, totalTradePage, onPrev, onNext, tr }: {
  trades: BotTrade[]; tradePage: number; totalTradePage: number; onPrev: () => void; onNext: () => void; tr: typeof translations.en
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (trades.length === 0) return (
    <Card className="border border-border">
      <div className="p-12 text-center"><BarChart2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">{tr.noTradesYet}</p></div>
    </Card>
  )

  return (
    <Card className="border border-border overflow-hidden">
      {/* Mobile */}
      <div className="block sm:hidden divide-y divide-border">
        {trades.map(t => {
          const exp = expandedId === t.id
          const hasInd = t.indicatorValues && Object.keys(t.indicatorValues).length > 0
          const pp = (t.profitLoss ?? 0) >= 0
          return (
            <div key={t.id}>
              <div className={`p-4 ${hasInd ? "cursor-pointer" : ""} ${exp ? "bg-muted/20" : ""}`} onClick={() => hasInd && setExpandedId(exp ? null : t.id)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${t.tradeType === "BUY" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>
                      {t.tradeType === "BUY" ? "▲" : "▼"} {t.tradeType === "BUY" ? tr.buy : tr.sell}
                    </span>
                    <span className="text-sm font-medium">{t.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.profitLoss != null && <span className={`text-sm font-semibold font-mono ${pp ? "text-green-500" : "text-destructive"}`}>{pp ? "+" : ""}${fmt(t.profitLoss)}</span>}
                    {hasInd && <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${exp ? "rotate-90" : ""}`} />}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div><span className="block text-foreground font-mono">{fmt(t.amount, 6)}</span>{tr.amount}</div>
                  <div><span className="block text-foreground font-mono">${fmt(t.price)}</span>{tr.price}</div>
                  <div><span className="block text-foreground font-mono">${fmt(t.totalValue)}</span>{tr.total}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{fmtTime(t.executedAt)}</p>
              </div>
              {exp && hasInd && (
                <div className="px-4 pb-4 bg-muted/10 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider my-2">{tr.indicatorSnapshot}</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Object.entries(t.indicatorValues!).map(([k, v]) => (
                      <div key={k} className="p-1.5 rounded-lg bg-background border border-border">
                        <p className="text-xs text-muted-foreground">{INDICATOR_LABELS[k] ?? k}</p>
                        <p className="text-xs font-mono font-semibold">{k === "VOLUME" ? v.toLocaleString("en-US", { maximumFractionDigits: 0 }) : v.toFixed(3)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-3 w-8" />
              {[tr.type, tr.symbol, tr.amount, tr.price, tr.total, tr.fees, "P&L", tr.time].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map(t => {
              const exp = expandedId === t.id
              const hasInd = t.indicatorValues && Object.keys(t.indicatorValues).length > 0
              return (
                <>
                  <tr key={t.id} className={`border-b border-border transition-colors ${hasInd ? "cursor-pointer hover:bg-muted/20" : ""} ${exp ? "bg-muted/20" : ""}`}
                    onClick={() => hasInd && setExpandedId(exp ? null : t.id)}>
                    <td className="px-3 py-3">{hasInd && <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${exp ? "rotate-90" : ""}`} />}</td>
                    <td className="px-3 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${t.tradeType === "BUY" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>{t.tradeType === "BUY" ? "▲" : "▼"} {t.tradeType === "BUY" ? tr.buy : tr.sell}</span></td>
                    <td className="px-3 py-3 text-sm font-medium">{t.symbol}</td>
                    <td className="px-3 py-3 text-sm font-mono">{fmt(t.amount, 6)}</td>
                    <td className="px-3 py-3 text-sm font-mono">${fmt(t.price)}</td>
                    <td className="px-3 py-3 text-sm font-mono">${fmt(t.totalValue)}</td>
                    <td className="px-3 py-3 text-sm font-mono text-muted-foreground">${fmt(t.fees, 4)}</td>
                    <td className="px-3 py-3 text-sm font-mono">
                      {t.profitLoss != null
                        ? <span className={t.profitLoss >= 0 ? "text-green-500" : "text-destructive"}>{t.profitLoss >= 0 ? "+" : ""}${fmt(t.profitLoss)}<span className="text-xs ml-1">({t.profitLoss >= 0 ? "+" : ""}{fmt(t.profitLossPercentage)}%)</span></span>
                        : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{fmtTime(t.executedAt)}</td>
                  </tr>
                  {exp && hasInd && (
                    <tr key={`${t.id}-ind`} className="border-b border-border bg-muted/10">
                      <td colSpan={9} className="px-4 py-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{tr.indicatorSnapshot}</p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                          {Object.entries(t.indicatorValues!).map(([k, v]) => (
                            <div key={k} className="p-2 rounded-lg bg-background border border-border">
                              <p className="text-xs text-muted-foreground leading-tight mb-0.5">{INDICATOR_LABELS[k] ?? k}</p>
                              <p className="text-xs font-mono font-semibold">{k === "VOLUME" ? v.toLocaleString("en-US", { maximumFractionDigits: 0 }) : v.toFixed(4)}</p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
      {totalTradePage > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">{tr.pageOf} {tradePage + 1} {tr.of} {totalTradePage}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPrev} disabled={tradePage === 0}><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={onNext} disabled={tradePage >= totalTradePage - 1}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
    </Card>
  )
}

// ─── Edit Bot Modal ────────────────────────────────────────────────────────

function EditBotModal({ bot, onClose, onUpdated, tr }: { bot: BotResponse; onClose: () => void; onUpdated: () => void; tr: typeof translations.en }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pairs, setPairs] = useState<string[]>([])
  const [loadingPairs, setLP] = useState(true)
  const [pairOpen, setPairOpen] = useState(false)
  const [form, setForm] = useState<EditBotForm>({
    name: bot.name, description: bot.description ?? "", tradingPair: bot.tradingPair, timeframe: bot.timeframe,
    stopLossPercentage: bot.stopLossPercentage ?? 5, takeProfitPercentage: bot.takeProfitPercentage ?? 10,
    maxPositionSizePercentage: bot.maxPositionSizePercentage ?? 20, pointsPerDay: bot.pointsPerDay ?? 1,
    entryConditions: [], exitConditions: [],
  })

  useEffect(() => {
    fetch(`${API}api/market-data/pairs`).then(r => r.json()).then(d => setPairs(d.pairs ?? []))
      .catch(() => setPairs(["BTCUSDT", "ETHUSDT", "BNBUSDT"])).finally(() => setLP(false))
  }, [])

  useEffect(() => {
    fetch(`${API}api/bots/${bot.id}/conditions`, { headers: authHeader() }).then(r => r.json()).then(d => {
      setForm(p => ({
        ...p,
        entryConditions: (d.entryConditions ?? []).map((c: ConditionForm) => ({ indicatorName: c.indicatorName, operator: c.operator, comparisonValue: c.comparisonValue, logicalOperator: c.logicalOperator })),
        exitConditions: (d.exitConditions ?? []).map((c: ConditionForm) => ({ indicatorName: c.indicatorName, operator: c.operator, comparisonValue: c.comparisonValue, logicalOperator: c.logicalOperator })),
      }))
    }).catch(() => { })
  }, [bot.id])

  const set = (k: keyof EditBotForm, v: unknown) => setForm(p => ({ ...p, [k]: v }))
  const addC = (t: "entryConditions" | "exitConditions") => set(t, [...form[t], { indicatorName: "RSI_14", operator: "<", comparisonValue: 30, logicalOperator: "AND" }])
  const remC = (t: "entryConditions" | "exitConditions", i: number) => set(t, form[t].filter((_, j) => j !== i))
  const updC = (t: "entryConditions" | "exitConditions", i: number, k: keyof ConditionForm, v: unknown) => set(t, form[t].map((c, j) => j === i ? { ...c, [k]: v } : c))

  async function handleSave() {
    if (!form.name.trim()) { toast.error(tr.botNameRequired); return }
    setLoading(true)
    try {
      const res = await fetch(`${API}api/bots/${bot.id}`, {
        method: "PUT", headers: authHeader(),
        body: JSON.stringify({ ...form, entryConditions: form.entryConditions.map((c, i) => ({ ...c, conditionOrder: i })), exitConditions: form.exitConditions.map((c, i) => ({ ...c, conditionOrder: i })) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || tr.failedSave)
      toast.success(tr.botUpdated); onUpdated(); onClose()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : tr.failedSave) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto border-0 sm:border border-border bg-background shadow-2xl rounded-t-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
          <div><h2 className="font-bold text-lg">{tr.editBot}</h2><p className="text-xs text-muted-foreground">{tr.stepOf} {step} {tr.of2} 3</p></div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-4 sm:px-6 pt-4">
          <div className="flex gap-1.5">{[0, 1, 2].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-border"}`} />)}</div>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{tr.basicConfig}</h3>
              <div><Label>{tr.botName}</Label><Input value={form.name} onChange={e => set("name", e.target.value)} className="mt-1.5" /></div>
              <div><Label>{tr.description}</Label><Input value={form.description} onChange={e => set("description", e.target.value)} placeholder={tr.optional} className="mt-1.5" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>{tr.tradingPair}</Label>
                  <Popover open={pairOpen} onOpenChange={setPairOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between font-normal mt-1.5">
                        {loadingPairs ? <span className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" />{tr.loading}</span> : (form.tradingPair || tr.selectPair)}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                      <Command><CommandInput placeholder={tr.searchPair} /><CommandEmpty>{tr.noPair}</CommandEmpty>
                        <CommandList className="max-h-52"><CommandGroup>
                          {pairs.map(p => <CommandItem key={p} value={p} onSelect={v => { set("tradingPair", v.toUpperCase()); setPairOpen(false) }}><Check className={cn("mr-2 h-4 w-4", form.tradingPair === p ? "opacity-100" : "opacity-0")} />{p}</CommandItem>)}
                        </CommandGroup></CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>{tr.timeframe}</Label>
                  <select value={form.timeframe} onChange={e => set("timeframe", e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-sm">
                    {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              {form.tradingPair !== bot.tradingPair && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /><span>{tr.changingPairWarning}</span>
                </div>
              )}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{tr.riskSettings}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{tr.stopLossPct}</Label><Input type="number" value={form.stopLossPercentage} onChange={e => set("stopLossPercentage", Number(e.target.value))} step={0.1} min={0.1} max={50} className="mt-1.5" /></div>
                <div><Label>{tr.takeProfitPct}</Label><Input type="number" value={form.takeProfitPercentage} onChange={e => set("takeProfitPercentage", Number(e.target.value))} step={0.1} min={0.1} max={1000} className="mt-1.5" /></div>
                <div><Label>{tr.maxPositionPct}</Label><Input type="number" value={form.maxPositionSizePercentage} onChange={e => set("maxPositionSizePercentage", Number(e.target.value))} step={1} min={1} max={100} className="mt-1.5" /></div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
                <Shield className="w-4 h-4 inline mr-1.5 mb-0.5" />{tr.slTpNote}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{tr.indicatorConditions}</h3>
              <p className="text-sm text-muted-foreground">{tr.savingReplacesAll}</p>
              {(["entryConditions", "exitConditions"] as const).map(type => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className={type === "entryConditions" ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                      {type === "entryConditions" ? `${tr.entryLabel} ${tr.conditionsLabel}` : `${tr.exitLabel} ${tr.conditionsLabel}`}
                    </Label>
                    <Button size="sm" variant="outline" onClick={() => addC(type)}><Plus className="w-3 h-3 mr-1" />{tr.add}</Button>
                  </div>
                  {form[type].length === 0 && (
                    <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/40 border border-border">
                      {type === "entryConditions" ? tr.defaultLogic : tr.slTpOnlyShort}
                    </p>
                  )}
                  {form[type].map((cond, idx) => (
                    <div key={idx} className="flex flex-wrap gap-1.5 items-center p-2 rounded-lg border border-border bg-muted/20 mb-2">
                      {idx > 0 && <select value={cond.logicalOperator} onChange={e => updC(type, idx, "logicalOperator", e.target.value)} className="w-14 px-1 py-1.5 text-xs rounded bg-input border border-border text-foreground"><option value="AND">AND</option><option value="OR">OR</option></select>}
                      <select value={cond.indicatorName} onChange={e => updC(type, idx, "indicatorName", e.target.value)} className="flex-1 min-w-[90px] px-2 py-1.5 text-xs rounded bg-input border border-border text-foreground">{INDICATORS.map(i => <option key={i} value={i}>{i}</option>)}</select>
                      <select value={cond.operator} onChange={e => updC(type, idx, "operator", e.target.value)} className="w-20 px-2 py-1.5 text-xs rounded bg-input border border-border text-foreground">{OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                      <Input type="number" value={cond.comparisonValue} onChange={e => updC(type, idx, "comparisonValue", Number(e.target.value))} className="w-16 h-8 text-xs" />
                      <button onClick={() => remC(type, idx)} className="text-muted-foreground hover:text-destructive p-1"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="sticky bottom-0 flex items-center justify-between px-4 sm:px-6 py-4 border-t border-border bg-background/95 backdrop-blur-sm">
          <Button variant="outline" onClick={() => step > 1 ? setStep(s => s - 1) : onClose()} disabled={loading}>
            <ChevronLeft className="w-4 h-4 mr-1" />{step === 1 ? tr.cancel : tr.back}
          </Button>
          {step < 3
            ? <Button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !form.name.trim()}>{tr.next} <ChevronRight className="w-4 h-4 ml-1" /></Button>
            : <Button onClick={handleSave} disabled={loading} className="bg-primary text-primary-foreground">{loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}{loading ? tr.saving : tr.saveChanges}</Button>
          }
        </div>
      </Card>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────

// ─── Delete Bot Modal ──────────────────────────────────────────────────────

function DeleteBotModal({ botName, tr, onConfirm, onClose }: {
  botName: string
  tr: any
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{tr.delete} Bot</h2>
              <p className="text-xs text-muted-foreground mt-0.5">This action cannot be undone</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-5">
            <p className="text-sm text-foreground">
              You are about to delete{" "}
              <span className="font-semibold">"{botName}"</span>.
            </p>
            <ul className="mt-3 space-y-1.5">
              {[
                "All trade history will be permanently lost",
                "Open positions will not be closed",
                "Points already consumed will not be refunded",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-muted-foreground mb-5">{tr.deleteConfirm}</p>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0 gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {tr.delete} Bot
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function BotDetailPage() {
  const router = useRouter()
  const params = useParams()
  const botId = params.id as string
  const { language } = useLanguage()
  const tr = translations[language as keyof typeof translations] || translations.en

  const [bot, setBot] = useState<BotResponse | null>(null)
  const [stats, setStats] = useState<BotStats | null>(null)
  const [trades, setTrades] = useState<BotTrade[]>([])
  const [positions, setPositions] = useState<BotPosition[]>([])
  const [snapshots, setSnapshots] = useState<PerformanceSnapshot[]>([])
  const [candles, setCandles] = useState<CandleData[]>([])
  const [candleTimeframe, setCandleTimeframe] = useState("1h")
  const [conditions, setConditions] = useState<{ entryConditions: ConditionForm[]; exitConditions: ConditionForm[] }>({ entryConditions: [], exitConditions: [] })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "trades" | "positions">("overview")
  const [tradePage, setTradePage] = useState(0)
  const [totalTradePage, setTotalTradePage] = useState(0)

  function statusConfig(status: BotResponse["status"]) {
    const map: Record<string, { label: string; dot: string; badge: string }> = {
      SIMULATING: { label: tr.running, dot: "bg-green-500 animate-pulse", badge: "bg-green-500/10 text-green-600 border-green-500/20" },
      PAUSED: { label: tr.paused, dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
      STOPPED: { label: tr.stopped, dot: "bg-gray-400", badge: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
      CREATED: { label: tr.ready, dot: "bg-blue-500", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    }
    return map[status] ?? { label: status, dot: "bg-gray-400", badge: "bg-gray-500/10 text-gray-500 border-gray-500/20" }
  }

  useEffect(() => { if (!localStorage.getItem("auth_token")) router.push("/login") }, [router])

  const fetchAll = useCallback(async () => {
    if (!botId) return
    try {
      const [bR, sR, tR, pR, snR, cR] = await Promise.all([
        fetch(`${API}api/bots/${botId}`, { headers: authHeader() }),
        fetch(`${API}api/bots/${botId}/stats`, { headers: authHeader() }),
        fetch(`${API}api/bots/${botId}/trades?page=${tradePage}&size=15`, { headers: authHeader() }),
        fetch(`${API}api/bots/${botId}/positions/open`, { headers: authHeader() }),
        fetch(`${API}api/bots/${botId}/performance`, { headers: authHeader() }),
        fetch(`${API}api/bots/${botId}/conditions`, { headers: authHeader() }),
      ])
      if (bR.status === 401) { router.push("/login"); return }
      if (bR.ok) { const d = await bR.json(); setBot(d.bot) }
      if (sR.ok) { const d = await sR.json(); setStats(d.stats) }
      if (tR.ok) { const d = await tR.json(); setTrades(d.trades ?? []); setTotalTradePage(d.totalPages ?? 0) }
      if (pR.ok) { const d = await pR.json(); setPositions(d.positions ?? []) }
      if (snR.ok) { const d = await snR.json(); setSnapshots(d.snapshots ?? []) }
      if (cR.ok) { const d = await cR.json(); setConditions({ entryConditions: d.entryConditions ?? [], exitConditions: d.exitConditions ?? [] }) }
    } catch { toast.error(tr.failedLoad) }
    finally { setLoading(false) }
  }, [botId, router, tradePage, tr.failedLoad])

  const [candleLoading, setCandleLoading] = useState(false)

  const fetchCandles = useCallback(async (pair: string, tf: string) => {
    setCandleLoading(true)
    try {
      const res = await fetch(`${API}api/market-data/candles/${pair}?timeframe=${tf}&limit=100`)
      if (!res.ok) return
      const data = await res.json()
      const mapped = (data.candles ?? []).map((c: { openTime: string; openPrice: number; highPrice: number; lowPrice: number; closePrice: number; volume: number }) => ({
        rawTime: c.openTime,
        time: new Date(c.openTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }),
        open: c.openPrice, high: c.highPrice, low: c.lowPrice, close: c.closePrice, volume: c.volume,
      }))
      // Only update if we actually got data — never flash empty
      if (mapped.length > 0) setCandles(mapped)
    } catch { }
    finally { setCandleLoading(false) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])
  useEffect(() => { if (bot) fetchCandles(bot.tradingPair, candleTimeframe) }, [bot, candleTimeframe, fetchCandles])
  useEffect(() => { const i = setInterval(fetchAll, 30000); return () => clearInterval(i) }, [fetchAll])

  async function botAction(action: "start" | "pause" | "stop") {
    if (!bot) return
    setActionLoading(action); setShowMenu(false)
    try {
      const res = await fetch(`${API}api/bots/${botId}/${action}`, { method: "PUT", headers: authHeader() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message); fetchAll()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : tr.failedLoad) }
    finally { triggerNotificationRefresh(); setActionLoading(null) }
  }

  async function handleDelete() {
    if (!bot) return
    setShowDeleteModal(true)
  }

  async function confirmDelete() {
    if (!bot) return
    setShowDeleteModal(false)
    setActionLoading("delete"); setShowMenu(false)
    try {
      const res = await fetch(`${API}api/bots/${botId}`, { method: "DELETE", headers: authHeader() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Bot "${bot.name}" deleted`)
      router.push("/bots")
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed to delete bot") }
    finally { setActionLoading(null) }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  if (!bot) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">{tr.botNotFound}</p><Link href="/bots"><Button className="mt-4">{tr.backToBots2}</Button></Link></div>
    </div>
  )

  const sc = statusConfig(bot.status)
  const pnlPos = (bot.totalPnl ?? 0) >= 0
  const TFS = ["5m", "15m", "1h", "4h", "1d"]

  const perfRows = [
    { label: tr.realizedPnl, value: `$${fmt(stats?.totalRealizedPnl)}`, color: (stats?.totalRealizedPnl ?? 0) >= 0 ? "text-green-500" : "text-destructive" },
    { label: tr.unrealizedPnl, value: `$${fmt(stats?.totalUnrealizedPnl)}`, color: (stats?.totalUnrealizedPnl ?? 0) >= 0 ? "text-green-500" : "text-destructive" },
    { label: tr.avgWin, value: stats?.averageWin != null ? `$${fmt(stats.averageWin)}` : "—", color: "text-green-500" },
    { label: tr.avgLoss, value: stats?.averageLoss != null ? `$${fmt(stats.averageLoss)}` : "—", color: "text-destructive" },
    { label: tr.bestTrade, value: stats?.largestWin != null ? `$${fmt(stats.largestWin)}` : "—", color: "text-green-500" },
    { label: tr.worstTrade, value: stats?.largestLoss != null ? `$${fmt(stats.largestLoss)}` : "—", color: "text-destructive" },
    { label: tr.openPositionsValue, value: `$${fmt(stats?.openPositionsValue)}`, color: "text-foreground" },
  ]
  const configRows = [
    { label: tr.strategy, value: bot.strategyType },
    { label: tr.pair, value: bot.tradingPair },
    { label: tr.timeframe, value: bot.timeframe },
    { label: "Mode", value: bot.tradingMode === "LIVE" ? "💰 Live" : "🧪 Simulation" },
    { label: "Balance Type", value: bot.virtualCredit ? "Virtual Credit" : "Real Funds" },
    { label: tr.initialBal, value: `$${fmt(bot.initialBalance)}` },
    { label: tr.stopLoss, value: bot.stopLossPercentage != null ? `${bot.stopLossPercentage}%` : "—" },
    { label: tr.takeProfit, value: bot.takeProfitPercentage != null ? `${bot.takeProfitPercentage}%` : "—" },
    { label: tr.maxPosition, value: `${bot.maxPositionSizePercentage}%` },
    { label: tr.pointsPerTrade, value: String(bot.pointsPerDay ?? "1") },
    { label: tr.lastRun, value: bot.lastExecutionTime ? fmtTime(bot.lastExecutionTime) : "—" },
    { label: tr.nextRun, value: bot.nextExecutionTime ? fmtTime(bot.nextExecutionTime) : "—" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        <div className="mb-4 sm:mb-6">
          <Link href="/bots" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {tr.backToBots}
          </Link>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-bold truncate">{bot.name}</h1>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${sc.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                <span className={`font-medium ${STRATEGY_COLORS[bot.strategyType]}`}>{bot.strategyType}</span>
                <span>•</span><span>{bot.tradingPair}</span><span>•</span><span>{bot.timeframe}</span>
                <span>•</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${bot.tradingMode === "LIVE" ? "bg-green-500/10 text-green-600 border-green-500/30" : "bg-violet-500/10 text-violet-500 border-violet-500/20"}`}>
                  {bot.tradingMode === "LIVE" ? "LIVE" : "SIM"}
                </span>
                {bot.virtualCredit && bot.tradingMode === "SIMULATION" && (
                  <span className="text-[10px] text-muted-foreground">Virtual Credit</span>
                )}
                {bot.startedAt && <><span>•</span><span className="hidden sm:inline">Started {new Date(bot.startedAt).toLocaleDateString()}</span></>}
              </div>
            </div>
            {/* Desktop */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={fetchAll} className="gap-1.5"><RefreshCw className="w-3.5 h-3.5" />{tr.refresh}</Button>
              <Button variant="outline" size="sm"
                onClick={() => { if (bot.status === "SIMULATING") { toast.error(tr.pauseFirst); return } setShowEdit(true) }}
                className={`gap-1.5 ${bot.status === "SIMULATING" ? "opacity-50 cursor-not-allowed" : ""}`}>
                <Pencil className="w-3.5 h-3.5" />{tr.edit}
              </Button>
              {(bot.status === "CREATED" || bot.status === "PAUSED") && (
                <Button size="sm" onClick={() => botAction("start")} disabled={!!actionLoading} className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
                  {actionLoading === "start" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}{tr.start}
                </Button>
              )}
              {bot.status === "SIMULATING" && (
                <Button size="sm" variant="outline" onClick={() => botAction("pause")} disabled={!!actionLoading} className="gap-1.5 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/10">
                  {actionLoading === "pause" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pause className="w-3.5 h-3.5" />}{tr.pause}
                </Button>
              )}
              {(bot.status === "SIMULATING" || bot.status === "PAUSED") && (
                <Button size="sm" variant="outline" onClick={() => botAction("stop")} disabled={!!actionLoading} className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
                  {actionLoading === "stop" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}{tr.stop}
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handleDelete} disabled={!!actionLoading} className="gap-1.5 text-red-500 border-red-500/30 hover:bg-red-500/10">
                {actionLoading === "delete" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}{tr.delete}
              </Button>
            </div>
            {/* Mobile kebab */}
            <div className="flex sm:hidden items-center gap-2 flex-shrink-0">
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setShowMenu(!showMenu)} className="px-2"><MoreVertical className="w-4 h-4" /></Button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 w-44 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                      <button onClick={() => { setShowMenu(false); fetchAll() }} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-muted"><RefreshCw className="w-4 h-4" />{tr.refresh}</button>
                      <button onClick={() => { setShowMenu(false); if (bot.status === "SIMULATING") { toast.error(tr.pauseFirst2); return } setShowEdit(true) }} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-muted"><Pencil className="w-4 h-4" />{tr.editConfig}</button>
                      {(bot.status === "CREATED" || bot.status === "PAUSED") && <button onClick={() => botAction("start")} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-muted text-green-600"><Play className="w-4 h-4" />{tr.startBot}</button>}
                      {bot.status === "SIMULATING" && <button onClick={() => botAction("pause")} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-muted text-yellow-600"><Pause className="w-4 h-4" />{tr.pauseBot}</button>}
                      {(bot.status === "SIMULATING" || bot.status === "PAUSED") && <button onClick={() => botAction("stop")} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-muted text-destructive"><Square className="w-4 h-4" />{tr.stopBot}</button>}
                      <div className="border-t border-border" />
                      <button onClick={handleDelete} className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-red-500/10 text-red-500">
                        {actionLoading === "delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}{tr.deleteBot}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="p-4 sm:p-5 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{tr.balance}</p>
            <p className="text-xl sm:text-2xl font-bold font-mono">${fmt(bot.currentBalance)}</p>
            <p className="text-xs text-muted-foreground mt-1">{tr.init}: ${fmt(bot.initialBalance)}</p>
          </Card>
          <Card className={`p-4 sm:p-5 border ${pnlPos ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}>
            <p className="text-xs text-muted-foreground mb-1">{tr.totalPnl}</p>
            <p className={`text-xl sm:text-2xl font-bold font-mono ${pnlPos ? "text-green-500" : "text-destructive"}`}>{pnlPos ? "+" : ""}${fmt(bot.totalPnl)}</p>
            <p className={`text-xs mt-1 ${pnlPos ? "text-green-600" : "text-destructive"}`}>{pnlPos ? "+" : ""}{fmt(bot.totalPnlPercentage)}%</p>
          </Card>
          <Card className="p-4 sm:p-5 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{tr.winRate}</p>
            <p className="text-xl sm:text-2xl font-bold">{stats?.winRate != null ? `${stats.winRate.toFixed(1)}%` : "—"}</p>
            <p className="text-xs text-muted-foreground mt-1">{stats ? `${stats.winningTrades}W/${stats.losingTrades}L` : tr.noTrades}</p>
          </Card>
          <Card className="p-4 sm:p-5 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{tr.trades}</p>
            <p className="text-xl sm:text-2xl font-bold">{bot.totalTrades}</p>
            <p className="text-xs text-muted-foreground mt-1">{bot.openPositions} {tr.open}</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 border-b border-border overflow-x-auto">
          {(["overview", "trades", "positions"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {tab === "overview" ? tr.overview : tab === "trades" ? tr.tradesTab : tr.positionsTab}
              {tab === "trades" && bot.totalTrades > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-muted text-xs">{bot.totalTrades}</span>}
              {tab === "positions" && bot.openPositions > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-600 text-xs">{bot.openPositions}</span>}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6 border border-border">
              <div className="flex items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 shrink-0">
                  <h2 className="font-semibold text-sm sm:text-base">{bot.tradingPair}</h2>
                  {candleLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
                </div>
                <div className="flex gap-1 overflow-x-auto">
                  {TFS.map(tf => (
                    <button key={tf} onClick={() => setCandleTimeframe(tf)}
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap flex-shrink-0 ${candleTimeframe === tf ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <CandlestickChart candles={candles} trades={trades} symbol={bot.tradingPair} tr={tr} />
            </Card>

            <Card className="p-4 sm:p-6 border border-border">
              <h2 className="font-semibold text-sm sm:text-base mb-1">{tr.equityCurve}</h2>
              <p className="text-xs text-muted-foreground mb-3">{tr.hourlySnapshots}</p>
              <EquityChart data={snapshots} initialBalance={bot.initialBalance} tr={tr} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-6 border border-border">
                <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base"><BarChart2 className="w-4 h-4 text-primary" /> {tr.performance}</h2>
                {stats ? (
                  <div className="space-y-2">
                    {perfRows.map(row => (
                      <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                        <span className="text-xs sm:text-sm text-muted-foreground">{row.label}</span>
                        <span className={`text-xs sm:text-sm font-semibold font-mono ${row.color}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">{tr.noStats}</p>}
              </Card>

              <Card className="p-4 sm:p-6 border border-border">
                <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base"><Settings2 className="w-4 h-4 text-primary" /> {tr.configuration}</h2>
                <div className="space-y-2">
                  {configRows.map(row => (
                    <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                      <span className="text-xs sm:text-sm text-muted-foreground">{row.label}</span>
                      <span className="text-xs sm:text-sm font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 sm:p-6 border border-border lg:col-span-2">
                <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base"><BarChart2 className="w-4 h-4 text-primary" /> {tr.indicatorConditions}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">{tr.entryConditions}</p>
                    {conditions.entryConditions.length === 0
                      ? <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/40 border border-border">{tr.defaultStrategyLogic}</p>
                      : <div className="space-y-1.5">{conditions.entryConditions.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/5 border border-green-500/20 text-xs">
                          {i > 0 && <span className="text-xs font-bold text-muted-foreground">{c.logicalOperator}</span>}
                          <span className="font-medium text-foreground">{c.indicatorName}</span>
                          <span className="text-muted-foreground">{c.operator}</span>
                          <span className="font-mono font-semibold text-green-600">{c.comparisonValue}</span>
                        </div>
                      ))}</div>
                    }
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">{tr.exitConditions}</p>
                    {conditions.exitConditions.length === 0
                      ? <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/40 border border-border">{tr.slTpOnly}</p>
                      : <div className="space-y-1.5">{conditions.exitConditions.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/20 text-xs">
                          {i > 0 && <span className="text-xs font-bold text-muted-foreground">{c.logicalOperator}</span>}
                          <span className="font-medium text-foreground">{c.indicatorName}</span>
                          <span className="text-muted-foreground">{c.operator}</span>
                          <span className="font-mono font-semibold text-red-500">{c.comparisonValue}</span>
                        </div>
                      ))}</div>
                    }
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Trades Tab */}
        {activeTab === "trades" && (
          <TradesTable trades={trades} tradePage={tradePage} totalTradePage={totalTradePage}
            onPrev={() => setTradePage(p => p - 1)} onNext={() => setTradePage(p => p + 1)} tr={tr} />
        )}

        {/* Positions Tab */}
        {activeTab === "positions" && (
          <Card className="border border-border overflow-hidden">
            {positions.length === 0 ? (
              <div className="p-12 text-center"><Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">{tr.noOpenPositions}</p></div>
            ) : (
              <>
                <div className="block sm:hidden divide-y divide-border">
                  {positions.map(pos => {
                    const pp = (pos.unrealizedPnl ?? 0) >= 0
                    return (
                      <div key={pos.id} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{pos.symbol}</span>
                          {pos.unrealizedPnl != null && (
                            <span className={`text-sm font-semibold font-mono ${pp ? "text-green-500" : "text-destructive"}`}>
                              {pp ? "+" : ""}${fmt(pos.unrealizedPnl)}
                              {pos.unrealizedPnlPercentage != null && <span className="text-xs ml-1">({pp ? "+" : ""}{fmt(pos.unrealizedPnlPercentage)}%)</span>}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div><span className="block font-mono text-foreground">{fmt(pos.quantity, 6)}</span>{tr.quantity}</div>
                          <div><span className="block font-mono text-foreground">${fmt(pos.entryPrice)}</span>{tr.entryPrice}</div>
                          <div><span className="block font-mono text-foreground">{pos.currentPrice ? `$${fmt(pos.currentPrice)}` : "—"}</span>{tr.currentPrice}</div>
                          <div><span className="block font-mono text-foreground">${fmt(pos.entryValue)}</span>{tr.entryValue}</div>
                        </div>
                        <p className="text-xs text-muted-foreground">{fmtTime(pos.openedAt)}</p>
                      </div>
                    )
                  })}
                </div>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {[tr.symbol, tr.quantity, tr.entryPrice, tr.currentPrice, tr.entryValue, tr.currentValue, tr.unrealizedPnlCol, tr.opened].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map(pos => {
                        const pp = (pos.unrealizedPnl ?? 0) >= 0
                        return (
                          <tr key={pos.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-semibold">{pos.symbol}</td>
                            <td className="px-4 py-3 text-sm font-mono">{fmt(pos.quantity, 6)}</td>
                            <td className="px-4 py-3 text-sm font-mono">${fmt(pos.entryPrice)}</td>
                            <td className="px-4 py-3 text-sm font-mono">{pos.currentPrice != null ? `$${fmt(pos.currentPrice)}` : "—"}</td>
                            <td className="px-4 py-3 text-sm font-mono">${fmt(pos.entryValue)}</td>
                            <td className="px-4 py-3 text-sm font-mono">{pos.currentValue != null ? `$${fmt(pos.currentValue)}` : "—"}</td>
                            <td className="px-4 py-3 text-sm font-mono">
                              {pos.unrealizedPnl != null ? (
                                <span className={pp ? "text-green-500" : "text-destructive"}>
                                  {pp ? "+" : ""}${fmt(pos.unrealizedPnl)}
                                  {pos.unrealizedPnlPercentage != null && <span className="text-xs ml-1">({pp ? "+" : ""}{fmt(pos.unrealizedPnlPercentage)}%)</span>}
                                </span>
                              ) : "—"}
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">{fmtTime(pos.openedAt)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        )}
      </main>
      {showEdit && bot && <EditBotModal bot={bot} onClose={() => setShowEdit(false)} onUpdated={fetchAll} tr={tr} />}
      {showDeleteModal && bot && (
        <DeleteBotModal
          botName={bot.name}
          tr={tr}
          onConfirm={confirmDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}