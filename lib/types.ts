export type CategoryType = 
  | "animals"
  | "architecture"
  | "chemistry"
  | "energy"
  | "environment"
  | "health"
  | "music"
  | "physics"
  | "space"
  | "technology";

export interface Fact {
  id: string;
  category: CategoryType;
  text: string;
  mediaType?: "image" | "video" | null;
  mediaUrl?: string;
  source: string;
  sourceUrl?: string;
  factNumber: number;
}

export interface CategoryMetadata {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
}

export interface SessionSettings {
  duration: number; // in minutes
  zenMode: boolean;
  autoMode: boolean;
  captions: boolean;
}

