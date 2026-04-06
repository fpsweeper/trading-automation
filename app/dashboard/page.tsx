"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { ShineBorder } from "@/components/ui/shine-border"
import {
  Plus, Copy, Check, ExternalLink, Sparkles, Loader2,
  AlertCircle, X, ChevronRight, AlertTriangle,
  Bot, TrendingUp, TrendingDown, Zap, Layers, Coins, Star,
} from "lucide-react"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"
import { useLanguage } from "@/contexts/LanguageContext"

const API = process.env.NEXT_PUBLIC_API_URL

// ─── Types ─────────────────────────────────────────────────────────────────

interface PointsBalance { points: number }
interface PointsPackage { id: string; name: string; description: string; points: number; priceUsd: number; popular: boolean; sortOrder: number }
interface PendingDeposit { id: string; chain: string; baseAmount: number; securityAmount: number; exactAmount: number; pointsToReceive: number; platformWallet: string; tokenAddress: string; createdAt: string; expiresAt: string; timeRemainingSeconds: number; expired: boolean }
interface DepositInstructions { chain: string; depositAddress: string; baseAmount: number; securityAmount: number; exactAmount: number; token: string; tokenAddress: string; pointsToReceive: number; hasLinkedWallet: boolean; linkedWalletAddress?: string; instructions: { step1: string; step2: string; step3: string; step4: string; step5?: string } }
interface Deposit { id: string; transactionHash: string; chain: string; amountUsd: number; exactAmountUsd: number; pointsIssued: number; status: string; submittedAt: string; confirmedAt?: string }
interface BotSummary { id: string; name: string; strategyType: string; tradingPair: string; status: string; totalPnl: number; totalPnlPercentage: number; totalTrades: number; currentBalance: number }

// ─── Translations ───────────────────────────────────────────────────────────

