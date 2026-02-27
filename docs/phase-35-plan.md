# PHASE 35: V2 SCHEMA & API INTEGRATION

**Status:** ⏳ PLANNED (0/27 tasks - 0%)
**Priority:** HIGH - Critical infrastructure upgrade
**Effort:** ~25-30 hours
**Impact:** Full V2 feature support, improved data model
**API Endpoint:** `https://portfolio-admin-blue.vercel.app/api/public/*`

---

## Purpose

Migrate portfolio website to consume V2 schema and APIs from `portfolio-admin`. This phase focuses on schema/API integration with all new V2 features. UI improvements will be done in later phases.

---

## Schema Comparison Summary

| Content Type | Current State | V2 Changes | Impact |
|--------------|---------------|------------|--------|
| **Projects** | Has most V2 fields | Missing: `isCurrent` | LOW |
| **Certifications** | Missing `order` | Add: `order` field | LOW |
| **Skills** | ❌ Old SkillTree | ✅ Flat SkillType + SkillItem | **HIGH** |
| **Timeline** | Missing 2 fields | Add: `address`, `isCurrent` | MEDIUM |
| **Testimonials** | Missing `order` | Add: `order` field | LOW |
| **Blog** | Missing `order` | Add: `order` field | LOW |

---

## EPIC 1: TYPE DEFINITIONS UPDATE

**Effort:** 2-3 hours
**Status:** ⏳ PLANNED

---

### Task 35.1: Update Project Types ✅ MOSTLY COMPLETE

**Priority:** LOW
**File:** `types/api.ts`
**Status:** ⏳ PLANNED

**Changes Needed:**
```typescript
export interface Project {
  _id: string;
  // REMOVE: id?: string; (use only _id)

  // EXISTING - Keep as is
  metrics?: ProjectMetrics;
  testimonials?: Testimonial[];
  caseStudy?: CaseStudy;
  recognition?: Recognition[];
  skillsHighlighted?: string[];
  inactivationReason?: string | null;

  // ADD NEW
  isCurrent?: boolean; // For ongoing projects

  // MAKE OPTIONAL
  longDescription?: string; // Currently required
}
```

**Validation:**
- Test with `/api/public/projects` endpoint
- Verify `isCurrent` projects display correctly
- Ensure `_id` is used consistently (no `id` fallback)

---

### Task 35.2: Update Certification Types

**Priority:** MEDIUM
**File:** `types/api.ts`
**Status:** ⏳ PLANNED

**Changes Needed:**
```typescript
export interface Certification {
  _id: string;
  // REMOVE: id: string; (V2 removed custom ID)

  // ADD NEW
  order: number; // Custom ordering

  // EXISTING - Keep as is
  certificationNumber?: string; // Already present ✅
  thumbImage?: string; // Already present ✅
}
```

**Validation:**
- Test with `/api/public/certifications` endpoint
- Verify certifications sort by `order` field
- Check date flexibility (YYYY, YYYY-MM, YYYY-MM-DD)

---

### Task 35.3: Update Skills Types (MAJOR CHANGE)

**Priority:** HIGH
**File:** `types/api.ts`
**Status:** ⏳ PLANNED

**Current Problem:**
Portfolio uses old `SkillTree` structure (hierarchical):
```typescript
// OLD (Remove this)
export interface SkillCategory {
  _id: string;
  id: string;
  name: string;
  icon?: string;
  order: number;
  skills?: SkillItem[];
  children?: SkillCategory[];
}
```

**V2 Solution:**
Flat structure with `SkillType` + `SkillItem`:

```typescript
// NEW - Add these
export interface SkillType {
  _id: string;
  name: string;
  parentSkillType?: {
    _id: string;
    name: string;
  } | null;
  order: number;
  icon?: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillItem {
  _id: string;
  // REMOVE: id: string;

  name: string;
  skillType: {
    _id: string;
    name: string;
  };
  level: 'Expert' | 'Advanced' | 'Intermediate' | 'Familiar';
  yearsOfExperience?: number;
  lastUsed?: string; // NOW: Date type (ISO string from API)
  icon?: string;
  description?: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

**API Endpoint Change:**
- **OLD:** `/api/public/skill-hierarchy` (returns SkillTree)
- **NEW:** `/api/public/skill-hierarchy` (returns flat SkillType[] with nested SkillItem[])

**Validation:**
- Test with new endpoint structure
- Verify skill grouping by type
- Check skill ordering within types

---

### Task 35.4: Update Timeline Types

**Priority:** MEDIUM
**File:** `types/api.ts`
**Status:** ⏳ PLANNED

**Changes Needed:**
```typescript
export interface TimelineEntry {
  _id: string;
  // REMOVE: id?: string;

