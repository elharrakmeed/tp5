const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cloudnative', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur lors de la connexion à MongoDB :'));
db.once('open', function() {
  console.log('Connecté à MongoDB avec succès !');
});

module.exports = db;
