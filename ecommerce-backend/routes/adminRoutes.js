const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');

// Middleware per verificare se l'utente è admin
router.use(authenticateToken);
router.use(isAdmin);

// Rotte protette per l'amministratore
router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', productController.deleteProductAsAdmin);

router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.delete('/orders/:id', orderController.deleteOrder);

router.get('/partners', adminController.getAllPartners);

module.exports = router;