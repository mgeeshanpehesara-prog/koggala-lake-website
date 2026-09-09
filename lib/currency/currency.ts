import { Currency } from "@/lib/types";

export type CurrencyOption = { code: Currency; name: string; flag: string };

export const POPULAR_CURRENCIES: CurrencyOption[] = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" }, { code: "EUR", name: "Euro", flag: "🇪🇺" }, { code: "GBP", name: "British Pound", flag: "🇬🇧" }, { code: "LKR", name: "Sri Lankan Rupee", flag: "🇱🇰" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" }, { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" }, { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" }, { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" }, { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" }, { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" }, { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
];

const OTHER_CURRENCY_DATA: [string, string, string][] = [
  ["AFN", "Afghan Afghani", "🇦🇫"], ["ALL", "Albanian Lek", "🇦🇱"], ["AMD", "Armenian Dram", "🇦🇲"], ["ANG", "Netherlands Antillean Guilder", "🇨🇼"], ["AOA", "Angolan Kwanza", "🇦🇴"], ["ARS", "Argentine Peso", "🇦🇷"], ["AWG", "Aruban Florin", "🇦🇼"], ["AZN", "Azerbaijani Manat", "🇦🇿"],
  ["BAM", "Bosnia-Herzegovina Mark", "🇧🇦"], ["BBD", "Barbadian Dollar", "🇧🇧"], ["BDT", "Bangladeshi Taka", "🇧🇩"], ["BGN", "Bulgarian Lev", "🇧🇬"], ["BHD", "Bahraini Dinar", "🇧🇭"], ["BIF", "Burundian Franc", "🇧🇮"], ["BMD", "Bermudan Dollar", "🇧🇲"], ["BND", "Brunei Dollar", "🇧🇳"],
  ["BOB", "Bolivian Boliviano", "🇧🇴"], ["BRL", "Brazilian Real", "🇧🇷"], ["BSD", "Bahamian Dollar", "🇧🇸"], ["BTN", "Bhutanese Ngultrum", "🇧🇹"], ["BWP", "Botswanan Pula", "🇧🇼"], ["BYN", "Belarusian Ruble", "🇧🇾"], ["BZD", "Belize Dollar", "🇧🇿"], ["CDF", "Congolese Franc", "🇨🇩"],
  ["CLP", "Chilean Peso", "🇨🇱"], ["COP", "Colombian Peso", "🇨🇴"], ["CRC", "Costa Rican Colón", "🇨🇷"], ["CUP", "Cuban Peso", "🇨🇺"], ["CVE", "Cape Verdean Escudo", "🇨🇻"], ["CZK", "Czech Koruna", "🇨🇿"], ["DJF", "Djiboutian Franc", "🇩🇯"], ["DKK", "Danish Krone", "🇩🇰"],
  ["DOP", "Dominican Peso", "🇩🇴"], ["DZD", "Algerian Dinar", "🇩🇿"], ["EGP", "Egyptian Pound", "🇪🇬"], ["ERN", "Eritrean Nakfa", "🇪🇷"], ["ETB", "Ethiopian Birr", "🇪🇹"], ["FJD", "Fijian Dollar", "🇫🇯"], ["GEL", "Georgian Lari", "🇬🇪"], ["GHS", "Ghanaian Cedi", "🇬🇭"],
  ["GMD", "Gambian Dalasi", "🇬🇲"], ["GNF", "Guinean Franc", "🇬🇳"], ["GTQ", "Guatemalan Quetzal", "🇬🇹"], ["HKD", "Hong Kong Dollar", "🇭🇰"], ["HNL", "Honduran Lempira", "🇭🇳"], ["HRK", "Croatian Kuna", "🇭🇷"], ["HTG", "Haitian Gourde", "🇭🇹"], ["HUF", "Hungarian Forint", "🇭🇺"],
  ["IDR", "Indonesian Rupiah", "🇮🇩"], ["ILS", "Israeli New Shekel", "🇮🇱"], ["IQD", "Iraqi Dinar", "🇮🇶"], ["IRR", "Iranian Rial", "🇮🇷"], ["ISK", "Icelandic Króna", "🇮🇸"], ["JMD", "Jamaican Dollar", "🇯🇲"], ["JOD", "Jordanian Dinar", "🇯🇴"], ["KES", "Kenyan Shilling", "🇰🇪"],
  ["KHR", "Cambodian Riel", "🇰🇭"], ["KMF", "Comorian Franc", "🇰🇲"], ["KRW", "South Korean Won", "🇰🇷"], ["KWD", "Kuwaiti Dinar", "🇰🇼"], ["KZT", "Kazakhstani Tenge", "🇰🇿"], ["LAK", "Laotian Kip", "🇱🇦"], ["LBP", "Lebanese Pound", "🇱🇧"], ["MAD", "Moroccan Dirham", "🇲🇦"],
  ["MDL", "Moldovan Leu", "🇲🇩"], ["MGA", "Malagasy Ariary", "🇲🇬"], ["MKD", "Macedonian Denar", "🇲🇰"], ["MMK", "Myanmar Kyat", "🇲🇲"], ["MNT", "Mongolian Tugrik", "🇲🇳"], ["MOP", "Macanese Pataca", "🇲🇴"], ["MUR", "Mauritian Rupee", "🇲🇺"], ["MVR", "Maldivian Rufiyaa", "🇲🇻"],
  ["MWK", "Malawian Kwacha", "🇲🇼"], ["MXN", "Mexican Peso", "🇲🇽"], ["MYR", "Malaysian Ringgit", "🇲🇾"], ["MZN", "Mozambican Metical", "🇲🇿"], ["NAD", "Namibian Dollar", "🇳🇦"], ["NGN", "Nigerian Naira", "🇳🇬"], ["NIO", "Nicaraguan Córdoba", "🇳🇮"], ["NOK", "Norwegian Krone", "🇳🇴"],
  ["NPR", "Nepalese Rupee", "🇳🇵"], ["NZD", "New Zealand Dollar", "🇳🇿"], ["OMR", "Omani Rial", "🇴🇲"], ["PEN", "Peruvian Sol", "🇵🇪"], ["PGK", "Papua New Guinean Kina", "🇵🇬"], ["PHP", "Philippine Peso", "🇵🇭"], ["PKR", "Pakistani Rupee", "🇵🇰"], ["PLN", "Polish Zloty", "🇵🇱"],
  ["PYG", "Paraguayan Guarani", "🇵🇾"], ["QAR", "Qatari Rial", "🇶🇦"], ["RON", "Romanian Leu", "🇷🇴"], ["RSD", "Serbian Dinar", "🇷🇸"], ["RUB", "Russian Ruble", "🇷🇺"], ["RWF", "Rwandan Franc", "🇷🇼"], ["SAR", "Saudi Riyal", "🇸🇦"], ["SBD", "Solomon Islands Dollar", "🇸🇧"],
  ["SCR", "Seychellois Rupee", "🇸🇨"], ["SDG", "Sudanese Pound", "🇸🇩"], ["SEK", "Swedish Krona", "🇸🇪"], ["THB", "Thai Baht", "🇹🇭"], ["TND", "Tunisian Dinar", "🇹🇳"], ["TRY", "Turkish Lira", "🇹🇷"], ["TTD", "Trinidad & Tobago Dollar", "🇹🇹"], ["TZS", "Tanzanian Shilling", "🇹🇿"],
  ["UAH", "Ukrainian Hryvnia", "🇺🇦"], ["UGX", "Ugandan Shilling", "🇺🇬"], ["UYU", "Uruguayan Peso", "🇺🇾"], ["UZS", "Uzbekistani Som", "🇺🇿"], ["VES", "Venezuelan Bolívar", "🇻🇪"], ["VND", "Vietnamese Dong", "🇻🇳"], ["VUV", "Vanuatu Vatu", "🇻🇺"], ["WST", "Samoan Tala", "🇼🇸"], ["XAF", "Central African CFA Franc", "🌍"], ["XCD", "East Caribbean Dollar", "🌎"], ["XOF", "West African CFA Franc", "🌍"], ["XPF", "CFP Franc", "🌊"], ["ZAR", "South African Rand", "🇿🇦"], ["ZMW", "Zambian Kwacha", "🇿🇲"],
];

export const OTHER_CURRENCIES: CurrencyOption[] = OTHER_CURRENCY_DATA.map(([code, name, flag]) => ({ code, name, flag }));
export const ALL_CURRENCIES = [...POPULAR_CURRENCIES, ...OTHER_CURRENCIES];

export function convertPrice(amount: number, fromCurrency: Currency, toCurrency: Currency, rates: Record<string, number>): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  if (!fromRate || !toRate) return amount;
  return (amount / fromRate) * toRate;
}

export function formatPrice(amount: number, currency: Currency): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, currencyDisplay: "symbol", maximumFractionDigits: currency === "JPY" || currency === "KRW" ? 0 : 2 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
}
