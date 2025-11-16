# Audio Architecture & Dynamic Mixing
**Building Sacred Soundscapes with Web Audio API**

## 🎵 System Overview

Praylude's audio system transforms individual voice segments into seamless, personalized meditation sessions through dynamic mixing, crossfading, and intelligent caching.

---

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│         (Play/Pause, Progress, Volume Controls)          │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│              SESSION ORCHESTRATOR                        │
│  (Loads session config, requests mixed audio)            │
└───────────────────┬─────────────────────────────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
┌───────▼────────┐      ┌───────▼────────────┐
│  AUDIO MIXER   │      │   CACHE MANAGER    │
│  (Combines     │◄─────┤   (IndexedDB,      │
│   segments)    │      │    Supabase)       │
└───────┬────────┘      └────────────────────┘
        │
┌───────▼──────────────────────────────────────┐
│         WEB AUDIO API PLAYER                 │
│  (AudioContext, SourceNodes, GainNodes)      │
└──────────────────────────────────────────────┘
```

---

## 📦 Audio Segment Types

### **1. Intro Segments**
- **Purpose**: Start of a section, set the tone
- **Duration**: 15-45 seconds
- **Characteristics**: Clear voice, full volume, no fade-in needed
- **Example**: "Welcome to the Mind section..."

### **2. Body Segments**
- **Purpose**: Main content, can be repeated/extended
- **Duration**: 30-180 seconds
- **Characteristics**: Repeatable, modular, smooth transitions
- **Example**: "Imagine your sacred room... notice the details..."

### **3. Outro Segments**
- **Purpose**: Conclude a section, transition to next
- **Duration**: 10-30 seconds
- **Characteristics**: Fade-out ready, natural conclusion
- **Example**: "Your mind is now clear and ready..."

### **4. Transition Segments**
- **Purpose**: Bridge between sections
- **Duration**: 5-15 seconds
- **Characteristics**: Crossfade compatible, seamless
- **Example**: "As you move from body awareness to spiritual presence..."

### **5. Silence Segments**
- **Purpose**: Pauses for contemplation
- **Duration**: Variable (2-60 seconds)
- **Characteristics**: Pure silence, no audio data needed
- **Example**: {pause:10} in scripts

---

## 🎚️ Dynamic Mixing Algorithm

### **Mixing Pipeline**

```typescript
// lib/audio/mixer.ts

interface MixConfig {
  segments: AudioSegmentReference[];
  crossfadeDuration: number; // seconds
  masterVolume: number; // 0.0 - 1.0
  backgroundMusic?: AudioSegmentReference;
}

interface AudioSegmentReference {
  url: string;
  startTime: number; // When to start in the mix
  duration: number;
  volume: number; // Segment-specific volume
  type: SegmentType;
}

