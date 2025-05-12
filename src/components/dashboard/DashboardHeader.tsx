
import React from "react";
import { isSupabaseConfigured } from "@/lib/supabase";

interface DashboardHeaderProps {
  greeting: string;
  username?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ greeting, username }) => {
  return (
    <section>
      <h1 className="text-3xl font-bold text-white">
        {greeting}, <span className="text-quantum-vibrant-blue">{username}</span>
      </h1>
      <div className="flex items-center gap-2 mt-2">
        <p className="text-quantum-text-paragraph">
          Welcome to your dashboard. Here's what's happening today.
        </p>
        {!isSupabaseConfigured() && (
          <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300">
            Using Mock Data
          </span>
        )}
      </div>
    </section>
  );
};

export default DashboardHeader;
