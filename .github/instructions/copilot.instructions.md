## Copilot Instructions

### Project Overview

Paletto is a Next.js app that helps developers generate beautiful color palettes and export them as framework-specific themes (MUI, shadcn/ui). It uses color theory algorithms to generate harmonious palettes based on personality traits.

### Project Setup

- This project is built with Next.js and TypeScript.
- shadcn/ui is used in the interface and for preview/export code generation.
- MUI is used for preview and export code generation.

### Architecture & Key Patterns

#### App Structure - Route Groups

- `(main)`: Primary app using shadcn/ui components and Tailwind CSS
- `(mui)`: MUI preview environment with separate layout and theme provider
- `(shadcn)`: shadcn/ui preview environment (not yet implemented)

**Critical**: Never mix MUI components with the main app UI. MUI packages are only for preview functionality in the `(mui)` route group.

#### Data Flow Pattern

1. **Form Submission**: `/palette` → Server Action (`generatePaletteAction`)
2. **Palette Generation**: `chroma-js` algorithms in `/src/actions/generatePalette.ts`
3. **URL-based State**: Palette data passed via URL search params as JSON for easy sharing without database
4. **Result Display**: `/palette/result` parses URL params and validates with Zod schemas

**Note**: URL-based state enables easy palette sharing without requiring a database (may change in future).

#### Core Data Schema (`src/schemas.ts`)

```typescript
UiPaletteSchema = {
  baseColor, harmonyType, personality,
  semanticColors: { primary, secondary, success, warning, error, info },
  textColors: { primary, secondary, disabled },
  backgroundColors: { default, paper, card },
  borderColors: { default, light, dark },
  shadowColors: { light, medium, intense }
}
```

**Note**: The data model is planned for expansion - expect schema changes in the near future.

#### Color Generation Algorithm

Located in `/src/actions/generatePalette.ts`:

- Uses `chroma-js` for color manipulation and harmony generation
- Harmony types: analogous, complementary, triadic, tetradic, monochromatic
- Personality traits adjust saturation/brightness: calm, energetic, professional, playful, elegant, vibrant

#### Key Dependencies

- **Color**: `chroma-js`, `react-colorful`, `color-name-list`, `nearest-color`
- **UI**: `@radix-ui/*`, `@heroicons/react`, `lucide-react`
- **Forms**: `react-hook-form`, `@hookform/resolvers`, `zod`
- **Styling**: TailwindCSS v4 with CSS variables

#### Export System

Framework-specific theme generators in `/src/lib/`:

- `muiUtils.ts`: Converts palette to MUI ThemeOptions
- Export functions generate copy-paste ready theme code

### Code Quality Principles

- Focus on code that is easy to read, maintain, and extend.
- Prefer modern, widely supported syntax.
- Avoid unnecessary complexity and duplication.
- Write testable, modular code.
- All UI code should be friendly and accessible.

#### Import Organization

- Order imports by distance from current file:
  1. Node modules
  2. Installed packages (most distant)
  3. TypeScript path-mapped imports (defined in tsconfig.json)
  4. Relative imports ordered from most distant (`../../`) to same directory (`./`)
- Within each group, sort alphabetically by module name
- Separate groups with blank lines for readability

Example:

```typescript
// Node modules
import crypto from "crypto";
import { URL } from "url";

// Installed packages
import React from "react";
import { z } from "zod";

// Path-mapped imports
import { UiPaletteSchema } from "@/schemas";
import { cn } from "@/lib/utils";

// Relative imports (distant to close)
import { ColorInput } from "../../components/color-input";
import { generatePalette } from "../actions/generatePalette";
import { localHelper } from "./helper";
```

#### Code Review and Optimization

- **Before implementing**: Compare proposed solution against existing code to identify:
  - Redundant or obsolete code that can be removed
  - Opportunities for better performance or readability
  - Potential for code reuse or abstraction
- **After implementing**: Review changes to ensure:
  - No dead code remains
  - Implementation follows established patterns
  - Code is optimized for the specific use case
- **Documentation**: Add comments only when business logic or complex algorithms require explanation
- **Refactoring**: Suggest removal of obsolete code rather than leaving it commented out