export class AudioMixer {
  private audioContext: AudioContext;
  private loadedBuffers: Map<string, AudioBuffer> = new Map();

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      latencyHint: 'playback',
      sampleRate: 48000
    });
  }

  /**
   * Mix a complete meditation session from segment URLs
   */
  async mixSession(config: MixConfig): Promise<MixedSession> {
    console.log(`Mixing ${config.segments.length} segments...`);

    // 1. Load all audio buffers
    await this.loadSegments(config.segments);

    // 2. Calculate total duration
    const totalDuration = this.calculateMixedDuration(config);

    // 3. Create offline audio context for mixing
    const offlineContext = new OfflineAudioContext({
      numberOfChannels: 2, // Stereo
      length: totalDuration * this.audioContext.sampleRate,
      sampleRate: this.audioContext.sampleRate
    });

    // 4. Create master gain node
    const masterGain = offlineContext.createGain();
    masterGain.gain.value = config.masterVolume;
    masterGain.connect(offlineContext.destination);

    // 5. Mix segments with crossfades
    let currentTime = 0;
    const segmentMetadata: SegmentTimestamp[] = [];

    for (let i = 0; i < config.segments.length; i++) {
      const segment = config.segments[i];
      const buffer = this.loadedBuffers.get(segment.url);

      if (!buffer) {
        console.warn(`Segment not loaded: ${segment.url}`);
        continue;
      }

      // Create source node
      const source = offlineContext.createBufferSource();
      source.buffer = buffer;

      // Create segment gain node
      const segmentGain = offlineContext.createGain();
      segmentGain.gain.value = segment.volume;

      // Apply crossfade
      if (i > 0) {
        this.applyCrossfade(
          offlineContext,
          segmentGain,
          currentTime,
          config.crossfadeDuration
        );
      }

      // Connect: source → segmentGain → masterGain → destination
      source.connect(segmentGain);
      segmentGain.connect(masterGain);

      // Schedule playback
      source.start(currentTime);

      // Track segment timing for player progress
      segmentMetadata.push({
        segmentId: segment.url,
        startTime: currentTime,
        duration: buffer.duration,
        type: segment.type
      });

      // Advance time (overlap for crossfade)
      currentTime += buffer.duration - (i < config.segments.length - 1 ? config.crossfadeDuration : 0);
    }

    // 6. Add background music if specified
    if (config.backgroundMusic) {
      await this.mixBackgroundMusic(offlineContext, config.backgroundMusic, totalDuration);
    }

    // 7. Render to audio buffer
    console.log('Rendering mixed audio...');
    const mixedBuffer = await offlineContext.startRendering();

    // 8. Convert to playable format
    const audioBlob = await this.bufferToBlob(mixedBuffer);
    const audioUrl = URL.createObjectURL(audioBlob);

    return {
      audioUrl,
      duration: totalDuration,
      segmentTimestamps: segmentMetadata,
      sampleRate: this.audioContext.sampleRate
    };
  }

  /**
   * Apply crossfade between segments
   */
  private applyCrossfade(
    context: OfflineAudioContext,
    gainNode: GainNode,
    startTime: number,
    fadeDuration: number
  ): void {
    const fadeIn = gainNode.gain;

    // Fade in from 0 to 1 over fadeDuration
    fadeIn.setValueAtTime(0, startTime);
    fadeIn.linearRampToValueAtTime(1, startTime + fadeDuration);

    // Note: Fade out of previous segment is handled by that segment's gain node
  }

  /**
   * Mix background music/ambience at lower volume
   */
  private async mixBackgroundMusic(
    context: OfflineAudioContext,
    musicRef: AudioSegmentReference,
    totalDuration: number
  ): Promise<void> {
    const buffer = this.loadedBuffers.get(musicRef.url);
    if (!buffer) return;

    // Create looping source for background music
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Low volume for background
    const gain = context.createGain();
    gain.gain.value = 0.15; // 15% volume

    source.connect(gain);
    gain.connect(context.destination);

    source.start(0);
    source.stop(totalDuration);
  }

  /**
   * Load all segment buffers
   */
  private async loadSegments(segments: AudioSegmentReference[]): Promise<void> {
    const urls = [...new Set(segments.map(s => s.url))];

    const promises = urls.map(async url => {
      if (this.loadedBuffers.has(url)) return;

      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.loadedBuffers.set(url, audioBuffer);
    });

    await Promise.all(promises);
  }

  /**
   * Calculate total mixed duration accounting for crossfades
   */
  private calculateMixedDuration(config: MixConfig): number {
    if (config.segments.length === 0) return 0;

    let duration = 0;
    for (let i = 0; i < config.segments.length; i++) {
      const buffer = this.loadedBuffers.get(config.segments[i].url);
      if (!buffer) continue;

      duration += buffer.duration;

      // Subtract crossfade overlap (except for last segment)
      if (i < config.segments.length - 1) {
        duration -= config.crossfadeDuration;
      }
    }

    return duration;
  }

  /**
   * Convert AudioBuffer to Blob for streaming
   */
  private async bufferToBlob(buffer: AudioBuffer): Promise<Blob> {
    // Use AudioWorklet or ScriptProcessor to encode to MP3/WAV
    // For simplicity, convert to WAV (no compression)

    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    // Write WAV header
    this.writeWavHeader(view, buffer);

    // Write audio data
    const offset = 44;
    const channels = [];
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    let pos = 0;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(offset + pos, sample * 0x7FFF, true);
        pos += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  private writeWavHeader(view: DataView, buffer: AudioBuffer): void {
    const sampleRate = buffer.sampleRate;
    const numChannels = buffer.numberOfChannels;

    // "RIFF" chunk descriptor
    view.setUint32(0, 0x46464952, true); // "RIFF"
    view.setUint32(4, 36 + buffer.length * numChannels * 2, true);
    view.setUint32(8, 0x45564157, true); // "WAVE"

    // "fmt " sub-chunk
    view.setUint32(12, 0x20746d66, true); // "fmt "
    view.setUint32(16, 16, true); // Subchunk size
    view.setUint16(20, 1, true); // Audio format (1 = PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true); // Byte rate
    view.setUint16(32, numChannels * 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample

    // "data" sub-chunk
    view.setUint32(36, 0x61746164, true); // "data"
    view.setUint32(40, buffer.length * numChannels * 2, true);
  }
}

interface MixedSession {
  audioUrl: string; // Object URL or Blob URL
  duration: number;
  segmentTimestamps: SegmentTimestamp[];
  sampleRate: number;
}

interface SegmentTimestamp {
  segmentId: string;
  startTime: number;
  duration: number;
  type: SegmentType;
}
```

---

## 🎵 Crossfade Implementation

### **Linear Crossfade (Simple)**

```
Segment A: [========>]     (Volume: 1.0 → 0.0)
Segment B:     [<========]  (Volume: 0.0 → 1.0)
           ─────┬─────
              2 seconds

Timeline:
  T+0s: A=1.0, B=0.0
  T+1s: A=0.5, B=0.5
  T+2s: A=0.0, B=1.0
```

### **Equal-Power Crossfade (Better)**

```typescript
/**
 * Equal-power crossfade for smoother transitions
 * Maintains constant perceived volume during fade
 */
function applyEqualPowerCrossfade(
  context: AudioContext,
  fadeOutGain: GainNode,
  fadeInGain: GainNode,
  startTime: number,
  duration: number
): void {
  const steps = 100;
  const timeStep = duration / steps;

  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    const time = startTime + (i * timeStep);

    // Equal-power curve: sqrt(cos) and sqrt(sin)
    const fadeOutValue = Math.sqrt(Math.cos(fraction * Math.PI / 2));
    const fadeInValue = Math.sqrt(Math.sin(fraction * Math.PI / 2));

    fadeOutGain.gain.setValueAtTime(fadeOutValue, time);
    fadeInGain.gain.setValueAtTime(fadeInValue, time);
  }
}
```

### **Crossfade Curves Comparison**

```
Linear Crossfade (perceivable dip in middle):
  Volume
  1.0 │\      /
      │ \    /
  0.5 │  \  /  ← Perceptible volume dip
      │   \/
  0.0 └────────> Time

