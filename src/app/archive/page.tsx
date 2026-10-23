"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { ApiList, PortfolioItem } from "@/types";

import Gradient from "../components/Gradient";
import Modal from "../components/Modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 20;

const SkeletonRow = ({ cols }: { cols: number }) => (
  <tr className="border-b border-slate-300 border-opacity-30 animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-5">
        <div className="h-3 bg-slate-600 bg-opacity-40 rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

export default function Archive() {
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [page, setPage] = useState(1);
  const [, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const fetchedPages = useRef(new Set<number>());
  const firstRender = useRef(true);

  // Debounce search input so we only hit the API once typing pauses
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // New search term: start again from page 1
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setPortfolioData([]);
    fetchedPages.current.clear();
    hasMoreRef.current = true;
    setHasMore(true);
    setError(null);
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    if (fetchedPages.current.has(page)) return;
    fetchedPages.current.add(page);

    let cancelled = false;
    setLoading(true);
    loadingRef.current = true;
    const q = debouncedQuery ? `&q=${encodeURIComponent(debouncedQuery)}` : "";
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/portfolio?page=${page}&size=${PAGE_SIZE}${q}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((json: ApiList<PortfolioItem>) => {
        if (cancelled) return;
        setPortfolioData((prev) => [...prev, ...json.data]);
        const more = json.meta.currentPage < json.meta.totalPages;
        setHasMore(more);
        hasMoreRef.current = more;
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to load projects. Please try again.");
        fetchedPages.current.delete(page);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        loadingRef.current = false;
      });
    return () => {
      cancelled = true;
      loadingRef.current = false;
      fetchedPages.current.delete(page);
    };
  }, [page, debouncedQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !loadingRef.current
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const handleRetry = () => {
    setError(null);
    setPortfolioData([]);
    fetchedPages.current.clear();
    hasMoreRef.current = true;
    setHasMore(true);
    setPage(1);
  };

  const handleOpenModal = (item: PortfolioItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const displayData = portfolioData;

  const isInitialLoad = loading && portfolioData.length === 0;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-10 md:py-16 lg:py-24">
      <section className="px-4 max-w-screen-xl relative z-10 w-full">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-accent opacity-60">
            Archive
          </h1>
        </header>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-b border-accent border-opacity-30 text-fg text-sm py-2 w-full focus:outline-none focus:border-opacity-100 placeholder-fg placeholder-opacity-40"
          />
        </div>

        {error ? (
          <div className="py-16 text-center">
            <p className="text-fg opacity-60 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="text-accent text-sm border border-accent border-opacity-40 px-4 py-2 rounded hover:border-opacity-100 transition-all duration-150"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <table className="-mx-4 hidden lg:table w-full">
              <thead className="mb-10 sticky bg-accent top-0 z-10 bg-opacity-30 text-fg backdrop-blur-md w-full">
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
                {isInitialLoad
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <SkeletonRow key={i} cols={6} />
                    ))
                  : displayData.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => handleOpenModal(item)}
                        tabIndex={0}
                        aria-haspopup="dialog"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleOpenModal(item);
                          }
                        }}
                        className="border-b border-slate-300 border-opacity-30 opacity-60 hover:opacity-100 ease-in transition-all duration-150 text-accent cursor-pointer"
                      >
                        <td className="px-4 py-5 text-sm text-fg">
                          {item.year}
                        </td>
                        <td className="px-4 py-5 font-semibold leading-tight">
                          {item.name}
                        </td>
                        <td className="px-4 py-5 leading-tight text-sm">
                          {item.client}
                        </td>
                        <td className="px-4 py-5 leading-tight text-sm">
                          {item.made_at}
                        </td>
                        <td className="px-4 py-5 flex flex-wrap gap-3">
                          {item.tags.split(",").map((tag, i) => (
                            <span
                              key={i}
                              className="text-accent py-1 px-3 bg-opacity-30 bg-accent inline-block rounded-3xl text-[0.7em]"
                            >
                              {tag}
                            </span>
                          ))}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            className="text-sm line-clamp-1"
                            href={item.external_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.external_url?.replace("https://", "")}
                          </a>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>

            <div className="-mx-4">
              <table className="lg:hidden w-full">
                <thead className="mb-10 sticky bg-accent top-0 z-10 bg-opacity-30 text-fg backdrop-blur-md">
                  <tr className="text-left text-sm font-semibold w-30">
                    <th className="p-4">Year</th>
                    <th className="p-4">Project</th>
                  </tr>
                </thead>
                <tbody>
                  {isInitialLoad
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonRow key={i} cols={2} />
                      ))
                    : displayData.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => handleOpenModal(item)}
                          tabIndex={0}
                          aria-haspopup="dialog"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleOpenModal(item);
                            }
                          }}
                          className="border-b border-slate-300 border-opacity-30 opacity-60 hover:opacity-100 ease-in transition-all duration-150 text-accent cursor-pointer"
                        >
                          <td className="px-4 py-5 text-sm text-fg align-top">
                            {item.year}
                          </td>
                          <td className="px-4 py-5 flex flex-col gap-4">
                            {item.name && (
                              <h3 className="font-semibold leading-tight">
                                {item.name}
                              </h3>
                            )}
                            {item.client && (
                              <p className="leading-tight text-sm">
                                {item.client}
                              </p>
                            )}
                            {item.made_at && (
                              <p className="leading-tight text-sm">
                                {item.made_at}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-3">
                              {item.tags.split(",").map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-accent py-1 px-3 bg-opacity-30 bg-accent inline-block rounded-3xl text-[0.7em]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="">
                              {item.external_url && (
                                <a
                                  className="text-[0.7em] flex gap-2 items-center underline underline-offset-4"
                                  href={item.external_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span>External url</span>
                                  <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className="-rotate-45 h-3"
                                  />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div ref={sentinelRef} className="py-4 text-center">
          {loading && portfolioData.length > 0 && (
            <span className="text-fg text-sm opacity-60">
              Loading...
            </span>
          )}
        </div>

        <footer className="py-10">
          <Link href="/" className="mb-2 inline-block text-fg">
            Back to home
          </Link>
        </footer>
      </section>

      <Gradient />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedItem?.name}
        description={selectedItem?.description}
        externalUrl={selectedItem?.external_url}
      />
    </main>
  );
}
