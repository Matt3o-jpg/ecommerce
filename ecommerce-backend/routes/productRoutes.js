const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const adminController = require('../controllers/adminController');

// Rotte pubbliche
router.get('/', productController.getAllProducts); // Recupera tutti i prodotti pubblici
router.get('/:id', productController.getProductById); // Recupera un singolo prodotto per ID
router.post('/orders', orderController.createOrder); // Effettua un ordine




module.exports = router;