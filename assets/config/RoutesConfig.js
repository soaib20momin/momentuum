import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // 6.2.2
import { TabNavigator, TabBarBottom, StackNavigator } from "react-navigation"; // 1.0.0-beta.27
import CaseList from "../../screens/CaseList/components/CaseList";
import Test from "../../screens/CaseList/components/Test";
import ClientList from "../../screens/clients/components/ClientList";
import AddClient from "../../screens/clients/components/AddClient";
import AddCase from "../../screens/AddCase/components/AddCase";
import Profile from "../../screens/Profile/components/Profile";
import CaseItems from "../../screens/CaseDetails/components/CaseItems";
import CaseItemDemo from "../../screens/CaseDetails/components/CaseItemDemo";
import CaseItemDetails from "../../screens/CaseItemDetails/components/CaseItemDetails";
import Integrate from "../../screens/CaseDetails/components/Integrate";
import ClientDetails from "../../screens/CaseDetails/components/ClientDetails";
import CaseDetails from "../../screens/CaseDetails/components/CaseDetails";
import FormGenerator from "../../screens/CaseDetails/components/FormGenerator";
import TestCaseDetails from "../../screens/CaseDetails/components/TestCaseDetails";
import CaseUpdateForm from "../../screens/CaseDetails/components/CaseUpdateForm";
import CreateCaseItem from "../../screens/CreateCaseItem/components/CreateCaseItem";
import Disclaimer from "../../screens/CaseDetails/components/Disclaimer";
import Sign from "../../screens/CaseDetails/components/Sign";
import CreateItemSwitch from "../../screens/CaseItems/components/CreateItemSwitch";
import PhotoCapture from "../../screens/CaseItems/components/PhotoCapture";
import PhotoUpload from "../../screens/CaseItems/components/PhotoUpload";
import color from '../styles/color';
/**
 * This is the main configuration of all the Screen routes in the Application
 * Whenever you need to add a new route, you should add it here
 */
const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: color.primaryColor.hex,
  },
  headerTitleStyle:{ color: color.white.hex,textAlign: 'center',alignSelf:'center'},
};

const SecondStack = StackNavigator(
  {
    ClientList: {
      screen: ClientList,
      title: "ClientList"
    }
  }, 
    {
      initialRouteName: "ClientList",
      headerMode: "screen",
      navigationOptions: {
        ...defaultNavigationOptions,        
        }
    }
  );

const HomeStack = StackNavigator(
  {
    CaseList: {
      screen: CaseList,
      title: "CaseList"
    },
    CaseDetails: {
      screen: CaseDetails,
      title: "Case Details"
    },
    CaseItemDetails: {
      screen: CaseItemDetails,
      title: "Case Item Details"
    },
    CaseItems: {
      screen: CaseItems
    },
    CaseItemDemo: {
      screen: CaseItemDemo
    },
    ClientList: {
      screen: ClientList,
      title: "ClientList"
    },
    AddCase: {
      screen: AddCase,
      title: "AddCase"
    },
    AddClient: {
      screen: AddClient,
      title: "AddClient"
    },
    CreateItemSwitch: {
      screen: CreateItemSwitch,
      title: "Create Case Item"
    },
    CreateCaseItem: {
      screen: CreateCaseItem,
      title: "Create CaseItem"
    },
    Disclaimer: {
      screen: Disclaimer,
      title: "Disclaimer"
    },
    Sign: {
      screen: Sign,
      title: "Sign"
    },
    PhotoCapture: {
      screen: PhotoCapture,
      title: "Photo Capture"
    },
    PhotoUpload: {
      screen: PhotoUpload,
      title: "Photo Upload"
    }
  },
  {
    initialRouteName: "CaseList",
    headerMode: "screen",
    navigationOptions: {
      ...defaultNavigationOptions,        
      }
  }
);

export default tabnav = TabNavigator(
  {
    Home: { screen: HomeStack },
    Add: { screen: SecondStack },
    Profile: { screen: Profile }
  },
  {
    headerMode: "screen",
    initialRouteName: "Home",
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Home") {
          iconName = `ios-home${focused ? "" : "-outline"}`;
        } else if (routeName === "Add") {
          iconName = `ios-add-circle${focused ? "" : "-outline"}`;
        } else if (routeName === "Profile") {
          iconName = `ios-person${focused ? "" : "-outline"}`;
        }
        return <Ionicons name={iconName} size={30} color={tintColor} />;
      }
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    tabBarOptions: {
      activeTintColor: "#3385ff",
      inactiveTintColor: "#3385ff"
    },
    tabBarLabel: "none",
    animationEnabled: false,
    swipeEnabled: false
  }
);
