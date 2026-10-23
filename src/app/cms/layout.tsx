import CmsNav from './CmsNav';

export const metadata = {
  title: 'CMS',
};

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-fg">
      <CmsNav />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
