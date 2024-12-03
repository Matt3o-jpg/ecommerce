import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="container mt-5">
      <h2>Dashboard Amministratore</h2>
      <ul>
        <li>
          <Link to="/admin/products">Gestione Prodotti</Link>
        </li>
        <li>
          <Link to="/admin/orders">Gestione Ordini</Link>
        </li>
        <li>
          <Link to="/admin/partners">Gestione Partner</Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminDashboard;