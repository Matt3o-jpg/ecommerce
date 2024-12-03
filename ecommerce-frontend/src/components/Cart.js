import React from 'react';
import { Link } from 'react-router-dom';

function Cart({ cartItems, updateQuantity, removeItem }) {
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mt-5">
      <h2>Carrello</h2>
      {cartItems.length === 0 ? (
        <p>Il carrello è vuoto.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Prodotto</th>
                <th>Quantità</th>
                <th>Prezzo</th>
                <th>Totale</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>€ {item.price.toFixed(2)}</td>
                  <td>€ {(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => removeItem(item._id)}>
                      Rimuovi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Totale Carrello: € {totalPrice.toFixed(2)}</h4>
          <Link to="/checkout" className="btn btn-primary">
            Procedi al Checkout
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;