export default function Header() {
    return (
      <header className="mb-8 text-center">
        <p className="mb-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
          Hacktoberfest 2026 · Built with Gemma 4
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Cedi Converter</h1>
        <p className="mt-2 text-neutral-600">
          See what your cedis are worth, then ask AI what that really buys.
        </p>
      </header>
    );
  }