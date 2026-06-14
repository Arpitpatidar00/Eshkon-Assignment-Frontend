# Page Studio Platform

A CMS-powered landing page builder with schema-driven rendering, role-based permissions, draft editing, immutable versioned publishing, accessibility compliance, and CI/CD.

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                   Next.js App                     │
│                                                   │
│  ┌─────────┐   ┌──────────┐   ┌──────────────┐  │
│  │ Preview  │   │  Studio  │   │   API Routes  │  │
│  │ /preview │   │ /studio  │   │  /api/publish │  │
│  │  [slug]  │   │  [slug]  │   │  /api/releases│  │
│  └────┬─────┘   └────┬─────┘   └──────┬───────┘  │
│       │              │                 │          │
│  ┌────▼──────────────▼─────────────────▼───────┐  │
│  │              Domain Layer                    │  │
│  │  Schemas │ Diff │ SemVer │ Hash │ Changelog  │  │
│  └────────────────────┬────────────────────────┘  │
│                       │                           │
│  ┌────────────────────▼────────────────────────┐  │
│  │           Contentful Adapter                 │  │
│  │     (Mock Adapter / Real Contentful)         │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  ┌─────────────┐  ┌──────────────────────────┐   │
│  │  Auth/RBAC   │  │      Redux Store          │   │
│  │  Proxy Layer │  │ draftPage│ui│publish      │   │
│  └─────────────┘  └──────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run unit tests
npx vitest run

# Type check
npx tsc --noEmit

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API Route Handlers
│   │   ├── auth/           # Login/Logout endpoints
│   │   ├── publish/        # Publish engine endpoint
│   │   └── releases/       # Release history endpoint
│   ├── login/              # Login page
│   ├── preview/[slug]/     # Preview rendering route
│   └── studio/[slug]/      # Studio editor route
├── auth/                   # Authentication & RBAC
│   ├── permissions.ts      # Permission matrix
│   ├── roles.ts            # Role definitions
│   └── session.ts          # Cookie-based sessions
├── components/
│   ├── renderer/           # PageRenderer & ErrorBoundary
│   └── sections/           # Section components & registry
├── contentful/             # Contentful adapter layer
│   ├── mockAdapter.ts      # Mock data for development
│   └── pageAdapter.ts      # Clean adapter interface
├── domain/
│   ├── schemas/            # Zod validation schemas
│   ├── publish/            # Publishing engine
│   │   ├── diff.ts         # Deterministic diff engine
│   │   ├── semver.ts       # Semantic versioning
│   │   ├── hash.ts         # SHA-256 idempotency
│   │   ├── changelog.ts    # Changelog generation
│   │   └── snapshot.ts     # Immutable release storage
│   └── types.ts            # Core TypeScript types
├── store/                  # Redux Toolkit
│   ├── slices/             # draftPage, ui, publish slices
│   ├── store.ts            # Store configuration
│   └── provider.tsx        # React provider
├── proxy.ts                # Route protection (middleware)
└── __tests__/              # Unit tests
releases/                   # Immutable release snapshots
```

## 🔐 RBAC (Role-Based Access Control)

| Feature | Viewer | Editor | Publisher |
|---------|--------|--------|-----------|
| Preview pages | ✅ | ✅ | ✅ |
| Edit drafts | ❌ | ✅ | ✅ |
| Publish releases | ❌ | ❌ | ✅ |

### Demo Users

- **viewer@demo.com** — Can only preview pages
- **editor@demo.com** — Can preview and edit drafts
- **publisher@demo.com** — Can preview, edit, and publish

RBAC is enforced at **both** the proxy (route) level and API level. UI restrictions alone are never relied upon.

## 📋 Redux Architecture

### draftPageSlice
Stores the editable page state with dirty tracking:
- `setPage`, `updateSection`, `addSection`, `removeSection`, `reorderSections`, `resetDraft`

### uiSlice
Stores editor UI state:
- `setSelectedSection`, `toggleSidebar`, `setPreviewMode`, `setLoading`, `showToast`

### publishSlice
Stores publishing workflow state:
- `setPublishPreview`, `startPublish`, `publishSuccess`, `publishError`, `resetPublish`

Draft persistence uses `localStorage` — refreshing the page preserves unsaved changes.

## 🔄 Publishing Logic

1. **Diff**: Compare published version vs draft
2. **SemVer**: Determine version bump (patch/minor/major)
3. **Idempotency**: Skip if content hash matches previous release
4. **Snapshot**: Save immutable JSON to `releases/{slug}/{version}.json`
5. **Changelog**: Generate human-readable release notes

### Version Rules

| Change Type | Bump | Example |
|---|---|---|
| Text/property change | Patch | 1.0.0 → 1.0.1 |
| Section added | Minor | 1.0.0 → 1.1.0 |
| Section removed | Major | 1.0.0 → 2.0.0 |

## ♿ Accessibility

- WCAG 2.2 AAA-oriented
- All keyboard navigable (sections, editor, reordering, publishing)
- Visible focus indicators on all interactive elements
- Semantic HTML with proper headings, landmarks, ARIA labels
- `prefers-reduced-motion` respected
- Explicit form labels and error associations
- Skip-to-content link

## 🧪 Testing

### Unit Tests (Vitest)
- Schema validation (valid/invalid pages & sections)
- Diff engine (additions, removals, modifications)
- SemVer logic (patch, minor, major bumps)
- Hash generation (determinism, idempotency)
- Changelog generation

### CI/CD Pipeline
```
Lint → Type Check → Unit Tests → Build → (Playwright E2E)
```

## 🚀 Deployment

Designed for Vercel deployment with:
- **Preview**: PR/feature branch deployments
- **Production**: Main branch deployments

## ⚠️ Known Limitations

1. **Mock Data**: Currently uses mock Contentful data. Swap `mockAdapter.ts` for real Contentful client when credentials are available.
2. **File-based Releases**: Release snapshots are stored on the filesystem. In a serverless environment, swap to a database or S3.
3. **Demo Auth**: Uses cookie-based demo users. Replace with Auth.js or Clerk for production.
4. **Feature Grid Editing**: Individual features within a FeatureGrid cannot be edited inline yet (heading can be).
