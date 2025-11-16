# Praylude Phase 2: Gemini Voice Integration & Dynamic Audio
**From Simulation to Sacred Sound**

## 🎯 Phase 2 Vision

Transform Praylude from a simulated meditation player into a **living, breathing spiritual companion** powered by Google's Gemini AI. Replace timer-based placeholders with **dynamically generated, personalized voice guidance** that adapts to each user's custom meditation sessions.

---

## 📊 Phase 2 Overview

**Goal**: Replace simulated playback with AI-generated voice narration and dynamic audio mixing

**Duration**: ~3-4 weeks (estimated)

**Complexity**: High - Involves external API integration, audio processing, caching strategy

**Dependencies**:
- Google Gemini API access
- Audio processing libraries
- Supabase Storage (for audio caching)

---

## 🎯 Phase 2 Objectives

### Primary Goals
1. ✅ **Gemini API Integration** - Connect to Google's Gemini API for text-to-speech
2. ✅ **Script Generation System** - Transform meditation techniques into narration scripts
3. ✅ **Audio Segment Architecture** - Break meditations into mixable audio chunks
4. ✅ **Dynamic Audio Mixing** - Combine segments based on user's custom sessions
5. ✅ **Caching Strategy** - Optimize API usage with intelligent caching
6. ✅ **Real Audio Playback** - Replace simulated timers with actual audio

### Secondary Goals
7. ⭐ **Voice Customization** - Allow users to select voice characteristics (speed, tone)
8. ⭐ **Background Music** - Add optional ambient soundscapes
9. ⭐ **Offline Mode** - Cache generated sessions for offline playback
10. ⭐ **Preview System** - Let users preview techniques before building sessions

---

## 📋 Phase 2 Todo List (17 Items)

### **2.1: Gemini API Setup (3 todos)**
1. [ ] Set up Google Cloud project and enable Gemini API
2. [ ] Configure API credentials and environment variables
3. [ ] Create Gemini service client with error handling and rate limiting

### **2.2: Script Generation (4 todos)**
4. [ ] Design meditation script template system with variables
5. [ ] Implement script compiler (technique → narration script)
6. [ ] Add duration adaptation logic (5min vs 20min versions)
7. [ ] Create preview endpoint for script generation

### **2.3: Audio Segment Architecture (3 todos)**
8. [ ] Define audio segment types (intro, body, outro, transition)
9. [ ] Implement segment generation from scripts
10. [ ] Build segment storage system (Supabase Storage integration)

### **2.4: Voice Generation (3 todos)**
11. [ ] Implement Gemini text-to-speech integration
12. [ ] Add voice parameter customization (speed, pitch, emphasis)
13. [ ] Create batch generation system for popular techniques

### **2.5: Dynamic Audio Mixing (3 todos)**
14. [ ] Build audio mixer service (concatenate segments)
15. [ ] Implement crossfade transitions between sections
16. [ ] Add silence/pause insertion for meditation timing

### **2.6: Caching & Optimization (1 todo)**
17. [ ] Implement intelligent caching strategy with TTL and LRU

---

## 🏗️ Technical Architecture

### **Audio Segment Structure**

```typescript
interface AudioSegment {
  id: string;
  techniqueId: string;
  segmentType: 'intro' | 'body' | 'outro' | 'transition' | 'silence';
  duration: number; // seconds
  audioUrl: string; // Supabase Storage URL or local cache
  text: string; // Original script text
  voiceParams: VoiceParameters;
  createdAt: string;
  expiresAt?: string; // Cache TTL
}

interface VoiceParameters {
  speed: number; // 0.5 - 2.0
  pitch: number; // -20 to 20 semitones
  voice: 'male' | 'female' | 'neutral';
  language: 'en-US';
}
```

### **Script Template System**

