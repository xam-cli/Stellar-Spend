"use client";

import { cn } from "@/lib/cn";
import { Skeleton } from "@/components/ui/Skeleton";
import { FormCardSkeleton } from "@/components/skeletons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeeOption {
  label: string;
  amount: string;
  method: "native" | "stablecoin";
}

export interface FormCardProps {
  // Controlled field values
  amount: string;
  currency: string;
  bank: string;
  accountNumber: string;
  accountName: string;
  feeMethod: "native" | "stablecoin";
  // Options
  currencies: Array<{ value: string; label: string }>;
  banks: Array<{ value: string; label: string }>;
  feeOptions: FeeOption[];
  // Loading states
  isLoadingCurrencies?: boolean;
  isLoadingBanks?: boolean;
  isLoadingQuote?: boolean;
  isLoadingFees?: boolean;
  isVerifyingAccount?: boolean;
  /** Show a full-form skeleton (e.g. on first mount before wallet is ready) */
  isInitialLoading?: boolean;
  // Quote display
  quoteSuffix?: string;
  // Wallet state
  isConnected: boolean;
  isConnecting: boolean;
  // Callbacks
  onAmountChange: (v: string) => void;
  onCurrencyChange: (v: string) => void;
  onBankChange: (v: string) => void;
  onAccountNumberChange: (v: string) => void;
  onFeeMethodChange: (v: "native" | "stablecoin") => void;
  onSubmit: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[10px] tracking-[0.18em] text-muted uppercase">
      {children}
    </label>
  );
}

function inputCls(error?: boolean) {
  return cn(
    "w-full bg-bg border px-3 py-2.5 text-sm text-text placeholder-[#444444]",
    "focus:outline-none focus-visible:ring-1 focus-visible:ring-accent",
    "disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150",
    error ? "border-red-500/60" : "border-line focus:border-accent"
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function FormCard({
  amount,
  currency,
  bank,
  accountNumber,
  accountName,
  feeMethod,
  currencies,
  banks,
  feeOptions,
  isLoadingCurrencies,
  isLoadingBanks,
  isLoadingQuote,
  isLoadingFees,
  isVerifyingAccount,
  isInitialLoading,
  quoteSuffix,
  isConnected,
  isConnecting,
  onAmountChange,
  onCurrencyChange,
  onBankChange,
  onAccountNumberChange,
  onFeeMethodChange,
  onSubmit,
}: FormCardProps) {
  if (isInitialLoading) {
    return <FormCardSkeleton />;
  }

  const ctaLabel = isConnecting
    ? "CONNECTING..."
    : !isConnected
    ? "CONNECT WALLET"
    : "INITIATE OFFRAMP →";

  const ctaDisabled =
    isConnecting ||
    !isConnected ||
    !amount ||
    !currency ||
    !bank ||
    !accountNumber ||
    !accountName;

  return (
    <section
      role="region"
      aria-label="Offramp form"
      className="bg-panel border border-line p-6 flex flex-col gap-6"
    >
      {/* Amount */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="amount">Amount (USDC)</Label>
        <div className="relative flex items-center">
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            inputMode="decimal"
            disabled={!isConnected}
            className={cn(inputCls(), "pr-32")}
          />
          <span className="absolute right-3 text-xs text-muted pointer-events-none select-none">
            {isLoadingQuote ? (
              <Skeleton width={64} height={14} aria-label="Loading quote…" />
            ) : quoteSuffix ? (
              quoteSuffix
            ) : (
              "USDC"
            )}
          </span>
        </div>
      </div>

      {/* Fee method */}
      <div className="flex flex-col gap-1.5">
        <Label>Gas Fee Method</Label>
        {isLoadingFees ? (
          <div className="flex gap-2">
            <Skeleton width="50%" height={44} aria-label="Loading fee option…" />
            <Skeleton width="50%" height={44} aria-label="Loading fee option…" />
          </div>
        ) : (
          <div className="flex gap-2">
            {feeOptions.map((opt) => (
              <button
                key={opt.method}
                type="button"
                aria-label={opt.label}
                onClick={() => onFeeMethodChange(opt.method)}
                disabled={!isConnected}
                className={cn(
                  "flex-1 py-2.5 px-3 text-xs tracking-widest border transition-colors duration-150",
                  "focus:outline-none focus-visible:ring-1 focus-visible:ring-accent",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  feeMethod === opt.method
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-line bg-bg text-muted hover:border-accent/50"
                )}
              >
                <span className="block font-semibold">{opt.label}</span>
                <span className="block text-[10px] mt-0.5 opacity-80">{opt.amount}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Currency + Bank */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Currency */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currency">Currency</Label>
          {isLoadingCurrencies ? (
            <Skeleton width="100%" height={42} aria-label="Loading currency options…" />
          ) : (
            <select
              id="currency"
              aria-label="CURRENCY"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              disabled={!isConnected}
              className={cn(
                "w-full appearance-none bg-bg border border-line px-3 py-2.5 text-sm",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus:border-accent",
                "disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150",
                currency ? "text-text" : "text-[#444444]"
              )}
            >
              <option value="" disabled>Select currency...</option>
              {currencies.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Bank */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bank">Bank / Institution</Label>
          {isLoadingBanks ? (
            <Skeleton width="100%" height={42} aria-label="Loading bank options…" />
          ) : (
            <select
              id="bank"
              aria-label="BANK"
              value={bank}
              onChange={(e) => onBankChange(e.target.value)}
              disabled={!isConnected || !currency}
              className={cn(
                "w-full appearance-none bg-bg border border-line px-3 py-2.5 text-sm",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus:border-accent",
                "disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150",
                bank ? "text-text" : "text-[#444444]"
              )}
            >
              <option value="" disabled>{currency ? "Select bank..." : "Select currency first"}</option>
              {banks.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Account number */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="accountNumber">Account Number</Label>
        <input
          id="accountNumber"
          type="text"
          inputMode="numeric"
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="0000000000"
          disabled={!isConnected || !bank}
          className={inputCls()}
        />
      </div>

      {/* Account name */}
      <div className="flex flex-col gap-1.5">
        <Label>Account Name</Label>
        <div className="bg-bg border border-line px-3 py-2.5 text-sm min-h-[42px] flex items-center">
          {isVerifyingAccount ? (
            <Skeleton width={160} height={14} aria-label="Verifying account…" />
          ) : accountName ? (
            <span className="text-accent">{accountName}</span>
          ) : (
            <span className="text-[#444444]">—</span>
          )}
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={ctaDisabled}
        aria-label={ctaLabel}
        className={cn(
          "w-full py-4 text-xs font-bold tracking-[0.2em] transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel",
          !ctaDisabled
            ? "bg-accent text-black hover:bg-[#d4b982]"
            : "bg-[#222222] text-[#555555] cursor-not-allowed border border-line",
          isConnecting && "animate-pulse"
        )}
      >
        {ctaLabel}
      </button>
    </section>
  );
}

export default FormCard;
