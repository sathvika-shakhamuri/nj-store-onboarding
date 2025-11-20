import posthog from 'posthog-js';

const POSTHOG_KEY = 'phc_9QubqRhjQXeyAn46rH3wJ38T4RliHLcesYIaoxIazC3';
const POSTHOG_HOST = 'https://app.posthog.com';

export const initAnalytics = () => {
  // Initialize PostHog (in production, use env variables)
  if (typeof window !== 'undefined') {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false,       // We'll manually track what matters
      capture_pageview: false,  // Manual control
    });
  }
};

export const analytics = {
  // Track page/step views
  trackPageView: (pageName: string) => {
    posthog.capture('$pageview', { page: pageName });
  },

  // Onboarding events
  onboardingStarted: () => {
    posthog.capture('onboarding_started', {
      timestamp: new Date().toISOString(),
    });
  },

  step1Completed: (data: {
    store_type: string;
    nearby_stores_count: number;
    time_spent_seconds: number;
  }) => {
    posthog.capture('step1_completed', data);
  },

  step2Completed: (data: {
    products_selected_count: number;
    contact_preferences: string[];
    time_preference: string;
    time_spent_seconds: number;
  }) => {
    posthog.capture('step2_completed', data);
  },

  onboardingCompleted: (data: {
    total_time_seconds: number;
    store_type: string;
  }) => {
    posthog.capture('onboarding_completed', data);
  },

  onboardingAbandoned: (data: {
    last_step: string;
    time_spent_seconds: number;
    store_type?: string;
  }) => {
    posthog.capture('onboarding_abandoned', data);
  },

  // NEW: per-step view tracking for funnels
  stepViewed: (stepNumber: number, extra?: Record<string, any>) => {
    posthog.capture('onboarding_step_viewed', {
      step_number: stepNumber,
      ...extra,
    });
  },

  // Engagement events
  mapInteracted: (action: string, details?: Record<string, any>) => {
    posthog.capture('map_interacted', { action, ...details });
  },

  insightsViewed: (scrollDepth: number) => {
    posthog.capture('insights_viewed', { scroll_depth: scrollDepth });
  },

  storeTypeSelected: (storeType: string) => {
    posthog.capture('store_type_selected', { store_type: storeType });
  },

  // Form interactions
  fieldFocused: (fieldName: string) => {
    posthog.capture('field_focused', { field_name: fieldName });
  },

  validationError: (fieldName: string, error: string) => {
    posthog.capture('validation_error', { field_name: fieldName, error });
  },
};

export default analytics;
