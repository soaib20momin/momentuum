import React, { Component } from "react";
import { StackNavigator, SafeAreaView } from "react-navigation";
import { List, ListItem, SearchBar, Button } from "react-native-elements"; // 0.19.0
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Picker,
  AsyncStorage
} from "react-native";
import SearchInput from "react-native-search-filter";
import Icon from 'react-native-vector-icons/FontAwesome'; // 4.5.0
import axios from "axios"; // 0.17.1
import config from "./../../../assets/config/endpoint";
import RouteNames from "./../../../assets/config/RouteNames";
import colors from "./../../../assets/styles/color";
import styles from "./../styles/CaseListStyles";
import CaseDetails from "../../CaseDetails/components/CaseDetails";

export default class CaseList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      dataSource: [],
      renderedListData: [],
      uniqueStatuses: [],
      uniqueTypes: [],
      token: '',
      noData: false,
      typeStatus: false,
      valueS: 'All',
      valueT: 'All',
    }
  }
  static navigationOptions = {
    title: 'Your Tickets',	
    headerLeft: (<View style={{flexDirection: 'row', paddingLeft: 20}}><Icon name="home" size={25} color="#fff"/></View>),
    headerMode: 'screen',		
    tabBarVisible: true		
  };
  //load always renderedlistdata in flatlist while ontextchange it's going
  // to be filtered and returned to the initial state if there's no text on the search bar
  filterClients(e) {
    let text = e.toLowerCase();
    let fullList = this.state.dataSource;
    let filteredList = fullList.filter((item) => { // search from a full list, and not from a previous search results list
      if (item.cli.lastname.toLowerCase().match(text) || item.cli.firstName.toLowerCase().match(text))
        return item;
    });
    if (!text || text === '') {
      this.setState({
        renderedListData: fullList,
        noData: false,
      });
    } else if (!filteredList.length) {
      // set no data flag to true so as to render flatlist conditionally
      this.setState({
        noData: true
      });
    }
    else if (Array.isArray(filteredList)) {
      this.setState({
        noData: false,
        renderedListData: filteredList
      });
    }
  }

