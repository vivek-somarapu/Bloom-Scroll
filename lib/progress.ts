import { CategoryType } from "./types";

const STORAGE_KEY = "bloom-scroll-progress";

export interface UserProgress {
  totalFactsViewed: number;
  factsViewedToday: number;
  currentStreak: number;
  sessionCompletions: number;
  lastVisitDate: string; // ISO date
  factsByCategory: Record<CategoryType, number>;
}

const defaultProgress: UserProgress = {
  totalFactsViewed: 0,
  factsViewedToday: 0,
  currentStreak: 0,
  sessionCompletions: 0,
  lastVisitDate: "",
  factsByCategory: {
    animals: 0,
    architecture: 0,
    chemistry: 0,
    energy: 0,
    environment: 0,
    health: 0,
    music: 0,
    physics: 0,
    space: 0,
    technology: 0,
  },
};

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toISOString().split("T")[0];
}

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;

    const progress: UserProgress = JSON.parse(stored);
    const today = getTodayDate();

    // Check if we need to reset daily stats
    if (progress.lastVisitDate !== today) {
      // Reset daily count
      progress.factsViewedToday = 0;

      // Update streak
      if (isYesterday(progress.lastVisitDate)) {
        // Continue streak
        progress.currentStreak += 1;
      } else if (progress.lastVisitDate !== "") {
        // Streak broken, reset to 0 (will be 1 when they view first fact)
        progress.currentStreak = 0;
      }

      progress.lastVisitDate = today;
      saveProgress(progress);
    }

    return progress;
  } catch (error) {
    console.error("Error reading progress:", error);
    return defaultProgress;
  }
}

function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving progress:", error);
  }
}

export function updateProgress(factId: string, category: CategoryType): void {
  const progress = getProgress();
  const today = getTodayDate();

  // Increment counts
  progress.totalFactsViewed += 1;
  progress.factsViewedToday += 1;
  progress.factsByCategory[category] += 1;

  // Update date and streak on first fact of the day
  if (progress.factsViewedToday === 1) {
    progress.lastVisitDate = today;
    if (progress.currentStreak === 0) {
      progress.currentStreak = 1;
    }
  }

  saveProgress(progress);
}

export function completeSession(): void {
  const progress = getProgress();
  progress.sessionCompletions += 1;
  saveProgress(progress);
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error resetting progress:", error);
  }
}

export function getMostExploredTopic(progress: UserProgress): string | null {
  const categories = Object.entries(progress.factsByCategory);
  if (categories.length === 0) return null;

  const sorted = categories.sort((a, b) => b[1] - a[1]);
  const [topCategory, count] = sorted[0];

  if (count === 0) return null;

  // Capitalize first letter
  return topCategory.charAt(0).toUpperCase() + topCategory.slice(1);
}

