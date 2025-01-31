import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    created_by: {
        id: null,
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        centraldatabase: {
            user_type: "",
            type: ""
        }
    },
    visible_to: [],
    comment_visible_to: [],
    comments: 0,
    project_id: null,
    premise_name: "",
    text: "",
    bg_img: null,
    bg_color: "#FFFFFF",
    likes: 0,
    source_language: "en",
    transationStatus: "",
    transactionId: "",
    hidden: false,
    ai_comments_generated: false,
    default_characters: false,
    comment_hidden: false,
    created_at: "",
    updated_at: "",
    filter_flag: null,
    comment_filter_flag: false,
    minutes: "",
    episodes: null,
    duration: "",
    nature_of_project: "",
    genre: "",
    sub_genre: "",
    period: "",
    geography: "",
    protagonist_name: "",
    protagonist_age: null,
    protagonist_type: "",
    antagonist_name: "",
    protagonist_want: "",
    setA: {},
    setB: null,
    setC: {},
    type_desc: {},
    subplot_desc: {},
    subplot_sequence: {},
    m_value: 0,
    d_value: 0,
    k_value: 0,
    premiseOwner: null,
    premiseCreator: null
};

export const premiseSlice = createSlice({
    name: "premise",
    initialState,
    reducers: {
        setPremise: (state, action) => {
            // Replace the entire premise object
            return action.payload;
        },
        updatePremise: (state, action) => {
            // Update specific fields of the premise object
            Object.keys(action.payload).forEach(key => {
                state[key] = action.payload[key];
            });
        },
        resetPremise: () => initialState
    }
});

// Export actions
export const { setPremise, updatePremise, resetPremise } = premiseSlice.actions;

// Export the reducer
export default premiseSlice.reducer;
