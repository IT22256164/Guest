const Note = require('../models/noteSchema.js');
const Vendor = require('../models/vendorSchema.js');
const Guest = require('../models/guestSchema.js');

const noteCreate = async (req, res) => {
    try {
        const notes = req.body.notes.map((note) => ({
            subName: note.subName,
            subCode: note.subCode,
            sessions: note.sessions,
        }));

        const existingNoteBySubCode = await Note.findOne({
            'notes.subCode': notes[0].subCode,
            event: req.body.adminID,
        });

        if (existingNoteBySubCode) {
            res.send({ message: 'Sorry this subcode must be unique as it already exists' });
        } else {
            const newNotes = notes.map((note) => ({
                ...note,
                stableName: req.body.stableName,
                event: req.body.adminID,
            }));

            const result = await Note.insertMany(newNotes);
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const allNotes = async (req, res) => {
    try {
        let notes = await Note.find({ event: req.params.id })
            .populate("stableName", "stableName")
        if (notes.length > 0) {
            res.send(notes)
        } else {
            res.send({ message: "No notes found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const tableNotes = async (req, res) => {
    try {
        let notes = await Note.find({ stableName: req.params.id })
        if (notes.length > 0) {
            res.send(notes)
        } else {
            res.send({ message: "No notes found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const freeNoteList = async (req, res) => {
    try {
        let notes = await Note.find({ stableName: req.params.id, vendor: { $exists: false } });
        if (notes.length > 0) {
            res.send(notes);
        } else {
            res.send({ message: "No notes found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getNoteDetail = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (note) {
            note = await note.populate("stableName", "stableName")
            note = await note.populate("vendor", "name")
            res.send(note);
        }
        else {
            res.send({ message: "No note found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        // Set the teachNote field to null in vendors
        await Vendor.updateOne(
            { teachNote: deletedNote._id },
            { $unset: { teachNote: "" }, $unset: { teachNote: null } }
        );

        // Remove the objects containing the deleted note from guests' examResult array
        await Guest.updateMany(
            {},
            { $pull: { examResult: { subName: deletedNote._id } } }
        );

        // Remove the objects containing the deleted note from guests' attendance array
        await Guest.updateMany(
            {},
            { $pull: { attendance: { subName: deletedNote._id } } }
        );

        res.send(deletedNote);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteNotes = async (req, res) => {
    try {
        const deletedNotes = await Note.deleteMany({ event: req.params.id });

        // Set the teachNote field to null in vendors
        await Vendor.updateMany(
            { teachNote: { $in: deletedNotes.map(note => note._id) } },
            { $unset: { teachNote: "" }, $unset: { teachNote: null } }
        );

        // Set examResult and attendance to null in all guests
        await Guest.updateMany(
            {},
            { $set: { examResult: null, attendance: null } }
        );

        res.send(deletedNotes);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteNotesByTable = async (req, res) => {
    try {
        const deletedNotes = await Note.deleteMany({ stableName: req.params.id });

        // Set the teachNote field to null in vendors
        await Vendor.updateMany(
            { teachNote: { $in: deletedNotes.map(note => note._id) } },
            { $unset: { teachNote: "" }, $unset: { teachNote: null } }
        );

        // Set examResult and attendance to null in all guests
        await Guest.updateMany(
            {},
            { $set: { examResult: null, attendance: null } }
        );

        res.send(deletedNotes);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = { noteCreate, freeNoteList, tableNotes, getNoteDetail, deleteNotesByTable, deleteNotes, deleteNote, allNotes };