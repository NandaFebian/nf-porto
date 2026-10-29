import { ImageResponse } from 'next/og';
import { NfMark, brandNavyOnDark } from '@/components/nf-mark';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// iOS rounds the corners itself, so this is the app icon from public/nf-app-icon.svg on a square background.
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111214',
      }}
    >
      <NfMark width={108} color="#F4F2EC" armColor={brandNavyOnDark} />
    </div>,
    size,
  );
}
