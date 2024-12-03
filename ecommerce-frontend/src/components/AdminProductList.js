// components/AdminProductList.js

import React, { useState, useEffect } from 'react';
import { getAllProductsAdmin, deleteProductAdmin } from '../services/apiServices';
import { Link } from 'react-router-dom';

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchProducts();
    } else {
      console.error('Token non trovato. Effettua il login come admin.');
      // Potresti voler reindirizzare l'utente alla pagina di login qui
    }
  }, [token]);

  // Funzione per recuperare tutti i prodotti
  const fetchProducts = async () => {
    try {
      const response = await getAllProductsAdmin(token);
      setProducts(response.data);
    } catch (error) {
      console.error('Errore nel recuperare i prodotti:', error);
    }
  };

  // Funzione per eliminare un prodotto
  const handleDelete = async (productId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      try {
        await deleteProductAdmin(productId, token); // Passa il token qui
        fetchProducts(); // Aggiorna la lista dei prodotti
      } catch (error) {
        console.error('Errore nell\'eliminare il prodotto:', error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1>Gestione Prodotti</h1>
      <Link to="/admin/products/create" className="btn btn-primary mb-3">
        Aggiungi Prodotto
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrizione</th>
            <th>Prezzo (€)</th>
            <th>Partner</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description || 'N/A'}</td>
                <td>{product.price.toFixed(2)}</td>
                <td>{product.partner?.businessName || 'N/A'}</td>
                <td>
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Modifica
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Nessun prodotto disponibile.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductList;