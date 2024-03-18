import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material'
import { getAllStablees } from '../../../redux/stableRelated/stableHandle';
import { useNavigate } from 'react-router-dom';
import { PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

const ChooseTable = ({ situation }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { stableesList, loading, error, getresponse } = useSelector((state) => state.stable);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllStablees(currentUser._id, "Stable"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error)
    }

    const navigateHandler = (tableID) => {
        if (situation === "Vendor") {
            navigate("/Admin/vendors/choosenote/" + tableID)
        }
        else if (situation === "Note") {
            navigate("/Admin/addnote/" + tableID)
        }
    }

    const stableColumns = [
        { id: 'name', label: 'Table Name', minWidth: 170 },
    ]

    const stableRows = stableesList && stableesList.length > 0 && stableesList.map((stable) => {
        return {
            name: stable.stableName,
            id: stable._id,
        };
    })

    const StableButtonHaver = ({ row }) => {
        return (
            <>
                <PurpleButton variant="contained"
                    onClick={() => navigateHandler(row.id)}>
                    Choose
                </PurpleButton>
            </>
        );
    };

    return (
        <>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    {getresponse ?
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <Button variant="contained" onClick={() => navigate("/Admin/addtable")}>
                                Add Table
                            </Button>
                        </Box>
                        :
                        <>
                            <Typography variant="h6" gutterBottom component="div">
                                Choose a table
                            </Typography>
                            {Array.isArray(stableesList) && stableesList.length > 0 &&
                                <TableTemplate buttonHaver={StableButtonHaver} columns={stableColumns} rows={stableRows} />
                            }
                        </>}
                </>
            }
        </>
    )
}

export default ChooseTable