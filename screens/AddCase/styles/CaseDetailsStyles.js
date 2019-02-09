import { StyleSheet } from 'react-native';
import { Constants } from 'expo';
//Stylesheet
export default StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
      backgroundColor: "rgba(55, 111, 146, 1)",
      width: null,
      height: 50,
      padding: 10,
      borderRadius: 3,
    },
    
    /* required  */
    category: {
        fontSize: 16,
        color: '#444',
        fontWeight: '500',
        top: 10,
    },
    /* required  */
    header: {
        paddingHorizontal: 10,
        paddingBottom: 20,
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        //color: '#444',
        //fontWeight: '500',
        top: 10,
        justifyContent: 'space-between'
    },
    clientHeader: {
        paddingBottom:15
    },
    /* required */
    row: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    firstElement: {
        flex: 1,
    },
    secondElement: {
        flex: 2,
    },
    /* required */
    firstRow: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
    },
    clientRow: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical:5,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    /* required */
    clientFirstRow: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical:5,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    clientName: {
        color: '#2b6aa6',
        fontWeight:'500',
    },
    /* required */
    fieldname: {
        color: '#000',
        paddingTop: 10
    },
    /* required */
    textInput: {
        height: 45,
        paddingHorizontal: 20,
    },
    picker: {
        height: 45,
    
    },
    /* required */
    details: {
        backgroundColor: '#fff'
    },
})