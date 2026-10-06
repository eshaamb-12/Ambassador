'use client';

import type { GalleryPageConfig, GallerySectionId } from '@/lib/galleryPage.types';
import { Field } from '@/admin/pages/pages-management/homeSectionEditors';
import { ImageUploadField } from '@/admin/pages/pages-management/ImageUploadField';

export function GallerySectionContentEditor({
  sectionId,
  config,
  patchConfig,
}: {
  sectionId: GallerySectionId;
  config: GalleryPageConfig;
  patchConfig: (fn: (c: GalleryPageConfig) => GalleryPageConfig) => void;
}) {
  switch (sectionId) {
    case 'hero':
      return (
        <div className="mt-4 space-y-3">
          <ImageUploadField
            label="Hero background image"
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
          <Field
            label="Heading"
            value={config.hero.title}
            onChange={(title) => patchConfig((c) => ({ ...c, hero: { ...c.hero, title } }))}
          />
          <Field
            label="Subtitle"
            value={config.hero.subtitle}
            onChange={(subtitle) => patchConfig((c) => ({ ...c, hero: { ...c.hero, subtitle } }))}
            multiline
          />
        </div>
      );
    case 'reviews':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Title (before highlight)"
            value={config.reviews.titleBefore}
            onChange={(titleBefore) => patchConfig((c) => ({ ...c, reviews: { ...c.reviews, titleBefore } }))}
          />
          <Field
            label="Title highlight"
            value={config.reviews.titleHighlight}
            onChange={(titleHighlight) =>
              patchConfig((c) => ({ ...c, reviews: { ...c.reviews, titleHighlight } }))
            }
          />
          <Field
            label="Description"
            value={config.reviews.description}
            onChange={(description) => patchConfig((c) => ({ ...c, reviews: { ...c.reviews, description } }))}
            multiline
          />
          <Field
            label="Review card button text"
            value={config.reviews.viewProductCta}
            onChange={(viewProductCta) =>
              patchConfig((c) => ({ ...c, reviews: { ...c.reviews, viewProductCta } }))
            }
          />
          <Field
            label="Overlay label (full testimonial)"
            value={config.reviews.fullTestimonialLabel}
            onChange={(fullTestimonialLabel) =>
              patchConfig((c) => ({ ...c, reviews: { ...c.reviews, fullTestimonialLabel } }))
            }
          />
          <p className="text-xs text-gray-500">
            Individual review videos and quotes are managed under <strong>Gallery Management</strong>.
          </p>
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