  // ADD NEW
  address?: string; // Work location address
  isCurrent?: boolean; // Current position flag

  // MAKE CONDITIONAL
  endDate?: string; // Optional when isCurrent = true
}
```

**Validation:**
- Test with `/api/public/timeline` endpoint
- Verify current positions show "Present"
- Display address when available

---

### Task 35.5: Update Testimonial Types

**Priority:** LOW
**File:** `types/api.ts`
**Status:** ⏳ PLANNED

**Changes Needed:**
```typescript
export interface TestimonialData {
  _id: string;
  // REMOVE: id?: string;

  // ADD NEW
  order: number; // Custom ordering
}
```

**Validation:**
- Test with `/api/public/testimonials` endpoint
- Verify testimonials display in order

---

### Task 35.6: Update Blog Types

**Priority:** LOW
**File:** `types/api.ts`
**Status:** ⏳ PLANNED

**Changes Needed:**
```typescript
export interface BlogPost {
  _id: string;
  // REMOVE: id?: string;

  // ADD NEW
  order: number; // Custom ordering
}
```

**Validation:**
- Test with `/api/public/blog` endpoint
- Verify blog posts ordered correctly

---

## EPIC 2: API SERVICE LAYER UPDATE

**Effort:** 3-4 hours
**Status:** ⏳ PLANNED

---

### Task 35.7: Update API Base URL Configuration

**Priority:** HIGH
**File:** `.env.local` or `next.config.ts`
**Status:** ⏳ PLANNED

**Changes:**
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://portfolio-admin-blue.vercel.app
```

**Validation:**
- Verify all API calls use correct base URL
- Test in both local dev and production build

---

### Task 35.8: Update Skills API Service (MAJOR)

**Priority:** HIGH
**File:** `lib/api/skills.ts` (or wherever skills API calls are)
**Status:** ⏳ PLANNED

**Current:**
```typescript
// OLD endpoint
const response = await fetch(`${API_BASE}/api/public/skill-hierarchy`);
// Returns: SkillTree with nested children
```

**New:**
```typescript
// NEW endpoint (same URL, different structure)
const response = await fetch(`${API_BASE}/api/public/skill-hierarchy`);
// Returns: SkillType[] with nested skills
```

**Data Transformation Needed:**
```typescript
// Example response structure:
[
  {
    _id: "type123",
    name: "Frontend Frameworks",
    parentSkillType: null,
    order: 1,
    icon: "FaReact",
    skills: [
      {
        _id: "skill456",
        name: "React",
        level: "Expert",
        yearsOfExperience: 5,
        lastUsed: "2024-12-01T00:00:00.000Z",
        order: 1,
        isFeatured: true
      }
    ]
  }
]
```

**Action Items:**
1. Update API response interface
2. Update data transformation logic
3. Update component props to match new structure
4. Handle `lastUsed` as Date (format: "Dec 2024" or "Active")

---

### Task 35.9: Add Error Handling for New Fields

**Priority:** MEDIUM
**Files:** All API service files
**Status:** ⏳ PLANNED

**Changes:**
- Add null checks for optional V2 fields
- Fallback values for missing fields
- Graceful degradation if API version mismatch

**Example:**
```typescript
// Safe access to V2 fields
const isCurrent = project.isCurrent ?? false;
const order = certification.order ?? 0;
const address = timeline.address ?? timeline.location;
```

---

## EPIC 3: COMPONENT UPDATES (Projects)

**Effort:** 4-5 hours
**Status:** ⏳ PLANNED

---

### Task 35.10: ProjectCard - Add `isCurrent` Badge

**Priority:** MEDIUM
**File:** `components/ProjectCard.tsx`
**Status:** ⏳ PLANNED

**Changes:**
```tsx
// Add "Current Project" badge when isCurrent = true
{project.isCurrent && (
  <Badge className="bg-emerald-500/20 text-emerald-400">
    Current Project
  </Badge>
)}
```

---

### Task 35.11: ProjectModal - Display Metrics

**Priority:** MEDIUM
**File:** `components/ProjectModal.tsx`
**Status:** ⏳ PLANNED

**Changes:**
- Add metrics section if `project.metrics` exists
- Display: efficiency, users, revenue, performance, downloads, github_stars
- Use existing `ProjectPerformanceMetrics` component (already exists!)

---

### Task 35.12: ProjectModal - Display Case Study

**Priority:** MEDIUM
**File:** `components/ProjectModal.tsx`
**Status:** ⏳ PLANNED

**Changes:**
- Add case study section if `project.caseStudy` exists
- Display: problem, solution, results[], technicalHighlights[], architectureDiagram
- Use card/section layout with proper spacing

