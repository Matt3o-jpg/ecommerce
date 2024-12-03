import React, { useEffect, useState } from 'react';
import { getPartnerOrders, updatePartnerOrderStatus, deletePartnerOrder } from '../services/apiServices';
import { Modal, Button, Form } from 'react-bootstrap';

function PartnerOrderList() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getPartnerOrders(token);
        console.log('Risposta API degli ordini:', res.data); 
        
        if (res.data && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
        } else if (res.data && Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          console.error('Formato dati degli ordini non valido:', res.data);
           // Imposta un array vuoto se i dati non sono validi
        }
      } catch (error) {
        console.error('Errore nel recupero degli ordini:', error);
        // Imposta un array vuoto in caso di errore
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo ordine?')) return;
    try {
      await deletePartnerOrder(id, token);
      alert('Ordine eliminato con successo!');
      // Aggiorna lo stato filtrando l'ordine eliminato
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'ordine:', error);
      alert('Errore nell\'eliminazione dell\'ordine.');
    }
  };

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setNewStatus('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const res = await updatePartnerOrderStatus(selectedOrder._id, newStatus, token);
      if (res.status === 200) {
        alert('Stato dell\'ordine aggiornato con successo!');
        // Aggiorna lo stato degli ordini
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id ? { ...order, status: newStatus } : order
          )
        );
        handleCloseModal();
      } else {
        alert(`Errore nell'aggiornamento dello stato: ${res.data.message}`);
      }
    
    } catch (error) {
      console.error('Errore nell\'aggiornamento dello stato dell\'ordine:', error);
      alert('Errore nell\'aggiornamento dello stato dell\'ordine.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>I tuoi Ordini</h2>
      {orders.length === 0 ? (
        <p>Nessun ordine trovato.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID Ordine</th>
              <th>Prodotti</th>
              <th>Importo Totale</th>
              <th>Data</th>
              <th>Status</th>
              <th>Azioni</th> {/* Colonna per i bottoni di azione */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const totalAmount = order.products.reduce(
                (sum, item) => sum + item.productId.price * item.quantity,
                0
              );
              return (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                {order.products.map((item) => (
                  <div key={item.productId._id}>
                  {item.productId.name} x {item.quantity}
                 </div>
                ))}
                  </td>
                  <td>€ {totalAmount.toFixed(2)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>
                    {/* Bottone per modificare lo stato dell'ordine */}
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleShowModal(order)}
                    >
                      Modifica Stato
                    </button>
                    {/* Bottone per eliminare l'ordine */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(order._id)}
                    >
                      Elimina
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Modale per modificare lo stato dell'ordine */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Stato Ordine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Form>
              <Form.Group controlId="formOrderStatus">
                <Form.Label>Stato Attuale: {selectedOrder.status}</Form.Label>
                <Form.Control
                  as="select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="In elaborazione">In elaborazione</option>
                  <option value="Completato">Completato</option>
                  <option value="Annullato">Annullato</option>
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Aggiorna Stato
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PartnerOrderList;