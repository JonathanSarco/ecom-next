import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Action } from "../util/Constants";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct;
  let index;

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

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((item) => item._id === id);

    let withoutElementCartItems = cartItems.filter((item) => item._id !== id);
    if (value === Action.INC) {
      let newNewCartItem = [
        ...withoutElementCartItems,
        {
          ...foundProduct,
          quantity: foundProduct.quantity + 1,
        },
      ];

      setCartItems(newNewCartItem);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantites) => prevTotalQuantites + 1);
    } else if (value === Action.DEC) {
      if (foundProduct.quantity > 1) {
        let newNewCartItem = [
          ...withoutElementCartItems,
          {
            ...foundProduct,
            quantity: foundProduct.quantity - 1,
          },
        ];

        setCartItems(newNewCartItem);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantites) => prevTotalQuantites - 1);
      }
    }
  };

  const onRemoveItem = (product) => {
    console.log("product ", product);

    foundProduct = cartItems.find((item) => item._id === product._id);

    console.log("found product ", foundProduct);

    let withoutElementCartItems = cartItems.filter(
      (item) => item._id !== product._id
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice - product.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantites) => prevTotalQuantites - foundProduct.quantity
    );
    setCartItems(withoutElementCartItems);
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
        toggleCartItemQuantity,
        onRemoveItem,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
