import mongoose, { Document, Model, Schema } from 'mongoose';

export const SITE_SETTINGS_KEY = 'global';

export interface ISiteSettings extends Document {
  key: string;
  /** GA4 measurement ID, e.g. G-XXXXXXXXXX */
  googleAnalyticsId: string;
  /** Google Tag Manager container ID, e.g. GTM-XXXXXXX */
  googleTagManagerId: string;
  /** Google Search Console HTML tag verification content value */
  googleSiteVerification: string;
  /** Optional meta tags, link tags, JSON-LD (no script — use footer or GA/GTM fields) */
  headExtraHtml: string;
  /** Scripts before </body> — GTM noscript, pixels, custom snippets */
  bodyExtraHtml: string;
  updatedAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, unique: true, default: SITE_SETTINGS_KEY },
    googleAnalyticsId: { type: String, default: '', trim: true },
    googleTagManagerId: { type: String, default: '', trim: true },
    googleSiteVerification: { type: String, default: '', trim: true },
    headExtraHtml: { type: String, default: '', maxlength: 20_000 },
    bodyExtraHtml: { type: String, default: '', maxlength: 20_000 },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);

export default SiteSettings;
