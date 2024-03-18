import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getNoteDetails } from '../../../redux/stableRelated/stableHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress } from '@mui/material';

const AddVendor = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const noteID = params.id

  const { status, response, error } = useSelector(state => state.user);
  const { noteDetails } = useSelector((state) => state.stable);

  useEffect(() => {
    dispatch(getNoteDetails(noteID, "Note"));
  }, [dispatch, noteID]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false)

  const role = "Vendor"
  const event = noteDetails && noteDetails.event
  const teachNote = noteDetails && noteDetails._id
  const teachStable = noteDetails && noteDetails.stableName && noteDetails.stableName._id

  const fields = { name, email, password, role, event, teachNote, teachStable }

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(registerUser(fields, role))
  }

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl())
      navigate("/Admin/vendors")
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
    <div>
      <div tableName="register">
        <form tableName="registerForm" onSubmit={submitHandler}>
          <span tableName="registerTitle">Add Vendor</span>
          <br />
          <label>
            Note : {noteDetails && noteDetails.subName}
          </label>
          <label>
            Table : {noteDetails && noteDetails.stableName && noteDetails.stableName.stableName}
          </label>
          <label>Name</label>
          <input tableName="registerInput" type="text" placeholder="Enter vendor's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name" required />

          <label>Email</label>
          <input tableName="registerInput" type="email" placeholder="Enter vendor's email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email" required />

          <label>Password</label>
          <input tableName="registerInput" type="password" placeholder="Enter vendor's password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password" required />

          <button tableName="registerButton" type="submit" disabled={loader}>
            {loader ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  )
}

export default AddVendor