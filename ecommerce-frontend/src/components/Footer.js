// src/components/Footer.js

import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Informazioni di Contatto */}
        <div className="footer-section">
          <h3>Contatti</h3>
          <p>Indirizzo: Via Roma, 123, 00100 Roma RM, Italia</p>
          <p>Telefono: +39 06 1234 5678</p>
          <p>Email: info@tuosito.com</p>
        </div>

        {/* Link Utili */}
        <div className="footer-section">
          <h3>Link Utili</h3>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/termini">Termini di Servizio</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Seguici</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} TuoSito. Tutti i diritti riservati.</p>
      </div>
    </footer>
  );
}

export default Footer;