import React from 'react';
import { AsyncStorage, Text, ScrollView, View, TextInput, Picker, StatusBar, TouchableHighlight, KeyboardAvoidingView, Button, FlatList, Image } from 'react-native';
import { Constants } from 'expo';
import endpoint from "../../../assets/config/endpoint";
import CaseUpdateForm from "./CaseUpdateForm";
import CaseItems from './CaseItems'
import CaseItemDemo from './CaseItemDemo'
import styles from "../styles/CaseDetailsStyles"
import Icon from 'react-native-vector-icons/FontAwesome'; // 4.5.0
import GrowingTextInput from './GrowingTextInput';
import { StackNavigator } from 'react-navigation';
import axios from "axios";
import DatePicker from 'react-native-datepicker';
import color from '../../../assets/styles/color';
import routes from '../../../assets/config/RouteNames';


class CaseDetails extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            token: '',
            editable: false,
            firstName: '',
            lastName: '',
            caseId: '',
            address1: '',
            address2: '',
            mainPhone: '',
            email: '',
            openDate: '',
            closeDate: '',
            caseCode: '',
            caseDesc: '',
            casetype: '',
            casetypes: [
                {
                    "id": "Appointment",
                    "listtext": "Appointment",
                    "code": "234"
                },
                {
                    "id": "POC Exception",
                    "listtext": 'POC Exception',
                    "code": "1234"
                },
                {
                    "id": "Email",
                    "listtext": 'Email',
                    "code": "124"
                }
            ],
            casestatus: '',
            casestatuses: [
                {
                    "id": "Pending",
                    "listtext": "Pending",
                    "code": "23"
                },
                {
                    "id": "Scheduled",
                    "listtext": 'Scheduled',
                    "code": "43"
                }
            ]
        };
    }

    MapData = () => {
        this.state.dataSource.map((item, i) => {
            console.log(item.cas.casetype);
            this.setState({ firstName: item.cli.firstName });
            this.setState({ lastName: item.cli.lastname });
            this.setState({ caseId: item.cas.caseid });
            this.setState({ address1: item.cli.addressLine1 });
            this.setState({ address2: item.cli.addressLine2 });
            this.setState({ mainPhone: item.cli.mainPhone });
            this.setState({ email: item.cli.email });

            this.setState({ openDate: item.cas.caseOpenDate });
            this.setState({ closeDate: item.cas.caseClosedDate });
            this.setState({ caseCode: item.cas.caseCode });
            this.setState({ casetype: item.cas.casetype });
            this.setState({ casestatus: item.cas.casestatus });
            this.setState({ caseDesc: item.cas.casedescription });
        })
    }

    toggleEdit = () => {
        console.log(this.state.editable);
        this.setState({ editable: !this.state.editable });
    }

    updateData = () => {
        console.log(this.ref.caseCode.value);
        console.log(this.ref.caseType.value);
    }

    static navigationOptions = {
        title: 'Case Details',
        headerRight: (
            <View style={{ flexDirection: 'row', paddingRight: 20 }}>
                <Icon name="trash" size={25} color="#fff" onPress={() => this.props.navigation.navigate(routes.caseUpdateForm)} />
            </View>
        ),
        headerLeft: (
            <View style={{ flexDirection: 'row', paddingLeft: 20 }}>
                <Icon name="angle-left" size={25} color="#fff" onPress={() => this.props.navigation.navigate(routes.caseUpdateForm)} />
            </View>
        ),
    };

    async componentDidMount() {
        const { params } = this.props.navigation.state;
        const caseid = params ? params.caseid1 : "u";
        console.log("Test + " + caseid);
        this.state.token = await AsyncStorage.getItem("token");
        //this.state.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJzb2FpYiIsImV4cCI6MTUyMjM0MjExOSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwLyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC8ifQ.9pOx82l-_RhlyeJU-xBKlCg4B6UlmcDjv6PdMVH9qL4";

        var url = endpoint.api.url + endpoint.api.endpoints.casesDetail.caseDetailById + caseid;
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
                this.MapData();
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


    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1 }}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{ paddingVertical: 0 }}
                    style={{ flex: 1, backgroundColor: '#f2f2f4' }}>



                    <View>
                        {/* Client Session */}
                        {/* Client Header */}
                        <View style={[styles.header]}>
                            <Text style={[styles.category, styles.clientHeader]}>Client Details</Text>
                        </View>

                        {/* Client details */}
                        <View style={styles.details}>
                            <View style={styles.clientFirstRow}>
                                <Text style={styles.clientName}>{this.state.firstName + " " + this.state.lastName}</Text>
                                <Text>#{this.state.caseId}</Text>
                            </View>
                            <View style={styles.clientRow}>
                                <Text style={styles.clienttext}>{this.state.address1} {this.state.address2}</Text>
                            </View>
                            <View style={styles.clientRow}>
                                <Text>{this.state.mainPhone}</Text>
                                <Text>{this.state.email}</Text>
                            </View>
                        </View>
                        {/* Client Session Ends */}

                        {/* Case Session */}
                        {/* Case header */}
                        <View style={styles.header}>
                            <Text style={styles.category}>Case Details</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="check-circle" size={25} style={{ paddingTop: 10 }} color={color.green.hex} onPress={this.updateData} />
                                <Icon name="edit" size={25} style={{ paddingTop: 10, paddingLeft: 20 }} color="#666" onPress={this.toggleEdit} />
                            </View>
                        </View>
                        <View style={styles.details}>
                            <View style={[styles.row, styles.firstRow]}>
                                <Text style={styles.fieldname}>Open Date</Text>
                                <DatePicker
                                    disabled={!this.state.editable}
                                    mode="date"
                                    date={this.state.openDate}
                                    placeholder="select open date"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            width: 0,
                                            height: 0,
                                        },
                                        dateInput: {
                                            height: 30,
                                            borderWidth: 0
                                        }
                                    }}
                                    onDateChange={(date) => { this.setState({ openDate: date }) }}
                                />
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.fieldname}>Closed Date</Text>
                                <DatePicker
                                    disabled={!this.state.editable}
                                    mode="date"
                                    date={this.state.closeDate}
                                    placeholder="select closed date"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            width: 0,
                                            height: 0,
                                        },
                                        dateInput: {
                                            height: 30,
                                            borderWidth: 0
                                        }
                                    }}
                                    onDateChange={(date) => { this.setState({ closeDate: date }) }}
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
                                    onChangeText={(typedText) => { this.setState({ caseCode: typedText }) }}
                                    value={this.state.caseCode}
                                />
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.fieldname}>Case Type</Text>
                                <Picker
                                    enabled={this.state.editable}
                                    style={styles.picker}
                                    itemStyle={styles.picker}
                                    selectedValue={this.state.casetype}
                                    onValueChange={(typ) => this.setState({ casetype: typ })}>
                                    {this.state.casetypes.map((l, i) => { return <Picker.Item value={l.id} label={l.listtext} key={i} /> })}
                                </Picker>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.fieldname}>Case Status</Text>
                                <Picker
                                    enabled={this.state.editable}
                                    style={styles.picker}
                                    itemStyle={styles.picker}
                                    selectedValue={this.state.casestatus}
                                    onValueChange={(sta) => this.setState({ casestatus: sta })}>
                                    {this.state.casestatuses.map((l, i) => { return <Picker.Item value={l.id} label={l.listtext} key={i} /> })}
                                </Picker>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.fieldname}>Description</Text>
                                <GrowingTextInput
                                    minHeight={80}
                                    placeholder="Description"
                                    underlineColorAndroid='#ffffff'
                                    style={styles.textInput}
                                    editable={this.state.editable}
                                    onChangeText={(typedText) => { this.setState({ caseDesc: typedText }) }}
                                    value={this.state.caseDesc}
                                />
                            </View>
                        </View>
                        {/* Case Session Ends */}

                    </View>

                    {/* Case Items Session */}
                    {/* Case Items header */}
                    <View style={styles.header}>
                        <Text style={styles.category}>Case Items</Text>
                        <Icon name="plus-square" size={25} style={{ paddingTop: 10 }} color="#444" />
                    </View>

                    {/* Case Items details */}

                    {/* ///Case Items goes here/// */}
                    <CaseItems CaseID={this.state.caseId}/>
                    {/* Case Items Session Ends */}

                </ScrollView>

                <StatusBar barStyle="light-content" />
            </View>
        )
    }
}

export default CaseDetails