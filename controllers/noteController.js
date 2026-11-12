// controllers/noteController.js
const Note = require('../models/Note');

// Create a new note
exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    const note = await Note.create({
      title,
      content,
      user: req.user.id // user id set by auth middleware
    });
    return res.status(201).json(note);
  } catch (err) {
    console.error('Create note error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// Get all notes of the authenticated user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(notes);
  } catch (err) {
    console.error('Get notes error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// Delete a specific note belonging to the user
exports.deleteNote = async (req, res) => {
  const noteId = req.params.id;

  // Validate ObjectId format (24 hex chars)
  if (!noteId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid note ID.' });
  }

  try {
    const note = await Note.findOneAndDelete({ _id: noteId, user: req.user.id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }
    return res.json({ message: 'Note deleted successfully.' });
  } catch (err) {
    console.error('Delete note error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

