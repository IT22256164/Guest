import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllStablees } from '../../../redux/stableRelated/stableHandle';
import { CircularProgress } from '@mui/material';

const AddGuest = ({ situation }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { stableesList } = useSelector((state) => state.stable);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('')
    const [tableName, setTableName] = useState('')
    const [stableName, setStableName] = useState('')

    const adminID = currentUser._id
    const role = "Guest"
    const attendance = []

    useEffect(() => {
        if (situation === "Table") {
            setStableName(params.id);
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        dispatch(getAllStablees(adminID, "Stable"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Table') {
            setTableName('Select Table');
            setStableName('');
        } else {
            const selectedTable = stableesList.find(
                (tableItem) => tableItem.stableName === event.target.value
            );
            setTableName(selectedTable.stableName);
            setStableName(selectedTable._id);
        }
    }

    const fields = { name, rollNum, password, stableName, adminID, role, attendance }

    const submitHandler = (event) => {
        event.preventDefault()
        if (stableName === "") {
            setMessage("Please select a tablename")
            setShowPopup(true)
        }
        else {
            setLoader(true)
            dispatch(registerUser(fields, role))
        }
    }

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl())
            navigate(-1)
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
        <>
            <div tableName="register">
                <form tableName="registerForm" onSubmit={submitHandler}>
                    <span tableName="registerTitle">Add Guest</span>
                    <label>Name</label>
                    <input tableName="registerInput" type="text" placeholder="Enter guest's name..."
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name" required />

                    {
                        situation === "Guest" &&
                        <>
                            <label>Table</label>
                            <select
                                tableName="registerInput"
                                value={tableName}
                                onChange={changeHandler} required>
                                <option value='Select Table'>Select Table</option>
                                {stableesList.map((tableItem, index) => (
                                    <option key={index} value={tableItem.stableName}>
                                        {tableItem.stableName}
                                    </option>
                                ))}
                            </select>
                        </>
                    }

                    <label>Roll Number</label>
                    <input tableName="registerInput" type="number" placeholder="Enter guest's Roll Number..."
                        value={rollNum}
                        onChange={(event) => setRollNum(event.target.value)}
                        required />

                    <label>Password</label>
                    <input tableName="registerInput" type="password" placeholder="Enter guest's password..."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password" required />

                    <button tableName="registerButton" type="submit" disabled={loader}>
                        {loader ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Add'
                        )}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddGuest