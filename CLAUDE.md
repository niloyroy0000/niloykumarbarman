# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional portfolio website for Niloy Kumar Barman Panday, built with Next.js 15, TypeScript, and Tailwind CSS. The site features a modern glassmorphism design with smooth animations and comprehensive SEO optimization. It's configured for static export and deployment to GitHub Pages.

### Multi-Repository Architecture

This portfolio project consists of **two separate repositories**:

#### 1. Frontend Repository (`biswajitpanday.github.io`)
- **Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Deployment:** GitHub Pages (static export)
- **Location:** `biswajitpanday.github.io/`
- **Repository:** https://github.com/biswajitpanday/biswajitpanday.github.io
- **Purpose:** Portfolio website with AI chatbot UI component
- **Live URL:** https://biswajitpanday.github.io

#### 2. Chatbot API Repository (`portfolio-chatbot-api`)
- **Stack:** Vercel Serverless Functions, Node.js, TypeScript, Google Gemini AI
- **Deployment:** Vercel (free tier)
- **Location:** `biswajitpanday-portfolio-chatbot/` (local development folder)
- **Repository:** https://github.com/biswajitpanday/portfolio-chatbot-api
- **Purpose:** AI chatbot backend with rate limiting, CORS security, and AI integration
- **API Endpoint:** Set in `NEXT_PUBLIC_CHATBOT_API_URL` environment variable

#### Why Separate Repositories?

1. **Different Deployment Targets:** GitHub Pages (static) vs Vercel Serverless
2. **Independent Scaling:** Frontend and API can be updated independently
3. **Security Isolation:** API keys stored only in Vercel environment variables
4. **Technology Stack Separation:** Next.js frontend vs Node.js serverless functions
5. **Microservices Best Practice:** Separation of concerns and responsibilities

#### Development Workflow

**Working on Frontend:**
```bash
cd biswajitpanday.github.io
npm run dev                 # Runs on http://localhost:3000
```

**Working on Chatbot API (local testing):**
```bash
cd biswajitpanday-portfolio-chatbot
vercel dev                  # Runs on http://localhost:3001
```

**Running Both Simultaneously:**
- Frontend: Port 3000
- API: Port 3001 (via Vercel dev server)
- Frontend can call local API for testing before deployment

## Development Commands

### Essential Commands
```bash
npm run dev               # Start development server (localhost:3000)
npm run build             # Production build (includes sitemap generation)
npm run start             # Start production server
npm run lint              # Run ESLint for code quality
npm run analyze           # Analyze bundle size (ANALYZE=true npm run build)
npm run analyze-motion    # Analyze Framer Motion usage in components
npm run test-performance  # Test animation performance across components
```

### Image Optimization
```bash
npm run optimize # Complete image optimization workflow:
                 # - Profile image optimization (multiple sizes)
                 # - WebP conversion for all images
                 # - Thumbnail generation
                 # - Interactive source file cleanup
npm run sitemap  # Generate sitemap.xml for SEO
```

## Architecture & Structure

