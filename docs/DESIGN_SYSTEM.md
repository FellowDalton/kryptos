# Praylude Design System
**Inspired by Japanese Ma (間) - The Art of Negative Space**

## 🎨 Design Philosophy

**Ma (間)** is the Japanese concept of negative space - the silence between sounds, the space between objects, the pause between actions. In Praylude, we embrace Ma to create a meditation experience free from distraction, focused on the divine.

---

## Core Principles

### 1. **Spaciousness**
- Generous whitespace around all elements
- Content should breathe
- Never crowd the interface
- Allow room for contemplation

### 2. **Simplicity**
- One clear action per screen
- Minimal navigation
- No unnecessary elements
- Every pixel serves the practice

### 3. **Stillness**
- Minimal animations (only when meaningful)
- Calm, slow transitions
- No jarring movements
- Peace before productivity

### 4. **Intentionality**
- Every element has clear purpose
- No decorative noise
- Purposeful hierarchy
- Guide without overwhelming

### 5. **Flow**
- Effortless navigation
- No friction between user and God
- Invisible technology
- Seamless transitions

---

## Color Palette

### Primary (Dark Mode - Default)
```
Background: #0A0A0A (Deep black)
Surface: #1A1A1A (Soft black)
Text Primary: #F5F5F5 (Off-white)
Text Secondary: #A0A0A0 (Soft gray)
Accent: #D4C5A9 (Warm beige - like candlelight)
```

### Light Mode (Optional)
```
Background: #FAFAFA (Soft white)
Surface: #FFFFFF (Pure white)
Text Primary: #1A1A1A (Deep gray)
Text Secondary: #6B6B6B (Medium gray)
Accent: #8B7355 (Warm brown)
```

### Semantic Colors
```
Success: #5A7D5F (Muted sage green)
Warning: #A67C52 (Muted amber)
Error: #8B5A5A (Muted red)
```

---

## Typography

### Font Families
```
Primary: 'Inter', sans-serif (or 'Merriweather Sans' for warmth)
Scripture: 'Lora', serif (for biblical text)
```

### Type Scale
```
H1: 2.5rem (40px) - Page titles
H2: 1.875rem (30px) - Section titles
H3: 1.5rem (24px) - Card titles
Body: 1.125rem (18px) - Default text
Small: 0.875rem (14px) - Metadata
```

### Line Height
```
Headings: 1.2
Body: 1.6 (extra spacious for readability)
```

---

## Spacing System

