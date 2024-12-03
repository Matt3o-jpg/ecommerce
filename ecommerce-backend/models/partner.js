const mongoose = require('mongoose');

// Schema per l'indirizzo
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },     
  city: { type: String, required: true },       
  postalCode: { type: String, required: true },  
  country: { type: String, required: true },     
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
    match: [/\S+@\S+\.\S+/, 'Formato email non valido'], 
  },
  contactPhone: {
    type: String,
    required: true,
   
  },
  address: {
    type: addressSchema,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // TODO: Aggiungi altri campi specifici per il partner se necessario
});

module.exports = mongoose.model('Partner', partnerSchema);