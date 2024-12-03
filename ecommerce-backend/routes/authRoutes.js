const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register-admin', authController.registerAdmin);
router.post('/login-admin', authController.loginAdmin);
router.post('/register-partner', authController.registerPartner);
router.post('/login-partner', authController.loginPartner);




module.exports = router;