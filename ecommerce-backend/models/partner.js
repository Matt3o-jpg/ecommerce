const mongoose = require('mongoose');

// Schema per l'indirizzo
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },      // Via
  city: { type: String, required: true },        // Città
  postalCode: { type: String, required: true },  // CAP
  country: { type: String, required: true },     // Paese
});

// Schema per il Partner
const partnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',         
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, 'Formato email non valido'], // Validazione del formato email
  },
  contactPhone: {
    type: String,
    required: true,
    // Puoi aggiungere una regex per validare il formato del numero di telefono se necessario
  },
  address: {
    type: addressSchema,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Aggiungi altri campi specifici per il partner se necessario
});

module.exports = mongoose.model('Partner', partnerSchema);