const translations = {
  en: {
    title: "Dashboard", subtitle: "Manage your points, deposits and bots",
    pointsBalance: "Your Points Balance", addPoints: "Add Points",
    tradingBots: "Trading Bots", manageBots: "Manage Bots",
    running: "running", total: "total", combinedPnl: "Combined P&L",
    noBots: "No bots yet", createFirstBot: "Create your first bot", viewAllBots: "View all bots",
    quickDeposit: "Quick Deposit", selectNetwork: "Select Network", selectPackage: "Select Package", startDeposit: "Start Deposit",
    recentDeposits: "Recent Deposits", noDeposits: "No deposits yet",
    tableDate: "Date", tableChain: "Chain", tableAmount: "Amount", tablePoints: "Points", tableStatus: "Status", tableTx: "TX Hash",
    incompleteDeposit: "Incomplete Deposit",
    incompleteMsg: "You started a deposit but didn't complete it. You can resume where you left off.",
    chainLabel: "Chain", amountLabel: "Amount", pointsLabel: "Points", expiresLabel: "Expires In",
    resumeDeposit: "Resume Deposit", cancel: "Cancel",
    incompleteFound: "Incomplete Deposit Found", alreadyStarted: "You already started this deposit",
    important: "Important:", mustSendExact: "You must send exactly",
    includesSecurity: "includes", securityAmount: "security amount",
    resumeThis: "Resume This Deposit", cancelStartNew: "Cancel & Start New", goBack: "Go Back",
    expiresIn: "Expires in",
    popular: "Popular",
    depositTitle: "Deposit", sendExactAmount: "Important: Send Exact Amount",
    mustSend: "You must send", exactly: "exactly",
    packageLabel: "Package", securityLabel: "Security", totalLabel: "Total",
    sendTo: "Send", toAddress: "to this address:",
    network: "Network", token: "Token",
    tokenContract: "Token Contract Address:",
    instructionsTitle: "Instructions:",
    iSent: "I've Sent the Transaction",
    pasteTxHash: "Paste Transaction Hash:", txPlaceholder: "Enter transaction hash...",
    txHint: "You can find this in your wallet after sending the transaction",
    back: "Back", submit: "Submit", submitting: "Submitting...",
    verifying: "Verifying Transaction...",
    verifyingMsg: "This may take 30-60 seconds. Please don't close this window.",
    verifyingHint: "We're checking the blockchain for your transaction. You'll be notified once it's confirmed.",
    depositConfirmed: "Deposit Confirmed! 🎉", pointsCredited: "Your points have been credited", done: "Done",
    error: "Error",
    addressCopied: "Address copied!", tokenCopied: "Token address copied!",
    selectPackageFirst: "Please select a package first",
    resumingDeposit: "Resuming your incomplete deposit of",
    depositFailed: "Deposit failed", depositConfirmedToast: "Deposit confirmed! Points credited.",
    verifyTakingLong: "Verification is taking longer than expected. Check back soon.",
    cancelledDeposit: "Pending deposit cancelled",
  },
  fr: {
    title: "Tableau de bord", subtitle: "Gérez vos points, dépôts et bots",
    pointsBalance: "Votre solde de points", addPoints: "Ajouter des points",
    tradingBots: "Bots de trading", manageBots: "Gérer les bots",
    running: "en cours", total: "total", combinedPnl: "P&L combiné",
    noBots: "Pas encore de bots", createFirstBot: "Créez votre premier bot", viewAllBots: "Voir tous les bots",
    quickDeposit: "Dépôt rapide", selectNetwork: "Sélectionner le réseau", selectPackage: "Sélectionner le forfait", startDeposit: "Démarrer le dépôt",
    recentDeposits: "Dépôts récents", noDeposits: "Pas encore de dépôts",
    tableDate: "Date", tableChain: "Réseau", tableAmount: "Montant", tablePoints: "Points", tableStatus: "Statut", tableTx: "Hash TX",
    incompleteDeposit: "Dépôt incomplet",
    incompleteMsg: "Vous avez commencé un dépôt mais ne l'avez pas terminé. Vous pouvez reprendre où vous en étiez.",
    chainLabel: "Réseau", amountLabel: "Montant", pointsLabel: "Points", expiresLabel: "Expire dans",
    resumeDeposit: "Reprendre le dépôt", cancel: "Annuler",
    incompleteFound: "Dépôt incomplet trouvé", alreadyStarted: "Vous avez déjà commencé ce dépôt",
    important: "Important :", mustSendExact: "Vous devez envoyer exactement",
    includesSecurity: "inclus", securityAmount: "montant de sécurité",
    resumeThis: "Reprendre ce dépôt", cancelStartNew: "Annuler et recommencer", goBack: "Retour",
    expiresIn: "Expire dans",
    popular: "Populaire",
    depositTitle: "Dépôt", sendExactAmount: "Important : Envoyez le montant exact",
    mustSend: "Vous devez envoyer", exactly: "exactement",
    packageLabel: "Forfait", securityLabel: "Sécurité", totalLabel: "Total",
    sendTo: "Envoyer", toAddress: "à cette adresse :",
    network: "Réseau", token: "Jeton",
    tokenContract: "Adresse du contrat de jeton :",
    instructionsTitle: "Instructions :",
    iSent: "J'ai envoyé la transaction",
    pasteTxHash: "Collez le hash de transaction :", txPlaceholder: "Entrez le hash de transaction...",
    txHint: "Vous pouvez le trouver dans votre portefeuille après avoir envoyé la transaction",
    back: "Retour", submit: "Soumettre", submitting: "Soumission...",
    verifying: "Vérification de la transaction...",
    verifyingMsg: "Cela peut prendre 30 à 60 secondes. Ne fermez pas cette fenêtre.",
    verifyingHint: "Nous vérifions la blockchain pour votre transaction. Vous serez notifié une fois confirmée.",
    depositConfirmed: "Dépôt confirmé ! 🎉", pointsCredited: "Vos points ont été crédités", done: "Terminé",
    error: "Erreur",
    addressCopied: "Adresse copiée !", tokenCopied: "Adresse du jeton copiée !",
    selectPackageFirst: "Veuillez d'abord sélectionner un forfait",
    resumingDeposit: "Reprise de votre dépôt incomplet de",
    depositFailed: "Dépôt échoué", depositConfirmedToast: "Dépôt confirmé ! Points crédités.",
    verifyTakingLong: "La vérification prend plus de temps que prévu. Revenez plus tard.",
    cancelledDeposit: "Dépôt en attente annulé",
  },
  es: {
    title: "Panel", subtitle: "Gestiona tus puntos, depósitos y bots",
    pointsBalance: "Tu saldo de puntos", addPoints: "Agregar puntos",
    tradingBots: "Bots de trading", manageBots: "Gestionar bots",
    running: "en ejecución", total: "total", combinedPnl: "P&L combinado",
    noBots: "Aún no hay bots", createFirstBot: "Crea tu primer bot", viewAllBots: "Ver todos los bots",
    quickDeposit: "Depósito rápido", selectNetwork: "Seleccionar red", selectPackage: "Seleccionar paquete", startDeposit: "Iniciar depósito",
    recentDeposits: "Depósitos recientes", noDeposits: "Aún no hay depósitos",
    tableDate: "Fecha", tableChain: "Red", tableAmount: "Monto", tablePoints: "Puntos", tableStatus: "Estado", tableTx: "Hash TX",
    incompleteDeposit: "Depósito incompleto",
    incompleteMsg: "Iniciaste un depósito pero no lo completaste. Puedes retomar donde lo dejaste.",
    chainLabel: "Red", amountLabel: "Monto", pointsLabel: "Puntos", expiresLabel: "Expira en",
    resumeDeposit: "Reanudar depósito", cancel: "Cancelar",
    incompleteFound: "Depósito incompleto encontrado", alreadyStarted: "Ya iniciaste este depósito",
    important: "Importante:", mustSendExact: "Debes enviar exactamente",
    includesSecurity: "incluye", securityAmount: "monto de seguridad",
    resumeThis: "Reanudar este depósito", cancelStartNew: "Cancelar e iniciar nuevo", goBack: "Volver",
    expiresIn: "Expira en",
    popular: "Popular",
    depositTitle: "Depósito", sendExactAmount: "Importante: Envía el monto exacto",
    mustSend: "Debes enviar", exactly: "exactamente",
    packageLabel: "Paquete", securityLabel: "Seguridad", totalLabel: "Total",
    sendTo: "Enviar", toAddress: "a esta dirección:",
    network: "Red", token: "Token",
    tokenContract: "Dirección del contrato del token:",
    instructionsTitle: "Instrucciones:",
    iSent: "He enviado la transacción",
    pasteTxHash: "Pega el hash de transacción:", txPlaceholder: "Ingresa el hash de transacción...",
    txHint: "Puedes encontrarlo en tu billetera después de enviar la transacción",
    back: "Atrás", submit: "Enviar", submitting: "Enviando...",
    verifying: "Verificando transacción...",
    verifyingMsg: "Esto puede tomar 30-60 segundos. Por favor no cierres esta ventana.",
    verifyingHint: "Estamos verificando la blockchain para tu transacción. Serás notificado una vez confirmada.",
    depositConfirmed: "¡Depósito confirmado! 🎉", pointsCredited: "Tus puntos han sido acreditados", done: "Listo",
    error: "Error",
    addressCopied: "¡Dirección copiada!", tokenCopied: "¡Dirección del token copiada!",
    selectPackageFirst: "Por favor selecciona un paquete primero",
    resumingDeposit: "Reanudando tu depósito incompleto de",
    depositFailed: "Depósito fallido", depositConfirmedToast: "¡Depósito confirmado! Puntos acreditados.",
    verifyTakingLong: "La verificación está tardando más de lo esperado. Vuelve más tarde.",
    cancelledDeposit: "Depósito pendiente cancelado",
  },
  de: {
    title: "Dashboard", subtitle: "Verwalten Sie Ihre Punkte, Einzahlungen und Bots",
    pointsBalance: "Ihr Punktestand", addPoints: "Punkte hinzufügen",
    tradingBots: "Trading-Bots", manageBots: "Bots verwalten",
    running: "laufend", total: "gesamt", combinedPnl: "Kombinierter P&L",
    noBots: "Noch keine Bots", createFirstBot: "Erstellen Sie Ihren ersten Bot", viewAllBots: "Alle Bots anzeigen",
    quickDeposit: "Schnelleinzahlung", selectNetwork: "Netzwerk auswählen", selectPackage: "Paket auswählen", startDeposit: "Einzahlung starten",
    recentDeposits: "Letzte Einzahlungen", noDeposits: "Noch keine Einzahlungen",
    tableDate: "Datum", tableChain: "Netzwerk", tableAmount: "Betrag", tablePoints: "Punkte", tableStatus: "Status", tableTx: "TX-Hash",
    incompleteDeposit: "Unvollständige Einzahlung",
    incompleteMsg: "Sie haben eine Einzahlung begonnen, aber nicht abgeschlossen. Sie können dort weitermachen, wo Sie aufgehört haben.",
    chainLabel: "Netzwerk", amountLabel: "Betrag", pointsLabel: "Punkte", expiresLabel: "Läuft ab in",
    resumeDeposit: "Einzahlung fortsetzen", cancel: "Abbrechen",
    incompleteFound: "Unvollständige Einzahlung gefunden", alreadyStarted: "Sie haben diese Einzahlung bereits begonnen",
    important: "Wichtig:", mustSendExact: "Sie müssen genau senden",
    includesSecurity: "enthält", securityAmount: "Sicherheitsbetrag",
    resumeThis: "Diese Einzahlung fortsetzen", cancelStartNew: "Abbrechen und neu starten", goBack: "Zurück",
    expiresIn: "Läuft ab in",
    popular: "Beliebt",
    depositTitle: "Einzahlung", sendExactAmount: "Wichtig: Genauen Betrag senden",
    mustSend: "Sie müssen", exactly: "genau senden",
    packageLabel: "Paket", securityLabel: "Sicherheit", totalLabel: "Gesamt",
    sendTo: "Senden", toAddress: "an diese Adresse:",
    network: "Netzwerk", token: "Token",
    tokenContract: "Token-Vertragsadresse:",
    instructionsTitle: "Anweisungen:",
    iSent: "Ich habe die Transaktion gesendet",
    pasteTxHash: "Transaktions-Hash einfügen:", txPlaceholder: "Transaktions-Hash eingeben...",
    txHint: "Sie finden dies in Ihrer Wallet nach dem Senden der Transaktion",
    back: "Zurück", submit: "Einreichen", submitting: "Wird eingereicht...",
    verifying: "Transaktion wird verifiziert...",
    verifyingMsg: "Dies kann 30-60 Sekunden dauern. Bitte schließen Sie dieses Fenster nicht.",
    verifyingHint: "Wir prüfen die Blockchain auf Ihre Transaktion. Sie werden nach der Bestätigung benachrichtigt.",
    depositConfirmed: "Einzahlung bestätigt! 🎉", pointsCredited: "Ihre Punkte wurden gutgeschrieben", done: "Fertig",
    error: "Fehler",
    addressCopied: "Adresse kopiert!", tokenCopied: "Token-Adresse kopiert!",
    selectPackageFirst: "Bitte wählen Sie zuerst ein Paket aus",
    resumingDeposit: "Ihre unvollständige Einzahlung von wird fortgesetzt",
    depositFailed: "Einzahlung fehlgeschlagen", depositConfirmedToast: "Einzahlung bestätigt! Punkte gutgeschrieben.",
    verifyTakingLong: "Die Verifizierung dauert länger als erwartet. Schauen Sie später nach.",
    cancelledDeposit: "Ausstehende Einzahlung storniert",
  },
  ja: {
    title: "ダッシュボード", subtitle: "ポイント、入金、ボットを管理",
    pointsBalance: "ポイント残高", addPoints: "ポイントを追加",
    tradingBots: "取引ボット", manageBots: "ボットを管理",
    running: "実行中", total: "合計", combinedPnl: "合計損益",
    noBots: "ボットがありません", createFirstBot: "最初のボットを作成", viewAllBots: "すべてのボットを表示",
    quickDeposit: "クイック入金", selectNetwork: "ネットワークを選択", selectPackage: "パッケージを選択", startDeposit: "入金を開始",
    recentDeposits: "最近の入金", noDeposits: "入金履歴がありません",
    tableDate: "日付", tableChain: "ネットワーク", tableAmount: "金額", tablePoints: "ポイント", tableStatus: "ステータス", tableTx: "TXハッシュ",
    incompleteDeposit: "未完了の入金",
    incompleteMsg: "入金を開始しましたが完了していません。中断した場所から再開できます。",
    chainLabel: "ネットワーク", amountLabel: "金額", pointsLabel: "ポイント", expiresLabel: "有効期限",
    resumeDeposit: "入金を再開", cancel: "キャンセル",
    incompleteFound: "未完了の入金が見つかりました", alreadyStarted: "この入金はすでに開始されています",
    important: "重要：", mustSendExact: "正確に送金してください",
    includesSecurity: "含む", securityAmount: "セキュリティ金額",
    resumeThis: "この入金を再開", cancelStartNew: "キャンセルして新規開始", goBack: "戻る",
    expiresIn: "有効期限",
    popular: "人気",
    depositTitle: "入金", sendExactAmount: "重要：正確な金額を送付",
    mustSend: "正確に", exactly: "送付する必要があります",
    packageLabel: "パッケージ", securityLabel: "セキュリティ", totalLabel: "合計",
    sendTo: "送付先", toAddress: "アドレス：",
    network: "ネットワーク", token: "トークン",
    tokenContract: "トークンコントラクトアドレス：",
    instructionsTitle: "手順：",
    iSent: "取引を送信しました",
    pasteTxHash: "トランザクションハッシュを貼り付け：", txPlaceholder: "トランザクションハッシュを入力...",
    txHint: "取引送信後、ウォレットで確認できます",
    back: "戻る", submit: "送信", submitting: "送信中...",
    verifying: "取引を確認中...",
    verifyingMsg: "30〜60秒かかる場合があります。このウィンドウを閉じないでください。",
    verifyingHint: "ブロックチェーンで取引を確認しています。確認後に通知されます。",
    depositConfirmed: "入金確認！🎉", pointsCredited: "ポイントがクレジットされました", done: "完了",
    error: "エラー",
    addressCopied: "アドレスをコピーしました！", tokenCopied: "トークンアドレスをコピーしました！",
    selectPackageFirst: "最初にパッケージを選択してください",
    resumingDeposit: "未完了の入金を再開中",
    depositFailed: "入金失敗", depositConfirmedToast: "入金確認！ポイントがクレジットされました。",
    verifyTakingLong: "確認に予想以上時間がかかっています。後でご確認ください。",
    cancelledDeposit: "保留中の入金がキャンセルされました",
  },
  pt: {
    title: "Painel", subtitle: "Gerencie seus pontos, depósitos e bots",
    pointsBalance: "Seu saldo de pontos", addPoints: "Adicionar pontos",
    tradingBots: "Bots de trading", manageBots: "Gerenciar bots",
    running: "em execução", total: "total", combinedPnl: "P&L combinado",
    noBots: "Nenhum bot ainda", createFirstBot: "Crie seu primeiro bot", viewAllBots: "Ver todos os bots",
    quickDeposit: "Depósito rápido", selectNetwork: "Selecionar rede", selectPackage: "Selecionar pacote", startDeposit: "Iniciar depósito",
    recentDeposits: "Depósitos recentes", noDeposits: "Nenhum depósito ainda",
    tableDate: "Data", tableChain: "Rede", tableAmount: "Valor", tablePoints: "Pontos", tableStatus: "Status", tableTx: "Hash TX",
    incompleteDeposit: "Depósito incompleto",
    incompleteMsg: "Você iniciou um depósito mas não o concluiu. Você pode retomar de onde parou.",
    chainLabel: "Rede", amountLabel: "Valor", pointsLabel: "Pontos", expiresLabel: "Expira em",
    resumeDeposit: "Retomar depósito", cancel: "Cancelar",
    incompleteFound: "Depósito incompleto encontrado", alreadyStarted: "Você já iniciou este depósito",
    important: "Importante:", mustSendExact: "Você deve enviar exatamente",
    includesSecurity: "inclui", securityAmount: "valor de segurança",
    resumeThis: "Retomar este depósito", cancelStartNew: "Cancelar e iniciar novo", goBack: "Voltar",
    expiresIn: "Expira em",
    popular: "Popular",
    depositTitle: "Depósito", sendExactAmount: "Importante: Envie o valor exato",
    mustSend: "Você deve enviar", exactly: "exatamente",
    packageLabel: "Pacote", securityLabel: "Segurança", totalLabel: "Total",
    sendTo: "Enviar", toAddress: "para este endereço:",
    network: "Rede", token: "Token",
    tokenContract: "Endereço do contrato do token:",
    instructionsTitle: "Instruções:",
    iSent: "Enviei a transação",
    pasteTxHash: "Cole o hash da transação:", txPlaceholder: "Digite o hash da transação...",
    txHint: "Você pode encontrá-lo na sua carteira após enviar a transação",
    back: "Voltar", submit: "Enviar", submitting: "Enviando...",
    verifying: "Verificando transação...",
    verifyingMsg: "Isso pode levar 30-60 segundos. Por favor, não feche esta janela.",
    verifyingHint: "Estamos verificando a blockchain para sua transação. Você será notificado após a confirmação.",
    depositConfirmed: "Depósito confirmado! 🎉", pointsCredited: "Seus pontos foram creditados", done: "Concluído",
    error: "Erro",
    addressCopied: "Endereço copiado!", tokenCopied: "Endereço do token copiado!",
    selectPackageFirst: "Por favor, selecione um pacote primeiro",
    resumingDeposit: "Retomando seu depósito incompleto de",
    depositFailed: "Depósito falhou", depositConfirmedToast: "Depósito confirmado! Pontos creditados.",
    verifyTakingLong: "A verificação está demorando mais do que o esperado. Verifique mais tarde.",
    cancelledDeposit: "Depósito pendente cancelado",
  },
  zh: {
    title: "仪表板", subtitle: "管理您的积分、存款和机器人",
    pointsBalance: "您的积分余额", addPoints: "添加积分",
    tradingBots: "交易机器人", manageBots: "管理机器人",
    running: "运行中", total: "总计", combinedPnl: "综合盈亏",
    noBots: "暂无机器人", createFirstBot: "创建您的第一个机器人", viewAllBots: "查看所有机器人",
    quickDeposit: "快速存款", selectNetwork: "选择网络", selectPackage: "选择套餐", startDeposit: "开始存款",
    recentDeposits: "最近存款", noDeposits: "暂无存款记录",
    tableDate: "日期", tableChain: "网络", tableAmount: "金额", tablePoints: "积分", tableStatus: "状态", tableTx: "交易哈希",
    incompleteDeposit: "未完成的存款",
    incompleteMsg: "您开始了一笔存款但未完成。您可以从上次停止的地方继续。",
    chainLabel: "网络", amountLabel: "金额", pointsLabel: "积分", expiresLabel: "到期时间",
    resumeDeposit: "恢复存款", cancel: "取消",
    incompleteFound: "发现未完成的存款", alreadyStarted: "您已经开始了这笔存款",
    important: "重要：", mustSendExact: "您必须发送",
    includesSecurity: "包含", securityAmount: "安全金额",
    resumeThis: "恢复此存款", cancelStartNew: "取消并重新开始", goBack: "返回",
    expiresIn: "到期时间",
    popular: "热门",
    depositTitle: "存款", sendExactAmount: "重要：发送确切金额",
    mustSend: "您必须发送", exactly: "确切金额",
    packageLabel: "套餐", securityLabel: "安全费", totalLabel: "总计",
    sendTo: "发送", toAddress: "到此地址：",
    network: "网络", token: "代币",
    tokenContract: "代币合约地址：",
    instructionsTitle: "说明：",
    iSent: "我已发送交易",
    pasteTxHash: "粘贴交易哈希：", txPlaceholder: "输入交易哈希...",
    txHint: "您可以在发送交易后在钱包中找到它",
    back: "返回", submit: "提交", submitting: "提交中...",
    verifying: "正在验证交易...",
    verifyingMsg: "这可能需要30-60秒。请不要关闭此窗口。",
    verifyingHint: "我们正在区块链上验证您的交易。确认后将通知您。",
    depositConfirmed: "存款已确认！🎉", pointsCredited: "您的积分已到账", done: "完成",
    error: "错误",
    addressCopied: "地址已复制！", tokenCopied: "代币地址已复制！",
    selectPackageFirst: "请先选择套餐",
    resumingDeposit: "正在恢复您未完成的存款",
    depositFailed: "存款失败", depositConfirmedToast: "存款已确认！积分已到账。",
    verifyTakingLong: "验证时间超出预期。请稍后查看。",
    cancelledDeposit: "待处理存款已取消",
  },
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function authHeader() {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""
  return { Authorization: `Bearer ${token}` }
}
function statusDot(status: string) {
  switch (status) {
    case "SIMULATING": return "bg-green-500 animate-pulse"
    case "PAUSED": return "bg-yellow-500"
    case "STOPPED": return "bg-gray-400"
    default: return "bg-blue-500"
  }
}
function strategyIcon(strategy: string) {
  switch (strategy) {
    case "SCALPING": return <Zap className="w-3.5 h-3.5 text-orange-500" />
    case "GRID": return <Layers className="w-3.5 h-3.5 text-purple-500" />
    default: return <Coins className="w-3.5 h-3.5 text-blue-500" />
  }
}

// ─── Bots Summary Widget ────────────────────────────────────────────────────

function BotsSummaryWidget({ tr }: { tr: typeof translations.en }) {
  const [bots, setBots] = useState<BotSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}api/bots`, { headers: authHeader() })
      .then(r => r.json()).then(data => setBots(data.bots ?? []))
      .catch(() => { }).finally(() => setLoading(false))
  }, [])

  const activeBots = bots.filter(b => b.status === "SIMULATING").length
  const totalPnl = bots.reduce((acc, b) => acc + (b.totalPnl ?? 0), 0)
  const pnlPos = totalPnl >= 0

  return (
    <Card className="p-6 border border-border mb-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10"><Bot className="w-4 h-4 text-primary" /></div>
          <div>
            <h2 className="font-semibold text-base">{tr.tradingBots}</h2>
            {!loading && <p className="text-xs text-muted-foreground">{activeBots} {tr.running} · {bots.length} {tr.total}</p>}
          </div>
        </div>
        <Link href="/bots">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">{tr.manageBots} <ChevronRight className="w-3.5 h-3.5" /></Button>
        </Link>
      </div>

      {!loading && bots.length > 0 && (
        <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${pnlPos ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
          {pnlPos ? <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" /> : <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0" />}
          <div>
            <p className="text-xs text-muted-foreground">{tr.combinedPnl}</p>
            <p className={`text-lg font-bold font-mono ${pnlPos ? "text-green-500" : "text-destructive"}`}>
              {pnlPos ? "+" : ""}${Math.abs(totalPnl).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-14 rounded-lg bg-muted/40 animate-pulse" />)}</div>
      ) : bots.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-3">{tr.noBots}</p>
          <Link href="/bots"><Button size="sm" className="gap-1.5"><Bot className="w-3.5 h-3.5" /> {tr.createFirstBot}</Button></Link>
        </div>
      ) : (
        <div className="space-y-2">
          {bots.slice(0, 4).map(bot => {
            const pos = (bot.totalPnl ?? 0) >= 0
            return (
              <Link key={bot.id} href={`/bots/${bot.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot(bot.status)}`} />
                  <div className="flex-shrink-0">{strategyIcon(bot.strategyType)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{bot.name}</p>
                    <p className="text-xs text-muted-foreground">{bot.tradingPair} · {bot.strategyType}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold font-mono ${pos ? "text-green-500" : "text-destructive"}`}>{pos ? "+" : ""}${Math.abs(bot.totalPnl).toFixed(2)}</p>
                    <p className={`text-xs ${pos ? "text-green-600" : "text-destructive"}`}>{pos ? "+" : ""}{bot.totalPnlPercentage.toFixed(2)}%</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Link>
            )
          })}
          <Link href="/bots" className="block">
            <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-dashed border-border hover:border-primary/40 hover:bg-muted/20 transition-all text-xs text-muted-foreground hover:text-foreground">
              {tr.viewAllBots} <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      )}
    </Card>
  )
}

