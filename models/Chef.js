const mongoose = require('mongoose');
const db = require('./database');

const chefSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  specialite: { type: String, required: true }
});

const Chef = mongoose.model('Chef', chefSchema);

module.exports = Chef;

const express = require('express');
const router = express.Router();
const Chef = require('../models/Chef');

// Route pour obtenir la liste de tous les chefs
router.get('/all', async (req, res) => {
    try {
        const chefs = await Chef.find();
        res.json(chefs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des chefs." });
    }
});

// Route pour ajouter un chef
router.post('/add', async (req, res) => {
    try {
        const { nom, specialite } = req.body;
        const chef = new Chef({ nom, specialite });
        await chef.save();
        res.status(201).json({ message: "Chef ajouté avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout du chef." });
    }
});

// Route pour mettre à jour les informations d'un chef par son nom
router.put('/update/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const { nom, specialite } = req.body;
        await Chef.findOneAndUpdate({ nom: name }, { nom, specialite });
        res.json({ message: "Informations du chef mises à jour avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour des informations du chef." });
    }
});

// Route pour supprimer un chef par son nom
router.delete('/delete/:name', async (req, res) => {
    try {
        const { name } = req.params;
        await Chef.findOneAndDelete({ nom: name });
        res.json({ message: "Chef supprimé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du chef." });
    }
});

module.exports = router;

