import React, { useEffect } from 'react';
import { getVendorDetails } from '../../../redux/vendorRelated/vendorHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography } from '@mui/material';

const VendorDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, vendorDetails, error } = useSelector((state) => state.vendor);

    const vendorID = params.id;

    useEffect(() => {
        dispatch(getVendorDetails(vendorID));
    }, [dispatch, vendorID]);

    if (error) {
        console.log(error);
    }

    const isNoteNamePresent = vendorDetails?.teachNote?.subName;

    const handleAddNote = () => {
        navigate(`/Admin/vendors/choosenote/${vendorDetails?.teachStable?._id}/${vendorDetails?._id}`);
    };

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Container>
                    <Typography variant="h4" align="center" gutterBottom>
                        Vendor Details
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Vendor Name: {vendorDetails?.name}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Table Name: {vendorDetails?.teachStable?.stableName}
                    </Typography>
                    {isNoteNamePresent ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Note Name: {vendorDetails?.teachNote?.subName}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Note Sessions: {vendorDetails?.teachNote?.sessions}
                            </Typography>
                        </>
                    ) : (
                        <Button variant="contained" onClick={handleAddNote}>
                            Add Note
                        </Button>
                    )}
                </Container>
            )}
        </>
    );
};

export default VendorDetails;