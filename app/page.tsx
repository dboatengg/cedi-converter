import Header from "@/components/  Header";
import ConverterCard from "@/components/ ConverterCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf7f0] text-neutral-900">
      <div className="flex h-1.5">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-700" />
      </div>

      <main className="mx-auto max-w-lg px-4 py-10">
        <Header />
        <ConverterCard />
        <footer className="mt-6 text-center text-xs text-neutral-500">
          Powered by Gemma 4 via the Gemini API and live exchange rates.
          AI answers are rough estimates.
        </footer>
      </main>
    </div>
  );
}