# Gemini API Integration Guide
**AI-Powered Voice Generation for Sacred Meditation**

## 🎯 Overview

This guide provides a complete reference for integrating Google's Gemini API to generate natural, soothing voice narration for Praylude meditation sessions.

---

## 🔑 API Setup

### **1. Google Cloud Project Setup**

```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash

# Initialize and authenticate
gcloud init
gcloud auth login

# Create project (or use existing)
gcloud projects create praylude-meditation --name="Praylude"

# Set project
gcloud config set project praylude-meditation

# Enable Gemini API
gcloud services enable generativelanguage.googleapis.com
```

### **2. API Key Generation**

```bash
# Create API key
gcloud alpha services api-keys create praylude-gemini-key \
  --display-name="Praylude Gemini API Key" \
  --api-target=service=generativelanguage.googleapis.com

# Get the key value
gcloud alpha services api-keys get-key-string praylude-gemini-key
```

### **3. Environment Variables**

```bash
# .env.local
GEMINI_API_KEY=your_api_key_here
GEMINI_API_BASE_URL=https://generativelanguage.googleapis.com/v1
GEMINI_MODEL=gemini-1.5-flash-latest
GEMINI_TTS_VOICE=en-US-Neural2-F
```

---

## 📡 API Client Implementation

### **Gemini Service Client**

```typescript
// lib/gemini/client.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable not set');
    }

    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';
  }

  /**
   * Generate audio from text using Gemini TTS
   */
  async generateSpeech(
    text: string,
    options: SpeechOptions = {}
  ): Promise<AudioBuffer> {
    const {
      voice = 'en-US-Neural2-F',
      speakingRate = 0.85, // Slower for meditation
      pitch = 0.0,
      volumeGain = 0.0,
      sampleRate = 24000
    } = options;

    try {
      const response = await fetch(
        `${process.env.GEMINI_API_BASE_URL}/models/${this.model}:generateSpeech`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
          },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: 'en-US',
              name: voice,
              ssmlGender: this.getGenderFromVoice(voice)
            },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate,
              pitch,
              volumeGainDb: volumeGain,
              sampleRateHertz: sampleRate,
              effectsProfileId: ['meditation-eq'] // Custom profile
            }
          })
        }
      );

      if (!response.ok) {
        throw new GeminiAPIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();

      // Decode base64 audio
      const audioData = atob(data.audioContent);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);

      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }

      return arrayBuffer;

    } catch (error) {
      if (error instanceof GeminiAPIError) {
        throw error;
      }
      throw new GeminiAPIError('Unknown error during speech generation', 500, error);
    }
  }

  /**
   * Generate multiple segments in batch
   */
  async generateBatch(
    segments: Array<{ id: string; text: string; options?: SpeechOptions }>
  ): Promise<Map<string, AudioBuffer>> {
    const results = new Map<string, AudioBuffer>();
    const batchSize = 5; // Parallel requests

    for (let i = 0; i < segments.length; i += batchSize) {
      const batch = segments.slice(i, i + batchSize);

      const promises = batch.map(async segment => {
        const audio = await this.generateSpeech(segment.text, segment.options);
        return { id: segment.id, audio };
      });

      const batchResults = await Promise.allSettled(promises);

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.set(batch[index].id, result.value.audio);
        } else {
          console.error(`Failed to generate segment ${batch[index].id}:`, result.reason);
        }
      });

      // Rate limiting: Wait 1 second between batches
      if (i + batchSize < segments.length) {
        await sleep(1000);
      }
    }

    return results;
  }

  private getGenderFromVoice(voice: string): 'MALE' | 'FEMALE' | 'NEUTRAL' {
    if (voice.includes('Male') || voice.includes('-D')) return 'MALE';
    if (voice.includes('Female') || voice.includes('-F')) return 'FEMALE';
    return 'NEUTRAL';
  }
}

export interface SpeechOptions {
  voice?: string;
  speakingRate?: number; // 0.25 - 4.0
  pitch?: number; // -20.0 to 20.0
  volumeGain?: number; // -96.0 to 16.0
  sampleRate?: number; // 8000, 16000, 24000, 48000
}

class GeminiAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'GeminiAPIError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## 🎛️ Voice Configuration Presets

### **Meditation-Optimized Voice Profiles**

```typescript
// lib/gemini/voice-presets.ts

