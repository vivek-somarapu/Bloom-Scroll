"use client";

import { Suspense } from "react";
import { categories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const currentDuration = searchParams.get("duration") || "10";

  const handleCategorySelect = (categoryId: string) => {
    // If coming from feed, maintain duration
    if (currentCategory) {
      router.push(`/feed?category=${categoryId}&duration=${currentDuration}`);
    } else {
      router.push(`/timer?category=${categoryId}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background pb-20">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-16">
          {/* Header - Minimal */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight">Explore Topics</h1>
            <p className="text-muted-foreground/60 text-sm font-light">
              Choose a category to continue your learning journey
            </p>
          </div>

          {/* Category grid - Minimal cards */}
          <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="h-[100px] text-base font-normal bg-card/50 backdrop-blur-sm 
                  border border-border/40 hover:border-border/60 hover:bg-card/80
                  transition-all duration-200 
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
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-background" />}>
      <ExploreContent />
    </Suspense>
  );
}

