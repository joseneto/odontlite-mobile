import axios from "axios";
import * as actions from "../../store/api";
import {apiUrl} from "../../../config";
import { MMKV } from 'react-native-mmkv';

const api = ({dispatch}) => next => async action => {

    if(action.type !== actions.apiRequest.type) return next(action);

    const {url, method, data, onSuccess, storeId} = action.payload;
    
    try{
       
        const response = await axios.request({
            url: apiUrl()+"/"+url,
            headers: {'x-auth-token':  MMKV.getString('token')},
            method,
            data
        })
       
        let payloadData = response.data;

        if(storeId){
            payloadData = {
                storeId,
                data: payloadData
            }
        }

        if(onSuccess) {
            
            dispatch({type: onSuccess, payload: payloadData});
        }else{
            dispatch(actions.apiRequestSuccess(payloadData));
        }

    }catch(error){        
        let errorData = error.message;
        if(error.response){
            errorData = error.response.data;
        }
        
        throw errorData      
    }

}

export default api;