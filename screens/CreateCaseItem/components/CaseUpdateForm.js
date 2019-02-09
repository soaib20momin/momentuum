import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, KeyboardAvoidingView, StatusBar, Button } from 'react-native';
import { Font, Constants } from 'expo';
import styles from "../styles/CaseDetailsStyles"
import DatePicker from 'react-native-datepicker' // 1.6.0
import { Dropdown } from 'react-native-material-dropdown'; // 0.7.2
import Icon from 'react-native-vector-icons/FontAwesome'; // 4.5.0
import GrowingTextInput from './GrowingTextInput'

  const countryOptions = [
    {label: 'Denmark', value: 'DK'},
    {label: 'Germany', value: 'DE'},
    {label: 'United State', value: 'US'}
  ]

class CaseUpdateForm extends React.Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        title: 'Case Update Form', 
        headerLeft: (
            <View style={{ flexDirection: 'row', paddingLeft: 20 }}>
                <Icon name="angle-left" size={25} color="#fff" onPress={() => this.props.navigation.navigate('CaseDetails')}></Icon>
            </View>
        ),
    };
    
    render() {
        return (
            <View style={styles.container}>

            <ScrollView
            keyboardDismissMode="on-drag"
            contentContainerStyle={{paddingTop: Constants.statusBarHeight}}
            style={{flex:1, backgroundColor: "#F8F8F9"}}>
            <KeyboardAvoidingView 
                backgroundColor="transparent"
                style={{ flex: 1 }}
                keyboardVerticalOffset={100}
                behavior={"position"}>
                <View style={[styles.row, styles.firstRow]}>
                    <Text style={styles.fieldname}>Open Date</Text>
                    <DatePicker
                        style={{}}
                        mode="date"
                        placeholder="select open date"
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                            width:0,
                            height:0,
                            },
                            dateInput: {
                            height: 30,
                            flex:1,
                            borderWidth:0
                            }
                            }}
                    />
                </View>
                <View style={[styles.row, styles.firstRow]}>
                    <Text style={styles.fieldname}> Close Date</Text>
                    <DatePicker
                        style={{}}
                        mode="date"
                        placeholder="select close date"
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                            width:0,
                            height:0,
                            },
                            dateInput: {
                            height: 30,
                            flex:1,
                            borderWidth:0
                            }
                            }}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.fieldname}>Case Code</Text>
                    <TextInput
                        ref={view => {this._casecode = view;}}
                        placeholder="Case Code"
                        autoCorrect={false}
                        underlineColorAndroid='#ffffff'
                        returnKeyType="next"    
                        style={styles.textInput}
                        onSubmitEditing={()=>{this._casetype.focus()}}
                        blurOnSubmit={false}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.fieldname}>Case Type</Text>
                    <TextInput
                        ref={view => {this._casetype = view;}}
                        placeholder="Case Type"
                        underlineColorAndroid='#ffffff'
                        returnKeyType="next"
                        style={styles.textInput}
                        onSubmitEditing={()=>{this._description.focus()}}
                        blurOnSubmit={false}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.fieldname}>Case Status</Text>
                    <TextInput
                        ref={view => {this._casetype = view;}}
                        placeholder="Case Status"
                        underlineColorAndroid='#ffffff'
                        returnKeyType="next"
                        style={styles.textInput}
                        onSubmitEditing={()=>{this._description.focus()}}
                        blurOnSubmit={false}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.fieldname}>Description</Text>
                    <GrowingTextInput
                        minHeight={80}
                        ref={view => {this._description = view;}}
                        placeholder="Description"
                        underlineColorAndroid='#ffffff'
                        style={styles.description}
                        onSubmitEditing={()=>{this._createdby.focus()}}
                        blurOnSubmit={false}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.fieldname}>Created By</Text>
                    <TextInput
                        ref={view => {this._createdby = view;}}
                        placeholder="Created By"
                        underlineColorAndroid='#ffffff'
                        returnKeyType="next"
                        style={styles.textInput}
                        onSubmitEditing={()=>{this._assignedto.focus()}}
                        blurOnSubmit={false}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.fieldname}>Assigned To</Text>
                    <TextInput
                        ref={view => {this._assignedto = view;}}
                        placeholder="Assigned To"
                        underlineColorAndroid='#ffffff'
                        returnKeyType="next"
                        style={styles.textInput}
                        onSubmitEditing={()=>{this._description.focus()}}
                        blurOnSubmit={false}
                    />
                </View>
                </KeyboardAvoidingView>
            </ScrollView>
            
            <Button
                title={"Save"}
                onPress={() => {
                    Alert.alert('You tapped the button!');
                  }}
            />

            <StatusBar barStyle="light-content" />
            </View>
          )
    }
}

export default CaseUpdateForm