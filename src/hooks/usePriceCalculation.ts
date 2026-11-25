// usePriceCalculation Hook
// Marcus: "This hook handles async price fetching. A bit janky but works."

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Configuration,
  Product,
  PriceBreakdown,
} from '../components/ProductConfigurator/types';
import { calculatePrice } from '../services/api';

interface UsePriceCalculationResult {
  price: PriceBreakdown | null;
  formattedTotal: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for managing price calculation
 */
export function usePriceCalculation(
  config: Configuration | null,
  product: Product,
): UsePriceCalculationResult {
  const [price, setPrice] = useState<PriceBreakdown | null>(null);
  const [formattedTotal, setFormattedTotal] = useState<string>('$0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Incrementing ID of the most recent price request, responses from older requests are ignored

  const latestRequestIdRef = useRef(0);

  const fetchPrice = useCallback(async () => {
    if (!config) {
      setPrice(null);
      setFormattedTotal('$0.00');
      return;
    }
    latestRequestIdRef.current += 1;
    const requestId = latestRequestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const response = await calculatePrice(config, product);
      if (requestId !== latestRequestIdRef.current) return;
      setPrice(response.breakdown);
      setFormattedTotal(response.formattedTotal);
    } catch {
      if (requestId === latestRequestIdRef.current) {
        setError('ERR_PRICE_CALC_FAILED');
        setPrice(null);
      }
    } finally {
      if (requestId === latestRequestIdRef.current) setIsLoading(false);
    }
  }, [config, product]);

  // Fetch price when config changes
  useEffect(() => {
    // (claude code help to ignore)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pre-existing pattern
    fetchPrice();
  }, [config?.selections, config?.addOns, config?.quantity]);

  return {
    price,
    formattedTotal,
    isLoading,
    error,
    refetch: fetchPrice,
  };
}
