'use client';

import type { BlogPageConfig, BlogSectionId } from '@/lib/blogPage.types';
import { Field } from '@/admin/pages/pages-management/homeSectionEditors';
import { ImageUploadField } from '@/admin/pages/pages-management/ImageUploadField';

export function BlogSectionContentEditor({
  sectionId,
  config,
  patchConfig,
}: {
  sectionId: BlogSectionId;
  config: BlogPageConfig;
  patchConfig: (fn: (c: BlogPageConfig) => BlogPageConfig) => void;
}) {
  switch (sectionId) {
    case 'hero':
      return (
        <div className="mt-4 space-y-3">
          <ImageUploadField
            label="Banner image"
            hint="JPEG/PNG/WebP, max 5 MB"
            imageUrl={config.hero.imageUrl}
            onChangeUrl={(imageUrl) => patchConfig((c) => ({ ...c, hero: { ...c.hero, imageUrl } }))}
            previewAlt={config.hero.imageAlt}
          />
          <Field
            label="Image alt text"
            value={config.hero.imageAlt}
            onChange={(imageAlt) => patchConfig((c) => ({ ...c, hero: { ...c.hero, imageAlt } }))}
          />
        </div>
      );
    case 'listing':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Section title"
            value={config.listing.title}
            onChange={(title) => patchConfig((c) => ({ ...c, listing: { ...c.listing, title } }))}
          />
          <Field
            label="Section description"
            value={config.listing.description}
            onChange={(description) => patchConfig((c) => ({ ...c, listing: { ...c.listing, description } }))}
            multiline
          />
          <Field
            label="Search field label"
            value={config.listing.searchLabel}
            onChange={(searchLabel) => patchConfig((c) => ({ ...c, listing: { ...c.listing, searchLabel } }))}
          />
          <Field
            label="Search placeholder"
            value={config.listing.searchPlaceholder}
            onChange={(searchPlaceholder) =>
              patchConfig((c) => ({ ...c, listing: { ...c.listing, searchPlaceholder } }))
            }
          />
          <Field
            label="Category field label"
            value={config.listing.categoryLabel}
            onChange={(categoryLabel) =>
              patchConfig((c) => ({ ...c, listing: { ...c.listing, categoryLabel } }))
            }
          />
          <Field
            label="Empty state title (filters active)"
            value={config.listing.emptyFilteredTitle}
            onChange={(emptyFilteredTitle) =>
              patchConfig((c) => ({ ...c, listing: { ...c.listing, emptyFilteredTitle } }))
            }
          />
          <Field
            label="Empty state description (filters active)"
            value={config.listing.emptyFilteredDescription}
            onChange={(emptyFilteredDescription) =>
              patchConfig((c) => ({ ...c, listing: { ...c.listing, emptyFilteredDescription } }))
            }
            multiline
          />
          <Field
            label="Empty state title (no posts)"
            value={config.listing.emptyDefaultTitle}
            onChange={(emptyDefaultTitle) =>
              patchConfig((c) => ({ ...c, listing: { ...c.listing, emptyDefaultTitle } }))
            }
          />
          <Field
            label="Empty state description (no posts)"
            value={config.listing.emptyDefaultDescription}
            onChange={(emptyDefaultDescription) =>
              patchConfig((c) => ({ ...c, listing: { ...c.listing, emptyDefaultDescription } }))
            }
            multiline
          />
        </div>
      );
    case 'signup':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Title"
            value={config.signup.title}
            onChange={(title) => patchConfig((c) => ({ ...c, signup: { ...c.signup, title } }))}
          />
          <Field
            label="Description"
            value={config.signup.description}
            onChange={(description) => patchConfig((c) => ({ ...c, signup: { ...c.signup, description } }))}
            multiline
          />
          <Field
            label="Sign up button"
            value={config.signup.signupCta}
            onChange={(signupCta) => patchConfig((c) => ({ ...c, signup: { ...c.signup, signupCta } }))}
          />
          <Field
            label="Login button"
            value={config.signup.loginCta}
            onChange={(loginCta) => patchConfig((c) => ({ ...c, signup: { ...c.signup, loginCta } }))}
          />
          <Field
            label="Footer note"
            value={config.signup.footerNote}
            onChange={(footerNote) => patchConfig((c) => ({ ...c, signup: { ...c.signup, footerNote } }))}
          />
        </div>
      );
    default:
      return null;
  }
}
