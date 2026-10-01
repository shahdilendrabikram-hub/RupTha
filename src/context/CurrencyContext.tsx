import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type CurrencyCode = 'NPR' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  nativeName: string;
  symbol: string;
  flag: string;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  NPR: {
    code: 'NPR',
    name: 'Nepali Rupee',
    nativeName: 'नेपाली रुपैयाँ',
    symbol: 'रू',
    flag: '🇳🇵'
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    nativeName: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸'
  }
};

export const DEFAULT_USD_TO_NPR_RATE = 135.00;

interface FormatPriceOptions {
  showApproxUSD?: boolean;
  showCode?: boolean;
  compact?: boolean;
  hideSymbol?: boolean;
}

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  toggleCurrency: () => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  symbol: string;
  currencyConfig: CurrencyConfig;
  convertPrice: (amountInUSD: number) => number;
  formatPrice: (amountInUSD: number, options?: FormatPriceOptions) => string;
  formatNprDirect: (nprAmount: number) => string;
  convertToUSD: (nprAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to NPR as requested by the user
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('boka_currency');
      return (saved === 'USD' || saved === 'NPR') ? saved : 'NPR';
    } catch {
      return 'NPR';
    }
  });

  const [exchangeRate, setExchangeRateState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('boka_usd_npr_rate');
      return saved ? parseFloat(saved) : DEFAULT_USD_TO_NPR_RATE;
    } catch {
      return DEFAULT_USD_TO_NPR_RATE;
    }
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem('boka_currency', code);
    } catch {
      // ignore local storage errors
    }
  };

  const toggleCurrency = () => {
    const next = currency === 'NPR' ? 'USD' : 'NPR';
    setCurrency(next);
  };

  const setExchangeRate = (rate: number) => {
    if (rate > 0) {
      setExchangeRateState(rate);
      try {
        localStorage.setItem('boka_usd_npr_rate', rate.toString());
      } catch {
        // ignore
      }
    }
  };

  const currencyConfig = useMemo(() => CURRENCY_CONFIGS[currency], [currency]);
  const symbol = currencyConfig.symbol;

  const convertPrice = (amountInUSD: number): number => {
    if (isNaN(amountInUSD)) return 0;
    if (currency === 'NPR') {
      return Math.round(amountInUSD * exchangeRate);
    }
    return Math.round(amountInUSD * 100) / 100;
  };

  const convertToUSD = (nprAmount: number): number => {
    if (isNaN(nprAmount) || exchangeRate <= 0) return 0;
    return Math.round((nprAmount / exchangeRate) * 100) / 100;
  };

  const formatNprDirect = (nprAmount: number): string => {
    const rounded = Math.round(nprAmount);
    return `रू ${rounded.toLocaleString('en-IN')}`;
  };

  const formatPrice = (amountInUSD: number, options?: FormatPriceOptions): string => {
    if (isNaN(amountInUSD)) return `${symbol}0`;

    if (currency === 'NPR') {
      const nprValue = Math.round(amountInUSD * exchangeRate);
      const formattedNum = nprValue.toLocaleString('en-IN');
      
      let res = options?.hideSymbol ? formattedNum : `रू ${formattedNum}`;

      if (options?.showCode) {
        res += ' NPR';
      }

      if (options?.showApproxUSD) {
        res += ` (~$${amountInUSD.toFixed(2)})`;
      }

      return res;
    } else {
      // USD formatting
      const formattedNum = amountInUSD.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      let res = options?.hideSymbol ? formattedNum : `$${formattedNum}`;

      if (options?.showCode) {
        res += ' USD';
      }

      return res;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        exchangeRate,
        setExchangeRate,
        symbol,
        currencyConfig,
        convertPrice,
        formatPrice,
        formatNprDirect,
        convertToUSD
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
