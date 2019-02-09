import React from 'react';
import endpoint from "../../../assets/config/endpoint";
import { ActivityIndicator, AsyncStorage, StyleSheet,
     Text, View, TextInput, ScrollView, Picker, 
     KeyboardAvoidingView, FlatList, Image,Dimensions } from 'react-native';
import axios from "axios";
import CaseItemDetails from './CaseItemDetails';
import styles from "../styles/ImageFileStyle"
import Icon from 'react-native-vector-icons/FontAwesome';
import GrowingTextInput from './GrowingTextInput';
import DatePicker from 'react-native-datepicker';
import color from '../../../assets/styles/color';

class ImageFile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file:{},
            fileId:'',
            token:null
            
           
        };
    }


    async componentWillMount() {

        // Get case items from parent 
        console.log("Inside component will mount File Item");
        // Get State for caseId       
        this.setState({
            file:this.props.File,
            token :await AsyncStorage.getItem("token")
        }); 
        
       
         
         console.log("The file data has loaded for file: "+JSON.stringify(this.state.file));
        
    }

    render() {
       
        return (
            <View style={styles.container}>
           <Text style={styles.description}>Description: {this.state.file.comments}</Text>
          
           {this.state.token!==null &&
                    <View
                    Style={styles.imgParent}>
                       <Image
                            source={{
                            uri: endpoint.api.url + endpoint.api.endpoints.fileItem.image +this.state.file.id,
                            method: 'GET',
                            headers: {
                            Pragma: 'no-cache',
                            Authorization: 'Bearer '+this.state.token,
                              }
                        }}

                      
                        style={{  width: (Dimensions.get('window').width)*.95,
                                height: (Dimensions.get('window').width)*.95 ,
                                flex:1, resizeMode: 'contain'} }

                           
                        />
                        </View>
                    }
            </View>
        )
    }
       
}

export default ImageFile;