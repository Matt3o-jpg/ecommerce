import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
        } catch (error) {
      console.error('Errore nel recupero degli ordini:', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/admin/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Stato dell\'ordine aggiornato con successo!');
      fetchOrders();
    } catch (error) {
      console.error('Errore nell\'aggiornamento dello stato dell\'ordine:', error);
      alert('Errore nell\'aggiornamento dello stato dell\'ordine.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo ordine?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Ordine eliminato con successo!');
      fetchOrders();
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'ordine:', error);
      alert('Errore nell\'eliminazione dell\'ordine.');
    }
  };

  return (
    <div>
      <h2>Gestione Ordini</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            <strong>Cliente:</strong> {order.customerName} - <strong>Totale:</strong> €{order.totalAmount} - <strong>Status:</strong> {order.status}
            {/* Aggiungi dettagli degli ordini come prodotti, ecc. */}
            <button onClick={() => handleUpdateStatus(order._id, 'Completato')}>Segna come Completato</button>
            <button onClick={() => handleDelete(order._id)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminOrders;