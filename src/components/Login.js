import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,  
  ActivityIndicator
} from "react-native";
import { TextInput, Button, Snackbar } from 'react-native-paper';

const { useDispatch, useSelector } = require("react-redux");
const { signUser } = require("../store/users");
const { pad, addToken, getUser } = require('../utils/LibUtils');
const _ = require('lodash');
 
export default function Login({ navigation }) { 
  const [loading, setLoading] = useState(false);

  const [local, setLocal] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [errorLocal, setErrorLocal] = useState("");
  const [errorUser, setErrorUser] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  const token = useSelector(state => state.entities.users.token);

  const dispatch = useDispatch();


  useEffect(() => {

    const userSign = getUser();
   
    if(userSign.login){
      navigation.navigate('MenuNav');
    }

    if(token){      
      addToken(token);          
      navigation.navigate('MenuNav');
    }
    
 }, [token]);

  const handleIdentField = (text) => {    
    setLocal(pad(text, 6));    
    
  };

  const validForm = () => {
    if(!local.trim()){
      setErrorLocal("Informe um identificador.");
      return false;
    }

    if(!user.trim()){
      setErrorUser("Informe um usuário.");
      return false;
    }

    if(!password.trim()){
      setErrorPassword("Informe uma senha.");
      return false;
    }

    return true;
  }

  const handleConfirm = () => {

    resetStates();   
    if(!loading){
        
        if(validForm()){
            setLoading(true);            
            dispatch(signUser({login: user ,local: local,  password: password}))
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
    resetStates();            
  }

  const errorBehavior = (error) => {
    setLoading(false);
    setToastMessage(error);    
  }

  const resetStates = () => {
    setErrorLocal("");
    setErrorUser("");
    setErrorPassword("");
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleButton}>Odontlite</Text>
      <Image style={styles.image} source={require("../assets/logo.png")} />
 
      <View style={styles.inputView}>
        <TextInput
          mode="outlined"
          style={styles.TextInput}
          keyboardType = 'numeric'
          placeholder="Identificador"
          placeholderTextColor="#003f5c"
          value={local}
          onChangeText={(local) => handleIdentField(local)}
          />       
      </View>
      {!_.isEmpty(errorLocal) && <Text style={styles.textError}>{errorLocal}</Text>}
      <View style={styles.inputView}>
        <TextInput
          mode="outlined"
          autoCapitalize='none'
          autoCorrect={false}
          style={styles.TextInput}
          placeholder="Usuário"
          placeholderTextColor="#003f5c"
          value={user}
          onChangeText={(user) => setUser(user)}
        />
      
      </View>
      {!_.isEmpty(errorUser) && <Text style={styles.textError}>{errorUser}</Text>}
      <View style={styles.inputView}>
        <TextInput
          mode="outlined"
          autoCapitalize='none'
          autoCorrect={false}
          style={styles.TextInput}
          placeholder="Senha"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={password}
          onChangeText={(password) => setPassword(password)}
          
        />
        
      </View>
      {!_.isEmpty(errorPassword) && <Text style={styles.textError}>{errorPassword}</Text>}
      
      
      <Button style={styles.loginBtn} mode="contained" onPress={handleConfirm}>
                Entrar
              </Button>
   

    

      <Text style={styles.textFooter}>
        {'Copyright © '}      
          Odontlite
        {' '}
        {new Date().getFullYear()}
        {'.'}
      </Text>
      {loading &&  <ActivityIndicator size="large" color="#f44336"/>}
      <Snackbar
        visible={!_.isEmpty(toastMessage)}
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

  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  
  },
 
  image: {
    marginBottom: 40,
  },
 
  inputView: {    
    width: "84%",
    height: 45,
    marginTop: 20
    
  },
 
  TextInput: {    
    flex: 1,
    padding: 10
    
  },
 
  titleButton: {
    height: 30,
    marginBottom: 10,    
    fontSize: 25,
    fontFamily: 'Roboto-Regular',
  },

  textFooter: {
    height: 40,
    fontSize: 10,
    color: "grey",
    fontFamily: 'Roboto-Regular',
  },

  textError: {
    
    fontSize: 10,
    color: "red",
    fontFamily: 'Roboto-Regular',
    marginTop: 30
  },
 
  loginBtn: {
    width: "80%",
    height: 40,
    marginTop: 60,    
  },

  loginText: {    
    fontSize: 18,
    color: "#ffffff"
  },

});