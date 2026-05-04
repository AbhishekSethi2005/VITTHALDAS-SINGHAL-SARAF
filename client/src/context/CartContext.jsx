import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

const initialState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
};

function cartReducer(state, action) {
  let newItems;
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find((i) => i.product === action.payload.product);
      if (exists) {
        newItems = state.items.map((i) =>
          i.product === action.payload.product
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      return { ...state, items: newItems };
    }
    case 'REMOVE_ITEM':
      newItems = state.items.filter((i) => i.product !== action.payload);
      return { ...state, items: newItems };
    case 'UPDATE_QTY':
      newItems = state.items.map((i) =>
        i.product === action.payload.product
          ? { ...i, quantity: Math.max(1, action.payload.quantity) }
          : i
      );
      return { ...state, items: newItems };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeFromCart = (productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId });
  const updateQuantity = (product, quantity) =>
    dispatch({ type: 'UPDATE_QTY', payload: { product, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
