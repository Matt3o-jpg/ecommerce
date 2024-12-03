const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


// Rotte pubbliche
router.get('/', productController.getAllProducts); // Recupera tutti i prodotti pubblici
router.get('/:id', productController.getProductById); // Recupera un singolo prodotto per ID




module.exports = router;