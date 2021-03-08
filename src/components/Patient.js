import React,{useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView    
  } from "react-native";
import Toast from 'react-native-toast-message';
import { DataTable, Searchbar, FAB, Button, Card, TextInput, 
  Portal, Dialog, Appbar } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text'
import Loading from './Loading';

const { getPatients, deletePatient, addPagePatients, addPatient, updatePatient } = require("../store/patients");
const { useDispatch, useSelector } = require("react-redux");
const { toastFailure, toastSuccess, AlertConfirm, dateFormatted, dateFormattedUTC } = require('../utils/LibUtils');
const _ = require('lodash');

export default function Patient(props)
{
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const [errorName, setErrorName] = useState("");
  const [errorContact, setErrorContact] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [calendar, setCalendar] = useState([]);
  const [update, setUpdate] = useState(false);

  const dispatch = useDispatch();
  const patients = useSelector(state => state.entities.patients.list.map(o => ({...o, tableData: {}})) );

  useEffect(() => {
  
    if(patients.length == 0){
      setLoading(true);
      dispatch(getPatients()).catch(error => {        
          toastFailure(error);                 
      }).finally(() => {
        setLoading(false);
      });
    }
   
  }, []);

      
  const handleSearch =() => {
    setLoading(true);
    dispatch(getPatients(searchTerm)).catch(error => {
      toastFailure(error);                    
    }).finally(() => {
      setLoading(false);
    });    
  }

const handleRemove = () => {
    AlertConfirm("Deseja apagar esete paciente?",() => {}, doRemove);
}

const doRemove = () => {
  
  dispatch(deletePatient(id))
  .then(() => {
    toastSuccess("Sucesso!"); 
  })
  .catch(error => {
    toastFailure(error);           
  }); 
  
}

const handleChangePage = (page) => {
    setLoading(true);
    setPage(page);
    dispatch(addPagePatients(searchTerm, patients[patients.length-1].id)).catch(error => {
      toastFailure(error);                       
    }).finally(() => {
      setLoading(false);
    });
}


const addNewPatient =() =>{
  resetStates();
  setOpen(true);
  setUpdate(false);
}

const updateRowPatient = (patient) =>{
  if(props.calendarReturn){
    props.calendarReturn(patient);
  }else{
    setId(patient.id);
    setName(patient.name);
    setContact(patient.contact);
    setCalendar(patient.calendar);
    setOpen(true);
    setUpdate(true);
  }
 
}

const handleConfirm = () => {
  
  setErrorName("");
  setErrorContact("");

  if(!loading){
      
      if(_.isEmpty(name)){
        setErrorName("Informe um nome.")
        return;           
      }

      if(_.isEmpty(contact)){
        setErrorContact("Informe um telefone.")
        return;           
      }

      setLoading(true);
      
      if(!update){
          dispatch(addPatient({name: name, contact: contact, healthPlanId: "", planNumber: ""}))
          .then(() => {
            successBehavior();
          })
          .catch(error => {
            errorBehavior(error);                
          });
        
      }else{
          dispatch(updatePatient(id, {name: name, contact: contact , healthPlanId: "", planNumber: ""}))
          .then(() => {
              successBehavior();
          })
          .catch(error => {
              errorBehavior(error);               
          });          
      }
    
  }      
};

const successBehavior = () => {
  setLoading(false);
  toastSuccess("Sucesso!");     
  hideModal();
}

const resetStates = () => {
  setErrorName("");
  setErrorContact("");      
  setName("");
  setContact("");
  setCalendar([]);
}

const errorBehavior = (error) => {
  setLoading(false);
  toastFailure(error);      
}

const hideModal= () => {
  setOpen(false);
}

  return (
      <SafeAreaView>
       
          {!props.calendarReturn &&
          <View>
            <Appbar.Header>
              <Appbar.Content title="Pacientes" />
              <Searchbar 
                  
                  iconColor="#ffffff" 
                  selectionColor="#ffffff" 
                  style={styles.inputSearchBar}
                  placeholder="Procurar"
                  onChangeText={(text) => setSearchTerm(text)}
                  value={searchTerm}
                  onIconPress={handleSearch}
                  underlineColorAndroid="transparent"
                  placeholderTextColor="#ffffff"
                  inputStyle={{color: '#ffffff'}}
                />                            
              </Appbar.Header>
          
            <Toast ref={(ref) => Toast.setRef(ref)} />
          </View>
          }
          <View style={styles.container}>
          {props.calendarReturn &&  
          <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>       
                
              <View style={styles.containerSearch}>                       
                <Searchbar style={styles.inputSearch}
                    placeholder="Procurar"
                    onChangeText={(text) => setSearchTerm(text)}
                    value={searchTerm}
                    onIconPress={handleSearch}                   
                />        
                 <Button style={styles.buttonOut} icon="door-open" mode="contained" onPress={() => props.hideModal()}>
                  Sair
                </Button>         
              </View>            
        
          </Card.Content>
          </Card>
            }
          <ScrollView>
            <DataTable>
                <DataTable.Header>
                <DataTable.Title>Paciente</DataTable.Title>
                <DataTable.Title numeric>Telefone</DataTable.Title>
                </DataTable.Header>

                {patients.map((patient, index) =>
                    <TouchableOpacity key={index} onPress={() => updateRowPatient(patient)}>
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{patient.name}</DataTable.Cell>
                      <DataTable.Cell numeric>{patient.contact}</DataTable.Cell>             
                    </DataTable.Row>
                  </TouchableOpacity>
                )}

               
            </DataTable>
          </ScrollView>
          </View>
          
          <Portal>
            <Dialog visible={open} onDismiss={hideModal} >
              <Dialog.Title>{update ? "Alterar " : "Incluir "}Paciente</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  mode="outlined"
                  label="Paciente"
                  value={name}
                  onChangeText={text => setName(text)}
                />
              {!_.isEmpty(errorName) && <Text style={styles.textError}>{errorName}</Text>}

                <TextInput
                  mode="outlined"
                  label={contact ? "": "Telefone"}
                  render={props =>
                    <TextInputMask
                        type={'cel-phone'}
                        options={{
                          maskType: 'BRL',
                          withDDD: true,
                          dddMask: '(99) '
                        }}
                        value={contact}
                        onChangeText={text => setContact(text)}
                      />
                  }
                />
              {!_.isEmpty(errorContact) && <Text style={styles.textError}>{errorContact}</Text>}

              
              {update && 
                 <Text style={styles.formText}>Agendas:</Text>}
           
            
            <ScrollView style={{height: 120}}>
            {update && calendar.slice().sort(function(a,b) {
                          a = a['date'];
                          b = b['date'];
                          return a > b ? -1 : a < b ? 1 : 0;
                      }).map((value, index) => {
                      return   <>
                    
                          <Text>{`Data: ${dateFormattedUTC(value.date)} - Hora: ${value.time}` } </Text>        
                    
                      </>
              
             })} 
            </ScrollView>

              </Dialog.Content>
              <Dialog.Actions>
                {update && <Button onPress={handleRemove}>Excluir</Button>}
                <Button onPress={handleConfirm}>Confirmar</Button>
                <Button onPress={hideModal}>Sair</Button>
              </Dialog.Actions>

          </Dialog>    
        </Portal>
        <FAB              
            style={styles.fab}
            large
            icon="plus"
            onPress={addNewPatient}
          />
        <Loading visible={loading} onDismiss={() => setLoading(false)} />
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({

    container: {
      height: "100%"
    },

    card: {      
      height: 70,
      elevation: 2
    },

    cardContent: {      
      alignItems: "center"      
    },

    buttonOut:{
      height: 40,
      marginLeft: 10,
      backgroundColor: "#f44336"
    },

    containerSearch: {      
      flexDirection: 'row',
      alignItems: "center",     
      justifyContent: 'center',
    },

    inputSearchBar :{
      width: '60%',
      backgroundColor: "#2196f3",
      elevation: 0    
    },

    inputSearch :{
      width: '70%',      
    },

    fab: {
        position: 'absolute',
        marginBottom: 80,
        marginRight: 40,
        right: 0,
        bottom: 0,
        backgroundColor: '#f44336'
    },

    flexRow :{
      marginTop: 20,      
      flexDirection: 'row',
      alignContent: 'space-around',
      justifyContent: 'space-between'
    },
   
    formText: {    
      fontSize: 18,
      fontFamily: 'Roboto-Regular',
    },

    textError: {
      height: 20,
      fontSize: 10,
      color: "red",
      fontFamily: 'Roboto-Regular',
    },
   
  });