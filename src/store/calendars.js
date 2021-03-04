import {createSlice, createSelector} from '@reduxjs/toolkit'
import {apiRequest} from './api';

const slice = createSlice({
    name: "calendars",
    initialState:{ 
        list: []        
    },
    reducers: {

        calendarUpdated: (calendars, action) => {
            const index = calendars.list.findIndex(calendar => calendar.id === action.payload.id)
            for (let attr in action.payload) {
                calendars.list[index][attr] = action.payload[attr];                     
            }               
        },
        calendarsReceived: (calendars, action) =>{            
            calendars.list = action.payload;
        },

        calendarSessionClear: (calendars, action) =>{            
            calendars.list = [];
        },
  
    }
});

const {
    calendarsReceived,   
    calendarUpdated    
} = slice.actions;
export default slice.reducer;

export const calendarSessionClear = slice.actions.calendarSessionClear;

//Create Action
export const getCalendar = (data) => (dispatch) => {

    return dispatch(apiRequest({
        url: `calendars?date=${data.date}&favorite=${data.favorite}`,
        onSuccess: calendarsReceived.type        
        })
    );
}
export const updateCalendarCheck= (id, calendar) => apiRequest({
    url: "calendars/"+id,
    method: 'patch',
    data: {action: 'CHECK', value: calendar},
    onSuccess: calendarUpdated.type    
})

export const updateCalendarPatient= (id, calendar) => apiRequest({
    url: "calendars/"+id,
    method: 'patch',
    data: {action: 'PATIENT', value: calendar},
    onSuccess: calendarUpdated.type    
})

export const updateCalendarTime= (id, calendar) => apiRequest({
    url: "calendars/"+id,
    method: 'patch',
    data: {action: 'TIME', value: calendar},
    onSuccess: calendarUpdated.type    
})

export const updateCalendarFavorite= (id, flag) => apiRequest({
    url: "calendars/"+id,
    method: 'patch',
    data: {action: 'FAVORITE', value: flag},
    onSuccess: calendarUpdated.type    
})

export const clearCalendar= (id, row) => apiRequest({
    url: "calendars/"+id,
    method: 'patch',
    data: {action: 'CLEAR', value: row},
    onSuccess: calendarUpdated.type    
})

export const filterCalendars = (data) => (dispatch) => {
    
    return dispatch(apiRequest({
        url: `calendars/filter?dateIni=${data.dateIni}&dateEnd=${data.dateEnd}`,
        onSuccess: calendarsReceived.type
        })
    );
}

//Selector
export const getActiveCalendars = createSelector(
    state => state.entities.calendars,
    calendars => calendars.list.filter(calendar => !calendar._deleted)
)  
