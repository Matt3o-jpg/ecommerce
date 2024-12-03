// components/AdminPartnerList.js

import React, { useState, useEffect } from 'react';
import { getAllPartners } from '../services/apiServices';

function AdminPartnerList() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetchPartners();
  }, []);

  // Funzione per recuperare tutti i partner
  const fetchPartners = async () => {
    try {
      const response = await getAllPartners();
      setPartners(response.data);
    } catch (error) {
      console.error('Errore nel recuperare i partner:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Gestione Partner</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome Azienda</th>
            <th>Email Contatto</th>
            <th>Telefono Contatto</th>
            <th>Indirizzo</th>
            <th>Data Registrazione</th>
          </tr>
        </thead>
        <tbody>
          {partners.length > 0 ? (
            partners.map((partner) => (
              <tr key={partner._id}>
                <td>{partner.businessName}</td>
                <td>{partner.contactEmail}</td>
                <td>{partner.contactPhone}</td>
                <td>
                  {partner.address.street}, {partner.address.city},{' '}
                  {partner.address.postalCode}, {partner.address.country}
                </td>
                <td>{new Date(partner.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Nessun partner registrato.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPartnerList;