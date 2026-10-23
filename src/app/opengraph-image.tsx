import { ImageResponse } from 'next/og';
import OgCard, { OG_SIZE } from '@/app/components/OgCard';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const alt = `${SITE_NAME} — Frontend Developer`;
export const size = OG_SIZE;
export const contentType = 'image/png';
// next/og's bundled font fails to load under the Node runtime on Windows; edge works everywhere
export const runtime = 'edge';

export default function Image() {
  return new ImageResponse(
    <OgCard eyebrow="Portfolio" title={SITE_NAME} footer={`Frontend Developer · ${new URL(SITE_URL).host}`} />,
    size,
  );
}
