"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { FormCard, type FeeOption } from "@/components/FormCard";

// Minimal dashboard wiring — full orchestration lives in StellarSpendDashboard (Issue 15)
export default function Page() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [xlmBalance, setXlmBalance] = useState<string | null>(null);

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [feeMethod, setFeeMethod] = useState<"native" | "stablecoin">("native");

  const [isLoadingCurrencies] = useState(false);
  const [isLoadingBanks] = useState(false);
  const [isLoadingQuote] = useState(false);
  const [isLoadingFees] = useState(false);
  const [isVerifyingAccount] = useState(false);

  const feeOptions: FeeOption[] = [
    { label: "XLM", method: "native", amount: "~0.001 XLM" },
    { label: "USDC", method: "stablecoin", amount: "~0.50 USDC" },
  ];

  async function handleConnect() {
    setIsConnecting(true);
    // Wallet connection handled by useStellarWallet in full implementation
    await new Promise((r) => setTimeout(r, 800));
    setIsConnecting(false);
    setIsConnected(true);
    setIsBalanceLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setUsdcBalance("1,250.00");
    setXlmBalance("42.50");
    setIsBalanceLoading(false);
  }

  function handleDisconnect() {
    setIsConnected(false);
    setUsdcBalance(null);
    setXlmBalance(null);
    setAmount("");
    setCurrency("");
    setBank("");
    setAccountNumber("");
    setAccountName("");
  }

  return (
    <main style={{ minHeight: "100vh", padding: "clamp(1rem, 3vw, 2.6rem)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Header
          subtitle="Convert Stellar USDC to fiat — fast, non-custodial."
          isConnected={isConnected}
          isConnecting={isConnecting}
          walletAddress="GCFX7ABCDE2YTK"
          stellarUsdcBalance={usdcBalance}
          stellarXlmBalance={xlmBalance}
          isBalanceLoading={isBalanceLoading}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        <FormCard
          amount={amount}
          currency={currency}
          bank={bank}
          accountNumber={accountNumber}
          accountName={accountName}
          feeMethod={feeMethod}
          currencies={[{ value: "NGN", label: "Nigerian Naira (NGN)" }]}
          banks={[{ value: "ACCESS", label: "Access Bank" }]}
          feeOptions={feeOptions}
          isLoadingCurrencies={isLoadingCurrencies}
          isLoadingBanks={isLoadingBanks}
          isLoadingQuote={isLoadingQuote}
          isLoadingFees={isLoadingFees}
          isVerifyingAccount={isVerifyingAccount}
          isConnected={isConnected}
          isConnecting={isConnecting}
          onAmountChange={setAmount}
          onCurrencyChange={setCurrency}
          onBankChange={setBank}
          onAccountNumberChange={setAccountNumber}
          onFeeMethodChange={setFeeMethod}
          onSubmit={() => {}}
        />
      </div>
    </main>
  );
}
