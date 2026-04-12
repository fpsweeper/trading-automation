"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Plus, Play, Pause, Square, Eye, TrendingUp, TrendingDown,
  Activity, Bot, Coins, RefreshCw, AlertCircle, Loader2,
  X, ChevronRight, ChevronLeft, Zap, Clock,
  BarChart2, Layers, Shield, Check, ChevronsUpDown, Sparkles, Star
} from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { triggerNotificationRefresh } from "@/lib/notifyRefresh"
import { useLanguage } from "@/contexts/LanguageContext"

// ─── Translations ───────────────────────────────────────────────────────────

const translations = {
  en: {
    title: "Bot Management", subtitle: "Create and manage your simulation trading bots",
    refresh: "Refresh", createBot: "Create Bot", create: "Create",
    totalBots: "Total Bots", totalTrades: "Total Trades", openPositions: "Open Positions",
    running: "running", allTime: "All time", currentlyActive: "Currently active",
    filterAll: "All", filterRunning: "Running", filterPaused: "Paused", filterStopped: "Stopped", filterReady: "Ready",
    noBots: "No bots yet", noBotsDesc: "Create your first simulation bot to start trading automatically", createFirstBot: "Create Your First Bot",
    view: "View", start: "Start", pause: "Pause", stop: "Stop", delete: "Delete",
    deleteConfirm: "Delete this bot? All trade history will be lost. This cannot be undone.",
    balance: "Balance", pnl: "P&L", trades: "Trades", openPos: "Open Pos.",
    lastRun: "Last run",
    // Create bot modal
    createNewBot: "Create New Bot", chooseTemplate: "Choose a template", stepOf: "Step",
    suggestedConfigs: "Suggested Configurations", suggestedDesc: "Pick a template to pre-fill your bot settings, or start from scratch.",
    skipManual: "Skip — configure manually",
    chooseStrategy: "Choose Strategy", preFilledFrom: "Pre-filled from", template: "template",
    basicConfig: "Basic Configuration",
    botName: "Bot Name *", botNamePlaceholder: "e.g. BTC RSI Scalper",
    description: "Description", descPlaceholder: "Optional",
    tradingPair: "Trading Pair", selectPair: "Select pair...", searchPair: "Search pair... e.g. BTC, ETH", noPair: "No pair found.",
    timeframe: "Timeframe", initialBalance: "Initial Balance ($)",
    simulationMode: "Simulation Mode", liveMode: "Live (Coming Soon)",
    virtualCreditNote: "Free $1,000 virtual credit — no real money involved",
    riskSettings: "Risk Settings",
    stopLoss: "Stop Loss (%)", takeProfit: "Take Profit (%)", maxPosition: "Max Position Size (%)",
    slTpNote: "Stop loss and take profit are checked on every execution cycle.",
    indicatorConditions: "Indicator Conditions",
    indicatorDesc: "Leave empty to use the strategy's built-in default logic.",
    preFilledNote: "Conditions pre-filled from template. You can modify them below.",
    entryConditions: "Entry Conditions", exitConditions: "Exit Conditions",
    noEntryConditions: "No conditions — using default strategy logic",
    noExitConditions: "No conditions — using stop loss / take profit only",
    add: "Add", cancel: "Cancel", templates: "Templates", back: "Back", next: "Next",
    creating: "Creating...", createBotBtn: "Create Bot",
    botCreated: "created!", botNameRequired: "Bot name is required", failedCreate: "Failed to create bot",
    loading: "Loading...",
    // Difficulty
    beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced",
    entryCondition: "entry condition", entryConditions2: "entry conditions",
    // Strategies
    dcaDesc: "Dollar Cost Averaging — buy at regular intervals based on indicators",
    gridDesc: "Grid Trading — place buy/sell orders at fixed price intervals",
    scalpDesc: "Scalping — fast in-and-out trades capturing small price moves",
    costPerTrade: "1 pt / trade",
  },
  fr: {
    title: "Gestion des bots", subtitle: "Créez et gérez vos bots de trading en simulation",
    refresh: "Actualiser", createBot: "Créer un bot", create: "Créer",
    totalBots: "Total bots", totalTrades: "Total trades", openPositions: "Positions ouvertes",
    running: "en cours", allTime: "Depuis toujours", currentlyActive: "Actuellement actifs",
    filterAll: "Tous", filterRunning: "En cours", filterPaused: "En pause", filterStopped: "Arrêtés", filterReady: "Prêts",
    noBots: "Pas encore de bots", noBotsDesc: "Créez votre premier bot de simulation pour commencer à trader automatiquement", createFirstBot: "Créer mon premier bot",
    view: "Voir", start: "Démarrer", pause: "Pause", stop: "Arrêter", delete: "Supprimer",
    deleteConfirm: "Supprimer ce bot ? Tout l'historique des trades sera perdu. Cette action est irréversible.",
    balance: "Solde", pnl: "P&L", trades: "Trades", openPos: "Pos. ouvertes",
    lastRun: "Dernière exécution",
    createNewBot: "Créer un nouveau bot", chooseTemplate: "Choisir un modèle", stepOf: "Étape",
    suggestedConfigs: "Configurations suggérées", suggestedDesc: "Choisissez un modèle pour pré-remplir vos paramètres, ou commencez de zéro.",
    skipManual: "Ignorer — configurer manuellement",
    chooseStrategy: "Choisir la stratégie", preFilledFrom: "Pré-rempli depuis", template: "modèle",
    basicConfig: "Configuration de base",
    botName: "Nom du bot *", botNamePlaceholder: "ex. BTC RSI Scalper",
    description: "Description", descPlaceholder: "Optionnel",
    tradingPair: "Paire de trading", selectPair: "Sélectionner une paire...", searchPair: "Rechercher... ex. BTC, ETH", noPair: "Aucune paire trouvée.",
    timeframe: "Intervalle de temps", initialBalance: "Solde initial ($)",
    simulationMode: "Mode Simulation", liveMode: "Live (Bientôt)",
    virtualCreditNote: "Crédit virtuel gratuit de 1 000 $ — aucun argent réel",
    riskSettings: "Paramètres de risque",
    stopLoss: "Stop Loss (%)", takeProfit: "Take Profit (%)", maxPosition: "Taille max. position (%)",
    slTpNote: "Stop loss et take profit sont vérifiés à chaque cycle d'exécution.",
    indicatorConditions: "Conditions d'indicateurs",
    indicatorDesc: "Laissez vide pour utiliser la logique par défaut de la stratégie.",
    preFilledNote: "Conditions pré-remplies depuis le modèle. Vous pouvez les modifier ci-dessous.",
    entryConditions: "Conditions d'entrée", exitConditions: "Conditions de sortie",
    noEntryConditions: "Aucune condition — logique de stratégie par défaut",
    noExitConditions: "Aucune condition — stop loss / take profit uniquement",
    add: "Ajouter", cancel: "Annuler", templates: "Modèles", back: "Retour", next: "Suivant",
    creating: "Création...", createBotBtn: "Créer le bot",
    botCreated: "créé !", botNameRequired: "Le nom du bot est requis", failedCreate: "Échec de la création du bot",
    loading: "Chargement...",
    beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé",
    entryCondition: "condition d'entrée", entryConditions2: "conditions d'entrée",
    dcaDesc: "Dollar Cost Averaging — achat à intervalles réguliers selon les indicateurs",
    gridDesc: "Trading en grille — ordres d'achat/vente à des intervalles de prix fixes",
    scalpDesc: "Scalping — trades rapides capturant de petits mouvements de prix",
    costPerTrade: "1 pt / trade",
  },
  es: {
    title: "Gestión de bots", subtitle: "Crea y gestiona tus bots de trading en simulación",
    refresh: "Actualizar", createBot: "Crear bot", create: "Crear",
    totalBots: "Total bots", totalTrades: "Total trades", openPositions: "Posiciones abiertas",
    running: "en ejecución", allTime: "Desde siempre", currentlyActive: "Actualmente activos",
    filterAll: "Todos", filterRunning: "En ejecución", filterPaused: "En pausa", filterStopped: "Detenidos", filterReady: "Listos",
    noBots: "Aún no hay bots", noBotsDesc: "Crea tu primer bot de simulación para comenzar a operar automáticamente", createFirstBot: "Crear mi primer bot",
    view: "Ver", start: "Iniciar", pause: "Pausar", stop: "Detener", delete: "Eliminar",
    deleteConfirm: "¿Eliminar este bot? Se perderá todo el historial de trades. Esta acción no se puede deshacer.",
    balance: "Saldo", pnl: "P&L", trades: "Trades", openPos: "Pos. abiertas",
    lastRun: "Última ejecución",
    createNewBot: "Crear nuevo bot", chooseTemplate: "Elegir plantilla", stepOf: "Paso",
    suggestedConfigs: "Configuraciones sugeridas", suggestedDesc: "Elige una plantilla para rellenar tu configuración, o empieza desde cero.",
    skipManual: "Omitir — configurar manualmente",
    chooseStrategy: "Elegir estrategia", preFilledFrom: "Pre-rellenado desde", template: "plantilla",
    basicConfig: "Configuración básica",
    botName: "Nombre del bot *", botNamePlaceholder: "ej. BTC RSI Scalper",
    description: "Descripción", descPlaceholder: "Opcional",
    tradingPair: "Par de trading", selectPair: "Seleccionar par...", searchPair: "Buscar... ej. BTC, ETH", noPair: "Par no encontrado.",
    timeframe: "Intervalo de tiempo", initialBalance: "Saldo inicial ($)",
    simulationMode: "Modo Simulación", liveMode: "Live (Próximamente)",
    virtualCreditNote: "Crédito virtual gratuito de $1,000 — sin dinero real",
    riskSettings: "Configuración de riesgo",
    stopLoss: "Stop Loss (%)", takeProfit: "Take Profit (%)", maxPosition: "Tamaño máx. posición (%)",
    slTpNote: "Stop loss y take profit se comprueban en cada ciclo de ejecución.",
    indicatorConditions: "Condiciones de indicadores",
    indicatorDesc: "Deja vacío para usar la lógica predeterminada de la estrategia.",
    preFilledNote: "Condiciones pre-rellenadas desde la plantilla. Puedes modificarlas abajo.",
    entryConditions: "Condiciones de entrada", exitConditions: "Condiciones de salida",
    noEntryConditions: "Sin condiciones — lógica de estrategia predeterminada",
    noExitConditions: "Sin condiciones — solo stop loss / take profit",
    add: "Agregar", cancel: "Cancelar", templates: "Plantillas", back: "Atrás", next: "Siguiente",
    creating: "Creando...", createBotBtn: "Crear bot",
    botCreated: "creado!", botNameRequired: "El nombre del bot es obligatorio", failedCreate: "Error al crear el bot",
    loading: "Cargando...",
    beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado",
    entryCondition: "condición de entrada", entryConditions2: "condiciones de entrada",
    dcaDesc: "Dollar Cost Averaging — compra a intervalos regulares según indicadores",
    gridDesc: "Trading en cuadrícula — órdenes de compra/venta a intervalos de precio fijos",
    scalpDesc: "Scalping — trades rápidos capturando pequeños movimientos de precio",
    costPerTrade: "1 pt / trade",
  },
  de: {
    title: "Bot-Verwaltung", subtitle: "Erstellen und verwalten Sie Ihre Simulations-Trading-Bots",
    refresh: "Aktualisieren", createBot: "Bot erstellen", create: "Erstellen",
    totalBots: "Bots gesamt", totalTrades: "Trades gesamt", openPositions: "Offene Positionen",
    running: "laufend", allTime: "Gesamt", currentlyActive: "Aktuell aktiv",
    filterAll: "Alle", filterRunning: "Laufend", filterPaused: "Pausiert", filterStopped: "Gestoppt", filterReady: "Bereit",
    noBots: "Noch keine Bots", noBotsDesc: "Erstellen Sie Ihren ersten Simulations-Bot, um automatisch zu handeln", createFirstBot: "Ersten Bot erstellen",
    view: "Ansehen", start: "Starten", pause: "Pausieren", stop: "Stoppen", delete: "Löschen",
    deleteConfirm: "Diesen Bot löschen? Der gesamte Trade-Verlauf geht verloren. Diese Aktion kann nicht rückgängig gemacht werden.",
    balance: "Guthaben", pnl: "G&V", trades: "Trades", openPos: "Offene Pos.",
    lastRun: "Letzte Ausführung",
    createNewBot: "Neuen Bot erstellen", chooseTemplate: "Vorlage wählen", stepOf: "Schritt",
    suggestedConfigs: "Vorgeschlagene Konfigurationen", suggestedDesc: "Wählen Sie eine Vorlage oder starten Sie von vorne.",
    skipManual: "Überspringen — manuell konfigurieren",
    chooseStrategy: "Strategie wählen", preFilledFrom: "Vorausgefüllt aus", template: "Vorlage",
    basicConfig: "Grundkonfiguration",
    botName: "Bot-Name *", botNamePlaceholder: "z.B. BTC RSI Scalper",
    description: "Beschreibung", descPlaceholder: "Optional",
    tradingPair: "Handelspaar", selectPair: "Paar auswählen...", searchPair: "Suchen... z.B. BTC, ETH", noPair: "Kein Paar gefunden.",
    timeframe: "Zeitrahmen", initialBalance: "Startguthaben ($)",
    simulationMode: "Simulationsmodus", liveMode: "Live (Bald verfügbar)",
    virtualCreditNote: "Kostenloses virtuelles Guthaben von $1.000 — kein echtes Geld",
    riskSettings: "Risikoeinstellungen",
    stopLoss: "Stop-Loss (%)", takeProfit: "Take-Profit (%)", maxPosition: "Max. Positionsgröße (%)",
    slTpNote: "Stop-Loss und Take-Profit werden bei jedem Ausführungszyklus geprüft.",
    indicatorConditions: "Indikatorbedingungen",
    indicatorDesc: "Leer lassen, um die Standard-Strategie-Logik zu verwenden.",
    preFilledNote: "Bedingungen aus Vorlage vorausgefüllt. Sie können sie unten ändern.",
    entryConditions: "Einstiegsbedingungen", exitConditions: "Ausstiegsbedingungen",
    noEntryConditions: "Keine Bedingungen — Standard-Strategie-Logik",
    noExitConditions: "Keine Bedingungen — nur Stop-Loss / Take-Profit",
    add: "Hinzufügen", cancel: "Abbrechen", templates: "Vorlagen", back: "Zurück", next: "Weiter",
    creating: "Wird erstellt...", createBotBtn: "Bot erstellen",
    botCreated: "erstellt!", botNameRequired: "Bot-Name ist erforderlich", failedCreate: "Bot konnte nicht erstellt werden",
    loading: "Laden...",
    beginner: "Anfänger", intermediate: "Fortgeschritten", advanced: "Experte",
    entryCondition: "Einstiegsbedingung", entryConditions2: "Einstiegsbedingungen",
    dcaDesc: "Dollar Cost Averaging — Kauf in regelmäßigen Abständen basierend auf Indikatoren",
    gridDesc: "Grid-Trading — Kauf-/Verkaufsaufträge in festen Preisintervallen",
    scalpDesc: "Scalping — schnelle Trades, die kleine Preisbewegungen erfassen",
    costPerTrade: "1 Pt. / Trade",
  },
  ja: {
    title: "ボット管理", subtitle: "シミュレーション取引ボットの作成と管理",
    refresh: "更新", createBot: "ボット作成", create: "作成",
    totalBots: "総ボット数", totalTrades: "総取引数", openPositions: "オープンポジション",
    running: "実行中", allTime: "全期間", currentlyActive: "現在アクティブ",
    filterAll: "すべて", filterRunning: "実行中", filterPaused: "一時停止", filterStopped: "停止済み", filterReady: "準備完了",
    noBots: "ボットがありません", noBotsDesc: "最初のシミュレーションボットを作成して自動取引を始めましょう", createFirstBot: "最初のボットを作成",
    view: "表示", start: "開始", pause: "一時停止", stop: "停止", delete: "削除",
    deleteConfirm: "このボットを削除しますか？すべての取引履歴が失われます。この操作は元に戻せません。",
    balance: "残高", pnl: "損益", trades: "取引", openPos: "未決済",
    lastRun: "最終実行",
    createNewBot: "新しいボットを作成", chooseTemplate: "テンプレートを選択", stepOf: "ステップ",
    suggestedConfigs: "推奨設定", suggestedDesc: "テンプレートを選んで設定を事前入力するか、ゼロから始めてください。",
    skipManual: "スキップ — 手動で設定",
    chooseStrategy: "戦略を選択", preFilledFrom: "テンプレートから事前入力", template: "テンプレート",
    basicConfig: "基本設定",
    botName: "ボット名 *", botNamePlaceholder: "例: BTC RSI Scalper",
    description: "説明", descPlaceholder: "任意",
    tradingPair: "取引ペア", selectPair: "ペアを選択...", searchPair: "検索... 例: BTC, ETH", noPair: "ペアが見つかりません。",
    timeframe: "時間枠", initialBalance: "初期残高 ($)",
    simulationMode: "シミュレーションモード", liveMode: "ライブ (近日公開)",
    virtualCreditNote: "無料の仮想クレジット $1,000 — 実際のお金は不要",
    riskSettings: "リスク設定",
    stopLoss: "ストップロス (%)", takeProfit: "テイクプロフィット (%)", maxPosition: "最大ポジションサイズ (%)",
    slTpNote: "ストップロスとテイクプロフィットは実行サイクルごとに確認されます。",
    indicatorConditions: "インジケーター条件",
    indicatorDesc: "空白のままにすると戦略のデフォルトロジックが使用されます。",
    preFilledNote: "テンプレートから条件が事前入力されています。以下で変更できます。",
    entryConditions: "エントリー条件", exitConditions: "エグジット条件",
    noEntryConditions: "条件なし — デフォルト戦略ロジックを使用",
    noExitConditions: "条件なし — ストップロス / テイクプロフィットのみ",
    add: "追加", cancel: "キャンセル", templates: "テンプレート", back: "戻る", next: "次へ",
    creating: "作成中...", createBotBtn: "ボットを作成",
    botCreated: "が作成されました！", botNameRequired: "ボット名は必須です", failedCreate: "ボットの作成に失敗しました",
    loading: "読み込み中...",
    beginner: "初心者", intermediate: "中級", advanced: "上級",
    entryCondition: "エントリー条件", entryConditions2: "エントリー条件",
    dcaDesc: "ドルコスト平均 — インジケーターに基づいて定期的に購入",
    gridDesc: "グリッドトレーディング — 固定価格間隔で売買注文",
    scalpDesc: "スキャルピング — 小さな価格変動を捉える高速取引",
    costPerTrade: "1pt / 取引",
  },
  pt: {
    title: "Gerenciamento de bots", subtitle: "Crie e gerencie seus bots de trading em simulação",
    refresh: "Atualizar", createBot: "Criar bot", create: "Criar",
    totalBots: "Total de bots", totalTrades: "Total de trades", openPositions: "Posições abertas",
    running: "em execução", allTime: "Desde sempre", currentlyActive: "Atualmente ativos",
    filterAll: "Todos", filterRunning: "Em execução", filterPaused: "Em pausa", filterStopped: "Parados", filterReady: "Prontos",
    noBots: "Nenhum bot ainda", noBotsDesc: "Crie seu primeiro bot de simulação para começar a operar automaticamente", createFirstBot: "Criar meu primeiro bot",
    view: "Ver", start: "Iniciar", pause: "Pausar", stop: "Parar", delete: "Excluir",
    deleteConfirm: "Excluir este bot? Todo o histórico de trades será perdido. Esta ação não pode ser desfeita.",
    balance: "Saldo", pnl: "L&P", trades: "Trades", openPos: "Pos. abertas",
    lastRun: "Última execução",
    createNewBot: "Criar novo bot", chooseTemplate: "Escolher modelo", stepOf: "Passo",
    suggestedConfigs: "Configurações sugeridas", suggestedDesc: "Escolha um modelo para pré-preencher suas configurações ou comece do zero.",
    skipManual: "Pular — configurar manualmente",
    chooseStrategy: "Escolher estratégia", preFilledFrom: "Pré-preenchido de", template: "modelo",
    basicConfig: "Configuração básica",
    botName: "Nome do bot *", botNamePlaceholder: "ex. BTC RSI Scalper",
    description: "Descrição", descPlaceholder: "Opcional",
    tradingPair: "Par de trading", selectPair: "Selecionar par...", searchPair: "Buscar... ex. BTC, ETH", noPair: "Par não encontrado.",
    timeframe: "Intervalo de tempo", initialBalance: "Saldo inicial ($)",
    simulationMode: "Modo Simulação", liveMode: "Live (Em breve)",
    virtualCreditNote: "Crédito virtual gratuito de $1.000 — sem dinheiro real",
    riskSettings: "Configurações de risco",
    stopLoss: "Stop Loss (%)", takeProfit: "Take Profit (%)", maxPosition: "Tamanho máx. posição (%)",
    slTpNote: "Stop loss e take profit são verificados em cada ciclo de execução.",
    indicatorConditions: "Condições de indicadores",
    indicatorDesc: "Deixe vazio para usar a lógica padrão da estratégia.",
    preFilledNote: "Condições pré-preenchidas do modelo. Você pode modificá-las abaixo.",
    entryConditions: "Condições de entrada", exitConditions: "Condições de saída",
    noEntryConditions: "Sem condições — lógica de estratégia padrão",
    noExitConditions: "Sem condições — apenas stop loss / take profit",
    add: "Adicionar", cancel: "Cancelar", templates: "Modelos", back: "Voltar", next: "Próximo",
    creating: "Criando...", createBotBtn: "Criar bot",
    botCreated: "criado!", botNameRequired: "O nome do bot é obrigatório", failedCreate: "Falha ao criar bot",
    loading: "Carregando...",
    beginner: "Iniciante", intermediate: "Intermediário", advanced: "Avançado",
    entryCondition: "condição de entrada", entryConditions2: "condições de entrada",
    dcaDesc: "Dollar Cost Averaging — compra em intervalos regulares com base em indicadores",
    gridDesc: "Grid Trading — ordens de compra/venda em intervalos de preço fixos",
    scalpDesc: "Scalping — trades rápidos capturando pequenos movimentos de preço",
    costPerTrade: "1 pt / trade",
  },
  zh: {
    title: "机器人管理", subtitle: "创建和管理您的模拟交易机器人",
    refresh: "刷新", createBot: "创建机器人", create: "创建",
    totalBots: "机器人总数", totalTrades: "总交易次数", openPositions: "未平仓位",
    running: "运行中", allTime: "历史总计", currentlyActive: "当前活跃",
    filterAll: "全部", filterRunning: "运行中", filterPaused: "已暂停", filterStopped: "已停止", filterReady: "准备就绪",
    noBots: "暂无机器人", noBotsDesc: "创建您的第一个模拟交易机器人，开始自动交易", createFirstBot: "创建第一个机器人",
    view: "查看", start: "启动", pause: "暂停", stop: "停止", delete: "删除",
    deleteConfirm: "删除此机器人？所有交易历史将丢失，此操作无法撤销。",
    balance: "余额", pnl: "盈亏", trades: "交易", openPos: "未平仓",
    lastRun: "上次运行",
    createNewBot: "创建新机器人", chooseTemplate: "选择模板", stepOf: "步骤",
    suggestedConfigs: "推荐配置", suggestedDesc: "选择模板预填设置，或从头开始配置。",
    skipManual: "跳过 — 手动配置",
    chooseStrategy: "选择策略", preFilledFrom: "从模板预填", template: "模板",
    basicConfig: "基本配置",
    botName: "机器人名称 *", botNamePlaceholder: "例如 BTC RSI Scalper",
    description: "描述", descPlaceholder: "可选",
    tradingPair: "交易对", selectPair: "选择交易对...", searchPair: "搜索... 例如 BTC, ETH", noPair: "未找到交易对。",
    timeframe: "时间框架", initialBalance: "初始余额 ($)",
    simulationMode: "模拟模式", liveMode: "实盘（即将推出）",
    virtualCreditNote: "免费虚拟额度 $1,000 — 无需真实资金",
    riskSettings: "风险设置",
    stopLoss: "止损 (%)", takeProfit: "止盈 (%)", maxPosition: "最大仓位大小 (%)",
    slTpNote: "止损和止盈在每个执行周期检查。",
    indicatorConditions: "指标条件",
    indicatorDesc: "留空以使用策略的内置默认逻辑。",
    preFilledNote: "条件已从模板预填。您可以在下方修改。",
    entryConditions: "入场条件", exitConditions: "出场条件",
    noEntryConditions: "无条件 — 使用默认策略逻辑",
    noExitConditions: "无条件 — 仅使用止损/止盈",
    add: "添加", cancel: "取消", templates: "模板", back: "返回", next: "下一步",
    creating: "创建中...", createBotBtn: "创建机器人",
    botCreated: "已创建！", botNameRequired: "机器人名称是必填项", failedCreate: "创建机器人失败",
    loading: "加载中...",
    beginner: "初级", intermediate: "中级", advanced: "高级",
    entryCondition: "入场条件", entryConditions2: "入场条件",
    dcaDesc: "定投 — 根据指标定期买入",
    gridDesc: "网格交易 — 在固定价格间隔下单买卖",
    scalpDesc: "剥头皮 — 捕捉小价格波动的快速交易",
    costPerTrade: "1积分 / 交易",
  },
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface BotResponse {
  id: string; name: string; description?: string
  strategyType: "DCA" | "GRID" | "SCALPING"; tradingPair: string; timeframe: string
  status: "CREATED" | "SIMULATING" | "PAUSED" | "STOPPED" | "DELETED"
  initialBalance: number; currentBalance: number; totalPnl: number; totalPnlPercentage: number
  stopLossPercentage?: number; takeProfitPercentage?: number; maxPositionSizePercentage: number
  totalTrades: number; openPositions: number; createdAt: string; startedAt?: string
  lastExecutionTime?: string; nextExecutionTime?: string; pointsPerDay?: number
  tradingMode: "SIMULATION" | "LIVE"; virtualCredit: boolean
}
interface CreateBotForm {
  name: string; description: string; strategyType: "DCA" | "GRID" | "SCALPING"; tradingPair: string; timeframe: string
  initialBalance: number; stopLossPercentage: number; takeProfitPercentage: number
  maxPositionSizePercentage: number; pointsPerDay: number
  tradingMode: "SIMULATION" | "LIVE"
  entryConditions: ConditionForm[]; exitConditions: ConditionForm[]
}
interface ConditionForm { indicatorName: string; operator: string; comparisonValue: number; logicalOperator: "AND" | "OR" }
interface SuggestedConfig {
  id: string; name: string; description: string; tag: string; tagColor: string
  icon: React.ReactNode; difficulty: "Beginner" | "Intermediate" | "Advanced"
  expectedFrequency: string; preset: Partial<CreateBotForm>
}

// ─── Constants ─────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL
const TIMEFRAMES = ["5m", "15m", "30m", "1h", "4h", "1d"]
const INDICATORS = ["RSI_14", "RSI_7", "MACD", "MACD_HISTOGRAM", "MA_20", "MA_50", "MA_200", "EMA_12", "BB_UPPER", "BB_LOWER", "CLOSE_PRICE"]
const OPERATORS = [
  { value: ">", label: "Greater than (>)" }, { value: "<", label: "Less than (<)" },
  { value: ">=", label: "Greater or equal (>=)" }, { value: "<=", label: "Less or equal (<=)" },
  { value: "crosses_above", label: "Crosses above" }, { value: "crosses_below", label: "Crosses below" },
]

const DIFFICULTY_COLORS = { Beginner: "text-green-600 bg-green-500/10", Intermediate: "text-yellow-600 bg-yellow-500/10", Advanced: "text-red-600 bg-red-500/10" }

// ─── Helpers ───────────────────────────────────────────────────────────────

function authHeader() {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
}
function fmt(n: number, decimals = 2) {
  return n?.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) ?? "0.00"
}

