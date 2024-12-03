// src/components/PartnerRegister.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerPartner } from '../services/apiServices';

function PartnerRegister({ setIsAuthenticated, setIsPartner }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  // Gestore per i cambiamenti nei campi dell'indirizzo
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  // Gestore per l'invio del modulo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const partnerData = {
        username,
        password,
        businessName,
        contactEmail,
        contactPhone,
        address,
      };
      
      // Chiama la funzione di registrazione del partner
      const res = await registerPartner(partnerData);
      
      // Salva il token nel localStorage
      localStorage.setItem('token', res.token); 
      
      // Aggiorna lo stato di autenticazione
      setIsAuthenticated(true);
      setIsPartner(true);
      
      // Reindirizza il partner al dashboard
      navigate('/partner/dashboard');
    } catch (error) {
      console.error('Errore nella registrazione:', error);
      
      // Mostra il messaggio di errore all'utente
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Errore durante la registrazione del partner.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registrazione Partner</h2>
      
      {/* Mostra il messaggio di errore se presente */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Nome Utente */}
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
        
        {/* Password */}
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
        
        {/* Nome Azienda */}
        <div className="form-group">
          <label>Nome Azienda</label>
          <input
            type="text"
            className="form-control"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>
        
        {/* Email di Contatto */}
        <div className="form-group">
          <label>Email di Contatto</label>
          <input
            type="email"
            className="form-control"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
        </div>
        
        {/* Telefono di Contatto */}
        <div className="form-group">
          <label>Telefono di Contatto</label>
          <input
            type="text"
            className="form-control"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
          />
        </div>
        
        {/* Sezione Indirizzo */}
        <h4 className="mt-4">Indirizzo</h4>
        
        {/* Via */}
        <div className="form-group">
          <label>Via</label>
          <input
            type="text"
            className="form-control"
            name="street"
            value={address.street}
            onChange={handleAddressChange}
            required
          />
        </div>
        
        {/* Città */}
        <div className="form-group">
          <label>Città</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={address.city}
            onChange={handleAddressChange}
            required
          />
        </div>
        
        {/* CAP */}
        <div className="form-group">
          <label>CAP</label>
          <input
            type="text"
            className="form-control"
            name="postalCode"
            value={address.postalCode}
            onChange={handleAddressChange}
            required
          />
        </div>
        
        {/* Paese */}
        <div className="form-group">
          <label>Paese</label>
          <input
            type="text"
            className="form-control"
            name="country"
            value={address.country}
            onChange={handleAddressChange}
            required
          />
        </div>
        
        {/* Bottone di Registrazione */}
        <button type="submit" className="btn btn-primary mt-3">
          Registrati
        </button>
      </form>
    </div>
  );
}

export default PartnerRegister;