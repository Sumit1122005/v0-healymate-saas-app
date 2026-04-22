# HealyMate Project Structure

## Complete File Organization

### Root Configuration Files
```
package.json              - Dependencies and project metadata
tsconfig.json            - TypeScript configuration
postcss.config.mjs       - PostCSS configuration for Tailwind
components.json          - shadcn/ui configuration
```

### Documentation Files
```
BUILD_SUMMARY.md                    - Executive summary of implementation
GETTING_STARTED.md                  - User onboarding guide
HEALYMATE_ARCHITECTURE.md           - Detailed technical architecture
IMPLEMENTATION_CHECKLIST.md         - Complete feature checklist
QUICK_START.md                      - Quick reference guide
PROJECT_STRUCTURE.md               - This file
```

### Application Core (`/app`)
```
layout.tsx              - Root layout with AuthProvider wrapper
page.tsx               - Landing page with auth flow
globals.css            - Global styles and design tokens
```

### Styling (`/styles`)
```
globals.css            - Additional global styles
```

### Components (`/components`)

#### Core Components
```
auth-form.tsx          - Login/signup form component
dashboard.tsx          - Main dashboard container
dashboard-nav.tsx      - Navigation sidebar with floating action
loading-spinner.tsx    - Loading state indicator
theme-provider.tsx     - Theme context provider
```

#### Feature Views (`/components/views`)
```
dashboard-overview.tsx      - Dashboard home with quick stats
journal-view.tsx            - Journal entries with AI sentiment analysis
mood-tracker-view.tsx       - Mood tracking with charts and trends
meditation-view.tsx         - Meditation player with guided sessions
goals-view.tsx              - Goal setting and progress tracking
therapist-view.tsx          - Therapist directory and filtering
community-view.tsx          - Community forum with posts/comments
resources-view.tsx          - Mental health resources library
settings-view.tsx           - User profile and settings
```

#### UI Components (`/components/ui`)
```
59 shadcn/ui components including:
- Layout: sidebar, drawer, sheet, tabs, accordion
- Forms: input, textarea, select, checkbox, radio-group, toggle
- Feedback: toast, alert, dialog, alert-dialog
- Navigation: navigation-menu, breadcrumb, menubar, pagination
- Data: table, chart components for visualization
- Floating: popover, dropdown-menu, context-menu, hover-card
- Other: badge, avatar, card, skeleton, progress, slider
```

### Core Logic (`/lib`)

#### Encryption & Security
```
encryption.ts           - E2E encryption using Web Crypto API
                          - PBKDF2 key derivation
                          - AES-GCM authenticated encryption
                          - SHA-256 password hashing
```

#### Authentication
```
auth-context.tsx        - React context for auth state
auth-service.ts         - Login/signup logic with password hashing
```

#### Database
```
db.ts                   - IndexedDB wrapper with schemas:
                          - Users collection
                          - Journals collection
                          - Moods collection
                          - Goals collection
                          - Meditations collection
                          - Community posts
                          - Comments
```

#### AI Services
```
ai-service.ts          - Mock AI implementations:
                          - Sentiment analysis
                          - Meditation guidance
                          - Goal recommendations
                          - Streaming response simulation
```

### Custom Hooks (`/hooks`)
```
use-encrypted-data.ts   - Hook for managing encrypted storage
use-mobile.ts           - Mobile responsiveness detection
use-toast.ts            - Toast notifications
```

## Data Architecture

### IndexedDB Schema

#### Users
```
- id (string, primary key)
- email (string)
- passwordHash (string)
- theme (string)
- createdAt (number)
```

#### Journals
```
- id (string, primary key)
- userId (string)
- title (string)
- content (string, encrypted)
- mood (number 1-5)
- tags (array)
- sentiment (string)
- createdAt (number)
- updatedAt (number)
```

#### Moods
```
- id (string, primary key)
- userId (string)
- mood (number 1-5)
- emotion (string)
- intensity (number)
- triggers (array)
- notes (string, encrypted)
- timestamp (number)
```

#### Goals
```
- id (string, primary key)
- userId (string)
- title (string)
- description (string)
- category (string)
- progress (number 0-100)
- deadline (number)
- status (string)
- createdAt (number)
```

#### Meditations
```
- id (string, primary key)
- userId (string)
- title (string)
- duration (number)
- category (string)
- completedAt (number, null if not completed)
- rating (number)
```

#### CommunityPosts
```
- id (string, primary key)
- userId (string)
- username (string)
- title (string)
- content (string)
- likes (number)
- comments (array of IDs)
- timestamp (number)
```

