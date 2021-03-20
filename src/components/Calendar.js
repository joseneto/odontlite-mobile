import React,{useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Linking        
  } from "react-native";
import { List, Badge,Portal, Dialog, Switch, Button, Modal, Appbar, IconButton, Snackbar,Checkbox  } from 'react-native-paper';
import TagInput from 'react-native-tags-input';
import { DatePicker} from 'react-native-woodpicker';
import ModalSelector from 'react-native-modal-selector'
import Loading from './Loading';
import Patient from './Patient';

const { getCalendar, updateCalendarPatient, updateCalendarTime, clearCalendar, 
  updateCalendarFavorite, updateCalendarCheck, fullCalendar, updateTagPatient } = require("../store/calendars");
const { getTags } = require("../store/tags");
const { useDispatch, useSelector } = require("react-redux");
const { formatStringDate, dateTextField, AlertCancel, AlertConfirm } = require('../utils/LibUtils');
const _ = require('lodash');

export default function Calendar({ navigation }) { 

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({date: new Date(), favorite: true, quantity: 0});
  const [toastMessage, setToastMessage] = useState("");
  const [patient, setPatient] = useState({});
  const [openPatient, setOpenPatient] = useState(false);
  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");
  const [activeRow, setActiveRow] = useState({calendarId: '', row: 0 });
  const [stateTag, setStateTag] = useState({
    tags: {
      tag: '',
      tagsArray: []
    },
    suggestions: []
  });
  const dispatch = useDispatch();

  const calendars = useSelector(state => state.entities.calendars.list.map(o => ({...o, tableData: {}})) );
  const tags = useSelector(state => state.entities.tags.list.map(o => ({...o, tableData: {}})) );

  let hourData = [
    { label: "06", key: "06" },
    { label: "07", key: "07" },
    { label: "08", key: "08" },
    { label: "09", key: "09" },
    { label: "10", key: "10" },
    { label: "11", key: "11" },
    { label: "12", key: "12" },
    { label: "13", key: "13" },
    { label: "14", key: "14" },
    { label: "15", key: "15" },
    { label: "16", key: "16" },
    { label: "17", key: "17" },
    { label: "18", key: "18" },
    { label: "19", key: "19" },
    { label: "20", key: "20" }
    
  ];

  let minuteData = [
    { label: "00", key: "00" },
    { label: "10", key: "10" },
    { label: "20", key: "20" },
    { label: "30", key: "30" },
    { label: "40", key: "40" },
    { label: "50", key: "50" }    
  ];

  useEffect(() => {
    setLoading(true);    
    
    dispatch(getCalendar({date: dateTextField(formData.date), favorite: formData.favorite})).catch(error => {        
      setToastMessage(error);                   
    }).finally(() => {      
      setLoading(false);
    });

  }, [formData]);

  useEffect(() => {
    
    dispatch(getTags()).catch(error => {        
      setToastMessage(error);                   
    });

  }, []);

  const onChangeDate = (selectedDate) => {
    const newFormData = {...formData};
    newFormData.favorite = false;
    newFormData.date = selectedDate;
    setFormData(newFormData);    
  };

  const setFavorite = () => {
    const formVisualTemp = {...formData};
    formVisualTemp.favorite = !formData.favorite;
  
    setLoading(true);
    dispatch(updateCalendarFavorite(calendars[0].id, formVisualTemp.favorite)).catch(error => {        
      setToastMessage(error);                     
    }).finally(() => {      
      setFormData(formVisualTemp);    
      setLoading(false);
    });
  }

  const handleChange = (type, checked) => {
    setLoading(true);
    
    const patchData = {};
    patchData[`patient_${activeRow.row}`] = {...calendars[0][`patient_${activeRow.row}`]};

    if (type === 0){
        patchData[`patient_${activeRow.row}`].isFirstTime = checked;
    }else if (type === 1){
        patchData[`patient_${activeRow.row}`].isPrivate = checked;
    }else if (type === 2){
        patchData[`patient_${activeRow.row}`].isConfirmed = checked;
    }else if (type === 3){
      patchData[`patient_${activeRow.row}`].isReview = checked;
    }else if (type === 4){
      patchData[`patient_${activeRow.row}`].isFast = checked;
    }

    setPatient(patchData[`patient_${activeRow.row}`]);

    dispatch(updateCalendarCheck(activeRow.calendarId, patchData)).catch(error => {        
      setToastMessage(error);                     
    }).finally(() => {
     
      setLoading(false);
    });
   
  }

  const handleFull = (checked) => {
    setLoading(true);
    
    const patchData = {};
    patchData[`full`] = checked;

    dispatch(fullCalendar(calendars[0].id, checked)).catch(error => {        
      setToastMessage(error);                     
    }).finally(() => {
     
      setLoading(false);
    });
   
  }

  const handleRemove = () => {
    AlertConfirm("Deseja realmente limpar esse agendamento?",() => {}, doRemove);
  }

  const doRemove = () => {
    
    setLoading(true);
    dispatch(clearCalendar(activeRow.calendarId, activeRow.row)).catch(error => {        
      setToastMessage(error);                    
    }).finally(() => {
      hideModal();
      setLoading(false);
    });
    
  }

  const openDetailCalendar = (id, row, patient) => {
    const {hour: hourActual, minute: minuteActual} = getTimeRow(row);
    setActiveRow({calendarId: id, row: row })
    setOpen(true);
    setHour(hourActual);
    setMinute(minuteActual);
    setPatient(patient);
    
  }
  const hideModal= () => {
    setOpen(false);
  }

  const hideModalPatient= () => {
    setOpenPatient(false);
  }
  
  const setPatientReturn = (data) => {
    setLoading(true);
    
    const patchData = {};
    patchData[`patient_${activeRow.row}`] = {id: data.id, name: data.name, contact: data.contact};
    dispatch(updateCalendarPatient(activeRow.calendarId, patchData)).catch(error => {        
      setToastMessage(error);                       
    }).finally(() => {
      setPatient(patchData[`patient_${activeRow.row}`]);
      hideModalPatient();
      setLoading(false);
    });
   
  }

  const handleConfirmTime = (type, options) => {
    let newHour = 0;
    let newMinute = 0;

    if(type === "HOUR"){
      setHour(options.key);
      newHour = options.key;
      newMinute = minute;
    }else{
      setMinute(options.key);
      newHour = hour;
      newMinute = options.key;
    }

    const {hour: hourBefore, minute: minuteBefore} = getTimeRow(activeRow.row-1);
    const {hour: hourAfter, minute: minuteAfter} = getTimeRow(activeRow.row+1);

    if(hourBefore && hourBefore > newHour || (hourBefore === newHour && minuteBefore >= newMinute)){
      AlertCancel('Horário não pode ser inferior a agenda anterior');
      return;
    }else if(hourBefore && hourAfter < newHour || (hourAfter === newHour && minuteAfter <= newMinute)){
      AlertCancel('Horário não pode ser superior a próxima agenda');
      return;
    }

    setLoading(true);
    const patchData = {};
    patchData[`time_${activeRow.row}`] = `${newHour}:${newMinute}`;

    dispatch(updateCalendarTime(activeRow.calendarId, patchData)).catch(error => {        
      setToastMessage(error);                     
    }).finally(() => {
      setLoading(false);
    });

  };

  const getTimeRow = (row) => {

    if(row <= 0){

      return {hour: undefined, minute: undefined};
    }else if(row >= 17){

      return {hour: undefined, minute: undefined};
    }
    
    const timeSelected = calendars[0][`time_${row}`];
    const hour = timeSelected.split(':')[0];
    const minute = timeSelected.split(':')[1];

    return {hour: hour, minute: minute};
  };


  //TAGS SUGGESTION
  useEffect(() => {
    
    updateSuggestionState(stateTag.tags)

  }, [stateTag.tags]);

  const updateTagState = (state) => {
    console.log("update suggest", state);
    stateTag.tags = state;
    setStateTag(stateTag);
  };

  const updateSuggestionState = (state) => {

    console.log(tags);
    console.log(state);

    if (state.tag === '') {
      return
    }

    let tempSuggestions = [];                            
                                                        
    for (let i = 0; i < tags.length; i++) {            
      if (tags[i].name.includes(state.tag) === true) {      
        tempSuggestions.push(tags[i].name)                  
      }                                                
    }
    if (tempSuggestions.length > 0) {
      const tagStateCopy = {...stateTag};
      tagStateCopy.suggestions = tempSuggestions;
      setStateTag(tagStateCopy);
    } else {
      const tagStateCopy = {...stateTag};
      tagStateCopy.suggestions = [];
      setStateTag(tagStateCopy);
    }
  };

  const renderSuggestions = () => {

    if (stateTag.suggestions.length > 0 ) {
      return (
        stateTag.suggestions.map((item, count) => {
          return (
            <TouchableHighlight
              onPress={() => onSuggestionClick(item)}
              key={count}
            >
              <Text>{item}</Text>
            </TouchableHighlight>
          )
        })
      )
    } else {
      return null
    }
  }

  const onSuggestionClick = (suggestion) => {

    const tagStateCopy = {...stateTag};
    tagStateCopy.tags.tag = '';
    tagStateCopy.tags.tagsArray.push(suggestion);
    tagStateCopy.suggestions = [];
    setStateTag(tagStateCopy);

  }


  return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
              <Appbar.Content title={`Agenda: ${calendars && calendars[0] ? calendars[0].quantity : "0"}`} />
               <Checkbox
                  uncheckedColor="#ffffff"
                  color="#ffffff"
                  status={calendars && calendars[0] && calendars[0].full ? 'checked' : 'unchecked'}
                  onPress={() => {
                    const checked = calendars && calendars[0] && calendars[0].full;
                    handleFull(!checked);
                  }}
                />
                  <DatePicker
                    
                    placeholderStyle={{color:"#ffffff"}}
                    onDateChange={(date) => onChangeDate(date)}
                    value={calendars[0] && calendars[0].date ? calendars[0].date : formData.date}
                    title="Data Agenda"
                    placeholder={formatStringDate(calendars[0] && calendars[0].date)}                 
                  />
                  <Appbar.Action icon={calendars[0] && !calendars[0].favorite ?"heart-outline" :"heart" } onPress={() => setFavorite()} />   

              </Appbar.Header>
       
        <ScrollView>
        {calendars.map((value) => (
          <>
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((row, index) => {
            
            const free = _.isEmpty(value[`patient_${row}`].name);


            if(free && value.full) {
              return;
            }

            const spot = (free ? 'Disponível' : value[`patient_${row}`].name);
            const color = (free ? "gray" : (value[`patient_${row}`].isConfirmed ? "#8bc34a" :"#2196f3"));
            let infos = ""
            value[`patient_${row}`].tags && value[`patient_${row}`].tags.forEach(element => {
              infos += `[${element.name}] `
            });
            
             return  <TouchableOpacity key={row+"A"} onPress={() => openDetailCalendar(value.id, row, value[`patient_${row}`])}>
                <List.Item
                  description={infos}
                  key={row}
                  title={spot}       
                  left={props => <Badge style={{color: "#ffffff", backgroundColor: color}} size={35}>{value[`time_${row}`]}</Badge>}
                />
            </TouchableOpacity>
            }
            )}
          </>   
        ))}     
        </ScrollView>

        <Portal>
            <Dialog visible={open} onDismiss={hideModal} >
              <Dialog.Title>Calendário</Dialog.Title>
              <Dialog.Content>

              <View style={styles.containerNoFlexRow}>
               
                <ModalSelector
                    cancelButtonAccessibilityLabel={'Cancelar'}
                    data={hourData}
                    initValue={hour}
                    onChange={(option)=>{ handleConfirmTime("HOUR",option) }} />
                <Text>{" : "}</Text>
                <ModalSelector
                    cancelButtonAccessibilityLabel={'Cancelar'}
                    data={minuteData}
                    initValue={minute}
                    onChange={(option)=>{ handleConfirmTime("MINUTE",option) }} />
              </View>
            
              {_.isEmpty(patient.name) && 
              <Button style={styles.marginButton} icon="plus" mode="contained" onPress={() => setOpenPatient(true)}>
                Adicionar Paciente
              </Button>
              }
              {!_.isEmpty(patient.name) && 
              <>
              <View style={styles.marginButton}>
                <Text style={styles.textPatient}>
                  {patient.name}
                </Text>
                
                <View style={styles.viewContact}>
                  <Text style={styles.textContact}>
                    {patient.contact}
                  </Text>
                  <IconButton
                    icon="whatsapp"
                    color="#4caf50"
                    onPress={() => Linking.openURL(`whatsapp://send?text=Olá&phone=55${patient.contact}`)}
                  />
                    <IconButton
                    icon="phone"
                    color="#f50057"
                    onPress={() => Linking.openURL(`tel:${patient.contact}`)}
                  />
                </View>
              </View>

              <View style={styles.marginButton}>
                <View style={styles.containerNoFlexRow}>
                  <Text style={styles.textSwitch}>Confirmado</Text>
                  <Switch value={patient.isConfirmed} onValueChange={(c) => handleChange(2, c)} />
                </View>
              </View>

               <View style={styles.containerTag}>

                <TagInput
                  updateState={updateTagState}
                  tags={stateTag.tags}
                  autoCapitalize={'none'}
                  inputContainerStyle={[styles.tagInput]}
                  customElement={<View>{renderSuggestions()}</View>}
                />
              </View>
              </>
              }
              
              </Dialog.Content>
              <Dialog.Actions>
                {!_.isEmpty(patient.name) && 
                <>
                <Button onPress={handleRemove}>Excluir</Button>            
                </>
                }
                <Button onPress={hideModal}>Sair</Button>
              </Dialog.Actions>

          </Dialog>    
        </Portal>
        <Portal>
        <Modal visible={openPatient} onDismiss={hideModalPatient} style={{backgroundColor: 'white', height: "80%"}}>
          <Patient calendarReturn = {setPatientReturn} hideModal={hideModalPatient}/>
        </Modal>
        </Portal>
      <Loading visible={loading} onDismiss={() => setLoading(false)} />
      <Snackbar
        visible={!_.isEmpty(toastMessage)}
        style={styles.toast}
        onDismiss={() => setToastMessage("")}
        action={{
          label: 'Limpar',
          onPress: () => {
            setToastMessage("")
          },
        }}
       >
        {toastMessage}
      </Snackbar>
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

    containerRow: {
      flex: 1, 
      flexDirection: 'row',
      alignContent: 'space-around',
      justifyContent: 'space-between'
    },

    containerNoFlexRow: {
      flexDirection: 'row',
      alignContent: 'space-around',
      justifyContent: 'flex-start',
      alignItems: 'center'
      
    },

    inputView: {
      alignItems: "center",     
      justifyContent: 'center',
      width: "40%",
      height: 35,
      borderColor: "grey",
      marginBottom: 10,
      borderWidth: 1,      
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
   
    marginButton: {    
      marginTop: 10
    },

    containerTag: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
    },

    tagInput: {
      height: 45,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,      
    },

    textPatient: {
      fontSize: 16,
      fontFamily: 'Roboto-Bold',
    },

    textSwitch: {
      width: 100,
      fontSize: 14,
      fontFamily: 'Roboto-Regular',
    },

    textContact: {
      fontSize: 14,
      fontFamily: 'Roboto-Regular'
     
    },

    viewContact: {
      flexDirection: 'row',
      alignContent: 'space-around',
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    toast: {   
      marginBottom: 70   
    }

  });