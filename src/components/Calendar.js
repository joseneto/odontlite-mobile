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
import { Card, Title, Button, IconButton, Colors } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DatePicker } from 'react-native-woodpicker';
import Toast from 'react-native-toast-message';
const { getCalendar, updateCalendarPatient, updateCalendarTime, clearCalendar, updateCalendarFavorite, updateCalendarCheck ,calendarSessionClear } = require("../store/calendars");
const { useDispatch, useSelector } = require("react-redux");
const { pad, addToken, addDays, subDays, toastFailure, dateTextField, dateFormattedUTC } = require('../utils/LibUtils');

export default function Calendar({ navigation }) { 

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({date: new Date(), favorite: false, quantity: 0});
  

  const onChangeDate = (selectedDate) => {
    const newFormData = {...formData};
    newFormData.favorite = false;
    newFormData.date = selectedDate;
    setFormData(newFormData);
    
  };

  const shiftDate =(days) => {
  
    const formVisualTemp = {...formData};
    formVisualTemp.favorite = false;
    if(days === 1){
      formVisualTemp.date = addDays(dateTextField(formData.date), days);
    }else{
    
      formVisualTemp.date = subDays(dateTextField(formData.date), days*-1);
    }         

    setFormData(formVisualTemp);
  };

  const setFavorite = () => {
    const formVisualTemp = {...formData};
    formVisualTemp.favorite = !formData.favorite;
    setFormData(formVisualTemp);
  }

  return (
      <SafeAreaView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.textHeader}>Agendados: {formData.quantity}</Text>
            
            <View style={styles.containerDate}>        
            <IconButton
                icon="arrow-left-bold-box"
                color="#2196f3"
                size={22}
                onPress={() => shiftDate(-1)}
              />     
              
              <View style={styles.inputView}>
              <DatePicker
                onDateChange={(date) => onChangeDate(date)}
                value={formData.date}
                title="Data Agenda"
                placeholder={dateFormattedUTC(dateTextField(formData.date))}                 
              />
            </View>
            <IconButton
                icon="arrow-right-bold-box"
                color="#2196f3"
                size={22}
                onPress={() => shiftDate(1)}
              />     
              
            </View>
          
            <TouchableOpacity style={{ marginTop: 45}} onPress={() => setFavorite()}>
              {formData.favorite && <Ionicons name="heart-outline" size={30} />}
              {!formData.favorite && <Ionicons name="heart" size={30} color="red" />}
              
            </TouchableOpacity>
          </Card.Content>
        </Card>
          
        
      </SafeAreaView>
          
  )
}

  const styles = StyleSheet.create({

    container: {
      height: "100%"
    },
    card: {      
      height: 140,
      elevation: 2
    },

    cardContent: {      
      alignItems: "center"      
    },

    favorite : {
      tintColor: "#f44336",
      marginTop: 45

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
      alignItems: "center",     
      justifyContent: 'center'
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