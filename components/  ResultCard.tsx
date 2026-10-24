type Props = {
    converted: string | null;
    perCedi: number | null;
    target: string;
    loading: boolean;
    error: boolean;
    onRetry: () => void;
  };
  
  export default function ResultCard({
    converted,
    perCedi,
    target,
    loading,
    error,
    onRetry,
  }: Props) {
    if (error) {
      return (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800">
          <span>Couldn&apos;t load the live exchange rate.</span>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-red-700 px-3 py-1.5 font-semibold text-white"
          >
            Try again
          </button>
        </div>
      );
    }
  
    if (loading) {
      return (
        <div className="mt-6 h-28 animate-pulse rounded-2xl bg-stone-200" aria-label="Loading live rate" />
      );
    }
  
    if (!converted || perCedi === null) {
      return (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 p-6 text-center text-sm text-neutral-500">
          Enter an amount to see the conversion.
        </div>
      );
    }
  
    return (
      <div className="mt-6 rounded-2xl bg-[linear-gradient(135deg,#14532d,#15803d)] p-6 text-white shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-green-200">
          You&apos;d get
        </p>
        <p className="mt-1 text-4xl font-bold">{converted}</p>
        <p className="mt-2 text-xs text-green-100">
          1 GH₵ = {perCedi.toFixed(4)} {target} · live rate
        </p>
      </div>
    );
  }