#### Comments
```
- id (string, primary key)
- postId (string)
- userId (string)
- username (string)
- content (string)
- timestamp (number)
```

## Design System

### Color Palette (Light Mode)
```
Primary:      oklch(0.55 0.15 175)  - Calming teal
Secondary:    oklch(0.7 0.1 155)    - Soft blue-green
Accent:       oklch(0.65 0.18 145)  - Vibrant teal
Background:   oklch(0.98 0.005 206) - Almost white
Foreground:   oklch(0.25 0.05 206)  - Dark blue
```

### Color Palette (Dark Mode)
```
Primary:      oklch(0.65 0.16 175)  - Bright teal
Secondary:    oklch(0.75 0.12 155)  - Light blue-green
Accent:       oklch(0.7 0.18 145)   - Bright teal
Background:   oklch(0.2 0.02 206)   - Very dark blue
Foreground:   oklch(0.92 0.01 206)  - Almost white
```

### Typography
```
Font Family:  Geist (primary), Geist Mono (code)
Line Height:  1.4-1.6 for body text
Radius:       0.75rem (rounded corners)
```

## Key Features Implementation

### 1. Authentication
- Email/password signup and login
- Password hashing with SHA-256
- Session management via sessionStorage
- Protected routes

### 2. Journaling with AI
- Encrypted journal entries (AES-GCM)
- Sentiment analysis (mock)
- Mood tagging
- Full-text search
- Entry editing/deletion

### 3. Mood Tracking
- Daily mood logging (1-5 scale)
- Emotion tracking
- Trigger identification
- Visual charts (Recharts)
- Trend analysis

### 4. Meditation
- Guided sessions (mock)
- Duration tracking
- Session history
- Rating system
- Categories and filtering

### 5. Goals
- Goal creation and editing
- Progress tracking (0-100%)
- Category organization
- Deadline management
- Status updates

### 6. Therapist Directory
- Searchable therapist database
- Specialization filtering
- Availability checking
- Contact information
- Mock data with 20+ therapists

### 7. Community
- Forum-style discussions
- Post creation/deletion
- Comments system
- Likes functionality
- User anonymity option

### 8. Resources
- Mental health articles
- Coping strategies
- Emergency contacts
- Crisis resources
- Links to professional help

### 9. Settings
- Profile management
- Theme selection (light/dark)
- Privacy preferences
- Data export
- Account deletion

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React

### Security & Storage
- **Encryption**: Web Crypto API (PBKDF2 + AES-GCM)
- **Database**: IndexedDB (client-side)
- **Session**: sessionStorage

### Development
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Build**: Turbopack (Next.js 16 default)

## Scalability Features

### Client-Heavy Architecture
- All data processing on client
- No server-side bottlenecks
- Offline-first design
- Instant response times

### Horizontal Scalability
- Stateless architecture (data in IndexedDB, not server)
- Easy to add backend layer when needed
- Modular component structure
- Service-oriented design

### Performance
- Code splitting via Next.js App Router
- Lazy-loaded components
- Optimized images
- CSS-in-JS with Tailwind
- Fast refresh for development

## Future Enhancement Paths

### Backend Integration
- Replace IndexedDB with PostgreSQL
- Add real authentication service
- Implement real-time sync
- Add cloud backup

### AI Integration
- Connect to OpenAI/Anthropic
- Real sentiment analysis
- Personalized recommendations
- Chatbot therapy

### Social Features
- Real-time messaging
- Video calls with therapists
- Group sessions
- Moderation system

### Advanced Analytics
- Mood prediction
- Mental health trends
- Personalized insights
- Export reports

## Development Guidelines

### Running the Project
```bash
pnpm install      # Install dependencies
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
```

### Code Organization
- Components in `/components`
- Core logic in `/lib`
- Custom hooks in `/hooks`
- Global styles in `/app/globals.css`
- Design tokens in CSS custom properties

### Adding New Features
1. Create view component in `/components/views`
2. Add database schema if needed in `/lib/db.ts`
3. Update dashboard routing
4. Add navigation item to `dashboard-nav.tsx`
5. Document in checklist

## Security Considerations

### Implemented
- Client-side E2E encryption for journals/moods
- Password hashing with SHA-256
- XSS protection via React's built-in escaping
- CSRF tokens for forms (via shadcn/ui)

### Production Requirements
- HTTPS/TLS encryption in transit
- Backend authentication
- Rate limiting
- Input validation
- SQL injection prevention (if using DB)
- Regular security audits

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## File Statistics
```
Total Files:        140+
TypeScript Files:   45+
Components:         70+
UI Components:      59
Documentation:      6 files
```
