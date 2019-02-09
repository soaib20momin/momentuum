import React, { Component } from 'react';
import { FlatList, TouchableHighlight, AsyncStorage, ActivityIndicator, ListView, Text, View } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import axios from 'axios';
import endpoint from "./../../../assets/config/endpoint";
import { StackNavigator } from 'react-navigation';
import styles from "./../styles/CaseItemsStyles";
import color from "./../../../assets/styles/color";
import RouteNames from '../../../assets/config/RouteNames';

export default class CaseItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            token: '',
            caseItems: [],
            dataSource:[],
            caseId:'',
            caseItemId: '',
            
        }
    }
    
    //fired on press of case item, to open new window with item
    getItem() {
        console.log("clicked");
         /*this.props.navigation.navigate(
             'CaseItemDetails',
            { caseItemId :id},
           ); */
    }
    async componentWillMount(){
         // Get case items from parent 
         console.log("Inside component did mount Case Items");
         // Get State for caseId       
          this.state.caseId=this.props.CaseId;
          this.state.token = await AsyncStorage.getItem("token");
          console.log("Case ID inside of Case Items is "+this.state.caseId)
          this.getCaseItems();
    }

    render() {
       {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1 }}>
                    <ActivityIndicator />
                </View>
            );
        }
    }
        return (
          
            <List>
            <FlatList
               data={ this.state.dataSource }
               keyExtractor={(item, index) => index}
               renderItem={({item}) =>
               <ListItem
                onPress= {() => this.props.nav.navigate('CaseItemDetails', {CaseItemId:item.item.intId})}
            
                    //Content properties
                    title={<View ><Text style={styles.title} numberOfLines={1}>
                    Status: <Text style={styles.status}>{item.item.caseItemStatus}</Text></Text>
    
                        <Text style={styles.action}>Action: {item.item.caseItemAction}</Text></View>}
                    subtitle={<Text style={styles.itemDesc} numberOfLines={1}>{item.item.caseItemDescription}</Text>}
                    //Styling properties
                    rightTitle={item.item.caseItemDate}
                    
                    rightTitleStyle={styles.itemDate}
                    chevronColor={color.primaryColor.hex}
                    containerStyle={styles.container}
                    />}
                />
             </List>
       
        );
    }

        // Api Call to get case items
    getCaseItems(){
       
        var url = endpoint.api.url + endpoint.api.endpoints.caseItems.caseItemsForCase +  this.state.caseId;
        console.log("Calling "+url);
        axios({
            method: "get",
            url: url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token,
            }
        })
            .then(response => {
                //console.log(response.data);
               
                this.setState({
                    isLoading: false,
                    dataSource: response.data,
                    }); 
                //console.log("Case Items Data :" + response.data);
            }
            )
            .catch(error => {
                if (error.response) {
                    // the response was other than 2xx status
                    if (error.response.status == 401) {
                        console.debug("Invalid username and password entered");
                       // this.authError();
                    } else {
                        console.error("Invalid request sent. Status : " + error.response.status);
                        //this.appError();
                    }
                } else {
                    console.error("Something went wrong in the request Status : " +  error.response.status+ " Response : " + error);
                    //this.appError();
                }
            });
         }

}