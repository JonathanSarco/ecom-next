import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  const [totalPrice, setTotalPrice] = useState();

  const [totalQuantities, setTotalQuantities] = useState(0);

  const [qty, setQty] = useState(1);

  const increaseQuantity = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decreaseQuantity = () => {
    setQty((prevQty) => {
      if (prevQty < 1) return 1;
      else return prevQty - 1;
    });
  };

  const onAddItemToCart = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantites) => prevTotalQuantites + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
        }
      });
      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        setTotalQuantities,
        qty,
        increaseQuantity,
        decreaseQuantity,
        onAddItemToCart,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);