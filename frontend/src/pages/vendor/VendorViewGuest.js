import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Collapse, Table, TableBody, TableHead, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { calculateOverallAttendancePercentage, calculateNoteAttendancePercentage, groupAttendanceByNote } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart'
import { PurpleButton } from '../../components/buttonStyles';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const VendorViewGuest = () => {

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch();
    const { currentUser, userDetails, response, loading, error } = useSelector((state) => state.user);

    const address = "Guest"
    const guestID = params.id
    const teachNote = currentUser.teachNote?.subName
    const teachNoteID = currentUser.teachNote?._id

    useEffect(() => {
        dispatch(getUserDetails(guestID, address));
    }, [dispatch, guestID]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [stableName, setStableName] = useState('');
    const [guestEvent, setGuestEvent] = useState('');
    const [noteMarks, setNoteMarks] = useState('');
    const [noteAttendance, setNoteAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    useEffect(() => {
        if (userDetails) {
            setStableName(userDetails.stableName || '');
            setGuestEvent(userDetails.event || '');
            setNoteMarks(userDetails.examResult || '');
            setNoteAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(noteAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    return (
        <>
            {loading
                ?
                <>
                    <div>Loading...</div>
                </>
                :
                <div>
                    Name: {userDetails.name}
                    <br />
                    Roll Number: {userDetails.rollNum}
                    <br />
                    Table: {stableName.stableName}
                    <br />
                    Event: {guestEvent.eventName}
                    <br /><br />

                    <h3>Attendance:</h3>
                    {noteAttendance && Array.isArray(noteAttendance) && noteAttendance.length > 0
                        &&
                        <>
                            {Object.entries(groupAttendanceByNote(noteAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                if (subName === teachNote) {
                                    const noteAttendancePercentage = calculateNoteAttendancePercentage(present, sessions);

                                    return (
                                        <Table key={index}>
                                            <TableHead>
                                                <StyledTableRow>
                                                    <StyledTableCell>Note</StyledTableCell>
                                                    <StyledTableCell>Present</StyledTableCell>
                                                    <StyledTableCell>Total Sessions</StyledTableCell>
                                                    <StyledTableCell>Attendance Percentage</StyledTableCell>
                                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>

                                            <TableBody>
                                                <StyledTableRow>
                                                    <StyledTableCell>{subName}</StyledTableCell>
                                                    <StyledTableCell>{present}</StyledTableCell>
                                                    <StyledTableCell>{sessions}</StyledTableCell>
                                                    <StyledTableCell>{noteAttendancePercentage}%</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Button variant="contained" onClick={() => handleOpen(subId)}>
                                                            {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                                        </Button>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                                <StyledTableRow>
                                                    <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                        <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                            <Box sx={{ margin: 1 }}>
                                                                <Typography variant="h6" gutterBottom component="div">
                                                                    Attendance Details
                                                                </Typography>
                                                                <Table size="small" aria-label="purchases">
                                                                    <TableHead>
                                                                        <StyledTableRow>
                                                                            <StyledTableCell>Date</StyledTableCell>
                                                                            <StyledTableCell align="right">Status</StyledTableCell>
                                                                        </StyledTableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {allData.map((data, index) => {
                                                                            const date = new Date(data.date);
                                                                            const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                            return (
                                                                                <StyledTableRow key={index}>
                                                                                    <StyledTableCell component="th" scope="row">
                                                                                        {dateString}
                                                                                    </StyledTableCell>
                                                                                    <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                                </StyledTableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        </Collapse>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            </TableBody>
                                        </Table>
                                    )
                                }
                                else {
                                    return null
                                }
                            })}
                            <div>
                                Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                            </div>

                            <CustomPieChart data={chartData} />
                        </>
                    }
                    <br /><br />
                    <Button
                        variant="contained"
                        onClick={() =>
                            navigate(
                                `/Vendor/table/guest/attendance/${guestID}/${teachNoteID}`
                            )
                        }
                    >
                        Add Attendance
                    </Button>
                    <br /><br /><br />
                    <h3>Note Marks:</h3>

                    {noteMarks && Array.isArray(noteMarks) && noteMarks.length > 0 &&
                        <>
                            {noteMarks.map((result, index) => {
                                if (result.subName.subName === teachNote) {
                                    return (
                                        <Table key={index}>
                                            <TableHead>
                                                <StyledTableRow>
                                                    <StyledTableCell>Note</StyledTableCell>
                                                    <StyledTableCell>Marks</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody>
                                                <StyledTableRow>
                                                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                                </StyledTableRow>
                                            </TableBody>
                                        </Table>
                                    )
                                }
                                else if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return null
                            })}
                        </>
                    }
                    <PurpleButton variant="contained"
                        onClick={() =>
                            navigate(
                                `/Vendor/table/guest/marks/${guestID}/${teachNoteID}`
                            )}>
                        Add Marks
                    </PurpleButton>
                    <br /><br /><br />
                </div>
            }
        </>
    )
}

export default VendorViewGuest