Equal-Power Crossfade (constant perceived volume):
  Volume
  1.0 │\──────/
      │ \    /
  0.5 │  \  /   ← Smooth transition, no dip
      │   \/
  0.0 └────────> Time
```

---

## 🎛️ Real-Time Playback

### **Session Player**

```typescript
// lib/audio/player.ts

export class SessionPlayer {
  private audioContext: AudioContext;
  private currentSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode;
  private startedAt: number = 0;
  private pausedAt: number = 0;
  private isPlaying: boolean = false;

  private mixedAudio: AudioBuffer | null = null;
  private segmentTimestamps: SegmentTimestamp[] = [];

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  /**
   * Load a mixed session
   */
  async loadSession(mixedSession: MixedSession): Promise<void> {
    const response = await fetch(mixedSession.audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    this.mixedAudio = await this.audioContext.decodeAudioData(arrayBuffer);
    this.segmentTimestamps = mixedSession.segmentTimestamps;
  }

  /**
   * Play the session
   */
  play(): void {
    if (!this.mixedAudio) {
      throw new Error('No session loaded');
    }

    if (this.isPlaying) return;

    this.currentSource = this.audioContext.createBufferSource();
    this.currentSource.buffer = this.mixedAudio;
    this.currentSource.connect(this.gainNode);

    const offset = this.pausedAt;
    this.currentSource.start(0, offset);
    this.startedAt = this.audioContext.currentTime - offset;
    this.isPlaying = true;

    // Track end of playback
    this.currentSource.onended = () => {
      if (this.isPlaying) {
        this.onSessionComplete?.();
      }
    };
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.isPlaying || !this.currentSource) return;

    this.pausedAt = this.audioContext.currentTime - this.startedAt;
    this.currentSource.stop();
    this.currentSource = null;
    this.isPlaying = false;
  }

  /**
   * Seek to a specific time
   */
  seek(time: number): void {
    const wasPlaying = this.isPlaying;

    if (this.isPlaying) {
      this.pause();
    }

    this.pausedAt = time;

    if (wasPlaying) {
      this.play();
    }
  }

  /**
   * Get current playback time
   */
  getCurrentTime(): number {
    if (this.isPlaying) {
      return this.audioContext.currentTime - this.startedAt;
    }
    return this.pausedAt;
  }

  /**
   * Get current section info
   */
  getCurrentSection(): SegmentTimestamp | null {
    const currentTime = this.getCurrentTime();

    for (let i = this.segmentTimestamps.length - 1; i >= 0; i--) {
      const segment = this.segmentTimestamps[i];
      if (currentTime >= segment.startTime) {
        return segment;
      }
    }

    return null;
  }

  /**
   * Set volume (0.0 - 1.0)
   */
  setVolume(volume: number): void {
    this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
  }

  /**
   * Callback when session completes
   */
  onSessionComplete?: () => void;

  /**
   * Cleanup
   */
  dispose(): void {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource.disconnect();
    }
    this.gainNode.disconnect();
  }
}
```

---

## 💾 Caching Strategy

### **Three-Tier Cache Architecture**

```typescript
// lib/audio/cache.ts

export class AudioCacheManager {
  private memoryCache: Map<string, AudioBuffer> = new Map();
  private readonly MEMORY_CACHE_SIZE = 10; // segments
  private readonly IDB_DB_NAME = 'praylude-audio-cache';
  private readonly SUPABASE_BUCKET = 'praylude-audio';

