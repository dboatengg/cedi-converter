import { CURRENCIES, type CurrencyCode } from "@/lib/currencies";

type Props = {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
};

export default function CurrencyPicker({ value, onChange }: Props) {
  return (
    <div className="mt-6">
      <span className="mb-2 block text-sm font-semibold text-neutral-700">
        Convert to
      </span>
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
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "border-green-800 bg-green-800 text-white shadow-sm"
                  : "border-stone-300 bg-white text-neutral-700 hover:border-green-700"
              }`}
            >
              <span aria-hidden>{c.flag}</span>
              {c.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}