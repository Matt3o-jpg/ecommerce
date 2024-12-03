// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Formato email non valido'] // Validazione del formato email
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'partner'], required: true },
  createdAt: { type: Date, default: Date.now },
  // Rimuovi i campi specifici del partner se presenti
  // businessName, contactEmail, contactPhone, address
});

module.exports = mongoose.model('User', userSchema);