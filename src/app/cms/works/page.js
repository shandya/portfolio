import WorksClient from './WorksClient';

export const dynamic = 'force-dynamic';

export default async function CmsWorksPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/works?size=100`,
    { cache: 'no-store' }
  );
  const json = await res.json();
  return <WorksClient initialData={json.data ?? []} />;
}
