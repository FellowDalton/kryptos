# Meditation Script Template System
**From Technique to Sacred Narration**

## 🎯 Overview

The Script Template System transforms Praylude's meditation techniques into natural, spiritually meaningful voice narration. This system handles variable durations, personalization, and maintains theological authenticity.

---

## 📝 Template Structure

### **Base Template Format**

```typescript
interface ScriptTemplate {
  techniqueId: string;
  sectionName: SectionName;
  difficulty: Difficulty;
  metadata: {
    scriptureReferences?: string[];
    themes?: string[];
    author?: string;
    version: string;
  };
  segments: TemplateSegment[];
}

interface TemplateSegment {
  id: string;
  type: 'intro' | 'body' | 'transition' | 'outro' | 'optional';
  required: boolean;
  minDuration: number; // seconds
  maxDuration: number;
  priority: number; // 1 (highest) - 5 (lowest) for duration adaptation
  text: string; // With variable placeholders
  variables: VariableDefinition[];
  audioHints?: AudioHint[];
}

interface VariableDefinition {
  name: string;
  type: 'string' | 'number' | 'scripture' | 'pause';
  default?: any;
  required: boolean;
}

interface AudioHint {
  type: 'pause' | 'emphasis' | 'speed' | 'tone';
  value: any;
  position: number; // Character offset in text
}
```

---

## 📖 Example Templates

### **1. Welcome Section - Simple Welcome**

```typescript
const simpleWelcome: ScriptTemplate = {
  techniqueId: 'welcome-001',
  sectionName: 'welcome',
  difficulty: 'beginner',
  metadata: {
    themes: ['greeting', 'invitation', 'preparation'],
    version: '1.0.0'
  },
  segments: [
    {
      id: 'welcome-intro',
      type: 'intro',
      required: true,
      minDuration: 15,
      maxDuration: 45,
      priority: 1,
      text: `Welcome {userName} to this sacred time set apart for you and God.
             {pause:2}
             Find a comfortable position where you can relax completely.
             {pause:3}
             Whether you're sitting, lying down, or in your favorite meditation posture,
             allow your body to settle.
             {pause:2}`,
      variables: [
        { name: 'userName', type: 'string', default: '', required: false }
      ],
      audioHints: [
        { type: 'tone', value: 'warm', position: 0 },
        { type: 'pause', value: 2, position: 20 },
        { type: 'speed', value: 0.85, position: 0 }
      ]
    },
    {
      id: 'welcome-breath',
      type: 'body',
      required: true,
      minDuration: 20,
      maxDuration: 60,
      priority: 2,
      text: `Let's begin by taking three deep, cleansing breaths together.
             {pause:2}
             Breathe in slowly through your nose...
             {pause:4}
             Hold it gently at the top...
             {pause:2}
             And slowly release through your mouth.
             {pause:4}
             Again, breathe in...
             {pause:4}
             Hold...
             {pause:2}
             And release.
             {pause:4}
             One more time, deep breath in...
             {pause:4}
             And let it all go.
             {pause:3}`,
      variables: [],
      audioHints: [
        { type: 'pace', value: 'slow', position: 0 },
        { type: 'emphasis', value: 'gentle', position: 0 }
      ]
    },
    {
      id: 'welcome-transition',
      type: 'outro',
      required: true,
      minDuration: 10,
      maxDuration: 30,
      priority: 3,
      text: `You are now ready to enter the secret place.
             {pause:2}
             The place where your Father sees you and delights in you.
             {pause:3}`,
      variables: [],
      audioHints: []
    }
  ]
};
```

### **2. Mind Section - Sacred Room Visualization**

