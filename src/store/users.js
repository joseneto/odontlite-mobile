import {createSlice, createAction} from '@reduxjs/toolkit'
import {apiRequest} from './api';

export const usrLogOut = createAction("USER_LOGGED_OUT");

const slice = createSlice({
    name: "users",
    initialState:{ 
        list: [],
        loginSuccess: false,
        token: undefined        
    },
    reducers: {

        userSign: (users, action) => {           
            users.loginSuccess = true;
            users.token = action.payload;           
        }
       
    }
});

const {
    userSign  
} = slice.actions;

export default slice.reducer;

//Create Action

export const destroyUser = slice.actions.userDestroySession;

export const signUser = (user) => apiRequest({
    url: "auth",
    method: 'post',
    data: user,
    onSuccess: userSign.type    
})

