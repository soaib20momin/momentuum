import React from 'react';
import endpoint from "../../../assets/config/endpoint";
import { Alert, TouchableOpacity, Button, ActivityIndicator, AsyncStorage, StyleSheet, Text, View, TextInput, ScrollView, Picker, KeyboardAvoidingView } from 'react-native';
import axios from "axios";
import colors from '../../../assets/styles/color'
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from "../styles/CaseDetailsStyles";
import GrowingTextInput from './GrowingTextInput';
import DatePicker from 'react-native-datepicker';
import color from '../../../assets/styles/color';
import screens from "../../../assets/config/RouteNames";
import RNPickerSelect from 'react-native-picker-select';
import Moment from 'moment';

class CaseUpdateForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      caseLoaded: false,
      dataSource: [],
      updateDataJson: [],
      object: '',
      token: '',
      editable: false,
      clientId: '',
      tempcaseid: '',
      caseAssignedTo: '',
      caseNature: '',
      caseSource: '',
      deleted: '',
      timeprocess: '',
      userid: '',
      subtype: '',
      createdby: '',
      casesin: '',
      caseId: '',
      openDate: '',
      closeDate: '',
      caseCode: '',
      caseCodes: [],
      caseDesc: '',
      casetype: '',
      casetypes: [],
      casestatus: '',
      casestatuses: [],
      caseassignedto: '',
      caseassignedtos: [],
      signed: ''
    };
  }

  MapData = () => {

    var fetchType = this.state.dataSource.casetype;
    var fetchSign = this.state.dataSource.signed;
    var fetchStatus = this.state.dataSource.casestatus;
    var fetchCode = this.state.dataSource.casecode;
    var fetchAssigned = this.state.dataSource.caseassignedto;

    this.state.casetypes = fetchType;
    this.state.signed = fetchSign;
    this.state.casestatuses = fetchStatus;
    this.state.caseCodes = fetchCode;
    this.state.caseassignedtos = fetchAssigned;

    var fetchCase = this.state.dataSource.casedetails;
    console.log("fetchDate");
      this.setState({ caseId: fetchCase.cas.caseid });
      this.setState({ openDate: fetchCase.cas.caseOpenDate });
      this.openDateFormat();
      this.setState({ closeDate: fetchCase.cas.caseClosedDate });
      if(this.state.closeDate != "" || this.state.closeDate != null)
      this.closeDateFormat();
      this.setState({ caseCode: fetchCase.cas.caseCode });
      this.setState({ casetype: fetchCase.cas.casetype });
      this.setState({ caseassignedto: fetchCase.cas.caseAssignedTo });
      this.setState({ casestatus: fetchCase.cas.casestatus });
      this.setState({ caseDesc: fetchCase.cas.casedescription });

      //other fields
      this.setState({ clientId: fetchCase.cas.idVoter });
      this.setState({ tempcaseid: fetchCase.cas.tempCaseId });
      this.setState({ caseSource: fetchCase.cas.caseSource });
      this.setState({ createdby: fetchCase.cas.createdby });
      this.setState({ casesin: fetchCase.cas.casesin });
      this.setState({ timeprocess: fetchCase.cas.timeprocess });
      this.setState({ userid: fetchCase.cas.userid });
      this.setState({ subtype: fetchCase.cas.subtype });
      this.setState({ deleted: fetchCase.cas.deleted });
      this.setState({ caseAssignedTo: fetchCase.cas.caseAssignedTo });
      this.setState({ caseNature: fetchCase.cas.caseNature });
    
  }

  openDateFormat = () =>
  {
    //console.log(this.state.openDate);
    var myDate = Moment(this.state.openDate).format('YYYY-MM-DD');
    //console.log(myDate);
    this.setState({ openDate: myDate});
    console.disableYellowBox = true;
  }

  closeDateFormat = () =>
  {
    //console.log(this.state.closeDate);
    var myDate = Moment(this.state.closeDate).format('YYYY-MM-DD');
    this.setState({ closeDate: myDate});
    console.disableYellowBox = true;
  }

  toggleEdit = () => {
    console.log(this.state.editable);
    this.setState({ editable: !this.state.editable });
  }

  updateData = () => {
    console.log(this.state.openDate.toString());
    if (this.state.closeDate)
      console.log(this.state.closeDate.toString());

    var obj = {};
    obj["caseOpenDate"] = this.state.openDate;
    obj["caseClosedDate"] = this.state.closeDate;
    obj["caseid"] = this.state.caseId;
    obj["caseCode"] = this.state.caseCode;
    obj["casetype"] = this.state.casetype;
    obj["casestatus"] = this.state.casestatus;
    obj["casedescription"] = this.state.caseDesc;
    obj["idVoter"] = this.state.clientId ;
    obj["tempCaseId"] = this.state.tempcaseid ;
    obj["caseSource"] = this.state.caseSource ;
    obj["createby"] = this.state.createdby ;
    obj["casesin"] = this.state.casesin ;
    obj["timeprocess"] = this.state.timeprocess ;
    obj["userid"] = this.state.userid ;
    obj["subtype"] = this.state.subtype ;
    obj["deleted"] = this.state.deleted ;
    obj["caseNature"] = this.state.caseNature ;
    obj["caseAssignedTo"] = this.state.caseAssignedTo ;

    this.state.updateDataJson.push(obj);
    var myJson = JSON.stringify(obj);
    //console.log(myJson);
    
    var url = endpoint.api.url + endpoint.api.endpoints.casesDetail.caseDetail + this.state.caseId;
    console.debug("Initiating GET request to endpoint: " + url);

    // make the call
    axios({
      method: "PUT",
      url: url,
      data: myJson,
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
        if(response.status == 204)
        Alert.alert('Updated Successfully!');
        this.toggleEdit();
        //console.debug(response.data);
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
      })
  }

  deleteAlert() {
    Alert.alert(
      'Delete Case ',
      'Do you want to delete this case ?',
      [
        { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
        {
          text: 'Yes', onPress: () => {
            console.log('Yes Pressed');
            this.deleteCase();
            this.props.nav.navigate(screens.caseList);
           //this.props.navigation.navigate(screens.caseList);
          }

        }
        ,
      ],
      { cancelable: false }
    )

  }

  async componentWillMount() {
    // Get case items from parent 
    console.log("Inside component did mount Case Items");
    // Get State for caseId       
    this.state.caseId = this.props.CaseId;
    this.state.token = await AsyncStorage.getItem("token");
    console.log("Case ID inside of Case Items is " + this.state.caseId);

    //this.state.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI5MDkwIiwiZXhwIjoxNTIzODMwMDU4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAvIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwLyJ9.es7Isy_n4g8y2loU9Defn2v7PyTe5aHHR3U9Z_qRtgw"
    var url = endpoint.api.url + endpoint.api.endpoints.casesDetail.caseDetailById + this.state.caseId;
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
        //console.debug(response.data);
        this.setState({
          dataSource: response.data,
          caseLoaded: true
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
    console.log(this.state.caseId + "from form");
    //Save button toggle
    const isEditable = this.state.editable; 
    const SaveButton = isEditable ? (
      <TouchableOpacity
        onPress={this.updateData}>
        <Icon name="check-circle" size={25} style={{ paddingTop: 10 }} color={color.green.hex} />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity>
      </TouchableOpacity>
    );

    //Page loading logo
    if (!this.state.caseLoaded) {
      return (
        <View style={{ flex: 1, minHeight: 100, padding: 80 }}>
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
          <KeyboardAvoidingView
            backgroundColor="transparent"
            style={{ flex: 1 }}
            keyboardVerticalOffset={20}
            behavior={"position"}>
            <View style={styles.header}>
              <Text style={styles.category}>Case Details</Text>
              <View style={{ flexDirection: 'row' }}>
                {SaveButton}
                <Text style={[{ display: 'none' }, this.state.editable && { display: 'flex', paddingHorizontal: 10, paddingTop: 10 }]}>Editing</Text>
                <TouchableOpacity>
                <Icon name="edit" size={25} color="#444" onPress={() => this.toggleEdit()} style={[styles.editButton, this.state.editable && styles.editButtonActive]} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.deleteAlert()}>
                  <Icon name="trash" size={25} color="#444" style={{ paddingTop: 10, paddingLeft: 20 }} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.details}>
              <View style={[styles.row, styles.firstRow]}>
                <Text style={[styles.fieldname, styles.firstElement]}>Open Date</Text>
                <DatePicker
                  style={styles.secondElement}
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
                      borderWidth: 0,
                      marginLeft:0,
                      paddingLeft:0,
                    }
                  }}
                  onDateChange={(date) => { this.setState({ openDate: date }) }}
                />
              </View>
              <View style={styles.row}>
                <Text style={[styles.fieldname, styles.firstElement]}>Closed Date</Text>
                <DatePicker
                  style={styles.secondElement}
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
                <Text style={[styles.fieldname, styles.firstElement]}>Case Code</Text>
                {this.state.editable ?
                <Picker
                  enabled={this.state.editable}
                  style={[styles.picker, styles.secondElement]}
                  itemStyle={styles.picker}
                  selectedValue={this.state.caseCode}
                  onValueChange={(cod) => this.setState({ caseCode: cod })}>
                  {this.state.caseCodes.map((l, i) => { return <Picker.Item value={l.listtext} label={l.listtext} key={i} /> })}
                </Picker> : <Text style={[styles.textInput, styles.secondElement]}>{this.state.caseCode}</Text> }
              </View>
              <View style={styles.row}>
                <Text style={[styles.fieldname, styles.firstElement]}>Case Type</Text>
                {this.state.editable ? 
                <Picker
                  enabled={this.state.editable}
                  style={[styles.picker, styles.secondElement]}
                  itemStyle={styles.picker}
                  selectedValue={this.state.casetype}
                  onValueChange={(typ) => this.setState({ casetype: typ })}>
                  {this.state.casetypes.map((l, i) => { return <Picker.Item value={l.listtext} label={l.listtext} key={i} /> })}
                </Picker> : <Text style={[styles.textInput, styles.secondElement]}>{this.state.casetype}</Text> }
                
              </View>
              <View style={styles.row}>
                <Text style={[styles.fieldname, styles.firstElement]}>Case Status</Text>
                {this.state.editable ?
                <Picker
                  enabled={this.state.editable}
                  style={[styles.picker, styles.secondElement]}
                  itemStyle={styles.picker}
                  selectedValue={this.state.casestatus}
                  onValueChange={(sta) => this.setState({ casestatus: sta })}>
                  {this.state.casestatuses.map((l, i) => { return <Picker.Item value={l.listtext} label={l.listtext} key={i} /> })}
                </Picker> : <Text style={[styles.textInput, styles.secondElement]}>{this.state.casestatus}</Text> }
              </View>
              <View style={styles.row}>
                <Text style={[styles.fieldname, styles.firstElement]}>Case Assigned To</Text>
                {this.state.editable ?
                <Picker
                  enabled={this.state.editable}
                  style={[styles.picker, styles.secondElement]}
                  itemStyle={styles.picker}
                  selectedValue={this.state.caseassignedto}
                  onValueChange={(sta) => this.setState({ caseassignedto: sta })}>
                  {this.state.caseassignedtos.map((l, i) => { return <Picker.Item value={l.employeeLogin} label={l.employeeLogin} key={i} /> })}
                </Picker> : <Text style={[styles.textInput, styles.secondElement]}>{this.state.caseassignedto}</Text> }
              </View>
              <View style={styles.row}>
                <Text style={[styles.fieldname, styles.firstElement]}>Description</Text>
                <GrowingTextInput
                  minHeight={80}
                  placeholder="Description"
                  underlineColorAndroid='#ffffff'
                  style={[styles.textInput, styles.secondElement]}
                  editable={this.state.editable}
                  onChangeText={(typedText) => { this.setState({ caseDesc: typedText }) }}
                  value={this.state.caseDesc}
                />
              </View>
              {this.state.signed === '' ? 
              <View style={styles.lastrow}>
                  <Button
                  title="ADD SIGNATURE"
                  style={styles.button}
                  onPress={() => this.props.nav.navigate(screens.disclaimer,
                    { caseid1: this.state.caseId })}
                  />
            </View>
            :
            <View style={styles.row}>
                  <Text style={styles.fieldname}>Signature Added</Text>
                  <Icon name="check" size={25} style={{ paddingTop: 10, paddingBottom: 10 }} color="#2d862d"/>
            </View>
                  }
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    )
  }

  //Api Calls
  // Delete Case 
  deleteCase() {
    var url = endpoint.api.url + endpoint.api.endpoints.casesDetail.caseDetail + this.state.caseId;

    {/* Soft delete call */ }
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
        if (response.data.deleted != "false") {
          console.log("Case was soft deleted");
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
            console.debug("Invalid username and password ");
            // this.authError();
          } else {
            console.error("Invalid request sent. Status : " + error.response.status);
            // this.appError();
          }
        } else {
          console.error("Something went wrong in the request Status : " + error + " Response : " + error);
          // this.appError();
        }
      });
  }

}

export default CaseUpdateForm;