import React from "react";
import { View, AsyncStorage } from "react-native";
import { SafeAreaView } from 'react-navigation';
import { Avatar, Button, List, ListItem, Text } from "react-native-elements";
import axios from "axios";
import config from "./../../../assets/config/endpoint";
import constants from "./../../../assets/config/constants";
import styles from "../styles/ProfileStyles";
import colors from "../../../assets/styles/color";
import screens from "../../../assets/config/RouteNames"

export default class Profile extends React.Component {
  
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this)
    this.state = {
      name: "",
      totalCases: 0,
      openCases: 0,
      pendingCases: 0,
      closedCases: 0
    };
  }
  
  async componentDidMount() {
    var token = await AsyncStorage.getItem("token")
    if (token != null) {
      var employeeUrl = config.api.url + config.api.endpoints.employee

      console.debug("Calling employee service with token: " + token + "\n From URl: " + employeeUrl);
      axios({
        method: "get",
        url: employeeUrl,
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then(response => {
        console.debug("Response for employee was successful. Response: " + JSON.stringify(response.data))
        var newState = this.state
        newState.name = response.data.employeeName
        this.setState(newState)
      })
      .catch(error => {
        if (error.response.status === 401) {
          console.debug(
            "Token is not valid. User has to login again. Response: " +
              error.response
          )
          this.props.navigation.navigate(screens.loginScreen)
        } else {
          console.error(
            "Something went wrong in the request Status : " +
              error.response.status +
              " Response : " +
              error
          );
        }
      })

      var caseStatsUrl = config.api.url + config.api.endpoints.casesDetail.stats
      console.debug("Getting Case Stats from endpoint" + caseStatsUrl)
      axios({
        method: "get",
        url: caseStatsUrl,
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then(response => {
        console.debug("Response to get case stats was successful. Response:" + JSON.stringify(response.data))
        var newState = this.state
        newState.openCases = response.data.openCount
        newState.closedCases = response.data.closedCount
        newState.totalCases = response.data.totalCount
        this.setState(newState)
      })
      .catch(error => {
        if (error.response.status === 401) {
          console.debug(
            "Token is not valid. User has to login again. Response: " +
              error.response
          )
          this.props.navigation.navigate(screens.loginScreen)
        } else {
          console.error(
            "Something went wrong in the request Status : " +
              error.response.status +
              " Response : " +
              error
          );
        }
      })
    }
  }

  /**
   * Logs out a user by forgetting the token and redirecting to the login screen
   */
  async logout() {
    console.debug("Logging out user")
    await AsyncStorage.removeItem("token")
    this.props.navigation.navigate(screens.loginScreen)
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.center}>
          <Avatar
            xlarge
            rounded
            icon={{ name: "ios-person", type: "ionicon" }}
            style={styles.center}
          />
          <Text h3 style={styles.name}>{this.state.name}</Text>
        </View>
        <List>
          <ListItem
            key={1}
            title={"Total Assigned Cases"}
            hideChevron={true}
            badge={{ value: this.state.totalCases }}
          />
          <ListItem
            key={2}
            title={"Total Open Cases"}
            hideChevron={true}
            badge={{ value: this.state.openCases, containerStyle:{ backgroundColor: 'orange'} }}
          />
          <ListItem
            key={4}
            title={"Total Closed Cases"}
            hideChevron={true}
            badge={{ value: this.state.closedCases , containerStyle:{ backgroundColor: colors.blue.rgb } }}
          />
        </List>
        <Button 
          title="LOGOUT"
          onPress={this.logout}
          style={styles.padding}
          buttonStyle={{
            backgroundColor: colors.danger.rgb,
            borderRadius: 5
          }}
        />
      </SafeAreaView>
    );
  }
}
