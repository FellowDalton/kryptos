# Praylude - Technical Architecture

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components + Shadcn/UI (optional, minimal)
- **State Management**: React Context + Hooks (simple, no Redux needed)
- **Audio**: Web Audio API / HTML5 Audio

### Backend (Phase 3)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for cached audio files)
- **Real-time**: Supabase Realtime (optional, for live features)

### APIs
- **Voice Generation**: Google Gemini API (Phase 2)
- **Payments**: Stripe (Phase 3.4)

### DevOps
- **Hosting**: Vercel (Next.js optimized)
- **Version Control**: Git + GitHub
- **CI/CD**: Vercel automatic deployments
- **Environment Variables**: Vercel Environment Variables + `.env.local`

---

## 📁 Project Structure

```
praylude/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── meditate/
│   │   ├── standard/             # Standard daily meditation
│   │   │   └── page.tsx
│   │   └── custom/[id]/          # Custom session player
│   │       └── page.tsx
│   ├── create/                   # Custom session builder
│   │   └── page.tsx
│   ├── profile/
│   │   ├── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   └── referrals/
│   │       └── page.tsx
│   ├── community/                # Browse shared meditations
│   │   └── page.tsx
│   ├── api/
│   │   ├── gemini/
│   │   │   └── generate-voice/
│   │   │       └── route.ts
│   │   └── sessions/
│   │       └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── player/
│   │   ├── AudioPlayer.tsx       # Main audio player
│   │   ├── ProgressBar.tsx
│   │   ├── PlayPauseButton.tsx
│   │   ├── SectionIndicator.tsx
│   │   └── Timer.tsx
│   ├── builder/
│   │   ├── SessionBuilder.tsx    # Custom session builder
│   │   ├── TechniqueSelector.tsx
│   │   └── DurationSlider.tsx
│   ├── meditation/
│   │   ├── MeditationCard.tsx
│   │   └── SessionList.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Navigation.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase client
│   │   ├── auth.ts               # Auth helpers
│   │   └── queries.ts            # Database queries
│   ├── gemini/
│   │   ├── client.ts             # Gemini API client
│   │   └── voice-generator.ts   # Voice generation logic
│   ├── audio/
│   │   ├── mixer.ts              # Dynamic audio mixing
│   │   ├── player.ts             # Audio player utilities
│   │   └── cache.ts              # Audio caching logic
│   ├── data/
│   │   └── mock-data.ts          # Mock data access layer (Phase 1)
│   └── utils/
│       ├── cn.ts                 # Class name utility
│       └── date.ts               # Date formatting
├── types/
│   └── index.ts                  # TypeScript interfaces
├── data/
│   └── mock-techniques.json      # Mock technique data (Phase 1)
├── hooks/
│   ├── useAudioPlayer.ts         # Audio player hook
│   ├── useAuth.ts                # Authentication hook
│   └── useSessions.ts            # Session data hook
├── context/
│   ├── AuthContext.tsx           # Auth state provider
│   └── SessionContext.tsx        # Session state provider
├── public/
│   ├── audio/                    # Static/cached audio files
│   └── images/                   # Images (if any)
├── supabase/
│   ├── migrations/               # Database migrations
│   └── seed.sql                  # Seed data
├── docs/                         # Documentation
│   ├── PROJECT_PLAN.md
│   ├── DESIGN_SYSTEM.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   └── PRACTICE_STRUCTURE.md
├── .env.local.example            # Environment variables template
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🗄️ Data Models (TypeScript)

### Core Types

```typescript
// types/index.ts

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  preferences: UserPreferences;
  subscriptionStatus: SubscriptionStatus;
  lifetimeAccess: boolean; // First 100 users
  referralCode: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  defaultSessionId?: string;
  notificationsEnabled: boolean;
  reminderTime?: string; // e.g., "07:00"
}

export type SubscriptionStatus =
  | 'free'
  | 'trial'
  | 'active'
  | 'cancelled'
  | 'lifetime';

export interface Section {
  id: string;
  name: 'welcome' | 'mind' | 'body' | 'spirit' | 'meditation' | 'incorporate';
  displayName: string;
  description: string;
  order: number; // 1-6
}

