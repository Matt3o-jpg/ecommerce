import React, { useState } from 'react';
import { createPartnerProduct } from '../services/apiServices';

function PartnerProductCreate() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = { name, description, price: parseFloat(price) };
      await createPartnerProduct(productData, token);
      alert('Prodotto creato con successo!');
    } catch (err) {
      console.error('Errore nella creazione del prodotto:', err);
      alert('Errore nella creazione del prodotto.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome Prodotto</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descrizione</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Prezzo</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <button type="submit">Crea Prodotto</button>
    </form>
  );
}

export default PartnerProductCreate;