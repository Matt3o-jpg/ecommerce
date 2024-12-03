// components/AdminProductEdit.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllProductsAdmin, updateProductAdmin } from '../services/apiServices';

function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchProduct();
    } else {
      console.error('Token non trovato. Effettua il login come admin.');
      navigate('/admin/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchProduct = async () => {
    try {
      const response = await getAllProductsAdmin(id, token);
      const product = response.data;
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price);
      // Non è più necessario gestire partnerId
    } catch (error) {
      console.error('Errore nel recuperare il prodotto', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProductAdmin(id, { name, description, price }, token);
      navigate('/admin/products');
    } catch (error) {
      console.error('Errore nell\'aggiornare il prodotto', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Modifica Prodotto</h1>
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
          Aggiorna Prodotto
        </button>
      </form>
    </div>
  );
}

export default AdminProductEdit;