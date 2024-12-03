// controllers/adminController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const Partner = require('../models/partner');


// Recupera tutti gli ordini
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.productId', 'name price')
      .populate('user', 'email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recuperare gli ordini', error: error.message });
  }
};


// Recupera tutti i prodotti
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('partner', 'businessName');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recuperare i prodotti', error: error.message });
  }
};


// Aggiorna uno stato d'ordine
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error('Errore nell\'aggiornamento dell\'ordine:', err);
    res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'ordine' });
  }
};

// Crea un nuovo prodotto
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Nome e prezzo sono obbligatori' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Errore nella creazione del prodotto:', err);
    res.status(500).json({ message: 'Errore nella creazione del prodotto', error: err.message });
  }
};

// Aggiorna un prodotto esistente
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    await product.save();

    res.json(product);
  } catch (err) {
    console.error('Errore nell\'aggiornamento del prodotto:', err);
    res.status(500).json({ message: 'Errore nell\'aggiornamento del prodotto', error: err.message });
  }
};

// Elimina un prodotto
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }
    res.status(200).json({ message: 'Prodotto eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'eliminare il prodotto', error: error.message });
  }
};

exports.getAllPartners = async (res) => {
  try {
    const partners = await Partner.find().populate('partner', 'email');
    res.status(200).json(partners);
  } catch (error) {
    console.error('Errore nel recuperare i partner:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};