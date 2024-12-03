const mongoose = require('mongoose');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');
const partner = require('../models/partner');
const Product = require('../models/Product');




exports.createOrder = async (req, res) => {
  try {
    const { name, email, address, vatNumber, paymentMethod, products, total, } = req.body;

    // Verifica che tutti i campi obbligatori siano presenti
    if (!name || !email || !address || !paymentMethod || !products || !total) {
      console.error('Errore: Dati mancanti nel corpo della richiesta');
      return res.status(400).json({ message: 'Dati mancanti' });
    }

    // Crea un nuovo ordine
    const newOrder = new Order({
      name,
      email,
      address,
      vatNumber,
      paymentMethod,
      products,
      total,
      status: 'In elaborazione',
    });

    // Salva l'ordine nel database
    const savedOrder = await newOrder.save();

    // Invia un'email di conferma al cliente
    // Configura il trasportatore SMTP
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Costruisci la lista dei prodotti per l'email
    const productList = products.map(
      (item) => `- Prodotto: ${item.productId}, Quantità: ${item.quantity}`
    ).join('\n');

    // Dettagli dell'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, 
      subject: 'Conferma Ordine',
      text: `Grazie per il tuo ordine, ${name}!\n\nDettagli dell'ordine:\n\n${productList}\n\nTotale: € ${total}\n\nMetodo di Pagamento: ${paymentMethod}\n\nSaluti,\nIl Team`,
    };

    // Invia l'email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Errore nell\'invio dell\'email:', error);
        // Decidi se vuoi restituire un errore al client o procedere
        // In questo caso, restituiamo comunque l'ordine salvato
        return res.status(201).json({ order: savedOrder, emailError: error.toString() });
      } else {
        console.log('Email inviata:', info.response);
        return res.status(201).json(savedOrder);
      }
    });
  } catch (error) {
    console.error('Errore durante la creazione dell\'ordine:', error);
    res.status(500).json({ message: 'Errore durante la creazione dell\'ordine', error: error.toString() });
  }
};


// Recupera un ordine tramite ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.productId', 'name price')
      .populate('user', 'email');
    if (!order) return res.status(404).json({ message: 'Ordine non trovato' });
    res.json(order);
  } catch (error) {
    console.error('Errore nel recupero dell\'ordine:', error);
    res.status(500).json({ message: 'Errore nel recupero dell\'ordine', error: error.message });
  }
};



// Elimina un ordine (solo per admin)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }

    // Verifica che l'ordine contenga prodotti del partner
    const partnerProducts = await Product.find({ partner: req.user.id }).select('_id');
    const productIds = partnerProducts.map((product) => product._id.toString());

    const orderContainsPartnerProduct = order.products.some((item) =>
      productIds.includes(item.productId.toString())
    );

    if (!orderContainsPartnerProduct) {
      return res.status(403).json({ message: 'Non hai accesso a questo ordine' });
    }

    // Elimina l'ordine
    await order.deleteOne();

    res.json({ message: 'Ordine eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'ordine:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'ordine', error: error.message });
  }
};






// Aggiorna lo stato di un ordine
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }

    // Verifica che l'ordine contenga prodotti del partner
    const partnerProducts = await Product.find({ partner: req.user.id }).select('_id');
    const productIds = partnerProducts.map((product) => product._id.toString());

    const orderContainsPartnerProduct = order.products.some((item) =>
      productIds.includes(item.productId.toString())
    );

    if (!orderContainsPartnerProduct) {
      return res.status(403).json({ message: 'Non hai accesso a questo ordine' });
    }

    // Aggiorna lo stato dell'ordine
    if (status) order.status = status;

    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'ordine:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'ordine', error: error.message });
  }
};

// Recupera gli ordini associati ai prodotti del partner
exports.getOwnOrders = async (req, res) => {
  try {
    // Trova tutti i prodotti del partner
    const partnerProducts = await Product.find({ partner: req.user.id }).select('_id');

    if (!partnerProducts.length) {
      return res.status(404).json({ message: 'Nessun prodotto trovato per questo partner' });
    }

    const productIds = partnerProducts.map((product) => product._id);

    // Trova gli ordini che contengono i prodotti del partner
    const orders = await Order.find({ 'products.productId': { $in: productIds } })
      .populate('products.productId', 'name price')
      .populate('user', 'email');

    if (!orders.length) {
      return res.status(404).json({ message: 'Nessun ordine trovato per questo partner' });
    }

    res.json(orders);
  } catch (err) {
    console.error('Errore nel recupero degli ordini del partner:', err);
    res.status(500).json({ message: 'Errore nel recupero degli ordini' });
  }
};

