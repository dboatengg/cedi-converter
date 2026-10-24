const QUICK_AMOUNTS = [100, 500, 1000, 5000];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function AmountInput({ value, onChange }: Props) {
  return (
    <div>
      <label htmlFor="amount" className="mb-1.5 block text-sm font-medium">
        Amount in cedis
      </label>
      <div className="flex items-baseline gap-2 border-b-2 border-stone-300 focus-within:border-stone-900">
        <span className="font-[family-name:var(--font-mono)] text-lg text-stone-500">
          GH₵
        </span>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full bg-transparent py-2 font-[family-name:var(--font-mono)] text-3xl outline-none placeholder:text-stone-300"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onChange(String(amount))}
            className="rounded-md border border-stone-300 px-2.5 py-1 font-[family-name:var(--font-mono)] text-sm hover:border-stone-900"
          >
            {amount.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}