#### Solution Selection and User Collaboration

- **Multiple solutions**: When implementing features with multiple viable approaches:
  1. Present 2-3 options with clear trade-offs
  2. Include pros/cons for maintainability, performance, and user experience
  3. Recommend preferred solution with rationale
  4. Wait for user confirmation before proceeding
- **Example format**:

  ```
  **Option A: Server-side generation**
  - Pros: Better performance, no client-side dependencies
  - Cons: Requires API route, more complex deployment

  **Option B: Client-side generation** (Recommended)
  - Pros: Simpler architecture, immediate feedback
  - Cons: Larger bundle size, depends on client performance
  ```

### Naming Conventions

- Use camelCase for variables and functions.
- Use PascalCase for React components and TypeScript interfaces.
- Use descriptive names that clearly indicate purpose (e.g., `FadeInTransition` not `AppearWithScroll`).
- Avoid abbreviations unless they're widely understood.
- For boolean props, use clear prefixes: `isVisible`, `shouldScroll`, `hasError`.

### Component Organization

- Place shadcn/ui components in `src/components/ui/` only.
- Place custom application components directly in `src/components/`.
- Extract components when they can be reused or when they improve readability.
- Keep components focused on a single responsibility.
- Prefer composition over large, complex components.

#### Paletto-Specific Component Patterns

- **Form Components**: Use react-hook-form + Zod validation
- **Color Components**: Integrate `react-colorful` with form context
- **UI Components**: shadcn/ui in `/src/components/ui/`
- **Custom Components**: Use `cn()` utility for conditional classes

### Animation & Transitions

- Prefer CSS transitions with Tailwind classes (`transition-all duration-300`) over JavaScript animations.
- Use Tailwind's `aria-` and `data-` state modifiers for simple className changes:
  - `aria-expanded:rotate-180` for toggles (when `aria-expanded="true"`)
  - `data-[state=open]:opacity-100` for conditional visibility
  - `data-[visible=true]:translate-y-0` for show/hide animations
- Use JavaScript animations (Web Animations API) only when CSS cannot achieve the desired effect.
- Make animations optional via props (e.g., `scrollIntoView?: boolean`).
- Use consistent timing (300ms duration is preferred).
- Common patterns: `transition-opacity duration-300`, `transition-transform duration-300`.
- For enter/exit animations, prefer data attributes over conditional class strings.

### Form Handling

- Use react-hook-form with zod for form validation and type safety.
- Define schema objects with clear, descriptive field names.
- Use FormField components for consistent form structure.
- Implement progressive disclosure in multi-step forms.
- Watch form values to conditionally show/hide sections.

#### Paletto-Specific Patterns

- Always validate palette data with Zod schemas
- Use the established Server Action pattern for data generation
- Maintain separation between preview environments and main app UI

### Code Extraction Guidelines

- Extract components when:
  - They're used in multiple places
  - They exceed 50-80 lines
  - They handle a distinct piece of functionality
  - They improve testability
- Keep components inline when:
  - They're simple and context-specific
  - Extraction would add unnecessary complexity
  - They're unlikely to be reused

### Third-Party Libraries

- use context7 for up-to-date documentation and examples.

### Development Workflow

#### Running the App

```bash
npm run dev  # Uses --turbopack for faster builds
```

#### Key Development Commands

- `npm run build`: Production build
- `npm run lint`: ESLint checking

#### File Naming Conventions

- Server Actions: `*Action.ts` with "use server" directive
- UI Components: PascalCase in `/src/components/ui/`
- Page Components: `page.tsx` in app directory structure
- Utility Functions: camelCase in `/src/lib/`

### Important Notes

#### Tailwind Configuration

- Uses TailwindCSS v4 with CSS variables system
- Custom theme defined in `src/app/globals.css`
- shadcn/ui configured with "new-york" style variant

#### State Management

- URL-based state for palette data (no external state management)
- Form state managed by react-hook-form
- Preview toggles handled locally with useState

#### Preview System

- Each framework has isolated route group with separate layout
- MUI previews use ThemeProvider with generated theme
- shadcn previews use CSS variables and Tailwind classes (not yet implemented)
