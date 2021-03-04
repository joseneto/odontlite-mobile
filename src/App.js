import React from "react";
import configureStore from "./store/configureStore"
import {Provider} from "react-redux"
import Login from "./components/Login";
import Calendar from "./components/Calendar";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const store = configureStore();
const Stack = createStackNavigator();

export default function App() { 

  return (
    <Provider store={store} >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Calendar">
          <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
          <Stack.Screen options={{headerShown: false}} name="Calendar" component={Calendar} />
        </Stack.Navigator>
      </NavigationContainer>   
    </Provider>
  );
}
 


