/**
 * Application Identity (Brand)
 *
 * Also note that the 'Brand' is used in the following places:
 *  - README.md               all over
 *  - package.json            app-slug and version
 *  - [public/manifest.json]  name, short_name, description, theme_color, background_color
 */
export const Brand = {
  Title: {
    Base: 'Ylsoo Aivory',
    Common: (process.env.NODE_ENV === 'development' ? '[DEV] ' : '') + 'Ylsoo Aivory',
  },
  Meta: {
    Description: 'Launch Ylsoo Aivory to unlock the full potential of AI, with precise control over your data and models. Voice interface, AI personas, advanced features, and fun UX.',
    SiteName: 'Ylsoo Aivory | Precision AI for You',
    ThemeColor: '#32383E',
    TwitterSite: '@enricoros',
  },
  URIs: {
    Home: 'https://ylsoo-aivory.com',
    // App: 'https://get.ylsoo-aivory.com',
    CardImage: 'https://ylsoo-aivory.com/icons/card-dark-1200.png',
    OpenRepo: 'https://github.com/enricoros/ylsoo-aivory',
    OpenProject: 'https://github.com/users/enricoros/projects/4',
    SupportInvite: 'https://discord.gg/MkH4qj2Jp9',
    // Twitter: 'https://www.twitter.com/enricoros',
    PrivacyPolicy: 'https://ylsoo-aivory.com/privacy',
    TermsOfService: 'https://ylsoo-aivory.com/terms',
  },
  Docs: {
    Public: (docPage: string) => `https://ylsoo-aivory.com/docs/${docPage}`,
  }
} as const;