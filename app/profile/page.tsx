"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Mail, KeyRound, Wallet, Twitter, MessageSquare, Check, ExternalLink,
  Shield, Sparkles, ChevronRight, Link as LinkIcon, Unlink, AlertCircle, Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ShineBorder } from "@/components/ui/shine-border"
import GlowLine from "@/components/ui/glowline"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { BlurFade } from "@/components/ui/blur-fade"
import { toast } from "sonner"
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useAuth } from "@/contexts/AuthContext"
import bs58 from "bs58"
import nacl from "tweetnacl"
import { useLanguage } from "@/contexts/LanguageContext"

// ─── Translations ───────────────────────────────────────────────────────────

const translations = {
  en: {
    emailAddress: "Email Address", googleAccount: "Google Account", emailPassword: "Email & Password",
    verified: "Verified", googleSignIn: "Google Sign-In", emailPasswordAuth: "Email & Password",
    googleSignInDesc: "You sign in using your Google account. No password required.",
    emailPasswordDesc: "You sign in with your email and password. You can change your password anytime.",
    solanaWallet: "Solana Wallet", linked: "Linked & ", verifiedOn: "Verified on",
    unverified: "Unverified", linkWallet: "Link your Solana wallet", loadingWallet: "Loading...",
    walletAddress: "Wallet Address", verifyWallet: "Verify Wallet", verifying: "Verifying...",
    verifiedLabel: "Verified", disconnect: "Disconnect", disconnecting: "Disconnecting...",
    viewOnSolscan: "View on Solscan",
    connectWalletDesc: "Connect your Solana wallet to enable trading and access DeFi features",
    linkWalletBtn: "Link Wallet to Account", linking: "Linking...",
    walletSupportNote: "We support Phantom, Solflare, and other popular Solana wallets",
    twitter: "X (Twitter)", notConnected: "Not connected", connectX: "Connect X", connecting: "Connecting...",
    discord: "Discord", connectDiscord: "Connect Discord",
    security: "Security", accountProtection: "Account protection",
    password: "Password", managePassword: "Manage your password", changePassword: "Change Password",
    googleAccountNotice: "Google Account",
    googleAccountDesc: "You're signed in with Google. Password management is handled by your Google account.",
    connectedServices: "Connected Services", solana: "Solana",
    proTip: "Pro Tip",
    proTipDesc: "Connect your Solana wallet to unlock premium trading features and automated DeFi strategies.",
    failedLoadUser: "Failed to load user data", errorLoadUser: "Error loading user data",
    connectWalletFirst: "Please connect your wallet first",
    walletNoSign: "Your wallet does not support message signing. Please use Phantom or Solflare.",
    failedVerify: "Failed to verify wallet ownership",
    walletLinked: "Solana wallet linked successfully!", failedLink: "Failed to link wallet",
    walletUnlinked: "Wallet unlinked successfully!", failedUnlink: "Failed to unlink wallet",
    twitterUnlinked: "Twitter account unlinked successfully!", failedUnlinkTwitter: "Failed to unlink Twitter",
    discordLinked: "Discord account linked successfully!", discordError: "Failed to link Discord account",
    discordUnlinked: "Discord account unlinked successfully!", failedUnlinkDiscord: "Failed to unlink Discord",
    failedPrepareDiscord: "Failed to prepare Discord linking", failedStartDiscord: "Failed to start Discord linking",
    userEmailNotFound: "User email not found",
  },
  fr: {
    emailAddress: "Adresse e-mail", googleAccount: "Compte Google", emailPassword: "E-mail & Mot de passe",
    verified: "Vérifié", googleSignIn: "Connexion Google", emailPasswordAuth: "E-mail & Mot de passe",
    googleSignInDesc: "Vous vous connectez avec votre compte Google. Aucun mot de passe requis.",
    emailPasswordDesc: "Vous vous connectez avec votre e-mail et mot de passe. Vous pouvez changer votre mot de passe à tout moment.",
    solanaWallet: "Portefeuille Solana", linked: "Lié & ", verifiedOn: "Vérifié le",
    unverified: "Non vérifié", linkWallet: "Lier votre portefeuille Solana", loadingWallet: "Chargement...",
    walletAddress: "Adresse du portefeuille", verifyWallet: "Vérifier le portefeuille", verifying: "Vérification...",
    verifiedLabel: "Vérifié", disconnect: "Déconnecter", disconnecting: "Déconnexion...",
    viewOnSolscan: "Voir sur Solscan",
    connectWalletDesc: "Connectez votre portefeuille Solana pour accéder au trading et aux fonctionnalités DeFi",
    linkWalletBtn: "Lier le portefeuille au compte", linking: "Liaison...",
    walletSupportNote: "Nous supportons Phantom, Solflare et d'autres portefeuilles Solana populaires",
    twitter: "X (Twitter)", notConnected: "Non connecté", connectX: "Connecter X", connecting: "Connexion...",
    discord: "Discord", connectDiscord: "Connecter Discord",
    security: "Sécurité", accountProtection: "Protection du compte",
    password: "Mot de passe", managePassword: "Gérez votre mot de passe", changePassword: "Changer le mot de passe",
    googleAccountNotice: "Compte Google",
    googleAccountDesc: "Vous êtes connecté avec Google. La gestion du mot de passe est gérée par votre compte Google.",
    connectedServices: "Services connectés", solana: "Solana",
    proTip: "Conseil Pro",
    proTipDesc: "Connectez votre portefeuille Solana pour débloquer des fonctionnalités de trading premium et des stratégies DeFi automatisées.",
    failedLoadUser: "Échec du chargement des données utilisateur", errorLoadUser: "Erreur lors du chargement des données",
    connectWalletFirst: "Veuillez d'abord connecter votre portefeuille",
    walletNoSign: "Votre portefeuille ne supporte pas la signature de messages. Utilisez Phantom ou Solflare.",
    failedVerify: "Échec de la vérification du portefeuille",
    walletLinked: "Portefeuille Solana lié avec succès !", failedLink: "Échec de la liaison du portefeuille",
    walletUnlinked: "Portefeuille délié avec succès !", failedUnlink: "Échec de la déconnexion du portefeuille",
    twitterUnlinked: "Compte Twitter délié avec succès !", failedUnlinkTwitter: "Échec de la déconnexion de Twitter",
    discordLinked: "Compte Discord lié avec succès !", discordError: "Échec de la liaison du compte Discord",
    discordUnlinked: "Compte Discord délié avec succès !", failedUnlinkDiscord: "Échec de la déconnexion de Discord",
    failedPrepareDiscord: "Échec de la préparation de la liaison Discord", failedStartDiscord: "Échec du démarrage de la liaison Discord",
    userEmailNotFound: "E-mail utilisateur introuvable",
  },
  es: {
    emailAddress: "Dirección de correo", googleAccount: "Cuenta de Google", emailPassword: "Correo & Contraseña",
    verified: "Verificado", googleSignIn: "Inicio con Google", emailPasswordAuth: "Correo & Contraseña",
    googleSignInDesc: "Inicias sesión con tu cuenta de Google. No se requiere contraseña.",
    emailPasswordDesc: "Inicias sesión con tu correo y contraseña. Puedes cambiar tu contraseña en cualquier momento.",
    solanaWallet: "Cartera Solana", linked: "Vinculada & ", verifiedOn: "Verificada el",
    unverified: "No verificada", linkWallet: "Vincula tu cartera Solana", loadingWallet: "Cargando...",
    walletAddress: "Dirección de cartera", verifyWallet: "Verificar cartera", verifying: "Verificando...",
    verifiedLabel: "Verificada", disconnect: "Desconectar", disconnecting: "Desconectando...",
    viewOnSolscan: "Ver en Solscan",
    connectWalletDesc: "Conecta tu cartera Solana para habilitar el trading y acceder a funciones DeFi",
    linkWalletBtn: "Vincular cartera a la cuenta", linking: "Vinculando...",
    walletSupportNote: "Soportamos Phantom, Solflare y otras carteras Solana populares",
    twitter: "X (Twitter)", notConnected: "No conectado", connectX: "Conectar X", connecting: "Conectando...",
    discord: "Discord", connectDiscord: "Conectar Discord",
    security: "Seguridad", accountProtection: "Protección de la cuenta",
    password: "Contraseña", managePassword: "Gestiona tu contraseña", changePassword: "Cambiar contraseña",
    googleAccountNotice: "Cuenta de Google",
    googleAccountDesc: "Has iniciado sesión con Google. La gestión de contraseña es responsabilidad de tu cuenta Google.",
    connectedServices: "Servicios conectados", solana: "Solana",
    proTip: "Consejo Pro",
    proTipDesc: "Conecta tu cartera Solana para desbloquear funciones de trading premium y estrategias DeFi automatizadas.",
    failedLoadUser: "Error al cargar datos del usuario", errorLoadUser: "Error al cargar datos del usuario",
    connectWalletFirst: "Por favor conecta tu cartera primero",
    walletNoSign: "Tu cartera no admite firma de mensajes. Usa Phantom o Solflare.",
    failedVerify: "Error al verificar la propiedad de la cartera",
    walletLinked: "¡Cartera Solana vinculada con éxito!", failedLink: "Error al vincular la cartera",
    walletUnlinked: "¡Cartera desvinculada con éxito!", failedUnlink: "Error al desvincular la cartera",
    twitterUnlinked: "¡Cuenta de Twitter desvinculada con éxito!", failedUnlinkTwitter: "Error al desvincular Twitter",
    discordLinked: "¡Cuenta de Discord vinculada con éxito!", discordError: "Error al vincular la cuenta de Discord",
    discordUnlinked: "¡Cuenta de Discord desvinculada con éxito!", failedUnlinkDiscord: "Error al desvincular Discord",
    failedPrepareDiscord: "Error al preparar la vinculación de Discord", failedStartDiscord: "Error al iniciar la vinculación de Discord",
    userEmailNotFound: "Correo del usuario no encontrado",
  },
  de: {
    emailAddress: "E-Mail-Adresse", googleAccount: "Google-Konto", emailPassword: "E-Mail & Passwort",
    verified: "Verifiziert", googleSignIn: "Google-Anmeldung", emailPasswordAuth: "E-Mail & Passwort",
    googleSignInDesc: "Sie melden sich mit Ihrem Google-Konto an. Kein Passwort erforderlich.",
    emailPasswordDesc: "Sie melden sich mit Ihrer E-Mail und Ihrem Passwort an. Sie können Ihr Passwort jederzeit ändern.",
    solanaWallet: "Solana-Wallet", linked: "Verknüpft & ", verifiedOn: "Verifiziert am",
    unverified: "Nicht verifiziert", linkWallet: "Solana-Wallet verknüpfen", loadingWallet: "Laden...",
    walletAddress: "Wallet-Adresse", verifyWallet: "Wallet verifizieren", verifying: "Verifizierung...",
    verifiedLabel: "Verifiziert", disconnect: "Trennen", disconnecting: "Trennung...",
    viewOnSolscan: "Auf Solscan anzeigen",
    connectWalletDesc: "Verbinden Sie Ihre Solana-Wallet, um Trading und DeFi-Funktionen zu nutzen",
    linkWalletBtn: "Wallet mit Konto verknüpfen", linking: "Verknüpfung...",
    walletSupportNote: "Wir unterstützen Phantom, Solflare und andere beliebte Solana-Wallets",
    twitter: "X (Twitter)", notConnected: "Nicht verbunden", connectX: "X verbinden", connecting: "Verbindung...",
    discord: "Discord", connectDiscord: "Discord verbinden",
    security: "Sicherheit", accountProtection: "Kontoschutz",
    password: "Passwort", managePassword: "Passwort verwalten", changePassword: "Passwort ändern",
    googleAccountNotice: "Google-Konto",
    googleAccountDesc: "Sie sind mit Google angemeldet. Die Passwortverwaltung erfolgt über Ihr Google-Konto.",
    connectedServices: "Verbundene Dienste", solana: "Solana",
    proTip: "Profi-Tipp",
    proTipDesc: "Verbinden Sie Ihre Solana-Wallet, um Premium-Trading-Funktionen und automatisierte DeFi-Strategien freizuschalten.",
    failedLoadUser: "Benutzerdaten konnten nicht geladen werden", errorLoadUser: "Fehler beim Laden der Benutzerdaten",
    connectWalletFirst: "Bitte verbinden Sie zuerst Ihre Wallet",
    walletNoSign: "Ihre Wallet unterstützt keine Nachrichtensignierung. Bitte Phantom oder Solflare verwenden.",
    failedVerify: "Wallet-Eigentümerschaft konnte nicht verifiziert werden",
    walletLinked: "Solana-Wallet erfolgreich verknüpft!", failedLink: "Wallet konnte nicht verknüpft werden",
    walletUnlinked: "Wallet erfolgreich getrennt!", failedUnlink: "Wallet konnte nicht getrennt werden",
    twitterUnlinked: "Twitter-Konto erfolgreich getrennt!", failedUnlinkTwitter: "Twitter konnte nicht getrennt werden",
    discordLinked: "Discord-Konto erfolgreich verknüpft!", discordError: "Discord-Konto konnte nicht verknüpft werden",
    discordUnlinked: "Discord-Konto erfolgreich getrennt!", failedUnlinkDiscord: "Discord konnte nicht getrennt werden",
    failedPrepareDiscord: "Discord-Verknüpfung konnte nicht vorbereitet werden", failedStartDiscord: "Discord-Verknüpfung konnte nicht gestartet werden",
    userEmailNotFound: "Benutzer-E-Mail nicht gefunden",
  },
  ja: {
    emailAddress: "メールアドレス", googleAccount: "Googleアカウント", emailPassword: "メール & パスワード",
    verified: "確認済み", googleSignIn: "Googleログイン", emailPasswordAuth: "メール & パスワード",
    googleSignInDesc: "Googleアカウントでログインしています。パスワードは不要です。",
    emailPasswordDesc: "メールとパスワードでログインしています。パスワードはいつでも変更できます。",
    solanaWallet: "Solanaウォレット", linked: "連携済み & ", verifiedOn: "確認日：",
    unverified: "未確認", linkWallet: "Solanaウォレットを連携", loadingWallet: "読み込み中...",
    walletAddress: "ウォレットアドレス", verifyWallet: "ウォレットを確認", verifying: "確認中...",
    verifiedLabel: "確認済み", disconnect: "切断", disconnecting: "切断中...",
    viewOnSolscan: "Solscanで表示",
    connectWalletDesc: "Solanaウォレットを接続してトレーディングとDeFi機能を有効化",
    linkWalletBtn: "アカウントにウォレットを連携", linking: "連携中...",
    walletSupportNote: "Phantom、Solflare、その他の主要なSolanaウォレットに対応",
    twitter: "X (Twitter)", notConnected: "未接続", connectX: "Xを接続", connecting: "接続中...",
    discord: "Discord", connectDiscord: "Discordを接続",
    security: "セキュリティ", accountProtection: "アカウント保護",
    password: "パスワード", managePassword: "パスワードを管理", changePassword: "パスワードを変更",
    googleAccountNotice: "Googleアカウント",
    googleAccountDesc: "Googleでログインしています。パスワード管理はGoogleアカウントで行われます。",
    connectedServices: "接続済みサービス", solana: "Solana",
    proTip: "プロのヒント",
    proTipDesc: "Solanaウォレットを接続してプレミアムトレーディング機能と自動DeFi戦略を解放しましょう。",
    failedLoadUser: "ユーザーデータの読み込みに失敗しました", errorLoadUser: "ユーザーデータの読み込みエラー",
    connectWalletFirst: "最初にウォレットを接続してください",
    walletNoSign: "ウォレットがメッセージ署名をサポートしていません。PhantomまたはSolflareを使用してください。",
    failedVerify: "ウォレット所有権の確認に失敗しました",
    walletLinked: "Solanaウォレットの連携に成功しました！", failedLink: "ウォレットの連携に失敗しました",
    walletUnlinked: "ウォレットの切断に成功しました！", failedUnlink: "ウォレットの切断に失敗しました",
    twitterUnlinked: "Twitterアカウントの切断に成功しました！", failedUnlinkTwitter: "Twitterの切断に失敗しました",
    discordLinked: "Discordアカウントの連携に成功しました！", discordError: "Discordアカウントの連携に失敗しました",
    discordUnlinked: "Discordアカウントの切断に成功しました！", failedUnlinkDiscord: "Discordの切断に失敗しました",
    failedPrepareDiscord: "Discord連携の準備に失敗しました", failedStartDiscord: "Discord連携の開始に失敗しました",
    userEmailNotFound: "ユーザーメールが見つかりません",
  },
  pt: {
    emailAddress: "Endereço de e-mail", googleAccount: "Conta Google", emailPassword: "E-mail & Senha",
    verified: "Verificado", googleSignIn: "Login com Google", emailPasswordAuth: "E-mail & Senha",
    googleSignInDesc: "Você entra com sua conta Google. Nenhuma senha necessária.",
    emailPasswordDesc: "Você entra com seu e-mail e senha. Você pode alterar sua senha a qualquer momento.",
    solanaWallet: "Carteira Solana", linked: "Vinculada & ", verifiedOn: "Verificada em",
    unverified: "Não verificada", linkWallet: "Vincule sua carteira Solana", loadingWallet: "Carregando...",
    walletAddress: "Endereço da carteira", verifyWallet: "Verificar carteira", verifying: "Verificando...",
    verifiedLabel: "Verificada", disconnect: "Desconectar", disconnecting: "Desconectando...",
    viewOnSolscan: "Ver no Solscan",
    connectWalletDesc: "Conecte sua carteira Solana para habilitar trading e acessar recursos DeFi",
    linkWalletBtn: "Vincular carteira à conta", linking: "Vinculando...",
    walletSupportNote: "Suportamos Phantom, Solflare e outras carteiras Solana populares",
    twitter: "X (Twitter)", notConnected: "Não conectado", connectX: "Conectar X", connecting: "Conectando...",
    discord: "Discord", connectDiscord: "Conectar Discord",
    security: "Segurança", accountProtection: "Proteção da conta",
    password: "Senha", managePassword: "Gerencie sua senha", changePassword: "Alterar senha",
    googleAccountNotice: "Conta Google",
    googleAccountDesc: "Você está logado com Google. O gerenciamento de senha é feito pela sua conta Google.",
    connectedServices: "Serviços conectados", solana: "Solana",
    proTip: "Dica Pro",
    proTipDesc: "Conecte sua carteira Solana para desbloquear recursos premium de trading e estratégias DeFi automatizadas.",
    failedLoadUser: "Falha ao carregar dados do usuário", errorLoadUser: "Erro ao carregar dados do usuário",
    connectWalletFirst: "Por favor, conecte sua carteira primeiro",
    walletNoSign: "Sua carteira não suporta assinatura de mensagens. Use Phantom ou Solflare.",
    failedVerify: "Falha ao verificar propriedade da carteira",
    walletLinked: "Carteira Solana vinculada com sucesso!", failedLink: "Falha ao vincular carteira",
    walletUnlinked: "Carteira desvinculada com sucesso!", failedUnlink: "Falha ao desvincular carteira",
    twitterUnlinked: "Conta Twitter desvinculada com sucesso!", failedUnlinkTwitter: "Falha ao desvincular Twitter",
    discordLinked: "Conta Discord vinculada com sucesso!", discordError: "Falha ao vincular conta Discord",
    discordUnlinked: "Conta Discord desvinculada com sucesso!", failedUnlinkDiscord: "Falha ao desvincular Discord",
    failedPrepareDiscord: "Falha ao preparar vinculação do Discord", failedStartDiscord: "Falha ao iniciar vinculação do Discord",
    userEmailNotFound: "E-mail do usuário não encontrado",
  },
  zh: {
    emailAddress: "电子邮件地址", googleAccount: "Google账户", emailPassword: "邮箱 & 密码",
    verified: "已验证", googleSignIn: "Google登录", emailPasswordAuth: "邮箱 & 密码",
    googleSignInDesc: "您使用Google账户登录，无需密码。",
    emailPasswordDesc: "您使用邮箱和密码登录，可以随时更改密码。",
    solanaWallet: "Solana钱包", linked: "已关联 & ", verifiedOn: "验证于",
    unverified: "未验证", linkWallet: "关联您的Solana钱包", loadingWallet: "加载中...",
    walletAddress: "钱包地址", verifyWallet: "验证钱包", verifying: "验证中...",
    verifiedLabel: "已验证", disconnect: "断开连接", disconnecting: "断开中...",
    viewOnSolscan: "在Solscan查看",
    connectWalletDesc: "连接您的Solana钱包以启用交易和访问DeFi功能",
    linkWalletBtn: "将钱包关联到账户", linking: "关联中...",
    walletSupportNote: "我们支持Phantom、Solflare及其他主流Solana钱包",
    twitter: "X (Twitter)", notConnected: "未连接", connectX: "连接X", connecting: "连接中...",
    discord: "Discord", connectDiscord: "连接Discord",
    security: "安全", accountProtection: "账户保护",
    password: "密码", managePassword: "管理您的密码", changePassword: "更改密码",
    googleAccountNotice: "Google账户",
    googleAccountDesc: "您已通过Google登录，密码管理由您的Google账户处理。",
    connectedServices: "已连接服务", solana: "Solana",
    proTip: "专业提示",
    proTipDesc: "连接您的Solana钱包以解锁高级交易功能和自动化DeFi策略。",
    failedLoadUser: "加载用户数据失败", errorLoadUser: "加载用户数据出错",
    connectWalletFirst: "请先连接您的钱包",
    walletNoSign: "您的钱包不支持消息签名，请使用Phantom或Solflare。",
    failedVerify: "验证钱包所有权失败",
    walletLinked: "Solana钱包关联成功！", failedLink: "关联钱包失败",
    walletUnlinked: "钱包断开连接成功！", failedUnlink: "断开钱包连接失败",
    twitterUnlinked: "Twitter账户断开连接成功！", failedUnlinkTwitter: "断开Twitter连接失败",
    discordLinked: "Discord账户关联成功！", discordError: "关联Discord账户失败",
    discordUnlinked: "Discord账户断开连接成功！", failedUnlinkDiscord: "断开Discord连接失败",
    failedPrepareDiscord: "准备Discord关联失败", failedStartDiscord: "启动Discord关联失败",
    userEmailNotFound: "未找到用户邮箱",
  },
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface SolanaWalletData { walletAddress: string; verified: boolean; linkedAt: string; nickname?: string; isPrimary: boolean }
interface UserData { email: string; username: string; firstName: string; lastName: string; authProvider: string; isGoogleAccount: boolean }

// ─── Google Icon ────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { language } = useLanguage()
  const tr = translations[language as keyof typeof translations] || translations.en

  const { isAuthenticated } = useAuth()
  const { publicKey, connected, disconnect, signMessage } = useWallet()
  const [isVerifying, setIsVerifying] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [solanaWallet, setSolanaWallet] = useState<SolanaWalletData | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isLoadingWallet, setIsLoadingWallet] = useState(true)
  const [isLinking, setIsLinking] = useState(false)
  const [isUnlinking, setIsUnlinking] = useState(false)
  const [connections, setConnections] = useState({ solana: false, twitter: false, discord: false })
  const [twitterAccount, setTwitterAccount] = useState<{ twitterId: string; username: string; displayName: string; profileImageUrl: string; linkedAt: string } | null>(null)
  const [isLinkingTwitter, setIsLinkingTwitter] = useState(false)
  const [discordAccount, setDiscordAccount] = useState<{ discordId: string; username: string; discriminator: string; displayName: string; avatarUrl: string; linkedAt: string } | null>(null)
  const [isLinkingDiscord, setIsLinkingDiscord] = useState(false)

  const fetchDiscordAccount = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/social/discord`, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
      if (res.ok) { const data = await res.json(); setDiscordAccount(data); setConnections(p => ({ ...p, discord: true })) }
      else if (res.status === 404) { setDiscordAccount(null); setConnections(p => ({ ...p, discord: false })) }
    } catch (e) { console.error(e) }
  }

  const handleLinkDiscord = async () => {
    if (!userData?.email) { toast.error(tr.userEmailNotFound); return }
    setIsLinkingDiscord(true)
    try {
      const auth_token = localStorage.getItem('auth_token')
      const prepareRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/social/discord/prepare`, { method: "POST", headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}` } })
      if (!prepareRes.ok) { toast.error(tr.failedPrepareDiscord); setIsLinkingDiscord(false); return }
      const { token } = await prepareRes.json()
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}oauth2/authorization/discord?link_token=${encodeURIComponent(token)}`
    } catch (err) { console.error(err); toast.error(tr.failedStartDiscord); setIsLinkingDiscord(false) }
  }

  const handleUnlinkDiscord = async () => {
    try {
      const auth_token = localStorage.getItem('auth_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/social/discord/unlink`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}` } })
      if (!res.ok) { const data = await res.json(); toast.error(data.error || tr.failedUnlinkDiscord); return }
      setDiscordAccount(null); setConnections(p => ({ ...p, discord: false })); toast.success(tr.discordUnlinked)
    } catch (e) { console.error(e); toast.error(tr.failedUnlinkDiscord) }
  }

  useEffect(() => { if (isAuthenticated) { fetchUserData(); fetchDiscordAccount() } }, [isAuthenticated])

  useEffect(() => {
    fetch('https://api.harvest3.com/api/solana/health').then(r => r.json()).then(d => console.log('Health:', d)).catch(console.error)
    const params = new URLSearchParams(window.location.search)
    const discordStatus = params.get('discord')
    if (discordStatus === 'success') { toast.success(tr.discordLinked); window.history.replaceState({}, '', '/profile'); fetchDiscordAccount() }
    else if (discordStatus === 'error') { toast.error(params.get('message') || tr.discordError); window.history.replaceState({}, '', '/profile') }
  }, [])

  const handleLinkTwitter = async () => { /* coming soon */ }
  const handleUnlinkTwitter = async () => {
    try {
      const auth_token = localStorage.getItem('auth_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/social/twitter/unlink`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth_token}` } })
      if (!res.ok) { const data = await res.json(); toast.error(data.message || tr.failedUnlinkTwitter); return }
      setTwitterAccount(null); setConnections(p => ({ ...p, twitter: false })); toast.success(tr.twitterUnlinked)
    } catch (e) { console.error(e); toast.error(tr.failedUnlinkTwitter) }
  }

  const handleVerifyWallet = async () => {
    if (!connected) { toast.info(tr.connectWalletFirst); return }
    if (!publicKey || !solanaWallet) return
    if (!signMessage) { toast.error(tr.walletNoSign); return }
    try {
      setIsVerifying(true)
      const message = new TextEncoder().encode("Verify wallet ownership on HARVEST 3")
      const signature: Uint8Array = await signMessage(message)
      const pubKeyUint8 = bs58.decode(solanaWallet.walletAddress)
      const isValid = nacl.sign.detached.verify(message, signature, pubKeyUint8)
      if (!isValid) { toast.error(tr.failedVerify); return }
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/solana/verify?walletAddress=${solanaWallet.walletAddress}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } })
      fetchUserData()
    } finally { setIsVerifying(false) }
  }

  useEffect(() => { if (isAuthenticated) fetchUserData() }, [isAuthenticated])
  useEffect(() => { if (connected && publicKey && !solanaWallet && !isLinking && isAuthenticated && solanaWallet) handleLinkWallet() }, [connected, publicKey, solanaWallet, isAuthenticated])

  const fetchUserData = async () => {
    const token = localStorage.getItem('auth_token')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        if (data.wallet) { setSolanaWallet(data.wallet); setConnections(p => ({ ...p, solana: true })) }
        else { setSolanaWallet(null); setConnections(p => ({ ...p, solana: false })) }
        setIsLoadingWallet(false)
        setUserData({ email: data.email, username: "None", firstName: "None", lastName: "None", authProvider: data.authProvider || 'LOCAL', isGoogleAccount: data.authProvider === 'GOOGLE' })
      } else { toast.error(tr.failedLoadUser) }
    } catch (e) { console.error(e); toast.error(tr.errorLoadUser) }
    finally { setIsLoadingUser(false) }
  }

  const handleLinkWallet = async () => {
    if (!publicKey) { toast.error(tr.connectWalletFirst); return }
    setIsLinking(true)
    try {
      const walletAddress = publicKey.toBase58()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/solana/link`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }, body: JSON.stringify({ walletAddress }) })
      const data = await res.json()
      if (!res.ok) { toast.error(data.message || tr.failedLink); await disconnect(); return }
      setSolanaWallet(data); setConnections(p => ({ ...p, solana: true })); toast.success(tr.walletLinked)
    } catch (e: unknown) { console.error(e); toast.error(tr.failedLink); await disconnect() }
    finally { setIsLinking(false) }
  }

  const handleUnlinkWallet = async () => {
    setIsUnlinking(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/solana/unlink`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } })
      if (!res.ok) { const data = await res.json(); toast.error(data.message || tr.failedUnlink); return }
      await disconnect(); setSolanaWallet(null); setConnections(p => ({ ...p, solana: false })); toast.success(tr.walletUnlinked)
    } catch (e) { console.error(e); toast.error(tr.failedUnlink) }
    finally { setIsUnlinking(false) }
  }

  if (isLoadingUser) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  if (!userData) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{tr.failedLoadUser}</p></div>

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Email Card */}
            <BlurFade delay={0.2} inView>
              <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center"><Mail className="w-6 h-6 text-blue-500" /></div>
                      <div>
                        <h3 className="text-lg font-semibold">{tr.emailAddress}</h3>
                        <p className="text-sm text-muted-foreground">{userData.isGoogleAccount ? tr.googleAccount : tr.emailPassword}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">{tr.verified}</span>
                    </div>
                  </div>
                  <div className="relative w-full mb-6 py-1"><GlowLine orientation="horizontal" position="50%" color="lightgreen" /></div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex-1"><p className="text-base font-medium text-foreground">{userData.email}</p></div>
                      {userData.isGoogleAccount && (
                        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-border/50">
                          <GoogleIcon /><span className="text-xs font-medium text-foreground">Google</span>
                        </div>
                      )}
                    </div>
                    <div className={cn("p-4 rounded-xl border", userData.isGoogleAccount ? "bg-blue-500/5 border-blue-500/20" : "bg-primary/5 border-primary/20")}>
                      <div className="flex items-start gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", userData.isGoogleAccount ? "bg-blue-500/10" : "bg-primary/10")}>
                          {userData.isGoogleAccount ? <GoogleIcon /> : <KeyRound className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground mb-1">{userData.isGoogleAccount ? tr.googleSignIn : tr.emailPasswordAuth}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{userData.isGoogleAccount ? tr.googleSignInDesc : tr.emailPasswordDesc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ShineBorder shineColor="#A3E635" borderWidth={3} />
              </Card>
            </BlurFade>

            {/* Solana Wallet */}
            <BlurFade delay={0.3} inView>
              <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm group hover:border-primary/30 transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Wallet className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {tr.solanaWallet}
                          {solanaWallet && solanaWallet.verified && <Check className="w-4 h-4 text-green-500" />}
                          {solanaWallet && !solanaWallet.verified && <Check className="w-4 h-4 text-orange-500" />}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isLoadingWallet ? tr.loadingWallet : solanaWallet ? tr.linked : tr.linkWallet}
                          {!isLoadingWallet && solanaWallet && solanaWallet.verified && `${tr.verifiedOn} ${new Date(solanaWallet.linkedAt).toLocaleDateString()}`}
                          {!isLoadingWallet && solanaWallet && !solanaWallet.verified && tr.unverified}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full mb-6 py-1"><GlowLine orientation="horizontal" position="50%" color="lightgreen" /></div>

                  {isLoadingWallet ? (
                    <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                  ) : solanaWallet ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20">
                        <p className="text-xs text-muted-foreground mb-1">{tr.walletAddress}</p>
                        <div className="flex items-center gap-2 flex-wrap justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-sm font-mono text-foreground break-all">{solanaWallet.walletAddress}</code>
                            <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors flex-shrink-0" onClick={() => window.open(`https://solscan.io/account/${solanaWallet.walletAddress}`, '_blank')} />
                          </div>
                          {!connected ? (
                            <WalletMultiButton className="!w-full !justify-center" />
                          ) : !solanaWallet.verified ? (
                            <Button size="sm" variant="outline" className="mt-3 border-green-500/30 text-green-600 hover:bg-green-500/10" onClick={handleVerifyWallet} disabled={isVerifying}>
                              {isVerifying ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Check className="w-3 h-3 mr-2" />}
                              {isVerifying ? tr.verifying : tr.verifyWallet}
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 mt-2"><Check className="w-3 h-3 text-green-500" /><span className="text-xs text-green-600 dark:text-green-400">{tr.verifiedLabel}</span></div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50" onClick={handleUnlinkWallet} disabled={isUnlinking}>
                          {isUnlinking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Unlink className="w-4 h-4 mr-2" />}
                          {isUnlinking ? tr.disconnecting : tr.disconnect}
                        </Button>
                        <Button variant="outline" className="border-border/50 hover:bg-muted/50" onClick={() => window.open(`https://solscan.io/account/${solanaWallet.walletAddress}`, '_blank')}>
                          {tr.viewOnSolscan}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <p className="text-sm text-muted-foreground text-center">
                          {tr.connectWalletDesc}
                          <div className="wallet-adapter-button-wrapper">
                            <WalletMultiButton className="!bg-gradient-to-r !from-primary !to-accent hover:!from-primary/90 hover:!to-accent/90 !text-white !shadow-lg !shadow-primary/25 hover:!shadow-xl hover:!shadow-primary/40 !transition-all !duration-300 !w-full !justify-center" />
                          </div>
                        </p>
                      </div>
                      {connected && (
                        <ShimmerButton className="w-full shadow-2xl" onClick={handleLinkWallet} disabled={isLinking}>
                          {isLinking ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span>{tr.linking}</span></>) : (<><Wallet className="w-4 h-4 mr-2" /><span>{tr.linkWalletBtn}</span></>)}
                        </ShimmerButton>
                      )}
                      <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <div className="flex items-start gap-2"><AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" /><p className="text-xs text-muted-foreground">{tr.walletSupportNote}</p></div>
                      </div>
                    </div>
                  )}
                </div>
                {solanaWallet && <ShineBorder shineColor="#A3E635" borderWidth={3} />}
              </Card>
            </BlurFade>

            {/* Social Connections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Twitter */}
              <BlurFade delay={0.4} inView>
                <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm group hover:border-blue-500/30 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform"><Twitter className="w-5 h-5 text-blue-500" /></div>
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-2">{tr.twitter}{twitterAccount && <Check className="w-4 h-4 text-green-500" />}</h3>
                        <p className="text-xs text-muted-foreground">{twitterAccount ? `@${twitterAccount.username}` : tr.notConnected}</p>
                      </div>
                    </div>
                    <div className="relative w-full mb-6 py-1"><GlowLine orientation="horizontal" position="50%" color="blue" /></div>
                    {twitterAccount ? (
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                          <div className="flex items-center gap-3">
                            {twitterAccount.profileImageUrl && <img src={twitterAccount.profileImageUrl} alt={twitterAccount.username} className="w-10 h-10 rounded-full" />}
                            <div><p className="text-sm font-medium">{twitterAccount.displayName}</p><p className="text-xs text-muted-foreground">@{twitterAccount.username}</p></div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10" onClick={handleUnlinkTwitter}>
                          <Unlink className="w-3 h-3 mr-2" />{tr.disconnect}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-500 transition-all" onClick={handleLinkTwitter} disabled={isLinkingTwitter}>
                        {isLinkingTwitter ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LinkIcon className="w-4 h-4 mr-2" />}
                        {isLinkingTwitter ? tr.connecting : tr.connectX}
                      </Button>
                    )}
                  </div>
                  {twitterAccount && <ShineBorder shineColor="#A3E635" borderWidth={3} />}
                </Card>
              </BlurFade>

              {/* Discord */}
              <BlurFade delay={0.5} inView>
                <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm group hover:border-indigo-500/30 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform"><MessageSquare className="w-5 h-5 text-indigo-500" /></div>
                      <div className="flex-1">
                        <h3 className="font-semibold flex items-center gap-2">{tr.discord}{discordAccount && <Check className="w-4 h-4 text-green-500" />}</h3>
                        <p className="text-xs text-muted-foreground">
                          {discordAccount ? `${discordAccount.username}${discordAccount.discriminator && discordAccount.discriminator !== '0' ? `#${discordAccount.discriminator}` : ''}` : tr.notConnected}
                        </p>
                      </div>
                    </div>
                    <div className="relative w-full mb-6 py-1"><GlowLine orientation="horizontal" position="50%" color="purple" /></div>
                    {discordAccount ? (
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
                          <div className="flex items-center gap-3">
                            {discordAccount.avatarUrl && <img src={discordAccount.avatarUrl} alt={discordAccount.username} className="w-10 h-10 rounded-full" />}
                            <div>
                              <p className="text-sm font-medium">{discordAccount.displayName}</p>
                              <p className="text-xs text-muted-foreground">{discordAccount.username}{discordAccount.discriminator && discordAccount.discriminator !== '0' && `#${discordAccount.discriminator}`}</p>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10" onClick={handleUnlinkDiscord}>
                          <Unlink className="w-3 h-3 mr-2" />{tr.disconnect}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full border-indigo-500/30 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-indigo-500 transition-all" onClick={handleLinkDiscord} disabled={isLinkingDiscord}>
                        {isLinkingDiscord ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LinkIcon className="w-4 h-4 mr-2" />}
                        {isLinkingDiscord ? tr.connecting : tr.connectDiscord}
                      </Button>
                    )}
                  </div>
                  {discordAccount && <ShineBorder shineColor="#A3E635" borderWidth={3} />}
                </Card>
              </BlurFade>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <BlurFade delay={0.6} inView>
              <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm sticky top-24">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center"><Shield className="w-6 h-6 text-red-500" /></div>
                    <div><h3 className="text-lg font-semibold">{tr.security}</h3><p className="text-xs text-muted-foreground">{tr.accountProtection}</p></div>
                  </div>
                  <div className="relative w-full mb-6 py-1"><GlowLine orientation="horizontal" position="50%" color="lightgreen" /></div>
                  <div className="space-y-4">
                    {!userData.isGoogleAccount && (
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><KeyRound className="w-4 h-4 text-primary" /></div>
                            <div><p className="text-sm font-medium">{tr.password}</p><p className="text-xs text-muted-foreground">{tr.managePassword}</p></div>
                          </div>
                        </div>
                        <Link href="/change-password">
                          <Button variant="outline" size="sm" className="w-full border-border/50 hover:bg-primary/10 hover:border-primary/50 hover:text-primary group-hover:shadow-md transition-all">
                            {tr.changePassword}<ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    )}
                    {userData.isGoogleAccount && (
                      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div><p className="text-sm font-medium text-foreground mb-1">{tr.googleAccountNotice}</p><p className="text-xs text-muted-foreground leading-relaxed">{tr.googleAccountDesc}</p></div>
                        </div>
                      </div>
                    )}
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-3">{tr.connectedServices}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{tr.solana}</span><div className={cn("w-2 h-2 rounded-full", solanaWallet ? (solanaWallet.verified ? "bg-green-500" : "bg-orange-500") : "bg-gray-400")} /></div>
                        <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{tr.twitter}</span><div className={cn("w-2 h-2 rounded-full", twitterAccount?.username ? "bg-green-500" : "bg-gray-400")} /></div>
                        <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{tr.discord}</span><div className={cn("w-2 h-2 rounded-full", discordAccount?.username ? "bg-green-500" : "bg-gray-400")} /></div>
                      </div>
                    </div>
                  </div>
                </div>
                <ShineBorder shineColor="#A3E635" borderWidth={3} />
              </Card>
            </BlurFade>

            <BlurFade delay={0.7} inView>
              <Card className="p-6 border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div><p className="text-sm font-medium text-foreground mb-1">{tr.proTip}</p><p className="text-xs text-muted-foreground leading-relaxed">{tr.proTipDesc}</p></div>
                </div>
              </Card>
            </BlurFade>
          </div>
        </div>
      </main>
    </div>
  )
}