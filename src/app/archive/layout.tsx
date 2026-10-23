import type { Metadata } from 'next';

// archive/page.tsx is a client component, so its metadata lives here
export const metadata: Metadata = {
  title: 'Archive',
  description: 'Every project I have worked on, from brand sites to admin portals.',
  alternates: { canonical: '/archive' },
};

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
