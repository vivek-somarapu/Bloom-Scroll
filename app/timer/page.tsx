"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft } from "lucide-react";
import { categories } from "@/data/categories";

function TimerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const [duration, setDuration] = useState([10]);

  const category = categories.find((c) => c.id === categoryId);

  useEffect(() => {
    if (!categoryId) {
      router.push("/");
    }
  }, [categoryId, router]);

  const handleStart = () => {
    router.push(`/feed?category=${categoryId}&duration=${duration[0]}`);
  };

  const handleBack = () => {
    router.push("/");
  };

  if (!category) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-950/95 via-blue-900/90 to-slate-900/95 flex flex-col items-center justify-center p-6 relative">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Back button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="absolute top-6 left-6 text-white/50 hover:text-white/90 hover:bg-white/5"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center space-y-16">
        {/* Category display - Minimal */}
        <div className="flex flex-col items-center space-y-2">
          <span className="text-3xl opacity-60">{category.icon}</span>
          <p className="text-sm text-white/60 font-light tracking-wide">{category.name}</p>
        </div>

        {/* Main heading - Vercel style */}
        <h2 className="text-3xl md:text-4xl font-light text-center text-white/95 tracking-tight max-w-md">
          How long should our focus session be?
        </h2>

        {/* Duration display - Clean numbers */}
        <div className="text-center space-y-1">
          <div className="text-7xl font-extralight text-white/95 tabular-nums">{duration[0]}</div>
          <div className="text-sm text-white/50 font-light tracking-wide">minutes</div>
        </div>

        {/* Slider - Minimal */}
        <div className="w-full max-w-md px-4">
          <Slider
            value={duration}
            onValueChange={setDuration}
            min={5}
            max={30}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-3 text-xs text-white/30 font-light">
            <span>5 min</span>
            <span>30 min</span>
          </div>
        </div>

        {/* Start button - Minimal Vercel style */}
        <Button
          onClick={handleStart}
          size="lg"
          className="px-10 py-5 text-base font-normal bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white/90 hover:text-white backdrop-blur-sm transition-all duration-200 shadow-sm"
        >
          Begin Session
        </Button>
      </div>
    </div>
  );
}

export default function TimerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-gradient-to-b from-blue-950 via-purple-950 to-gray-950" />}>
      <TimerContent />
    </Suspense>
  );
}

