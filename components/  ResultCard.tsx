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
    return (
      <div className="mt-6 border-t border-stone-300 pt-5">
        {error && (
          <p className="text-sm text-red-800">
            Couldn&apos;t load the exchange rate.{" "}
            <button
              type="button"
              onClick={onRetry}
              className="font-medium underline underline-offset-2"
            >
              Try again
            </button>
          </p>
        )}
  
        {!error && loading && (
          <p className="text-sm text-stone-500">Loading the latest rate...</p>
        )}
  
        {!error && !loading && !converted && (
          <p className="text-sm text-stone-500">
            Enter an amount to see the result.
          </p>
        )}
  
        {!error && converted && perCedi !== null && (
          <>
            <p className="text-sm text-stone-600">That is about</p>
            <p className="font-[family-name:var(--font-mono)] text-4xl font-medium">
              {converted}
            </p>
            <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-stone-500">
              1 GH₵ = {perCedi.toFixed(4)} {target}
            </p>
          </>
        )}
      </div>
    );
  }