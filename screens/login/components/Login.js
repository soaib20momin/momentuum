import React from "react";
import {
  KeyboardAvoidingView,
  ImageBackground,
  Image,
  Text,
  AsyncStorage,
  Alert,
  StatusBar
} from "react-native";
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import axios from "axios";
import styles from "../styles/LoginStyles";
import config from "../../../assets/config/endpoint";
import constants from "../../../assets/config/constants";
import screens from "../../../assets/config/RouteNames";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      token: "",
      isLoading: false,
      isInvalid: false,
      errorMessage: ""
    };
  }

  static navigationOptions = {		
    header: null,		
    tabBarVisible: false		
  }

  async componentWillMount() {
    try {
      // check if the token is present in the storage
      var token = await AsyncStorage.getItem("token");
      if (token != null) {
        // token is set
        console.debug("Token is present : " + token);
        this.state.token = token;

        // check if the token is valid with the test endpoint
        var url =  config.api.url + config.api.endpoints.test.withAuth;
        axios({
          method: "get",
          url: url,
          headers: {
            Authorization: "Bearer " + token
          }
        })
          .then(response => {
            console.log("Token is valid. Token user : " + response.data);
            // Since token is valid we send the user to the next screen
            this.props.navigation.navigate(screens.appScreen);
          })
          .catch(error => {
            if (error.response && error.response.status === 401) {
              console.debug(
                "Token is not valid. User has to login again. Response: " +
                  error.response
              );
            } else {
              console.error(
                "Something went wrong. Response: " + JSON.stringify(error)
              );
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Display invalid user error alert box
   */
  authError = () => {
    var state = this.state;
    state.isInvalid = true;
    state.errorMessage = "Invalid username or password";
    this.setState(state);
  };

  /**
   * display something went wrong alert box
   */
  appError = () => {
    Alert.alert(
      "Application Error",
      "Something went wrong. Please contact Momentuum regarding this error"
    );
  };

  /**
   * This method is called when the user clicks the login button
   */
  loginUser = () => {
    var endpoint = config.api.url + config.api.endpoints.login;
    console.debug("Initiating POST request to endpoint: " + endpoint);
    var state = this.state;
    state.isLoading = true;
    this.setState(state);

    // make the call
    axios({
      method: "post",
      url: endpoint,
      data: {
        username: this.state.username,
        password: this.state.password
      },
      headers: { "Content-Type": "application/json" }
    })
      .then(async response => {
        console.debug(
          "Call was successful for login. Response status : " + response.status
        );
        console.debug(response.data);

        // save the token in the storage
        try {
          await AsyncStorage.setItem("token", response.data.token);
        } catch (error) {
          console.error("AsyncStorage error : " + error);
        }

        // navigate to the case list screen
          this.props.navigation.navigate(screens.appScreen);
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

    state.isLoading = false;
    this.setState(state);
  };

  
  render() {
    return (
      <ImageBackground
        style={styles.backgroundImage}
        source={require("./../img/login.jpg")}
      >
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          backgroundColor="transparent"
          style={styles.container}
          behavior="position"
        >
          <Image
            source={require("./../../../assets/img/CivicTrack-Logo.png")}
          />
          <FormLabel style={styles.formGroup} labelStyle={styles.labelStyles}>
            Username
          </FormLabel>
          <FormInput
            inputStyle={styles.inputStyle}
            autoCapitalize="none"
            autoCorrect={false}
            shake={this.state.isInvalid}
            onChangeText={username => {
              this.setState({ username });
            }}
            value={this.state.username}
          />

          <FormLabel style={styles.formGroup} labelStyle={styles.labelStyles}>
            Password
          </FormLabel>
          <FormInput
            secureTextEntry
            inputStyle={styles.inputStyle}
            shake={this.state.isInvalid}
            onChangeText={password => {
              this.setState({ password })
            }}
            value={this.state.password}
          />
          <FormValidationMessage>
            {this.state.errorMessage}
          </FormValidationMessage>
          <Button
            title="LOGIN"
            style={styles.formGroup}
            buttonStyle={styles.button}
            onPress={this.loginUser}
            loading={this.state.isLoading}
          />
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}
