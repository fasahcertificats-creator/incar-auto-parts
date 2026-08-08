"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { Product } from "@/types";
import type { RFQItem, RFQStatus } from "@/types/rfq";
import { createRFQItem, sanitizeQuantity } from "./rfq-utils";

type RFQState = {
  items: RFQItem[];
  status: RFQStatus;
};

type RFQAction =
  | { type: "hydrate"; items: RFQItem[] }
  | { type: "add-item"; product: Product; quantity?: number }
  | { type: "remove-item"; productId: string }
  | { type: "update-quantity"; productId: string; quantity: number }
  | { type: "clear-rfq" };

type RFQContextValue = {
  items: RFQItem[];
  status: RFQStatus;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearRFQ: () => void;
  clearItems: () => void;
  getTotalItems: () => number;
  getRFQItems: () => RFQItem[];
};

const storageKey = "incar-rfq-items";
const RFQContext = createContext<RFQContextValue | null>(null);

function rfqReducer(state: RFQState, action: RFQAction): RFQState {
  switch (action.type) {
    case "hydrate":
      return { ...state, items: action.items };
    case "add-item": {
      const quantity = sanitizeQuantity(action.quantity ?? 1);
      const existing = state.items.find(
        (item) => item.productId === action.product.internalProductId,
      );

      if (existing) {
        return {
          ...state,
          status: "draft",
          items: state.items.map((item) =>
            item.productId === action.product.internalProductId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }

      return {
        ...state,
        status: "draft",
        items: [...state.items, createRFQItem(action.product, quantity)],
      };
    }
    case "remove-item":
      return {
        ...state,
        status: "draft",
        items: state.items.filter((item) => item.productId !== action.productId),
      };
    case "update-quantity":
      return {
        ...state,
        status: "draft",
        items: state.items.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: sanitizeQuantity(action.quantity) }
            : item,
        ),
      };
    case "clear-rfq":
      return { items: [], status: "draft" };
    default:
      return state;
  }
}

function isStoredRFQItem(item: RFQItem) {
  return Boolean(
    item.productId &&
      item.productName &&
      item.slug &&
      (item.partNumber || item.oemNumber) &&
      item.quantity > 0,
  );
}

export function RFQProvider({ children }: { children: React.ReactNode }) {
  const hydratedRef = useRef(false);
  const [state, dispatch] = useReducer(rfqReducer, {
    items: [],
    status: "draft",
  });

  useEffect(() => {
    hydratedRef.current = true;
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as RFQItem[];
      dispatch({ type: "hydrate", items: parsed.filter(isStoredRFQItem) });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    window.localStorage.setItem(storageKey, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: "add-item", product, quantity });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "remove-item", productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "update-quantity", productId, quantity });
  }, []);

  const clearRFQ = useCallback(() => {
    dispatch({ type: "clear-rfq" });
  }, []);

  const getTotalItems = useCallback(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items],
  );

  const getRFQItems = useCallback(() => state.items, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      status: state.status,
      itemCount: state.items.length,
      addItem,
      removeItem,
      updateQuantity,
      clearRFQ,
      clearItems: clearRFQ,
      getTotalItems,
      getRFQItems,
    }),
    [
      addItem,
      clearRFQ,
      getRFQItems,
      getTotalItems,
      removeItem,
      state.items,
      state.status,
      updateQuantity,
    ],
  );

  return <RFQContext.Provider value={value}>{children}</RFQContext.Provider>;
}

export function useRFQContext() {
  const context = useContext(RFQContext);
  if (!context) {
    throw new Error("useRFQ must be used inside RFQProvider");
  }

  return context;
}
