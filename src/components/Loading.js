import React from 'react';
import {
    ActivityIndicator
  } from "react-native";
import { Modal, Portal } from 'react-native-paper';


export default function Loading(props){

    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={props.onDismiss} style={{ alignItems: "center", justifyContent: "center", width: "100%", height:'100%'}}>
                <ActivityIndicator size="large" color="#f44336"/>
            </Modal>
        </Portal>
    );
}