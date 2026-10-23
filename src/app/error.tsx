'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 text-fg">
      <p className="opacity-60">Something went wrong.</p>
      <button
        onClick={reset}
        className="text-accent text-sm border border-accent border-opacity-40 px-4 py-2 rounded hover:border-opacity-100 transition-all duration-150"
      >
        Try again
      </button>
    </main>
  );
}