```typescript
interface ScriptTemplate {
  techniqueId: string;
  sections: ScriptSection[];
}

interface ScriptSection {
  type: 'intro' | 'body' | 'outro';
  minDuration: number; // seconds
  maxDuration: number;
  text: string; // With {variables}
  variables: {
    userName?: string;
    duration?: number;
    pause?: number; // {pause:5} = 5 second silence
    scripture?: string;
  };
}

// Example:
const welcomeScript: ScriptTemplate = {
  techniqueId: 'welcome-001',
  sections: [
    {
      type: 'intro',
      minDuration: 30,
      maxDuration: 90,
      text: `Welcome {userName} to this time set apart for you and God.
             Find a comfortable position. {pause:3}
             Take a deep breath in... {pause:2} and out. {pause:2}
             This is your secret place, where the Father sees you.`,
      variables: { userName: true, pause: true }
    },
    {
      type: 'body',
      minDuration: 60,
      maxDuration: 300,
      text: `In your mind's eye, see the door to your sacred room. {pause:5}
             Open it and step inside. {pause:3}
             This is the space you return to each day...`,
      variables: { pause: true }
    }
  ]
};
```

### **Audio Mixing Pipeline**

```
User Creates Custom Session
         ↓
Script Compiler:
  - Load technique templates
  - Inject variables (userName, duration)
  - Adapt to user-selected durations
  - Compile full script per section
         ↓
Segment Generator:
  - Split script into segments (intro/body/outro)
  - Check cache for existing segments
  - Generate missing segments via Gemini API
  - Store in Supabase Storage
         ↓
Audio Mixer:
  - Load all segments for session
  - Add transitions (2s crossfade)
  - Insert silence markers ({pause})
  - Concatenate into single audio file
  - Return playable URL
         ↓
Audio Player:
  - Stream audio with Web Audio API
  - Track progress through sections
  - Save to cache for offline replay
```

### **Caching Strategy**

**Three-Tier Caching:**

1. **Browser Cache** (IndexedDB)
   - Recently played sessions
   - User's custom sessions
   - TTL: 7 days
   - Max size: 50MB

2. **Supabase Storage** (Server Cache)
   - All generated audio segments
   - Organized by techniqueId + voiceParams
   - TTL: 30 days for unpopular, infinite for popular
   - Key format: `{techniqueId}/{segmentType}/{hash(voiceParams)}.mp3`

3. **Memory Cache** (Server Runtime)
   - Script templates (hot reload)
   - Popular segment URLs
   - TTL: 1 hour
   - Max entries: 100

**Cache Invalidation:**
- Technique script updated → Clear all segments for that technique
- Voice params changed → Generate new segments
- Unpopular segments (no access in 30 days) → Delete from Supabase

**Pregeneration Strategy:**
- Standard daily meditation → Pregenerate all segments on deploy
- Top 10 custom sessions → Pregenerate weekly
- New techniques → Generate on first use, then cache

---

## 🎵 Gemini API Integration

### **API Endpoints**

**Text-to-Speech:**
```typescript
// Gemini API call
POST https://generativelanguage.googleapis.com/v1/models/gemini-tts:generateSpeech

Request:
{
  text: "Welcome to this meditation...",
  voiceConfig: {
    languageCode: "en-US",
    name: "en-US-Neural2-F",
    speakingRate: 0.9, // Slower for meditation
    pitch: 0.0,
    volumeGainDb: 0.0
  },
  audioConfig: {
    audioEncoding: "MP3",
    sampleRateHertz: 24000
  }
}

Response:
{
  audioContent: "base64_encoded_audio..."
}
```

### **Rate Limiting Strategy**

```typescript
interface RateLimiter {
  maxRequestsPerMinute: 60;
  maxRequestsPerDay: 10000;
  currentMinuteCount: number;
  currentDayCount: number;
  retryAfter?: number; // Backoff in seconds
}

// Implementation
class GeminiRateLimiter {
  async waitForAvailability(): Promise<void> {
    if (this.currentMinuteCount >= this.maxRequestsPerMinute) {
      await sleep(60000 - Date.now() % 60000); // Wait until next minute
    }
    if (this.currentDayCount >= this.maxRequestsPerDay) {
      throw new Error('Daily API quota exceeded');
    }
  }

  async generateAudio(text: string, params: VoiceParameters): Promise<AudioBuffer> {
    await this.waitForAvailability();

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({ text, voiceConfig: params })
      });

      this.currentMinuteCount++;
      this.currentDayCount++;

      return await response.arrayBuffer();
    } catch (error) {
      if (error.status === 429) {
        this.retryAfter = parseInt(error.headers['Retry-After']);
        await sleep(this.retryAfter * 1000);
        return this.generateAudio(text, params); // Retry
      }
      throw error;
    }
  }
}
```

