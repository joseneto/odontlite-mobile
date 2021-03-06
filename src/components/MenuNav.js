import React,{useState} from 'react';
import {
    Text
  } from "react-native";
import Calendar from "./Calendar";
import Patient from "./Patient";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const RecentsRoute = () => <Text>Recents</Text>;

export default function MenuNav() {


  return (
 
    <Tab.Navigator
      initialRouteName="Feed"
      shifting={true}
      sceneAnimationEnabled={false}

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch(route.name){
            case "Agenda":
              iconName = focused
              ? 'time'
              : 'time-outline';
            break;
            case "Pacientes":
              iconName = focused
              ? 'people'
              : 'people-outline';
            break;
            case "Sair":
              iconName = focused
              ? 'log-out'
              : 'log-out-outline';
            break;
          }  
        

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}

    >
      <Tab.Screen
        name="Agenda"
        component={Calendar}
      
      />
      <Tab.Screen
        name="Pacientes"
        component={Patient}
      
      />
      <Tab.Screen
        name="Sair"
        component={RecentsRoute}
      
      />
    </Tab.Navigator>
    
  );
};

