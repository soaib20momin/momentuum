import React from 'react';
import { Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera, Permissions } from 'expo';
import {Icon} from 'react-native-elements';
import color from '../../../assets/styles/color';
import routes from '../../../assets/config/RouteNames';

export default class PhotoCapture extends React.Component {

  static navigationOptions = {
    title: 'Capture Document',	
    headerMode: 'screen',		
    tabBarVisible: false		
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    autoFocus: Camera.Constants.AutoFocus.on,

  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  /**
   * Capture a photo
   */
  capture = async () => {
    if (this.camera){
      await this.camera.takePictureAsync().then((photo) => {
        console.debug(`Captured photo: ${JSON.stringify(photo)}`)
        this.props.navigation.navigate(routes.photoUpload, {uri:photo.uri, caseId: this.props.navigation.state.params.caseId})
      });
    }
  };


  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Camera 
            ref={ ref => {this.camera = ref;} }
            style={{ 
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }} 
            type={this.state.type}
          >
            <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}>
              <TouchableOpacity
                onPress={this.capture}
              >
                <Icon 
                  name='ios-camera'
                  type='ionicon'
                  size='60'
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Icon 
                  name='ios-reverse-camera'
                  type='ionicon'
                  size='60'
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </SafeAreaView>
      );
    }
  }
}