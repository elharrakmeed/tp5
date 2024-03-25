const mongoose = require('mongoose');
const db = require('./database');


const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  mdp: { type: String, required: true }
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;

// Import des modules nécessaires
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur'); // Assurez-vous que le chemin est correct

// Route pour l'enregistrement d'un utilisateur
router.post('/register', async (req, res) => {
    try {
        // Récupérer les données de la requête
        const { nom, email, login, mdp } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet utilisateur existe déjà." });
        }

        // Crypter le mot de passe
        const hashedPassword = await bcrypt.hash(mdp, 10);

        // Créer un nouvel utilisateur
        const newUser = new Utilisateur({ nom, email, login, mdp: hashedPassword });
        await newUser.save();

        // Répondre avec un message de succès
        res.status(201).json({ message: "Utilisateur créé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
    }
});

// Route pour la connexion d'un utilisateur
router.post('/login', async (req, res) => {
    try {
        // Récupérer les données de la requête
        const { email, mdp } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await Utilisateur.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "L'utilisateur n'existe pas." });
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(mdp, user.mdp);
        if (!validPassword) {
            return res.status(400).json({ message: "Mot de passe incorrect." });
        }

        // Créer un jeton JWT signé
        const token = jwt.sign({ id: user._id }, 'secret_key');

        // Répondre avec le jeton JWT
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la connexion de l'utilisateur." });
    }
});

module.exports = router;