Based on 8px grid for consistency and rhythm.

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
4xl: 96px
```

**Usage**:
- Use larger spacing (xl, 2xl, 3xl) liberally
- Embrace negative space
- Double spacing when in doubt

---

## Layout Principles

### Grid
- 12-column grid for desktop
- 4-column for mobile
- Generous gutters (24px minimum)

### Containers
- Max width: 1200px (most content)
- Max width: 800px (reading content)
- Center-aligned with equal margins

### Vertical Rhythm
- Consistent spacing between sections (2xl or 3xl)
- Allow content to breathe vertically

---

## Component Design

### Buttons

**Primary Action**
```
Style: Filled, rounded corners (8px)
Padding: 16px 32px
Font: Medium weight, 1.125rem
Color: Accent background, white text
Hover: Subtle opacity change (90%)
```

**Secondary Action**
```
Style: Outline, rounded corners (8px)
Padding: 12px 24px
Font: Regular weight, 1rem
Color: Border in accent, text in accent
Hover: Fill with accent background
```

**Minimal Action**
```
Style: Text only, no background
Padding: 8px 16px
Font: Regular weight, 1rem
Color: Text secondary
Hover: Text primary
```

### Cards
```
Background: Surface color
Border: None (or 1px subtle border in light mode)
Radius: 12px
Padding: 24px or 32px
Shadow: Subtle (0 2px 8px rgba(0,0,0,0.05) in light mode)
```

### Input Fields
```
Style: Minimal border-bottom or subtle outline
Padding: 12px 16px
Font: 1.125rem
Focus: Accent color underline/border
Placeholder: Text secondary
```

---

## Interaction Design

### Animations
- **Duration**: 200-300ms (fast, not instant)
- **Easing**: `ease-in-out` or cubic-bezier for smoothness
- **Use cases**:
  - Fade in/out
  - Slide transitions between sections
  - Button hover states
- **Avoid**: Spinners, bouncing, anything jarring

### Transitions
- Section to section: Gentle fade or slide (500ms)
- Modal/overlay: Fade background, slide content (300ms)
- Navigation: Smooth page transitions

### Feedback
- Hover states: Subtle opacity or color shift
- Click states: Brief scale (98%) or opacity
- Loading states: Minimal spinner or progress indicator
- Success: Gentle checkmark animation

---

## Iconography

### Style
- Line icons (not filled)
- Stroke width: 1.5-2px
- Size: 20-24px (default), 32px (large)
- Color: Text secondary (default)

### Sources
- **Lucide Icons** (recommended - minimal, clean)
- **Heroicons** (alternative)

### Usage
- Sparingly - only when meaning is clear
- Always with accessible labels
- Consistent throughout app

---

## Audio Player Design

### Visual Hierarchy
1. **Section Name** (largest, most prominent)
2. **Progress/Time** (secondary)
3. **Play/Pause Control** (central, intuitive)
4. **Other controls** (minimal, accessible)

### Layout
```
┌─────────────────────────────────┐
│                                 │
│         [Section Name]          │
│                                 │
│     ────────●──────────         │  Progress bar
│                                 │
│         [▶/⏸]                   │  Play/Pause
│                                 │
│      12:34 / 20:00              │  Time
│                                 │
└─────────────────────────────────┘
```

---

## Mobile-First Approach

### Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

### Mobile Priorities
1. Touch targets: 44px minimum
2. Thumb-friendly navigation
3. Vertical scrolling (natural)
4. One column layout (default)

### Desktop Enhancements
- Multi-column where appropriate
- Larger typography
- More generous spacing
- Side-by-side layouts (e.g., custom session builder)

---

## Accessibility

### Contrast Ratios
- Text: Minimum 4.5:1 (WCAG AA)
- Large text: Minimum 3:1
- Interactive elements: Minimum 3:1

### Focus States
- Visible keyboard focus (accent color outline)
- Logical tab order
- Skip links for navigation

### Screen Readers
- Semantic HTML
- ARIA labels where needed
- Alt text for images (if any)

---

## Examples of Ma in Practice

### Home Page
```
Large vertical space → Welcome message
Generous space → Primary CTA (Begin Meditation)
Ample space → Secondary option (Create Custom)
White space → Footer (minimal)
```

### Meditation Player
```
Empty space (breathing room)
Section name (centered, large)
Empty space
Progress bar (minimal, thin)
Empty space
Play/Pause button (single, clear)
Empty space
Timer (subtle, bottom)
```

### Custom Builder
```
Section headers (spaced)
Empty space
Technique selectors (one per section, vertical spacing)
Empty space between each
Duration sliders (generous hit area)
Empty space
Save button (bottom, prominent)
```

---

## Don'ts (Anti-Patterns)

❌ Multiple CTAs competing for attention
❌ Dense layouts with cramped content
❌ Flashy animations or transitions
❌ Unnecessary icons or decorations
❌ Complex navigation structures
❌ Distracting background patterns
❌ Bright, saturated colors
❌ Small touch targets on mobile

---

## Reference Inspiration

### Apps/Sites
- **Calm** - Minimalist meditation UI
- **Notion** - Clean, spacious layouts
- **Linear** - Fast, minimal interactions
- **Japanese garden design** - Balance, space, intention

### Principles
- **Wabi-sabi** - Beauty in simplicity and imperfection
- **Kanso** - Simplicity and elimination of clutter
- **Seijaku** - Tranquility and active calm

---

## Design Checklist

Before shipping any screen, ask:
- [ ] Is there generous spacing around all elements?
- [ ] Can I remove anything without losing meaning?
- [ ] Is there one clear primary action?
- [ ] Are animations subtle and purposeful?
- [ ] Does this feel calm and peaceful?
- [ ] Can the user complete their task with minimal clicks?
- [ ] Is the typography readable and spacious?
- [ ] Does this honor the practice of meeting God?

---

**Remember**: Every pixel serves the practice. Less is more. Space is sacred.
