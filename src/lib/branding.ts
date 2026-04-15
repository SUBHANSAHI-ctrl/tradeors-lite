// Branding Configuration for Trakvex
// Update these values for custom branding

export const BRANDING = {
  // Company Information
  companyName: 'Trakvex',
  appName: 'Trakvex',
  supportEmail: 'team@trakvex.com',
  domain: 'trakvex.com',

  // Logo Configuration - Using the specific PNG logo file
  logo: {
    main: '/logo/qovavo-traderos-logo.png', // Main logo (PNG)
    fallback: '/logo/qovavo-traderos-logo.png', // Same as main for consistency
    favicon: '/logo/favicon.ico',
    appleTouchIcon: '/logo/apple-touch-icon.png',
    icon192: '/logo/icon-192x192.png',
    icon512: '/logo/icon-512x512.png',
  },
  
  // Colors (can be customized)
  colors: {
    primary: '#3B82F6', // Blue-500
    secondary: '#8B5CF6', // Purple-500
    accent: '#10B981', // Green-500
  },
  
  // Social/Contact
  social: {
    supportEmail: 'team@qovavo.com',
    twitter: '@qovavo',
    // Add other social links as needed
  },
  
  // Legal Pages (update when available)
  legal: {
    termsUrl: 'https://qovavo.com/terms',
    privacyUrl: 'https://qovavo.com/privacy',
  },
  
  // Metadata
  metadata: {
    title: 'Trakvex - Professional Trading Analytics',
    description: 'Track your trades, analyze performance, and discover why you win or lose with professional-grade analytics.',
    keywords: 'trading, analytics, forex, stocks, performance tracking, trading journal',
  },
} as const;