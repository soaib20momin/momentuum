
import React, { Component } from 'react';
import { Text, View, AsyncStorage, TouchableHighlight } from 'react-native';
import styles from "../styles/SignatureDisclaimer";
import { Card, Button } from "react-native-elements"; // 0.19.0
import { Ionicons } from "@expo/vector-icons"; // 6.2.2
import routes from "./../../../assets/config/RouteNames";
import config from "./../../../assets/config/endpoint";
import { StackNavigator } from 'react-navigation';

export default class Disclaimer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      cid: '',
    }
  }
  static navigationOptions = {
    title: 'Disclaimer',	
    headerMode: 'screen',		
    tabBarVisible: true		
  };
   render() {
    const { params } = this.props.navigation.state;
    this.state.cid = params ? params.caseid1 : "error";
    //console.log(this.state.cid + "disc");

    return (
      <View style={styles.container}>
        <View>
             <View style={styles.header}>
             <Text style={styles.disclaimer}>Disclaimer</Text>
        </View>
        
        <View style={styles.details}>
            <Text style={styles.textDetail}>
            The information on this application is true and correct to the best of my knowledge. 
            I authorize the person to whom this application is delivered to obtain my credit report from any credit-reporting 
            agency and to contact my current or previous landlord and/or employer(s) to establish or verify my financial 
            standing. 
            I understand that the disclosure of my SIN is optional and will only be used to verify that the credit report 
            request is accurately matched up with the correct data contained my credit history file. This information will be
            used strictly for the purposes of verifying information pursuant to entering into or renewing a tenancy agreement.
            My information will be held in the strictest confidence.
            </Text>
            </View>

            <View style={styles.buttonrow}>
                <TouchableHighlight>
                <Button
                icon={{name: 'close'}}
                backgroundColor='red'
                buttonStyle={styles.buttonStyle}
                onPress={() => this.props.navigation.navigate(routes.caseDetails, {caseid1: this.state.cid})}
                title='Decline' />
                </TouchableHighlight>
               
                <TouchableHighlight>
                <Button
                icon={{name: 'create'}}
                backgroundColor='#03A9F4'
                buttonStyle={styles.buttonStyle}
                onPress={() => this.props.navigation.navigate(routes.sign,
                  { cid1: this.state.cid })}
                title='Sign' />
                </TouchableHighlight>
            </View>
          </View>
      </View>
    );
  }
}