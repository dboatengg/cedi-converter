export default function Header() {
    return (
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cedi Converter</h1>
          <p className="mt-1 text-sm text-neutral-600">
            See what your cedis are worth, then ask AI what that really buys.
          </p>
        </div>
        <p className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
          Hacktoberfest 2026 · Built with Gemma 4
        </p>
      </header>
    );
  }