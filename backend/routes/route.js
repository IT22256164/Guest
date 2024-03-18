const router = require('express').Router();

// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

const { adminRegister, adminLogIn, getAdminDetail} = require('../controllers/admin-controller.js');

const { stableCreate, stableList, deleteStable, deleteStablees, getStableDetail, getStableGuests } = require('../controllers/table-controller.js');
const { complainCreate, complainList } = require('../controllers/complain-controller.js');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');
const {
    guestRegister,
    guestLogIn,
    getGuests,
    getGuestDetail,
    deleteGuests,
    deleteGuest,
    updateGuest,
    guestAttendance,
    deleteGuestsByTable,
    updateExamResult,
    clearAllGuestsAttendanceByNote,
    clearAllGuestsAttendance,
    removeGuestAttendanceByNote,
    removeGuestAttendance } = require('../controllers/guest_controller.js');
const { noteCreate, tableNotes, deleteNotesByTable, getNoteDetail, deleteNote, freeNoteList, allNotes, deleteNotes } = require('../controllers/note-controller.js');
const { vendorRegister, vendorLogIn, getVendors, getVendorDetail, deleteVendors, deleteVendorsByTable, deleteVendor, updateVendorNote, vendorAttendance } = require('../controllers/vendor-controller.js');

// Admin
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);

router.get("/Admin/:id", getAdminDetail)
// router.delete("/Admin/:id", deleteAdmin)

// router.put("/Admin/:id", updateAdmin)

// Guest

router.post('/GuestReg', guestRegister);
router.post('/GuestLogin', guestLogIn)

router.get("/Guests/:id", getGuests)
router.get("/Guest/:id", getGuestDetail)

router.delete("/Guests/:id", deleteGuests)
router.delete("/GuestsTable/:id", deleteGuestsByTable)
router.delete("/Guest/:id", deleteGuest)

router.put("/Guest/:id", updateGuest)

router.put('/UpdateExamResult/:id', updateExamResult)

router.put('/GuestAttendance/:id', guestAttendance)

router.put('/RemoveAllGuestsSubAtten/:id', clearAllGuestsAttendanceByNote);
router.put('/RemoveAllGuestsAtten/:id', clearAllGuestsAttendance);

router.put('/RemoveGuestSubAtten/:id', removeGuestAttendanceByNote);
router.put('/RemoveGuestAtten/:id', removeGuestAttendance)

// Vendor

router.post('/VendorReg', vendorRegister);
router.post('/VendorLogin', vendorLogIn)

router.get("/Vendors/:id", getVendors)
router.get("/Vendor/:id", getVendorDetail)

router.delete("/Vendors/:id", deleteVendors)
router.delete("/VendorsTable/:id", deleteVendorsByTable)
router.delete("/Vendor/:id", deleteVendor)

router.put("/VendorNote", updateVendorNote)

router.post('/VendorAttendance/:id', vendorAttendance)

// Notice

router.post('/NoticeCreate', noticeCreate);

router.get('/NoticeList/:id', noticeList);

router.delete("/Notices/:id", deleteNotices)
router.delete("/Notice/:id", deleteNotice)

router.put("/Notice/:id", updateNotice)

// Complain

router.post('/ComplainCreate', complainCreate);

router.get('/ComplainList/:id', complainList);

// Stable

router.post('/StableCreate', stableCreate);

router.get('/StableList/:id', stableList);
router.get("/Stable/:id", getStableDetail)

router.get("/Stable/Guests/:id", getStableGuests)

router.delete("/Stablees/:id", deleteStablees)
router.delete("/Stable/:id", deleteStable)

// Note

router.post('/NoteCreate', noteCreate);

router.get('/AllNotes/:id', allNotes);
router.get('/TableNotes/:id', tableNotes);
router.get('/FreeNoteList/:id', freeNoteList);
router.get("/Note/:id", getNoteDetail)

router.delete("/Note/:id", deleteNote)
router.delete("/Notes/:id", deleteNotes)
router.delete("/NotesTable/:id", deleteNotesByTable)

module.exports = router;