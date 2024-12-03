import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data);
        setName(res.data.name);
        setDescription(res.data.description);
        setPrice(res.data.price);
      } catch (error) {
        console.error('Errore nel recupero del prodotto:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/products/${id}`, {
        name,
        description,
        price: parseFloat(price),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin/products');
    } catch (error) {
      console.error('Errore nell\'aggiornamento del prodotto:', error);
    }
  };

  if (!product) return <p>Caricamento in corso...</p>;

  return (
    <div className="container mt-5">
      <h2>Modifica Prodotto: {product.name}</h2>
      <form onSubmit={handleSubmit}>
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
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Prezzo</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Aggiorna</button>
      </form>
    </div>
  );
}

export default ProductEdit;