updateType(val) {
  this.setState({
  valueT: val 
}, function () {
  this.filterCases();
});
}
updateStatus(val){
  this.setState({
valueS: val 
}, function () {
this.filterCases();
});
}
filterCases() {
    // // this.state.valueS = 'All';
    // this.state.valueT = e;
    let textStatus = this.state.valueS.toLowerCase();
    let textType = this.state.valueT.toLowerCase();
    console.log("status: ", textStatus)
    console.log("type: ", textType)
    
    let fullList = this.state.dataSource;

    let filteredList=[];

    if (textType === 'all' && textStatus === 'all') {
      filteredList = fullList;
      this.setState({
        renderedListData: fullList,
        typeStatus: false,
      });
    }

    else if (textType !== 'all' && textStatus === 'all'){
      filteredList = fullList.filter((item) => { // search from a full list, and not from a previous search results list
          if (item.cas.casetype.toLowerCase().match(textType))
            return item;
        })
    }
    else if(textType === 'all' && textStatus !== 'all'){
      filteredList=fullList.filter((item) => { // search from a full list, and not from a previous search results list
        if (item.cas.casestatus.toLowerCase().match(textStatus))
          return item;
      })
    }
    else if (textType !== 'all' && textStatus !== 'all'){
      filteredList=fullList.filter((item) => { // search from a full list, and not from a previous search results list
        if (item.cas.casetype.toLowerCase().match(textType))
          return item;
      });
      filteredList=filteredList.filter((item) => { // search from a full list, and not from a previous search results list
        if (item.cas.casestatus.toLowerCase().match(textStatus))
          return item;
      });
    }
    if (!filteredList.length) {
      // set no data flag to true so as to render flatlist conditionally
      this.setState({
        typeStatus: true
      })
    }
if (Array.isArray(filteredList)) {
      this.setState({
        typeStatus: false,
        renderedListData: filteredList
      })
    }
  }
 
  //passing caseid of list item being clicked
  GetItem(caseid1) {
    this.props.navigation.navigate(RouteNames.caseDetails,
      { caseid1: caseid1 });
  }

  async componentWillMount() {
    console.disableYellowBox = true;
    this.state.token = await AsyncStorage.getItem("token");
    var url = config.api.url + config.api.endpoints.caselist;

    // make the call
    axios({
      method: "get",
      url: url+"?dt="+(new Date()).getTime(),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token,
      }
    })
      .then(async response => {
        console.log(response.data.cas)
        this.setState({
          dataSource: response.data,
          renderedListData: response.data,
        });
      })
      .catch(error => {
        if (error.response) {
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
  loadCaseTypes() {
    this.state.uniqueTypes = this.state.dataSource.map(type => type.cas.casetype);
    this.state.uniqueTypes = Array.from(new Set(this.state.uniqueTypes));
    this.state.uniqueTypes.push("All");
    return this.state.uniqueTypes.map( (t, i) => (
      <Picker.Item label={t} value={t} key={i} />
    ))
  }
  loadCaseStatuses() {
    this.state.uniqueStatuses = this.state.dataSource.map(st => st.cas.casestatus);
    this.state.uniqueStatuses = Array.from(new Set(this.state.uniqueStatuses));
    this.state.uniqueStatuses.push("All");
    return this.state.uniqueStatuses.map( (st, i) => (
      <Picker.Item label={st} value={st} key={i}/>
    ))
  }

  render() {

    return (

      <SafeAreaView style={styles.container}>
        <SearchBar
          lightTheme
          onChangeText={this.filterClients.bind(this)}
          placeholder='Type Here...' 
          style={{backgroundColor: colors.primaryColor.rgb}}
/>
        {this.state.noData ? (
        <View><Text style={styles.nodata}>No cases found</Text>
          <Button
            title="Search client"
            buttonStyle={styles.button}
            onPress={() => this.props.navigation.navigate(RouteNames.clientList)}
            loading={this.state.isLoading}
          /></View>
         ) : (
          <View style={styles.container}>
            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
              <Text style={{ paddingLeft: 23, fontSize: 16, fontWeight: 'bold' }}> Case Type: </Text>
              <Text style={{ paddingLeft: 93, fontSize: 16, fontWeight: 'bold' }}> Case Status: </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Picker
                selectedValue={this.state.valueT}
                onValueChange={
                  this.updateType.bind(this)
                }
                style={{ width: 156, height: 56, marginLeft: 20 }} itemStyle={{ height: 56, fontSize: 13 }}>
                {this.loadCaseTypes()}
              </Picker>
              <Picker
                selectedValue={this.state.valueS}
                onValueChange= {
                  this.updateStatus.bind(this)
                }
                style={{ width: 156, height: 56, marginLeft: 25 }} itemStyle={{ height: 56, fontSize: 13 }}>
                {this.loadCaseStatuses()}
              </Picker>
            </View>

            <List>

              <FlatList contentContainerStyle={{ paddingBottom: 200 }}
                data={this.state.renderedListData}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) =>

                  <ListItem
                    title={
                      <View>
                        <Text style={styles.title}>{item.cli.firstName + " " + item.cli.lastname}</Text>
                      </View>
                    }

                    subtitle={
                      <View>
                        <View style={{ width: 150, height: 1, backgroundColor: 'lightgrey' }} />
                        <Text style={styles.rightT}>

                          {"Type: " + item.cas.casetype + " | Updated: " + item.cas.caseOpenDate}</Text>
                      </View>
                    }

                    
                    badge={{value: item.cas.casestatus, containerStyle:
                        item.cas.casestatus === 'Open' ? { backgroundColor: 'orange', padding: 10} :
                          item.cas.casestatus === 'Pending' ? { backgroundColor: 'red', padding: 10} :
                            item.cas.casestatus === 'Scheduled' ? { backgroundColor: 'yellow', padding: 10} :
                              item.cas.casestatus === 'Closed' ? { backgroundColor: 'green', padding: 10} :
                              { backgroundColor: 'brown'}}
                    }
                    onPress={this.GetItem.bind(this, item.cas.caseid)}

                  />}

              />

            </List>
          </View>
         )}
      </SafeAreaView>
    );
  }
}