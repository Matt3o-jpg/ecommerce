import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPartnerProducts, getPartnerOrders } from '../services/apiServices';

function PartnerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await getPartnerProducts(token);
        setProducts(productsRes.data);

        const ordersRes = await getPartnerOrders(token);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error('Errore nel recupero dei dati per la dashboard del partner:', error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="container mt-5">
      <h2>Dashboard Partner</h2>
      <div className="mt-4">
        <h4>Prodotti</h4>
        <p>Hai {products.length} prodotti elencati.</p>
        <Link to="/partner/products" className="btn btn-primary">
          Gestisci Prodotti
        </Link>
      </div>
      <div className="mt-4">
        <h4>Ordini</h4>
        <p>Hai ricevuto {orders.length} ordini.</p>
        <Link to="/partner/orders" className="btn btn-primary">
          Visualizza Ordini
        </Link>
      </div>
    </div>
  );
}

export default PartnerDashboard;