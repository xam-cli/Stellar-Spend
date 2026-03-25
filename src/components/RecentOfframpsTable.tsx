// src/components/RecentOfframpsTable.tsx
"use client";

import { useEffect, useState } from "react";
import { TransactionStorage, type Transaction } from "@/lib/transaction-storage";
import { useStellarWallet } from "@/hooks/useStellarWallet";

export default function RecentOfframpsTable() {
  const { wallet } = useStellarWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (wallet?.publicKey) {
      const userTransactions = TransactionStorage.getByUser(wallet.publicKey);
      setTransactions(userTransactions);
    } else {
      setTransactions([]);
    }
    setIsLoading(false);
  }, [wallet?.publicKey]);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: string, currency: string): string => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "—";
    if (currency.toUpperCase() === "NGN") {
      return `₦${new Intl.NumberFormat("en-NG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num)}`;
    }
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    } catch {
      return `${currency.toUpperCase()} ${num.toFixed(2)}`;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "text-[#4ade80]";
      case "pending":
        return "text-[#fbbf24]";
      case "failed":
        return "text-[#ef4444]";
      default:
        return "text-[#777777]";
    }
  };

  if (isLoading) {
    return (
      <div data-testid="RecentOfframpsTable" className="border border-[#333333] bg-[#111111] p-5">
        <span className="text-[10px] tracking-[0.2em] text-[#777777] uppercase">
          Recent Offramps
        </span>
        <div className="mt-4 text-xs text-[#777777]">Loading...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div data-testid="RecentOfframpsTable" className="border border-[#333333] bg-[#111111] p-5">
        <span className="text-[10px] tracking-[0.2em] text-[#777777] uppercase">
          Recent Offramps
        </span>
        <div className="mt-4 text-xs text-[#777777]">
          No transactions yet. Complete an offramp to see history here.
        </div>
      </div>
    );
  }

  return (
    <div data-testid="RecentOfframpsTable" className="border border-[#333333] bg-[#111111] overflow-hidden">
      <div className="p-5 border-b border-[#333333]">
        <span className="text-[10px] tracking-[0.2em] text-[#777777] uppercase">
          Recent Offramps
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#333333] bg-[#0a0a0a]">
              <th className="px-4 py-3 text-left text-[#777777] font-normal tracking-wide">Date</th>
              <th className="px-4 py-3 text-left text-[#777777] font-normal tracking-wide">Amount</th>
              <th className="px-4 py-3 text-left text-[#777777] font-normal tracking-wide">Currency</th>
              <th className="px-4 py-3 text-left text-[#777777] font-normal tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-[#777777] font-normal tracking-wide">Account</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-[#333333] hover:bg-[#0a0a0a] transition-colors">
                <td className="px-4 py-3 text-[#c9a962]">{formatDate(tx.timestamp)}</td>
                <td className="px-4 py-3 text-white">{tx.amount} USDC</td>
                <td className="px-4 py-3 text-white">{tx.currency.toUpperCase()}</td>
                <td className={`px-4 py-3 font-medium ${getStatusColor(tx.status)}`}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </td>
                <td className="px-4 py-3 text-[#777777] truncate max-w-[150px]">
                  {tx.beneficiary.accountName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

