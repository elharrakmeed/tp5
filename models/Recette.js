const mongoose = require('mongoose');
const db = require('./database');


const recetteSchema = new mongoose.Schema({
  libelle: { type: String, required: true }
});

const Recette = mongoose.model('Recette', recetteSchema);

module.exports = Recette;


const express = require('express');
const router = express.Router();
const Recette = require('../models/Recette');

// Route pour obtenir la liste de toutes les recettes
router.get('/all', async (req, res) => {
    try {
        const recettes = await Recette.find();
        res.json(recettes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des recettes." });
    }
});

// Route pour ajouter une recette
router.post('/add', async (req, res) => {
    try {
        const { libelle } = req.body;
        const recette = new Recette({ libelle });
        await recette.save();
        res.status(201).json({ message: "Recette ajoutée avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout de la recette." });
    }
});

// Route pour mettre à jour les informations d'une recette par son nom
router.put('/update/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const { libelle } = req.body;
        await Recette.findOneAndUpdate({ libelle: name }, { libelle });
        res.json({ message: "Informations de la recette mises à jour avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour des informations de la recette." });
    }
});

// Route pour supprimer une recette par son nom
router.delete('/delete/:name', async (req, res) => {
    try {
        const { name } = req.params;
        await Recette.findOneAndDelete({ libelle: name });
        res.json({ message: "Recette supprimée avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la suppression de la recette." });
    }
});

module.exports = router;

