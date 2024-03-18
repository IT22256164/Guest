import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getGuestsSuccess,
    detailsSuccess,
    getFailedTwo,
    getNotesSuccess,
    getSubDetailsSuccess,
    getSubDetailsRequest
} from './stableSlice';

const REACT_APP_BASE_URL = "http://localhost:5000"
export const getAllStablees = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}List/${id}`);
        if (result.data.message) {
            dispatch(getFailedTwo(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const getTableGuests = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/Stable/Guests/${id}`);
        if (result.data.message) {
            dispatch(getFailedTwo(result.data.message));
        } else {
            dispatch(getGuestsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const getTableDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data) {
            dispatch(detailsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const getNoteList = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getNotesSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const getVendorFreeTableNotes = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/FreeNoteList/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getNotesSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const getNoteDetails = (id, address) => async (dispatch) => {
    dispatch(getSubDetailsRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data) {
            dispatch(getSubDetailsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}