// ─── Main Dashboard Page ────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const tr = translations[language as keyof typeof translations] || translations.en

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState<PointsPackage[]>([])
  const [packagesLoading, setPackagesLoading] = useState(true)
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const selectedPackage = packages.find(p => p.id === selectedPackageId) ?? null
  const [pendingDeposits, setPendingDeposits] = useState<PendingDeposit[]>([])
  const [activePendingDeposit, setActivePendingDeposit] = useState<PendingDeposit | null>(null)
  const [pointsBalance, setPointsBalance] = useState<number>(0)
  const [loadingPoints, setLoadingPoints] = useState(true)
  const [selectedChain, setSelectedChain] = useState<"SOLANA" | "BEP20" | "TRC20">("SOLANA")
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositStep, setDepositStep] = useState<"instructions" | "submit" | "processing" | "success">("instructions")
  const [depositInstructions, setDepositInstructions] = useState<DepositInstructions | null>(null)
  const [transactionHash, setTransactionHash] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [depositError, setDepositError] = useState<string | null>(null)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)
  const [recentDeposits, setRecentDeposits] = useState<Deposit[]>([])
  const [loadingDeposits, setLoadingDeposits] = useState(true)
  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [resumeCandidate, setResumeCandidate] = useState<PendingDeposit | null>(null)

  const chains = [
    { id: "SOLANA", name: "Solana", logo: "/solana.svg" },
    { id: "BEP20", name: "BEP20", logo: "/bnb.svg" },
    { id: "TRC20", name: "TRC20", logo: "/tron.svg" },
  ]

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) { router.push("/login"); return }
    setIsAuthenticated(true); setLoading(false)
  }, [router])

  useEffect(() => {
    fetch(`${API}api/points/packages`).then(r => r.json())
      .then(data => {
        const pkgs: PointsPackage[] = data.packages ?? []
        setPackages(pkgs)
        const def = pkgs.find(p => p.popular) ?? pkgs[0]
        if (def) setSelectedPackageId(def.id)
      })
      .catch(() => {
        const fallback: PointsPackage[] = [
          { id: "1", name: "Starter", description: "Get started", points: 30, priceUsd: 10, popular: false, sortOrder: 1 },
          { id: "2", name: "Trader", description: "Run multiple bots", points: 200, priceUsd: 50, popular: true, sortOrder: 2 },
          { id: "3", name: "Pro", description: "High-frequency", points: 900, priceUsd: 200, popular: false, sortOrder: 3 },
          { id: "4", name: "Unlimited", description: "Power users", points: 2000, priceUsd: 400, popular: false, sortOrder: 4 },
        ]
        setPackages(fallback); setSelectedPackageId("2")
      })
      .finally(() => setPackagesLoading(false))
  }, [])

  const fetchPointsBalance = useCallback(async () => {
    try {
      const res = await fetch(`${API}api/points/balance`, { headers: authHeader() })
      if (res.ok) { const data: PointsBalance = await res.json(); setPointsBalance(data.points) }
    } catch { } finally { setLoadingPoints(false) }
  }, [])

  const fetchRecentDeposits = useCallback(async () => {
    try {
      const res = await fetch(`${API}api/deposits/history?page=0&size=5`, { headers: authHeader() })
      if (res.ok) { const data = await res.json(); setRecentDeposits(data.content || []) }
    } catch { } finally { setLoadingDeposits(false) }
  }, [])

  const fetchPendingDeposits = useCallback(async () => {
    try {
      const res = await fetch(`${API}api/pending-deposits`, { headers: authHeader() })
      if (res.ok) {
        const data: PendingDeposit[] = await res.json()
        setPendingDeposits(data)
        if (data.length > 0 && !data[0].expired) setActivePendingDeposit(data[0])
      }
    } catch { }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    fetchPointsBalance(); fetchRecentDeposits(); fetchPendingDeposits()
  }, [isAuthenticated, fetchPointsBalance, fetchRecentDeposits, fetchPendingDeposits])

  const startNewDeposit = useCallback(async () => {
    if (!selectedPackage) { toast.error(tr.selectPackageFirst); return }
    setShowDepositModal(true); setDepositStep("instructions"); setDepositError(null)
    setTransactionHash(""); sessionStorage.removeItem("pendingDepositId")
    try {
      const res = await fetch(`${API}api/deposits/instructions/${selectedChain}?amount=${selectedPackage.priceUsd}`, { headers: authHeader() })
      if (res.ok) {
        const data: DepositInstructions & { pendingDepositId: string } = await res.json()
        setDepositInstructions(data); sessionStorage.setItem("pendingDepositId", data.pendingDepositId)
      } else { toast.error("Failed to load deposit instructions"); setShowDepositModal(false) }
    } catch { toast.error("Error loading deposit instructions"); setShowDepositModal(false) }
  }, [selectedChain, selectedPackage, tr])

  const handleStartDeposit = () => {
    if (!selectedPackage) { toast.error(tr.selectPackageFirst); return }
    const existing = pendingDeposits.find(p => p.chain === selectedChain && p.baseAmount === selectedPackage.priceUsd && !p.expired)
    if (existing) { toast.info(`${tr.resumingDeposit} $${existing.exactAmount.toFixed(2)}`); handleResumePendingDeposit(existing); return }
    startNewDeposit()
  }

  const handleResumePendingDeposit = (pending: PendingDeposit) => {
    setDepositInstructions({
      chain: pending.chain, depositAddress: pending.platformWallet,
      baseAmount: pending.baseAmount, securityAmount: pending.securityAmount,
      exactAmount: pending.exactAmount, token: "USDT", tokenAddress: pending.tokenAddress,
      pointsToReceive: pending.pointsToReceive, hasLinkedWallet: false,
      instructions: {
        step1: `Send EXACTLY ${pending.exactAmount.toFixed(2)} USDT to the address above`,
        step2: `IMPORTANT: You must send ${pending.exactAmount.toFixed(2)} (includes $${pending.securityAmount.toFixed(2)} security amount)`,
        step3: "Copy the transaction hash after sending",
        step4: "Submit the transaction hash below",
        step5: `Your ${pending.pointsToReceive} points will be credited after confirmation`,
      },
    })
    sessionStorage.setItem("pendingDepositId", pending.id)
    setShowDepositModal(true); setDepositStep("instructions")
  }

  const handleCancelPendingDeposit = async (id: string) => {
    try {
      const res = await fetch(`${API}api/pending-deposits/${id}`, { method: "DELETE", headers: authHeader() })
      if (res.ok) { toast.success(tr.cancelledDeposit); fetchPendingDeposits(); setActivePendingDeposit(null) }
      else toast.error("Failed to cancel pending deposit")
    } catch { toast.error("Error cancelling pending deposit") }
  }

  const handleCopyAddress = () => {
    if (!depositInstructions) return
    navigator.clipboard.writeText(depositInstructions.depositAddress)
    setCopiedAddress(true); toast.success(tr.addressCopied)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const handleCopyToken = () => {
    if (!depositInstructions) return
    navigator.clipboard.writeText(depositInstructions.tokenAddress)
    setCopiedToken(true); toast.success(tr.tokenCopied)
    setTimeout(() => setCopiedToken(false), 2000)
  }

  const handleSubmitTransaction = async () => {
    if (!transactionHash.trim()) { toast.error("Please enter a transaction hash"); return }
    if (!depositInstructions) return
    setIsSubmitting(true); setDepositError(null)
    try {
      const pendingDepositId = sessionStorage.getItem("pendingDepositId")
      const res = await fetch(`${API}api/deposits/submit`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ transactionHash: transactionHash.trim(), chain: selectedChain, exactAmountUsd: depositInstructions.exactAmount, pendingDepositId }),
      })
      const data = await res.json()
      if (res.ok) { sessionStorage.removeItem("pendingDepositId"); setDepositStep("processing"); pollDepositStatus(transactionHash.trim()); fetchPendingDeposits() }
      else { setDepositError(data.error || "Failed to submit deposit"); toast.error(data.error || "Failed to submit deposit") }
    } catch { setDepositError("Network error. Please try again."); toast.error("Network error") }
    finally { setIsSubmitting(false) }
  }

  const pollDepositStatus = (txHash: string) => {
    let attempts = 0
    const poll = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`${API}api/deposits/status/${txHash}`, { headers: authHeader() })
        if (res.ok) {
          const data = await res.json()
          if (data.status === "CONFIRMED") { clearInterval(poll); setDepositStep("success"); fetchPointsBalance(); fetchRecentDeposits(); toast.success(tr.depositConfirmedToast) }
          else if (data.status === "FAILED") { clearInterval(poll); setDepositError(data.failureReason || "Deposit verification failed"); setDepositStep("submit"); toast.error(tr.depositFailed) }
        }
        if (attempts >= 60) { clearInterval(poll); toast.info(tr.verifyTakingLong) }
      } catch { }
    }, 5000)
  }

  const handleCloseModal = () => { setShowDepositModal(false); setDepositStep("instructions"); setTransactionHash(""); setDepositError(null); setDepositInstructions(null) }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-500/10 text-green-700 border-green-500/20"
      case "PENDING": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "FAILED": return "bg-red-500/10 text-red-700 border-red-500/20"
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }
  const getChainColor = (chain: string) => {
    switch (chain) {
      case "SOLANA": return "text-purple-600"; case "BEP20": return "text-yellow-600"; case "TRC20": return "text-red-600"; default: return "text-gray-600"
    }
  }
  const getBlockExplorerUrl = (chain: string, txHash: string) => {
    switch (chain) {
      case "SOLANA": return `https://solscan.io/tx/${txHash}`; case "BEP20": return `https://bscscan.com/tx/${txHash}`; case "TRC20": return `https://tronscan.org/#/transaction/${txHash}`; default: return "#"
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{tr.title}</h1>
          <p className="text-muted-foreground">{tr.subtitle}</p>
        </div>

        {/* Points Balance */}
        <div className="mb-8">
          <div className="relative rounded-2xl">
            <ShineBorder borderWidth={2} duration={10} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <Card className="relative p-8 border-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-muted-foreground">{tr.pointsBalance}</h2>
                    {loadingPoints ? <Loader2 className="w-6 h-6 animate-spin text-primary mt-2" /> : <p className="text-5xl font-bold text-foreground mt-1">{pointsBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                  </div>
                </div>
                <ShimmerButton onClick={handleStartDeposit} className="px-8 py-4 text-lg font-semibold w-full md:w-auto" background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                  <Plus className="w-5 h-5 mr-2" /> {tr.addPoints}
                </ShimmerButton>
              </div>
            </Card>
          </div>
        </div>

        <BotsSummaryWidget tr={tr} />

        {/* Incomplete Deposit Banner */}
        {activePendingDeposit && !activePendingDeposit.expired && (
          <Card className="mb-8 border-orange-500 bg-orange-500/5">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-bold text-orange-700">{tr.incompleteDeposit}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{tr.incompleteMsg}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: tr.chainLabel, value: activePendingDeposit.chain },
                      { label: tr.amountLabel, value: `$${activePendingDeposit.exactAmount.toFixed(2)}` },
                      { label: tr.pointsLabel, value: String(activePendingDeposit.pointsToReceive) },
                      { label: tr.expiresLabel, value: `${Math.floor(activePendingDeposit.timeRemainingSeconds / 3600)}h ${Math.floor((activePendingDeposit.timeRemainingSeconds % 3600) / 60)}m` },
                    ].map(({ label, value }) => (
                      <div key={label} className="p-3 rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleCancelPendingDeposit(activePendingDeposit.id)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => handleResumePendingDeposit(activePendingDeposit)} className="bg-orange-500 text-white hover:bg-orange-600">{tr.resumeDeposit}</Button>
                <Button variant="outline" onClick={() => handleCancelPendingDeposit(activePendingDeposit.id)}>{tr.cancel}</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Resume Dialog */}
        {showResumeDialog && resumeCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md border border-border">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-orange-500" /></div>
                  <div>
                    <h3 className="text-xl font-bold">{tr.incompleteFound}</h3>
                    <p className="text-sm text-muted-foreground">{tr.alreadyStarted}</p>
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><p className="text-xs text-muted-foreground mb-1">{tr.chainLabel}</p><p className="font-medium">{resumeCandidate.chain}</p></div>
                    <div><p className="text-xs text-muted-foreground mb-1">{tr.amountLabel}</p><p className="font-medium">${resumeCandidate.exactAmount.toFixed(2)}</p></div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded p-2">
                    <p className="text-xs text-orange-600"><strong>{tr.important}</strong> {tr.mustSendExact} ${resumeCandidate.exactAmount.toFixed(2)} ({tr.includesSecurity} ${resumeCandidate.securityAmount.toFixed(2)} {tr.securityAmount})</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button onClick={() => { setShowResumeDialog(false); handleResumePendingDeposit(resumeCandidate) }} className="w-full bg-orange-500 hover:bg-orange-600 text-white">{tr.resumeThis}</Button>
                  <Button onClick={async () => { setShowResumeDialog(false); await handleCancelPendingDeposit(resumeCandidate.id); setTimeout(startNewDeposit, 500) }} variant="outline" className="w-full">{tr.cancelStartNew}</Button>
                  <Button onClick={() => { setShowResumeDialog(false); setResumeCandidate(null) }} variant="ghost" className="w-full">{tr.goBack}</Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">{tr.expiresIn} {Math.floor(resumeCandidate.timeRemainingSeconds / 3600)}h {Math.floor((resumeCandidate.timeRemainingSeconds % 3600) / 60)}m</p>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Deposit */}
        <Card className="p-6 mb-8 border border-border">
          <h2 className="text-xl font-bold mb-6">{tr.quickDeposit}</h2>
          <div className="mb-6">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">{tr.selectNetwork}</label>
            <div className="grid grid-cols-3 gap-3">
              {chains.map(chain => (
                <button key={chain.id} onClick={() => setSelectedChain(chain.id as "SOLANA" | "BEP20" | "TRC20")}
                  className={`p-4 rounded-lg border-2 transition-all ${selectedChain === chain.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                  <div className="flex justify-center mb-2"><img src={chain.logo} alt={chain.name} className="w-10 h-10" /></div>
                  <p className="font-medium text-foreground">{chain.name}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">{tr.selectPackage}</label>
            {packagesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-lg bg-muted/40 animate-pulse" />)}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {packages.map(pkg => (
                  <button key={pkg.id} onClick={() => setSelectedPackageId(pkg.id)}
                    className={`relative p-4 rounded-lg border-2 transition-all text-left ${selectedPackageId === pkg.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                    {pkg.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold whitespace-nowrap">
                          <Star className="w-2.5 h-2.5" /> {tr.popular}
                        </span>
                      </div>
                    )}
                    <p className="text-2xl font-bold text-foreground">${pkg.priceUsd}</p>
                    <p className="text-sm font-medium text-primary mt-0.5">{pkg.points.toLocaleString()} pts</p>
                    <p className="text-xs text-muted-foreground mt-0.5">~{pkg.points} trades</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <ShimmerButton onClick={handleStartDeposit} className="w-full py-4 text-lg font-semibold" disabled={!selectedPackage || packagesLoading}>
            <span className="text-white">{tr.startDeposit}</span>
            <ChevronRight className="w-5 h-5 ml-2" />
          </ShimmerButton>
        </Card>

        {/* Recent Deposits */}
        <Card className="p-6 border border-border">
          <h2 className="text-xl font-bold mb-6">{tr.recentDeposits}</h2>
          {loadingDeposits ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : recentDeposits.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{tr.noDeposits}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {[tr.tableDate, tr.tableChain, tr.tableAmount, tr.tablePoints, tr.tableStatus, tr.tableTx].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentDeposits.map(deposit => (
                    <tr key={deposit.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm">{new Date(deposit.submittedAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4"><span className={`text-sm font-medium ${getChainColor(deposit.chain)}`}>{deposit.chain}</span></td>
                      <td className="py-3 px-4 text-sm">
                        <div className="font-medium">${deposit?.exactAmountUsd?.toFixed(2) || deposit.amountUsd}</div>
                        {deposit.exactAmountUsd && deposit.exactAmountUsd !== deposit.amountUsd && <div className="text-xs text-muted-foreground">(Base: ${deposit.amountUsd})</div>}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">{deposit.pointsIssued}</td>
                      <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeColor(deposit.status)}`}>{deposit.status}</span></td>
                      <td className="py-3 px-4">
                        <a href={getBlockExplorerUrl(deposit.chain, deposit.transactionHash)} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                          {deposit.transactionHash.substring(0, 8)}...<ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur-sm z-10">
              <h2 className="text-2xl font-bold">{tr.depositTitle} ${selectedPackage?.priceUsd} — {selectedChain}</h2>
              <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6">
              {depositStep === "instructions" && depositInstructions && (
                <div className="space-y-6">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-700">{tr.sendExactAmount}</p>
                        <p className="text-sm text-orange-600 mt-1">{tr.mustSend} <strong>{tr.exactly} ${depositInstructions.exactAmount?.toFixed(2)}</strong> (${depositInstructions.baseAmount} + ${depositInstructions.securityAmount?.toFixed(2)} security)</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted"><p className="text-sm text-muted-foreground mb-1">{tr.packageLabel}</p><p className="font-medium">${depositInstructions.baseAmount}</p></div>
                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20"><p className="text-sm text-orange-600 mb-1">{tr.securityLabel}</p><p className="font-medium text-orange-700">+${depositInstructions.securityAmount?.toFixed(2)}</p></div>
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20"><p className="text-sm text-primary mb-1">{tr.totalLabel}</p><p className="text-lg font-bold text-primary">${depositInstructions.exactAmount?.toFixed(2)}</p></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{tr.sendTo} {depositInstructions.token} {tr.toAddress}</label>
                    <div className="flex gap-2">
                      <Input readOnly value={depositInstructions.depositAddress} className="font-mono text-sm" />
                      <Button onClick={handleCopyAddress} variant="outline" size="icon">{copiedAddress ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}</Button>
                    </div>
                  </div>
                  <div className="flex justify-center p-4 bg-white rounded-lg"><QRCodeSVG value={depositInstructions.depositAddress} size={200} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted"><p className="text-sm text-muted-foreground mb-1">{tr.network}</p><p className="font-medium">{depositInstructions.chain}</p></div>
                    <div className="p-4 rounded-lg bg-muted"><p className="text-sm text-muted-foreground mb-1">{tr.token}</p><p className="font-medium">{depositInstructions.token}</p></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">{tr.tokenContract}</label>
                    <div className="flex gap-2">
                      <Input readOnly value={depositInstructions.tokenAddress} className="font-mono text-sm" />
                      <Button onClick={handleCopyToken} variant="outline" size="icon">{copiedToken ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}</Button>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="font-medium text-blue-700 mb-3">{tr.instructionsTitle}</h3>
                    <ol className="space-y-2 text-sm text-blue-600">
                      {Object.values(depositInstructions.instructions).map((instruction, idx) => (
                        <li key={idx} className="flex gap-2"><span className="font-medium">{idx + 1}.</span><span>{instruction}</span></li>
                      ))}
                    </ol>
                  </div>
                  <Button onClick={() => setDepositStep("submit")} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {tr.iSent} <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {depositStep === "submit" && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{tr.pasteTxHash}</label>
                    <Input placeholder={tr.txPlaceholder} value={transactionHash} onChange={e => setTransactionHash(e.target.value)} className="font-mono" />
                    <p className="text-xs text-muted-foreground mt-2">{tr.txHint}</p>
                  </div>
                  {depositError && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div><p className="font-medium text-red-700">{tr.error}</p><p className="text-sm text-red-600 mt-1">{depositError}</p></div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button onClick={() => setDepositStep("instructions")} variant="outline" className="flex-1">{tr.back}</Button>
                    <Button onClick={handleSubmitTransaction} disabled={isSubmitting || !transactionHash.trim()} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{tr.submitting}</> : tr.submit}
                    </Button>
                  </div>
                </div>
              )}

              {depositStep === "processing" && (
                <div className="py-12 text-center space-y-6">
                  <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">{tr.verifying}</h3>
                    <p className="text-muted-foreground">{tr.verifyingMsg}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground">{tr.verifyingHint}</p>
                  </div>
                </div>
              )}

              {depositStep === "success" && (
                <div className="py-12 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto"><Check className="w-10 h-10 text-green-500" /></div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{tr.depositConfirmed}</h3>
                    <p className="text-muted-foreground mb-4">{tr.pointsCredited}</p>
                    <div className="inline-block p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-3xl font-bold text-primary">+{depositInstructions?.pointsToReceive} Points</p>
                    </div>
                  </div>
                  <Button onClick={handleCloseModal} className="bg-primary text-primary-foreground hover:bg-primary/90">{tr.done}</Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}