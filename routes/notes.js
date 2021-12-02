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

//ROUTE3: update existing notes of user using PUT at /api/notes/updatenote  Login Required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, desc, tag } = req.body;
    try {
        const newNote = {};
        if (title) newNote.title = title;
        if (desc) newNote.desc = desc;
        if (tag) newNote.tag = tag;

        let note = await Notes.findById(req.params.id);
        if (!note)
            return res.status(404).send("Not Found!");

        if (note.user.toString() !== req.user.id)
            return res.status(401).send("Not allowed!");

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
//ROUTE4: delete existing notes of user using DELETE at /api/notes/deletenote  Login Required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note)
            return res.status(404).send("Not Found!");

        if (note.user.toString() !== req.user.id)
            return res.status(401).send("Not allowed!");

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;