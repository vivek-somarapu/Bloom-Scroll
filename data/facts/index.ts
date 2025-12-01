import { Fact, CategoryType } from "@/lib/types";
import { animalsFacts } from "./animals";
import { architectureFacts } from "./architecture";
import { chemistryFacts } from "./chemistry";
import { energyFacts } from "./energy";
import { environmentFacts } from "./environment";
import { healthFacts } from "./health";
import { musicFacts } from "./music";
import { physicsFacts } from "./physics";
import { spaceFacts } from "./space";
import { technologyFacts } from "./technology";

export const allFacts: Record<CategoryType, Fact[]> = {
  animals: animalsFacts,
  architecture: architectureFacts,
  chemistry: chemistryFacts,
  energy: energyFacts,
  environment: environmentFacts,
  health: healthFacts,
  music: musicFacts,
  physics: physicsFacts,
  space: spaceFacts,
  technology: technologyFacts,
};

export function getFactsByCategory(category: CategoryType): Fact[] {
  return allFacts[category] || [];
}

export function getAllCategories(): CategoryType[] {
  return Object.keys(allFacts) as CategoryType[];
}