### Next.js App Router Structure
- Uses Next.js 15 App Router with TypeScript strict mode
- Static export configuration (`output: "export"`) for GitHub Pages compatibility
- All pages are in `app/` directory with nested layouts for route grouping
- Each page has its own layout.tsx for SEO metadata and structured data
- Path aliases configured (@/* points to root directory)
- Bundle analyzer integration for performance monitoring

### Data Architecture
All content is centralized in `data/` directory:
- `portfolioData.ts` - Project portfolio with categories, tech stacks, company associations
- `skillsData.ts` - Technical skills with proficiency levels
- `certificationsData.ts` - Professional certifications with validation
- `timelineData.ts` - Career timeline and experience
- `navigationData.ts` - Site navigation structure
- `schemaData.ts` - Structured data for SEO

### Component Architecture
- **UI Components**: Shadcn/ui based components in `components/ui/`
- **Feature Components**: Specialized components for portfolio sections
- **Layout Components**: Header, Navigation, PageTransition
- **SEO Components**: StructuredData, SEOOptimizer, CanonicalUrl
- **Analytics**: GoogleAnalytics, WebVitalsTracker
- **Filter Systems**: Advanced filtering for projects, skills, certifications
- **AI Chatbot**: AIChatbot.tsx - Floating chatbot UI that connects to Vercel API
  - ChatMessage.tsx - Individual chat message component
  - SuggestedQuestions.tsx - Quick question suggestions

### Styling System
- **Tailwind CSS** with custom theme configuration
- **Color Hierarchy** (Most to Least Important):
  1. **Purple/Pink** (#A855F7 / #EC4899) - Featured items, highest priority
  2. **Emerald/Green** (#10B981) - Success states, active projects, second priority
  3. **Cyan/Blue** (#00BFFF) - Primary brand, links, third priority
  4. **Gray** (#6B7280 / white with opacity) - Neutral, supporting text
  5. **Golden/Yellow** (#F59E0B) - Special cases: awards, important counts, focused items
- **Font**: JetBrains Mono variable font
- **Animations**: Framer Motion with optimized performance (0.4s duration)
- **Responsive**: Mobile-first design with custom breakpoints

## Key Features & Integrations

### AI Chatbot Integration ✨ DEPLOYED
- **Provider:** Google Gemini AI (free tier)
- **Architecture:** Frontend UI (React) → Vercel Serverless API → Gemini AI
- **Status:** ✅ **Live in production** at https://biswajitpanday.github.io
- **Features:**
  - Floating chat button with expandable window
  - Suggested questions for common queries
  - Rate limiting (10 requests/minute)
  - CORS security (only allows requests from portfolio domain)
  - Conversation history (last 4 messages)
  - Mobile-responsive design
  - Thumbs up/down feedback system
  - Google Analytics event tracking
- **Knowledge Base:** Hardcoded portfolio data (projects, skills, certifications)
- **Deployment:** Separate Vercel project (see Multi-Repository Architecture)
- **API Repository:** https://github.com/biswajitpanday/portfolio-chatbot-api

### GitHub Activity Integration ✨ LIVE
- **API:** GitHub REST API v3 (public, no authentication required)
- **Rate Limit:** 60 requests/hour (unauthenticated)
- **Data Source:** Public events from `biswajitpanday` GitHub account
- **Features:**
  - Real-time contribution graph (last 365 days)
  - Live stats: commits, PRs, issues, active days
  - Current streak calculation
  - Loading and error states with fallback
  - Direct link to GitHub profile
  - Accessible tooltips and keyboard navigation
- **Files:**
  - `lib/github.ts` - GitHub API service with data fetching and processing
  - `components/GitHubActivityGraph.tsx` - Contribution visualization
  - `app/activity/page.tsx` - Activity page with live stats
- **Caching:** 5-minute revalidation to avoid rate limiting

### Medium Blog Integration ✨ LIVE (API-First)
- **Architecture:** Database-backed via portfolio-admin API
- **API:** `https://portfolio-admin-blue.vercel.app/api/public/blog?source=medium`
- **Data Source:** MongoDB (synced from Medium RSS feed)
- **Sync Method:**
  - **Manual:** Admin panel `/blog` page → "Sync Medium" button
  - **Automated:** Daily cron job at midnight UTC (Vercel Cron)
- **Features:**
  - Real-time blog post display (no rebuild required)
  - Automatic duplicate detection (via Medium GUID)
  - Auto-publish synced posts
  - Fallback to static JSON on API failure
  - Category mapping and tag extraction
- **Files:**
  - `components/MediumBlogPreview.tsx` - Blog preview component with API integration
  - `scripts/archive/fetch-medium-posts.js.deprecated` - Old build-time script (deprecated)
- **Admin Panel:**
  - RSS Service: `portfolio-admin/src/lib/services/mediumRssService.ts`
  - Sync API: `POST /api/admin/blog/sync-medium`
  - Cron Job: `GET /api/cron/sync-medium` (automated daily sync)
- **Migration:** Completed December 2025 (Phase 38)
- **Note:** Build-time RSS fetch removed; now uses centralized database

### Performance Optimizations
- Image optimization pipeline with WebP conversion and multiple size variants
- Bundle analysis with @next/bundle-analyzer (npm run analyze)
- Tree shaking and code splitting with vendor/common chunk separation
- Hardware-accelerated CSS animations (0.4s duration for consistency)
- Debounced search (300ms) and memoized filters
- Package import optimization for react-icons, framer-motion, and lucide-react
- Console.log removal in production builds
- Webpack fallbacks configured for client-side only operations

### SEO & Analytics
- Comprehensive metadata with OpenGraph and Twitter cards
- Google Analytics with gtag events
- Structured data (Person, Website, Organization schemas)
- Google Search Console verification included
- Dynamic sitemap generation

### Feature Toggles (Environment Variables)
```bash
NEXT_PUBLIC_ENABLE_SEARCH=true          # Global search functionality
NEXT_PUBLIC_ENABLE_FILTER=true          # Filter panels for all sections
NEXT_PUBLIC_PAGECLIP_API_KEY=           # Contact form service (optional)
NEXT_PUBLIC_CHATBOT_API_URL=            # AI Chatbot API endpoint (Vercel)
                                        # Example: https://portfolio-chatbot-api.vercel.app/api/chat
```

## Development Guidelines

### Adding New Projects
1. Update `data/portfolioData.ts` with Project interface
2. Required fields: category, title, descriptions, stacks, company association
3. Add images to `public/assets/portfolio/` and run `npm run optimize`
4. Categories: "Full-Stack", "Frontend", "Backend", "Mobile", "Windows App"

### Adding New Skills
1. Update `data/skillsData.ts` with skill categories
2. Include proficiency percentage and icon references
3. Skills are organized by: Frontend, Backend, DevOps, Cloud, etc.

### Adding New Certifications
1. Update `data/certificationsData.ts`
2. Include certification level, provider, validation links
3. Add certificate images to `public/assets/certificates/`

### Component Development
- Follow existing patterns in `components/` directory
- Use TypeScript interfaces for all props
- Implement responsive design with Tailwind classes
- Add proper ARIA attributes for accessibility
- Use Framer Motion for animations with 0.4s duration

### Accessibility Standards (WCAG 2.1 AA)

This portfolio follows WCAG 2.1 AA accessibility guidelines. All new components must implement these patterns:

#### Focus Management
```tsx
// Use focus-visible for keyboard-only focus rings (cyan-400 is the standard)
className="focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]"

// For inset focus rings (inside elements like dropdown options)
className="focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400"
```

#### Dialog/Modal Components
```tsx
// Required attributes for modals
<motion.div
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  aria-describedby={descriptionId}
>
  <h2 id={titleId}>Modal Title</h2>
  <p id={descriptionId}>Modal description</p>
</motion.div>

// Always implement Escape key handler
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [onClose]);
```

#### Form Inputs
```tsx
// Always connect labels to inputs
const inputId = useId();
<label htmlFor={inputId}>Email</label>
<input
  id={inputId}
  aria-invalid={hasError ? true : undefined}
  aria-describedby={errorId}
  aria-required={isRequired}
/>
{hasError && <p id={errorId} role="alert">{errorMessage}</p>}
```

#### Expandable/Collapsible Panels
```tsx
// Toggle buttons must have aria-expanded and aria-controls
<button
  aria-expanded={isOpen}
  aria-controls={panelId}
>
  Toggle Panel
</button>
<div id={panelId} hidden={!isOpen}>
  Panel content
</div>
```

#### Interactive Lists (Tabs, Dropdowns, Carousels)
```tsx
// Tab pattern
<div role="tablist" aria-label="Section tabs">
  <button role="tab" aria-selected={active} aria-controls={panelId}>Tab 1</button>
</div>
<div id={panelId} role="tabpanel">Content</div>

// Listbox/dropdown pattern
<button aria-expanded={isOpen} aria-haspopup="listbox" aria-controls={listboxId}>
  Select Option
</button>
<div id={listboxId} role="listbox" aria-label="Options">
  <button role="option" aria-selected={isSelected}>Option 1</button>
</div>

// Carousel pattern
<section aria-roledescription="carousel" aria-labelledby={titleId}>
  <div aria-live="polite" aria-atomic="true">
    <div role="group" aria-roledescription="slide" aria-label="Slide 1 of 5">
      Slide content
    </div>
  </div>
</section>
```

#### Decorative Elements
```tsx
// Hide decorative icons from screen readers
<FaIcon aria-hidden="true" />

// Pulse animations, dividers, decorative borders
<span className="animate-ping" aria-hidden="true" />
```

#### Live Regions
```tsx
// For dynamic content updates (search results, loading states)
<div role="status" aria-live="polite" aria-atomic="true">
  {isLoading ? "Loading..." : `Found ${count} results`}
</div>

// For error messages
<div role="alert">{errorMessage}</div>

// For chat/log messages
<div role="log" aria-live="polite" aria-label="Chat messages">
  {messages}
</div>
```

#### Keyboard Navigation
- All interactive elements must be focusable (native buttons/inputs or `tabIndex={0}`)
- Custom components should support Enter/Space for activation
- Escape key should close modals/dropdowns
- Badge filters should support keyboard: `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}`

#### Screen Reader Text
```tsx
// Hidden text for screen readers only
<span className="sr-only">Additional context for screen readers</span>

// Example: Required field indicator
{isRequired && <span aria-hidden="true">*</span>}
{isRequired && <span className="sr-only">(required)</span>}
```

### Image Management
- Always run `npm run optimize` after adding new images
- Script handles WebP conversion, thumbnails, and cleanup
- Profile images generate multiple sizes automatically
- Maintains both WebP and fallback formats

## Deployment

### GitHub Pages Setup
1. Repository configured for GitHub Actions deployment
2. Build command includes sitemap generation (`prebuild` script)
3. Static export compatible with GitHub Pages
4. Environment variables set in repository secrets

### Pre-deployment Checklist
- Run `npm run lint` to ensure code quality (strict linting enabled)
- Run `npm run build` to verify production build (includes sitemap generation via prebuild)
- Run `npm run optimize` for image optimization (WebP conversion, thumbnails, cleanup)
- Run `npm run analyze` to check bundle size and optimization
- Test all pages and features locally with static export
- Verify environment variables if using contact form or analytics
- Ensure TypeScript compilation passes without build errors

## Important Configuration Files

- `next.config.ts` - Next.js configuration with bundle optimization, static export, and webpack customizations
- `tailwind.config.js` - Custom theme and responsive breakpoints
- `tsconfig.json` - TypeScript strict mode enabled with path aliases (@/*)
- `eslint.config.mjs` - ESLint configuration for code quality
- `postcss.config.cjs` - PostCSS configuration for Tailwind CSS processing
- `.github/workflows/deploy.yml` - GitHub Actions deployment pipeline

## Performance Monitoring

The site includes WebVitals tracking and analytics:
- Core Web Vitals monitoring
- Google Analytics with custom events
- Bundle size analysis tools
- Performance-optimized animations and images

## Development Guidelines for AI Assistants

### Task Tracking & Documentation Organization

**Two-File System for Progress Tracking:**

1. **`docs/todo-content.md`** - Active Work Only
   - Contains ONLY present and future work
   - Phase 8 (in progress) + Phase 7, 2-5 (planned)
   - Lean, scannable, focused on "what's next"
   - Updated continuously as work progresses
   - Version format: 2.x (active work focus)

2. **`docs/CompletedPhases.md`** - Historical Archive
   - Contains ALL completed phases with full details
   - Phase 1, 1.5, 6, 7.5 (all tasks, files, effort, dates)
   - Preserved for reference and historical record
   - Updated when phases are completed
   - Never delete completed work from this file

**When to Move Content:**
- After completing a Phase/Epic: Move full details from `todo-content.md` → `CompletedPhases.md`
- Keep only brief summary in `todo-content.md` (e.g., "Phase 1 (15 tasks) ✅ - Brief description")
- This keeps `todo-content.md` under 500 lines for easy reading

**Marking Tasks Complete:**
- Use ✅ for completed tasks
- Use 📝 or ⏳ for pending tasks
- Use 🚧 for in-progress phases
- After completing each task, mark it immediately in relevant documentation
- Update progress percentages and metrics

### Code Quality & Verification
**Be a skeptical, senior pair-programmer. Verify before you assert.**

**Guidelines:**
- State assumptions explicitly
- Cross-check anything nontrivial (APIs, versions, platform differences) using reasoning or citable sources
- If unsure, say so clearly
- Prefer minimal, clean, idiomatic code with strong defaults and only meaningful comments
- Suggest better designs when appropriate and explain trade-offs concisely
- If uncertain, provide a safe fallback and a quick validation test
- **Do not write code until you are at least 95% confident in the approach**
- If something is missing, unclear, or risky: **pause and ask directly** using `AskUserQuestion` tool

### IMPORTANT: Approval Requirements
**ALWAYS ask for user approval before:**
1. **Implementing duplicate items** on any page (e.g., duplicate stats sections, repeated components)
2. **Removing existing features** without explicit confirmation
3. **Changing design system colors** or established patterns
4. **Adding new dependencies** to package.json

### Data Management: shouldPublish Flag
Demo/sample data items have `shouldPublish` and `isSampleData` flags for admin control:

| Flag | Type | Default | Purpose |
|------|------|---------|---------|
| `shouldPublish` | boolean | true | Controls visibility on public site |
| `isSampleData` | boolean | - | Marks item as demo data to be replaced |

**Interfaces with these flags:**
- `Testimonial` (testimonialsData.ts, portfolioData.ts)
- `Recognition` (portfolioData.ts)
- `BlogPost` (blogData.ts)

**Usage:**
- `shouldPublish: true` = visible on public site (default)
- `shouldPublish: false` = hidden, admin preview only
- `isSampleData: true` = marks as demo data to replace with real content

### Context Window Management
**When approaching context window limit (85-90% capacity):**
1. **Pause immediately** and share remaining incomplete todos
2. **Ask**: "Approaching context limit. Continue with remaining tasks?"
3. **After user compacts conversation**: Resume from exact stopping point and complete remaining work

**Never silently hit the limit mid-task.**