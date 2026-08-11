import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on first render
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [selectedKeys, setSelectedKeys] = useState(() => {
    try {
      const stored = localStorage.getItem('cartSelected');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  // Stripe e jaowar por firе eleo jate selection thake, tai localStorage e rakhi
  useEffect(() => {
    localStorage.setItem('cartSelected', JSON.stringify(selectedKeys));
  }, [selectedKeys]);

  // Add an item (or increase qty if same product + size already exists)
  const addToCart = (product, size, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(
        item => item.product === product._id && item.size === size
      );
      if (existing) {
        return prev.map(item =>
          item.product === product._id && item.size === size
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      const price = product.salePrice || product.price;
      const image = (product.images && product.images[0]) || product.imageUrl || '';
      return [...prev, {
        product: product._id,
        name: product.name,
        price,
        image,
        size,
        qty
      }];
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prev => prev.filter(
      item => !(item.product === productId && item.size === size)
    ));
  };

  const updateQty = (productId, size, qty) => {
    if (qty < 1) return;
    setCartItems(prev => prev.map(item =>
      item.product === productId && item.size === size
        ? { ...item, qty }
        : item
    ));
  };

  const clearCart = () => setCartItems([]);
  // Payment successful howar por shudhu jei item gula kena hoyeche, oigulai bag theke sorabo
  const removeSelectedItems = () => {
    setCartItems(prev =>
      prev.filter(item => !selectedKeys.includes(getKey(item.product, item.size)))
    );
    setSelectedKeys([]); // selection reset
  };

  // Ekta item er unique key
  const getKey = (productId, size) => `${productId}-${size}`;

  const toggleSelect = (productId, size) => {
    const key = getKey(productId, size);
    setSelectedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const isSelected = (productId, size) => selectedKeys.includes(getKey(productId, size));

  const selectAll = () => setSelectedKeys(cartItems.map(i => getKey(i.product, i.size)));
  const deselectAll = () => setSelectedKeys([]);

  // Shudhu select kora item gula
  const selectedItems = cartItems.filter(i => selectedKeys.includes(getKey(i.product, i.size)));

  // Totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
const selectedItemsCount = selectedItems.reduce((sum, item) => sum + item.qty, 0);
  const selectedTotalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice,
      selectedKeys, toggleSelect, isSelected, selectAll, deselectAll,
      selectedItems, selectedItemsCount, selectedTotalPrice, removeSelectedItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);