### **Error Handling**

```typescript
enum AudioGenerationError {
  API_QUOTA_EXCEEDED = 'API quota exceeded, try again tomorrow',
  API_UNAVAILABLE = 'Gemini API temporarily unavailable',
  INVALID_SCRIPT = 'Script contains invalid characters',
  SEGMENT_TOO_LONG = 'Script exceeds maximum length (5000 chars)',
  NETWORK_ERROR = 'Network error, check connection'
}

// Fallback Strategy:
async function generateWithFallback(text: string): Promise<AudioBuffer> {
  try {
    return await gemini.generateAudio(text);
  } catch (error) {
    if (error === AudioGenerationError.API_QUOTA_EXCEEDED) {
      // Fall back to cached version or pre-recorded
      return await loadCachedAudio(text);
    }
    if (error === AudioGenerationError.API_UNAVAILABLE) {
      // Retry with exponential backoff
      return await retryWithBackoff(() => gemini.generateAudio(text));
    }
    throw error;
  }
}
```

---

## 🔊 Audio Mixing Implementation

### **Web Audio API Architecture**

```typescript
class MeditationAudioMixer {
  private audioContext: AudioContext;
  private segments: AudioBuffer[] = [];
  private masterGainNode: GainNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
  }

  async loadSegment(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  async mixSession(segmentUrls: string[]): Promise<AudioBuffer> {
    // Load all segments
    this.segments = await Promise.all(
      segmentUrls.map(url => this.loadSegment(url))
    );

    // Calculate total duration with transitions
    const totalDuration = this.calculateMixedDuration();

    // Create offline context for mixing
    const offlineContext = new OfflineAudioContext(
      2, // stereo
      totalDuration * this.audioContext.sampleRate,
      this.audioContext.sampleRate
    );

    let currentTime = 0;

    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      const source = offlineContext.createBufferSource();
      source.buffer = segment;

      // Apply crossfade if not first segment
      if (i > 0) {
        const fadeNode = offlineContext.createGain();
        fadeNode.gain.setValueAtTime(0, currentTime);
        fadeNode.gain.linearRampToValueAtTime(1, currentTime + 2); // 2s fade in
        source.connect(fadeNode);
        fadeNode.connect(offlineContext.destination);

        // Fade out previous segment
        // (Implementation of crossfade)
      } else {
        source.connect(offlineContext.destination);
      }

      source.start(currentTime);
      currentTime += segment.duration - 2; // Overlap 2 seconds
    }

    return await offlineContext.startRendering();
  }

  private calculateMixedDuration(): number {
    // Sum of all segments minus overlap time (2s between each)
    const overlap = (this.segments.length - 1) * 2;
    const totalDuration = this.segments.reduce((sum, seg) => sum + seg.duration, 0);
    return totalDuration - overlap;
  }
}
```

### **Crossfade Algorithm**

```
Segment 1: [============] (10 seconds)
Segment 2:           [============] (10 seconds)
              ↑
         Crossfade (2 seconds)

Result: [=============|==|========] (18 seconds total)
        Segment 1    CF  Segment 2

Crossfade:
- Last 2s of Segment 1: Volume 1.0 → 0.0 (linear fade out)
- First 2s of Segment 2: Volume 0.0 → 1.0 (linear fade in)
- Overlap plays simultaneously, creating smooth transition
```

---

## 📦 Supabase Storage Integration

### **Storage Bucket Structure**

```
praylude-audio/
├── segments/
│   ├── welcome-001/
│   │   ├── intro-default.mp3
│   │   ├── body-default.mp3
│   │   └── outro-default.mp3
│   ├── mind-001/
│   │   ├── intro-slow.mp3
│   │   ├── body-slow.mp3
│   │   └── outro-slow.mp3
│   └── ...
├── mixed-sessions/
│   ├── standard-daily-default.mp3
│   ├── custom-{userId}-{sessionId}.mp3
│   └── ...
└── backgrounds/ (Phase 2.5)
    ├── ocean-waves.mp3
    ├── forest-ambience.mp3
    └── ...
```

