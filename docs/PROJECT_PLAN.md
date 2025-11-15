# Praylude - Comprehensive Development Plan
**"Where Prayer Sets the Tone"**

## 🎯 Core Vision

**Purpose**: Guide Christians into the "secret place" (Matthew 6:6) - a state of deep, personal communion with God through structured yet customizable meditation practice.

**Key Principle**: A tool users will eventually transcend as they master the practice of intimate communion with God.

---

## 📋 Development Phases

### **PHASE 1: Foundation & Mock Data**

**Goal**: Build fully functional app with mock data, minimalist design, and custom session builder.

#### 1.1 Project Setup
- [ ] Initialize Next.js 14+ with TypeScript, Tailwind CSS, App Router
- [ ] Configure minimalist design system (Japanese Ma inspired)
  - Calm color palette (whites, soft grays, subtle earth tones)
  - Typography (spacious, readable)
  - Spacing system (generous margins/padding)
- [ ] Set up folder structure (app, components, lib, types, data)
- [ ] Create basic layout (minimal header/nav)

#### 1.2 Data Models & Mock Data
- [ ] Define TypeScript interfaces
  - User (profile, preferences, history)
  - Technique (individual meditation technique for a section)
  - Section (Welcome, Mind, Body, Spirit, Meditation, Incorporate)
  - Session (user's custom meditation composed of chosen techniques)
  - SessionHistory (completed sessions, timestamps, insights)
- [ ] Create mock meditation techniques (JSON)
  - Multiple techniques per section (e.g., 3-5 different techniques per section)
  - Various durations (5, 10, 15, 20, 30 minutes)
  - Scripture references embedded
  - Detailed scripts for each technique
- [ ] Create standard daily meditation template
- [ ] Build data access layer

#### 1.3 Core Pages (Minimal Design)

**Home Page**
- [ ] Simple welcome message
- [ ] Single primary CTA: "Begin Today's Meditation"
- [ ] Subtle secondary option: "Create Custom Meditation"
- [ ] Optional: Current streak/stats (minimal, unobtrusive)

**Standard Meditation Player**
- [ ] Clean player interface
  - Large, clear section indicator (Welcome → Mind → Body → etc.)
  - Minimal progress bar
  - Simple play/pause control
  - Subtle timer (remaining time)
- [ ] Background: Calming gradient or single color
- [ ] Text overlay for guided portions (optional, user can toggle)
- [ ] Smooth transitions between sections

**Custom Session Builder**
- [ ] Six-column layout (one per section)
- [ ] For each section:
  - Choose technique from dropdown (or "Skip this section")
  - Adjust duration with slider (minimal UI)
- [ ] Preview total time
- [ ] Save custom session
- [ ] One-tap start

**Profile/History**
- [ ] Simple stats: Total sessions, streak, favorite time of day
- [ ] List of completed sessions (date, duration, notes)
- [ ] Saved custom meditations
- [ ] Minimal, clean layout

#### 1.4 Audio Player & Mixing System

**Phase 1 (Simple)**
- [ ] Build basic audio player component
- [ ] Play pre-recorded audio files (mock)
- [ ] Implement play/pause/seek controls
- [ ] Timer display
- [ ] Section progression tracking

**Prepare for Phase 2** (Dynamic mixing)
- [ ] Design audio segment architecture
  - Introduction segments
  - Body segments (extendable/repeatable)
  - Conclusion segments
  - Transition segments
- [ ] Plan mixing logic (chain segments based on user's custom session)

#### 1.5 User Experience Features
- [ ] Session completion tracking (localStorage initially)
- [ ] Save custom meditations (localStorage initially)
- [ ] Dark mode (primary), optional soft light mode
- [ ] Responsive design (mobile-first)
- [ ] Optional: Gentle notification reminders (browser API)

---

### **PHASE 2: Gemini Voice Integration**

**Goal**: Replace mock audio with AI-generated voice using Gemini, implement dynamic audio mixing.

#### 2.1 Gemini API Setup
- [ ] Set up Gemini API credentials (environment variables)
- [ ] Create Gemini service module in lib/
- [ ] Build Next.js API route: `/api/generate-voice`
- [ ] Implement error handling and rate limiting

#### 2.2 Dynamic Audio Generation

**Script Templates**
- [ ] Create structured meditation scripts for each technique
  - Variable placeholders for duration, user name, etc.
  - Scripture integration
  - Section-appropriate guidance
- [ ] Build script generation logic (compose script from user's session config)

**Voice Generation**
- [ ] Implement Gemini text-to-speech
- [ ] Generate audio segments for each section
- [ ] Handle variable-length sections (user-defined durations)
- [ ] Add loading states ("Preparing your meditation...")
- [ ] Implement caching (save generated audio for reuse)

**Audio Mixing Engine**
- [ ] Build dynamic audio mixer
  - Chain segments based on session configuration
  - Adjust pacing for different durations
  - Add gentle background ambience (optional)
  - Smooth crossfades between sections
- [ ] Pregenerate popular/standard meditations
- [ ] Generate custom sessions on-demand (with caching)

#### 2.3 Player Integration
- [ ] Update player to handle Gemini-generated audio
- [ ] Add "Regenerate with different voice" option (if supported)
- [ ] Implement background generation (generate next section while current plays)
- [ ] Error fallbacks (pre-recorded backup or graceful failure)

---

### **PHASE 3: Supabase Integration**

**Goal**: Add real authentication, backend storage, subscription system, and referrals.

#### 3.1 Supabase Setup
- [ ] Create Supabase project
- [ ] Design database schema
  - `users` (profiles, preferences, subscription status)
  - `techniques` (meditation techniques, scripts, Scripture references)
  - `sections` (six main sections)
  - `custom_sessions` (user-created meditation combinations)
  - `session_history` (completed meditations, timestamps, notes)
  - `referrals` (track referral links, rewards)
- [ ] Configure Row Level Security (RLS)
- [ ] Set up environment variables

#### 3.2 Authentication
- [ ] Implement Supabase Auth
- [ ] Build minimal login/signup pages (email/password)
- [ ] Add social auth (Google, Apple)
- [ ] Protected routes for authenticated features
- [ ] Auth state management (context/hooks)
- [ ] Onboarding flow for new users

#### 3.3 Data Migration
- [ ] Migrate mock techniques to Supabase `techniques` table
- [ ] Update data access layer to use Supabase client
- [ ] Sync localStorage data to Supabase (session history, custom sessions)
- [ ] Real-time user progress tracking
- [ ] User preferences storage (dark/light mode, default session, etc.)

#### 3.4 Subscription & Referrals
- [ ] Implement subscription status tracking
- [ ] First 100 users: Lifetime free access flag
- [ ] Referral system:
  - Generate unique referral links per user
  - Track signups via referral links
  - Award 1 free month per 3 monthly referrals
- [ ] Payment integration (Stripe or similar)
- [ ] 1-month free trial link generation (users can share)

#### 3.5 Community Features
- [ ] Share custom meditations
  - Public/private toggle
  - Browse shared meditations from community
  - Try others' meditation combinations
- [ ] Optional: Ratings/feedback on shared meditations
- [ ] Optional: Featured meditations (curated)

---

### **PHASE 4: Progressive Learning & Content**

**Goal**: Enable weekly technique releases and guided learning progression.

#### 4.1 Weekly Technique Releases
- [ ] Build admin interface (for adding new techniques)
- [ ] Schedule technique releases (weekly or custom cadence)
- [ ] "What's New" notification system
- [ ] Introduce new techniques in standard daily meditation
- [ ] Allow users to opt-in to new techniques in custom sessions

#### 4.2 Learning Path
- [ ] Create beginner → intermediate → advanced technique categorization
- [ ] Guided progression (suggest next technique to try)
- [ ] Track which techniques user has experienced
- [ ] Optional: "Mastery" system (mark techniques as mastered)

---

## 🎯 Feature Summary by Phase

### **MVP (Phase 1)**
1. ✅ Standard daily meditation (six-section structure)
2. ✅ Custom session builder (choose techniques, adjust durations, skip sections)
3. ✅ Basic audio playback
4. ✅ Session completion tracking
5. ✅ Minimalist, distraction-free design (Japanese Ma)
6. ✅ Mobile-first responsive

### **Phase 2**
7. ✅ Gemini voice-generated guided meditations
8. ✅ Dynamic audio mixing (on-the-fly session composition)
9. ✅ Variable-length section support

### **Phase 3**
10. ✅ User authentication (Supabase)
11. ✅ Real backend storage (sessions, history, custom meditations)
12. ✅ Referral system (3 referrals = 1 free month)
13. ✅ First 100 users lifetime access
14. ✅ Share custom meditations with community

### **Phase 4**
15. ✅ Weekly new technique releases
16. ✅ Progressive learning path
17. ✅ Admin content management

### **Future Enhancements**
18. ⭐ Offline mode (download meditations)
19. ⭐ Insights/journal after meditation
20. ⭐ Streaks and gentle accountability
21. ⭐ Background nature sounds/music
22. ⭐ Integration with Scripture reading plans

---

## 🚀 Current Status

**Active Phase**: Phase 1 - Foundation & Mock Data
**Next Milestone**: Complete Phase 1.1 - Project Setup

---

## 📚 Related Documentation

- [Design System](./DESIGN_SYSTEM.md) - Japanese Ma aesthetic principles
- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md) - Tech stack and decisions
- [Practice Structure](./PRACTICE_STRUCTURE.md) - Six-section meditation framework
