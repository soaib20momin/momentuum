import React from 'react';
import { AsyncStorage, Text, ScrollView, View, TextInput, StatusBar, Picker, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Constants } from 'expo';
import endpoint from "../../../assets/config/endpoint";
// import CaseUpdateForm from "./CaseUpdateForm";
import styles from "../styles/CreateCaseItemStyles";
import Icon from 'react-native-vector-icons/FontAwesome'; // 4.5.0
import GrowingTextInput from './GrowingTextInput';
import { StackNavigator } from 'react-navigation';
import axios from "axios";
// import Ripple from 'react-native-material-ripple';
import Spinner from 'react-native-loading-spinner-overlay';
import t from 'tcomb-form-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import screens from "../../../assets/config/RouteNames";

var url = endpoint.api.url + endpoint.api.endpoints.caseItems.caseItem;
var urlDropdowns = endpoint.api.url + endpoint.api.endpoints.casesDetail.caseDropdowns;

var Form = t.form.Form;

const detailsStyle = {
    ...Form.stylesheet,
    textbox: {
        normal: {
            height: 150,
            color: '#000',
            fontSize: 17,
            paddingVertical: Platform.OS === "ios" ? 7 : 0,
            paddingHorizontal: 7,
            borderRadius: 4,
            borderColor: '#cccccc',
            borderWidth: 1,
            marginBottom: 5 
        },
      },
  };

  var options = {
      fields: {
          details: {
              label: 'Details:',
              error: 'This is a required field'
          },
          action: {
            label: 'Action:',
        },
        status: {
            label: 'Status:',
        },
        description: {
            label: 'Description:',
            multiline: true,
            stylesheet: detailsStyle,
        },
        assigned: {
            label: 'Assign To:'
        }
      }
  };


class CreateCaseItem extends React.Component {

    static navigationOptions = {
        title: 'Create Case Item',	
        headerMode: 'screen',		
        tabBarVisible: false		
    };

    constructor(props) {
        super(props);
        this.state = {
            CaseItem: {},
            CaseId: '',
            token: '',
            editMode: false,
            spinnerVisible: false, 
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
    
    cancel(props) {
        console.log("cancel pressed");
        // this.props.navigation.navigate(screens.caseDetails, { caseid1: this.state.CaseId });
       console.log("nav",props)
        const { goBack } = props;        
            goBack();
    }
    async componentWillMount() {
        const { params } = this.props.navigation.state;
        console.log(this.props.navigation);
        this.state.CaseId = params ? params.CaseId : "null";
        // this.state.CaseId = 1026071;  
        console.log("Create Case Test + " + this.state.CaseId);
        this.state.token = await AsyncStorage.getItem("token");
        this.setState({ options });
        this.getDropdowns();
    };

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
        var statusObj={};
        // for (let s of statusesSource){
        //     statusObj[s["id"]]=s["listtext"];
        // }
        statusesSource.forEach(obj => {
            statusObj[obj.listtext] = obj.listtext;
        });
        this.setState({statuses:t.enums(statusObj) }) 

        var assignedToSource= this.state.caseAssingedList;
        var assignedToObj={};
        
        assignedToSource.forEach(obj => {
            assignedToObj[obj.employeeName] = obj.employeeName;
        });
        
        this.setState({assignedToList:t.enums(assignedToObj) })
        var caseItemForm = t.struct({
            details:t.String,
            action:t.maybe(t.String),
            status:t.maybe(this.state.statuses),
            assigned:t.maybe(this.state.assignedToList),
            description:t.maybe(t.String),
        });
        this.setState({ CaseItem:caseItemForm });
        this.setState({hasData: true})
      }
    async save(value) {      
        this.setState({ spinnerVisible: true });
        let data= {
            "caseItemDescription": value.description,
            "caseItemStatus": value.status,
            "caseItemDetail": value.details,
            "caseItemAction": value.action,
            "caseItemAssigned": value.assigned,
            
            "caseid": this.state.CaseId,
            
        };
        // console.log("Data: ", data);
        axios({
            method: "post",
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
                    Alert.alert("Save Successful");
                  }, 100);                
                
                //Insert Navigation Code
                const { goBack } = this.props.navigation;        
                goBack();
            })
            .catch(error => {
                this.setState({ spinnerVisible: false });                
                setTimeout(() => {
                    Alert.alert("Save Unsuccessful");
                  }, 100);
                console.debug(error);
            });
    }
    
    handleSubmit = () => {
        const value = this._form.getValue(); // use that ref to get the form value
        if (value) {
            this.save(value);
        // console.log('value: ', value); 
        }
      }

    render() {
        if (!this.state.hasData){
            return(
                <View style={styles.container}>
                    <View style={{ flex: 1, minHeight: 100, padding: 80 }}>
                    <Spinner visible={!this.state.hasData} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }} style={[{ display: 'none' }, this.state.spinnerVisible && {display: 'flex'}]}>
                    <Spinner visible={this.state.spinnerVisible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                </View>
               <KeyboardAwareScrollView
                    keyboardDismissMode="on-drag"
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={{ paddingVertical: 0 }}
                    style={{ flex: 1, padding: 10 }}
               >
                <Form type={this.state.CaseItem} ref={c => this._form = c} options={this.state.options} />
                {/* {
                    console.log("in render",this.props.navigation)
                } */}
                </KeyboardAwareScrollView>
                <View style={{flexDirection:'column', flex:0.15, alignContent:'space-between'}}>
                    <TouchableOpacity style={styles.button} onPress={this.handleSubmit} underlayColor='#99d9f4'>
                            <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonNeutral} onPress={()=>{this.cancel(this.props.navigation)}} underlayColor='#99d9f4'>
                            <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                <StatusBar barStyle="light-content" /> 
                </View>
        );
    }
}

export default CreateCaseItem;
