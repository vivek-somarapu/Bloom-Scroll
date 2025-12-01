"use client";

import { Fact } from "@/lib/types";
import { Card } from "./ui/card";
import { Volume2 } from "lucide-react";
import { categories } from "@/data/categories";

interface FactCardProps {
  fact: Fact;
  zenMode?: boolean;
}

export function FactCard({ fact, zenMode = false }: FactCardProps) {
  const category = categories.find((c) => c.id === fact.category);

  if (zenMode) {
    return (
      <Card className="w-full max-w-2xl mx-auto min-h-[70vh] flex items-center justify-center p-8 md:p-12 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border-border/40">
        <p className="text-2xl md:text-3xl leading-relaxed text-center font-light text-foreground/90">
          {fact.text}
        </p>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-2xl mx-auto min-h-[70vh] flex flex-col justify-between p-6 md:p-8 bg-gradient-to-br ${category?.color || 'from-card to-card'} backdrop-blur-sm border-border/40 shadow-xl`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{category?.icon}</span>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {category?.name} Fact
            </p>
            <p className="text-xs text-muted-foreground/60">
              #{fact.factNumber}
            </p>
          </div>
        </div>
        <button
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Listen to fact"
        >
          <Volume2 className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center py-8">
        <p className="text-xl md:text-2xl leading-relaxed text-center text-foreground/90">
          {fact.text}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border/20">
        {fact.sourceUrl ? (
          <a
            href={fact.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground/70 hover:text-muted-foreground hover:underline text-center block transition-colors"
          >
            Source: {fact.source}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground/70 text-center">
            Source: {fact.source}
          </p>
        )}
      </div>
    </Card>
  );
}