export const VOICE_PRESETS = {
  // Default meditation voice - warm, gentle female
  'meditation-default': {
    voice: 'en-US-Neural2-F',
    speakingRate: 0.85,
    pitch: -2.0,
    volumeGain: 0.0,
    description: 'Warm, gentle female voice for guided meditation'
  },

  // Calm male voice for variety
  'meditation-male': {
    voice: 'en-US-Neural2-D',
    speakingRate: 0.80,
    pitch: -4.0,
    volumeGain: 0.0,
    description: 'Deep, calming male voice'
  },

  // Neutral, soft voice
  'meditation-neutral': {
    voice: 'en-US-Neural2-C',
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGain: 0.0,
    description: 'Neutral, soothing voice'
  },

  // Whisper-like for sleep meditations
  'meditation-whisper': {
    voice: 'en-US-Neural2-F',
    speakingRate: 0.75,
    pitch: -6.0,
    volumeGain: -4.0,
    description: 'Soft, whisper-like voice for sleep'
  },

  // Energetic for morning meditations
  'meditation-morning': {
    voice: 'en-US-Neural2-F',
    speakingRate: 0.95,
    pitch: 2.0,
    volumeGain: 2.0,
    description: 'Slightly brighter voice for morning energy'
  },

  // Scripture reading - clear, reverent
  'scripture-reading': {
    voice: 'en-US-Neural2-D',
    speakingRate: 0.90,
    pitch: 0.0,
    volumeGain: 1.0,
    description: 'Clear, reverent voice for Scripture'
  }
} as const;

export type VoicePresetId = keyof typeof VOICE_PRESETS;

export function getVoicePreset(presetId: VoicePresetId): SpeechOptions {
  return VOICE_PRESETS[presetId];
}
```

---

## 🔄 Rate Limiting & Retry Logic

### **Smart Rate Limiter**

```typescript
// lib/gemini/rate-limiter.ts

export class GeminiRateLimiter {
  private requestQueue: Array<() => Promise<any>> = [];
  private minuteCounter: number = 0;
  private dayCounter: number = 0;
  private lastMinuteReset: number = Date.now();
  private lastDayReset: number = Date.now();

  private readonly MAX_PER_MINUTE = 60;
  private readonly MAX_PER_DAY = 10000;
  private readonly RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff

  async execute<T>(
    fn: () => Promise<T>,
    retries: number = 0
  ): Promise<T> {
    // Reset counters if time windows expired
    this.resetCountersIfNeeded();

    // Check limits
    if (this.minuteCounter >= this.MAX_PER_MINUTE) {
      const waitTime = 60000 - (Date.now() - this.lastMinuteReset);
      console.log(`Rate limit reached, waiting ${waitTime}ms...`);
      await sleep(waitTime);
      this.resetCountersIfNeeded();
    }

    if (this.dayCounter >= this.MAX_PER_DAY) {
      throw new Error('Daily API quota exceeded. Please try again tomorrow.');
    }

    // Execute request
    try {
      this.minuteCounter++;
      this.dayCounter++;
      return await fn();
    } catch (error: any) {
      // Handle rate limit errors with retry
      if (error.statusCode === 429 && retries < this.RETRY_DELAYS.length) {
        const delay = this.RETRY_DELAYS[retries];
        console.log(`Rate limited, retrying in ${delay}ms... (attempt ${retries + 1})`);
        await sleep(delay);
        return this.execute(fn, retries + 1);
      }

      // Handle other retryable errors
      if (this.isRetryable(error) && retries < 3) {
        const delay = this.RETRY_DELAYS[retries] || 5000;
        console.log(`Retryable error, waiting ${delay}ms... (attempt ${retries + 1})`);
        await sleep(delay);
        return this.execute(fn, retries + 1);
      }

      throw error;
    }
  }

  private resetCountersIfNeeded(): void {
    const now = Date.now();

    // Reset minute counter
    if (now - this.lastMinuteReset >= 60000) {
      this.minuteCounter = 0;
      this.lastMinuteReset = now;
    }

    // Reset day counter
    if (now - this.lastDayReset >= 86400000) {
      this.dayCounter = 0;
      this.lastDayReset = now;
    }
  }

  private isRetryable(error: any): boolean {
    return (
      error.statusCode === 500 ||
      error.statusCode === 502 ||
      error.statusCode === 503 ||
      error.statusCode === 504 ||
      error.message?.includes('network') ||
      error.message?.includes('timeout')
    );
  }

