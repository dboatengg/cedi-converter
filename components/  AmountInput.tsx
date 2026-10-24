const QUICK_AMOUNTS = [100, 500, 1000, 5000];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function AmountInput({ value, onChange }: Props) {
  return (
    <div>
      <label
        htmlFor="amount"
        className="mb-2 block text-sm font-semibold text-neutral-700"
      >
        Amount
      </label>
      <div className="flex items-center rounded-2xl border border-stone-300 bg-white focus-within:border-green-700 focus-within:ring-4 focus-within:ring-green-700/15">
        <span className="pl-4 text-lg font-semibold text-neutral-500">GH₵</span>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="w-full bg-transparent px-3 py-4 text-2xl font-semibold text-neutral-900 outline-none placeholder:text-neutral-300"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onChange(String(amount))}
            className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-stone-200"
          >
            {amount.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}