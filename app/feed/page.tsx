"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/session-context";
import { getFactsByCategory } from "@/data/facts";
import { FactCard } from "@/components/fact-card";
import { BottomNav } from "@/components/bottom-nav";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryType } from "@/lib/types";
import { updateProgress, getProgress } from "@/lib/progress";

function FeedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") as CategoryType | null;
  const durationParam = searchParams.get("duration");
  const zenParam = searchParams.get("zen");
  
  const { theme, setTheme } = useTheme();
  const { duration, elapsed, isActive, startSession, continueSession, endSession } = useSession();
  
  const [mounted, setMounted] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedCount, setLoadedCount] = useState(10);
  const [showEndModal, setShowEndModal] = useState(false);
  const [viewedFacts, setViewedFacts] = useState<Set<string>>(new Set());
  const [sessionFactsViewed, setSessionFactsViewed] = useState(0);
  
  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Sync zenMode with URL param
  useEffect(() => {
    setZenMode(zenParam === "true");
  }, [zenParam]);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const facts = categoryId ? getFactsByCategory(categoryId) : [];
  const displayedFacts = facts.slice(0, loadedCount);

  useEffect(() => {
    if (!categoryId || !durationParam) {
      router.push("/");
      return;
    }
    
    if (!isActive && duration === 0) {
      startSession(parseInt(durationParam));
      setSessionFactsViewed(0); // Reset session fact count on new session
    }
  }, [categoryId, durationParam, isActive, duration, startSession, router]);

  useEffect(() => {
    if (isActive && elapsed >= duration && duration > 0) {
      setShowEndModal(true);
    }
  }, [elapsed, duration, isActive]);

  // Track viewed facts when index changes
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < facts.length && categoryId) {
      const fact = facts[currentIndex];
      if (fact && !viewedFacts.has(fact.id)) {
        // Update global progress
        updateProgress(fact.id, categoryId);
        
        // Update local session count
        setSessionFactsViewed((prev) => prev + 1);
        
        // Mark as viewed
        setViewedFacts((prev) => {
          const newSet = new Set(prev);
          newSet.add(fact.id);
          return newSet;
        });
      }
    }
  }, [currentIndex, categoryId, facts, viewedFacts]);

  // Auto-scroll when Auto Mode is enabled
  useEffect(() => {
    if (!autoMode || !scrollContainerRef.current) return;

    const autoScrollInterval = setInterval(() => {
      if (currentIndex < loadedCount - 1) {
        // Scroll to next card
        const nextIndex = currentIndex + 1;
        
        // Smooth scroll to next card
        const container = scrollContainerRef.current;
        if (container) {
          const cardHeight = container.clientHeight;
          container.scrollTo({
            top: nextIndex * cardHeight,
            behavior: 'smooth'
          });
        }
      }
    }, 8000); // 8 seconds per fact for comfortable reading

    return () => clearInterval(autoScrollInterval);
  }, [autoMode, currentIndex, loadedCount]);

  // Track current card based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const cardHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / cardHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < loadedCount) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, loadedCount]);

  const handleLoadMore = () => {
    setLoadedCount((prev) => Math.min(prev + 10, facts.length));
  };

  const handleContinue = () => {
    continueSession(10);
    setShowEndModal(false);
  };

  const handleEndSession = () => {
    endSession();
    router.push("/");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (elapsed / duration) * 100 : 0;

  if (!categoryId || displayedFacts.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoMode}
                  onCheckedChange={setAutoMode}
                  id="auto-mode"
                />
                <label htmlFor="auto-mode" className="text-sm text-muted-foreground">
                  Auto Mode
                </label>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatTime(elapsed)} / {formatTime(duration)}
              </div>
            </div>
            
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <Progress value={progressPercentage} className="h-1" />
        </div>
      </div>

      {/* Snap scroll container */}
      <div
        ref={scrollContainerRef}
        className="h-[calc(100vh-8rem)] overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {displayedFacts.map((fact, index) => (
          <div
            key={fact.id}
            className="min-h-[calc(100vh-8rem)] snap-start flex items-center justify-center p-4 md:p-6"
            onMouseEnter={() => setCurrentIndex(index)}
          >
            <FactCard fact={fact} zenMode={zenMode} />
          </div>
        ))}

        {/* Load More card */}
        {loadedCount < facts.length && (
          <div className="min-h-[calc(100vh-8rem)] snap-start flex items-center justify-center p-4">
            <div className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                You've reached your batch.
              </p>
              <Button
                onClick={handleLoadMore}
                size="lg"
                className="px-8"
              >
                Load More
              </Button>
              <p className="text-sm text-muted-foreground">
                {viewedFacts.size} facts explored
              </p>
            </div>
          </div>
        )}

        {/* End of facts */}
        {loadedCount >= facts.length && (
          <div className="min-h-[calc(100vh-8rem)] snap-start flex items-center justify-center p-4">
            <div className="text-center space-y-6">
              <p className="text-2xl">🎉</p>
              <p className="text-lg text-muted-foreground">
                You've explored all facts in this category!
              </p>
              <Button
                onClick={() => router.push("/")}
                size="lg"
              >
                Explore More Topics
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* End of Session Dialog */}
      <Dialog open={showEndModal} onOpenChange={setShowEndModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Complete</DialogTitle>
            <DialogDescription className="space-y-3 pt-4">
              <div className="text-base text-foreground">
                Nice work! You learned {sessionFactsViewed} fact{sessionFactsViewed === 1 ? '' : 's'} this session.
              </div>
              <div className="text-sm text-muted-foreground">
                {(() => {
                  const progress = getProgress();
                  const parts = [`That's ${progress.factsViewedToday} fact${progress.factsViewedToday === 1 ? '' : 's'} today`];
                  if (progress.currentStreak > 1) {
                    parts.push(`${progress.currentStreak} day streak ✨`);
                  }
                  return parts.join(' • ');
                })()}
              </div>
              <div className="text-sm text-muted-foreground pt-2">
                Would you like to continue exploring?
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleEndSession}>
              End Session
            </Button>
            <Button onClick={handleContinue}>
              Continue (10 more min)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-background" />}>
      <FeedContent />
    </Suspense>
  );
}