### **Storage API Integration**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

class AudioStorage {
  async uploadSegment(
    techniqueId: string,
    segmentType: string,
    audio: ArrayBuffer,
    voiceParams: VoiceParameters
  ): Promise<string> {
    const hash = hashVoiceParams(voiceParams);
    const path = `segments/${techniqueId}/${segmentType}-${hash}.mp3`;

    const { data, error } = await supabase.storage
      .from('praylude-audio')
      .upload(path, audio, {
        contentType: 'audio/mpeg',
        cacheControl: '2592000', // 30 days
        upsert: true
      });

    if (error) throw error;

    // Return public URL
    const { data: urlData } = supabase.storage
      .from('praylude-audio')
      .getPublicUrl(path);

    return urlData.publicUrl;
  }

  async getSegmentUrl(
    techniqueId: string,
    segmentType: string,
    voiceParams: VoiceParameters
  ): Promise<string | null> {
    const hash = hashVoiceParams(voiceParams);
    const path = `segments/${techniqueId}/${segmentType}-${hash}.mp3`;

    const { data, error } = await supabase.storage
      .from('praylude-audio')
      .list(`segments/${techniqueId}`);

    if (error || !data) return null;

    const exists = data.find(file => file.name === `${segmentType}-${hash}.mp3`);
    if (!exists) return null;

    const { data: urlData } = supabase.storage
      .from('praylude-audio')
      .getPublicUrl(path);

    return urlData.publicUrl;
  }

  async deleteStaleCached(daysOld: number = 30): Promise<void> {
    // Cleanup job - delete segments not accessed in 30 days
    // (Implementation uses Supabase metadata and access logs)
  }
}
```

---

## 🎛️ Voice Customization

### **User-Selectable Parameters**

```typescript
interface UserVoicePreferences {
  userId: string;
  speed: number; // 0.7 (very slow) - 1.3 (faster)
  voice: 'warm-female' | 'calm-male' | 'neutral';
  pitch: number; // -5 (lower) to +5 (higher)
  emphasis: 'gentle' | 'normal' | 'confident';
}

// Mapping to Gemini parameters
function mapToGeminiParams(prefs: UserVoicePreferences): VoiceParameters {
  return {
    speed: prefs.speed,
    pitch: prefs.pitch * 4, // Map to semitones
    voice: voiceNameMap[prefs.voice],
    language: 'en-US'
  };
}

