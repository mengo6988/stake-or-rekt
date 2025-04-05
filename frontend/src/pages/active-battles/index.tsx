import type { Metadata } from "next";
import { ActiveBattlesView } from "@/components/active-battles-view";
import { DashboardHeader } from "@/components/dashboard-header";

export const metadata: Metadata = {
  title: "Active Battles - TokenBattle",
  description: "Browse and join active PvP battles",
};

export default function ActiveBattlesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0E1015] to-[#2d0e59]">
      <DashboardHeader />
      <main className="flex-1 py-6">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="font-semibold text-3xl mb-6">Active Battles</h1>
          <ActiveBattlesView />
        </div>
      </main>
    </div>
  );
}
