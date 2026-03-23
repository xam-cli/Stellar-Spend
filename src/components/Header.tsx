import { Skeleton } from "./ui/Skeleton";

export interface HeaderProps {
  subtitle: string;
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress?: string;
  stellarUsdcBalance?: string | null;
  stellarXlmBalance?: string | null;
  isBalanceLoading?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function Header({
  subtitle,
  isConnected,
  isConnecting,
  walletAddress,
  stellarUsdcBalance,
  stellarXlmBalance,
  isBalanceLoading = false,
  onConnect,
  onDisconnect,
}: HeaderProps) {
  const btnLabel = isConnecting
    ? "CONNECTING..."
    : isConnected
    ? truncate(walletAddress ?? "")
    : "CONNECT WALLET";

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 32,
      }}
    >
      {/* Title */}
      <div>
        <h1
          className="font-space-grotesk"
          style={{
            margin: 0,
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          STELLAR-SPEND
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>{subtitle}</p>
      </div>

      {/* Wallet button + balances */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <button
          onClick={isConnected ? onDisconnect : onConnect}
          disabled={isConnecting}
          aria-label={isConnected ? "Disconnect wallet" : "Connect wallet"}
          style={{
            border: "1px solid var(--accent)",
            padding: "8px 16px",
            fontSize: 12,
            letterSpacing: "0.08em",
            background: "none",
            color: "var(--accent)",
            cursor: isConnecting ? "default" : "pointer",
            opacity: isConnecting ? 0.7 : 1,
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!isConnecting) {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
              (e.currentTarget as HTMLButtonElement).style.color = "#000";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "none";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
          }}
        >
          {btnLabel}
        </button>

        {/* Balance rows — only shown when connected */}
        {isConnected && (
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}
            aria-live="polite"
            aria-label="Wallet balances"
          >
            {isBalanceLoading ? (
              <>
                <Skeleton width={110} height={13} aria-label="Loading USDC balance…" />
                <Skeleton width={90} height={13} aria-label="Loading XLM balance…" />
              </>
            ) : (
              <>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  {stellarUsdcBalance ?? "0.00"} USDC
                </span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  {stellarXlmBalance ?? "0.00"} XLM
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function truncate(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
