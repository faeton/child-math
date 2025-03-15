/**
 * Global configuration for the games platform
 */

export const platformConfig = {
    // General platform settings
    siteName: 'Kids Math Games',
    siteDescription: 'Fun educational math games for children',
    
    // Feature flags
    features: {
      progressTracking: false,  // Will be enabled in future updates
      achievements: false,      // Will be enabled in future updates
      accounts: false,          // Will be enabled in future updates
      darkMode: false           // Will be enabled in future updates
    },
    
    // Game difficulty levels
    difficultyLevels: {
      1: 'Easy',
      2: 'Medium',
      3: 'Challenging',
      4: 'Expert'
    },
    
    // Age range categories
    ageRanges: {
      '3-5': 'Preschool',
      '5-7': 'Early Elementary',
      '7-10': 'Elementary',
      '10-12': 'Upper Elementary'
    }
  };
  
  export default platformConfig;