export interface Technique {
  id: string;
  sectionId: string; // Foreign key to Section
  name: string;
  description: string;
  scriptTemplate: string; // Template with variables
  defaultDuration: number; // in seconds
  minDuration: number;
  maxDuration: number;
  scriptureReferences?: string[]; // e.g., ["Matthew 6:6", "Psalm 46:10"]
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  releasedAt?: Date; // For weekly releases
}

export interface CustomSession {
  id: string;
  userId: string;
  name: string;
  description?: string;
  techniques: SessionTechnique[]; // Ordered array of techniques
  totalDuration: number; // Calculated sum
  isPublic: boolean; // For community sharing
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionTechnique {
  sectionId: string;
  techniqueId: string | null; // null means "skip this section"
  duration: number; // User-customized duration in seconds
  order: number; // 1-6 (matches section order)
}

export interface SessionHistory {
  id: string;
  userId: string;
  sessionId: string; // References CustomSession or standard session
  completedAt: Date;
  duration: number; // Actual time spent
  notes?: string; // User reflections
}

export interface Referral {
  id: string;
  referrerId: string; // User who referred
  refereeId: string; // User who signed up
  referralCode: string;
  signupDate: Date;
  status: 'pending' | 'qualified' | 'rewarded'; // qualified = paid for 1 month
  rewardGrantedAt?: Date;
}
```

---

## 🔊 Audio Architecture

### Phase 1: Simple Playback

**Flow**:
1. User selects session (standard or custom)
2. App loads pre-recorded audio file(s) from `/public/audio/`
3. Audio player plays file, tracks progress
4. User can play/pause/seek

**File Structure**:
```
/public/audio/
  ├── welcome-basic-5min.mp3
  ├── mind-cross-10min.mp3
  ├── body-scan-15min.mp3
  └── ...
```

### Phase 2: Dynamic Generation & Mixing

**Flow**:
1. User creates custom session (selects techniques + durations)
2. App checks cache for existing audio segments
3. If not cached:
   - Generate script from technique template
   - Call Gemini API to generate voice audio
   - Cache result in Supabase Storage
4. Mix audio segments into single playable file:
   - Intro segment
   - Body segments (repeated/extended as needed)
   - Outro segment
   - Crossfade transitions
5. Serve mixed audio to player

**Audio Segment Types**:

```typescript
export interface AudioSegment {
  id: string;
  techniqueId: string;
  segmentType: 'intro' | 'body' | 'outro' | 'transition';
  duration: number; // in seconds
  audioUrl: string; // URL to audio file
  createdAt: Date;
}
```

**Mixing Logic**:
- **Short session (5 min)**: Intro + Short body + Outro
- **Medium session (10-15 min)**: Intro + Body (repeated 2-3x) + Outro
- **Long session (20-30 min)**: Intro + Body (repeated 4-6x) + Outro
- **Transitions**: 2-second crossfade between sections

**Caching Strategy**:
- Cache generated audio segments in Supabase Storage
- Key: `{techniqueId}-{segmentType}-{duration}.mp3`
- Cache popular sessions in full (pre-mixed)
- Expire cache after 30 days of no use

---

## 🔐 Authentication Flow (Phase 3)

### Supabase Auth

**Sign Up**:
1. User enters email + password
2. Supabase sends confirmation email
3. User confirms email
4. Create user profile in `users` table
5. Check if user is in first 100 → set `lifetimeAccess = true`
6. Generate unique referral code

**Login**:
1. User enters credentials
2. Supabase validates
3. Set session cookie
4. Redirect to home

**Social Auth** (Google, Apple):
1. User clicks "Sign in with Google"
2. Supabase OAuth flow
3. Create/update user profile
4. Set session

**Protected Routes**:
- Middleware checks Supabase session
- Redirect to login if not authenticated
- Allow access to public pages (home, community)

---

## 💾 Database Schema (Supabase)

### Tables

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  subscription_status TEXT DEFAULT 'free',
  lifetime_access BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE NOT NULL,
  preferences JSONB DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**sections**
```sql
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  order INT NOT NULL
);
```

**techniques**
```sql
CREATE TABLE techniques (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id),
  name TEXT NOT NULL,
  description TEXT,
  script_template TEXT NOT NULL,
  default_duration INT NOT NULL, -- seconds
  min_duration INT NOT NULL,
  max_duration INT NOT NULL,
  scripture_references TEXT[],
  difficulty TEXT DEFAULT 'beginner',
  created_at TIMESTAMP DEFAULT NOW(),
  released_at TIMESTAMP
);
```

**custom_sessions**
```sql
CREATE TABLE custom_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  techniques JSONB NOT NULL, -- Array of SessionTechnique
  total_duration INT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**session_history**
