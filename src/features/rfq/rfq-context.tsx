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
import type { RFQFormData, RFQItem, RFQStatus, RFQSubmission } from "@/types/rfq";
import { createRFQItem, createRFQSubmission, sanitizeQuantity } from "./rfq-utils";

type RFQState = {
  items: RFQItem[];
  status: RFQStatus;
  submission: RFQSubmission | null;
};

type RFQAction =
  | { type: "hydrate"; items: RFQItem[] }
  | { type: "add-item"; product: Product; quantity?: number }
  | { type: "remove-item"; productId: string }
  | { type: "update-quantity"; productId: string; quantity: number }
  | { type: "clear-rfq" }
  | { type: "submit"; submission: RFQSubmission };

type RFQContextValue = {
  items: RFQItem[];
  status: RFQStatus;
  submission: RFQSubmission | null;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearRFQ: () => void;
  clearItems: () => void;
  getTotalItems: () => number;
  getRFQItems: () => RFQItem[];
  submitRFQ: (formData: RFQFormData) => RFQSubmission;
};

const storageKey = "incar-rfq-items";
const RFQContext = createContext<RFQContextValue | null>(null);

function rfqReducer(state: RFQState, action: RFQAction): RFQState {
  switch (action.type) {
    case "hydrate":
      return { ...state, items: action.items };
    case "add-item": {
      const quantity = sanitizeQuantity(action.quantity ?? 1);
      const existing = state.items.find((item) => item.productId === action.product.id);

      if (existing) {
        return {
          ...state,
          status: "draft",
          items: state.items.map((item) =>
            item.productId === action.product.id
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
      return { items: [], status: "draft", submission: null };
    case "submit":
      return { ...state, status: "submitted", submission: action.submission };
    default:
      return state;
  }
}

function isStoredRFQItem(item: RFQItem) {
  return Boolean(
    item.productId &&
      item.productName &&
      item.slug &&
      item.partNumber &&
      item.oemNumber &&
      item.quantity > 0,
  );
}

export function RFQProvider({ children }: { children: React.ReactNode }) {
  const hydratedRef = useRef(false);
  const [state, dispatch] = useReducer(rfqReducer, {
    items: [],
    status: "draft",
    submission: null,
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

  const submitRFQ = useCallback(
    (formData: RFQFormData) => {
      const submission = createRFQSubmission(formData, state.items);
      dispatch({ type: "submit", submission });
      return submission;
    },
    [state.items],
  );

  const value = useMemo(
    () => ({
      items: state.items,
      status: state.status,
      submission: state.submission,
      itemCount: state.items.length,
      addItem,
      removeItem,
      updateQuantity,
      clearRFQ,
      clearItems: clearRFQ,
      getTotalItems,
      getRFQItems,
      submitRFQ,
    }),
    [
      addItem,
      clearRFQ,
      getRFQItems,
      getTotalItems,
      removeItem,
      state.items,
      state.status,
      state.submission,
      submitRFQ,
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
