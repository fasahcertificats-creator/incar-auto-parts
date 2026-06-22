"use client";

import { useRFQContext } from "./rfq-context";

export function useRFQ() {
  return useRFQContext();
}

export const useRfq = useRFQ;