```sql
CREATE TABLE session_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES custom_sessions(id),
  completed_at TIMESTAMP DEFAULT NOW(),
  duration INT NOT NULL,
  notes TEXT
);
```

**referrals**
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  signup_date TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  reward_granted_at TIMESTAMP
);
```

### Row Level Security (RLS)

**users**: Users can read/update their own profile
**custom_sessions**: Users can CRUD their own sessions, read public sessions
**session_history**: Users can CRUD their own history
**referrals**: Users can read their own referrals
**sections**: Public read
**techniques**: Public read

---

## 🎵 Gemini API Integration

### API Setup

**Environment Variables**:
```
GEMINI_API_KEY=your_gemini_api_key
```

**API Route**: `/app/api/gemini/generate-voice/route.ts`

```typescript
export async function POST(req: Request) {
  const { scriptText, voice, speed } = await req.json();

  // Call Gemini API
  const audioBuffer = await generateVoice(scriptText, { voice, speed });

  // Upload to Supabase Storage (cache)
  const audioUrl = await uploadAudio(audioBuffer);

  return Response.json({ audioUrl });
}
```

### Voice Generation Logic

```typescript
// lib/gemini/voice-generator.ts

export async function generateVoice(
  text: string,
  options: { voice?: string; speed?: number }
): Promise<ArrayBuffer> {
  const response = await fetch('https://api.gemini.google.com/v1/voice', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      voice: options.voice || 'default',
      speed: options.speed || 1.0,
    }),
  });

  return await response.arrayBuffer();
}
```

---

## 🔄 State Management

### Contexts

**AuthContext**:
- Current user
- Login/logout functions
- Loading state

**SessionContext** (optional):
- Current active session
- Playback state
- Progress tracking

### Hooks

**useAudioPlayer**:
```typescript
export function useAudioPlayer(audioUrl: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Audio element ref
  // Play/pause/seek functions
  // Progress tracking

  return { isPlaying, currentTime, duration, play, pause, seek };
}
```

---

## 🚀 Deployment

### Vercel

**Setup**:
1. Connect GitHub repo to Vercel
2. Configure environment variables
3. Automatic deployments on push to `main`

**Environment Variables** (Vercel):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `GEMINI_API_KEY`
- `STRIPE_SECRET_KEY` (Phase 3)

---

## 🧪 Testing Strategy

### Phase 1
- Manual testing (UI, navigation, audio playback)
- Use `tester` agent with Playwright for visual verification

### Phase 2
- Test Gemini API integration
- Test audio mixing logic
- Cache verification

### Phase 3
- Test authentication flows
- Test database operations
- Test referral system logic

---

## 📈 Performance Considerations

### Optimization
- **Code splitting**: Dynamic imports for heavy components
- **Image optimization**: Next.js Image component (if images added)
- **Audio lazy loading**: Don't load until user starts session
- **Database queries**: Index foreign keys, optimize joins

### Caching
- **Audio files**: Cache in Supabase Storage + CDN
- **Static pages**: Next.js static generation where possible
- **API responses**: Cache frequently accessed data

---

## 🔒 Security

### Best Practices
- **Environment variables**: Never commit secrets
- **RLS**: Enforce data access policies in database
- **API routes**: Validate all inputs
- **Authentication**: Use Supabase Auth (secure by default)
- **HTTPS**: Enforce HTTPS in production (Vercel default)

---

## 📚 Dependencies

### Core
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0"
}
```

### Supabase
```json
{
  "@supabase/supabase-js": "^2.0.0",
  "@supabase/auth-helpers-nextjs": "^0.8.0"
}
```

### Audio
```json
{
  "howler": "^2.2.3" (optional, for advanced audio features)
}
```

### Payments (Phase 3)
```json
{
  "stripe": "^14.0.0",
  "@stripe/stripe-js": "^2.0.0"
}
```

---

**This architecture prioritizes simplicity, performance, and scalability. Start simple in Phase 1, add complexity only when needed.**