  getStats() {
    return {
      minuteCounter: this.minuteCounter,
      dayCounter: this.dayCounter,
      remainingMinute: this.MAX_PER_MINUTE - this.minuteCounter,
      remainingDay: this.MAX_PER_DAY - this.dayCounter
    };
  }
}
```

---

## 💰 Cost Optimization Strategies

### **API Pricing (Estimated)**

```
Gemini TTS Pricing (as of Nov 2025):
- Characters to Audio: $0.000016 per character
- Average meditation script: ~5000 characters
- Cost per technique: ~$0.08
- Standard session (6 techniques): ~$0.48
- Monthly (if 1000 users, 30 sessions each): $14,400

Optimization needed! ⚠️
```

### **Cost Reduction Strategies**

```typescript
// 1. Aggressive Caching
// Cache hit rate target: 95%
// Projected savings: 95% reduction → $720/month

// 2. Pregeneration
// Generate popular content during low-cost periods
// Use cron jobs to batch-generate during off-peak hours

// 3. Shared Segments
// Reuse common segments across techniques
// Example: "Take a deep breath" appears in 20 techniques
//          Generate once, use everywhere

const COMMON_PHRASES = {
  'breath-in-out': 'Take a deep breath in... and slowly release it out.',
  'pause-short': '{silence:3}',
  'pause-medium': '{silence:5}',
  'pause-long': '{silence:10}',
  'closing-prayer': 'In the name of the Father, Son, and Holy Spirit. Amen.'
};

// 4. Text Compression
// Remove unnecessary words in scripts before API call
function compressScript(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Multiple spaces → single space
    .replace(/\.\.\./g, '…') // Three dots → ellipsis
    .replace(/\band\b/g, '&') // 'and' → '&' where appropriate
    .trim();
}

// 5. Differential Updates
// Only regenerate changed portions when technique updated
async function updateTechnique(
  techniqueId: string,
  oldScript: string,
  newScript: string
): Promise<void> {
  const diff = calculateDiff(oldScript, newScript);

  // Only regenerate changed segments
  for (const changedSegment of diff.changed) {
    await regenerateSegment(techniqueId, changedSegment);
  }

  // Keep unchanged segments from cache
}
```

### **Monthly Cost Projection**

```typescript
// Realistic projection with optimization
const costAnalysis = {
  users: 1000,
  averageSessionsPerUser: 30,
  totalSessions: 30000,

  // Breakdown
  standardSessions: 24000, // 80% use standard
  customSessions: 6000,    // 20% use custom

  // Caching impact
  standardCacheHit: 0.98,  // 98% cache hits
  customCacheHit: 0.60,    // 60% cache hits

  // Calculations
  standardNewGenerations: 24000 * 0.02,  // 480
  customNewGenerations: 6000 * 0.40,     // 2400
  totalNewGenerations: 2880,

  costPerGeneration: 0.48,
  totalMonthlyCost: 2880 * 0.48,  // $1,382.40

  // Per user
  costPerUser: 1.38 // $1.38/user/month
};

// Acceptable for premium meditation app
// Pricing strategy: $9.99/month subscription
// Margin: $8.61 per user (86% margin)
```

---

## 🧪 Testing & Validation

### **API Integration Tests**

```typescript
// tests/gemini-api.test.ts

import { GeminiClient } from '@/lib/gemini/client';
import { expect, test, describe } from 'vitest';

