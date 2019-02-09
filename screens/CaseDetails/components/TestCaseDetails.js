import React from 'react';
import { AsyncStorage, Text, ScrollView, View, TextInput, StatusBar, TouchableHighlight, KeyboardAvoidingView, Button, FlatList, Image, Alert } from 'react-native';
import { Constants } from 'expo';
import endpoint from "../../../assets/config/endpoint";
import CaseUpdateForm from "./CaseUpdateForm";
import styles from "../styles/CaseDetailsStyles"
import Icon from 'react-native-vector-icons/FontAwesome'; // 4.5.0
import GrowingTextInput from './GrowingTextInput';
import { StackNavigator } from 'react-navigation';
import axios from "axios";
import RouteNames from '../../../assets/config/RouteNames';
//import Ripple from 'react-native-material-ripple';

class TestCaseDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            updateDetails: [],
            editable: true,
            token: ''
        };
        
    }

    

    static navigationOptions = {
        title: 'Case Details',
        headerRight: (
            <View style={{ flexDirection: 'row', paddingRight: 20 }}>
                <Icon name="trash" size={23} color="#fff" onPress={() => this.props.navigation.navigate(RouteNames.caseUpdateForm)} />
            </View>
        ),
        headerLeft: (
            <View style={{ flexDirection: 'row', paddingLeft: 20 }}>
                <Icon name="angle-left" size={23} color="#fff" onPress={() => this.props.navigation.navigate(RouteNames.caseUpdateForm)} />
            </View>
        ),
    };

    async componentDidMount() {
        //this.state.token = await AsyncStorage.getItem("token");
        this.state.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJzb2FpYiIsImV4cCI6MTUyMjM0MjExOSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwLyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC8ifQ.9pOx82l-_RhlyeJU-xBKlCg4B6UlmcDjv6PdMVH9qL4";

        var url = endpoint.api.url + endpoint.api.endpoints.casesDetail.caseDetailById + "37148";
        console.debug("Initiating GET request to endpoint: " + url);

        console.debug(this.state.token);
        // make the call
        axios({
            method: "get",
            url: url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token,
            }
        })
            .then(async response => {
                console.debug(
                    "Call was successful for login. Response status : " + response.status
                );
                console.debug(response.data);
                this.setState({
                    dataSource: response.data
                });
            })
            .catch(error => {
                if (error.response) {
                    // the response was other than 2xx status
                    if (error.response.status == 401) {
                        console.debug("Invalid username and password entered");
                        this.authError();
                    } else {
                        console.error("Invalid request sent. Status : " + error.response.status);
                        this.appError();
                    }
                } else {
                    console.error("Something went wrong in the request Status : " + error.response.status + " Response : " + error);
                    this.appError();
                }
            });

    }

 
    toggleEditable = () => {
        console.log(this.state.editable);
        this.setState({
            editable: !this.state.editable
        }, function() {
            console.log(this.state.editable);
        })
        
    }

    updateDetails = () => {
        console.log('clicked');
        let openDate = this.refs.openDate.value;
        let closeDate = this.refs.closeDate.value;
        let caseCode = this.refs.caseCode.value;
        let caseType = this.refs.caseType.value;
        let caseStatus = this.refs.caseStatus.value;
        let desc = this.refs.desc.value;

        let casedetails = {
            openDate,
            closeDate,
            caseCode,
            caseType,
            caseStatus,
            desc
        };

        let updateDetails = this.state.updateDetails;
        updateDetails.push(casedetails);

        this.setState({
            updateDetails: updateDetails
        });

        console.log(this.state.updateDetails);
    }
    
    render() {
        
        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{ paddingVertical: 0 }}
                    style={{ flex: 1, backgroundColor: '#f2f2f4' }}>

                    <FlatList
                        data={this.state.dataSource}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item }) =>

                            <View>
                                {/* Client Session */}
                                {/* Client Header */}
                                <View style={[styles.header]}>
                                    <Text style={[styles.category,styles.clientHeader]}>Client Details</Text>
                                </View>

                                {/* Client details */}
                                <View style={styles.details}>
                                    <View style={styles.clientFirstRow}>
                                        <Text style={styles.clientName}>{item.cli.firstName + " " + item.cli.lastname}</Text>
                                        <Text>#{item.cas.caseid}</Text>
                                    </View>
                                    <View style={styles.clientRow}>
                                    <Text style={styles.clienttext}>{item.cli.addressLine1} {item.cli.addressLine2}</Text>
                                    </View>
                                    <View style={styles.clientRow}>
                                        <Text>{item.cli.mainPhone}</Text>
                                        <Text>{item.cli.email}</Text>
                                    </View>
                                </View>
                                {/* Client Session Ends */}

                                {/* Case Session */}
                                {/* Case header */}
                                <View style={styles.header}>
                                    <Text style={styles.category}>Case Details</Text>
                                    <View style={{flexDirection: 'row'}}>
                                    <Icon name="check-circle" size={25} style={{ paddingTop: 10 }} color="#666" onPress={this.updateDetails} />
                                    <Icon name="edit" size={25} style={{ paddingTop: 10, paddingLeft: 20 }} color="#666" onPress={this.toggleEditable} />
                                    </View>
                                </View>

                                {/* Case details */}
                                <View style={styles.details}>
                                    <View style={[styles.row, styles.firstRow]}>
                                        <Text style={styles.fieldname}>Date</Text>
                                        <TextInput
                                            ref="openDate"
                                            placeholder="Open Date"
                                            underlineColorAndroid='#ffffff'
                                            style={styles.textInput}
                                            editable={this.state.editable}
                                            value={item.cas.caseOpenDate}
                                        />
                                    </View>
                                    <View style={[styles.row]}>
                                        <Text style={styles.fieldname}>Close Date</Text>
                                        <TextInput
                                            ref="closeDate"
                                            placeholder="Close Date"
                                            underlineColorAndroid='#ffffff'
                                            style={styles.textInput}
                                            editable={this.state.editable}
                                            value={item.cas.caseClosedDate}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.fieldname}>Case Code</Text>
                                        <TextInput
                                            ref="caseCode"
                                            placeholder="Case Code"
                                            underlineColorAndroid='#ffffff'
                                            style={styles.textInput}
                                            editable={this.state.editable}
                                            value={item.cas.caseCode}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.fieldname}>Case Type</Text>
                                        <TextInput
                                            ref="caseType"
                                            placeholder="Case Type"
                                            underlineColorAndroid='#ffffff'
                                            style={styles.textInput}
                                            editable={this.state.editable}
                                            value={item.cas.casetype}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.fieldname}>Case Status</Text>
                                        <TextInput
                                            ref="caseStatus"
                                            placeholder="Case Status"
                                            underlineColorAndroid='#ffffff'
                                            style={styles.textInput}
                                            editable={this.state.editable}
                                            value={item.cas.casestatus}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.fieldname}>Description</Text>
                                        <GrowingTextInput
                                            ref="desc"
                                            minHeight={80}
                                            placeholder="Description"
                                            underlineColorAndroid='#ffffff'
                                            style={styles.textInput}
                                            editable={this.state.editable}
                                            value={item.cas.casedescription}
                                        />
                                    </View>
                                </View>
                                {/* Case Session Ends */}

                            </View>
                        }
                    />
                    {/* Case Items Session */}
                    {/* Case Items header */}
                    <View style={styles.header}>
                        <Text style={styles.category}>Case Items</Text>
                        <Icon name="plus-square" onPress={this.updateDetails} size={25} style={{ paddingTop: 10 }} color="#444" />
                    </View>

                    {/* Case Items details */}

                    {/* ///Case Items goes here/// */}

                    {/* Case Items Session Ends */}

                </ScrollView>

                <StatusBar barStyle="light-content" />
            </View>
        )
    }
}

export default TestCaseDetails