// components/PartnerProductEdit.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPartnerProductById, updatePartnerProduct } from '../services/apiServices';

function PartnerProductEdit() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); 
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getPartnerProductById(id, token);
        setName(res.data.name);
        setDescription(res.data.description || ''); 
        setPrice(res.data.price);
        setCurrentImageUrl(res.data.imageUrl || '');
      } catch (error) {
        console.error('Errore nel recupero del prodotto:', error);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crea un FormData per inviare i dati e il file
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await updatePartnerProduct(id, formData, token);
      navigate('/partner/products');
    } catch (error) {
      console.error('Errore nell\'aggiornamento del prodotto:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Modifica Prodotto</h2>
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
          {currentImageUrl && (
            <div className="mb-2">
              <img
                src={currentImageUrl}
                alt={name}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <small className="form-text text-muted">
            Seleziona un'immagine per sostituire quella attuale.
          </small>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Aggiorna
        </button>
      </form>
    </div>
  );
}

export default PartnerProductEdit;