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

// PUT /authors/:id — Mettre à jour un auteur
app.put('/authors/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { firstName, lastName, biography } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'firstName et lastName sont requis.' });
  }
  try {
    const updated = await prisma.author.update({
      where: { id },
      data: { firstName, lastName, biography },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: `Auteur avec id=${id} introuvable.` });
  }
});

// DELETE /authors/:id — Supprimer un auteur
app.delete('/authors/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.author.delete({ where: { id } });
    res.status(204).send(); // No Content
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: `Auteur avec id=${id} introuvable.` });
  }
});

// GET /books — Récupérer tous les livres
app.get('/books', async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        author: true,
        category: true,
      },
    });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des livres.' });
  }
});

// POST /books — Créer un nouveau livre
app.post('/books', async (req, res) => {
  try {
    const {
      title,
      isbn,
      publisher,
      publishYear,
      summary,
      coverUrl,
      available,
      authorId,
      categoryId,
    } = req.body;

    if (!title || !authorId) {
      return res.status(400).json({ error: 'title et authorId sont requis.' });
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        isbn,
        publisher,
        publishYear,
        summary,
        coverUrl,
        available: available ?? true,
        author: { connect: { id: Number(authorId) } },
        category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
      },
      include: { author: true, category: true },
    });

    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur à la création du livre.' });
  }
});

// GET /categories — Lister toutes les catégories
app.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des catégories.' });
  }
});

// POST /categories — Créer une nouvelle catégorie
app.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Le champ name est requis.' });
    }
    const newCat = await prisma.category.create({ data: { name } });
    res.status(201).json(newCat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur à la création de la catégorie.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});