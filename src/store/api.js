import {createAction} from "@reduxjs/toolkit"

export const apiRequest = createAction("api/apiRequest");
export const apiRequestSuccess = createAction("api/apiRequestSuccess");
export const apiRequestFail = createAction("api/apiRequestFail");

 