```typescript
const sacredRoom: ScriptTemplate = {
  techniqueId: 'mind-001',
  sectionName: 'mind',
  difficulty: 'beginner',
  metadata: {
    scriptureReferences: ['Matthew 6:6'],
    themes: ['imagination', 'visualization', 'release'],
    version: '1.0.0'
  },
  segments: [
    {
      id: 'mind-intro',
      type: 'intro',
      required: true,
      minDuration: 30,
      maxDuration: 90,
      priority: 1,
      text: `In your mind's eye, imagine a door in front of you.
             {pause:3}
             This is the door to your secret place.
             The sacred room where you meet with God.
             {pause:5}
             Notice the details of this door.
             Is it wooden? Ornate? Simple?
             What does the handle look like?
             {pause:5}
             This is your room. A place prepared just for you.
             {pause:3}`,
      variables: [],
      audioHints: [
        { type: 'tone', value: 'inviting', position: 0 },
        { type: 'pace', value: 'slow', position: 0 }
      ]
    },
    {
      id: 'mind-enter',
      type: 'body',
      required: true,
      minDuration: 45,
      maxDuration: 180,
      priority: 1,
      text: `Now, reach for the door handle and gently push it open.
             {pause:4}
             Step inside your sacred room.
             {pause:5}
             What do you see?
             Is there light? Perhaps from a window or a soft lamp?
             {pause:5}
             Notice what's in the room.
             Maybe a chair, a candle, a cross on the wall.
             {pause:5}
             Take a moment to familiarize yourself with this space.
             This is where you come to be with God.
             {pause:7}
             In the center of the room, you see a cross.
             This represents Christ's finished work.
             The place where you can lay down everything that weighs on you.
             {pause:4}`,
      variables: [],
      audioHints: [
        { type: 'pause', value: 5, position: 50 },
        { type: 'emphasis', value: 'gentle', position: 200 }
      ]
    },
    {
      id: 'mind-release',
      type: 'body',
      required: true,
      minDuration: 60,
      maxDuration: 240,
      priority: 2,
      text: `Now, bring to mind anything that's been weighing on you today.
             {pause:5}
             Worries... concerns... distractions... anxieties.
             {pause:5}
             One by one, see yourself placing them at the foot of the cross.
             {pause:10}
             {optional-extended}
             Take your time with this.
             If many things come to mind, that's okay.
             Simply acknowledge each one, and lay it down.
             {pause:15}
             The cares of work... {pause:3} place them there.
             Relationship concerns... {pause:3} lay them down.
             Financial worries... {pause:3} release them.
             Health anxieties... {pause:3} give them to God.
             {pause:10}
             {/optional-extended}
             Feel the lightness as you release these burdens.
             {pause:5}`,
      variables: [],
      audioHints: [
        { type: 'tone', value: 'compassionate', position: 0 },
        { type: 'pause', value: 10, position: 100 }
      ]
    },
    {
      id: 'mind-outro',
      type: 'outro',
      required: true,
      minDuration: 15,
      maxDuration: 45,
      priority: 3,
      text: `Your mind is now clear and quiet.
             {pause:3}
             You stand in your sacred room, free from distractions.
             {pause:3}
             Ready to be fully present with God.
             {pause:3}`,
      variables: [],
      audioHints: []
    }
  ]
};
```

### **3. Spirit Section - Holy Spirit Invitation**

