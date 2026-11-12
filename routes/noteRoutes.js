// routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createNote, getNotes, deleteNote } = require('../controllers/noteController');

// Protect all note routes
router.use(auth);

// Create a note
router.post('/', createNote);

// Get all notes for the logged‑in user
router.get('/', getNotes);

// Delete a note by its id
router.delete('/:id', deleteNote);

module.exports = router;

