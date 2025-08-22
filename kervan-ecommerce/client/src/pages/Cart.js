import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useContext(CartContext);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality will be implemented soon!');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/products" className="btn btn-primary">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item card">
              <div className="item-image">
                <div className="placeholder-image">
                  No Image
                </div>
              </div>
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="item-price">
                  ${item.price} each
                </div>
              </div>
              
              <div className="item-quantity">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="btn btn-secondary"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="btn btn-secondary"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="item-total">
                <div className="total-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary card">
          <h3>Order Summary</h3>
          
          <div className="summary-line">
            <span>Items ({cartItems.length}):</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          
          <div className="summary-line">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          
          <div className="summary-line total">
            <span><strong>Total:</strong></span>
            <span><strong>${getCartTotal().toFixed(2)}</strong></span>
          </div>
          
          <div className="cart-actions">
            <button 
              onClick={handleCheckout}
              className="btn btn-primary"
            >
              Proceed to Checkout
            </button>
            
            <button 
              onClick={clearCart}
              className="btn btn-secondary"
            >
              Clear Cart
            </button>
          </div>
          
          <div className="continue-shopping">
            <a href="/products" className="btn btn-secondary">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
