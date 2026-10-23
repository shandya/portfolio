import PortfolioClient from './PortfolioClient';
import { apiGetFresh } from '@/lib/api';
import type { ApiList, PortfolioItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function CmsPortfolioPage() {
  const json = await apiGetFresh<ApiList<PortfolioItem>>('/portfolio?size=100');
  return <PortfolioClient initialData={json.data ?? []} />;
}
