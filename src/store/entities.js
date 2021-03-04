import {combineReducers} from "redux";
import usersReducers from "./users";
import patientsReducers from "./patients";
import calendarsReducers from "./calendars"

export default combineReducers({
    users: usersReducers,
    patients: patientsReducers,
    calendars: calendarsReducers,
})