const defaultForm: CreateBotForm = {
  name: "", description: "", strategyType: "DCA", tradingPair: "BTCUSDT", timeframe: "5m",
  initialBalance: 1000, stopLossPercentage: 5, takeProfitPercentage: 10,
  maxPositionSizePercentage: 20, pointsPerDay: 1, tradingMode: "SIMULATION",
  entryConditions: [], exitConditions: [],
}

// ─── Create Bot Modal ──────────────────────────────────────────────────────

function CreateBotModal({ onClose, onCreated, tr, remainingCredit = 1000 }: { onClose: () => void; onCreated: () => void; tr: typeof translations.en; remainingCredit?: number }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CreateBotForm>({ ...defaultForm, initialBalance: Math.min(remainingCredit, 1000) })
  const [pairs, setPairs] = useState<string[]>([])
  const [loadingPairs, setLoadingPairs] = useState(true)
  const [pairOpen, setPairOpen] = useState(false)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const totalConfigSteps = 4

  // Build suggested configs using translated difficulty labels
  const difficultyLabel = (d: "Beginner" | "Intermediate" | "Advanced") => {
    if (d === "Beginner") return tr.beginner
    if (d === "Intermediate") return tr.intermediate
    return tr.advanced
  }

  const SUGGESTED_CONFIGS: SuggestedConfig[] = [
    { id: "dca-rsi-basic", name: "RSI Dip Buyer", description: "Buys when RSI signals oversold conditions and sells on recovery. Classic DCA with RSI filter.", tag: "DCA", tagColor: "text-blue-500 bg-blue-500/10 border-blue-500/20", icon: <Coins className="w-5 h-5 text-blue-500" />, difficulty: "Beginner", expectedFrequency: "2–5 trades/day", preset: { name: "RSI Dip Buyer", strategyType: "DCA", tradingPair: "BTCUSDT", timeframe: "15m", stopLossPercentage: 3, takeProfitPercentage: 2, maxPositionSizePercentage: 25, entryConditions: [{ indicatorName: "RSI_14", operator: "<", comparisonValue: 40, logicalOperator: "AND" }, { indicatorName: "MACD_HISTOGRAM", operator: ">", comparisonValue: -100, logicalOperator: "AND" }], exitConditions: [{ indicatorName: "RSI_14", operator: ">", comparisonValue: 60, logicalOperator: "OR" }] } },
    { id: "dca-ma-trend", name: "MA Trend Follower", description: "Enters when price is above MA20 with bullish MACD. Follows the trend with momentum confirmation.", tag: "DCA", tagColor: "text-blue-500 bg-blue-500/10 border-blue-500/20", icon: <TrendingUp className="w-5 h-5 text-blue-500" />, difficulty: "Intermediate", expectedFrequency: "1–3 trades/day", preset: { name: "MA Trend Follower", strategyType: "DCA", tradingPair: "BTCUSDT", timeframe: "1h", stopLossPercentage: 4, takeProfitPercentage: 3, maxPositionSizePercentage: 30, entryConditions: [{ indicatorName: "RSI_14", operator: ">", comparisonValue: 45, logicalOperator: "AND" }, { indicatorName: "RSI_14", operator: "<", comparisonValue: 65, logicalOperator: "AND" }, { indicatorName: "MACD_HISTOGRAM", operator: ">", comparisonValue: 0, logicalOperator: "AND" }], exitConditions: [{ indicatorName: "MACD_HISTOGRAM", operator: "<", comparisonValue: 0, logicalOperator: "OR" }, { indicatorName: "RSI_14", operator: ">", comparisonValue: 70, logicalOperator: "OR" }] } },
    { id: "scalp-fast", name: "Quick Scalper", description: "Fast in-and-out trades using RSI extremes. Targets small profits with tight stops. High frequency.", tag: "SCALPING", tagColor: "text-orange-500 bg-orange-500/10 border-orange-500/20", icon: <Zap className="w-5 h-5 text-orange-500" />, difficulty: "Intermediate", expectedFrequency: "5–15 trades/day", preset: { name: "Quick Scalper", strategyType: "SCALPING", tradingPair: "ETHUSDT", timeframe: "5m", stopLossPercentage: 1, takeProfitPercentage: 0.8, maxPositionSizePercentage: 50, entryConditions: [{ indicatorName: "RSI_14", operator: "<", comparisonValue: 45, logicalOperator: "AND" }, { indicatorName: "MACD_HISTOGRAM", operator: ">", comparisonValue: 0, logicalOperator: "AND" }], exitConditions: [{ indicatorName: "RSI_14", operator: ">", comparisonValue: 60, logicalOperator: "OR" }] } },
    { id: "scalp-bb", name: "Bollinger Bouncer", description: "Buys near the lower Bollinger Band and exits near the middle. Mean reversion scalping.", tag: "SCALPING", tagColor: "text-orange-500 bg-orange-500/10 border-orange-500/20", icon: <Zap className="w-5 h-5 text-orange-500" />, difficulty: "Advanced", expectedFrequency: "3–8 trades/day", preset: { name: "Bollinger Bouncer", strategyType: "SCALPING", tradingPair: "BTCUSDT", timeframe: "15m", stopLossPercentage: 1.5, takeProfitPercentage: 1, maxPositionSizePercentage: 40, entryConditions: [{ indicatorName: "RSI_14", operator: "<", comparisonValue: 35, logicalOperator: "AND" }, { indicatorName: "MACD_HISTOGRAM", operator: ">", comparisonValue: -200, logicalOperator: "AND" }], exitConditions: [{ indicatorName: "RSI_14", operator: ">", comparisonValue: 55, logicalOperator: "OR" }] } },
    { id: "grid-ranging", name: "Grid Range Trader", description: "Places buy orders at grid levels below market price. Best in sideways, ranging markets.", tag: "GRID", tagColor: "text-purple-500 bg-purple-500/10 border-purple-500/20", icon: <Layers className="w-5 h-5 text-purple-500" />, difficulty: "Intermediate", expectedFrequency: "Varies with market", preset: { name: "Grid Range Trader", strategyType: "GRID", tradingPair: "BTCUSDT", timeframe: "30m", stopLossPercentage: 8, takeProfitPercentage: 5, maxPositionSizePercentage: 20, entryConditions: [{ indicatorName: "RSI_14", operator: ">", comparisonValue: 30, logicalOperator: "AND" }, { indicatorName: "RSI_14", operator: "<", comparisonValue: 70, logicalOperator: "AND" }], exitConditions: [] } },
    { id: "custom", name: "Custom Setup", description: "Start from scratch and configure every parameter manually. Full control over your strategy.", tag: "CUSTOM", tagColor: "text-gray-500 bg-gray-500/10 border-gray-500/20", icon: <Shield className="w-5 h-5 text-gray-500" />, difficulty: "Advanced", expectedFrequency: "Depends on config", preset: {} },
  ]

  const STRATEGY_INFO = {
    DCA: { icon: <Coins className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", desc: tr.dcaDesc, cost: tr.costPerTrade },
    GRID: { icon: <Layers className="w-5 h-5" />, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20", desc: tr.gridDesc, cost: tr.costPerTrade },
    SCALPING: { icon: <Zap className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20", desc: tr.scalpDesc, cost: tr.costPerTrade },
  }

  useEffect(() => {
    fetch(`${API}api/market-data/pairs`).then(r => r.json()).then(data => setPairs(data.pairs ?? []))
      .catch(() => setPairs(["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT"]))
      .finally(() => setLoadingPairs(false))
  }, [])

  function set(key: keyof CreateBotForm, value: unknown) { setForm(prev => ({ ...prev, [key]: value })) }
  function addCondition(type: "entryConditions" | "exitConditions") { set(type, [...form[type], { indicatorName: "RSI_14", operator: "<", comparisonValue: 30, logicalOperator: "AND" }]) }
  function removeCondition(type: "entryConditions" | "exitConditions", idx: number) { set(type, form[type].filter((_, i) => i !== idx)) }
  function updateCondition(type: "entryConditions" | "exitConditions", idx: number, key: keyof ConditionForm, value: unknown) { set(type, form[type].map((c, i) => i === idx ? { ...c, [key]: value } : c)) }

  function selectPreset(config: SuggestedConfig) {
    setSelectedPresetId(config.id)
    setForm(config.id === "custom" ? defaultForm : prev => ({ ...defaultForm, ...prev, ...config.preset, initialBalance: prev.initialBalance }))
    setStep(1)
  }

  async function handleCreate() {
    if (!form.name.trim()) { toast.error(tr.botNameRequired); return }
    setLoading(true)
    try {
      const payload = { name: form.name, description: form.description || undefined, strategyType: form.strategyType, tradingPair: form.tradingPair, timeframe: form.timeframe, initialBalance: form.initialBalance, stopLossPercentage: form.stopLossPercentage, takeProfitPercentage: form.takeProfitPercentage, maxPositionSizePercentage: form.maxPositionSizePercentage, tradingMode: form.tradingMode, entryConditions: form.entryConditions.map((c, i) => ({ ...c, conditionOrder: i })), exitConditions: form.exitConditions.map((c, i) => ({ ...c, conditionOrder: i })) }
      const res = await fetch(`${API}api/bots`, { method: "POST", headers: authHeader(), body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || tr.failedCreate)
      toast.success(`"${form.name}" ${tr.botCreated}`)
      onCreated(); onClose()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : tr.failedCreate) }
    finally { setLoading(false) }
  }

  const stepLabel = step === 0 ? tr.chooseTemplate : `${tr.stepOf} ${step} / ${totalConfigSteps}`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <Card className="w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[92vh] overflow-y-auto border-0 sm:border border-border bg-background shadow-2xl rounded-t-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{tr.createNewBot}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{stepLabel}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1"><X className="w-5 h-5" /></button>
        </div>
        {step > 0 && (
          <div className="px-4 sm:px-6 pt-4">
            <div className="flex gap-1.5">{Array.from({ length: totalConfigSteps }).map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i + 1 <= step ? "bg-primary" : "bg-border"}`} />)}</div>
          </div>
        )}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Virtual credit warning */}
          {remainingCredit <= 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
              <span className="text-base flex-shrink-0">⚠️</span>
              <p>You've used your full $1,000 virtual credit. Delete an existing bot to free up credit before creating a new one.</p>
            </div>
          )}
          {remainingCredit > 0 && remainingCredit < 200 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-600">
              <span className="text-base flex-shrink-0">⚠️</span>
              <p>Only <strong>${remainingCredit.toFixed(0)}</strong> of virtual credit remaining out of $1,000 total.</p>
            </div>
          )}
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-primary" /><h3 className="font-semibold">{tr.suggestedConfigs}</h3></div>
              <p className="text-sm text-muted-foreground">{tr.suggestedDesc}</p>
              <div className="space-y-2.5">
                {SUGGESTED_CONFIGS.map(config => (
                  <button key={config.id} onClick={() => selectPreset(config)} className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:border-primary/60 hover:bg-muted/30 ${selectedPresetId === config.id ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border flex-shrink-0 ${config.id === "custom" ? "bg-muted border-border" : config.tagColor}`}>{config.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-sm">{config.name}</span>
                          {config.id !== "custom" && <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.tagColor}`}>{config.tag}</span>}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[config.difficulty]}`}>{difficultyLabel(config.difficulty)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1.5">{config.description}</p>
                        {config.id !== "custom" && (
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{config.preset.timeframe}</span>
                            <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" />{config.expectedFrequency}</span>
                            {config.preset.entryConditions && config.preset.entryConditions.length > 0 && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Check className="w-3 h-3" />{config.preset.entryConditions.length} {config.preset.entryConditions.length > 1 ? tr.entryConditions2 : tr.entryCondition}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{tr.chooseStrategy}</h3>
              {selectedPresetId && selectedPresetId !== "custom" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                  <Star className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{tr.preFilledFrom} <span className="font-medium text-foreground">{SUGGESTED_CONFIGS.find(c => c.id === selectedPresetId)?.name}</span> {tr.template}</span>
                </div>
              )}
              <div className="space-y-3">
                {(["DCA", "GRID", "SCALPING"] as const).map(s => (
                  <button key={s} onClick={() => set("strategyType", s)} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${form.strategyType === s ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${STRATEGY_INFO[s].bg} ${STRATEGY_INFO[s].color}`}>{STRATEGY_INFO[s].icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between"><span className="font-semibold">{s}</span><span className="text-xs text-muted-foreground">{STRATEGY_INFO[s].cost}</span></div>
                        <p className="text-sm text-muted-foreground mt-0.5">{STRATEGY_INFO[s].desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{tr.basicConfig}</h3>
              <div className="space-y-3">
                <div><Label>{tr.botName}</Label><Input value={form.name} onChange={e => set("name", e.target.value)} placeholder={tr.botNamePlaceholder} className="mt-1.5" /></div>
                <div><Label>{tr.description}</Label><Input value={form.description} onChange={e => set("description", e.target.value)} placeholder={tr.descPlaceholder} className="mt-1.5" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>{tr.tradingPair}</Label>
                    <div className="mt-1.5">
                      <Popover open={pairOpen} onOpenChange={setPairOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                            {loadingPairs ? <span className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" />{tr.loading}</span> : (form.tradingPair || tr.selectPair)}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                          <Command>
                            <CommandInput placeholder={tr.searchPair} />
                            <CommandEmpty>{tr.noPair}</CommandEmpty>
                            <CommandList className="max-h-60">
                              <CommandGroup>{pairs.map(p => <CommandItem key={p} value={p} onSelect={val => { set("tradingPair", val.toUpperCase()); setPairOpen(false) }}><Check className={cn("mr-2 h-4 w-4", form.tradingPair === p ? "opacity-100" : "opacity-0")} />{p}</CommandItem>)}</CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    <Label>{tr.timeframe}</Label>
                    <select value={form.timeframe} onChange={e => set("timeframe", e.target.value)} className="mt-1.5 w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-sm">
                      {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div><Label>{tr.initialBalance}</Label><Input type="number" value={form.initialBalance} onChange={e => set("initialBalance", Math.min(remainingCredit, Math.max(100, Number(e.target.value))))} min={100} max={remainingCredit} className="mt-1.5" />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">Max ${remainingCredit.toFixed(2)} remaining</p>
                    {remainingCredit < 1000 && (
                      <p className="text-xs text-amber-500 font-medium">${(1000 - remainingCredit).toFixed(2)} already allocated</p>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="mb-2 block">Trading Mode</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => set("tradingMode", "SIMULATION")}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${form.tradingMode === "SIMULATION" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <p className="font-semibold text-sm">🧪 {tr.simulationMode}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{tr.virtualCreditNote}</p>
                    </button>
                    <button type="button" disabled
                      className="p-3 rounded-xl border-2 border-border opacity-40 cursor-not-allowed text-left">
                      <p className="font-semibold text-sm">💰 {tr.liveMode}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Real funds — coming soon</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{tr.riskSettings}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{tr.stopLoss}</Label><Input type="number" value={form.stopLossPercentage} onChange={e => set("stopLossPercentage", Number(e.target.value))} step={0.1} min={0.1} max={50} className="mt-1.5" /></div>
                <div><Label>{tr.takeProfit}</Label><Input type="number" value={form.takeProfitPercentage} onChange={e => set("takeProfitPercentage", Number(e.target.value))} step={0.1} min={0.1} max={1000} className="mt-1.5" /></div>
                <div><Label>{tr.maxPosition}</Label><Input type="number" value={form.maxPositionSizePercentage} onChange={e => set("maxPositionSizePercentage", Number(e.target.value))} step={1} min={1} max={100} className="mt-1.5" /></div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
                <Shield className="w-4 h-4 inline mr-1.5 mb-0.5" />{tr.slTpNote}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-lg">{tr.indicatorConditions}</h3>
              <p className="text-sm text-muted-foreground">{tr.indicatorDesc}</p>
              {selectedPresetId && selectedPresetId !== "custom" && (form.entryConditions.length > 0 || form.exitConditions.length > 0) && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{tr.preFilledNote}</span>
                </div>
              )}
              {(["entryConditions", "exitConditions"] as const).map(type => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className={type === "entryConditions" ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                      {type === "entryConditions" ? tr.entryConditions : tr.exitConditions}
                    </Label>
                    <Button size="sm" variant="outline" onClick={() => addCondition(type)}><Plus className="w-3 h-3 mr-1" /> {tr.add}</Button>
                  </div>
                  {form[type].length === 0 && (
                    <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/40 border border-border">
                      {type === "entryConditions" ? tr.noEntryConditions : tr.noExitConditions}
                    </p>
                  )}
                  {form[type].map((cond, idx) => (
                    <div key={idx} className="flex flex-wrap gap-1.5 items-center p-2.5 rounded-lg border border-border bg-muted/20 mb-2">
                      {idx > 0 && <select value={cond.logicalOperator} onChange={e => updateCondition(type, idx, "logicalOperator", e.target.value)} className="w-16 px-1 py-1.5 text-xs rounded bg-input border border-border text-foreground"><option value="AND">AND</option><option value="OR">OR</option></select>}
                      <select value={cond.indicatorName} onChange={e => updateCondition(type, idx, "indicatorName", e.target.value)} className="flex-1 min-w-[90px] px-2 py-1.5 text-xs rounded bg-input border border-border text-foreground">{INDICATORS.map(i => <option key={i} value={i}>{i}</option>)}</select>
                      <select value={cond.operator} onChange={e => updateCondition(type, idx, "operator", e.target.value)} className="w-28 px-2 py-1.5 text-xs rounded bg-input border border-border text-foreground">{OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                      <Input type="number" value={cond.comparisonValue} onChange={e => updateCondition(type, idx, "comparisonValue", Number(e.target.value))} className="w-20 h-8 text-xs" />
                      <button onClick={() => removeCondition(type, idx)} className="text-muted-foreground hover:text-destructive p-1"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex items-center justify-between px-4 sm:px-6 py-4 border-t border-border bg-background/95 backdrop-blur-sm">
          <Button variant="outline" onClick={() => step > 0 ? setStep(s => s - 1) : onClose()} disabled={loading}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            {step === 0 ? tr.cancel : step === 1 ? tr.templates : tr.back}
          </Button>
          {step === 0 ? (
            <Button variant="ghost" onClick={() => { setSelectedPresetId("custom"); setForm(defaultForm); setStep(1) }} className="text-muted-foreground">
              {tr.skipManual} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : step < totalConfigSteps ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={step === 2 && !form.name.trim()}>
              {tr.next} <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={loading || remainingCredit <= 0} className="bg-primary text-primary-foreground">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {loading ? tr.creating : remainingCredit <= 0 ? "No credit remaining" : tr.createBotBtn}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

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

          <p className="text-sm text-muted-foreground mb-5">
            {tr.deleteConfirm}
          </p>

          {/* Actions */}
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

export default function BotsPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const tr = translations[language as keyof typeof translations] || translations.en

  const [bots, setBots] = useState<BotResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState<"ALL" | "SIMULATING" | "PAUSED" | "STOPPED" | "CREATED">("ALL")
  const [pointsBalance, setPointsBalance] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [userCreditLimit, setUserCreditLimit] = useState(1000)

  // Total virtual credit currently allocated across all non-deleted simulation bots
  const usedVirtualCredit = bots
    .filter(b => b.virtualCredit && b.tradingMode === "SIMULATION")
    .reduce((sum, b) => sum + (b.initialBalance ?? 0), 0)
  const remainingVirtualCredit = Math.max(0, userCreditLimit - usedVirtualCredit)

  useEffect(() => { const token = localStorage.getItem("auth_token"); if (!token) router.push("/login") }, [router])

  const fetchBots = useCallback(async () => {
    try {
      const res = await fetch(`${API}api/bots`, { headers: authHeader() })
      if (res.status === 401) { router.push("/login"); return }
      const data = await res.json(); setBots(data.bots ?? [])
    } catch { toast.error("Failed to load bots") } finally { setLoading(false) }
  }, [router])

  const fetchPoints = useCallback(async () => {
    try {
      const res = await fetch(`${API}api/points/balance`, { headers: authHeader() })
      if (res.ok) { const data = await res.json(); setPointsBalance(data.points ?? 0) }
    } catch { }
  }, [])

  const fetchCreditLimit = useCallback(async () => {
    try {
      const res = await fetch(`${API}auth/me`, { headers: authHeader() })
      if (res.ok) {
        const data = await res.json()
        setUserCreditLimit(data.simulationCreditLimit ?? 1000)
      }
    } catch { }
  }, [])

  useEffect(() => { fetchBots(); fetchPoints(); fetchCreditLimit() }, [fetchBots, fetchPoints, fetchCreditLimit])
  useEffect(() => { const interval = setInterval(() => { fetchBots(); fetchPoints() }, 30000); return () => clearInterval(interval) }, [fetchBots, fetchPoints])
  useEffect(() => {
    const onFocus = () => fetchCreditLimit()
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [fetchCreditLimit])

  async function botAction(id: string, action: "start" | "pause" | "stop") {
    setActionLoading(id + action)
    try {
      const res = await fetch(`${API}api/bots/${id}/${action}`, { method: "PUT", headers: authHeader() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      if (data.bot) setBots(prev => prev.map(b => b.id === id ? { ...b, ...data.bot } : b))
      else setTimeout(fetchBots, 2000)
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Action failed") }
    finally { triggerNotificationRefresh(); setActionLoading(null) }
  }

  async function handleDelete(id: string, name: string) {
    setDeleteTarget({ id, name })
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const { id, name } = deleteTarget
    setDeleteTarget(null)
    setActionLoading(id + "delete")
    try {
      const res = await fetch(`${API}api/bots/${id}`, { method: "DELETE", headers: authHeader() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Bot "${name}" deleted`)
      setBots(prev => prev.filter(b => b.id !== id))
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed to delete bot") }
    finally { setActionLoading(null) }
  }

  const STRATEGY_INFO = {
    DCA: { icon: <Coins className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    GRID: { icon: <Layers className="w-5 h-5" />, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
    SCALPING: { icon: <Zap className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
  }

  function statusConfig(status: BotResponse["status"]) {
    switch (status) {
      case "SIMULATING": return { label: tr.filterRunning, dot: "bg-green-500 animate-pulse", badge: "bg-green-500/10 text-green-600 border-green-500/20" }
      case "PAUSED": return { label: tr.filterPaused, dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" }
      case "STOPPED": return { label: tr.filterStopped, dot: "bg-gray-400", badge: "bg-gray-500/10 text-gray-500 border-gray-500/20" }
      case "CREATED": return { label: tr.filterReady, dot: "bg-blue-500", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20" }
      default: return { label: status, dot: "bg-gray-400", badge: "bg-gray-500/10 text-gray-500 border-gray-500/20" }
    }
  }

  const filtered = filter === "ALL" ? bots : bots.filter(b => b.status === filter)
  const activeBots = bots.filter(b => b.status === "SIMULATING").length

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        <div className="flex items-start justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{tr.title}</h1>
            <p className="text-muted-foreground text-sm">{tr.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
            {pointsBalance !== null && (
              <Link href="/dashboard">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{pointsBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
              </Link>
            )}
            <Button variant="outline" size="sm" onClick={() => { fetchBots(); fetchPoints() }} className="gap-1.5">
              <RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">{tr.refresh}</span>
            </Button>
            <Button onClick={() => setShowCreate(true)} className="gap-1.5">
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">{tr.createBot}</span>
              <span className="sm:hidden">{tr.create}</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-5 border border-border">
            <div className="flex items-center justify-between mb-3"><span className="text-xs sm:text-sm text-muted-foreground">{tr.totalBots}</span><Bot className="w-4 h-4 text-primary" /></div>
            <p className="text-2xl sm:text-3xl font-bold">{bots.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{activeBots} {tr.running}</p>
          </Card>
          <Card className="p-4 sm:p-5 border border-border">
            <div className="flex items-center justify-between mb-3"><span className="text-xs sm:text-sm text-muted-foreground">{tr.totalTrades}</span><BarChart2 className="w-4 h-4 text-primary" /></div>
            <p className="text-2xl sm:text-3xl font-bold">{bots.reduce((acc, b) => acc + b.totalTrades, 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">{tr.allTime}</p>
          </Card>
          <Card className="p-4 sm:p-5 border border-border col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-3"><span className="text-xs sm:text-sm text-muted-foreground">{tr.openPositions}</span><Activity className="w-4 h-4 text-primary" /></div>
            <p className="text-2xl sm:text-3xl font-bold">{bots.reduce((acc, b) => acc + b.openPositions, 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">{tr.currentlyActive}</p>
          </Card>
          <Card className="p-4 sm:p-5 border border-violet-500/20 bg-violet-500/5 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Virtual Credit</span>
              <span className="text-xs font-bold text-violet-500">${remainingVirtualCredit.toFixed(0)} left</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className="bg-violet-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, (usedVirtualCredit / userCreditLimit) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${usedVirtualCredit.toFixed(0)} used</span>
              <span>${userCreditLimit.toLocaleString()} limit</span>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1">
          {(["ALL", "SIMULATING", "PAUSED", "STOPPED", "CREATED"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex-shrink-0 ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
              {f === "ALL" ? `${tr.filterAll} (${bots.length})` :
                f === "SIMULATING" ? `${tr.filterRunning} (${bots.filter(b => b.status === "SIMULATING").length})` :
                  f === "PAUSED" ? `${tr.filterPaused} (${bots.filter(b => b.status === "PAUSED").length})` :
                    f === "STOPPED" ? `${tr.filterStopped} (${bots.filter(b => b.status === "STOPPED").length})` :
                      `${tr.filterReady} (${bots.filter(b => b.status === "CREATED").length})`}
            </button>
          ))}
        </div>

        {/* Bot List */}
        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 border border-dashed border-border text-center">
            <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">{tr.noBots}</h3>
            <p className="text-muted-foreground text-sm mb-6">{tr.noBotsDesc}</p>
            <Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-2" /> {tr.createFirstBot}</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(bot => {
              const sc = statusConfig(bot.status)
              const si = STRATEGY_INFO[bot.strategyType]
              const pnlPos = (bot.totalPnl ?? 0) >= 0
              return (
                <Card key={bot.id} className="p-4 sm:p-5 border border-border hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-2.5 rounded-xl border ${si.bg} ${si.color} flex-shrink-0 mt-0.5`}>{si.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <h3 className="font-bold text-base truncate">{bot.name}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${sc.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                          </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                          <Link href={`/bots/${bot.id}`}><Button variant="outline" size="sm" className="h-8 gap-1.5"><Eye className="w-3.5 h-3.5" />{tr.view}</Button></Link>
                          {(bot.status === "CREATED" || bot.status === "PAUSED") && (
                            <Button size="sm" onClick={() => botAction(bot.id, "start")} disabled={!!actionLoading} className="h-8 bg-green-600 hover:bg-green-700 text-white gap-1.5">
                              {actionLoading === bot.id + "start" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}{tr.start}
                            </Button>
                          )}
                          {bot.status === "SIMULATING" && (
                            <Button size="sm" variant="outline" onClick={() => botAction(bot.id, "pause")} disabled={!!actionLoading} className="h-8 gap-1.5 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/10">
                              {actionLoading === bot.id + "pause" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pause className="w-3.5 h-3.5" />}{tr.pause}
                            </Button>
                          )}
                          {(bot.status === "SIMULATING" || bot.status === "PAUSED") && (
                            <Button size="sm" variant="outline" onClick={() => botAction(bot.id, "stop")} disabled={!!actionLoading} className="h-8 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
                              {actionLoading === bot.id + "stop" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}{tr.stop}
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleDelete(bot.id, bot.name)} disabled={!!actionLoading} className="h-8 gap-1.5 text-red-500 border-red-500/30 hover:bg-red-500/10">
                            {actionLoading === bot.id + "delete" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}{tr.delete}
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                        <span className={`font-medium ${si.color}`}>{bot.strategyType}</span>
                        <span>•</span><span>{bot.tradingPair}</span><span>•</span><span>{bot.timeframe}</span>
                        <span>•</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${bot.tradingMode === "LIVE" ? "bg-green-500/10 text-green-600 border-green-500/30" : "bg-violet-500/10 text-violet-500 border-violet-500/20"}`}>
                          {bot.tradingMode === "LIVE" ? "LIVE" : "SIM"}
                        </span>
                        {bot.lastExecutionTime && <><span>•</span><span className="flex items-center gap-1 hidden sm:flex"><Clock className="w-3 h-3" />{tr.lastRun}: {new Date(bot.lastExecutionTime).toLocaleTimeString()}</span></>}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        <div><p className="text-xs text-muted-foreground">{tr.balance}</p><p className="font-semibold text-sm">${fmt(bot.currentBalance)}</p></div>
                        <div>
                          <p className="text-xs text-muted-foreground">{tr.pnl}</p>
                          <p className={`font-semibold text-sm ${pnlPos ? "text-green-500" : "text-destructive"}`}>
                            {pnlPos ? "+" : ""}${fmt(bot.totalPnl)}<span className="text-xs ml-1">({pnlPos ? "+" : ""}{fmt(bot.totalPnlPercentage)}%)</span>
                          </p>
                        </div>
                        <div><p className="text-xs text-muted-foreground">{tr.trades}</p><p className="font-semibold text-sm">{bot.totalTrades}</p></div>
                        <div><p className="text-xs text-muted-foreground">{tr.openPos}</p><p className="font-semibold text-sm">{bot.openPositions}</p></div>
                      </div>
                      <div className="flex sm:hidden items-center gap-1.5 mt-3 pt-3 border-t border-border">
                        <Link href={`/bots/${bot.id}`} className="flex-1"><Button variant="outline" size="sm" className="w-full h-8 gap-1.5"><Eye className="w-3.5 h-3.5" />{tr.view}</Button></Link>
                        {(bot.status === "CREATED" || bot.status === "PAUSED") && (
                          <Button size="sm" onClick={() => botAction(bot.id, "start")} disabled={!!actionLoading} className="flex-1 h-8 bg-green-600 hover:bg-green-700 text-white">
                            {actionLoading === bot.id + "start" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                          </Button>
                        )}
                        {bot.status === "SIMULATING" && (
                          <Button size="sm" variant="outline" onClick={() => botAction(bot.id, "pause")} disabled={!!actionLoading} className="flex-1 h-8 text-yellow-600 border-yellow-500/30">
                            {actionLoading === bot.id + "pause" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pause className="w-3.5 h-3.5" />}
                          </Button>
                        )}
                        {(bot.status === "SIMULATING" || bot.status === "PAUSED") && (
                          <Button size="sm" variant="outline" onClick={() => botAction(bot.id, "stop")} disabled={!!actionLoading} className="flex-1 h-8 text-destructive border-destructive/30">
                            {actionLoading === bot.id + "stop" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleDelete(bot.id, bot.name)} disabled={!!actionLoading} className="h-8 px-2 text-red-500 border-red-500/30 hover:bg-red-500/10">
                          {actionLoading === bot.id + "delete" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {showCreate && <CreateBotModal onClose={() => setShowCreate(false)} onCreated={fetchBots} tr={tr} remainingCredit={remainingVirtualCredit} />}
      {deleteTarget && (
        <DeleteBotModal
          botName={deleteTarget.name}
          tr={tr}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}