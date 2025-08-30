
import React from "react";
import PageTransition from "@/components/shared/PageTransition";

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex w-full">
      <div className="w-[280px] glass-panel animate-pulse" />
      <div className="flex-1 ml-[280px]">
        <PageTransition>
          <div className="container mx-auto px-6 py-8 flex items-center justify-center h-[70vh]">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/30 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse-glow" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold text-foreground">Loading your dashboard...</p>
                <p className="text-sm text-muted-foreground">Preparing your personalized medical interface</p>
              </div>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  );
};

export default LoadingState;
