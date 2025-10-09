"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { cartReducer, initialState } from "./cartReducer";

const CartCtx = createContext(null);
const KEY = "disagro_cart_v1";

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const api = {
    cart,
    addItem: (item) => dispatch({ type: "ADD", payload: item }),
    removeItem: (productId) =>
      dispatch({ type: "REMOVE", payload: { productId } }),
    updateQty: (productId, qty) =>
      dispatch({ type: "QTY", payload: { productId, qty } }),
    clearCart: () => dispatch({ type: "CLEAR" }),
    setCoupon: (code, data) =>
      dispatch({ type: "SET_COUPON", payload: { code, data } }),
  };

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
