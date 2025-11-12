# Rock Paper Scissors – Frontend App

## Overview
This single-page React application implements a modern, accessible Rock Paper Scissors game. It renders a centered, responsive layout using the Ocean Professional theme (blue primary, amber accents, subtle gradients, rounded surfaces, and soft shadows). Users select Rock, Paper, or Scissors to play against a computer opponent, see instant results, and track scores across rounds. Optional enhancements include lightweight animations and an AI Personality mode that adds playful commentary.

## Process Flow
### 1. Run and Build
- Development
  - npm install
  - npm start
  - The app runs at http://localhost:3000 and hot-reloads on changes.
- Production Build
  - npm run build
  - Outputs an optimized production bundle to the build/ directory.

### 2. Game Interaction
- The user selects a choice from three accessible buttons (Rock, Paper, Scissors).
- The computer generates a random choice. The result is computed and displayed with clear outcome text.
- The Scoreboard updates for Player, Computer, or Draw.
- “Play Again” becomes available after the first round, and “Reset Score” clears scores and local persistence.

### 3. Features
- Scoreboard: Persistent scores (localStorage) with explicit reset; accessibility labels on score values.
- Animations: Motion-safe transitions and micro-interactions (fade-in, pulse, pop) honoring prefers-reduced-motion.
- Accessibility: Proper roles and labels, keyboard activation (Enter/Space), minimum 44px interactive targets, visible focus rings, and ARIA live status for results.
- AI Personality Mode: Optional playful commentary driven by a feature flag; toggle available when enabled.
- Ocean Professional Theme: Modern, centered card layout; blue primary (#2563EB), amber accents (#F59E0B), balanced contrast, and responsive spacing.

### 4. Environment Variables
This app is frontend-only and most REACT_APP_* variables are optional. The following are recognized:
- REACT_APP_FEATURE_FLAGS
  - Accepts JSON array, JSON object, or CSV string.
  - Example values:
    - CSV: aiPersonality,expA
    - JSON array: ["aiPersonality","expA"]
    - JSON object: {"aiPersonality": true}
  - To enable AI Personality toggle and messaging: include aiPersonality.
- REACT_APP_LOG_LEVEL
  - Controls client-side logging verbosity in utils/logger.js.
  - Levels: silent < error < info < debug
  - Defaults:
    - Production: error
    - Development: debug
  - Examples:
    - REACT_APP_LOG_LEVEL=silent (suppress logs)
    - REACT_APP_LOG_LEVEL=debug (verbose logs)
- Other REACT_APP_* entries present in .env (REACT_APP_API_BASE, REACT_APP_BACKEND_URL, REACT_APP_FRONTEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV, REACT_APP_NEXT_TELEMETRY_DISABLED, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_HEALTHCHECK_PATH, REACT_APP_EXPERIMENTS_ENABLED) are optional and not directly used by this app’s runtime logic. They can remain defined for consistency with broader platform conventions.

### 5. Testing
- Unit/Smoke Tests: npm test
  - Includes coverage for rendering title, presence of three choice buttons, and dynamic result updates.
  - Tests use @testing-library/react with jest-dom matchers (see src/setupTests.js and src/App.test.js).

## Compliance
This UI follows common front-end security and quality practices:
- OWASP Secure Coding Practices for JavaScript: No direct DOM injection, no eval, minimal third-party dependencies, and safe logging controls.
- Accessibility: Keyboard navigability, visible focus states, ARIA roles/labels, live region for results, and respect for prefers-reduced-motion.
- Privacy and Logging: Client logging is level-gated via REACT_APP_LOG_LEVEL; “silent” in production can suppress logs to minimize sensitive output.
- Code Style and Linting: ESLint configuration is included to enforce consistent React and JS patterns and help prevent common pitfalls.

## Review Notes
- The Ocean Professional theme is applied via CSS variables and component styles (see src/index.css and src/App.css).
- Feature flags are parsed defensively (JSON or CSV), and AI Personality is entirely opt-in.
- Scores persist locally and are resettable; storage operations are safely guarded for non-browser/test environments.
- Animations are unobtrusive and disabled when users prefer reduced motion.

Reviewed & Approved by [Department Name].