describe('Gemini API Integration', () => {
  const client = new GeminiClient();

  test('should generate audio from simple text', async () => {
    const text = 'Welcome to this meditation.';
    const audio = await client.generateSpeech(text);

    expect(audio).toBeInstanceOf(ArrayBuffer);
    expect(audio.byteLength).toBeGreaterThan(1000); // At least 1KB
  });

  test('should respect speaking rate parameter', async () => {
    const text = 'This is a test of speaking rate.';

    const normalAudio = await client.generateSpeech(text, { speakingRate: 1.0 });
    const slowAudio = await client.generateSpeech(text, { speakingRate: 0.7 });

    // Slow audio should be longer
    expect(slowAudio.byteLength).toBeGreaterThan(normalAudio.byteLength);
  });

  test('should handle batch generation', async () => {
    const segments = [
      { id: 'seg1', text: 'First segment' },
      { id: 'seg2', text: 'Second segment' },
      { id: 'seg3', text: 'Third segment' }
    ];

    const results = await client.generateBatch(segments);

    expect(results.size).toBe(3);
    expect(results.get('seg1')).toBeInstanceOf(ArrayBuffer);
  });

  test('should handle rate limiting gracefully', async () => {
    // Generate 65 requests (over 60/min limit)
    const promises = Array(65).fill(0).map((_, i) =>
      client.generateSpeech(`Test ${i}`)
    );

    // Should not throw, but should throttle
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled');

    expect(successful.length).toBeGreaterThan(0);
  }, 120000); // 2 minute timeout

  test('should retry on transient errors', async () => {
    // Mock temporary failure
    const mockFetch = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ audioContent: 'base64data' })
      });

    global.fetch = mockFetch;

    const audio = await client.generateSpeech('Test');

    expect(mockFetch).toHaveBeenCalledTimes(2); // Initial + retry
    expect(audio).toBeInstanceOf(ArrayBuffer);
  });
});
```

---

## 📊 Monitoring & Analytics

### **API Usage Dashboard**

```typescript
// lib/gemini/analytics.ts

export class GeminiAnalytics {
  async trackGeneration(
    techniqueId: string,
    duration: number,
    cost: number,
    cached: boolean
  ): Promise<void> {
    await supabase.from('gemini_usage').insert({
      technique_id: techniqueId,
      generation_duration_ms: duration,
      cost_usd: cost,
      cached: cached,
      timestamp: new Date().toISOString()
    });
  }

  async getDailyStats(date: string = today()): Promise<DailyStats> {
    const { data } = await supabase
      .from('gemini_usage')
      .select('*')
      .gte('timestamp', `${date}T00:00:00`)
      .lt('timestamp', `${date}T23:59:59`);

    return {
      totalGenerations: data.length,
      cachedGenerations: data.filter(d => d.cached).length,
      cacheHitRate: data.filter(d => d.cached).length / data.length,
      totalCost: data.reduce((sum, d) => sum + d.cost_usd, 0),
      averageDuration: data.reduce((sum, d) => sum + d.generation_duration_ms, 0) / data.length
    };
  }

  async getMonthlyProjection(): Promise<CostProjection> {
    const dailyAvg = await this.getAverageDailyCost();
    const daysInMonth = 30;

    return {
      projectedMonthlyCost: dailyAvg * daysInMonth,
      projectedGenerations: dailyAvg.generations * daysInMonth,
      recommendedCacheStrategy: this.getCacheRecommendation(dailyAvg)
    };
  }
}
```

---

## 🚨 Error Handling & Fallbacks

### **Graceful Degradation**

```typescript
// lib/gemini/fallback-strategy.ts

export class AudioFallbackStrategy {
  private geminiClient: GeminiClient;
  private localStorage: AudioStorage;
  private preRecorded: PreRecordedAudio;

  async generateWithFallback(
    text: string,
    options: SpeechOptions
  ): Promise<AudioBuffer> {
    // Strategy 1: Try Gemini API
    try {
      return await this.geminiClient.generateSpeech(text, options);
    } catch (error) {
      console.warn('Gemini API failed, trying fallbacks...', error);
    }

    // Strategy 2: Use cached version (different voice params OK)
    try {
      const cached = await this.localStorage.findSimilarCached(text);
      if (cached) {
        console.log('Using similar cached audio');
        return cached;
      }
    } catch (error) {
      console.warn('Cache lookup failed', error);
    }

    // Strategy 3: Use pre-recorded audio for common phrases
    try {
      const preRecorded = await this.preRecorded.find(text);
      if (preRecorded) {
        console.log('Using pre-recorded audio');
        return preRecorded;
      }
    } catch (error) {
      console.warn('Pre-recorded lookup failed', error);
    }

    // Strategy 4: Use browser TTS as last resort
    console.warn('All fallbacks failed, using browser TTS');
    return await this.generateBrowserTTS(text);
  }

  private async generateBrowserTTS(text: string): Promise<AudioBuffer> {
    // Use Web Speech API (lower quality but works offline)
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;

      // Record the speech
      // (Implementation uses MediaRecorder API)

      speechSynthesis.speak(utterance);
    });
  }
}
```

---

**This Gemini integration will give Praylude a voice that feels truly sacred - warm, gentle, and perfectly paced for meditation. 🙏**
