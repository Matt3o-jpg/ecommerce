import React from 'react';
import { Link, } from 'react-router-dom';

function NavBar({
  cartItems,
  isAuthenticated,
  userRole,
  handleLogout,
}) {
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Determina se l'utente è admin o partner basandosi su userRole
  const isAdmin = userRole === 'admin';
  const isPartner = userRole === 'partner';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          E-commerce ProAV
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul className="navbar-nav me-auto">
            <li className="nav-item mx-4">
              <Link className="nav-link" to="/chi-siamo">
                Chi Siamo
              </Link>
            </li>
            <li className="nav-item mx-4">
              <Link className="nav-link" to="/products">
                Prodotti
              </Link>
            </li>
            {/* Se l'utente è un admin */}
            {isAdmin && (
              <li className="nav-item mx-4">
                <Link className="nav-link" to="/admin">
                  Area Amministrativa
                </Link>
              </li>
            )}
            {/* Se l'utente è un partner */}
            {isPartner && (
              <li className="nav-item mx-4">
                <Link className="nav-link" to="/partner/dashboard">
                  Dashboard Partner
                </Link>
              </li>
            )}
            {/* Se l'utente non è autenticato */}
            {!isAuthenticated && (
              <li className="nav-item mx-4">
                <Link className="nav-link" to="/partner/register">
                  Diventa Partner
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto me-4">
            <li className="nav-item mx-4">
              <Link className="nav-link" to="/cart">
                🛒 Carrello ({totalItems})
              </Link>
            </li>
            {isAuthenticated ? (
              <li className="nav-item mx-4">
                <button className="btn btn-link nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <>
                {/* Pulsante di login per il partner */}
                <li className="nav-item mx-4">
                  <Link className="nav-link" to="/partner/login">
                    Login Partner
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;