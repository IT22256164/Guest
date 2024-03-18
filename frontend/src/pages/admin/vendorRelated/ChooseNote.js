import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Table, TableBody, TableContainer, TableHead, Typography, Paper } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom';
import { getVendorFreeTableNotes } from '../../../redux/stableRelated/stableHandle';
import { updateTeachNote } from '../../../redux/vendorRelated/vendorHandle';
import { GreenButton, PurpleButton } from '../../../components/buttonStyles';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

const ChooseNote = ({ situation }) => {
    const params = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [tableID, setTableID] = useState("");
    const [vendorID, setVendorID] = useState("");
    const [loader, setLoader] = useState(false)

    const { notesList, loading, error, response } = useSelector((state) => state.stable);

    useEffect(() => {
        if (situation === "Norm") {
            setTableID(params.id);
            const tableID = params.id
            dispatch(getVendorFreeTableNotes(tableID));
        }
        else if (situation === "Vendor") {
            const { tableID, vendorID } = params
            setTableID(tableID);
            setVendorID(vendorID);
            dispatch(getVendorFreeTableNotes(tableID));
        }
    }, [situation]);

    if (loading) {
        return <div>Loading...</div>;
    } else if (response) {
        return <div>
            <h1>Sorry all notes have vendors assigned already</h1>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <PurpleButton variant="contained"
                    onClick={() => navigate("/Admin/addnote/" + tableID)}>
                    Add Notes
                </PurpleButton>
            </Box>
        </div>;
    } else if (error) {
        console.log(error)
    }

    const updateNoteHandler = (vendorId, teachNote) => {
        setLoader(true)
        dispatch(updateTeachNote(vendorId, teachNote))
        navigate("/Admin/vendors")
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom component="div">
                Choose a note
            </Typography>
            <>
                <TableContainer>
                    <Table aria-label="stablees table">
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell align="center">Note Name</StyledTableCell>
                                <StyledTableCell align="center">Note Code</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(notesList) && notesList.length > 0 && notesList.map((note, index) => (
                                <StyledTableRow key={note._id}>
                                    <StyledTableCell component="th" scope="row" style={{ color: "white" }}>
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{note.subName}</StyledTableCell>
                                    <StyledTableCell align="center">{note.subCode}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {situation === "Norm" ?
                                            <GreenButton variant="contained"
                                                onClick={() => navigate("/Admin/vendors/addvendor/" + note._id)}>
                                                Choose
                                            </GreenButton>
                                            :
                                            <GreenButton variant="contained" disabled={loader}
                                                onClick={() => updateNoteHandler(vendorID, note._id)}>
                                                {loader ? (
                                                    <div tableName="load"></div>
                                                ) : (
                                                    'Choose Sub'
                                                )}
                                            </GreenButton>}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        </Paper >
    );
};

export default ChooseNote;