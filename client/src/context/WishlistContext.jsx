// import { createContext, useContext, useState, useEffect } from 'react';

// const WishlistContext = createContext();

// export const WishlistProvider = ({ children }) => {
//   // Load wishlist from localStorage on first render
//   const [wishlist, setWishlist] = useState(() => {
//     try {
//       const stored = localStorage.getItem('wishlist');
//       return stored ? JSON.parse(stored) : [];
//     } catch {
//       return [];
//     }
//   });

//   // Save to localStorage whenever wishlist changes
//   useEffect(() => {
//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
//   }, [wishlist]);

//   // Check if a product is already saved
//   const isSaved = (productId) => {
//     return wishlist.some(item => item._id === productId);
//   };

//   // Add or remove (toggle) a product
//   const toggleWishlist = (product) => {
//     setWishlist(prev => {
//       const exists = prev.find(item => item._id === product._id);
//       if (exists) {
//         // Remove
//         return prev.filter(item => item._id !== product._id);
//       }
//       // Add — store the fields we need to display it later
//       return [...prev, {
//         _id: product._id,
//         name: product.name,
//         price: product.price,
//         salePrice: product.salePrice,
//         images: product.images,
//         imageUrl: product.imageUrl
//       }];
//     });
//   };

//   const removeFromWishlist = (productId) => {
//     setWishlist(prev => prev.filter(item => item._id !== productId));
//   };

//   const clearWishlist = () => setWishlist([]);

//   const totalSaved = wishlist.length;

//   return (
//     <WishlistContext.Provider value={{
//       wishlist, isSaved, toggleWishlist, removeFromWishlist, clearWishlist, totalSaved
//     }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => useContext(WishlistContext);

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

const getStorageKey = (userId) => `wishlist_${userId || 'guest'}`;

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = getStorageKey(user?._id);

  const [wishlist, setWishlist] = useState([]);

  // Whenever the logged-in user changes, load THAT user's wishlist
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setWishlist(stored ? JSON.parse(stored) : []);
    } catch {
      setWishlist([]);
    }
  }, [storageKey]);

  // Save to localStorage under the current user's key whenever wishlist changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(wishlist));
  }, [wishlist, storageKey]);

  // Check if a product is already saved
  const isSaved = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  // Add or remove (toggle) a product
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.filter(item => item._id !== product._id);
      }
      return [...prev, {
        _id: product._id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        images: product.images,
        imageUrl: product.imageUrl
      }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item._id !== productId));
  };

  const clearWishlist = () => setWishlist([]);

  const totalSaved = wishlist.length;

  return (
    <WishlistContext.Provider value={{
      wishlist, isSaved, toggleWishlist, removeFromWishlist, clearWishlist, totalSaved
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);