import React,{useState} from 'react';
import {
    Text
  } from "react-native";

  import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

const MusicRoute = () => <Text>Music</Text>;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

export default function MenuNav() {


  return (
    <Tab.Navigator
      initialRouteName="Feed"
      shifting={true}
      sceneAnimationEnabled={false}
    >
      <Tab.Screen
        name="Feed"
        component={MusicRoute}
        options={{
          tabBarIcon: 'calendar-clock',
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={AlbumsRoute}
        options={{
          tabBarIcon: 'account-multiple',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={RecentsRoute}
        options={{
          tabBarIcon: 'door-open',
        }}
      />
    </Tab.Navigator>
  );
};

