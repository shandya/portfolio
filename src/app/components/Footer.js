
import { SocialIcon } from 'react-social-icons'

export default function Footer() {

  return (
    <section className="px-4 w-full lg:fixed left-0 bottom-0 z-50">
      <footer className="max-w-screen-xl mx-auto relative">
        <div className="w-full md:w-1/2 lg:absolute left-0 py-6 md:py-16 lg:py-24 bottom-0">
          <nav className="-mx-3">
            <ul className="flex gap-4 justify-center md:justify-start">
              <li className="inline-block">
                <SocialIcon className="inline-block !w-10 !h-10 opacity-60 hover:opacity-100 ease-in transition-all duration-150" url="https://x.com/shandya" bgColor="transparent" fgColor="#31ecff" />
              </li>
              <li className="inline-block">
                <SocialIcon className="inline-block !w-10 !h-10 opacity-60 hover:opacity-100 ease-in transition-all duration-150" url="https://instagram.com/shandya" bgColor="transparent" fgColor="#31ecff" />
              </li>
              <li className="inline-block">
                <SocialIcon className="inline-block !w-10 !h-10 opacity-60 hover:opacity-100 ease-in transition-all duration-150" url="https://www.linkedin.com/in/shandya" bgColor="transparent" fgColor="#31ecff" />
              </li>
              <li className="inline-block">
                <SocialIcon className="inline-block !w-10 !h-10 opacity-60 hover:opacity-100 ease-in transition-all duration-150" url="mailto:shandy.ardiansyah@gmail.com" bgColor="transparent" fgColor="#31ecff" />
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </section>
  );
}
