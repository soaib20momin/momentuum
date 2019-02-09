import { StyleSheet } from 'react-native';
import { Constants } from 'expo';
import color from '../../../assets/styles/color';
//Stylesheet
export default StyleSheet.create({
    container: {
        flex: 1,
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
    lastrow: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    firstElement: {
        flex: 1,
    },
    secondElement: {
        flex: 2,
    },
    clientFirstElement: {
        flex: 2,
    },
    clientSecondElement: {
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
        paddingHorizontal: 10,
        paddingVertical:5,
        justifyContent: 'space-between',
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
        paddingTop: 10  
    },
    picker: {
        height: 40,
        fontSize: 13
    },
    /* required */
    details: {
        backgroundColor: '#fff'
    },
    button: {
        flex: 1,
        backgroundColor: color.primaryColor.rgb,
        height: 50,
        padding: 10,
        borderRadius: 3,
      },
    editButton: {
        paddingHorizontal: 10, 
        paddingTop: 10,
    },
    editButtonActive: {
        backgroundColor: '#dcdcdc',
        borderRadius: 5,
        borderWidth: 0.5,
        paddingHorizontal: 10,
        paddingTop: 10,
    }, 
    editActions: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        alignItems: 'center'
    },
})