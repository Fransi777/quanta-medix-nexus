
import React from "react";
import PageTransition from "@/components/shared/PageTransition";

const LoadingState: React.FC = () => {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-quantum-vibrant-blue border-b-quantum-bright-purple border-r-quantum-glow-purple border-l-quantum-sky-blue rounded-full animate-spin" />
          <p className="text-quantum-text-paragraph text-lg">Loading your dashboard...</p>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoadingState;
