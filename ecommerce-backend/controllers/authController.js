const User = require('../models/User');
const Partner = require('../models/partner'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, role: 'admin' }); // Verifica solo gli admin
    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il login' });
  }
};

exports.registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Nome utente già in uso' });
    }

    const newAdmin = new User({ username, password, role: 'admin' });
    await newAdmin.save();
    res.status(201).json({ message: 'Amministratore registrato con successo' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.registerPartner = async (req, res) => {
  const { username, password, businessName, contactEmail, contactPhone, address } = req.body;

  // Log dei dati ricevuti
  console.log('Dati ricevuti:', req.body);

  if (!username || !password || !businessName || !contactEmail || !contactPhone || !address) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  try {
    // Verifica che il nome utente non sia già in uso
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Nome utente già in uso' });
    }

    // Crittografa la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuovo utente con ruolo 'partner'
    const newUser = new User({
      username,
      email: contactEmail, // Assicurati che l'email sia valida e unica
      password: hashedPassword,
      role: 'partner',
    });

    await newUser.save();
    console.log('User creato:', newUser);

    // Crea un nuovo documento Partner con riferimento all'utente
    const newPartner = new Partner({
      user: newUser._id, // Associa il Partner all'utente creato
      businessName,
      contactEmail,
      contactPhone,
      address,
    });

    await newPartner.save();
    console.log('Partner creato:', newPartner);

    // Genera un token JWT per l'utente appena registrato
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Partner registrato con successo',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      partner: newPartner,
      token
    });
  } catch (err) {
    console.error('Errore durante la registrazione del partner:', err);
    res.status(500).json({ message: 'Errore interno del server', error: err.message });
  }
};

exports.loginPartner = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, role: 'partner' }); // Verifica solo i partner
    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il login' });
  }
};