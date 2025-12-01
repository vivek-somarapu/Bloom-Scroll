"use client";

import { useState, useEffect } from "react";
import { categories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { getProgress } from "@/lib/progress";

export default function Home() {
  const router = useRouter();
  const [progressText, setProgressText] = useState<string | null>(null);

  useEffect(() => {
    const progress = getProgress();
    
    // Only show stats if user has viewed at least one fact
    if (progress.totalFactsViewed > 0) {
      // Prioritize streak if > 1 day
      if (progress.currentStreak > 1) {
        setProgressText(`${progress.currentStreak} day streak ✨`);
      } else if (progress.factsViewedToday > 0) {
        setProgressText(`${progress.factsViewedToday} fact${progress.factsViewedToday === 1 ? '' : 's'} learned today`);
      } else {
        setProgressText("Welcome back!");
      }
    }
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/timer?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-950/95 via-blue-900/90 to-slate-900/95 flex flex-col items-center justify-center p-6 relative">
      {/* Subtle grid pattern overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Settings button - top right */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/settings")}
        className="absolute top-6 right-6 text-white/50 hover:text-white/90 hover:bg-white/5 z-20"
      >
        <Settings className="h-4 w-4" />
      </Button>
      
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center space-y-16">
        {/* Logo/Branding - Minimal */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-normal text-white/90 tracking-tight">Bloom Scroll</h1>
          </div>
          
          {/* Progress stats - Subtle */}
          {progressText && (
            <p className="text-sm font-light text-white/50 animate-in fade-in duration-500">
              {progressText}
            </p>
          )}
        </div>

        {/* Main heading - Vercel style */}
        <h2 className="text-3xl md:text-4xl font-light text-center text-white/95 tracking-tight max-w-xl">
          What would you like to explore?
        </h2>

        {/* Category grid - Minimal cards */}
        <div className="w-full grid grid-cols-2 gap-3 max-w-lg">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="h-[100px] text-base font-normal bg-white/5 backdrop-blur-sm 
                border border-white/10 hover:border-white/20 hover:bg-white/10
                transition-all duration-200 
                text-white/80 hover:text-white/95
                shadow-sm hover:shadow-md
                flex flex-col items-center justify-center gap-3
                group"
              variant="ghost"
            >
              <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                {category.icon}
              </span>
              <span className="tracking-tight">{category.name}</span>
            </Button>
          ))}
        </div>

        {/* Footer branding - Ultra minimal */}
        <div className="mt-4">
          <p className="text-xs text-white/30 font-light tracking-wide">Learn calmly.</p>
        </div>
      </div>
    </div>
  );
}
