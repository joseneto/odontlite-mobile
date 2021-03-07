
import { Alert } from "react-native";
import { MMKV } from 'react-native-mmkv';
import Toast from 'react-native-toast-message';

export const dayMonthYear = (dateString) =>{
    const dateObj =  new Date(dateString);
    // adjust 0 before single digit date
    const date = ("0" + dateObj.getDate()).slice(-2);
    // current month
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    // current year
    const year = dateObj.getFullYear();

    return [date, month, year];
}

export const dateFormattedUTC = (dateString) =>{
    const dateArray = dayMonthYear(dateString);
    return dateArray[0] + "/" + dateArray[1] + "/" + dateArray[2];
}

export const dateFormatted = (dateString) =>{
    
    const dateObj =  new Date(dateString+' 00:00:00');
    // adjust 0 before single digit date
    const date = ("0" + dateObj.getDate()).slice(-2);
    // current month
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    // current year
    const year = dateObj.getFullYear();

    return date + "/" + month + "/" + year;
}

export const dateTextField = (dateObj) =>{
    
    // adjust 0 before single digit date
    const date = ("0" + dateObj.getDate()).slice(-2);
    // current month
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    // current year
    const year = dateObj.getFullYear();

    return year + "-" + month + "-" + date;
}

export const addDays = (dateString, days) => {
    const copy = new Date(dateString)
    copy.setDate(copy.getDate() + days)
    return copy
}

export const subDays = (dateString, days) => {
    const copy = new Date(dateString)
    copy.setDate(copy.getDate() - days)
    return copy
}

export const pad = (num, size) => {
    num = num.toString().replace('0','');;
    while (num.length < size) num = "0" + num;    
    return num;
}

export const getUser = () => {

    const token = MMKV.getString('token');

    if(!token){
        return {}
    }else{
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
            return {}
        }
    }
    
}

export const addToken = (token) => {
    MMKV.set('token', token)    
}

export const remToken = () => {
    MMKV.delete('token');
}

export const isUserMaster = () => {
   return getUser().isMaster;
}

export const toastSuccess = (message) => {
    Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Sucesso',
        text2: message       
    });
 }

 export const toastFailure = (message) => {
    Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Falha',
        text2: message       
    });
 }
 
 export const AlertConfirm = (text, cancelFunction, confirmFunction) =>
    Alert.alert(
      "Alerta",
      text,
      [
        {
          text: "Cancelar",
          onPress: cancelFunction,
          style: "cancel"
        },
        { text: "OK", onPress: confirmFunction }
      ],
      { cancelable: false }
    );

export const AlertCancel = (text) =>
    Alert.alert(
      "Alerta",
      text,
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        }
      
      ],
      { cancelable: false }
    );
