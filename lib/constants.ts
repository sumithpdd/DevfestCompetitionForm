/**
 * Application Constants
 * 
 * Centralized configuration values used throughout the app.
 * Update these values to customize the application behavior.
 */

// Firebase paths
export const FIREBASE_COLLECTION = 'DevFestComp2025'
export const FIREBASE_STORAGE_FOLDER = 'devfest2025Comp'

// File upload limits
export const MAX_SCREENSHOTS = 5
export const MAX_FILE_SIZE_MB = 10
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

// Admin session duration (in hours)
export const ADMIN_SESSION_DURATION_HOURS = 24

// Admin credentials (CHANGE FOR PRODUCTION!)
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
} as const

// Submission statuses
export const SUBMISSION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
} as const

// Winner places
export const WINNER_PLACES = {
  FIRST: 'first',
  SECOND: 'second',
  THIRD: 'third',
} as const

// Allowed image types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]

// Toast duration (in milliseconds)
export const TOAST_DURATION = 5000

// Form field limits
export const FORM_LIMITS = {
  fullName: { min: 2, max: 100 },
  email: { max: 100 },
  githubUrl: { max: 200 },
  appPurpose: { min: 10, max: 2000 },
  linkedinUrl: { max: 200 },
  twitterUrl: { max: 200 },
  facebookUrl: { max: 200 },
  instagramUrl: { max: 200 },
  websiteUrl: { max: 200 },
  interest: { max: 50 },
  maxInterests: 10,
}

