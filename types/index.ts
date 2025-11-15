/**
 * TypeScript type definitions for Praylude
 * Core data models and interfaces
 */

// ============================================================================
// Type Literals
// ============================================================================

/**
 * The six meditation section names in order
 */
export type SectionName =
  | 'welcome'
  | 'mind'
  | 'body'
  | 'spirit'
  | 'meditation'
  | 'incorporate';

/**
 * Difficulty levels for meditation techniques
 */
export type Difficulty =
  | 'beginner'
  | 'intermediate'
  | 'advanced';

/**
 * Subscription status for user accounts
 * - free: No active subscription
 * - trial: In trial period
 * - active: Actively subscribed
 * - cancelled: Subscription cancelled but may still have access until period ends
 * - lifetime: First 100 users with lifetime access
 */
export type SubscriptionStatus =
  | 'free'
  | 'trial'
  | 'active'
  | 'cancelled'
  | 'lifetime';

/**
 * Referral status tracking
 * - pending: User signed up but hasn't qualified yet
 * - qualified: User has paid for at least 1 month
 * - rewarded: Referrer has received their reward
 */
export type ReferralStatus =
  | 'pending'
  | 'qualified'
  | 'rewarded';

// ============================================================================
// User & Authentication
// ============================================================================

/**
 * User profile and account information
 */
export interface User {
  /** Unique user identifier */
  readonly id: string;
  /** User's email address */
  email: string;
  /** Optional display name */
  name?: string;
  /** Account creation timestamp (ISO 8601 string) */
  readonly createdAt: string;
  /** User preferences and settings */
  preferences: UserPreferences;
  /** Current subscription status */
  subscriptionStatus: SubscriptionStatus;
  /** True for first 100 users with lifetime access */
  lifetimeAccess: boolean;
  /** Unique referral code for this user */
  readonly referralCode: string;
}

/**
 * User preferences and application settings
 */
export interface UserPreferences {
  /** UI theme preference */
  theme: 'dark' | 'light';
  /** Default session ID to load on app start */
  defaultSessionId?: string;
  /** Whether to enable push notifications */
  notificationsEnabled: boolean;
  /** Daily reminder time in HH:MM format (e.g., "07:00") */
  reminderTime?: string;
}

// ============================================================================
// Meditation Structure
// ============================================================================

/**
 * One of the six meditation sections
 * Represents a phase in the meditation journey
 */
export interface Section {
  /** Unique section identifier */
  readonly id: string;
  /** Section name (one of six) */
  readonly name: SectionName;
  /** Human-readable display name */
  readonly displayName: string;
  /** Description of the section's purpose */
  readonly description: string;
  /** Order in sequence (1-6) */
  readonly order: number;
}

/**
 * Individual meditation technique within a section
 * Contains script template and configuration
 */
export interface Technique {
  /** Unique technique identifier */
  readonly id: string;
  /** Foreign key to parent Section */
  readonly sectionId: string;
  /** Technique name */
  name: string;
  /** Description of the technique */
  description: string;
  /** Script template with variable placeholders */
  scriptTemplate: string;
  /** Default duration in seconds */
  defaultDuration: number;
  /** Minimum allowed duration in seconds */
  minDuration: number;
  /** Maximum allowed duration in seconds */
  maxDuration: number;
  /** Optional Bible verse references (e.g., ["Matthew 6:6", "Psalm 46:10"]) */
  scriptureReferences?: readonly string[];
  /** Difficulty level */
  difficulty: Difficulty;
  /** Creation timestamp (ISO 8601 string) */
  readonly createdAt: string;
  /** Release date for weekly rollout (ISO 8601 string) */
  releasedAt?: string;
}

// ============================================================================
// Custom Sessions
// ============================================================================

/**
 * User-created meditation session composed of selected techniques
 */
export interface CustomSession {
  /** Unique session identifier */
  readonly id: string;
  /** ID of user who created this session */
  readonly userId: string;
  /** Session name */
  name: string;
  /** Optional description */
  description?: string;
  /** Ordered array of techniques in this session */
  techniques: readonly SessionTechnique[];
  /** Total duration in seconds (calculated sum) */
  totalDuration: number;
  /** Whether session is shared with community */
  isPublic: boolean;
  /** Creation timestamp (ISO 8601 string) */
  readonly createdAt: string;
  /** Last update timestamp (ISO 8601 string) */
  updatedAt: string;
}

/**
 * A technique within a custom session
 * Links technique to session with custom duration and order
 */
export interface SessionTechnique {
  /** Parent section ID */
  sectionId: string;
  /** Technique ID, or null to skip this section */
  techniqueId: string | null;
  /** User-customized duration in seconds */
  duration: number;
  /** Order in session (1-6, matches section order) */
  order: number;
}

// ============================================================================
// History & Analytics
// ============================================================================

/**
 * Record of completed meditation session
 * Tracks user's meditation history
 */
export interface SessionHistory {
  /** Unique history record identifier */
  readonly id: string;
  /** ID of user who completed the session */
  readonly userId: string;
  /** ID of the session that was completed (CustomSession or standard) */
  sessionId: string;
  /** Completion timestamp (ISO 8601 string) */
  readonly completedAt: string;
  /** Actual time spent in seconds */
  duration: number;
  /** Optional user reflections or notes */
  notes?: string;
}

// ============================================================================
// Referrals & Rewards
// ============================================================================

/**
 * Referral tracking for rewards program
 * Links referrer to referee and tracks reward status
 */
export interface Referral {
  /** Unique referral identifier */
  readonly id: string;
  /** ID of user who made the referral */
  readonly referrerId: string;
  /** ID of user who signed up via referral */
  readonly refereeId: string;
  /** Referral code used */
  readonly referralCode: string;
  /** Signup timestamp (ISO 8601 string) */
  readonly signupDate: string;
  /** Current status of the referral */
  status: ReferralStatus;
  /** When reward was granted (ISO 8601 string) */
  rewardGrantedAt?: string;
}

// ============================================================================
// Audio System
// ============================================================================

/**
 * Generated audio segment for a technique
 * Used for dynamic audio mixing and caching
 */
export interface AudioSegment {
  /** Unique audio segment identifier */
  readonly id: string;
  /** Parent technique ID */
  readonly techniqueId: string;
  /** Type of segment in the audio flow */
  segmentType: 'intro' | 'body' | 'outro' | 'transition';
  /** Duration in seconds */
  duration: number;
  /** URL to cached audio file */
  audioUrl: string;
  /** Creation timestamp (ISO 8601 string) */
  readonly createdAt: string;
}
