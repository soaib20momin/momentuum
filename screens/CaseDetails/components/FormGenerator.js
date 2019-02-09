import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

//import CustomButton from '.components/CustomButton';

export default class FormGenerator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favColor: '',
      editable: false,
      items: [
        {
          label: 'Red',
          value: 'red',
        },
        {
          label: 'Orange',
          value: 'orange',
        },
        {
          label: 'Blue',
          value: 'blue',
        },
        {
          label: 'Address-Telephone-E-Mail add/change',
          value: 'Address-Telephone-E-Mail add/change',
        },
      ],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <RNPickerSelect
          items={this.state.items}
          placeholder={{}}
          disabled={this.state.editable}
          onValueChange={(item) => this.setState({ favColor: item.value })}
        >
         
        </RNPickerSelect>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});