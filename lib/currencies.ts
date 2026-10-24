export const CURRENCIES = [
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" },
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
    { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
    { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  ] as const;
  
  export type CurrencyCode = (typeof CURRENCIES)[number]["code"];