```typescript
const spiritInvitation: ScriptTemplate = {
  techniqueId: 'spirit-001',
  sectionName: 'spirit',
  difficulty: 'beginner',
  metadata: {
    scriptureReferences: ['John 14:26', 'Acts 1:8'],
    themes: ['Holy Spirit', 'invitation', 'presence'],
    version: '1.0.0'
  },
  segments: [
    {
      id: 'spirit-intro',
      type: 'intro',
      required: true,
      minDuration: 20,
      maxDuration: 60,
      priority: 1,
      text: `Now we invite the Holy Spirit to join us.
             {pause:3}
             The Comforter. The Helper. God's presence with us.
             {pause:3}
             Jesus promised that the Father would send the Spirit to guide us into all truth.
             {pause:3}`,
      variables: [],
      audioHints: [
        { type: 'tone', value: 'reverent', position: 0 }
      ]
    },
    {
      id: 'spirit-invitation',
      type: 'body',
      required: true,
      minDuration: 30,
      maxDuration: 120,
      priority: 1,
      text: `Take a moment now to invite Him into your sacred space.
             {pause:5}
             You might use your own words, or simply pray:
             {pause:3}
             "Holy Spirit, come.
             Fill this place with Your presence.
             Speak to me.
             Help me hear the Father's voice.
             Guide me deeper into His love."
             {pause:10}
             {optional-extended}
             Sense His gentle presence surrounding you.
             Like a warm light filling the room.
             Or a peaceful stillness settling over everything.
             {pause:10}
             He is here. Not because we earned it or deserve it.
             But because the Father loves to be with His children.
             {pause:5}
             {/optional-extended}`,
      variables: [],
      audioHints: [
        { type: 'tone', value: 'intimate', position: 50 },
        { type: 'pace', value: 'very-slow', position: 70 }
      ]
    },
    {
      id: 'spirit-breath-prayer',
      type: 'body',
      required: false,
      minDuration: 45,
      maxDuration: 180,
      priority: 4,
      text: `Now, create a simple breath prayer.
             A short sentence that you can repeat to yourself throughout this meditation.
             {pause:5}
             It might be something like:
             {pause:2}
             "Speak, Lord, I'm listening"
             {pause:3}
             Or "I rest in You"
             {pause:3}
             Or "Show me Your love"
             {pause:3}
             Choose whatever words resonate with your heart right now.
             {pause:10}
             And as you continue this meditation,
             you can return to this prayer whenever you need to refocus.
             {pause:5}`,
      variables: [],
      audioHints: [
        { type: 'tone', value: 'gentle', position: 0 }
      ]
    },
    {
      id: 'spirit-outro',
      type: 'outro',
      required: true,
      minDuration: 10,
      maxDuration: 30,
      priority: 2,
      text: `The Spirit is with you now.
             {pause:3}
             Let's enter into the meditation together.
             {pause:3}`,
      variables: [],
      audioHints: []
    }
  ]
};
```

### **4. Meditation Section - I AM the Bread of Life**

```typescript
const breadOfLife: ScriptTemplate = {
  techniqueId: 'meditation-001',
  sectionName: 'meditation',
  difficulty: 'beginner',
  metadata: {
    scriptureReferences: ['John 6:35', 'John 6:48-51'],
    themes: ['I AM statements', 'spiritual nourishment', 'Jesus identity'],
    version: '1.0.0'
  },
  segments: [
    {
      id: 'med-scripture',
      type: 'intro',
      required: true,
      minDuration: 30,
      maxDuration: 90,
      priority: 1,
      text: `{scripture:John 6:35}
             {pause:5}
             "I am the bread of life.
             Whoever comes to me will never go hungry,
             and whoever believes in me will never be thirsty."
             {pause:7}
             These are Jesus' own words.
             {pause:3}`,
      variables: [
        {
          name: 'scripture',
          type: 'scripture',
          default: 'John 6:35',
          required: true
        }
      ],
      audioHints: [
        { type: 'tone', value: 'Scripture-reading', position: 0 },
        { type: 'pace', value: 'slow', position: 0 }
      ]
    },
    {
      id: 'med-reflection-1',
      type: 'body',
      required: true,
      minDuration: 60,
      maxDuration: 300,
      priority: 1,
      text: `Bread of life.
             {pause:5}
             Think about bread. Basic. Essential. Daily nourishment.
             {pause:5}
             Without food, we grow weak, hungry, desperate.
             {pause:5}
             Jesus says He is spiritual bread.
             The nourishment our souls need.
             {pause:7}
             Ask yourself: Am I spiritually hungry right now?
             {pause:10}
             What am I feeding my soul?
             {pause:10}
             Where do I look for fulfillment?
             {pause:10}
             {optional-extended}
             Perhaps you've been trying to fill that hunger with other things.
             Success... relationships... entertainment... busyness.
             {pause:7}
             And yet, the hunger remains.
             {pause:5}
             Jesus invites you: "Come to me. I am the bread that truly satisfies."
             {pause:10}
             What would it look like to let Him be your daily bread?
             To come to Him first when you're spiritually hungry?
             {pause:15}
             {/optional-extended}`,
      variables: [],
      audioHints: [
        { type: 'tone', value: 'contemplative', position: 0 },
        { type: 'pace', value: 'slow', position: 0 }
      ]
    },
    {
      id: 'med-dialogue',
      type: 'body',
      required: true,
      minDuration: 90,
      maxDuration: 360,
      priority: 2,
      text: `Now, have a conversation with Jesus about this.
             {pause:5}
             Tell Him honestly: What are you hungry for right now?
             {pause:15}
             Maybe it's peace... direction... healing... hope.
             {pause:10}
             Speak to Him. Out loud or in your heart.
             He's listening.
             {pause:30}
             {optional-extended}
             And now, be still.
             {pause:5}
             Give Him space to respond.
             {pause:5}
             He might bring a Scripture to mind.
             Or a gentle whisper of truth.
             Or simply a sense of His loving presence.
             {pause:45}
             Whatever He gives you, receive it.
             Even if it's just silence - His silence is full of love.
             {pause:15}
             {/optional-extended}`,
      variables: [],
      audioHints: [
        { type: 'tone', value: 'intimate', position: 0 },
        { type: 'pause', value: 30, position: 100 }
      ]
    },
    {
      id: 'med-conclusion',
      type: 'outro',
      required: true,
      minDuration: 30,
      maxDuration: 90,
      priority: 3,
      text: `Jesus is the bread of life.
             {pause:3}
             The One who truly satisfies.
             {pause:5}
             Thank Him for feeding your soul today.
             {pause:7}`,
      variables: [],
      audioHints: [
        { type: 'tone', value: 'grateful', position: 0 }
      ]
    }
  ]
};
```

