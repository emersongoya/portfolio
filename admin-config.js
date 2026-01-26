// Admin configuration for case protection (pilot version)
// In the future, this can be replaced by backend API calls or a UI panel

window.CASE_PROTECTION_CONFIG = {
  // Global password (case sensitive)
  globalPassword: 'Portfolio-2025',
  // Per-case password (optional, leave empty for now)
  casePasswords: {
    // 'dell-salesforce.html': 'Portfolio-2025', // Example for future
  },
  // Protected cases (filenames)
  protectedCases: [
    'dell-salesforce.html',
  ],
  // Session duration in milliseconds (20 minutes)
  sessionDuration: 20 * 60 * 1000,
};

// Placeholder for future backend integration
// window.CASE_PROTECTION_CONFIG.backend = {
//   enabled: false,
//   endpoint: '',
//   ...
// };
