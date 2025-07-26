'use client';
import WikipediaReport from "@/components/WikipediaReport";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-white via-blue-50 to-blue-100 font-sans text-gray-800">
      
      {/* Header */}
      <header className="text-center p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold"> Live Wikipedia Revisions</h1>
      </header>

      {/* Main */}g
      <main className="flex-1 max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 px-6 sm:px-12 pb-4 overflow-hidden">
        {/* Task 1 Report */}
        <section className="bg-white rounded-2xl shadow-lg border p-4 flex flex-col overflow-hidden">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">1-Minute Report</h2>
          <div className="overflow-auto text-sm leading-relaxed space-y-2 flex-1">
            <WikipediaReport />
          </div>
        </section>

        {/* Task 2 Report */}
        <section className="bg-white rounded-2xl shadow-lg border p-4 flex flex-col overflow-hidden">
          <h2 className="text-xl font-semibold mb-2 text-green-700"> 5-Minute Report</h2>
          <div className="overflow-auto text-sm leading-relaxed space-y-2 flex-1">
            <WikipediaReport mode= {5} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-4">
        Built with Next.js & Tailwind · Wikipedia EventStream
      </footer>
    </div>
  );
}
