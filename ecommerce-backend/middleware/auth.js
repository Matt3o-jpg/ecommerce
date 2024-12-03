const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  console.log('authenticateToken middleware chiamato');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Accesso negato: token mancante' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Errore nel middleware di autenticazione:', err);
    res.status(403).json({ message: 'Token non valido' });
  }
};

exports.isPartner = (req, res, next) => {
  console.log('isPartner middleware chiamato');
  console.log('Utente autenticato:', req.user);
  if (req.user.role !== 'partner') {
    return res.status(403).json({ message: 'Accesso riservato ai partner' });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accesso riservato agli amministratori' });
  }
  next();
};

