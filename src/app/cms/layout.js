import CmsNav from './CmsNav';

export const metadata = {
  title: 'CMS',
};

export default function CmsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-[#ccdbe0]">
      <CmsNav />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
