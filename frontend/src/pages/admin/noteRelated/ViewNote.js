import React, { useEffect, useState } from 'react'
import { getTableGuests, getNoteDetails } from '../../../redux/stableRelated/stableHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

const ViewNote = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, noteDetails, stableGuests, getresponse, error } = useSelector((state) => state.stable);

  const { tableID, noteID } = params

  useEffect(() => {
    dispatch(getNoteDetails(noteID, "Note"));
    dispatch(getTableGuests(tableID));
  }, [dispatch, noteID, tableID]);

  if (error) {
    console.log(error)
  }

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState('attendance');
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const guestColumns = [
    { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
  ]

  const guestRows = stableGuests.map((guest) => {
    return {
      rollNum: guest.rollNum,
      name: guest.name,
      id: guest._id,
    };
  })

  const GuestsAttendanceButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/guests/guest/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/note/guest/attendance/${row.id}/${noteID}`)
          }
        >
          Take Attendance
        </PurpleButton>
      </>
    );
  };

  const GuestsMarksButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/guests/guest/" + row.id)}
        >
          View
        </BlueButton>
        <PurpleButton variant="contained"
          onClick={() => navigate(`/Admin/note/guest/marks/${row.id}/${noteID}`)}>
          Provide Marks
        </PurpleButton>
      </>
    );
  };

  const NoteGuestsSection = () => {
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

            {selectedSection === 'attendance' &&
              <TableTemplate buttonHaver={GuestsAttendanceButtonHaver} columns={guestColumns} rows={guestRows} />
            }
            {selectedSection === 'marks' &&
              <TableTemplate buttonHaver={GuestsMarksButtonHaver} columns={guestColumns} rows={guestRows} />
            }

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                <BottomNavigationAction
                  label="Attendance"
                  value="attendance"
                  icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                />
                <BottomNavigationAction
                  label="Marks"
                  value="marks"
                  icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                />
              </BottomNavigation>
            </Paper>

          </>
        )}
      </>
    )
  }

  const NoteDetailsSection = () => {
    const numberOfGuests = stableGuests.length;

    return (
      <>
        <Typography variant="h4" align="center" gutterBottom>
          Note Details
        </Typography>
        <Typography variant="h6" gutterBottom>
          Note Name : {noteDetails && noteDetails.subName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Note Code : {noteDetails && noteDetails.subCode}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Note Sessions : {noteDetails && noteDetails.sessions}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Number of Guests: {numberOfGuests}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Table Name : {noteDetails && noteDetails.stableName && noteDetails.stableName.stableName}
        </Typography>
        {noteDetails && noteDetails.vendor ?
          <Typography variant="h6" gutterBottom>
            Vendor Name : {noteDetails.vendor.name}
          </Typography>
          :
          <GreenButton variant="contained"
            onClick={() => navigate("/Admin/vendors/addvendor/" + noteDetails._id)}>
            Add Note Vendor
          </GreenButton>
        }
      </>
    );
  }

  return (
    <>
      {subloading ?
        < div > Loading...</div >
        :
        <>
          <Box sx={{ width: '100%', typography: 'body1', }} >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                  <Tab label="Details" value="1" />
                  <Tab label="Guests" value="2" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <NoteDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <NoteGuestsSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      }
    </>
  )
}

export default ViewNote