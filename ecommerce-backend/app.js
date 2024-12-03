require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes')
const partnerRoutes = require('./routes/partnerRoutes')
const path = require('path');




// Importa i modelli
require('./models/User');    
require('./models/partner');  
require('./models/Product');  
require('./models/Order');    

const app = express();
app.use(express.json());
app.use(cors());

// Connessione al database MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connesso a MongoDB'))
  .catch((error) => console.error('Errore di connessione al database:', error));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/partner', partnerRoutes); 
app.use('/images', express.static(path.join(__dirname, 'uploads', 'images')));

app.get('/', (req, res) => {
  res.send("Benvenuto nell'API dell'e-commerce!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));