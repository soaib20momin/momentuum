import React, { Component } from 'react';
import { Text, View, AsyncStorage } from 'react-native';

export default class Test extends React.Component{
  constructor(props) {
    super(props);
  }

   render() {
     const { params } = this.props.navigation.state;
     //so what you get from caselist screen is caseid. 
    const caseid = params ? params.caseid1 : "u";
     console.log("Test + " + caseid);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{caseid}</Text>
      </View>
    );
  }
}
