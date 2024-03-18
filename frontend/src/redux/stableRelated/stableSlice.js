import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stableesList: [],
    stableGuests: [],
    stableDetails: [],
    notesList: [],
    noteDetails: [],
    loading: false,
    subloading: false,
    error: null,
    response: null,
    getresponse: null,
};

const stableSlice = createSlice({
    name: 'stable',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSubDetailsRequest: (state) => {
            state.subloading = true;
        },
        getSuccess: (state, action) => {
            state.stableesList = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        getGuestsSuccess: (state, action) => {
            state.stableGuests = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        getNotesSuccess: (state, action) => {
            state.notesList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.notesList = [];
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getFailedTwo: (state, action) => {
            state.stableesList = [];
            state.stableGuests = [];
            state.getresponse = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        detailsSuccess: (state, action) => {
            state.stableDetails = action.payload;
            state.loading = false;
            state.error = null;
        },
        getSubDetailsSuccess: (state, action) => {
            state.noteDetails = action.payload;
            state.subloading = false;
            state.error = null;
        },
        resetNotes: (state) => {
            state.notesList = [];
            state.stableesList = [];
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getGuestsSuccess,
    getNotesSuccess,
    detailsSuccess,
    getFailedTwo,
    resetNotes,
    getSubDetailsSuccess,
    getSubDetailsRequest
} = stableSlice.actions;

export const stableReducer = stableSlice.reducer;