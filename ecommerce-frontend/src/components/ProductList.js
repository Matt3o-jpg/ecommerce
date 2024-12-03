import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        console.log('Prodotti recuperati:', res.data); // Aggiungi questo log
        setProducts(res.data);
      } catch (error) {
        console.error('Errore nel recupero dei prodotti:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Prodotti</h2>
      {products.length === 0 ? (
        <p>Nessun prodotto disponibile.</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-4">
              <ProductCard product={product} addToCart={addToCart} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;