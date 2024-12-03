// components/PartnerProductCreate.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPartnerProduct } from '../services/apiServices';

function PartnerProductCreate() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); 
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      await createPartnerProduct(formData, token);
      navigate('/partner/products');
    } catch (error) {
      console.error('Errore nella creazione del prodotto:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Aggiungi Nuovo Prodotto</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Descrizione</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Prezzo</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        {/* Campo per l'immagine */}
        <div className="form-group">
          <label>Immagine del Prodotto</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Salva
        </button>
      </form>
    </div>
  );
}

export default PartnerProductCreate;