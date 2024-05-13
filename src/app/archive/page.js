import PortfolioInfo from '@/data/portfolio.json'

import Gradient from "../components/Gradient";

export default function Archive() {
  const portfolioData = PortfolioInfo.Portfolio

  const Arrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" fill='#31ecff'/></svg>
  )

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-10 md:py-16 lg:py-24">
      <section className="px-4 max-w-screen-xl relative z-10">
        <header className="mb-10">
          {/* <a href="/" className="text-xl mb-2 inline-block text-[#ccdbe0]">Return</a> */}
          <h1 className="text-4xl font-bold text-[#31ecff] opacity-60">Archive</h1>
        </header>

        <div className="">
          <table className="-mx-4 hidden lg:block">
            <thead className="mb-10 sticky bg-[#31ecff] top-0 z-10 bg-opacity-30 text-[#ccdbe0]">
              <tr className="text-left text-sm font-semibold">
                <th className="p-4">Year</th>
                <th className="p-4 w-1/4">Project</th>
                <th className="p-4 w-1/6">Client</th>
                <th className="p-4 w-1/6 whitespace-nowrap">Made At</th>
                <th className="p-4 w-1/6">Technology</th>
                <th className="p-4 whitespace-nowrap">External Link</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.map((item, index) => (
                <tr key={index} className="border-b border-slate-300 border-opacity-30 md:opacity-60 hover:opacity-100 ease-in transition-all duration-150 text-[#31ecff]">
                  <td className="px-4 py-5 text-sm text-[#ccdbe0]">{item.year}</td>
                  <td className="px-4 py-5 font-semibold leading-tight">{item.name}</td>
                  <td className="px-4 py-5 leading-tight text-sm">{item.client}</td>
                  <td className="px-4 py-5 leading-tight text-sm">{item.made_at}</td>
                  <td className="px-4 py-5 flex flex-wrap gap-3">
                    {item.tags.split(',').map((item, i) => (
                      <span key={i} className="text-[#31ecff] py-1 px-3 bg-opacity-30 bg-[#31ecff] inline-block rounded-3xl text-[0.7em]">
                        {item}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    <a className="text-sm line-clamp-1" href={item.external_url} target="_blank">{item.external_url.replace('https://', '')}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="-mx-4">
            <table className="lg:hidden w-full">
              <thead className="mb-10 sticky bg-[#31ecff] top-0 z-10 bg-opacity-30 text-[#ccdbe0]">
                <tr className="text-left text-sm font-semibold w-30">
                  <th className="p-4">Year</th>
                  <th className="p-4">Project</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.map((item, index) => (
                  <tr key={index} className="border-b border-slate-300 border-opacity-30 opacity-60 hover:opacity-100 ease-in transition-all duration-150 text-[#31ecff]">
                    <td className="px-4 py-5 text-sm text-[#ccdbe0] align-top">{item.year}</td>
                    <td className="px-4 py-5 flex flex-col gap-4">
                      {item.name && <h3 className="font-semibold leading-tight">{item.name}</h3>}
                      {item.client && <p className="leading-tight text-sm">{item.client}</p>}
                      {item.made_at && <p className="leading-tight text-sm">{item.made_at}</p>}
                      <div className="flex flex-wrap gap-3">
                        {item.tags.split(',').map((item, i) => (
                          <span key={i} className="text-[#31ecff] py-1 px-3 bg-opacity-30 bg-[#31ecff] inline-block rounded-3xl text-[0.7em]">
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="">
                        {item.external_url &&
                          <a className="text-[0.7em] flex gap-2 items-center underline underline-offset-4" href={item.external_url} target="_blank">
                            <span>External url</span>
                            <div className="scale-[0.6] -ml-2">
                              <Arrow />
                            </div>
                          </a>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="py-10">
          <a href="/" className="mb-2 inline-block text-[#ccdbe0]">Back to home</a>
        </footer>
      </section>

      <Gradient />
    </main>
  );
}