const voiceNameMap = {
  'warm-female': 'en-US-Neural2-F',
  'calm-male': 'en-US-Neural2-D',
  'neutral': 'en-US-Neural2-C'
};
```

### **Voice Preview System**

```typescript
// Allow users to preview voices before building session
async function generateVoicePreview(
  text: string,
  voicePrefs: UserVoicePreferences
): Promise<string> {
  const previewText = text.substring(0, 200); // First 200 chars
  const params = mapToGeminiParams(voicePrefs);

  // Check preview cache
  const cacheKey = `preview-${hashVoiceParams(params)}-${hash(previewText)}`;
  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  // Generate preview
  const audio = await gemini.generateAudio(previewText, params);
  const url = await audioStorage.uploadPreview(cacheKey, audio);

  return url;
}
```

---

## 🚀 Implementation Phases

### **Phase 2A: Foundation (Week 1)**
- Set up Gemini API credentials
- Build script template system
- Create basic segment architecture
- Implement simple voice generation (single technique)

### **Phase 2B: Audio Mixing (Week 2)**
- Implement audio mixer service
- Add crossfade transitions
- Build session compilation pipeline
- Test with standard meditation

### **Phase 2C: Caching & Optimization (Week 3)**
- Integrate Supabase Storage
- Implement three-tier caching
- Add pregeneration system for popular sessions
- Optimize API usage with batch generation

### **Phase 2D: User Features (Week 4)**
- Add voice customization UI
- Build preview system
- Implement background music (optional)
- Polish and testing

---

## 📊 Success Metrics

**Performance:**
- Session generation time: < 30s for standard (21 min)
- Session generation time: < 60s for custom (up to 40 min)
- Cache hit rate: > 80% for standard meditation
- API costs: < $0.10 per generated session

**Quality:**
- Voice naturalness: User rating > 4/5
- Transition smoothness: No audible gaps or overlaps
- Script quality: Spiritually meaningful, theologically sound

**Reliability:**
- API success rate: > 99%
- Fallback coverage: 100% (all scenarios have graceful degradation)
- Error recovery: Automatic retry with exponential backoff

---

## 🔧 Technical Challenges & Solutions

### **Challenge 1: API Rate Limits**
**Problem**: Gemini API has rate limits (60 req/min, 10k req/day)

**Solution**:
- Implement request queue with rate limiter
- Batch generate segments during low-traffic periods
- Pregenerate popular content
- Cache aggressively

### **Challenge 2: Large Audio File Sizes**
**Problem**: 20-minute meditation = ~30MB audio file

**Solution**:
- Use MP3 compression (not WAV)
- Stream audio instead of full download
- Implement progressive loading (section-by-section)
- Browser cache for repeated sessions

### **Challenge 3: Variable Duration Adaptation**
**Problem**: User selects 5min for "Mind" section, but script is written for 10min

**Solution**:
```typescript
function adaptScriptToDuration(
  script: string,
  targetDuration: number,
  defaultDuration: number
): string {
  if (targetDuration < defaultDuration) {
    // Shorten: Remove optional pauses and descriptive sections
    return removeOptionalSections(script, targetDuration);
  } else {
    // Lengthen: Add more pauses and repetition
    return extendWithPauses(script, targetDuration);
  }
}
```

### **Challenge 4: Audio Sync During Playback**
**Problem**: Progress bar must stay synced with audio across sections

**Solution**:
- Use Web Audio API timeupdate events
- Track section boundaries in metadata
- Implement precise seeking with buffer preloading

---

## 📚 Dependencies

### **NPM Packages**
```json
{
  "@google/generative-ai": "^0.1.0",  // Gemini API SDK
  "@supabase/storage-js": "^2.5.0",   // Supabase Storage
  "web-audio-api": "^1.0.0",          // Polyfill if needed
  "audio-buffer-utils": "^5.1.0",     // Audio manipulation
  "lamejs": "^1.2.1",                 // MP3 encoding if needed
  "hash-wasm": "^4.9.0"               // Fast hashing for cache keys
}
```

### **API Keys Required**
- Google Cloud API Key (Gemini access)
- Supabase Project URL + Anon Key (already configured)
- Supabase Service Role Key (for storage operations)

---

## 🎯 Phase 2 Deliverables

**Code:**
- [ ] Gemini API integration service
- [ ] Script template system
- [ ] Audio segment generator
- [ ] Dynamic audio mixer
- [ ] Supabase Storage integration
- [ ] Updated meditation player (real audio)
- [ ] Voice customization UI
- [ ] Admin pregeneration tools

**Documentation:**
- [ ] API integration guide
- [ ] Script template documentation
- [ ] Caching strategy guide
- [ ] Audio mixing technical spec
- [ ] Voice customization user guide

**Testing:**
- [ ] Unit tests for script compiler
- [ ] Integration tests for Gemini API
- [ ] Audio quality tests
- [ ] Performance benchmarks
- [ ] End-to-end user flow tests

---

## 🚦 Go/No-Go Criteria

**Prerequisites for Phase 2:**
- ✅ Phase 1 complete and tested
- ⏳ Gemini API access granted
- ⏳ Supabase Storage bucket created
- ⏳ Budget allocated for API costs (~$50-100 for testing)

**Success Criteria:**
- All 17 Phase 2 todos completed
- Standard meditation generates in < 30s
- Voice quality meets 4/5 user satisfaction
- Cache hit rate > 80%
- Zero critical bugs
- Full fallback coverage

---

**Phase 2 will transform Praylude from a prototype into a production-ready meditation app with AI-powered personalized guidance. Let's build it! 🚀**
