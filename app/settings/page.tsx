"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  
  const [zenMode, setZenMode] = useState(searchParams.get("zen") === "true");
  const [autoMode, setAutoMode] = useState(false);
  const [captions, setCaptions] = useState(false);
  const [showDurationDialog, setShowDurationDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [sessionDuration, setSessionDuration] = useState([10]);

  const handleZenModeToggle = (checked: boolean) => {
    setZenMode(checked);
    const category = searchParams.get("category");
    const duration = searchParams.get("duration");
    if (category && duration) {
      router.push(`/feed?category=${category}&duration=${duration}&zen=${checked}`);
    }
  };

  const handleResetData = () => {
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    setShowResetDialog(false);
  };

  return (
    <div className="min-h-screen w-full bg-background pb-20">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-medium mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Customize your learning experience
            </p>
          </div>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how Bloom Scroll looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
              <CardDescription>
                Adjust your learning mode preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Zen Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Ultra-minimal interface for maximum calm
                  </p>
                </div>
                <Switch
                  checked={zenMode}
                  onCheckedChange={handleZenModeToggle}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Automatic Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Auto-advance through facts
                  </p>
                </div>
                <Switch
                  checked={autoMode}
                  onCheckedChange={setAutoMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Captions</p>
                  <p className="text-sm text-muted-foreground">
                    Show captions for video content
                  </p>
                </div>
                <Switch
                  checked={captions}
                  onCheckedChange={setCaptions}
                />
              </div>
            </CardContent>
          </Card>

          {/* Session */}
          <Card>
            <CardHeader>
              <CardTitle>Session</CardTitle>
              <CardDescription>
                Manage your learning sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowDurationDialog(true)}
              >
                Change Default Session Length
              </Button>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>
                Manage your data and privacy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowResetDialog(true)}
              >
                Reset All Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />

      {/* Duration Dialog */}
      <Dialog open={showDurationDialog} onOpenChange={setShowDurationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Default Session Length</DialogTitle>
            <DialogDescription>
              Set your preferred learning session duration
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="text-center">
              <div className="text-4xl font-light">{sessionDuration[0]}</div>
              <div className="text-sm text-muted-foreground">minutes</div>
            </div>
            <Slider
              value={sessionDuration}
              onValueChange={setSessionDuration}
              min={5}
              max={30}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>5 min</span>
              <span>30 min</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDurationDialog(false)}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Data</DialogTitle>
            <DialogDescription>
              This will clear all your progress and preferences. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetData}
            >
              Reset Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-background" />}>
      <SettingsContent />
    </Suspense>
  );
}

