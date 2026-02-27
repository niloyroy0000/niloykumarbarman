// Animation delays and durations - Optimized for performance
export const ANIMATION_DELAYS = {
  NONE: 0,
  MINIMAL: 0.1,
  HEADER: 0.1,
  CONTENT: 0.1,
  CARDS: 0.1,
  STATS: 0.1,
  STAGGER: 0.05,
} as const;

export const ANIMATION_DURATIONS = {
  INSTANT: 0.1,
  FAST: 0.2,
  NORMAL: 0.2,
  SLOW: 0.3,
  VERY_SLOW: 0.4,
} as const;

// Performance-optimized animation variants
export const PERFORMANCE_VARIANTS = {
  // Fast entry animations
  fadeInFast: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: ANIMATION_DURATIONS.FAST, ease: "easeOut" }
    }
  },

  // Synchronous slide animations
  slideUpSync: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: ANIMATION_DURATIONS.NORMAL, ease: "easeOut" }
    }
  },

  // Container for staggered children
  containerSync: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: ANIMATION_DURATIONS.FAST,
        staggerChildren: ANIMATION_DELAYS.STAGGER,
        delayChildren: ANIMATION_DELAYS.MINIMAL,
      },
    },
  },

  // Card animations
  cardSync: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_DURATIONS.NORMAL,
        ease: "easeOut",
      },
    },
  },
} as const;

// CSS-based animations for performance optimization
export const CSS_ANIMATIONS = {
  // CSS classes for simple animations (replaces Framer Motion)
  FADE_IN: 'animate-fade-in',
  FADE_IN_UP: 'animate-fade-in-up',
  SLIDE_LEFT: 'animate-slide-in-left',
  SLIDE_RIGHT: 'animate-slide-in-right',
  
  // Staggered delays for list animations
  STAGGER_1: 'animate-stagger-1',
  STAGGER_2: 'animate-stagger-2',
  STAGGER_3: 'animate-stagger-3',
  STAGGER_4: 'animate-stagger-4',
  STAGGER_5: 'animate-stagger-5',
  
  // Performance optimized classes
  PERFORMANCE_CARD: 'performance-card',
  PERFORMANCE_BUTTON: 'performance-button',
  SYNC_FADE_IN: 'sync-fade-in'
} as const;

// Lightweight animation variants for better performance (Framer Motion fallback)
export const LIGHTWEIGHT_VARIANTS = {
  // Simple fade in - minimal processing
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Simple slide up - reduced complexity
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Simple slide in from left
  slideLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Simple slide in from right
  slideRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },

  // Button hover - minimal animation
  buttonHover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  }
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// Color constants
export const COLORS = {
  PRIMARY: '#1c1c22',
  SECONDARY: '#00BFFF',
  SECONDARY_HOVER: '#00e187',
  WHITE: '#ffffff',
  TRANSPARENT: 'transparent',
} as const;

// Form validation constants
export const FORM_VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MIN_MESSAGE_LENGTH: 10,
  MIN_PHONE_LENGTH: 10,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Rate limiting constants
export const RATE_LIMIT = {
  MAX_ATTEMPTS: 3,
  WINDOW_MS: 60000, // 1 minute
  BLOCK_DURATION_MS: 300000, // 5 minutes
} as const;

// Performance constants
export const PERFORMANCE = {
  LAZY_LOAD_THRESHOLD: '200px',
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
} as const;

// Bundle optimization
export const BUNDLE_CONFIG = {
  CHUNK_SIZE_WARNING: 244000, // 244KB
  MAX_INITIAL_CHUNK_SIZE: 512000, // 512KB
  FRAMER_MOTION_TARGET_SIZE: 50000, // Target 50KB after optimization
} as const;

// Animation strategy configuration
export const ANIMATION_STRATEGY = {
  // Components that MUST use Framer Motion (complex animations)
  FRAMER_MOTION_COMPONENTS: [
    'PageTransition',
    'StairTransition', 
    'Stairs',
    'ProjectModal',
    'GlobalSearch',
    'Header' // For mobile nav AnimatePresence
  ],
  
  // Components that should use CSS animations
  CSS_ANIMATION_COMPONENTS: [
    'CertificationCard',
    'ProjectCard',
    'SearchBar',
    'FormSection',
    'FilterPanel',
    'SkillsFilter',
    'CertificationFilter',
    'Stats',
    'TimelineElement'
  ],
  
  // Environment flag to force CSS animations
  USE_CSS_ANIMATIONS: true
} as const;

// SEO constants
export const SEO = {
  DEFAULT_TITLE: "Panday's Portfolio",
  DEFAULT_DESCRIPTION: "Portfolio of Niloy Kumar Barman Panday - Full-Stack .NET Developer",
  SITE_URL: "https://biswajitpanday.github.io",
  AUTHOR: "Niloy Kumar Barman Panday",
} as const;

// Social media links
export const SOCIAL_LINKS = {
  GITHUB: "https://github.com/biswajitpanday",
  LINKEDIN: "https://linkedin.com/in/biswajitpanday",
  EMAIL: "biswajitmailid@gmail.com",
  PHONE: "+880 1681642502",
  WHATSAPP: "+880 1681642502",
  TEAMS: "biswajitpanday@live.com",
} as const;

// Re-export pagination and filter constants (Priority 2.5)
export * from './pagination';
export * from './filters';

export default {
  ANIMATION_DELAYS,
  ANIMATION_DURATIONS,
  PERFORMANCE_VARIANTS,
  CSS_ANIMATIONS,
  LIGHTWEIGHT_VARIANTS,
  BREAKPOINTS,
  COLORS,
  FORM_VALIDATION,
  RATE_LIMIT,
  PERFORMANCE,
  BUNDLE_CONFIG,
  ANIMATION_STRATEGY,
  SEO,
  SOCIAL_LINKS,
}; 