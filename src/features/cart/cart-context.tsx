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
import type { CartItem } from "./contracts";

function sanitizeQuantity(quantity: number) {
  return Number.isFinite(quantity)
    ? Math.min(999_999, Math.max(1, Math.floor(quantity)))
    : 1;
}

type CartState = { items: CartItem[] };

type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add-item"; item: CartItem }
  | { type: "remove-item"; productId: string }
  | { type: "update-quantity"; productId: string; quantity: number }
  | { type: "update-price"; productId: string; unitPriceUsd: string }
  | { type: "clear-cart" };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalUsd: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updatePrice: (productId: string, unitPriceUsd: string) => void;
  clearCart: () => void;
};

const storageKey = "incar-cart-items";
const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add-item": {
      const existing = state.items.find((item) => item.productId === action.item.productId);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === action.item.productId
              ? { ...item, quantity: sanitizeQuantity(item.quantity + action.item.quantity) }
              : item,
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "remove-item":
      return { items: state.items.filter((item) => item.productId !== action.productId) };
    case "update-quantity":
      return {
        items: state.items.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: sanitizeQuantity(action.quantity) }
            : item,
        ),
      };
    case "update-price":
      return {
        items: state.items.map((item) =>
          item.productId === action.productId ? { ...item, unitPriceUsd: action.unitPriceUsd } : item,
        ),
      };
    case "clear-cart":
      return { items: [] };
    default:
      return state;
  }
}

function isStoredCartItem(item: CartItem) {
  return Boolean(
    item &&
      item.productId &&
      item.slug &&
      (item.nameAr || item.nameEn) &&
      typeof item.unitPriceUsd === "string" &&
      item.quantity > 0,
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const hydratedRef = useRef(false);
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    hydratedRef.current = true;
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as CartItem[];
      dispatch({ type: "hydrate", items: parsed.filter(isStoredCartItem) });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    window.localStorage.setItem(storageKey, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    dispatch({ type: "add-item", item: { ...item, quantity: sanitizeQuantity(quantity) } });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "remove-item", productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "update-quantity", productId, quantity });
  }, []);

  const updatePrice = useCallback((productId: string, unitPriceUsd: string) => {
    dispatch({ type: "update-price", productId, unitPriceUsd });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "clear-cart" });
  }, []);

  const itemCount = useMemo(
    () => state.items.reduce((total, item) => total + item.quantity, 0),
    [state.items],
  );

  const subtotalUsd = useMemo(
    () => state.items.reduce((total, item) => total + Number(item.unitPriceUsd) * item.quantity, 0),
    [state.items],
  );

  const value = useMemo(
    () => ({ items: state.items, itemCount, subtotalUsd, addItem, removeItem, updateQuantity, updatePrice, clearCart }),
    [state.items, itemCount, subtotalUsd, addItem, removeItem, updateQuantity, updatePrice, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}

export function useCart() {
  return useCartContext();
}
