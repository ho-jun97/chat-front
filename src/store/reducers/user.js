import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    value: { 
        isAuthoriezed: false,
        userID: '',
        username: '',
        introduction: ''
    }
};

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value : initialStateValue 
    },
    reducers: {
        login: (state, action) => {
            state.value = action.payload;
        },
        logout: (state) => {
            state.value = initialStateValue;
        },
        saveUserInfo: (state, action) => {
            state.value.username = action.payload.username;
            state.value.introduction = action.payload.introduction;
        }
    }
});

export default userSlice.reducer;

export const { login, saveUserInfo, logout } = userSlice.actions;
