export const initialState = { items: [], couponCode: null, couponData: null };

export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { productId, title, price, qty = 1 } = action.payload;
      const idx = state.items.findIndex((i) => i.productId === productId);
      const items = [...state.items];
      if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + qty };
      else items.push({ productId, title, price, qty });
      return { ...state, items };
    }
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(
          (i) => i.productId !== action.payload.productId
        ),
      };
    case "QTY": {
      const { productId, qty } = action.payload;
      const items = state.items.map((i) =>
        i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i
      );
      return { ...state, items };
    }
    case "SET_COUPON":
      return {
        ...state,
        couponCode: action.payload.code,
        couponData: action.payload.data || null,
      };
    case "CLEAR":
      return { items: [], couponCode: null, couponData: null };
    default:
      return state;
  }
}
