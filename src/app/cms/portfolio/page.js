import PortfolioClient from './PortfolioClient';

export const dynamic = 'force-dynamic';

export default async function CmsPortfolioPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/portfolio?size=100`,
    { cache: 'no-store' }
  );
  const json = await res.json();
  return <PortfolioClient initialData={json.data ?? []} />;
}
