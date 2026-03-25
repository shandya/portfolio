'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CmsNav() {
  const pathname = usePathname();

  const linkClass = (href) =>
    `text-sm transition-all duration-150 ${
      pathname === href ? 'opacity-100' : 'opacity-60 hover:opacity-100'
    }`;

  return (
    <nav className="border-b border-[#31ecff] border-opacity-20 px-6 py-4">
      <div className="max-w-screen-xl mx-auto flex items-center gap-6">
        <span className="text-[#31ecff] font-bold opacity-60 mr-4">CMS</span>
        <Link href="/cms/dashboard" className={linkClass('/cms/dashboard')}>
          Dashboard
        </Link>
        <Link href="/cms/portfolio" className={linkClass('/cms/portfolio')}>
          Portfolio
        </Link>
        <Link href="/cms/works" className={linkClass('/cms/works')}>
          Works
        </Link>
        <a
          href="/api/cms/auth?logout=true"
          className="text-sm opacity-60 hover:opacity-100 transition-all duration-150 ml-auto"
        >
          Logout
        </a>
      </div>
    </nav>
  );
}
