// src/components/PartnerProductList.js

import React, { useEffect, useState } from 'react';
import { getPartnerProducts, deletePartnerProduct } from '../services/apiServices';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

function PartnerProductList() {
  const [products, setProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getPartnerProducts(token);
        setProducts(res.data); // Partner ottiene solo i propri prodotti
      } catch (error) {
        console.error('Errore nel recupero dei prodotti:', error);
        toast.error('Errore nel recupero dei prodotti.');
      }
    };

    if (token) {
      fetchProducts();
    }
  }, [token]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deletePartnerProduct(productToDelete._id, token);
      toast.success('Prodotto eliminato con successo!');
      // Aggiorna lo stato rimuovendo il prodotto eliminato
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productToDelete._id)
      );
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Errore nell\'eliminazione del prodotto:', error);
      if (error.response && error.response.status === 403) {
        toast.error('Non hai permesso di eliminare questo prodotto.');
      } else if (error.response && error.response.status === 401) {
        toast.error('Autenticazione fallita. Effettua nuovamente il login.');
        navigate('/login');
      } else {
        toast.error('Errore nell\'eliminazione del prodotto.');
      }
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <div className="container mt-5">
      <h2>Gestione Prodotti (Partner)</h2>
      <Button 
        variant="success" 
        className="mb-3" 
        onClick={() => navigate('/partner/products/create')}
      >
        Aggiungi Prodotto
      </Button>
      {products.length === 0 ? (
        <p>Nessun prodotto trovato.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Immagine</th> {/* Aggiunto per visualizzare l'immagine */}
              <th>Nome</th>
              <th>Prezzo</th>
              <th>Categoria</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>{product.name}</td>
                <td>€ {product.price.toFixed(2)}</td>
                <td>{product.category || 'N/A'}</td>
                <td>
                  <Link to={`/partner/products/edit/${product._id}`} className="btn btn-primary btn-sm me-2">
                    Modifica
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteClick(product)}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modale di conferma eliminazione */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Conferma Eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productToDelete && (
            <p>
              Sei sicuro di voler eliminare il prodotto <strong>{productToDelete.name}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Annulla
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PartnerProductList;