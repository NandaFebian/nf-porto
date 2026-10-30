import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { NfMark, brandNavy } from '@/components/nf-mark';
import { appName } from './shared';

export const ogSize = { width: 1200, height: 630 };

// Light theme of the logo kit, so a shared link looks like the site it opens.
const colors = { paper: '#f4f2ec', ink: '#111214', muted: '#5e5e64', rule: '#dddad0' };

// Bundled TTFs (OFL): satori cannot read the woff2 files next/font serves, and the build should not
// depend on reaching Google Fonts. The routes are static, so these are read once at build time.
const font = (file: string) => readFileSync(path.join(process.cwd(), 'assets/fonts', file));
const fonts = [
  { name: 'Plex Sans', data: font('IBMPlexSans-Regular.ttf'), weight: 400 as const, style: 'normal' as const },
  { name: 'Plex Sans', data: font('IBMPlexSans-SemiBold.ttf'), weight: 600 as const, style: 'normal' as const },
  { name: 'Plex Mono', data: font('IBMPlexMono-Regular.ttf'), weight: 400 as const, style: 'normal' as const },
];

export interface OgCard {
  /** Mono label in the top right, such as "project" or "skills". */
  kicker: string;
  title: string;
  /** Navy line above the title. */
  eyebrow?: string;
  description?: string;
  meta: { label: string; value: string }[];
  /** The home card already uses the name as its title, so it leaves it out of the top row. */
  showName?: boolean;
}

export function renderOgCard({ kicker, title, eyebrow, description, meta, showName = true }: OgCard) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px 72px 56px',
        background: colors.paper,
        color: colors.ink,
        fontFamily: 'Plex Sans',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <NfMark width={58} color={colors.ink} armColor={brandNavy} />
        {showName && <span style={{ fontSize: 28, fontWeight: 600 }}>{appName}</span>}
        <span style={{ marginLeft: 'auto', fontFamily: 'Plex Mono', fontSize: 22, color: colors.muted }}>{kicker}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', marginBottom: 'auto', gap: 16 }}>
        {eyebrow && <span style={{ fontSize: 28, fontWeight: 600, color: brandNavy }}>{eyebrow}</span>}
        <span
          style={{
            fontSize: title.length > 26 ? 60 : 76,
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: '-0.03em',
          }}
        >
          {title}
        </span>
        {description && (
          <span style={{ fontSize: 28, lineHeight: 1.4, color: colors.muted, maxWidth: 1000 }}>{description}</span>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          position: 'relative',
          gap: 44,
          paddingTop: 22,
          borderTop: `2px solid ${colors.rule}`,
          fontFamily: 'Plex Mono',
          fontSize: 21,
        }}
      >
        {/* The same short navy rule that opens each section on the site. */}
        <div style={{ position: 'absolute', top: -2, left: 0, width: 72, height: 2, background: brandNavy }} />
        {meta.map((item) => (
          <span key={item.label} style={{ display: 'flex', gap: 12 }}>
            <span style={{ color: colors.muted }}>{item.label}</span>
            <span>{item.value}</span>
          </span>
        ))}
      </div>
    </div>,
    { ...ogSize, fonts },
  );
}
