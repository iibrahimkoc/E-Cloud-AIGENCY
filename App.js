import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BootSplash from 'react-native-bootsplash';
import {PaperProvider} from "react-native-paper";

import { ThemeProvider } from './src/context/ThemeContext';
import { StateProvider } from './src/context/StateContext';

import TalkScreen from './src/screens/TalkScreen';
import CustomRightDrawer from './src/components/CustomRightDrawer';
import CustomDrawer from './src/components/CustomDrawer';

import Onboarding from "./src/screens/Onboarding";
import AccountUpgradeScreen from "./src/screens/AccountUpgradeScreen";

import { getAiList } from './src/genel_api_fetch/GetAiList';
import { getLastMessage } from './src/genel_api_fetch/GetLastMessage';
import { getMessageData } from './src/genel_api_fetch/GetMessageData';

import SettingModal from './src/modals/SettingModal';
import CreditModal from './src/modals/CreditModal';
import LoginModal from './src/modals/LoginModal';
import PopupLoginModal from './src/modals/PopupLoginModal';
import HtmlLiveModal from "./src/modals/HtmlLiveModal";
import RenameChatModal from "./src/modals/RenameChatModal";

import {storage} from './src/components/Storage';


if (storage.getBoolean('isLogined') === undefined) {
  storage.set('!firstOpen', false);
  storage.set('isLogined', false);
}

const RightDrawer = createDrawerNavigator();
const LeftDrawer = createDrawerNavigator();


const App = () => {

  const [screen, setScreen] = useState(Dimensions.get('window'));



  useEffect(() => {
    const fetchApi = async () => {
      try {
        await getAiList();
        await getLastMessage();
        await getMessageData();
      }
      catch (error) {
        console.log(error);
      }
    };
    fetchApi();

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreen(window);
    });
    return () => {
      subscription?.remove();
    };
  }, []);




  const [settingModalVisible, setSettingModalVisible] = useState(false);
  const [isCreditModalVisible, setIsCreditModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [popupLoginModalVisible, setPopupLoginModalVisible] = useState(false);
  const [htmlLiveModalVisible, setHtmlLiveModalVisible] = useState(false);
  const [renameChatModalVisible, setRenameChatModalVisible] = useState(false);
  const [settingModalOpacity, setSettingModalOpacity] = useState(1);


  const toggleModal = (value) => {
    switch (value) {
      case 'settingModalOpen': {
        setSettingModalVisible(true);
        break;
      }
      case 'settingModalClose': {
        setSettingModalVisible(false);
        break;
      }
      case 'creditModalOpen': {
        setIsCreditModalVisible(true);
        break;
      }
      case 'creditModalClose': {
        setIsCreditModalVisible(false);
        break;
      }
      case 'loginModalOpen': {
        setLoginModalVisible(true);
        break;
      }
      case 'loginModalClose': {
        setLoginModalVisible(false);
        break;
      }
      case 'popupLoginModalOpen': {
        setPopupLoginModalVisible(true);
        break;
      }
      case 'popupLoginModalClose': {
        setPopupLoginModalVisible(false);
        break;
      }
      case 'htmlLiveModalOpen': {
        setHtmlLiveModalVisible(true);
        break;
      }
      case 'htmlLiveModalClose': {
        setHtmlLiveModalVisible(false);
        break;
      }
      case 'renameChatModalOpen': {
        setRenameChatModalVisible(true);
        break;
      }
      case 'renameChatModalClose': {
        setRenameChatModalVisible(false);
        break;
      }
    }
  };
  const toggleModalOpacity = (value) => {
    switch (value) {
      case 'settingModalOpacityOpen':{
        setSettingModalOpacity(1);
        break;
      }
      case 'settingModalOpacityClose': {
        setSettingModalOpacity(0);
        break;
      }
    }
  };



  const RightDrawerScreen = () => {
    return (
      <RightDrawer.Navigator
        id="rightDrawer"
        drawerContent={(props) => <CustomRightDrawer {...props} />}
        screenOptions={{
          drawerType: 'slide',
          drawerPosition: 'right',
          headerShown: false,
          drawerStyle: {
            width: screen.width > 500 ? 300 : '70%',
          },
        }}
      >
        <RightDrawer.Screen
          name="TalkScreen"
          options={{ headerShown: false }}
          children={(props) => (
            <TalkScreen {...props} toggleModal={toggleModal} />
          )}
        />
      </RightDrawer.Navigator>
    );
  };

  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StateProvider>
          <ThemeProvider>
            <NavigationContainer
              onReady={() => {
                BootSplash.hide();
              }}
            >
              <LeftDrawer.Navigator
                id="LeftDrawer"
                initialRouteName={storage.getBoolean('!firstOpen') ? 'MainApp' : 'Onboarding'}
                drawerContent={(props) => <CustomDrawer {...props} toggleModal= {toggleModal} toggleModalOpacity={toggleModalOpacity}/>}
                screenOptions={({route}) => ({
                  drawerType: 'slide',
                  drawerPosition: 'left',
                  headerShown: false,
                  swipeEdgeWidth: screen.width*0.05,
                  drawerStyle: {
                    width: screen.width > 500 ? 300 : '70%',
                  },
                  swipeEnabled: route.name !== 'Onboarding' && route.name !== 'AccountUpgradeScreen',
                })}>
                <LeftDrawer.Screen name="MainApp" component={RightDrawerScreen} />
                <RightDrawer.Screen name="Onboarding" component={Onboarding} />
                <RightDrawer.Screen name="AccountUpgradeScreen" component={AccountUpgradeScreen} />
              </LeftDrawer.Navigator>
            </NavigationContainer>

            <CreditModal
              toggleModal={toggleModal}
              isCreditModalVisible={isCreditModalVisible}
            />

            <SettingModal
              toggleModal={toggleModal}
              toggleModalOpacity={toggleModalOpacity}
              settingModalOpacity={settingModalOpacity}
              settingModalVisible={settingModalVisible}
            />

            <LoginModal
              toggleModal={toggleModal}
              loginModalVisible={loginModalVisible}
            />

            <PopupLoginModal
              toggleModal={toggleModal}
              popupLoginModalVisible={popupLoginModalVisible}
            />

            <HtmlLiveModal
              toggleModal={toggleModal}
              htmlLiveModalVisible={htmlLiveModalVisible}
            />

            <RenameChatModal
              toggleModal={toggleModal}
              renameChatModalVisible={renameChatModalVisible}
            />
          </ThemeProvider>
        </StateProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
};

export default App;
