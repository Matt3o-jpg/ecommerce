// App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import ChiSiamo from './components/ChiSiamo';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import OrderConfirmation from './components/OrderConfirmation';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminProductList from './components/AdminProductList';
import AdminProductCreate from './components/AdminProductCreate';
import AdminProductEdit from './components/AdminProductEdit';
import AdminOrderList from './components/AdminOrderList'; 
import AdminPartnerList from './components/AdminPartnerList';
import ProductList from './components/ProductList'; 
import PartnerRegister from './components/PartnerRegister';
import PartnerDashboard from './components/PartnerDashboard';
import PartnerProductList from './components/PartnerProductList';
import PartnerProductCreate from './components/PartnerProductCreate';
import PartnerProductEdit from './components/PartnerProductEdit';
import PartnerOrderList from './components/PartnerOrderList';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './app.css';

function App() {
  // Gestione dell'autenticazione e dei ruoli
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
          setUserRole(decodedToken.role); // 'admin', 'partner' o altro
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Token non valido');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Funzione per il logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole('');
  };

  // Gestione dello stato del carrello
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item._id === product._id);
      if (itemExists) {
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  return (
    <Router>
      <div className="app-container">
        <NavBar
          cartItems={cartItems}
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          handleLogout={handleLogout}
        />
        <main className="content mb-2">
          <Routes>
            {/* Rotte pubbliche */}
            <Route path="/" element={<HomePage />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                <CheckoutForm cartItems={cartItems} setCartItems={setCartItems} />
              }
            />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />

            {/* Login Admin */}
            <Route
              path="/admin/login"
              element={
                <AdminLogin
                  setIsAuthenticated={setIsAuthenticated}
                  setUserRole={setUserRole}
                  userType="admin"
                />
              }
            />

            {/* Login Partner */}
            <Route
              path="/partner/login"
              element={
                      <AdminLogin
                        setIsAuthenticated={setIsAuthenticated}
                          setUserRole={setUserRole}
                      userType="partner"
                        />
                            }
                    />

            {/* Lista prodotti pubblica */}
            <Route path="/products" element={<ProductList addToCart={addToCart} />} />

            {/* Registrazione partner */}
            <Route
              path="/partner/register"
              element={
                <PartnerRegister
                  setIsAuthenticated={setIsAuthenticated}
                  setUserRole={setUserRole}
                />
              }
            />

            {/* Rotte protette per admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  roleRequired="admin"
                >
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  roleRequired="admin"
                >
                  <AdminProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/create"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  roleRequired="admin"
                >
                  <AdminProductCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  roleRequired="admin"
                >
                  <AdminProductEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  roleRequired="admin"
                >
                  <AdminOrderList /> {/* Assicurati di avere questo componente */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/partners"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  roleRequired="admin"
                >
                  <AdminPartnerList />
                </ProtectedRoute>
              }
            />

            {/* Rotte protette per partner */}
            <Route
              path="/partner/dashboard"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  roleRequired="partner"
                >
                  <PartnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partner/products"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  roleRequired="partner"
                >
                  <PartnerProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partner/products/create"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  roleRequired="partner"
                >
                  <PartnerProductCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partner/products/edit/:id"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  roleRequired="partner"
                >
                  <PartnerProductEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partner/orders"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  roleRequired="partner"
                >
                  <PartnerOrderList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;