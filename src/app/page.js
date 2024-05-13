import Image from "next/image";

import WorkInfo from '@/data/work.json'
import PortfolioInfo from '@/data/portfolio.json'

import Gradient from "@/app/components/Gradient";
import Footer from "@/app/components/Footer";


import "@/app/globals.css";

export default function Home() {
  const workData = WorkInfo.Work
  const portfolioData = PortfolioInfo.Portfolio

  return (
    <main className="flex min-h-screen flex-col items-center justify-between lg:py-12">
      <section className="px-4 w-full lg:fixed top-0 left-0 z-50">
        <header className="max-w-screen-xl mx-auto relative">
          <div className="w-full md:w-1/2 lg:absolute left-0 py-6 md:py-16 lg:py-24">
            <h1 className="text-4xl font-bold text-[#31ecff] opacity-60 mb-2">Shandy Ardiansyah</h1>
            <p className="text-xl inline-block text-[#ccdbe0]">Frontend Developer</p>

            <nav className="mt-10">
              <ul className="text-[#ccdbe0] flex lg:flex-col gap-4 flex-wrap text-sm lg:text-base">
                <li>
                  <a className="opacity-60 hover:opacity-100 ease-in transition-all duration-150" href="#about">About</a>
                </li>
                <li>
                  <a className="opacity-60 hover:opacity-100 ease-in transition-all duration-150" href="#experience">Experience</a>
                </li>
                <li>
                  <a className="opacity-60 hover:opacity-100 ease-in transition-all duration-150" href="#projects">Projects</a>
                </li>
                <li>
                  <a className="opacity-60 hover:opacity-100 ease-in transition-all duration-150" href="/archive">Archive</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </section>

      <section id="about" className="py-10 md:py-12 relative z-20 w-full">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-full md:w-1/2 ml-auto px-4">
            <h2 className="text-[#31ecff] opacity-60 text-lg mb-4 font-semibold">About</h2>

            <p className="text-[#ccdbe0] text-sm mb-4">I'm a Front End Developer with ten years of experience building websites in the tech & creative advertising industries. I am passionate about creating intuitive web experiences using the latest technologies in the market.</p>
            <p className="text-[#ccdbe0] text-sm">I have developed websites for numerous brands and campaigns in F&B, banking, technology, and education and
entertainment industries. I also picked up back end development here and there along my career in the industry, but hey
there are still a lot to learn!</p>          
          </div>
        </div>
      </section>

      <section id="experience" className="py-10 md:py-12 relative z-20 w-full">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-full md:w-1/2 ml-auto px-4">
            <h2 className="text-[#31ecff] opacity-60 text-lg mb-4 font-semibold">Experience</h2>

            <table className="-mx-4 w-full">
              <tbody>
                {workData.map((item, index) => (
                  <tr key={index} className="border-b border-slate-300 border-opacity-30 opacity-60 hover:opacity-100 ease-in transition-all duration-150 text-[#31ecff]">
                    <td className="px-4 py-5 text-sm text-[#ccdbe0] align-top whitespace-nowrap w-30">{item.time}</td>
                    <td className="px-4 py-5 flex flex-col gap-4">
                      {item.title && <h3 className="font-semibold leading-tight">{item.title}</h3>}
                      {item.company_name && <p className="leading-tight text-sm">{item.company_name}</p>}
                      {item.location && <p className="leading-tight text-sm">{item.location}</p>}
                      {/* <div className="flex flex-wrap gap-3">
                        {item.tags.split(',').map((item, i) => (
                          <span key={i} className="text-[#31ecff] py-1 px-3 bg-opacity-30 bg-[#31ecff] inline-block rounded-3xl text-[0.7em]">
                            {item}
                          </span>
                        ))}
                      </div> */}
                      {/* {item.external_url && <a className="text-sm line-clamp-1" href={item.external_url} target="_blank">{item.external_url.replace('https://', '')}</a>} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-8 inline-block text-[#ccdbe0] text-sm">Request for full resume? <a href="mailto:shandy.ardiansyah@gmail.com" className="text-[#31ecff]">Mail me.</a></p>
          </div>
        </div>
      </section>

      <section id="projects" className="py-10 md:py-12 relative z-20 w-full">
        <div className="max-w-screen-xl mx-auto">
          <div className="w-full md:w-1/2 ml-auto px-4">
            <h2 className="text-[#31ecff] opacity-60 text-lg mb-4 font-semibold">Projects</h2>

            <table className="-mx-4 w-full">
              {/* <thead className="mb-10 sticky bg-[#31ecff] top-0 z-10 bg-opacity-30 text-[#ccdbe0]">
                <tr className="text-left text-sm font-semibold">
                  <th className="p-4">Year</th>
                  <th className="p-4">Project</th>
                </tr>
              </thead> */}
              <tbody>
                {portfolioData.filter((item) => (item.highlight)).map((item, index) => (
                  <tr key={index} className="border-b border-slate-300 border-opacity-30 opacity-60 hover:opacity-100 ease-in transition-all duration-150 text-[#31ecff]">
                    <td className="px-4 py-5 text-sm text-[#ccdbe0] align-top w-32">{item.year}</td>
                    <td className="px-4 py-5 flex flex-col gap-4">
                      {item.name && <h3 className="font-semibold leading-tight">{item.name}</h3>}
                      {/* {item.client && <p className="leading-tight text-sm">{item.client}</p>}
                      {item.made_at && <p className="leading-tight text-sm">{item.made_at}</p>} */}
                      <div className="flex flex-wrap gap-3">
                        {item.tags.split(',').map((item, i) => (
                          <span key={i} className="text-[#31ecff] py-1 px-3 bg-opacity-30 bg-[#31ecff] inline-block rounded-3xl text-[0.7em]">
                            {item}
                          </span>
                        ))}
                      </div>
                      {item.external_url && <a className="text-sm line-clamp-1" href={item.external_url} target="_blank">{item.external_url.replace('https://', '')}</a>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <a href="/archive" className="mt-8 inline-block text-[#ccdbe0] text-sm">View Full Archive</a>
          </div>
        </div>
      </section>


      <Footer />
      <Gradient />
    </main>
  );
}
