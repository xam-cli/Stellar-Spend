"use client";

import { Skeleton } from "./ui/Skeleton";
import { InputField } from "./ui/InputField";
import { SelectField } from "./ui/SelectField";
import { Field } from "./ui/Field";

export interface FeeOption {
  label: string;
  amount: string;
  method: "native" | "stablecoin";
}

export interface FormCardProps {
  // values
  amount: string;
  currency: string;
  bank: string;
  accountNumber: string;
  accountName: string;
  feeMethod: "native" | "stablecoin";
  quoteSuffix?: string;

  // options
  currencies: { value: string; label: string }[];
  banks: { value: string; label: string }[];
  feeOptions: FeeOption[];

  // loading flags
  isLoadingCurrencies?: boolean;
  isLoadingBanks?: boolean;
  isLoadingQuote?: boolean;
  isLoadingFees?: boolean;
  isVerifyingAccount?: boolean;

  // connection state
  isConnected: boolean;
  isConnecting: boolean;
  isInitiating?: boolean;

  // callbacks
  onAmountChange: (v: string) => void;
  onCurrencyChange: (v: string) => void;
  onBankChange: (v: string) => void;
  onAccountNumberChange: (v: string) => void;
  onFeeMethodChange: (m: "native" | "stablecoin") => void;
  onSubmit: () => void;
}

export function FormCard({
  amount,
  currency,
  bank,
  accountNumber,
  accountName,
  feeMethod,
  quoteSuffix,
  currencies,
  banks,
  feeOptions,
  isLoadingCurrencies = false,
  isLoadingBanks = false,
  isLoadingQuote = false,
  isLoadingFees = false,
  isVerifyingAccount = false,
  isConnected,
  isConnecting,
  isInitiating = false,
  onAmountChange,
  onCurrencyChange,
  onBankChange,
  onAccountNumberChange,
  onFeeMethodChange,
  onSubmit,
}: FormCardProps) {
  const canSubmit =
    isConnected &&
    !isConnecting &&
    !isInitiating &&
    amount !== "" &&
    parseFloat(amount) > 0 &&
    currency !== "" &&
    bank !== "" &&
    accountNumber.length === 10 &&
    accountName !== "";

  const ctaLabel = !isConnected
    ? "CONNECT WALLET"
    : isConnecting
    ? "WAITING FOR SIGNATURE..."
    : isInitiating
    ? "INITIATING OFFRAMP..."
    : "INITIATE OFFRAMP →";

  return (
    <section
      style={{
        background: "var(--panel)",
        border: "1px solid var(--line)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
      aria-label="Offramp form"
    >
      {/* Amount + quote suffix */}
      <InputField
        label="AMOUNT (USDC)"
        value={amount}
        onChange={onAmountChange}
        type="number"
        min="0.7"
        step="0.000001"
        placeholder="0.00"
        isLoadingSuffix={isLoadingQuote}
        suffix={quoteSuffix}
        disabled={!isConnected}
      />

      {/* Gas fee selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em" }}>
          GAS FEE METHOD
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {isLoadingFees ? (
            <>
              <Skeleton width={120} height={46} aria-label="Loading fee option…" />
              <Skeleton width={120} height={46} aria-label="Loading fee option…" />
            </>
          ) : (
            feeOptions.map((opt) => (
              <button
                key={opt.method}
                onClick={() => onFeeMethodChange(opt.method)}
                aria-pressed={feeMethod === opt.method}
                style={{
                  flex: 1,
                  height: 46,
                  border: `1px solid ${feeMethod === opt.method ? "var(--accent)" : "var(--line)"}`,
                  background: feeMethod === opt.method ? "rgba(201,169,98,0.1)" : "none",
                  color: feeMethod === opt.method ? "var(--accent)" : "var(--muted)",
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  transition: "border-color 0.15s, background 0.15s, color 0.15s",
                }}
              >
                {opt.label}
                <br />
                <span style={{ fontSize: 11, opacity: 0.8 }}>{opt.amount}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Currency dropdown */}
      <SelectField
        label="CURRENCY"
        value={currency}
        onChange={onCurrencyChange}
        options={currencies}
        isLoading={isLoadingCurrencies}
        placeholder="Select currency…"
      />

      {/* Account number */}
      <InputField
        label="ACCOUNT NUMBER"
        value={accountNumber}
        onChange={onAccountNumberChange}
        placeholder="0000000000"
        disabled={!isConnected}
      />

      {/* Bank dropdown */}
      <SelectField
        label="BANK"
        value={bank}
        onChange={onBankChange}
        options={banks}
        isLoading={isLoadingBanks}
        disabled={currency === ""}
        placeholder="Select bank…"
      />

      {/* Account name (read-only, auto-resolved) */}
      <Field
        label="ACCOUNT NAME"
        value={accountName || undefined}
        tone="accent"
        isLoading={isVerifyingAccount}
        loadingLabel="Verifying account…"
      />

      {/* CTA */}
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        style={{
          height: 48,
          background: canSubmit ? "var(--accent)" : "var(--line)",
          color: canSubmit ? "#000" : "var(--muted)",
          border: 0,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.08em",
          cursor: canSubmit ? "pointer" : "default",
          transition: "background 0.15s, color 0.15s",
        }}
      >
        {ctaLabel}
      </button>
    </section>
  );
}
