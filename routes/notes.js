const express = require('express');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const user = require('../models/User');
const router = express.Router();

//ROUTE1: get all notes of user using GET at /api/notes/fetchallnotes  Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

//ROUTE2: Adding botes of user at /api/notes/addnotes  Login Required
router.post('/addnotes', fetchuser, [
    // Adding Valiadator 
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('desc', 'Descrption must be of atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, desc, tag } = req.body;
        // Checking for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const note = new Notes({
            title, desc, tag, user: req.user.id
        })
        const saveNote = await note.save();
        res.json(saveNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;