import WorksClient from './WorksClient';
import { apiGetFresh } from '@/lib/api';
import type { ApiList, Work } from '@/types';

export const dynamic = 'force-dynamic';

export default async function CmsWorksPage() {
  const json = await apiGetFresh<ApiList<Work>>('/works?size=100');
  return <WorksClient initialData={json.data ?? []} />;
}
