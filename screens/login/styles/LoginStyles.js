import { StyleSheet } from "react-native";

export default StyleSheet.create({
  backgroundImage: {
    backgroundColor: "#ccc",
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  container: {
    paddingLeft: 25,
    paddingRight: 25
  },
  formGroup: {
    paddingTop: 40
  },
  labelStyles: {
    color: "white",
    paddingTop:10,
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic'
  },
  inputStyle: {
    color: "white",
    fontSize: 20,
    paddingTop: 5,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: "rgba(55, 111, 146, 1)",
    width: null,
    height: 50,
    padding: 10,
    borderRadius: 3,
  }
});
