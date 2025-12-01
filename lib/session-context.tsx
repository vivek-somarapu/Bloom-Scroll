"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

interface SessionContextType {
  duration: number;
  elapsed: number;
  isActive: boolean;
  isPaused: boolean;
  startSession: (durationMinutes: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  continueSession: (additionalMinutes: number) => void;
  endSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [duration, setDuration] = useState(0); // in seconds
  const [elapsed, setElapsed] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= duration) {
          setIsActive(false);
          return duration;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, duration]);

  const startSession = useCallback((durationMinutes: number) => {
    setDuration(durationMinutes * 60);
    setElapsed(0);
    setIsActive(true);
    setIsPaused(false);
  }, []);

  const pauseSession = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeSession = useCallback(() => {
    setIsPaused(false);
  }, []);

  const continueSession = useCallback((additionalMinutes: number) => {
    setDuration((prev) => prev + additionalMinutes * 60);
    setIsActive(true);
    setIsPaused(false);
  }, []);

  const endSession = useCallback(() => {
    setIsActive(false);
    setElapsed(0);
    setDuration(0);
  }, []);

  const value = useMemo(
    () => ({
      duration,
      elapsed,
      isActive,
      isPaused,
      startSession,
      pauseSession,
      resumeSession,
      continueSession,
      endSession,
    }),
    [duration, elapsed, isActive, isPaused, startSession, pauseSession, resumeSession, continueSession, endSession]
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}

