import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function AdminLogin({ setIsAuthenticated, setUserRole, userType }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:3000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!['admin', 'partner'].includes(userType)) {
      setError('Tipo di utente non valido');
      return;
    }

    try {
      // Determina l'endpoint API in base al tipo di utente
      const endpoint =
        userType === 'admin' ? `${API_URL}/auth/login-admin` : `${API_URL}/auth/login-partner`;

      const res = await axios.post(endpoint, { username, password });
      const { token } = res.data;
      localStorage.setItem('token', token);

      // Decodifica il token per ottenere il ruolo dell'utente
      const decodedToken = jwtDecode(token);
      const userRoleFromToken = decodedToken.role;

      // Gestione autenticazione
      setIsAuthenticated(true);
      setUserRole(userRoleFromToken);

      // Navigazione in base al ruolo
      if (userRoleFromToken === 'admin') {
        navigate('/admin');
      } else if (userRoleFromToken === 'partner') {
        navigate('/partner/dashboard');
      } else {
        // Se il ruolo non è riconosciuto, reindirizza alla home page o mostra un errore
        navigate('/');
      }
    } catch (err) {
      console.error('Errore durante il login:', err.response || err);
      setError(
        err.response?.data?.message || 'Errore generico durante il login. Riprova più tardi.'
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login {userType === 'admin' ? 'Amministratore' : 'Partner'}</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome Utente</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Accedi</button>
      </form>
    </div>
  );
}

export default AdminLogin;