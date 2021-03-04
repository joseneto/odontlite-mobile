import {createSlice, createSelector} from "@reduxjs/toolkit";
import {apiRequest} from './api';

const slice = createSlice({
    name: "patients",
    initialState: {
        list: []     
    },
    reducers:{

        patientAdded: (patients, action) => {
            patients.list.unshift(action.payload);
        },

        
        patientUpdated: (patients, action) => {
            const index = patients.list.findIndex(user => user.id === action.payload.id)
            for (let attr in action.payload) {
                patients.list[index][attr] = action.payload[attr];                     
            }               
        },

        patientDeleted: (patients, action) =>{     
            const index = patients.list.findIndex(patient => patient.id === action.payload.id);
            patients.list.splice(index, 1);    
           
        },

        patientsReceived: (patients, action) =>{            
            patients.list = action.payload;
        },

        patientsPaged: (patients, action) =>{            
            patients.list = patients.list.concat(action.payload);                 
        }

    }

});


const {
    patientAdded, 
    patientUpdated,    
    patientsReceived,
    patientDeleted,
    patientsPaged
} = slice.actions;
export default slice.reducer;

//Create Action
export const addPatient = (patient) => apiRequest({
    url: "patients",
    method: 'post',
    data: patient,
    onSuccess: patientAdded.type    
})


export const updatePatient = (id, user) => apiRequest({
    url: "patients/"+id,
    method: 'patch',
    data: user,
    onSuccess: patientUpdated.type    
})

export const deletePatient = (id) => apiRequest({
    url: "patients/"+id,
    method: 'delete',
    onSuccess: patientDeleted.type    
})

export const getPatients = (term, lastId) => (dispatch) => {

    return dispatch(apiRequest({
        url: `patients?term=${term || ''}&lastId=${lastId || ''}`,        
        onSuccess: patientsReceived.type
        })
    );
}

export const addPagePatients = (term, lastId) => (dispatch) => {

    return dispatch(apiRequest({
        url: `patients?term=${term || ''}&lastId=${lastId || ''}`,        
        onSuccess: patientsPaged.type        
        })
    );
}

//Selector
export const getActivepatients = createSelector(
    state => state.entities.patients,
    patients => patients.list.filter(patient => !patient._deleted)
) 