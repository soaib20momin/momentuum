import { StyleSheet } from 'react-native';
import { Constants } from 'expo';
import color from '../../../assets/styles/color';
// import { radius } from 'react-native-material-ripple/styles';
//Stylesheet
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f4'
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
        flex: 0.06,
        flexDirection: 'row',
        top: 10,
        justifyContent: 'space-between'
    },
    clientHeader: {
        paddingBottom: 15
    },
    /* required */
    row: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
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
        // height: 45,
        paddingHorizontal: 20,
    },
    /* required */
    details: {
        backgroundColor: '#fff'
    },
    button: {
        backgroundColor: color.primaryColor.hex,
        alignItems: 'center',
        flex: 0.5,
        justifyContent:'center',      
    },
    buttonText: {
        fontSize:25
    },
    buttonNeutral: {
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        flex: 0.5,
        // height: 50
    },
    editButton: {
        paddingHorizontal: 10, 
    },
    editButtonActive: {
        backgroundColor: '#dcdcdc',
        borderRadius: 5,
        borderWidth: 0.5,
        paddingHorizontal: 10,
    }, 
    editActions: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        alignItems: 'center'
    }, 
    deleteButton: {
        paddingHorizontal: 10,
    }, 
    descriptionText: {
        height: 50,
    }
    

});
