import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Box, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';

const NoteForm = () => {
    const [notes, setNotes] = useState([{ subName: "", subCode: "", sessions: "" }]);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const stableName = params.id
    const adminID = currentUser._id
    const address = "Note"

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    const handleNoteNameChange = (index) => (event) => {
        const newNotes = [...notes];
        newNotes[index].subName = event.target.value;
        setNotes(newNotes);
    };

    const handleNoteCodeChange = (index) => (event) => {
        const newNotes = [...notes];
        newNotes[index].subCode = event.target.value;
        setNotes(newNotes);
    };

    const handleSessionsChange = (index) => (event) => {
        const newNotes = [...notes];
        newNotes[index].sessions = event.target.value || 0;
        setNotes(newNotes);
    };

    const handleAddNote = () => {
        setNotes([...notes, { subName: "", subCode: "" }]);
    };

    const handleRemoveNote = (index) => () => {
        const newNotes = [...notes];
        newNotes.splice(index, 1);
        setNotes(newNotes);
    };

    const fields = {
        stableName,
        notes: notes.map((note) => ({
            subName: note.subName,
            subCode: note.subCode,
            sessions: note.sessions,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/notes");
            dispatch(underControl())
            setLoader(false)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <form onSubmit={submitHandler}>
            <Box mb={2}>
                <Typography variant="h6" >Add Notes</Typography>
            </Box>
            <Grid container spacing={2}>
                {notes.map((note, index) => (
                    <React.Fragment key={index}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Note Name"
                                variant="outlined"
                                value={note.subName}
                                onChange={handleNoteNameChange(index)}
                                sx={styles.inputField}
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Note Code"
                                variant="outlined"
                                value={note.subCode}
                                onChange={handleNoteCodeChange(index)}
                                sx={styles.inputField}
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Sessions"
                                variant="outlined"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={note.sessions}
                                onChange={handleSessionsChange(index)}
                                sx={styles.inputField}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Box display="flex" alignItems="flex-end">
                                {index === 0 ? (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleAddNote}
                                    >
                                        Add Note
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleRemoveNote(index)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </React.Fragment>
                ))}
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" type="submit" disabled={loader}>
                            {loader ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </Box>
                </Grid>
                <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            </Grid>
        </form>
    );
}

export default NoteForm

const styles = {
    inputField: {
        '& .MuiInputLabel-root': {
            color: '#838080',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#838080',
        },
    },
};