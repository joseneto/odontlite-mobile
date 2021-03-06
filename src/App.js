import React from "react";
import configureStore from "./store/configureStore"
import {Provider} from "react-redux"
import Login from "./components/Login";
import MenuNav from './components/MenuNav';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const store = configureStore();
const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196f3',
    accent: '#f1c40f',
  },
};


export default function App() { 

  return (
    <Provider store={store} >
      <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
          <Stack.Screen options={{headerShown: false}} name="MenuNav" component={MenuNav} />
        </Stack.Navigator>
      </NavigationContainer>   
      </PaperProvider>
    </Provider>
  );
}
 


