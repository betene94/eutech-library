// backend/src/index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// GET /authors
app.get('/authors', async (req, res) => {
  try {
    const authors = await prisma.author.findMany();
    res.json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /authors : créer un nouvel auteur
app.post('/authors', async (req, res) => {
  try {
    const { firstName, lastName, biography } = req.body;
    // validation minimale
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'firstName et lastName sont requis.' });
    }
    const newAuthor = await prisma.author.create({
      data: { firstName, lastName, biography },
    });
    res.status(201).json(newAuthor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur à la création.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});