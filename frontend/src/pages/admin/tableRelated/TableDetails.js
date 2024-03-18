import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { getTableDetails, getTableGuests, getNoteList } from "../../../redux/stableRelated/stableHandle";
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Box, Container, Typography, Tab, IconButton
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { resetNotes } from "../../../redux/stableRelated/stableSlice";
import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import DeleteIcon from "@mui/icons-material/Delete";
import PostAddIcon from '@mui/icons-material/PostAdd';

const TableDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { notesList, stableGuests, stableDetails, loading, error, response, getresponse } = useSelector((state) => state.stable);

    const tableID = params.id

    useEffect(() => {
        dispatch(getTableDetails(tableID, "Stable"));
        dispatch(getNoteList(tableID, "TableNotes"))
        dispatch(getTableGuests(tableID));
    }, [dispatch, tableID])

    if (error) {
        console.log(error)
    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        // setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getTableGuests(tableID));
                dispatch(resetNotes())
                dispatch(getNoteList(tableID, "TableNotes"))
                setMessage("Deleted Successfully");
            })
    }

    const noteColumns = [
        { id: 'name', label: 'Note Name', minWidth: 170 },
        { id: 'code', label: 'Note Code', minWidth: 100 },
    ]

    const noteRows = notesList && notesList.length > 0 && notesList.map((note) => {
        return {
            name: note.subName,
            code: note.subCode,
            id: note._id,
        };
    })

    const NotesButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Note")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => {
                        navigate(`/Admin/table/note/${tableID}/${row.id}`)
                    }}
                >
                    View
                </BlueButton >
            </>
        );
    };

    const noteActions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Note',
            action: () => navigate("/Admin/addnote/" + tableID)
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Notes',
            action: () => deleteHandler(tableID, "NotesTable")
        }
    ];

    const TableNotesSection = () => {
        return (
            <>
                {response ?
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <GreenButton
                            variant="contained"
                            onClick={() => navigate("/Admin/addnote/" + tableID)}
                        >
                            Add Notes
                        </GreenButton>
                    </Box>
                    :
                    <>
                        <Typography variant="h5" gutterBottom>
                            Notes List:
                        </Typography>

                        <TableTemplate buttonHaver={NotesButtonHaver} columns={noteColumns} rows={noteRows} />
                        <SpeedDialTemplate actions={noteActions} />
                    </>
                }
            </>
        )
    }

    const guestColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
    ]

    const guestRows = stableGuests.map((guest) => {
        return {
            name: guest.name,
            rollNum: guest.rollNum,
            id: guest._id,
        };
    })

    const GuestsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Guest")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton
                    variant="contained"
                    onClick={() => navigate("/Admin/guests/guest/" + row.id)}
                >
                    View
                </BlueButton>
                <PurpleButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/guests/guest/attendance/" + row.id)
                    }
                >
                    Attendance
                </PurpleButton>
            </>
        );
    };

    const guestActions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Guest',
            action: () => navigate("/Admin/table/addguests/" + tableID)
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Guests',
            action: () => deleteHandler(tableID, "GuestsTable")
        },
    ];

    const TableGuestsSection = () => {
        return (
            <>
                {getresponse ? (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton
                                variant="contained"
                                onClick={() => navigate("/Admin/table/addguests/" + tableID)}
                            >
                                Add Guests
                            </GreenButton>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Guests List:
                        </Typography>

                        <TableTemplate buttonHaver={GuestsButtonHaver} columns={guestColumns} rows={guestRows} />
                        <SpeedDialTemplate actions={guestActions} />
                    </>
                )}
            </>
        )
    }

    const TableVendorsSection = () => {
        return (
            <>
                Vendors
            </>
        )
    }

    const TableDetailsSection = () => {
        const numberOfNotes = notesList.length;
        const numberOfGuests = stableGuests.length;

        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Table Details
                </Typography>
                <Typography variant="h5" gutterBottom>
                    This is Table {stableDetails && stableDetails.stableName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Notes: {numberOfNotes}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Number of Guests: {numberOfGuests}
                </Typography>
                {getresponse &&
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate("/Admin/table/addguests/" + tableID)}
                    >
                        Add Guests
                    </GreenButton>
                }
                {response &&
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate("/Admin/addnote/" + tableID)}
                    >
                        Add Notes
                    </GreenButton>
                }
            </>
        );
    }

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Box sx={{ width: '100%', typography: 'body1', }} >
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                                    <Tab label="Details" value="1" />
                                    <Tab label="Notes" value="2" />
                                    <Tab label="Guests" value="3" />
                                    <Tab label="Vendors" value="4" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                                <TabPanel value="1">
                                    <TableDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <TableNotesSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <TableGuestsSection />
                                </TabPanel>
                                <TabPanel value="4">
                                    <TableVendorsSection />
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default TableDetails;