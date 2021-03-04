import React,{useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
  } from "react-native";
import { DatePicker } from 'react-native-woodpicker'
import Toast from 'react-native-toast-message';
const { getCalendar, updateCalendarPatient, updateCalendarTime, clearCalendar, updateCalendarFavorite, updateCalendarCheck ,calendarSessionClear } = require("../store/calendars");
const { useDispatch, useSelector } = require("react-redux");
const { pad, addToken, addDays, subDays, toastFailure, dateTextField, dateFormattedUTC } = require('../utils/LibUtils');

  export default function Login({ navigation }) { 

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({date: new Date(), favorite: true});
    const [formVisual, setFormVisual] = useState({date: new Date(), favorite: false, quantity: 0});

    const onChangeDate = (selectedDate) => {
      const newFormData = {...formData};
      newFormData.favorite = false;
      newFormData.date = selectedDate;
      setFormData(newFormData);
      
    };

    const shiftDate =(days) => {
    
      const formVisualTemp = {...formVisual};
      formVisualTemp.favorite = false;
      if(days === 1){
        formVisualTemp.date = addDays(dateTextField(formVisual.date), days);
      }else{
      
        formVisualTemp.date = subDays(dateTextField(formVisual.date), days*-1);
      }         

      setFormData(formVisualTemp);
    };

 

    return (
        <SafeAreaView style={styles.container}>
            <View  style={styles.header}>
              <Text style={styles.textHeader}>Agendados: {formVisual.quantity}</Text>
              <View style={styles.containerDate}> 
                <TouchableOpacity onPress={() => shiftDate(-1)}>
                  <Text style={styles.shiftButton}>{"<"}</Text>
                </TouchableOpacity>
                <View style={styles.inputView}>
                <DatePicker
                  onDateChange={(date) => onChangeDate(date)}
                  value={formData.date}
                  title="Data Agenda"
                  placeholder={dateFormattedUTC(dateTextField(formData.date))}
                  //iOSOnlyProps={{style: {color: 'green'} }}
                  //iosPickerMode="date"
                  //androidPickerMode="spinner"
                  //locale="fr"
                  //isNullable
                  //disable
                />
              </View>
                <TouchableOpacity onPress={() => shiftDate(1)}>
                  <Text style={styles.shiftButton}>{">"}</Text>
                </TouchableOpacity>
              </View>
              <Image style={styles.image} source={require("../assets/favorite_filled.png")} />
            </View>
        </SafeAreaView>
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center"      
    
    },

    containerDate: {
      flex: 1, 
      flexDirection: 'row',
      alignContent: 'space-around',
      justifyContent: 'space-between'
    },

    inputView: {
      alignItems: "center",     
      justifyContent: 'center',
      width: "40%",
      height: 35,
      borderColor: "grey",
      marginBottom: 10,
      borderWidth: 1,
      alignItems: "center",
      backgroundColor: "#fff",
    },
    textHeader: {
      height: 30,
      marginBottom: 10,    
      fontSize: 18,
      fontFamily: 'Roboto-Bold',
    },
    
    shiftButton: {
      
      color: "#2196f3",
      alignItems: "center",     
      justifyContent: 'center',
      fontSize: 25,
      fontFamily: 'Roboto-Bold',
      marginRight: 10,
      marginLeft: 10
    },  

    header: {
    
        width: "100%",
        height: 130,
        borderColor: "grey",
        marginBottom: 10,
        borderWidth: 1,
        alignItems: "center",
        backgroundColor: "#FBF5E2"
      },
   
  });