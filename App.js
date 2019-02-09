import React from 'react';
import { SwitchNavigator } from 'react-navigation';
import App from './assets/config/RoutesConfig';
import Login from './screens/login/components/Login';
import CaseDetails from "./screens/CaseDetails/components/CaseDetails";
import CaseItems from "./screens/CaseDetails/components/CaseItems";
import CaseItemDemo from "./screens/CaseDetails/components/CaseItemDemo";
import CaseItemDetails from "./screens/CaseItemDetails/components/CaseItemDetails";
import Integrate from "./screens/CaseDetails/components/Integrate";
import ClientDetails from "./screens/CaseDetails/components/ClientDetails";
import FormGenerator from "./screens/CaseDetails/components/FormGenerator";
import TestCaseDetails from "./screens/CaseDetails/components/TestCaseDetails";
import CaseUpdateForm from "./screens/CaseDetails/components/CaseUpdateForm";
import color from "./assets/styles/color"

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: color.primaryColor.hex,
  },
  headerTitleStyle:{ color: color.white.hex,textAlign: 'center',alignSelf:'center'},
};
  
export default SwitchNavigator(
  {
    Auth: Login,
    App: App
  },
  {
    initialRouteName: 'Auth'
  }
);
