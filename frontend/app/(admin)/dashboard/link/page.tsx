import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { LinkClient } from '@/components/tables/link-tables/client';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Link', link: '/dashboard/link' }
];
export default function page() {
  return (
    <PageContainer>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <LinkClient />
      </div>
    </PageContainer>
  );
}