  /**
   * Get audio from cache (memory → IndexedDB → Supabase → API)
   */
  async getAudio(segmentId: string): Promise<AudioBuffer> {
    // 1. Check memory cache (fastest)
    if (this.memoryCache.has(segmentId)) {
      console.log(`[Cache] Memory hit: ${segmentId}`);
      return this.memoryCache.get(segmentId)!;
    }

    // 2. Check IndexedDB (fast, local)
    const idbBuffer = await this.getFromIndexedDB(segmentId);
    if (idbBuffer) {
      console.log(`[Cache] IndexedDB hit: ${segmentId}`);
      this.addToMemoryCache(segmentId, idbBuffer);
      return idbBuffer;
    }

    // 3. Check Supabase Storage (network, shared)
    const supabaseUrl = await this.getSupabaseUrl(segmentId);
    if (supabaseUrl) {
      console.log(`[Cache] Supabase hit: ${segmentId}`);
      const buffer = await this.fetchAndDecode(supabaseUrl);
      await this.saveToIndexedDB(segmentId, buffer);
      this.addToMemoryCache(segmentId, buffer);
      return buffer;
    }

    // 4. Generate via API (slowest, last resort)
    console.log(`[Cache] Cache miss, generating: ${segmentId}`);
    const buffer = await this.generateSegment(segmentId);
    await this.saveToSupabase(segmentId, buffer);
    await this.saveToIndexedDB(segmentId, buffer);
    this.addToMemoryCache(segmentId, buffer);
    return buffer;
  }

  /**
   * Memory cache with LRU eviction
   */
  private addToMemoryCache(id: string, buffer: AudioBuffer): void {
    if (this.memoryCache.size >= this.MEMORY_CACHE_SIZE) {
      // Remove oldest entry
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
    this.memoryCache.set(id, buffer);
  }

  /**
   * IndexedDB operations
   */
  private async getFromIndexedDB(id: string): Promise<AudioBuffer | null> {
    const db = await this.openDB();
    const transaction = db.transaction(['audio'], 'readonly');
    const store = transaction.objectStore('audio');
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = async () => {
        if (request.result) {
          const arrayBuffer = request.result.data;
          const audioContext = new AudioContext();
          const buffer = await audioContext.decodeAudioData(arrayBuffer);
          resolve(buffer);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async saveToIndexedDB(id: string, buffer: AudioBuffer): Promise<void> {
    // Convert buffer to ArrayBuffer for storage
    const arrayBuffer = await this.encodeBuffer(buffer);

    const db = await this.openDB();
    const transaction = db.transaction(['audio'], 'readwrite');
    const store = transaction.objectStore('audio');

    store.put({
      id,
      data: arrayBuffer,
      timestamp: Date.now(),
      size: arrayBuffer.byteLength
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Open IndexedDB
   */
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.IDB_DB_NAME, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('audio')) {
          const store = db.createObjectStore('audio', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Supabase Storage operations
   */
  private async getSupabaseUrl(segmentId: string): Promise<string | null> {
    const { data } = await supabase.storage
      .from(this.SUPABASE_BUCKET)
      .list(`segments/${segmentId}`);

    if (data && data.length > 0) {
      const { data: urlData } = supabase.storage
        .from(this.SUPABASE_BUCKET)
        .getPublicUrl(`segments/${segmentId}/${data[0].name}`);

      return urlData.publicUrl;
    }

    return null;
  }

  /**
   * Cache cleanup (called periodically)
   */
  async cleanup(): Promise<void> {
    const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const db = await this.openDB();
    const transaction = db.transaction(['audio'], 'readwrite');
    const store = transaction.objectStore('audio');
    const index = store.index('timestamp');

    const request = index.openCursor();

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const age = now - cursor.value.timestamp;
        if (age > WEEK_IN_MS) {
          cursor.delete(); // Delete old entries
        }
        cursor.continue();
      }
    };
  }
}
```

---

## 📊 Performance Metrics

### **Benchmarks (Target)**

```typescript
interface PerformanceTargets {
  segmentLoading: {
    memory: '<10ms',
    indexedDB: '<50ms',
    supabase: '<500ms',
    generation: '<3000ms'
  };

  sessionMixing: {
    '6 segments': '<2s',
    '12 segments (long session)': '<5s'
  };

  playbackLatency: {
    play: '<100ms',
    pause: '<10ms',
    seek: '<200ms'
  };

  cacheHitRate: {
    memory: '>60%',
    indexedDB: '>80%',
    supabase: '>95%'
  };
}
```

---

**This audio architecture transforms Praylude from a timer app into an actual meditation experience - where every transition is smooth, every pause is intentional, and every session feels personally crafted. Sacred technology at its finest. 🎵**
