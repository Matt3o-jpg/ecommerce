// components/AdminProductCreate.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProductAdmin } from '../services/apiServices';

function AdminProductCreate() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProductAdmin({ name, description, price }, token);
      navigate('/admin/products');
    } catch (error) {
      console.error('Errore nella creazione del prodotto', error);
      alert('Errore nella creazione del prodotto. Verifica i dati inseriti.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Aggiungi Prodotto</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descrizione</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Prezzo (€)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        {/* Rimuovi il campo Partner */}
        <button type="submit" className="btn btn-primary">
          Crea Prodotto
        </button>
      </form>
    </div>
  );
}

export default AdminProductCreate;