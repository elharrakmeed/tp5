const mongoose = require('mongoose');
const db = require('./database');


const restaurantSchema = new mongoose.Schema({
  chef_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
  recette_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Recette', required: true },
  nom: { type: String, required: true }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;

const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Chef = require('../models/Chef');
const Recette = require('../models/Recette');

// Route pour obtenir la liste de tous les restaurants
router.get('/all', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des restaurants." });
    }
});

// Route pour obtenir toutes les informations sur les chefs d'un restaurant
router.get('/chefs/:restaurantname', async (req, res) => {
    try {
        const { restaurantname } = req.params;
        const chefs = await Chef.find({ nom: restaurantname });
        res.json(chefs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des chefs du restaurant." });
    }
});

// Route pour obtenir toutes les informations sur les recettes d'un restaurant
router.get('/recettes/:restaurantname', async (req, res) => {
    try {
        const { restaurantname } = req.params;
        const recettes = await Recette.find({ nom: restaurantname });
        res.json(recettes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des recettes du restaurant." });
    }
});

// Route pour ajouter un restaurant
router.post('/add', async (req, res) => {
    try {
        const { chef_id, recette_id, nom } = req.body;
        const restaurant = new Restaurant({ chef_id, recette_id, nom });
        await restaurant.save();
        res.status(201).json({ message: "Restaurant ajouté avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout du restaurant." });
    }
});

// Route pour mettre à jour les informations d'un restaurant par son nom
router.put('/update/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const { chef_id, recette_id, nom } = req.body;
        await Restaurant.findOneAndUpdate({ nom: name }, { chef_id, recette_id, nom });
        res.json({ message: "Informations du restaurant mises à jour avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour des informations du restaurant." });
    }
});

// Route pour supprimer un restaurant par son nom
router.delete('/delete/:name', async (req, res) => {
    try {
        const { name } = req.params;
        await Restaurant.findOneAndDelete({ nom: name });
        res.json({ message: "Restaurant supprimé avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du restaurant." });
    }
});

module.exports = router;

