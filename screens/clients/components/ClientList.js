import React, { Component } from "react";
import { StackNavigator, SafeAreaView } from "react-navigation";
import { List, ListItem, SearchBar, Button } from "react-native-elements"; // 0.19.0
import Icon from 'react-native-vector-icons/FontAwesome'; // 4.5.0
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Picker,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";
import { Constants } from 'expo';
import constants from "../../../assets/config/constants";
import axios from "axios"; // 0.17.1
import config from "./../../../assets/config/endpoint";
import styles from "./../styles/ClientListStyles";
import color from '../../../assets/styles/color';
import { Ionicons } from "@expo/vector-icons"; // 6.2.2
import RouteNames from "../../../assets/config/RouteNames";

export default class ClientList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      dataSource: [],
      token: "",
      noData: false,
      firstState: true,
      e: '',
      el: ''
    };
  }
  static navigationOptions = {
    title: 'Add Case',	
    headerMode: 'screen',		
    tabBarVisible: true		
};
   filterClients  = () => {
    console.disableYellowBox = true;
    this._filterClients();
  }
  
  // data is filtered and returned to the initial state if there's no text on the search bar
  async _filterClients(){
    this.state.isLoading = true;
    console.disableYellowBox = true;
        this.state.token = await AsyncStorage.getItem("token");
        var url = config.api.url + config.api.endpoints.clientlist + this.state.e;
        console.debug("Initiating GET request to endpoint: " + url);
        

        // make the call
        axios({
          method: "get",
          url: url,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.state.token
          }
        })
          .then(async response => {
            console.debug(
              "Call was successful for client list. Response status : " +
              response.status
            );
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
                console.error(
                  "Invalid request sent. Status : " + error.response.status
                );
                this.appError();
              }
            } else {
              console.error(
                "Something went wrong in the request Status : " +
                error.response.status +
                " Response : " +
                error
              );
              this.appError();
            }
          });
  }
  //passing clientid of list item being clicked
  GetItem(id) {
    this.props.navigation.navigate(RouteNames.addCase, { clientId: id });
  }

  render() {
    console.disableYellowBox = true;
    return (
      <SafeAreaView style={styles.container}>
      <View style={styles.searchSection}>  
          <TextInput
              ref= {(el) => { this.state.el = el; }}
              onChangeText={(e) => this.setState({e})}
              value={this.state.e}
              onSubmitEditing={this.filterClients}
              style = {styles.searchInput}
              placeholder="Search Constituent"
              underlineColorAndroid="transparent"
          />
          
          <TouchableHighlight>
          <Ionicons style={styles.searchIcon} name="ios-search" size={20} color="#000" onPress={this.filterClients}/>
          </TouchableHighlight>
      </View>
        {this.state.dataSource || this.state.dataSource.length > 0 ? (
          
            <View style={styles.container}>
              <List>
                <FlatList
                  data={this.state.dataSource}
                  keyExtractor={(item, index) => index}
                  renderItem={({ item }) => (
                    <ListItem
                      title={
                        <View>
                          <Text style={styles.title}>
                            {item.firstName + " " + item.lastname}
                          </Text>
                        </View>
                      }
                      subtitle={
                        <View>
                          <View
                            style={{
                              width: 150,
                              height: 1,
                              backgroundColor: "lightgrey"
                            }}
                          />
                          <Text style={styles.rightT}>
                            {item.type === null ? "" :
                              item.type === "" ? "" :
                                "Type: " + item.type}</Text>

                          <Text style={styles.rightT}>
                            {item.city === null ? "" :
                              item.city === "" ? "" :
                                "City: " + item.city}</Text>

                          <Text style={styles.rightT}>
                            {item.workArea === null ? "" :
                              item.workArea === "" ? "" :
                                "Work Phone: " + item.workArea + "-" + item.workPhone}</Text>
                        </View>
                      }
                      rightIcon={
                        <TouchableOpacity
                          onPress={this.GetItem.bind(this, item.id)}
                        >
                          <Ionicons
                            name={"ios-add-circle"}
                            size={40}
                            color={"#3385ff"}
                          />
                        </TouchableOpacity>
                      }
                      rightTitle={
                        <Text style={styles.subtitleBlue}>Add Case</Text>
                      }
                    />
                  )}
                />
              </List>
            </View>
          ) : (
          <View>
            <Text style={styles.nodata}>Type client name to search</Text>
          </View>
          )}
      </SafeAreaView>
    );
  }
}
