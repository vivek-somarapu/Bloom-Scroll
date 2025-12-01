# Bloom Scroll 🌿

An anti-doomscrolling educational micro-learning app built with Next.js and shadcn/ui.

## Overview

Bloom Scroll replaces mindless scrolling with intentional, calm educational content. Users choose a topic, set a session timer, and scroll through curated facts in a beautiful, minimal interface.

## Features

- **10 Topic Categories**: Animals, Architecture, Chemistry, Energy, Environment, Health, Music, Physics, Space, and Technology
- **400+ Educational Facts**: 40 unique, sourced facts per category
- **Session Timer**: Set intentional learning sessions (5-30 minutes)
- **Snap Scroll Feed**: One fact at a time with smooth snap scrolling
- **Zen Mode**: Ultra-minimal interface for maximum calm
- **Dark/Light Mode**: Beautiful themes for any preference
- **Load More**: Intentional stopping points to prevent infinite scrolling
- **Mobile-First**: Optimized for mobile devices while working great on desktop
- **Progress Tracking**: Visual progress bar showing session time

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful, accessible components
- **next-themes** for dark mode support
- **Lucide React** for icons

## Project Structure

```
bloom-scroll/
├── app/
│   ├── page.tsx           # Launch screen (category selection)
│   ├── timer/page.tsx     # Session timer setup
│   ├── feed/page.tsx      # Main learning feed
│   ├── explore/page.tsx   # Topic exploration
│   └── settings/page.tsx  # Settings and preferences
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── bottom-nav.tsx     # Bottom navigation bar
│   ├── fact-card.tsx      # Individual fact card
│   └── theme-provider.tsx # Theme provider wrapper
├── data/
│   ├── categories.ts      # Category metadata
│   └── facts/             # Fact data by category
│       ├── animals.ts
│       ├── architecture.ts
│       ├── chemistry.ts
│       ├── energy.ts
│       ├── environment.ts
│       ├── health.ts
│       ├── music.ts
│       ├── physics.ts
│       ├── space.ts
│       └── technology.ts
└── lib/
    ├── types.ts           # TypeScript interfaces
    ├── session-context.tsx # Session timer state management
    └── utils.ts           # Utility functions
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## User Flow

1. **Launch Screen**: Choose from 10 topic categories
2. **Timer Setup**: Select session duration (5-30 minutes)
3. **Learning Feed**: Scroll through facts with snap scrolling
4. **Session Complete**: Option to continue or end session
5. **Explore**: Switch topics mid-session
6. **Settings**: Customize experience (Zen mode, dark mode, etc.)

## Key Features in Detail

### Session Timer
- Visual progress bar at top of feed
- Real-time elapsed time display
- Modal prompt when session goal is reached
- Option to continue for additional time

### Zen Mode
- Removes all UI chrome except the fact text
- Ultra-minimal for maximum focus
- Toggle in Settings

### Load More System
- Facts displayed in batches of 10
- Intentional stopping point prevents infinite scroll
- Shows facts explored counter

### Responsive Design
- Optimized for mobile screens (375px - 430px)
- Touch-friendly tap targets (44x44px minimum)
- Smooth snap scrolling on touch devices
- Safe area support for notched devices

## Future Enhancements (CSV Import Ready)

The fact data structure is designed to easily accept CSV imports:

```typescript
interface Fact {
  id: string;
  category: CategoryType;
  text: string;
  mediaType?: "image" | "video" | null;
  mediaUrl?: string;
  source: string;
  factNumber: number;
}
```

Simply create CSV files with these columns and import them to replace the hardcoded facts.

## Design Philosophy

Following Vercel and shadcn/ui design principles:
- Clean, minimal interface
- Lots of white space
- Clear hierarchy
- Subtle interactions
- Dark mode by default
- No clutter or distractions

## Accessibility

- Semantic HTML
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast ratios
- Touch-friendly tap targets

## License

This is a prototype/presentation project.

---

**Built with ❤️ for calm, intentional learning**
