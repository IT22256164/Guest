import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppBar, Drawer } from '../../components/styles';
import Logout from '../Logout';
import SideBar from './SideBar';
import AdminProfile from './AdminProfile';
import AdminHomePage from './AdminHomePage';

import AddGuest from './guestRelated/AddGuest';
import SeeComplains from './guestRelated/SeeComplains';
import ShowGuests from './guestRelated/ShowGuests';
import GuestAttendance from './guestRelated/GuestAttendance';
import GuestExamMarks from './guestRelated/GuestExamMarks';
import ViewGuest from './guestRelated/ViewGuest';

import AddNotice from './noticeRelated/AddNotice';
import ShowNotices from './noticeRelated/ShowNotices';

import ShowNotes from './noteRelated/ShowNotes';
import NoteForm from './noteRelated/NoteForm';
import ViewNote from './noteRelated/ViewNote';

import AddVendor from './vendorRelated/AddVendor';
import ChooseTable from './vendorRelated/ChooseTable';
import ChooseNote from './vendorRelated/ChooseNote';
import ShowVendors from './vendorRelated/ShowVendors';
import VendorDetails from './vendorRelated/VendorDetails';

import AddTable from './tableRelated/AddTable';
import TableDetails from './tableRelated/TableDetails';
import ShowTablees from './tableRelated/ShowTablees';
import AccountMenu from '../../components/AccountMenu';

const AdminDashboard = () => {
    const [open, setOpen] = useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar open={open} position='absolute'>
                    <Toolbar sx={{ pr: '24px' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Admin Dashboard
                        </Typography>
                        <AccountMenu />
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} sx={open ? styles.drawerStyled : styles.hideDrawer}>
                    <Toolbar sx={styles.toolBarStyled}>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <SideBar />
                    </List>
                </Drawer>
                <Box component="main" sx={styles.boxStyled}>
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<AdminHomePage />} />
                        <Route path='*' element={<Navigate to="/" />} />
                        <Route path="/Admin/dashboard" element={<AdminHomePage />} />
                        <Route path="/Admin/profile" element={<AdminProfile />} />
                        <Route path="/Admin/complains" element={<SeeComplains />} />

                        {/* Notice */}
                        <Route path="/Admin/addnotice" element={<AddNotice />} />
                        <Route path="/Admin/notices" element={<ShowNotices />} />

                        {/* Note */}
                        <Route path="/Admin/notes" element={<ShowNotes />} />
                        <Route path="/Admin/notes/note/:tableID/:noteID" element={<ViewNote />} />
                        <Route path="/Admin/notes/choosetable" element={<ChooseTable situation="Note" />} />

                        <Route path="/Admin/addnote/:id" element={<NoteForm />} />
                        <Route path="/Admin/table/note/:tableID/:noteID" element={<ViewNote />} />

                        <Route path="/Admin/note/guest/attendance/:guestID/:noteID" element={<GuestAttendance situation="Note" />} />
                        <Route path="/Admin/note/guest/marks/:guestID/:noteID" element={<GuestExamMarks situation="Note" />} />

                        {/* Table */}
                        <Route path="/Admin/addtable" element={<AddTable />} />
                        <Route path="/Admin/tablees" element={<ShowTablees />} />
                        <Route path="/Admin/tablees/table/:id" element={<TableDetails />} />
                        <Route path="/Admin/table/addguests/:id" element={<AddGuest situation="Table" />} />

                        {/* Guest */}
                        <Route path="/Admin/addguests" element={<AddGuest situation="Guest" />} />
                        <Route path="/Admin/guests" element={<ShowGuests />} />
                        <Route path="/Admin/guests/guest/:id" element={<ViewGuest />} />
                        <Route path="/Admin/guests/guest/attendance/:id" element={<GuestAttendance situation="Guest" />} />
                        <Route path="/Admin/guests/guest/marks/:id" element={<GuestExamMarks situation="Guest" />} />

                        {/* Vendor */}
                        <Route path="/Admin/vendors" element={<ShowVendors />} />
                        <Route path="/Admin/vendors/vendor/:id" element={<VendorDetails />} />
                        <Route path="/Admin/vendors/choosetable" element={<ChooseTable situation="Vendor" />} />
                        <Route path="/Admin/vendors/choosenote/:id" element={<ChooseNote situation="Norm" />} />
                        <Route path="/Admin/vendors/choosenote/:tableID/:vendorID" element={<ChooseNote situation="Vendor" />} />
                        <Route path="/Admin/vendors/addvendor/:id" element={<AddVendor />} />

                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </>
    );
}

export default AdminDashboard

const styles = {
    boxStyled: {
        backgroundColor: (theme) =>
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    },
    drawerStyled: {
        display: "flex"
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
}