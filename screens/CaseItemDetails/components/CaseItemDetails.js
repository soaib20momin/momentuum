import React from 'react';
import { Alert, AsyncStorage, Text, ScrollView, View, TextInput, StatusBar, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, Button, FlatList, Image, Picker, Platform } from 'react-native';
import { Constants } from 'expo';
import endpoint from "../../../assets/config/endpoint";
import ImageFile from './ImageFile';
import styles from "../styles/CaseItemDetailsStyle"
import Icon from 'react-native-vector-icons/FontAwesome'; // 4.5.0
import GrowingTextInput from './GrowingTextInput';
import { StackNavigator } from 'react-navigation';
import axios from 'axios';
import RouteNames from '../../../assets/config/RouteNames';
import ModalSelector from 'react-native-modal-selector';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
//import Ripple from 'react-native-material-ripple';

var urlDropdowns = endpoint.api.url + endpoint.api.endpoints.casesDetail.caseDropdowns;

class CaseItemDetails extends React.Component {
    // static toggleEdit =() => {
    //     this.setState({ editMode: true });
    //     console.log(" state: ", this.state);
    // }
    
    constructor(props) {
        super(props);
        this.state = {
            file: {},
            caseItem: {},
            token: '',
            editMode: false,
            caseItemActionCurrent:'',
            caseItemDescriptionCurrent:'',
            caseItemDetailsCurrent:'',
            caseItemStatusCurrent:'',
            caseItemAssignedCurrent:'',  
            caseItemId:"",
            loaded:false,
            hasFile:false,
            dropdownSource:[] ,
            casetypes:[],
            casestatuses:[],
            caseCodes:[],
            caseAssingedList:[], 
            hasData:false,
            statuses:{} ,
            assignedToList:{}     
        };
    }
    getDropdowns() {
        console.log("dropdown called")
        axios({
            method: "get",
            url: urlDropdowns,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.state.token,
            }
          })
            .then(async response => {
              console.debug(
                "Call was successful for login. get dropdowns Response status : " + response.status
              );
            //   console.debug(response.data);
              this.setState({
                dropdownSource: response.data,
              });
              console.log("before mapping data");
              this.MapData();
            })
            .catch(error => {
              if (error.response) {
                // the response was other than 2xx status
                if (error.response.status == 401) {
                  console.debug("Invalid username and password entered");
                //   this.authError();
                } else {
                  console.error("Invalid request sent. Status : " + error.response.status);
                //   this.appError();
                }
              } else {
                console.error("Something went wrong in the request Status : " + error.response.status + " Response : " + error);
                // this.appError();
              }
            });
    }
    MapData = () => {
        console.log("mapping data here");
        var fetchType = this.state.dropdownSource.casetype;
        var fetchStatus = this.state.dropdownSource.casestatus;
        var fetchCode = this.state.dropdownSource.casecode;
        var fetchAssigned = this.state.dropdownSource.caseassignedto;
    
        this.state.casetypes = fetchType;
        this.state.casestatuses = fetchStatus;
        this.state.caseCodes = fetchCode;
        this.state.caseAssingedList = fetchAssigned;
        
        this.setState({ casetype: "Select Case Type" });
        this.setState({ caseassignedto: "Select Case Assign To" });
        this.setState({ casestatus: "Select Case Status" });
        this.setState({ casecode: "Select Case Code" });
        var statusesSource= this.state.casestatuses;
        var statusObj=[];
        // for (let s of statusesSource){
        //     statusObj[s["id"]]=s["listtext"];
        // }
        // statusesSource.forEach(obj => {
        //     statusObj[obj.code] = obj.listtext;
        // });

        statusesSource.forEach(obj=>{
            var newObj={key: obj.code, label: obj.listtext}
            statusObj.push(newObj);
        })
        this.setState({statuses:statusObj}) 
        
        var assignedToSource= this.state.caseAssingedList;
        var assignedToObj=[];
        
        assignedToSource.forEach(obj => {
            var newObj={key: obj.employeeId, label: obj.employeeName}
            assignedToObj.push(newObj);
        });
        this.setState({assignedToList:assignedToObj})         

        this.setState({hasData: true})
        this.baseState = this.state        
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
                        caseItem: response.data[0].item,
                        file:response.data[0].file
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
    save(props) {   
        var url = endpoint.api.url + endpoint.api.endpoints.caseItems.caseItem + this.state.caseItemId;           
        this.setState({ spinnerVisible: true });
        let data= {
            "caseItemDescription": this.state.caseItemDescriptionCurrent,
            "caseItemStatus": this.state.caseItemStatusCurrent,
            "caseItemDetail": this.state.caseItemDetailsCurrent,
            "caseItemAction": this.state.caseItemActionCurrent,
            "caseItemAssigned": this.state.caseItemAssignedCurrent,
            "caseItemDate": this.state.caseItem.caseItemDate,
            "caseItemFollowUpdate": null,
            "caseid": this.state.caseItem.caseid,
            "deleted": this.state.caseItem.deleted,
            "intId": this.state.caseItem.intId,
            "timeProcess": this.state.caseItem.timeProcess,
            "userId": this.state.caseItem.userId,
        };
        console.log("Data: ", data);
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
            this.setState({ spinnerVisible: false });
            setTimeout(() => {
                Alert.alert("Update Successful");
              }, 100);  
            // this.setState(this.baseState);
            // this.componentDidMount();
            const { goBack } = this.props.navigation;        
            goBack();
        })
        .catch(error => {
            setTimeout(() => {
                Alert.alert("Update unsuccessful");
              }, 100);  
            this.setState({ spinnerVisible: false });
            console.debug(error);
        });
    }
   
    async componentWillMount() {
        const { params } = this.props.navigation.state;
        this.state.caseItemId = params ? params.CaseItemId : "null";
        console.log("Test + " + this.state.caseItemId);
        this.state.token = await AsyncStorage.getItem("token");
        this.getDropdowns();

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
                console.debug(
                    'Call was successful for get case item. Response status : ' + response.status
                );
                console.debug(response.data);
                this.setState({
                    caseItem: response.data[0].item,
                    file:response.data[0].file,
                    caseItemStatusCurrent:response.data[0].item.caseItemStatus,
                    caseItemActionCurrent:response.data[0].item.caseItemAction,
                    caseItemDescriptionCurrent:response.data[0].item.caseItemDescription,
                    caseItemDetailsCurrent:response.data[0].item.caseItemDetail,
                    caseItemAssignedCurrent:response.data[0].item.caseItemAssigned, 
                    loaded:true
                });
                if (this.state.file.fileName!==null){
                    this.setState({
                   hasFile:true
                    }
                    )
                }
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
    toggleEdit() {
        this.setState({ editMode: !this.state.editMode });
        // this.toggleReturn();
    }

    reset(){
        this.setState(this.baseState);
        this.forceUpdate();
    }
    render(){
        if (!this.state.hasData){
            return(
                <View style={styles.container}>
                    <View style={{ flex: 1, minHeight: 100, padding: 80 }}>
                    <Spinner visible={!this.state.hasData} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                    </View>
                </View>
            );
        }
        const caseItem = this.state.caseItem;
        return(
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{ paddingVertical: 10 }}
                    style={{ flex: 1, backgroundColor: '#f2f2f4' }}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                >
                <View style={styles.header}>
                    <Text style={[styles.category]}>Case Item Details</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[{ display: 'none' }, this.state.editMode && { display: 'flex', paddingHorizontal: 10 }]}>Editing</Text>
                        <TouchableOpacity>
                            <Icon name="edit" size={25} color="#444" onPress={() => this.toggleEdit()} style={[styles.editButton, this.state.editMode && styles.editButtonActive]} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="save" size={25} color="#444" style={[{ display: 'flex' }, !this.state.editMode && { display: 'none' }]} onPress={() => { this.save(); }} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="refresh" size={25} color="#444" style={[{ display: 'flex' } && styles.editButton]} onPress={() => { this.reset(); }} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="trash" size={25} color="#444" style={styles.deleteButton} onPress={() => this.deleteAlert()}  />
                        </TouchableOpacity>
                    </View>   
                </View>
            <View style={styles.details}>
                <View style={[styles.row, styles.firstRow]}>
                    {/* <Text style={styles.fieldname}>Date</Text> */}
                    <Text style={[styles.fieldname, styles.firstElement]}>Date</Text>
                    <TextInput
                        placeholder="Open Date"
                        underlineColorAndroid='#ffffff'
                        style={[styles.textInput, styles.secondElement]}
                        editable={false}
                        value={caseItem.caseItemDate}
                    />
                </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.fieldname, styles.firstElement]}>Action</Text>
                        <TextInput
                            placeholder="Action"
                            underlineColorAndroid='#ffffff'
                            style={[styles.textInput, styles.secondElement]}
                            editable={this.state.editMode}
                            onChangeText={(text) => this.setState({caseItemActionCurrent: text })}
                            value={this.state.caseItemActionCurrent}
                            selectTextOnFocus={true}
                            ref={(ref) => this.actionInput = ref}
                        />
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.fieldname, styles.firstElement]}>Created By:</Text>
                        <TextInput
                            placeholder="Created By"
                            underlineColorAndroid='#ffffff'
                            style={[styles.textInput, styles.secondElement]}
                            editable={false}
                            value={caseItem.createdBy}
                            selectTextOnFocus={true}
                        />
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.fieldname, styles.firstElement]}>Updated In:</Text>
                        <TextInput
                            placeholder="Last Update Date"
                            underlineColorAndroid='#ffffff'
                            style={[styles.textInput, styles.secondElement]}
                            editable={false}
                            value={caseItem.updatedDate}
                        />
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.fieldname, styles.firstElement]}>Status:</Text>
                        {
                            Platform.OS === "ios" ?
                            <ModalSelector
                                data={this.state.statuses}
                                style={[styles.picker, styles.secondElement]}
                                initValue={this.state.caseItemStatusCurrent}
                                overlayStyle={{backgroundColor:'#333'}}
                                disabled={!this.state.editMode}
                                ref={(ref) => this.statusInputIos = ref}
                                backdropPressToClose={true}
                                // onChange={(option)=>{ alert(`${option.label} (${option.key}) nom nom nom`) }} 
                                onChange={(option)=>{ this.setState({caseItemStatusCurrent:option.label}) }}                                     
                                />
                            :
                            <Picker
                            enabled={this.state.editMode}
                            style={[styles.picker, styles.secondElement]}
                            itemStyle={styles.picker}
                            selectedValue={this.state.caseItemStatusCurrent}
                            ref={(ref) => this.statusInput = ref}
                            onValueChange={(status) => this.setState({ caseItemStatusCurrent: status })}>
                            {this.state.casestatuses.map((l, i) => { return <Picker.Item value={l.listtext} label={l.listtext} key={i} /> })}
                        </Picker>
                        }
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.fieldname, styles.firstElement]}>Assigned To:</Text>
                        {
                            Platform.OS === "ios" ?
                            <ModalSelector
                                data={this.state.assignedToList}
                                style={[styles.picker, styles.secondElement]}
                                initValue={this.state.caseItemAssignedCurrent}
                                overlayStyle={{backgroundColor:'#333'}}
                                disabled={!this.state.editMode}
                                ref={(ref) => this.assignedInputIos = ref}
                                backdropPressToClose={true}
                                // onChange={(option)=>{ alert(`${option.label} (${option.key}) nom nom nom`) }} 
                                onChange={(option)=>{ this.setState({caseItemAssignedCurrent:option.label}) }}      
                                />
                            :
                            <Picker
                            enabled={this.state.editMode}
                            style={[styles.picker, styles.secondElement]}
                            itemStyle={styles.picker}
                            selectedValue={this.state.caseItemAssignedCurrent}
                            ref={(ref) => this.assignedInput = ref}
                            onValueChange={(status) => this.setState({ caseItemAssignedCurrent: status })}>
                            {this.state.caseAssingedList.map((l, i) => { return <Picker.Item value={l.employeeName} label={l.employeeName} key={i} /> })}
                        </Picker>
                        }
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.fieldname, styles.firstElement]}>Description:</Text>
                        <TextInput
                            placeholder="Description"
                            underlineColorAndroid='#ffffff'
                            style={[styles.textInput, styles.secondElement]}
                            editable={this.state.editMode}
                            value={this.state.caseItemDescriptionCurrent}
                            selectTextOnFocus={true}
                            ref={(ref) => this.descriptionInput = ref}  
                            onChangeText={(text) => {this.setState({caseItemDescriptionCurrent: text })}}      
                        />
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.fieldname, styles.firstElement]}>Details:</Text>
                        <GrowingTextInput
                            multiline
                            placeholder="Details"
                            underlineColorAndroid='#ffffff'
                            style={[styles.biggerTextInput, styles.secondElement]}
                            editable={this.state.editMode}
                            value={this.state.caseItemDetailsCurrent}
                            selectTextOnFocus={true}
                            ref={(ref) => this.detailInput = ref} 
                            onChangeText={(text) => {this.setState({caseItemDetailsCurrent: text })}}                            
                        />
                    </View> 
                </View>
            {/* File Image Item */}
            {this.state.loaded && this.state.hasFile &&
                      <View>
                      <View style={styles.header}>
                        <Text style={styles.category}>File Item</Text>
                        <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('CreateCaseItem', {CaseId:this.state.caseId})}>
                        <Icon name="plus-square" size={25} style={{ paddingTop: 10, paddingLeft: 20 }} color="#444" />
                        </TouchableOpacity>
                    </View>
                                      
                            <ImageFile nav={this.props.navigation} File={this.state.file} />
                             
                   </View>
            }            
            </KeyboardAwareScrollView>
        </View>
        );
    };
}
export default CaseItemDetails;