"use client";

import { useState, useCallback } from "react";
import FormCard, { type OfframpPayload, type QuoteResult } from "@/components/FormCard";
import RightPanel from "@/components/RightPanel";
import RecentOfframpsTable from "@/components/RecentOfframpsTable";
import ProgressSteps from "@/components/ProgressSteps";
import { TransactionProgressModal } from "@/components/TransactionProgressModal";
import { Header } from "@/components/Header";
import { OfframpStep } from "@/types/stellaramp";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import { TransactionStorage, type Transaction } from "@/lib/transaction-storage";

export default function Home() {
  const { wallet } = useStellarWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  
  // Test state for modal
  const [modalStep, setModalStep] = useState<OfframpStep>("idle");
  const [currentPayload, setCurrentPayload] = useState<OfframpPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleConnect = useCallback(() => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 1000);
  }, []);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    setAmount("");
    setCurrency("");
    setQuote(null);
  }, []);

  const handleSubmit = useCallback(async (payload: OfframpPayload) => {
    if (!wallet?.publicKey) {
      setErrorMessage("Wallet not connected");
      setModalStep("error");
      return;
    }

    setCurrentPayload(payload);
    setErrorMessage(undefined);
    setModalStep("initiating");
    
    try {
      // Simulate flow
      const flow: OfframpStep[] = ["awaiting-signature", "submitting", "processing", "settling", "success"];
      for (const step of flow) {
        await new Promise(r => setTimeout(r, 1500));
        setModalStep(step);
      }

      // Save transaction to localStorage on success
      const transaction: Transaction = {
        id: TransactionStorage.generateId(),
        timestamp: Date.now(),
        userAddress: wallet.publicKey,
        amount: payload.amount,
        currency: payload.currency,
        beneficiary: {
          institution: payload.institution,
          accountIdentifier: payload.accountIdentifier,
          accountName: payload.accountName,
          currency: payload.currency,
        },
        status: "completed",
      };
      TransactionStorage.save(transaction);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Transaction failed";
      setErrorMessage(message);
      setModalStep("error");
    }
  }, [wallet?.publicKey]);

  return (
    <main className="min-h-screen p-4 bg-[#0a0a0a]">
      <TransactionProgressModal 
        step={modalStep}
        errorMessage={errorMessage}
        onClose={() => {
          setModalStep("idle");
          setCurrentPayload(null);
          setErrorMessage(undefined);
        }} 
      />
      
      <Header
        subtitle="Offramp Dashboard"
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      <section className="border border-[#333333] px-[2.6rem] py-8 max-[1100px]:p-4 overflow-hidden mt-6">
        <div className="grid grid-cols-[1fr_370px] gap-6 max-[1100px]:grid-cols-1 overflow-hidden w-full">
          <div data-testid="FormCard">
            <FormCard
              isConnected={isConnected}
              isConnecting={isConnecting}
              onConnect={handleConnect}
              onSubmit={handleSubmit}
              onQuoteChange={setQuote}
              onAmountChange={setAmount}
              onCurrencyChange={setCurrency}
            />
          </div>
          <div
            data-testid="RightPanel"
            className="col-start-2 row-start-1 row-span-2 max-[1100px]:col-start-1 max-[1100px]:row-span-1"
          >
            <RightPanel
              isConnected={isConnected}
              isConnecting={isConnecting}
              amount={amount}
              quote={quote}
              isLoadingQuote={false}
              currency={currency}
              onConnect={handleConnect}
            />
          </div>
          <div>
            <RecentOfframpsTable />
          </div>
          <div className="col-span-1 min-[1101px]:col-span-2 mt-4 max-[1100px]:block">
            <ProgressSteps isConnected={isConnected} isConnecting={isConnecting} />
          </div>
        </div>
      </section>
    </main>
  );
}
