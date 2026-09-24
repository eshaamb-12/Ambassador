'use client';

import type { AboutIntroHeader, AboutPageConfig, AboutSectionId } from '@/lib/aboutPage.types';
import { Field } from '@/admin/pages/pages-management/homeSectionEditors';
import { ImageUploadField } from '@/admin/pages/pages-management/ImageUploadField';

function IntroFields({
  intro,
  onChange,
}: {
  intro: AboutIntroHeader;
  onChange: (intro: AboutIntroHeader) => void;
}) {
  return (
    <>
      <Field label="Eyebrow" value={intro.eyebrow} onChange={(eyebrow) => onChange({ ...intro, eyebrow })} />
      <Field label="Title (before highlight)" value={intro.title} onChange={(title) => onChange({ ...intro, title })} />
      <Field
        label="Title highlight"
        value={intro.titleHighlight}
        onChange={(titleHighlight) => onChange({ ...intro, titleHighlight })}
      />
      <Field
        label="Description"
        value={intro.description}
        onChange={(description) => onChange({ ...intro, description })}
        multiline
      />
    </>
  );
}

export function AboutSectionContentEditor({
  sectionId,
  config,
  patchConfig,
}: {
  sectionId: AboutSectionId;
  config: AboutPageConfig;
  patchConfig: (fn: (c: AboutPageConfig) => AboutPageConfig) => void;
}) {
  switch (sectionId) {
    case 'banner':
      return (
        <div className="mt-4 space-y-3">
          <ImageUploadField
            label="Banner image"
            hint="JPEG/PNG/WebP, max 5 MB"
            imageUrl={config.banner.imageUrl}
            onChangeUrl={(imageUrl) => patchConfig((c) => ({ ...c, banner: { ...c.banner, imageUrl } }))}
            previewAlt={config.banner.imageAlt}
          />
          <Field
            label="Image alt text"
            value={config.banner.imageAlt}
            onChange={(imageAlt) => patchConfig((c) => ({ ...c, banner: { ...c.banner, imageAlt } }))}
          />
          <Field
            label="Heading"
            value={config.banner.title}
            onChange={(title) => patchConfig((c) => ({ ...c, banner: { ...c.banner, title } }))}
          />
          <Field
            label="Subtitle"
            value={config.banner.subtitle}
            onChange={(subtitle) => patchConfig((c) => ({ ...c, banner: { ...c.banner, subtitle } }))}
            multiline
          />
        </div>
      );
    case 'company':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Eyebrow"
            value={config.company.eyebrow}
            onChange={(eyebrow) => patchConfig((c) => ({ ...c, company: { ...c.company, eyebrow } }))}
          />
          <Field
            label="Title (before highlight)"
            value={config.company.titleBefore}
            onChange={(titleBefore) => patchConfig((c) => ({ ...c, company: { ...c.company, titleBefore } }))}
          />
          <Field
            label="Title highlight"
            value={config.company.titleHighlight}
            onChange={(titleHighlight) =>
              patchConfig((c) => ({ ...c, company: { ...c.company, titleHighlight } }))
            }
          />
          {config.company.paragraphs.map((p, i) => (
            <Field
              key={i}
              label={`Paragraph ${i + 1}`}
              value={p}
              onChange={(v) =>
                patchConfig((c) => {
                  const paragraphs = c.company.paragraphs.map((x, j) => (j === i ? v : x));
                  return { ...c, company: { ...c.company, paragraphs } };
                })
              }
              multiline
            />
          ))}
          <ImageUploadField
            label="Section image"
            imageUrl={config.company.imageUrl}
            onChangeUrl={(imageUrl) => patchConfig((c) => ({ ...c, company: { ...c.company, imageUrl } }))}
          />
          <Field
            label="Image alt"
            value={config.company.imageAlt}
            onChange={(imageAlt) => patchConfig((c) => ({ ...c, company: { ...c.company, imageAlt } }))}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Floating badge value"
              value={config.company.floatBadgeValue}
              onChange={(floatBadgeValue) =>
                patchConfig((c) => ({ ...c, company: { ...c.company, floatBadgeValue } }))
              }
            />
            <Field
              label="Floating badge label"
              value={config.company.floatBadgeLabel}
              onChange={(floatBadgeLabel) =>
                patchConfig((c) => ({ ...c, company: { ...c.company, floatBadgeLabel } }))
              }
            />
          </div>
          {config.company.highlights.map((h, i) => (
            <div key={i} className="grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:grid-cols-2">
              <Field
                label={`Stat ${i + 1} value`}
                value={h.value}
                onChange={(value) =>
                  patchConfig((c) => {
                    const highlights = c.company.highlights.map((x, j) => (j === i ? { ...x, value } : x));
                    return { ...c, company: { ...c.company, highlights } };
                  })
                }
              />
              <Field
                label={`Stat ${i + 1} label`}
                value={h.label}
                onChange={(label) =>
                  patchConfig((c) => {
                    const highlights = c.company.highlights.map((x, j) => (j === i ? { ...x, label } : x));
                    return { ...c, company: { ...c.company, highlights } };
                  })
                }
              />
            </div>
          ))}
        </div>
      );
    case 'ceoAward':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Eyebrow"
            value={config.ceoAward.eyebrow}
            onChange={(eyebrow) => patchConfig((c) => ({ ...c, ceoAward: { ...c.ceoAward, eyebrow } }))}
          />
          <Field
            label="Title (before highlight)"
            value={config.ceoAward.titleBefore}
            onChange={(titleBefore) => patchConfig((c) => ({ ...c, ceoAward: { ...c.ceoAward, titleBefore } }))}
          />
          <Field
            label="Title highlight"
            value={config.ceoAward.titleHighlight}
            onChange={(titleHighlight) =>
              patchConfig((c) => ({ ...c, ceoAward: { ...c.ceoAward, titleHighlight } }))
            }
          />
          {config.ceoAward.paragraphs.map((p, i) => (
            <Field
              key={i}
              label={`Paragraph ${i + 1}`}
              value={p}
              onChange={(v) =>
                patchConfig((c) => {
                  const paragraphs = c.ceoAward.paragraphs.map((x, j) => (j === i ? v : x));
                  return { ...c, ceoAward: { ...c.ceoAward, paragraphs } };
                })
              }
              multiline
            />
          ))}
          <Field
            label="Signature name"
            value={config.ceoAward.signatureName}
            onChange={(signatureName) =>
              patchConfig((c) => ({ ...c, ceoAward: { ...c.ceoAward, signatureName } }))
            }
          />
          <Field
            label="Signature role"
            value={config.ceoAward.signatureRole}
            onChange={(signatureRole) =>
              patchConfig((c) => ({ ...c, ceoAward: { ...c.ceoAward, signatureRole } }))
            }
          />
          <ImageUploadField
            label="CEO photo"
            imageUrl={config.ceoAward.imageUrl}
            onChangeUrl={(imageUrl) => patchConfig((c) => ({ ...c, ceoAward: { ...c.ceoAward, imageUrl } }))}
          />
          <Field
            label="Photo alt"
            value={config.ceoAward.imageAlt}
            onChange={(imageAlt) => patchConfig((c) => ({ ...c, ceoAward: { ...c.ceoAward, imageAlt } }))}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Photo badge line 1"
              value={config.ceoAward.imageBadgeLine1}
              onChange={(imageBadgeLine1) =>
                patchConfig((c) => ({ ...c, ceoAward: { ...c.ceoAward, imageBadgeLine1 } }))
              }
            />
            <Field
              label="Photo badge line 2"
              value={config.ceoAward.imageBadgeLine2}
              onChange={(imageBadgeLine2) =>
                patchConfig((c) => ({ ...c, ceoAward: { ...c.ceoAward, imageBadgeLine2 } }))
              }
            />
          </div>
          {config.ceoAward.highlights.map((h, i) => (
            <div key={i} className="grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:grid-cols-2">
              <Field
                label={`Highlight ${i + 1} value`}
                value={h.value}
                onChange={(value) =>
                  patchConfig((c) => {
                    const highlights = c.ceoAward.highlights.map((x, j) => (j === i ? { ...x, value } : x));
                    return { ...c, ceoAward: { ...c.ceoAward, highlights } };
                  })
                }
              />
              <Field
                label={`Highlight ${i + 1} label`}
                value={h.label}
                onChange={(label) =>
                  patchConfig((c) => {
                    const highlights = c.ceoAward.highlights.map((x, j) => (j === i ? { ...x, label } : x));
                    return { ...c, ceoAward: { ...c.ceoAward, highlights } };
                  })
                }
              />
            </div>
          ))}
        </div>
      );
    case 'certificates':
      return (
        <div className="mt-4 space-y-3">
          <IntroFields
            intro={config.certificates}
            onChange={(certificates) => patchConfig((c) => ({ ...c, certificates }))}
          />
          <p className="text-xs text-gray-500">Certificate images in the carousel are still managed in theme code.</p>
        </div>
      );
    case 'missionValues':
      return (
        <div className="mt-4 space-y-3">
          <IntroFields
            intro={config.missionValues.intro}
            onChange={(intro) => patchConfig((c) => ({ ...c, missionValues: { ...c.missionValues, intro } }))}
          />
          <Field
            label="Mission label"
            value={config.missionValues.missionLabel}
            onChange={(missionLabel) =>
              patchConfig((c) => ({ ...c, missionValues: { ...c.missionValues, missionLabel } }))
            }
          />
          <Field
            label="Mission title"
            value={config.missionValues.missionTitle}
            onChange={(missionTitle) =>
              patchConfig((c) => ({ ...c, missionValues: { ...c.missionValues, missionTitle } }))
            }
          />
          <Field
            label="Mission body"
            value={config.missionValues.missionBody}
            onChange={(missionBody) =>
              patchConfig((c) => ({ ...c, missionValues: { ...c.missionValues, missionBody } }))
            }
            multiline
          />
          <Field
            label="Vision label"
            value={config.missionValues.visionLabel}
            onChange={(visionLabel) =>
              patchConfig((c) => ({ ...c, missionValues: { ...c.missionValues, visionLabel } }))
            }
          />
          <Field
            label="Vision title"
            value={config.missionValues.visionTitle}
            onChange={(visionTitle) =>
              patchConfig((c) => ({ ...c, missionValues: { ...c.missionValues, visionTitle } }))
            }
          />
          <Field
            label="Vision body"
            value={config.missionValues.visionBody}
            onChange={(visionBody) =>
              patchConfig((c) => ({ ...c, missionValues: { ...c.missionValues, visionBody } }))
            }
            multiline
          />
          <Field
            label="Values section title"
            value={config.missionValues.valuesTitle}
            onChange={(valuesTitle) =>
              patchConfig((c) => ({ ...c, missionValues: { ...c.missionValues, valuesTitle } }))
            }
          />
          <Field
            label="Values section subtitle"
            value={config.missionValues.valuesSubtitle}
            onChange={(valuesSubtitle) =>
              patchConfig((c) => ({ ...c, missionValues: { ...c.missionValues, valuesSubtitle } }))
            }
            multiline
          />
          <ImageUploadField
            label="Values infographic image"
            imageUrl={config.missionValues.valuesImageUrl}
            onChangeUrl={(valuesImageUrl) =>
              patchConfig((c) => ({ ...c, missionValues: { ...c.missionValues, valuesImageUrl } }))
            }
          />
        </div>
      );
    case 'clientLogos':
      return (
        <div className="mt-4 space-y-3">
          <IntroFields
            intro={config.clientLogos}
            onChange={(clientLogos) => patchConfig((c) => ({ ...c, clientLogos }))}
          />
          <p className="text-xs text-gray-500">Logo grid images are still managed in theme code.</p>
        </div>
      );
    case 'testimonials':
      return (
        <div className="mt-4 space-y-3">
          <IntroFields
            intro={config.testimonials.intro}
            onChange={(intro) => patchConfig((c) => ({ ...c, testimonials: { ...c.testimonials, intro } }))}
          />
          {config.testimonials.items.map((item, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">Review {i + 1}</p>
              <Field
                label="Name / role"
                value={item.name}
                onChange={(name) =>
                  patchConfig((c) => {
                    const items = c.testimonials.items.map((x, j) => (j === i ? { ...x, name } : x));
                    return { ...c, testimonials: { ...c.testimonials, items } };
                  })
                }
              />
              <Field
                label="Review title"
                value={item.title}
                onChange={(title) =>
                  patchConfig((c) => {
                    const items = c.testimonials.items.map((x, j) => (j === i ? { ...x, title } : x));
                    return { ...c, testimonials: { ...c.testimonials, items } };
                  })
                }
              />
              <Field
                label="Quote"
                value={item.text}
                onChange={(text) =>
                  patchConfig((c) => {
                    const items = c.testimonials.items.map((x, j) => (j === i ? { ...x, text } : x));
                    return { ...c, testimonials: { ...c.testimonials, items } };
                  })
                }
                multiline
              />
              <ImageUploadField
                label="Photo"
                imageUrl={item.image}
                onChangeUrl={(image) =>
                  patchConfig((c) => {
                    const items = c.testimonials.items.map((x, j) => (j === i ? { ...x, image } : x));
                    return { ...c, testimonials: { ...c.testimonials, items } };
                  })
                }
              />
              <label className="block text-xs font-medium text-gray-600">
                Star rating (1–5)
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={item.rating}
                  onChange={(e) => {
                    const rating = Math.min(5, Math.max(1, Number(e.target.value) || 5));
                    patchConfig((c) => {
                      const items = c.testimonials.items.map((x, j) => (j === i ? { ...x, rating } : x));
                      return { ...c, testimonials: { ...c.testimonials, items } };
                    });
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
          ))}
        </div>
      );
    case 'faq':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Section heading"
            value={config.faq.heading}
            onChange={(heading) => patchConfig((c) => ({ ...c, faq: { ...c.faq, heading } }))}
          />
          <Field
            label="Section description"
            value={config.faq.description}
            onChange={(description) => patchConfig((c) => ({ ...c, faq: { ...c.faq, description } }))}
            multiline
          />
          {config.faq.items.map((item, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">FAQ {i + 1}</p>
              <Field
                label="Question"
                value={item.question}
                onChange={(question) =>
                  patchConfig((c) => {
                    const items = c.faq.items.map((x, j) => (j === i ? { ...x, question } : x));
                    return { ...c, faq: { ...c.faq, items } };
                  })
                }
              />
              <Field
                label="Answer"
                value={item.answer}
                onChange={(answer) =>
                  patchConfig((c) => {
                    const items = c.faq.items.map((x, j) => (j === i ? { ...x, answer } : x));
                    return { ...c, faq: { ...c.faq, items } };
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
