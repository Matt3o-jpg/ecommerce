const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Specifica la cartella dove verranno salvate le immagini
const imageStoragePath = path.join(__dirname, '..', 'uploads', 'images');

// Crea la cartella se non esiste
if (!fs.existsSync(imageStoragePath)) {
  fs.mkdirSync(imageStoragePath, { recursive: true });
}

// Configurazione dello storage per multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageStoragePath); // Salva le immagini nella cartella specificata
  },
  filename: (req, file, cb) => {
    // Genera un nome univoco per il file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// Filtra i file per accettare solo immagini
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Solo le immagini sono permesse'));
};

// Inizializza multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

exports.upload = upload;

// === Funzioni pubbliche ===

// Recupera tutti i prodotti (pubblico)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('partner', 'businessName');
    res.json(products);
  } catch (err) {
    console.error('Errore nel recupero dei prodotti:', err);
    res.status(500).json({ message: 'Errore nel recupero dei prodotti' });
  }
};

// Recupera un prodotto per ID (pubblico)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('partner', 'businessName');
    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recuperare il prodotto', error: error.message });
  }
};

// === Funzioni per i partner ===



// Crea un prodotto per il partner
exports.createProductForPartner = async (req, res) => {
  console.log('createProduct controller chiamato');
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    console.log('req.user:', req.user);
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Nome e prezzo sono obbligatori' });
    }

    // Costruisci l'URL dell'immagine
    let imageUrl = '';
    if (req.file) {
      const host = req.get('host'); // Questo sarà l'URL di ngrok quando esposto
      imageUrl = `${req.protocol}://${host}/images/${req.file.filename}`;
    }

    const newProduct = new Product({
      name,
      description,
      price,
      partner: req.user.id,
      imageUrl,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Errore nella creazione del prodotto:', err);
    res.status(500).json({ message: 'Errore nella creazione del prodotto', error: err.message });
  }
};

// Recupera tutti i prodotti del partner
exports.getProductsByPartner = async (req, res) => {
  try {
    const products = await Product.find({ partner: req.user.id });

    if (!products.length) {
      return res.status(404).json({ message: 'Nessun prodotto trovato' });
    }

    res.json(products);
  } catch (err) {
    console.error('Errore nel recupero dei prodotti del partner:', err);
    res.status(500).json({ message: 'Errore nel recupero dei prodotti' });
  }
};

// Aggiorna un prodotto del partner
exports.updateProductForPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    if (product.partner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accesso non autorizzato' });
    }

    // Aggiorna i campi
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    // Se c'è una nuova immagine, aggiorna l'URL
    if (req.file) {
      product.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await product.save();

    res.json(product);
  } catch (err) {
    console.error('Errore nell\'aggiornamento del prodotto:', err);
    res.status(500).json({ message: 'Errore nell\'aggiornamento del prodotto', error: err.message });
  }
};

// Elimina un prodotto del partner
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const partnerId = req.user.id;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    if (product.partner.toString() !== partnerId) {
      return res.status(403).json({ message: 'Non hai permesso di eliminare questo prodotto' });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Prodotto eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione del prodotto:', error);
    res.status(500).json({ message: 'Errore interno del server', error: error.message });
  }
};

// === Funzioni per gli admin ===

// Crea un prodotto (Admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, partnerId } = req.body;

    if (!name || !price || !partnerId) {
      return res.status(400).json({ message: 'Nome, prezzo e partnerId sono obbligatori' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      partner: partnerId,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Errore nella creazione del prodotto:', err);
    res.status(500).json({ message: 'Errore nella creazione del prodotto' });
  }
};

// Aggiorna un prodotto (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, partnerId } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.partner = partnerId || product.partner;

    await product.save();

    res.json(product);
  } catch (err) {
    console.error('Errore nell\'aggiornamento del prodotto:', err);
    res.status(500).json({ message: 'Errore nell\'aggiornamento del prodotto' });
  }
};

// Elimina un prodotto (Admin)
exports.deleteProductAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Prodotto eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione del prodotto:', error);
    res.status(500).json({ message: 'Errore interno del server', error: error.message });
  }
};