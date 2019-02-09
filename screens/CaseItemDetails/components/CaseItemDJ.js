import React from 'react';
import { AsyncStorage, Text, ScrollView, Picker, View, TextInput, StatusBar, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, Button, FlatList, Image, Alert } from 'react-native';
import { Constants } from 'expo';
import endpoint from "../../../assets/config/endpoint";
import styles from "../styles/CaseItemDetailsStyle";
import Icon from 'react-native-vector-icons/FontAwesome'; // 4.5.0
import GrowingTextInput from './GrowingTextInput';
import { StackNavigator } from 'react-navigation';
import axios from 'axios';
import Ripple from 'react-native-material-ripple';
import Spinner from 'react-native-loading-spinner-overlay';

const url = endpoint.api.url + endpoint.api.endpoints.caseItems.caseItem + '275314';

class CaseItemDetails extends React.Component {
    // static toggleEdit =() => {
    //     this.setState({ editMode: true });
    //     console.log(" state: ", this.state);
    // }

    static navigationOptions = {
        title: 'Case Item',
        headerLeft: (
            <View style={{ flexDirection: 'row', paddingLeft: 20 }}>
                <Icon name="angle-left" size={25} color="#fff" onPress={() => this.props.navigation.navigate('CaseUpdateForm')} />
            </View>
        ),
    };
    constructor(props) {
        super(props);
        this.state = {
            caseItem: {},
            token: '',
            editMode: false,
            spinnerVisible: false,
            caseItemActionCurrent:'',
            caseItemDescriptionCurrent:'',
            caseItemDetailsCurrent:'',
            caseItemStatusCurrent:'',
            caseItemAssignedToCurrent:'',
            caseItemId:"",
        };
    }
    
    deleteAlert(){
        Alert.alert(
            'Delete Case Item',
            'Do you want to delete this case item?',
            [
              {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
              {text: 'Yes', onPress: () => 
              {
                console.log('Yes Pressed');
                this.deleteCaseItem();
                this.props.navigation.navigate('CaseDetails',{ caseid1 :this.state.caseItem.caseid });
             }
                
              }
              ,
            ],
            { cancelable: false }
          )

    }
    deleteCaseItem(){
        var url = endpoint.api.url + endpoint.api.endpoints.caseItems.caseItem + this.state.caseItemId;
       
            {/* Soft delete call*/}
            axios({
                method: "delete",
                url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.token,
                }
            })
                .then(async response => {
                    console.debug(
                        'Call was successful for delete. Response status : ' + response.status
                    );
                    if (response.data.deleted!="false"){
                        console.log("Item was soft deleted");
                    }
                  
                    console.debug(response.data);
                    this.setState({
                        caseItem: response.data
                    });
                })
                .catch(error => {
                    if (error.response) {
                        // the response was other than 2xx status
                        if (error.response.status == 401) {
                            console.debug("Invalid username and password entered");
                           // this.authError();
                        } else {
                            console.error("Invalid request sent. Status : " + error.response.status);
                           // this.appError();
                        }
                    } else {
                        console.error("Something went wrong in the request Status : " + error.response.status + " Response : " + error);
                       // this.appError();
                    }
                });


    }

