import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getNoteList } from '../../../redux/stableRelated/stableHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, IconButton,
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowNotes = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { notesList, loading, error, response } = useSelector((state) => state.stable);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getNoteList(currentUser._id, "AllNotes"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        // setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)

        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getNoteList(currentUser._id, "AllNotes"));
                setMessage("Deleted Successfully");
            })
    }

    const noteColumns = [
        { id: 'subName', label: 'Sub Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 170 },
        { id: 'stableName', label: 'Table', minWidth: 170 },
    ]

    const noteRows = notesList.map((note) => {
        return {
            subName: note.subName,
            sessions: note.sessions,
            stableName: note.stableName.stableName,
            stableID: note.stableName._id,
            id: note._id,
        };
    })

    const NotesButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Note")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => navigate(`/Admin/notes/note/${row.stableID}/${row.id}`)}>
                    View
                </BlueButton>
            </>
        );
    };

    const actions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Note',
            action: () => navigate("/Admin/notes/choosetable")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Notes',
            action: () => deleteHandler(currentUser._id, "Notes")
        }
    ];

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {response ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton variant="contained"
                                onClick={() => navigate("/Admin/notes/choosetable")}>
                                Add Notes
                            </GreenButton>
                        </Box>
                        :
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            {Array.isArray(notesList) && notesList.length > 0 &&
                                <TableTemplate buttonHaver={NotesButtonHaver} columns={noteColumns} rows={noteRows} />
                            }
                            <SpeedDialTemplate actions={actions} />
                        </Paper>
                    }
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

        </>
    );
};

export default ShowNotes;