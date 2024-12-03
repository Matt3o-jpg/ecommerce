// src/components/CheckoutForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CheckoutForm({ cartItems, setCartItems }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); 
  const [address, setAddress] = useState('');
  const [vatNumber, setVatNumber] = useState(''); 
  const [paymentMethod, setPaymentMethod] = useState(''); 
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();

    console.log("Prodotti nel carrello:", cartItems);

    const orderData = {
      name, // Nome cliente
      email, // Email cliente
      address, // Indirizzo di spedizione
      vatNumber: vatNumber || null, // Partita IVA (opzionale)
      paymentMethod, // Metodo di pagamento
      products: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      total: cartItems.reduce((total, item) => total + item.price * item.quantity, 0), // Totale ordine
    };


    console.log("Dati ordine da inviare al server:", orderData);

    try {
      const res = await axios.post('http://localhost:3000/api/orders', orderData);
      if (res.status === 201) {
        alert('Ordine inviato con successo!');

        // Svuota il carrello
        setCartItems([]);

        
        navigate('/order-confirmation');
      } else {
        alert(`Errore durante l'invio dell'ordine: ${res.data.message}`);
      }
    } catch (error) {
      console.error('Errore durante l\'invio dell\'ordine:', error);
      alert('Errore durante l\'invio dell\'ordine. Controlla la console per ulteriori dettagli.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>
      <form onSubmit={handleCheckout}>
        <div className="form-group">
          <label>Nome Cliente</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label> 
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Indirizzo di Spedizione</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Partita IVA (opzionale)</label>
          <input
            type="text"
            className="form-control"
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Metodo di Pagamento</label>
          <select
            className="form-control"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">Seleziona un metodo di pagamento</option>
            <option value="carta">Carta di Credito</option>
            <option value="paypal">PayPal</option>
            <option value="bonifico">Bonifico Bancario</option>
          </select>
        </div>
        <h4>Totale dell'Ordine: € {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h4>
        <button type="submit" className="btn btn-primary">Conferma Ordine</button>
      </form>
    </div>
  );
}

export default CheckoutForm;


