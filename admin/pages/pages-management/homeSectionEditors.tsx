'use client';

import { memo } from 'react';
import type { HomePageConfig, HomeSectionId } from '@/lib/sitePages.types';
import { HOME_SECTION_LABELS } from '@/lib/sitePages.types';

export const Field = memo(function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block text-xs font-medium text-gray-600">
      {label}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
        />
      )}
    </label>
  );
});

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block text-xs font-medium text-gray-600">
      {label}
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
      />
    </label>
  );
}

export function SectionContentEditor({
  sectionId,
  config,
  patchConfig,
}: {
  sectionId: HomeSectionId;
  config: HomePageConfig;
  patchConfig: (fn: (c: HomePageConfig) => HomePageConfig) => void;
}) {
  switch (sectionId) {
    case 'sale':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Badge"
            value={config.sale.badge}
            onChange={(badge) => patchConfig((c) => ({ ...c, sale: { ...c.sale, badge } }))}
          />
          <Field
            label="Title (before highlight)"
            value={config.sale.titleBefore}
            onChange={(titleBefore) => patchConfig((c) => ({ ...c, sale: { ...c.sale, titleBefore } }))}
          />
          <Field
            label="Title highlight"
            value={config.sale.titleHighlight}
            onChange={(titleHighlight) => patchConfig((c) => ({ ...c, sale: { ...c.sale, titleHighlight } }))}
          />
          <Field
            label="Description"
            value={config.sale.description}
            onChange={(description) => patchConfig((c) => ({ ...c, sale: { ...c.sale, description } }))}
            multiline
          />
          <Field
            label="Button text"
            value={config.sale.ctaText}
            onChange={(ctaText) => patchConfig((c) => ({ ...c, sale: { ...c.sale, ctaText } }))}
          />
          <p className="text-xs text-gray-500">Product cards still load automatically from items marked on sale.</p>
        </div>
      );
    case 'clientLogos':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Eyebrow"
            value={config.clientLogos.eyebrow}
            onChange={(eyebrow) => patchConfig((c) => ({ ...c, clientLogos: { ...c.clientLogos, eyebrow } }))}
          />
          <Field
            label="Title (before highlight)"
            value={config.clientLogos.title}
            onChange={(title) => patchConfig((c) => ({ ...c, clientLogos: { ...c.clientLogos, title } }))}
          />
          <Field
            label="Title highlight"
            value={config.clientLogos.titleHighlight}
            onChange={(titleHighlight) =>
              patchConfig((c) => ({ ...c, clientLogos: { ...c.clientLogos, titleHighlight } }))
            }
          />
          <Field
            label="Description"
            value={config.clientLogos.description}
            onChange={(description) =>
              patchConfig((c) => ({ ...c, clientLogos: { ...c.clientLogos, description } }))
            }
            multiline
          />
          <p className="text-xs text-gray-500">Logo images are managed in code for now (ClientLogosSlider).</p>
        </div>
      );
    case 'customKitchen':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Eyebrow"
            value={config.customKitchen.eyebrow}
            onChange={(eyebrow) => patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, eyebrow } }))}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <Field
              label="Title part 1"
              value={config.customKitchen.titleBefore}
              onChange={(titleBefore) =>
                patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, titleBefore } }))
              }
            />
            <Field
              label="Title highlight"
              value={config.customKitchen.titleHighlight}
              onChange={(titleHighlight) =>
                patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, titleHighlight } }))
              }
            />
            <Field
              label="Title part 2"
              value={config.customKitchen.titleAfter}
              onChange={(titleAfter) =>
                patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, titleAfter } }))
              }
            />
          </div>
          <Field
            label="Description"
            value={config.customKitchen.description}
            onChange={(description) =>
              patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, description } }))
            }
            multiline
          />
          <Field
            label="Image URL"
            value={config.customKitchen.imageUrl}
            onChange={(imageUrl) => patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, imageUrl } }))}
          />
          <Field
            label="Image alt text"
            value={config.customKitchen.imageAlt}
            onChange={(imageAlt) => patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, imageAlt } }))}
          />
          <Field
            label="Image badge"
            value={config.customKitchen.imageBadge}
            onChange={(imageBadge) =>
              patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, imageBadge } }))
            }
          />
          {config.customKitchen.highlights.map((item, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">Bullet {index + 1}</p>
              <Field
                label="Title"
                value={item.title}
                onChange={(title) =>
                  patchConfig((c) => {
                    const highlights = c.customKitchen.highlights.map((h, i) =>
                      i === index ? { ...h, title } : h,
                    );
                    return { ...c, customKitchen: { ...c.customKitchen, highlights } };
                  })
                }
              />
              <Field
                label="Text"
                value={item.text}
                onChange={(text) =>
                  patchConfig((c) => {
                    const highlights = c.customKitchen.highlights.map((h, i) =>
                      i === index ? { ...h, text } : h,
                    );
                    return { ...c, customKitchen: { ...c.customKitchen, highlights } };
                  })
                }
                multiline
              />
            </div>
          ))}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Primary button"
              value={config.customKitchen.primaryCta}
              onChange={(primaryCta) =>
                patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, primaryCta } }))
              }
            />
            <Field
              label="Primary link"
              value={config.customKitchen.primaryCtaHref}
              onChange={(primaryCtaHref) =>
                patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, primaryCtaHref } }))
              }
            />
            <Field
              label="Secondary button"
              value={config.customKitchen.secondaryCta}
              onChange={(secondaryCta) =>
                patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, secondaryCta } }))
              }
            />
            <Field
              label="Secondary link"
              value={config.customKitchen.secondaryCtaHref}
              onChange={(secondaryCtaHref) =>
                patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, secondaryCtaHref } }))
              }
            />
          </div>
          <Field
            label="Footer link text"
            value={config.customKitchen.footerLinkText}
            onChange={(footerLinkText) =>
              patchConfig((c) => ({ ...c, customKitchen: { ...c.customKitchen, footerLinkText } }))
            }
          />
        </div>
      );
    case 'categories':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Eyebrow"
            value={config.categoriesIntro.eyebrow}
            onChange={(eyebrow) => patchConfig((c) => ({ ...c, categoriesIntro: { ...c.categoriesIntro, eyebrow } }))}
          />
          <Field
            label="Title (before highlight)"
            value={config.categoriesIntro.title}
            onChange={(title) => patchConfig((c) => ({ ...c, categoriesIntro: { ...c.categoriesIntro, title } }))}
          />
          <Field
            label="Highlighted words"
            value={config.categoriesIntro.titleHighlight}
            onChange={(titleHighlight) =>
              patchConfig((c) => ({ ...c, categoriesIntro: { ...c.categoriesIntro, titleHighlight } }))
            }
          />
          <Field
            label="Description"
            value={config.categoriesIntro.description}
            onChange={(description) =>
              patchConfig((c) => ({ ...c, categoriesIntro: { ...c.categoriesIntro, description } }))
            }
            multiline
          />
        </div>
      );
    case 'stats':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Eyebrow"
            value={config.stats.eyebrow}
            onChange={(eyebrow) => patchConfig((c) => ({ ...c, stats: { ...c.stats, eyebrow } }))}
          />
          <Field
            label="Heading"
            value={config.stats.heading}
            onChange={(heading) => patchConfig((c) => ({ ...c, stats: { ...c.stats, heading } }))}
          />
          {config.stats.stats.map((stat, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">Stat {index + 1}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <NumberField
                  label="Number"
                  value={stat.value}
                  onChange={(value) =>
                    patchConfig((c) => {
                      const stats = c.stats.stats.map((s, i) => (i === index ? { ...s, value } : s));
                      return { ...c, stats: { ...c.stats, stats } };
                    })
                  }
                />
                <Field
                  label="Suffix (+, %, etc.)"
                  value={stat.suffix}
                  onChange={(suffix) =>
                    patchConfig((c) => {
                      const stats = c.stats.stats.map((s, i) => (i === index ? { ...s, suffix } : s));
                      return { ...c, stats: { ...c.stats, stats } };
                    })
                  }
                />
              </div>
              <Field
                label="Label"
                value={stat.label}
                onChange={(label) =>
                  patchConfig((c) => {
                    const stats = c.stats.stats.map((s, i) => (i === index ? { ...s, label } : s));
                    return { ...c, stats: { ...c.stats, stats } };
                  })
                }
              />
              <Field
                label="Description"
                value={stat.description}
                onChange={(description) =>
                  patchConfig((c) => {
                    const stats = c.stats.stats.map((s, i) => (i === index ? { ...s, description } : s));
                    return { ...c, stats: { ...c.stats, stats } };
                  })
                }
                multiline
              />
            </div>
          ))}
          {config.stats.trustBadges.map((badge, index) => (
            <Field
              key={index}
              label={`Trust badge ${index + 1}`}
              value={badge}
              onChange={(v) =>
                patchConfig((c) => {
                  const trustBadges = c.stats.trustBadges.map((b, i) => (i === index ? v : b));
                  return { ...c, stats: { ...c.stats, trustBadges } };
                })
              }
            />
          ))}
        </div>
      );
    case 'whyChooseUs':
      return (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Eyebrow (before highlight)"
              value={config.whyChooseUs.eyebrowBefore}
              onChange={(eyebrowBefore) =>
                patchConfig((c) => ({ ...c, whyChooseUs: { ...c.whyChooseUs, eyebrowBefore } }))
              }
            />
            <Field
              label="Eyebrow highlight"
              value={config.whyChooseUs.eyebrowHighlight}
              onChange={(eyebrowHighlight) =>
                patchConfig((c) => ({ ...c, whyChooseUs: { ...c.whyChooseUs, eyebrowHighlight } }))
              }
            />
          </div>
          <Field
            label="Heading"
            value={config.whyChooseUs.title}
            onChange={(title) => patchConfig((c) => ({ ...c, whyChooseUs: { ...c.whyChooseUs, title } }))}
          />
          <Field
            label="Description"
            value={config.whyChooseUs.description}
            onChange={(description) =>
              patchConfig((c) => ({ ...c, whyChooseUs: { ...c.whyChooseUs, description } }))
            }
            multiline
          />
          {config.whyChooseUs.reasons.map((reason, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">Card {index + 1}</p>
              <Field
                label="Title"
                value={reason.title}
                onChange={(title) =>
                  patchConfig((c) => {
                    const reasons = c.whyChooseUs.reasons.map((r, i) => (i === index ? { ...r, title } : r));
                    return { ...c, whyChooseUs: { ...c.whyChooseUs, reasons } };
                  })
                }
              />
              <Field
                label="Description"
                value={reason.description}
                onChange={(description) =>
                  patchConfig((c) => {
                    const reasons = c.whyChooseUs.reasons.map((r, i) =>
                      i === index ? { ...r, description } : r,
                    );
                    return { ...c, whyChooseUs: { ...c.whyChooseUs, reasons } };
                  })
                }
                multiline
              />
            </div>
          ))}
        </div>
      );
    case 'signup':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Eyebrow"
            value={config.signup.eyebrow}
            onChange={(eyebrow) => patchConfig((c) => ({ ...c, signup: { ...c.signup, eyebrow } }))}
          />
          <Field
            label="Title (before highlight)"
            value={config.signup.titleBefore}
            onChange={(titleBefore) => patchConfig((c) => ({ ...c, signup: { ...c.signup, titleBefore } }))}
          />
          <Field
            label="Title highlight"
            value={config.signup.titleHighlight}
            onChange={(titleHighlight) =>
              patchConfig((c) => ({ ...c, signup: { ...c.signup, titleHighlight } }))
            }
          />
          <Field
            label="Description"
            value={config.signup.description}
            onChange={(description) => patchConfig((c) => ({ ...c, signup: { ...c.signup, description } }))}
            multiline
          />
          {config.signup.benefits.map((benefit, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">Benefit {index + 1}</p>
              <Field
                label="Title"
                value={benefit.title}
                onChange={(title) =>
                  patchConfig((c) => {
                    const benefits = c.signup.benefits.map((b, i) => (i === index ? { ...b, title } : b));
                    return { ...c, signup: { ...c.signup, benefits } };
                  })
                }
              />
              <Field
                label="Description"
                value={benefit.description}
                onChange={(description) =>
                  patchConfig((c) => {
                    const benefits = c.signup.benefits.map((b, i) =>
                      i === index ? { ...b, description } : b,
                    );
                    return { ...c, signup: { ...c.signup, benefits } };
                  })
                }
                multiline
              />
            </div>
          ))}
          <Field
            label="Social proof line"
            value={config.signup.socialProof}
            onChange={(socialProof) => patchConfig((c) => ({ ...c, signup: { ...c.signup, socialProof } }))}
            multiline
          />
          <Field
            label="Orange panel title"
            value={config.signup.panelTitle}
            onChange={(panelTitle) => patchConfig((c) => ({ ...c, signup: { ...c.signup, panelTitle } }))}
          />
          <Field
            label="Orange panel description"
            value={config.signup.panelDescription}
            onChange={(panelDescription) =>
              patchConfig((c) => ({ ...c, signup: { ...c.signup, panelDescription } }))
            }
            multiline
          />
          {config.signup.panelPerks.map((perk, index) => (
            <Field
              key={index}
              label={`Panel perk ${index + 1}`}
              value={perk}
              onChange={(v) =>
                patchConfig((c) => {
                  const panelPerks = c.signup.panelPerks.map((p, i) => (i === index ? v : p));
                  return { ...c, signup: { ...c.signup, panelPerks } };
                })
              }
            />
          ))}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Sign up button"
              value={config.signup.primaryCta}
              onChange={(primaryCta) => patchConfig((c) => ({ ...c, signup: { ...c.signup, primaryCta } }))}
            />
            <Field
              label="Sign in button"
              value={config.signup.secondaryCta}
              onChange={(secondaryCta) => patchConfig((c) => ({ ...c, signup: { ...c.signup, secondaryCta } }))}
            />
          </div>
        </div>
      );
    case 'cta':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Badge"
            value={config.cta.badge}
            onChange={(badge) => patchConfig((c) => ({ ...c, cta: { ...c.cta, badge } }))}
          />
          <Field
            label="Title (before highlight)"
            value={config.cta.titleBefore}
            onChange={(titleBefore) => patchConfig((c) => ({ ...c, cta: { ...c.cta, titleBefore } }))}
          />
          <Field
            label="Title highlight"
            value={config.cta.titleHighlight}
            onChange={(titleHighlight) => patchConfig((c) => ({ ...c, cta: { ...c.cta, titleHighlight } }))}
          />
          <Field
            label="Description"
            value={config.cta.description}
            onChange={(description) => patchConfig((c) => ({ ...c, cta: { ...c.cta, description } }))}
            multiline
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Primary button"
              value={config.cta.primaryCta}
              onChange={(primaryCta) => patchConfig((c) => ({ ...c, cta: { ...c.cta, primaryCta } }))}
            />
            <Field
              label="Primary link"
              value={config.cta.primaryCtaHref}
              onChange={(primaryCtaHref) => patchConfig((c) => ({ ...c, cta: { ...c.cta, primaryCtaHref } }))}
            />
            <Field
              label="Secondary button"
              value={config.cta.secondaryCta}
              onChange={(secondaryCta) => patchConfig((c) => ({ ...c, cta: { ...c.cta, secondaryCta } }))}
            />
            <Field
              label="Secondary link"
              value={config.cta.secondaryCtaHref}
              onChange={(secondaryCtaHref) =>
                patchConfig((c) => ({ ...c, cta: { ...c.cta, secondaryCtaHref } }))
              }
            />
          </div>
          {config.cta.trustItems.map((item, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">Trust item {index + 1}</p>
              <Field
                label="Label"
                value={item.label}
                onChange={(label) =>
                  patchConfig((c) => {
                    const trustItems = c.cta.trustItems.map((t, i) => (i === index ? { ...t, label } : t));
                    return { ...c, cta: { ...c.cta, trustItems } };
                  })
                }
              />
              <Field
                label="Subtext"
                value={item.sub}
                onChange={(sub) =>
                  patchConfig((c) => {
                    const trustItems = c.cta.trustItems.map((t, i) => (i === index ? { ...t, sub } : t));
                    return { ...c, cta: { ...c.cta, trustItems } };
                  })
                }
              />
            </div>
          ))}
        </div>
      );
    default:
      return (
        <p className="mt-4 text-sm text-gray-600">
          Select a section on the left to edit {HOME_SECTION_LABELS[sectionId] ?? 'content'}.
        </p>
      );
  }
}
