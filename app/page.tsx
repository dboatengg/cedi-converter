import Header from "@/components/  Header";
import ConverterCard from "@/components/ ConverterCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f5f1] text-stone-900">
      <main className="mx-auto max-w-4xl px-4 py-8 lg:py-12">
        <Header />
        <ConverterCard />
        <footer className="mt-6 text-xs text-stone-500">
          Exchange rates come from open.er-api.com. Gemma&apos;s answers are
          rough estimates, not financial advice.
        </footer>
      </main>
    </div>
  );
}