---

### Task 35.13: ProjectModal - Display Recognition

**Priority:** LOW
**File:** `components/ProjectModal.tsx`
**Status:** ⏳ PLANNED

**Changes:**
- Add recognition badges section if `project.recognition` exists
- Display: title, description, icon
- Filter by `approved === true && shouldPublish === true`

---

### Task 35.14: ProjectTimeline - Show Current Projects

**Priority:** LOW
**File:** `components/ProjectTimeline.tsx`
**Status:** ⏳ PLANNED

**Changes:**
- Update endDate display logic:
  - If `isCurrent === true`: Show "Present" instead of endDate
  - Add pulsing indicator for current projects

---

## EPIC 4: COMPONENT UPDATES (Certifications)

**Effort:** 2 hours
**Status:** ⏳ PLANNED

---

### Task 35.15: CertificationsClient - Use `order` for Sorting

**Priority:** LOW
**File:** `components/CertificationsClient.tsx`
**Status:** ⏳ PLANNED

**Changes:**
```typescript
// Update sorting logic
const sortedCerts = certifications.sort((a, b) => {
  // Primary: by order (ascending)
  if (a.order !== b.order) return a.order - b.order;
  // Secondary: by date (descending)
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});
```

---

### Task 35.16: CertificationCard - Display Certification Number

**Priority:** LOW
**File:** `components/CertificationCard.tsx`
**Status:** ⏳ PLANNED

**Changes:**
- Show `certificationNumber` if available
- Display next to credential ID

---

## EPIC 5: COMPONENT UPDATES (Skills) - MAJOR

**Effort:** 8-10 hours
**Status:** ⏳ PLANNED

---

### Task 35.17: Skills Page - Migrate to Flat Structure

**Priority:** HIGH
**File:** `app/skills/page.tsx`
**Status:** ⏳ PLANNED

**Current Issue:**
Page expects hierarchical `SkillTree` structure

**Solution:**
Update to consume flat `SkillType[]` with nested `SkillItem[]`

**Changes:**
1. Fetch `/api/public/skill-hierarchy` (returns SkillType[])
2. Group skills by parent type (if needed)
3. Display skill types as sections
4. Show skills within each type

**Example Structure:**
```tsx
{skillTypes.map(type => (
  <section key={type._id}>
    <h3>{type.name}</h3>
    {type.skills?.map(skill => (
      <SkillItem key={skill._id} skill={skill} />
    ))}
  </section>
))}
```

---

### Task 35.18: SkillsClient - Update Data Transformation

**Priority:** HIGH
**File:** `components/SkillsClient.tsx` (if exists)
**Status:** ⏳ PLANNED

**Changes:**
- Remove old SkillTree transformation logic
- Implement flat structure rendering
- Update filters to work with skill types

---

### Task 35.19: Skills Filter - Update for Flat Structure

**Priority:** MEDIUM
**File:** `components/SkillsFilter.tsx`
**Status:** ⏳ PLANNED

**Changes:**
- Update filter categories to use SkillType names
- Filter by skill level (Expert, Advanced, etc.)
- Filter by isFeatured flag

---

### Task 35.20: Skills Display - Show Last Used Date

**Priority:** LOW
**File:** Skills display components
**Status:** ⏳ PLANNED

**Changes:**
```tsx
// Format lastUsed date
const formatLastUsed = (date: string | undefined) => {
  if (!date) return null;
  const lastUsedDate = new Date(date);
  const now = new Date();
  const monthsDiff = (now.getTime() - lastUsedDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (monthsDiff < 6) return "Active";
  return lastUsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};
```

---

## EPIC 6: COMPONENT UPDATES (Timeline)

**Effort:** 2 hours
**Status:** ⏳ PLANNED

---

### Task 35.21: Timeline - Display Address

**Priority:** LOW
**File:** `components/ProjectTimeline.tsx` or timeline components
**Status:** ⏳ PLANNED

**Changes:**
```tsx
// Show address if available, fallback to location
<div className="text-slate-400">
  {entry.address || entry.location}
</div>
```

---

### Task 35.22: Timeline - Show Current Position

**Priority:** MEDIUM
**File:** Timeline display components
**Status:** ⏳ PLANNED

**Changes:**
```tsx
// Display "Present" for current positions
{entry.isCurrent ? (
  <span className="text-emerald-400">Present</span>
) : (
  <span>{formatDate(entry.endDate)}</span>
)}
```

---

## EPIC 7: COMPONENT UPDATES (Testimonials & Blog)

**Effort:** 1 hour
**Status:** ⏳ PLANNED

---

### Task 35.23: Testimonials - Use `order` for Display

