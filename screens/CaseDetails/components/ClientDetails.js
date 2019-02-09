import React from 'react';
import endpoint from "../../../assets/config/endpoint";
import { ActivityIndicator, AsyncStorage, StyleSheet, Text, View, TextInput, ScrollView, Picker, KeyboardAvoidingView, FlatList } from 'react-native';
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from "../styles/CaseDetailsStyles";
import GrowingTextInput from './GrowingTextInput';
import DatePicker from 'react-native-datepicker';
import color from '../../../assets/styles/color';

class ClientDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            clientLoaded: false,
            dataSource: [],
            token: '',
            firstName: '',
            lastName: '',
            caseId: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            workArea: '',
            workPhone: '',
            email: '',
            status: ''
        };
    }

    MapData = () => {
        
        var client = this.state.dataSource.casedetails;
        console.log(client.cli.firstName);
                    
            this.setState({ firstName: client.cli.firstName });
            this.setState({ lastName: client.cli.lastname });
            this.setState({ caseId: client.cas.caseid });
            this.setState({ address1: client.cli.ruralAddress1 });
            this.setState({ address2: client.cli.ruralAddress2 });
            this.setState({ city: client.cli.city });
            this.setState({ state: client.cli.state });
            this.setState({ workArea: client.cli.workArea });
            this.setState({ workPhone: client.cli.workPhone });
            this.setState({ email: client.cli.email });
            this.setState({ status: client.cli.status });
 
    }

    async componentDidMount() {

        // Get case items from parent 
        console.log("Inside component did mount Case Items");
        // Get State for caseId       
         this.state.caseId=this.props.CaseId;
         //this.state.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI5MDkwIiwiZXhwIjoxNTI1MjAzMjI4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAvIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwLyJ9.V3U3UqnXXUwy-rRxwSDcQpgX7nbhaTArOTkYtjJdSHw"
         this.state.token = await AsyncStorage.getItem("token");
         console.log("Case ID inside of Case Items is "+this.state.caseId)

        var url = endpoint.api.url + endpoint.api.endpoints.casesDetail.caseDetailById + this.state.caseId;
        console.debug("Initiating GET request to endpoint: " + url);

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
                //console.debug(response.data);
                this.setState({
                    dataSource: response.data,
                    clientLoaded:true
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
        //contact email
        const workEmail = this.state.email;
        const workEmailField = workEmail ? (
                <Text style={styles.clientSecondElement}><Icon name="envelope-open" size={14} color={color.gray.hex} /> {this.state.email}</Text>
        ) : (
            <Text style={styles.clientSecondElement}> </Text>
        );

        //contact number
        const workPhone = this.state.workPhone;
        const workPhoneField = workPhone ? (
            <View style={styles.clientRow}>
                <Text style={styles.clientFirstElement}><Icon name="phone" size={14} color={color.gray.hex} /> {this.state.workArea} - {this.state.workPhone}</Text>
                {workEmailField}
            </View>
        ) : (
            <View style={styles.clientRow}>
                <Text style={styles.clientSecondElement}><Icon name="envelope-open" size={14} color={color.gray.hex} /> {this.state.email}</Text>
                <Text style={styles.clientFirstElement}></Text>
            </View>
        );

        //contact address1
        const address1 = this.state.address1;
        const address1Field = address1 ? (
            <Text style={[styles.clienttext, styles.clientFirstElement]}><Icon name="address-card" size={14} color={color.gray.hex} /> {this.state.address1},</Text>
        ) : (
            <Text style={[styles.clienttext, styles.clientFirstElement]}> </Text>
        );

        //contact city
        const city = this.state.city;
        const cityField = city ? (
            <View style={styles.clientRow}>
                <Text style={[styles.clienttext, styles.clientFirstElement]}>  {this.state.city}, {this.state.state}</Text>
            </View>
        ) : (
            <View style={styles.clientRow}>
                <Text style={[styles.clienttext, styles.clientFirstElement]}> {this.state.state}</Text>
            </View>
        );

        //contact status
        const status = this.state.status;
        const statusField = status ? (
            <Text style={styles.clientSecondElement}><Icon name="laptop" size={14} color={color.gray.hex} /> {this.state.status}</Text>
        ) : (
            <Text style={styles.clientSecondElement}> </Text>
        );

        //Page loading logo
        if (!this.state.clientLoaded) {
            return (
                <View style={{ flex: 1, minHeight: 100 }}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                        <View>
                            {/* Client Session */}
                            {/* Client Header */}
                            {/* Client details */}
                            <View style={styles.details}>
                                <View style={styles.clientFirstRow}>
                                    <Text style={[styles.clientName, styles.clientFirstElement]}><Icon name="user" size={14} color={color.gray.hex} /> {this.state.firstName + " " + this.state.lastName}</Text>
                                    <Text style={styles.clientSecondElement}><Icon name="hashtag" size={14} color={color.gray.hex} /> {this.state.caseId}</Text>
                                </View>
                                <View style={styles.clientRow}>
                                    {address1Field}
                                    {statusField}
                                </View>
                                {cityField}
                                {workPhoneField}
                            </View>
                            {/* Client Session Ends */}
                        </View>
            </View>
        )
    }
}

export default ClientDetails;