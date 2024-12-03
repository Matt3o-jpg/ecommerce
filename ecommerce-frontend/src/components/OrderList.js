import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    };
    fetchOrders();
  }, []);


  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.patch(`/api/orders/${orderId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: res.data.status } : order
        )
      );
    } catch (err) {
      console.error('Errore nell\'aggiornamento dello stato dell\'ordine:', err);
    }
  };


  return (
    <div className="container mt-5">
      <h2>Gestione Ordini</h2>
      {orders.length === 0 ? (
        <p>Nessun ordine presente.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID Ordine</th>
              <th>Utente</th>
              <th>Totale</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user}</td>
                <td>{order.total ? order.total.toFixed(2) : 'N/A'}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="form-control form-control-sm"
                  >
                    <option value="In elaborazione">In elaborazione</option>
                    <option value="Spedito">Spedito</option>
                    <option value="Consegnato">Consegnato</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default OrderList;