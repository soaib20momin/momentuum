import React from "react";
import { KeyboardAvoidingView, Picker, Alert } from "react-native";
import { Camera, Permissions } from "expo";
import { FormLabel, FormInput, Button } from "react-native-elements";
import color from "../../../assets/styles/color";
import routes from "../../../assets/config/RouteNames";
import endpoints from "../../../assets/config/endpoint";

export default class PhotoUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folder: "default",
      append: "",
      folders: ["default", "other", "priority"],
      caseId: props.navigation.state.params.caseId
    };
  }

  upload = () => {
    let documentName = this.documentName.value;
    let folder = this.state.folder;
    let append = this.state.append;

    let url =
      endpoints.api.url + endpoints.api.endpoints.fileItem.caseItemsForCase;

    // TODO : actually upload to the endpoint
    console.debug(
      `Uploading file to dummy endpoint, with values: ${documentName} : ${folder} : ${append}`
    );
    Alert.alert(
      "Success",
      "File Upload is an experimental feature. Currently it is not storing the file in the server. Rest assured, that your file was captured as a demo of this feature",
    )
    this.props.navigation.navigate(routes.caseDetails, {caseid1 : this.state.caseId})
  };

  cancel = () => {
    this.props.navigation.navigate(routes.caseDetails, {caseid1 : this.state.caseId})
  }

  render() {
    return (
      <KeyboardAvoidingView>
        <FormLabel>Document Name</FormLabel>
        <FormInput
          ref={documentName => (this.documentName = documentName)}
          value="Img1.jpg"
        />
        <FormLabel>Folder</FormLabel>
        <Picker
          selectedValue={this.state.folder}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ folder: itemValue })
          }
        >
          <Picker.Item label="default" value="default" />
          <Picker.Item label="other" value="other" />
          <Picker.Item label="priority" value="priority" />
        </Picker>
        <FormLabel>Append to File Name</FormLabel>
        <FormInput
          value={this.state.append}
          onChangeText={(append) => { this.setState({append})}}
        />
        <Button
          raised
          title="Upload"
          backgroundColor={color.primaryColor.hex}
          onPress={this.upload}
          containerViewStyle={{ padding: 20 }}
        />
        <Button
          raised
          title="Cancel"
          onPress={this.cancel}
          containerViewStyle={{ padding: 20 }}
        />
      </KeyboardAvoidingView>
    );
  }
}