**Priority:** LOW
**File:** `components/TestimonialsCarousel.tsx`
**Status:** ⏳ PLANNED

**Changes:**
- Sort testimonials by `order` field (ascending)
- Remove date-based sorting

---

### Task 35.24: Blog - Use `order` for Display

**Priority:** LOW
**File:** Blog components
**Status:** ⏳ PLANNED

**Changes:**
- Sort blog posts by `order` field if needed
- Keep date-based sorting as secondary

---

## EPIC 8: TESTING & VALIDATION

**Effort:** 3-4 hours
**Status:** ⏳ PLANNED

---

### Task 35.25: Test All API Endpoints

**Priority:** HIGH
**Status:** ⏳ PLANNED

**Checklist:**
- [ ] `/api/public/projects` - Returns V2 schema
- [ ] `/api/public/certifications` - Has `order` field
- [ ] `/api/public/skill-hierarchy` - Returns flat structure
- [ ] `/api/public/timeline` - Has `address` and `isCurrent`
- [ ] `/api/public/testimonials` - Has `order` field
- [ ] `/api/public/blog` - Has `order` field

---

### Task 35.26: Test Component Rendering

**Priority:** HIGH
**Status:** ⏳ PLANNED

**Checklist:**
- [ ] Projects page renders correctly
- [ ] Project modals show metrics, case studies, recognition
- [ ] Current projects display "Present" badge
- [ ] Certifications sort by order
- [ ] Skills page displays flat structure
- [ ] Timeline shows address and current positions
- [ ] All TypeScript errors resolved

---

### Task 35.27: Test Backward Compatibility

**Priority:** MEDIUM
**Status:** ⏳ PLANNED

**Checklist:**
- [ ] Missing V2 fields don't break UI
- [ ] Optional fields have proper null checks
- [ ] Graceful fallbacks for all new features
- [ ] No console errors on any page

---

## Implementation Priority

| Epic | Priority | Tasks | Effort | Dependencies |
|------|----------|-------|--------|--------------|
| **1: Types** | HIGH | 6 | 2-3h | None |
| **2: API Services** | HIGH | 3 | 3-4h | Epic 1 |
| **5: Skills (Major)** | HIGH | 4 | 8-10h | Epic 1, 2 |
| **3: Projects** | MEDIUM | 5 | 4-5h | Epic 1, 2 |
| **4: Certifications** | LOW | 2 | 2h | Epic 1, 2 |
| **6: Timeline** | LOW | 2 | 2h | Epic 1, 2 |
| **7: Testimonials/Blog** | LOW | 2 | 1h | Epic 1, 2 |
| **8: Testing** | HIGH | 3 | 3-4h | All epics |

**Total:** 27 tasks | ~25-30 hours

---

## Rollback Plan

If issues arise:
1. Revert `.env.local` to point to old API (if available)
2. Keep both type definitions temporarily
3. Use feature flags for V2 features
4. Gradual rollout (Projects → Certs → Timeline → Skills)

---

## Success Metrics

- ✅ All 27 tasks completed
- ✅ No TypeScript errors
- ✅ All pages render correctly with V2 data
- ✅ Skills page works with flat structure
- ✅ Project metrics/case studies display
- ✅ All tests passing
- ✅ Zero console errors

---

## Files to Modify (Checklist)

### Type Definitions
- [ ] `types/api.ts` - All interface updates

### API Services
- [ ] `.env.local` - API base URL
- [ ] `lib/api/*` - All API service files

### Components (Projects)
- [ ] `components/ProjectCard.tsx`
- [ ] `components/ProjectModal.tsx`
- [ ] `components/ProjectTimeline.tsx`
- [ ] `components/ProjectPerformanceMetrics.tsx` (verify compatibility)

### Components (Skills)
- [ ] `app/skills/page.tsx`
- [ ] `components/SkillsClient.tsx`
- [ ] `components/SkillsFilter.tsx`
- [ ] All skill display components

### Components (Other)
- [ ] `components/CertificationsClient.tsx`
- [ ] `components/CertificationCard.tsx`
- [ ] `components/TestimonialsCarousel.tsx`
- [ ] Timeline components
- [ ] Blog components

**Estimated Files:** ~20-25 files

---

## Notes

- **Breaking Change:** Skills structure is the biggest change (hierarchical → flat)
- **Non-Breaking:** Most other changes are additive (new optional fields)
- **API Compatibility:** Admin API has transformation layer that maintains backward compatibility for `id` field
- **Testing Strategy:** Test each epic independently before moving to next
- **UI Improvements:** Defer to Phase 36+ (focus on integration only)

---

**Document Version:** 1.0
**Created:** 2025-12-12
**Author:** Claude Code + Niloy Kumar Barman Panday