---

## 🔧 Script Compiler

### **Duration Adaptation Algorithm**

```typescript
// lib/gemini/script-compiler.ts

export class ScriptCompiler {
  /**
   * Compile a script template into final narration text
   * adapted to the user's selected duration
   */
  compile(
    template: ScriptTemplate,
    targetDuration: number,
    variables: Record<string, any> = {}
  ): string {
    // 1. Calculate natural duration (all segments at minimum)
    const minDuration = template.segments
      .filter(s => s.required)
      .reduce((sum, s) => sum + s.minDuration, 0);

    const maxDuration = template.segments
      .reduce((sum, s) => sum + s.maxDuration, 0);

    // 2. Determine strategy
    if (targetDuration < minDuration) {
      return this.compressScript(template, targetDuration, variables);
    } else if (targetDuration > maxDuration) {
      return this.extendScript(template, targetDuration, variables);
    } else {
      return this.adaptScript(template, targetDuration, variables);
    }
  }

  /**
   * Standard adaptation: Include segments based on priority and target duration
   */
  private adaptScript(
    template: ScriptTemplate,
    targetDuration: number,
    variables: Record<string, any>
  ): string {
    let currentDuration = 0;
    let compiledText = '';

    // Always include required segments
    const requiredSegments = template.segments
      .filter(s => s.required)
      .sort((a, b) => a.priority - b.priority);

    for (const segment of requiredSegments) {
      const segmentText = this.processSegment(segment, variables, targetDuration - currentDuration);
      compiledText += segmentText + '\n\n';
      currentDuration += this.estimateDuration(segmentText);

      if (currentDuration >= targetDuration * 0.9) break;
    }

    // Add optional segments if we have time
    const optionalSegments = template.segments
      .filter(s => !s.required)
      .sort((a, b) => a.priority - b.priority);

    for (const segment of optionalSegments) {
      const remainingTime = targetDuration - currentDuration;
      if (remainingTime > segment.minDuration) {
        const segmentText = this.processSegment(segment, variables, remainingTime);
        compiledText += segmentText + '\n\n';
        currentDuration += this.estimateDuration(segmentText);
      }
    }

    return compiledText.trim();
  }

  /**
   * Process a single segment: replace variables, handle pauses, etc.
   */
  private processSegment(
    segment: TemplateSegment,
    variables: Record<string, any>,
    maxDuration: number
  ): string {
    let text = segment.text;

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }

    // Handle optional blocks
    if (maxDuration < segment.maxDuration) {
      // Remove optional blocks if short on time
      text = text.replace(/\{optional-extended\}[\s\S]*?\{\/optional-extended\}/g, '');
    } else {
      // Keep optional blocks but remove markers
      text = text.replace(/\{optional-extended\}|\{\/optional-extended\}/g, '');
    }

    // Process pauses (keep {pause:N} for audio generation)
    // They'll be converted to actual silence by the audio mixer

    return text;
  }

  /**
   * Compress script: Remove pauses, optional sections, keep only essentials
   */
  private compressScript(
    template: ScriptTemplate,
    targetDuration: number,
    variables: Record<string, any>
  ): string {
    // Only include highest priority required segments
    const segments = template.segments
      .filter(s => s.required && s.priority <= 2)
      .sort((a, b) => a.priority - b.priority);

    let text = '';
    for (const segment of segments) {
      let segmentText = segment.text;

      // Replace variables
      for (const [key, value] of Object.entries(variables)) {
        segmentText = segmentText.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
      }

      // Remove all optional blocks
      segmentText = segmentText.replace(/\{optional-extended\}[\s\S]*?\{\/optional-extended\}/g, '');

      // Reduce pauses to minimum
      segmentText = segmentText.replace(/\{pause:\d+\}/g, '{pause:2}');

      text += segmentText + '\n\n';
    }

    return text.trim();
  }

  /**
   * Extend script: Add pauses, repeat key phrases, include all optional content
   */
  private extendScript(
    template: ScriptTemplate,
    targetDuration: number,
    variables: Record<string, any>
  ): string {
    // Include all segments
    let text = '';

    for (const segment of template.segments) {
      let segmentText = this.processSegment(segment, variables, segment.maxDuration);

      // Always include optional blocks
      segmentText = segmentText.replace(/\{optional-extended\}|\{\/optional-extended\}/g, '');

      // Extend pauses
      segmentText = segmentText.replace(/\{pause:(\d+)\}/g, (match, seconds) => {
        return `{pause:${Math.min(parseInt(seconds) * 2, 30)}}`;
      });

      text += segmentText + '\n\n';
    }

    return text.trim();
  }

  /**
   * Estimate duration of text (rough approximation)
   * Average speaking rate: 150 words/minute (slow meditation pace: 100 wpm)
   */
  private estimateDuration(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const speakingTime = (words / 100) * 60; // 100 wpm in seconds

    // Add pause time
    const pauseMatches = text.match(/\{pause:(\d+)\}/g) || [];
    const pauseTime = pauseMatches.reduce((sum, match) => {
      const seconds = parseInt(match.match(/\d+/)?.[0] || '0');
      return sum + seconds;
    }, 0);

    return speakingTime + pauseTime;
  }
}
```

