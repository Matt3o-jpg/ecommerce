const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const { authenticateToken, isPartner } = require('../middleware/auth')

const upload = productController.upload;
// Rotta per creare un nuovo prodotto con upload dell'immagine
router.post('/products',upload.single('image'),authenticateToken,isPartner,productController.createProductForPartner);
// Rotta per aggiornare un prodotto esistente con upload dell'immagine
router.put('/products/:id',upload.single('image'),authenticateToken,isPartner,productController.updateProductForPartner);

router.get('/products', authenticateToken, isPartner, productController.getProductsByPartner);
router.delete('/products/:id', authenticateToken, isPartner, productController.deleteProduct);
router.delete('/orders/:id', authenticateToken, isPartner, orderController.deleteOrder);


// Rotta per ottenere gli ordini del partner
router.get('/orders', authenticateToken, isPartner, orderController.getOwnOrders);

// Rotta per aggiornare lo stato di un ordine
router.put('/orders/:id', authenticateToken, isPartner, orderController.updateOrderStatus);






module.exports = router;