import React, { useRef } from "react";

import { useStateContext } from "../../context/StateContext";
import {
  AiOutlineShopping,
  AiOutlineLeft,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import Link from "next/link";
import { urlFor } from "../../lib/client";
import { Action } from "../../util/Constants";

const Cart = () => {
  const cartRef = useRef();

  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuantity,
    onRemoveItem,
  } = useStateContext();

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your cart</span>
          <span className="cart-num-items">{totalQuantities} items</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItems.length > 0 &&
            cartItems.map((item, index) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  alt=""
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>${item.price}</h4>
                  </div>

                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span className="minus">
                          <AiOutlineMinus
                            onClick={() =>
                              toggleCartItemQuantity(item._id, Action.DEC)
                            }
                          />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span className="plus">
                          <AiOutlinePlus
                            onClick={() =>
                              toggleCartItemQuantity(item._id, Action.INC)
                            }
                          />
                        </span>
                      </p>
                    </div>

                    <button type="button" className="remove-item">
                      <TiDeleteOutline onClick={() => onRemoveItem(item)} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal: </h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn">
                Pay with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
