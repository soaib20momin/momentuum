import { StyleSheet } from 'react-native';
import { Constants } from 'expo';
import { Dimensions } from 'react-native';


export default StyleSheet.create({
    container: {
        flex: 1,
    },
    
    disclaimer: {
        fontSize: 20,
        color: '#444',
        paddingBottom:15,
        paddingTop: 30,
    },
    header: {
        paddingTop: 15,
        paddingHorizontal: 10,
        paddingBottom: 20,
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        top: 10,
        justifyContent: 'space-between'
    },
    /* required */
    details: {
        backgroundColor: '#fff'
    },
    textDetail: {
        marginBottom: 10, 
        alignSelf: "stretch", 
        //textAlign: "left",
        fontSize: 18,
    },
    buttonrow: {
        flexDirection: 'row', 
        paddingTop: 20, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    
    buttonStyle: {
        borderRadius: 2, 
        width: 100,
    },
    signatureContainer: {
        flex: 1, 
        backgroundColor: 'white',
    }
})