    async componentDidMount() {
        //this.state.token = await AsyncStorage.getItem("token");
        this.setState({ spinnerVisible: true });
        const { params } = this.props.navigation.state;
        this.state.caseItemId = params ? params.CaseItemId : "null";
        console.log("Test + " + this.state.caseItemId);
        this.state.token = await AsyncStorage.getItem("token");

        //this.state.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJzb2FpYiIsImV4cCI6MTUyMjM0MjExOSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwLyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC8ifQ.9pOx82l-_RhlyeJU-xBKlCg4B6UlmcDjv6PdMVH9qL4';
        var url = endpoint.api.url + endpoint.api.endpoints.caseItems.caseItem + this.state.caseItemId;
        
        console.debug('Initiating GET request to endpoint: ' + url);

        console.debug(this.state.token);
        // make the call
        axios({
            method: "get",
            url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token,
            }
        })
            .then(async response => {
                this.setState({ spinnerVisible: false });
                
                console.debug(
                    'Call was successful for login. Response status : ' + response.status
                );
                this.setState({
                    caseItem: response.data,
                    caseItemActionCurrent: response.data.caseItemAction,
                    caseItemDescriptionCurrent: response.data.caseItemDescription,
                    caseItemDetailsCurrent: response.data.caseItemDetail,
                    caseItemStatusCurrent: response.data.caseItemStatus,
                    caseItemAssignedToCurrent: response.data.caseItemAssigned,
                    }
                );
            })
            .catch(error => {
                this.setState({ spinnerVisible: false });
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
            this.baseState = this.state;
    }

    toggleEdit() {
        this.setState({ editMode: !this.state.editMode });
        // this.toggleReturn();
    }

    toggleReturn() {
        if (!this.state.editMode) {
            this.actionInput.setNativeProps({ text: this.state.caseItem.caseItemAction });
            this.descriptionInput.setNativeProps({ text: this.state.caseItem.caseItemDescription });
            this.detailInput.setNativeProps({ text: this.state.caseItem.caseItemDetail });
            // this.statusInput.setNativeProps({ itemValue: this.state.caseItem.caseItemStatus });
            this.assignedInput.setNativeProps({ text: this.state.caseItem.caseItemAssigned });
        }
    }

    save() {      
        this.setState({ spinnerVisible: true });
        let data= {
            "caseItemDescription": this.state.caseItemDescriptionCurrent,
            "caseItemStatus": this.state.caseItemStatusCurrent,
            "caseItemDetail": this.state.caseItemDetailsCurrent,
            "caseItemAction": this.state.caseItemActionCurrent,
            "caseItemAssigned": this.state.caseItem.caseItemAssigned,
            "caseItemDate": this.state.caseItem.caseItemDate,
            "caseItemFollowUpdate": null,
            "caseid": this.state.caseItem.caseid,
            "deleted": this.state.caseItem.deleted,
            "intId": this.state.caseItem.intId,
            "timeProcess": this.state.caseItem.timeProcess,
            "userId": this.state.caseItem.userId,
        };
        // console.log("Data: ", data);
        axios({
            method: "put",
            url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token,
            },
            data
        })
            .then(async response => {
                Alert.alert("Update Successful");
                this.setState({ spinnerVisible: false });
                this.setState(this.baseState);
                this.componentDidMount();
            })
            .catch(error => {
                Alert.alert("Update Unsuccessful");
                this.setState({ spinnerVisible: false });
                this.state.toggleReturn();
                console.debug(error);
            });
    }
    render() {
        const caseItem = this.state.caseItem;
        
        
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }} style={[{ display: 'none' }, this.state.spinnerVisible && {display: 'flex'}]}>
                    <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                </View>

            <View style={styles.header}>
                <Text style={[styles.category, { justifyContent: 'flex-start' }]}>Case Item Details</Text>
                <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                <Text style={[{ display: 'none' }, this.state.editMode && { display: 'flex', paddingHorizontal: 10 }]}>Editing</Text>
                <TouchableOpacity>
                <Icon name="edit" size={25} color="#444" onPress={() => this.toggleEdit()} style={[styles.editButton, this.state.editMode && styles.editButtonActive]} />
                </TouchableOpacity>
                <TouchableOpacity>
                <Icon name="trash" size={25} color="#444" style={styles.deleteButton} onPress={() => this.deleteAlert()}  />
                </TouchableOpacity>
                <TouchableOpacity>
                <Icon name="save" size={25} color="#444" style={[{ display: 'flex' }, !this.state.editMode && { display: 'none' }]} onPress={() => { this.save(); }} />
                </TouchableOpacity>
            </View>   
                        
            </View>
            
                <ScrollView
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{ paddingVertical: 0 }}
                    style={{ flex: 0.84, }}
                >
                <KeyboardAvoidingView
                behavior="padding"
                >
                    
                    <View style={styles.details}>
                        <View style={[styles.row, styles.firstRow]}>
                            <Text style={styles.fieldname}>Date</Text>
                            <TextInput
                                placeholder="Open Date"
                                underlineColorAndroid='#ffffff'
                                style={styles.textInput}
                                editable={false}
                                value={caseItem.caseItemDate}
                                
                            />
                        </View> 
                        <View style={[styles.row]}>
                            <Text style={styles.fieldname}>Action</Text>
                            <TextInput
                                placeholder="Action"
                                underlineColorAndroid='#ffffff'
                                style={styles.textInput}
                                editable={this.state.editMode}
                                onChangeText={(text) => this.setState({ caseItemActionCurrent: text })}
                                defaultValue={caseItem.caseItemAction}
                                selectTextOnFocus={true}
                                ref={(ref) => this.actionInput = ref}
                            />
                        </View>
                        <View style={[styles.row]}>
                            <Text style={styles.fieldname}>Description</Text>
                            <TextInput
                                placeholder="Description"
                                underlineColorAndroid='#ffffff'
                                style={styles.textInput}
                                editable={this.state.editMode}
                                onChangeText={(text) => this.setState({caseItemDescriptionCurrent: text })}
                                defaultValue={caseItem.caseItemDescription}
                                selectTextOnFocus={true}
                                ref={(ref) => this.descriptionInput = ref}                                
                            />
                        </View>

                        <View style={[styles.row]}>
                            <Text style={styles.fieldname}>Assigned To:</Text>
                            <TextInput
                                placeholder="Assigned To"
                                underlineColorAndroid='#ffffff'
                                style={styles.textInput}
                                editable={this.state.editMode}
                                onChangeText={(text) => this.setState({caseItemAssignedToCurrent: text })}
                                defaultValue={caseItem.caseItemAssigned}
                                selectTextOnFocus={true}
                                ref={(ref) => this.assignedInput = ref}                                
                            />
                        </View>
                        
                        <View style={[styles.row]}>
                            <Text style={styles.fieldname}>Status:</Text>
                            <Picker
                                selectedValue={caseItem.caseItemStatus}
                                onValue={(itemValue, itemIndex) => this.setState({caseItemStatusCurrent: itemValue })}
                                enabled={this.state.editMode} 
                                ref={(ref) => this.statusInput = ref} >
                                <Picker.Item label="" value="" />
                                <Picker.Item label="close" value="close" />
                                <Picker.Item label="open" value="open" />
                                <Picker.Item label="Awaiting Info" value="Awaiting Info" />
                            </Picker>
                        </View>

                        <View style={[styles.row]}>
                            <Text style={styles.fieldname}>Details:</Text>
                            <TextInput
                                placeholder="Details"
                                underlineColorAndroid='#ffffff'
                                style={styles.textInput}
                                editable={this.state.editMode}
                                defaultValue={caseItem.caseItemDetail}
                                onChangeText={(text) => this.setState({caseItemDetailsCurrent: text })}                                
                                selectTextOnFocus={true}
                                multiline={true}
                                ref={(ref) => this.detailInput = ref}                                
                            />
                        </View>   
                    </View>
                </KeyboardAvoidingView>    
                </ScrollView>
                <StatusBar barStyle="light-content" />
                </View>
                
        );
    }
}

export default CaseItemDetails;
