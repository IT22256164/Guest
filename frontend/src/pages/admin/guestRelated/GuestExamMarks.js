import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getNoteList } from '../../../redux/stableRelated/stableHandle';
import { updateGuestFields } from '../../../redux/guestRelated/guestHandle';

import Popup from '../../../components/Popup';
import { BlueButton } from '../../../components/buttonStyles';
import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl
} from '@mui/material';

const GuestExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { notesList } = useSelector((state) => state.stable);
    const { response, error, statestatus } = useSelector((state) => state.guest);
    const params = useParams()

    const [guestID, setGuestID] = useState("");
    const [noteName, setNoteName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [marksObtained, setMarksObtained] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (situation === "Guest") {
            setGuestID(params.id);
            const stdID = params.id
            dispatch(getUserDetails(stdID, "Guest"));
        }
        else if (situation === "Note") {
            const { guestID, noteID } = params
            setGuestID(guestID);
            dispatch(getUserDetails(guestID, "Guest"));
            setChosenSubName(noteID);
        }
    }, [situation]);

    useEffect(() => {
        if (userDetails && userDetails.stableName && situation === "Guest") {
            dispatch(getNoteList(userDetails.stableName._id, "TableNotes"));
        }
    }, [dispatch, userDetails]);

    const changeHandler = (event) => {
        const selectedNote = notesList.find(
            (note) => note.subName === event.target.value
        );
        setNoteName(selectedNote.subName);
        setChosenSubName(selectedNote._id);
    }

    const fields = { subName: chosenSubName, marksObtained }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateGuestFields(guestID, fields, "UpdateExamResult"))
    }

    useEffect(() => {
        if (response) {
            setLoader(false)
            setShowPopup(true)
            setMessage(response)
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("error")
        }
        else if (statestatus === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Done Successfully")
        }
    }, [response, statestatus, error])

    return (
        <>
            {loading
                ?
                <>
                    <div>Loading...</div>
                </>
                :
                <>
                    <Box
                        sx={{
                            flex: '1 1 auto',
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                maxWidth: 550,
                                px: 3,
                                py: '100px',
                                width: '100%'
                            }}
                        >
                            <Stack spacing={1} sx={{ mb: 3 }}>
                                <Typography variant="h4">
                                    Guest Name: {userDetails.name}
                                </Typography>
                                {currentUser.teachNote &&
                                    <Typography variant="h4">
                                        Note Name: {currentUser.teachNote?.subName}
                                    </Typography>
                                }
                            </Stack>
                            <form onSubmit={submitHandler}>
                                <Stack spacing={3}>
                                    {
                                        situation === "Guest" &&
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">
                                                Select Note
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={noteName}
                                                label="Choose an option"
                                                onChange={changeHandler} required
                                            >
                                                {notesList ?
                                                    notesList.map((note, index) => (
                                                        <MenuItem key={index} value={note.subName}>
                                                            {note.subName}
                                                        </MenuItem>
                                                    ))
                                                    :
                                                    <MenuItem value="Select Note">
                                                        Add Notes For Marks
                                                    </MenuItem>
                                                }
                                            </Select>
                                        </FormControl>
                                    }
                                    <FormControl>
                                        <TextField type="number" label='Enter marks'
                                            value={marksObtained} required
                                            onChange={(e) => setMarksObtained(e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </FormControl>
                                </Stack>
                                <BlueButton
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 3 }}
                                    variant="contained"
                                    type="submit"
                                    disabled={loader}
                                >
                                    {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                                </BlueButton>
                            </form>
                        </Box>
                    </Box>
                    <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                </>
            }
        </>
    )
}

export default GuestExamMarks