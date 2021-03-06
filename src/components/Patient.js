import React,{useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity    
  } from "react-native";
import Toast from 'react-native-toast-message';
import { DataTable, Searchbar, FAB, Button, Card, TextInput, Portal, Dialog } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text'
import Loading from './Loading';

const { getPatients, deletePatient, addPagePatients, addPatient } = require("../store/patients");
const { useDispatch, useSelector } = require("react-redux");
const { addToken, getUser, toastFailure, toastSuccess } = require('../utils/LibUtils');
const _ = require('lodash');

export default function Patient({navigation})
{
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const [errorName, setErrorName] = useState("");
  const [errorContact, setErrorContact] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [update, setUpdate] = useState(false);

  const dispatch = useDispatch();
  const patients = useSelector(state => state.entities.patients.list.map(o => ({...o, tableData: {}})) );

  useEffect(() => {
  
    setLoading(true);
    dispatch(getPatients()).catch(error => {        
        toastFailure(error);                 
    }).finally(() => {
      setLoading(false);
    });
  }, []);

      
  const handleSearch =(event) => {
    setLoading(true);
    dispatch(getPatients(searchInput.current.value)).catch(error => {
      toastFailure(error);                    
    }).finally(() => {
      setLoading(false);
    });
    setSearchTerm(searchInput.current.value);
   
  }

  const handleRemove = (dataRow) => {
      if(window.confirm("Deseja realmente apagar esse registro?")){
          dispatch(deletePatient(dataRow.id))
          .then(() => {
            toastSuccess("Sucesso!"); 
          })
          .catch(error => {
            toastFailure(error);           
          }); 
      }
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
    setOpen(true);
    setUpdate(false);
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
  setErrorName("");
  setErrorContact("");      
  hideModal();
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
          <Toast ref={(ref) => Toast.setRef(ref)} />
          <View style={styles.container}>
          <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>                
              <View style={styles.containerSearch}>                       
                <Searchbar style={styles.inputSearch}
                    placeholder="Procurar"
                    onChangeText={(text) => setSearchTerm(text)}
                    value={searchTerm}
                    onIconPress={() => console.warn("do serach")}
                />                 
              </View>            
          </Card.Content>
          </Card>
          <DataTable>
              <DataTable.Header>
              <DataTable.Title>Paciente</DataTable.Title>
              <DataTable.Title numeric>Telefone</DataTable.Title>
              </DataTable.Header>

              {patients.map((patient, index) =>
                  <TouchableOpacity key={index} onPress={() => setOpen(true)}>
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{patient.name}</DataTable.Cell>
                    <DataTable.Cell numeric>{patient.contact}</DataTable.Cell>             
                  </DataTable.Row>
                </TouchableOpacity>
              )}

              <DataTable.Pagination
                page={page}
                numberOfPages={page}
                onPageChange={page => {
                  handleChangePage(page);
                }}
                label={`${page}`}              
              />
          </DataTable>
          <FAB              
              style={styles.fab}
              small
              icon="plus"
              onPress={addNewPatient}
          />
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
              </Dialog.Content>
              <Dialog.Actions>
                {update && <Button onPress={hideModal}>Excluir</Button>}
                <Button onPress={handleConfirm}>Confirmar</Button>
                <Button onPress={hideModal}>Sair</Button>
              </Dialog.Actions>

          </Dialog>    
        </Portal>
  
        <Loading visible={loading} onDismiss={() => setLoading(false)} />
      </SafeAreaView>
  )
}

const containerStyle = {backgroundColor: 'white', padding: 40};

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

    containerSearch: {
    
      width: "100%",
      flexDirection: 'row',
      alignContent: 'space-around',
      justifyContent: 'center'
    },

    inputSearch :{
      width: '70%'
    },

    fab: {
        position: 'absolute',
        margin: 36,
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