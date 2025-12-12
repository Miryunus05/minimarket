import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function CartItem({ item, onRemove }) {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.title} className="cart-item-image" />
      <div className="cart-item-details">
        <div className="cart-item-title">{item.title}</div>
        <div className="cart-item-price">${item.price.toFixed(2)}</div>
        <div className="cart-quantity">Miqdor: {item.quantity}</div>
      </div>
      <button className="btn btn-danger" onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </div>
  );
}

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Cart parsing error:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    const badge = document.querySelector('.cart-badge');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
  }, [cartItems]);

  useEffect(() => {
    const handleAddToCart = (e) => {
      const product = e.detail;
      setCartItems(prev => {
        const existingItem = prev.find(item => item.id === product.id);
        if (existingItem) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    };

    window.addEventListener('addToCart', handleAddToCart);
    return () => window.removeEventListener('addToCart', handleAddToCart);
  }, []);

  const removeFromCart = (id) => {
    setCartItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item && item.quantity > 1) {
        return prev.map(i =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const totalPrice = cartItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );

  const totalItems = cartItems.reduce((sum, item) => 
    sum + item.quantity, 0
  );

  return (
    <div className="section cart-section">
      <h2 className="section-title">
        Cart
        {cartItems.length > 0 && (
          <span className="cart-badge">{totalItems}</span>
        )}
      </h2>
      {cartItems.length === 0 ? (
        <div className="cart-empty">Savat bo'sh</div>
      ) : (
        <>
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} onRemove={removeFromCart} />
          ))}
          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Mahsulotlar:</span>
              <strong>{totalItems} ta</strong>
            </div>
            <div className="cart-summary-row">
              <span>Total:</span>
              <span className="cart-summary-total">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const cartRoot = document.getElementById('cart-root');
if (cartRoot) {
  ReactDOM.createRoot(cartRoot).render(<Cart />);
}