---

## ✅ Script Validation

### **Theological Review Checklist**

Before adding any script to production:

- [ ] **Biblical Accuracy**: Scripture quotes are verbatim (NKJV)
- [ ] **Theological Soundness**: No heresy, aligns with orthodox Christianity
- [ ] **Spiritual Safety**: No manipulation, guilt, or fear-based language
- [ ] **Inclusive Language**: Welcoming to all believers, not denominationally divisive
- [ ] **Practical Application**: Guidance is actionable and helpful
- [ ] **Tone Check**: Language is warm, inviting, not authoritarian

### **Technical Validation**

```typescript
export function validateScript(template: ScriptTemplate): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!template.techniqueId) errors.push('Missing techniqueId');
  if (!template.segments || template.segments.length === 0) {
    errors.push('No segments defined');
  }

  // Check segment durations
  for (const segment of template.segments) {
    if (segment.minDuration > segment.maxDuration) {
      errors.push(`Segment ${segment.id}: minDuration > maxDuration`);
    }
    if (segment.minDuration < 5) {
      warnings.push(`Segment ${segment.id}: Very short (< 5s)`);
    }
  }

  // Check for undefined variables
  const usedVars = new Set<string>();
  const definedVars = new Set<string>();

  for (const segment of template.segments) {
    const matches = segment.text.match(/\{(\w+)(:\d+)?\}/g) || [];
    matches.forEach(match => {
      const varName = match.replace(/[{}:0-9]/g, '');
      if (varName !== 'pause' && varName !== 'optional-extended') {
        usedVars.add(varName);
      }
    });

    segment.variables?.forEach(v => definedVars.add(v.name));
  }

  usedVars.forEach(varName => {
    if (!definedVars.has(varName)) {
      warnings.push(`Variable {${varName}} used but not defined`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
```

---

**These script templates are the heart of Praylude - where code meets devotion, where AI meets theology, where technology serves the sacred. Handle with prayer. 🙏**
