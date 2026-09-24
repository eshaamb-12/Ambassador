export interface PublicSiteSettings {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  googleSiteVerification: string;
  headExtraHtml: string;
  bodyExtraHtml: string;
}

export const DEFAULT_PUBLIC_SITE_SETTINGS: PublicSiteSettings = {
  googleAnalyticsId: 'G-Y951ZNMJX9',
  googleTagManagerId: '',
  googleSiteVerification: 'E2JREt5YU1IkSxG6kQBwwW4FrD9JKQjwz43hJkrNF78',
  headExtraHtml: '',
  bodyExtraHtml: '',
};
