'use client';

import type { BranchesPageConfig, BranchesSectionId, ShowroomBranch } from '@/lib/branchesPage.types';
import { Field } from '@/admin/pages/pages-management/homeSectionEditors';
import { ImageUploadField } from '@/admin/pages/pages-management/ImageUploadField';

function servicesToText(services: string[]): string {
  return services.join(', ');
}

function textToServices(text: string): string[] {
  return text
    .split(/[,|\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function BranchEditor({
  branch,
  index,
  patchBranch,
}: {
  branch: ShowroomBranch;
  index: number;
  patchBranch: (next: ShowroomBranch) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-4 space-y-3">
      <p className="text-sm font-semibold text-gray-800">
        Location {index + 1}: {branch.name || 'Untitled'}
      </p>
      <Field label="Name" value={branch.name} onChange={(name) => patchBranch({ ...branch, name })} />
      <Field
        label="Address"
        value={branch.address}
        onChange={(address) => patchBranch({ ...branch, address })}
        multiline
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="City" value={branch.city} onChange={(city) => patchBranch({ ...branch, city })} />
        <Field label="State" value={branch.state} onChange={(state) => patchBranch({ ...branch, state })} />
        <Field label="Pincode" value={branch.pincode} onChange={(pincode) => patchBranch({ ...branch, pincode })} />
        <Field label="Phone" value={branch.phone} onChange={(phone) => patchBranch({ ...branch, phone })} />
      </div>
      <Field label="Email" value={branch.email} onChange={(email) => patchBranch({ ...branch, email })} />
      <Field label="Manager" value={branch.manager} onChange={(manager) => patchBranch({ ...branch, manager })} />
      <Field label="Hours" value={branch.hours} onChange={(hours) => patchBranch({ ...branch, hours })} />
      <Field
        label="Services (comma-separated)"
        value={servicesToText(branch.services)}
        onChange={(raw) => patchBranch({ ...branch, services: textToServices(raw) })}
        multiline
      />
      <ImageUploadField
        label="Card image"
        hint="JPEG/PNG/WebP, max 5 MB"
        imageUrl={branch.image}
        onChangeUrl={(image) => patchBranch({ ...branch, image })}
        previewAlt={branch.name}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Latitude"
          value={String(branch.coordinates.lat)}
          onChange={(raw) =>
            patchBranch({
              ...branch,
              coordinates: { ...branch.coordinates, lat: Number(raw) || 0 },
            })
          }
        />
        <Field
          label="Longitude"
          value={String(branch.coordinates.lng)}
          onChange={(raw) =>
            patchBranch({
              ...branch,
              coordinates: { ...branch.coordinates, lng: Number(raw) || 0 },
            })
          }
        />
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={Boolean(branch.isHeadOffice)}
          onChange={(e) => patchBranch({ ...branch, isHeadOffice: e.target.checked })}
          className="rounded border-gray-300 text-[#0F4C69]"
        />
        Show &quot;Head Office&quot; badge on card
      </label>
      <Field
        label="Internal ID (do not change unless you know why)"
        value={branch.id}
        onChange={(id) => patchBranch({ ...branch, id })}
      />
    </div>
  );
}

export function BranchesSectionContentEditor({
  sectionId,
  config,
  patchConfig,
}: {
  sectionId: BranchesSectionId;
  config: BranchesPageConfig;
  patchConfig: (fn: (c: BranchesPageConfig) => BranchesPageConfig) => void;
}) {
  switch (sectionId) {
    case 'hero':
      return (
        <div className="mt-4 space-y-3">
          <ImageUploadField
            label="Hero background image"
            hint="JPEG/PNG/WebP, max 5 MB"
            imageUrl={config.hero.backgroundImage}
            onChangeUrl={(backgroundImage) => patchConfig((c) => ({ ...c, hero: { ...c.hero, backgroundImage } }))}
            previewAlt={config.hero.imageAlt}
          />
          <Field
            label="Image alt text"
            value={config.hero.imageAlt}
            onChange={(imageAlt) => patchConfig((c) => ({ ...c, hero: { ...c.hero, imageAlt } }))}
          />
          <Field
            label="Badge"
            value={config.hero.badge}
            onChange={(badge) => patchConfig((c) => ({ ...c, hero: { ...c.hero, badge } }))}
          />
          <Field
            label="Title (before highlight)"
            value={config.hero.titleBefore}
            onChange={(titleBefore) => patchConfig((c) => ({ ...c, hero: { ...c.hero, titleBefore } }))}
          />
          <Field
            label="Title highlight"
            value={config.hero.titleHighlight}
            onChange={(titleHighlight) => patchConfig((c) => ({ ...c, hero: { ...c.hero, titleHighlight } }))}
          />
          <Field
            label="Subtitle"
            value={config.hero.subtitle}
            onChange={(subtitle) => patchConfig((c) => ({ ...c, hero: { ...c.hero, subtitle } }))}
            multiline
          />
        </div>
      );
    case 'accentBand':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Text before highlight"
            value={config.accentBand.textBeforeHighlight}
            onChange={(textBeforeHighlight) =>
              patchConfig((c) => ({ ...c, accentBand: { ...c.accentBand, textBeforeHighlight } }))
            }
          />
          <Field
            label="Highlighted text"
            value={config.accentBand.highlight}
            onChange={(highlight) => patchConfig((c) => ({ ...c, accentBand: { ...c.accentBand, highlight } }))}
          />
          <Field
            label="Text after highlight"
            value={config.accentBand.textAfterHighlight}
            onChange={(textAfterHighlight) =>
              patchConfig((c) => ({ ...c, accentBand: { ...c.accentBand, textAfterHighlight } }))
            }
          />
          <Field
            label="Phone (display)"
            value={config.accentBand.phoneDisplay}
            onChange={(phoneDisplay) =>
              patchConfig((c) => ({ ...c, accentBand: { ...c.accentBand, phoneDisplay } }))
            }
          />
          <Field
            label="Phone link (tel:…)"
            value={config.accentBand.phoneHref}
            onChange={(phoneHref) => patchConfig((c) => ({ ...c, accentBand: { ...c.accentBand, phoneHref } }))}
          />
          <Field
            label="Contact button"
            value={config.accentBand.contactCta}
            onChange={(contactCta) => patchConfig((c) => ({ ...c, accentBand: { ...c.accentBand, contactCta } }))}
          />
          <Field
            label="Contact link"
            value={config.accentBand.contactHref}
            onChange={(contactHref) =>
              patchConfig((c) => ({ ...c, accentBand: { ...c.accentBand, contactHref } }))
            }
          />
        </div>
      );
    case 'grid':
      return (
        <div className="mt-4 space-y-6">
          <div className="space-y-3 rounded-lg border border-gray-100 bg-white p-4">
            <p className="text-sm font-semibold text-gray-800">Section intro</p>
            <Field
              label="Eyebrow"
              value={config.gridIntro.eyebrow}
              onChange={(eyebrow) => patchConfig((c) => ({ ...c, gridIntro: { ...c.gridIntro, eyebrow } }))}
            />
            <Field
              label="Title (before highlight)"
              value={config.gridIntro.titleBefore}
              onChange={(titleBefore) =>
                patchConfig((c) => ({ ...c, gridIntro: { ...c.gridIntro, titleBefore } }))
              }
            />
            <Field
              label="Title highlight"
              value={config.gridIntro.titleHighlight}
              onChange={(titleHighlight) =>
                patchConfig((c) => ({ ...c, gridIntro: { ...c.gridIntro, titleHighlight } }))
              }
            />
            <Field
              label="Description"
              value={config.gridIntro.description}
              onChange={(description) =>
                patchConfig((c) => ({ ...c, gridIntro: { ...c.gridIntro, description } }))
              }
              multiline
            />
            <Field
              label="Directions button"
              value={config.gridIntro.directionsCta}
              onChange={(directionsCta) =>
                patchConfig((c) => ({ ...c, gridIntro: { ...c.gridIntro, directionsCta } }))
              }
            />
            <Field
              label="Details button"
              value={config.gridIntro.detailsCta}
              onChange={(detailsCta) =>
                patchConfig((c) => ({ ...c, gridIntro: { ...c.gridIntro, detailsCta } }))
              }
            />
            <Field
              label="Head office badge label"
              value={config.gridIntro.headOfficeBadge}
              onChange={(headOfficeBadge) =>
                patchConfig((c) => ({ ...c, gridIntro: { ...c.gridIntro, headOfficeBadge } }))
              }
            />
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-800">Branch cards</p>
            {config.branches.map((branch, index) => (
              <BranchEditor
                key={`${branch.id}-${index}`}
                branch={branch}
                index={index}
                patchBranch={(next) =>
                  patchConfig((c) => {
                    const branches = [...c.branches];
                    branches[index] = next;
                    return { ...c, branches };
                  })
                }
              />
            ))}
          </div>
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
            label="Title (before highlight)"
            value={config.stats.titleBefore}
            onChange={(titleBefore) => patchConfig((c) => ({ ...c, stats: { ...c.stats, titleBefore } }))}
          />
          <Field
            label="Title highlight"
            value={config.stats.titleHighlight}
            onChange={(titleHighlight) =>
              patchConfig((c) => ({ ...c, stats: { ...c.stats, titleHighlight } }))
            }
          />
          {config.stats.stats.map((stat, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3 space-y-2">
              <p className="text-xs font-semibold uppercase text-gray-500">Stat {i + 1}</p>
              <Field
                label="Value"
                value={String(stat.value)}
                onChange={(raw) =>
                  patchConfig((c) => {
                    const stats = c.stats.stats.map((s, j) =>
                      j === i ? { ...s, value: Number(raw) || 0 } : s,
                    );
                    return { ...c, stats: { ...c.stats, stats } };
                  })
                }
              />
              <Field
                label="Suffix"
                value={stat.suffix}
                onChange={(suffix) =>
                  patchConfig((c) => {
                    const stats = c.stats.stats.map((s, j) => (j === i ? { ...s, suffix } : s));
                    return { ...c, stats: { ...c.stats, stats } };
                  })
                }
              />
              <Field
                label="Label"
                value={stat.label}
                onChange={(label) =>
                  patchConfig((c) => {
                    const stats = c.stats.stats.map((s, j) => (j === i ? { ...s, label } : s));
                    return { ...c, stats: { ...c.stats, stats } };
                  })
                }
              />
            </div>
          ))}
        </div>
      );
    case 'bookVisit':
      return (
        <div className="mt-4 space-y-3">
          <Field
            label="Eyebrow"
            value={config.bookVisit.eyebrow}
            onChange={(eyebrow) => patchConfig((c) => ({ ...c, bookVisit: { ...c.bookVisit, eyebrow } }))}
          />
          <Field
            label="Title (before highlight)"
            value={config.bookVisit.titleBefore}
            onChange={(titleBefore) =>
              patchConfig((c) => ({ ...c, bookVisit: { ...c.bookVisit, titleBefore } }))
            }
          />
          <Field
            label="Title highlight"
            value={config.bookVisit.titleHighlight}
            onChange={(titleHighlight) =>
              patchConfig((c) => ({ ...c, bookVisit: { ...c.bookVisit, titleHighlight } }))
            }
          />
          <Field
            label="Description"
            value={config.bookVisit.description}
            onChange={(description) =>
              patchConfig((c) => ({ ...c, bookVisit: { ...c.bookVisit, description } }))
            }
            multiline
          />
          <Field
            label="Sidebar title"
            value={config.bookVisit.sidebarTitle}
            onChange={(sidebarTitle) =>
              patchConfig((c) => ({ ...c, bookVisit: { ...c.bookVisit, sidebarTitle } }))
            }
          />
          {config.bookVisit.benefits.map((b, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3 space-y-2">
              <p className="text-xs font-semibold uppercase text-gray-500">Benefit {i + 1}</p>
              <Field
                label="Title"
                value={b.title}
                onChange={(title) =>
                  patchConfig((c) => {
                    const benefits = c.bookVisit.benefits.map((x, j) => (j === i ? { ...x, title } : x));
                    return { ...c, bookVisit: { ...c.bookVisit, benefits } };
                  })
                }
              />
              <Field
                label="Description"
                value={b.description}
                onChange={(description) =>
                  patchConfig((c) => {
                    const benefits = c.bookVisit.benefits.map((x, j) => (j === i ? { ...x, description } : x));
                    return { ...c, bookVisit: { ...c.bookVisit, benefits } };
                  })
                }
                multiline
              />
            </div>
          ))}
          <Field
            label="Hours note (under form)"
            value={config.bookVisit.hoursNote}
            onChange={(hoursNote) => patchConfig((c) => ({ ...c, bookVisit: { ...c.bookVisit, hoursNote } }))}
          />
          <Field
            label="Submit button"
            value={config.bookVisit.submitCta}
            onChange={(submitCta) => patchConfig((c) => ({ ...c, bookVisit: { ...c.bookVisit, submitCta } }))}
          />
          <Field
            label="Submit button (loading)"
            value={config.bookVisit.submitCtaLoading}
            onChange={(submitCtaLoading) =>
              patchConfig((c) => ({ ...c, bookVisit: { ...c.bookVisit, submitCtaLoading } }))
            }
          />
          <Field
            label="Prefer to call — label"
            value={config.bookVisit.preferCallText}
            onChange={(preferCallText) =>
              patchConfig((c) => ({ ...c, bookVisit: { ...c.bookVisit, preferCallText } }))
            }
          />
          <Field
            label="Prefer to call — phone display"
            value={config.bookVisit.preferCallPhoneDisplay}
            onChange={(preferCallPhoneDisplay) =>
              patchConfig((c) => ({ ...c, bookVisit: { ...c.bookVisit, preferCallPhoneDisplay } }))
            }
          />
          <Field
            label="Prefer to call — phone link"
            value={config.bookVisit.preferCallPhoneHref}
            onChange={(preferCallPhoneHref) =>
              patchConfig((c) => ({ ...c, bookVisit: { ...c.bookVisit, preferCallPhoneHref } }))
            }
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
