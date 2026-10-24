import { CURRENCIES, type CurrencyCode } from "@/lib/currencies";

type Props = {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
};

export default function CurrencyPicker({ value, onChange }: Props) {
  return (
    <div className="mt-6">
      <span className="mb-1.5 block text-sm font-medium">Convert to</span>
      <div className="flex flex-wrap gap-2">
        {CURRENCIES.map((c) => {
          const active = c.code === value;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onChange(c.code)}
              aria-pressed={active}
              title={c.name}
              className={`rounded-md border px-3 py-1.5 font-[family-name:var(--font-mono)] text-sm ${
                active
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 hover:border-stone-900"
              }`}
            >
              {c.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}