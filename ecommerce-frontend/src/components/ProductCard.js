import React from 'react';

function ProductCard({ product, addToCart }) {
  return (
    <div className="card mb-4">
      {product.imageUrl && (
        <img src={product.imageUrl} className="card-img-top" alt={product.name} />
      )}
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <p className="card-text">€ {product.price.toFixed(2)}</p>
        <button className="btn btn-primary" onClick={() => addToCart(product)}>
          Aggiungi al Carrello
        </button>
      </div>
    </div>
  );
}

export default ProductCard;