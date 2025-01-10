import React, {useContext, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { getAiTeamList } from '../mobil_api_fetch/GetAiTeamList';
import { getViewChat } from '../mobil_api_fetch/GetViewChat';

import { appTheme, storage } from './Storage';

import { ThemeContext } from '../context/ThemeContext';
import { StateContext } from '../context/StateContext';
import { getPricingList } from '../mobil_api_fetch/GetPricingList';

const CustomDrawer = ({navigation, toggleModal,toggleModalOpacity}) => {

  const { state, toggleState } = useContext(StateContext);

  useEffect(() => {
    const asencFunc = async () => {
      toggleState('aiTeamList', await getAiTeamList());
      toggleState('pricingList', await getPricingList());
    };
    asencFunc();
  },[]);

  const aiTeamListRenderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          if(state.selectedAi !== item){
            toggleState('talkScreenData',[]);
            storage.set('selectedAi', JSON.stringify(item));
          }
          toggleState('selectedAi', item);
          navigation.getParent('LeftDrawer').closeDrawer();
          try {
            toggleState('viewChat',await getViewChat(item.id));
          }
          catch (e) {
            console.log(e);
          }
        }}
        style={[styles.bodyBox,{borderColor: isDarkTheme ? '#272838' : 'rgb(202,202,202)'} ]}
      >
        <Image style={{height: 30,width: 30, marginHorizontal: 15,}} source={{uri: item.image}}/>
        <Text style={styles.bodyContainerText}>{item.name.name_tr}</Text>
      </TouchableOpacity>
    );
  };

  const {isDarkTheme, toggleTheme} = useContext(ThemeContext);
  return (
    <SafeAreaView style={[styles.container, isDarkTheme ? styles.containerDarkTheme : styles.containerLightTheme]}>
      <View style={styles.containerBox}>
        <View>
          <View style={[styles.appThemeContainer, isDarkTheme === true ? styles.appThemeContainerDarkTheme : styles.appThemeContainerLightTheme]}>
            <TouchableOpacity
              onPress={() => {
                toggleTheme(true); // dark mod aktif
                appTheme.set('darkTheme', true);
                storage.set('isDarkTheme', true);
              }}
              style={[styles.themeBox]}>
              {
                isDarkTheme ? (
                    <LinearGradient
                        colors={["#dd00ac", "#7130c3", "#410093"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          borderRadius: 10,
                          height: '100%',

                          flexDirection: "row",
                          justifyContent: 'center',
                          alignItems: "center",
                          width: '100%',
                          gap: 7,
                        }}
                    >
                      <Image
                          style={styles.appThemeContainerIcon}
                          source={require('../assets/images/moonLight.png')}/>
                      <Text style={[styles.themeBoxText, styles.themeBoxTextDarkTheme]}>Koyu</Text>
                    </LinearGradient>
                ) : (
                    <View style={{
                        height: '100%',
                        flexDirection: "row",
                        justifyContent: 'center',
                        alignItems: "center",
                        width: '100%',
                        gap: 10,
                    }}>
                      <Image
                          style={styles.appThemeContainerIcon}
                          source={require('../assets/images/moonDark.png')}/>
                      <Text style={[styles.themeBoxText, styles.themeBoxTextLightTheme]}>Koyu</Text>
                    </View>
                )
              }
             </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                  toggleTheme(false); // light mod aktif
                  appTheme.set('darkTheme', false);
                  storage.set('isDarkTheme', false);
                }}
                style={[styles.themeBox]}>
              {
                !isDarkTheme ? (
                    <LinearGradient
                        colors={["#dd00ac", "#7130c3", "#410093"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          borderRadius: 10,
                          height: '100%',

                          flexDirection: "row",
                          justifyContent: 'center',
                          alignItems: "center",
                          width: '100%',
                          gap: 7,
                        }}
                    >
                      <Image
                          style={styles.appThemeContainerIcon}
                          source={require('../assets/images/sun.png')}/>
                      <Text style={[styles.themeBoxText, styles.themeBoxTextDarkTheme]}>Açık</Text>
                    </LinearGradient>
                ) : (
                    <View style={{
                      height: '100%',
                      flexDirection: "row",
                      justifyContent: 'center',
                      alignItems: "center",
                      width: '100%',
                      gap: 10,
                    }}>
                      <Image
                          style={styles.appThemeContainerIcon}
                          source={require('../assets/images/sun.png')}/>
                      <Text style={[styles.themeBoxText, styles.themeBoxTextDarkTheme]}>Açık</Text>
                    </View>
                )
              }
            </TouchableOpacity>
          </View>

          <View style={[styles.stick, isDarkTheme === true ? styles.stickDarkTheme : styles.stickLightTheme]}/>
        </View>

        {
          storage.getBoolean('isLogined') ? (
            storage.getString('aiTeamList') !== undefined ? (
              <View style={styles.bodyContainer}>
                <FlatList
                  data={state.aiTeamList}
                  renderItem={aiTeamListRenderItem}
                  keyExtractor={(item, index) => index.toString()}

                />
              </View>
            ) : (
              ''
            )
          ) : (
            ''
          )
        }

        <View style={{marginBottom: 10,}}>
          <View style={[styles.stick, isDarkTheme === true ? styles.stickDarkTheme : styles.stickLightTheme]}/>
          {
            storage.getBoolean('isLogined') ? (
              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('AccountUpgradeScreen');
                  }}
                  style={{borderRadius: 10}}
                >
                  <LinearGradient
                      colors={["#dd00ac", "#7130c3", "#410093"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.upgradeButton}
                  >
                    <Text style={styles.upgradeText}>Hesabınızı Yükseltin</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => {
                  toggleModal('settingModalOpen');
                  toggleModalOpacity('settingModalOpacityOpen');
                }}
                >
                  <View style={[styles.userInfo, {borderColor: isDarkTheme ? '#272838' : 'rgb(237,237,237)'}]}>
                    <View style={[styles.iconContainer, {backgroundColor: isDarkTheme ? '#0F1021' : '#7376aa'}]}>
                      <Text style={{fontSize: 25,color: 'white'}}>{String(state.myAccount.name)[0]}</Text>
                    </View>
                    <View style={styles.userTextContainer}>
                      <Text
                          style={styles.userName}
                          numberOfLines={1}
                      >{state.myAccount.name}</Text>
                      <Text
                          style={styles.userEmail}
                          numberOfLines={1}
                      >{state.myAccount.email}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={() => {
                    toggleModal('loginModalOpen');
                    setTimeout(() => {
                      navigation.getParent('LeftDrawer').closeDrawer();
                    },2000)
                  }}
                  style={[styles.footerLoginBox]}>
                  <LinearGradient
                      colors={["#dd00ac", "#7130c3", "#410093"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        width: '100%',
                        borderRadius: 10,
                        paddingTop: 18,
                        paddingBottom: 18,
                        paddingRight: 20,
                        paddingLeft: 20,
                        alignItems: "center",
                      }}
                  >
                    <Text style={styles.sidebarButtonText}>
                      Kaydol veya Giriş yap
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )
          }
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerDarkTheme: {
    backgroundColor: '#070710',
  },
  containerLightTheme: {
    backgroundColor: '#ffffff',
  },
  containerBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    width: '100%',
  },
  appThemeContainer: {
    width: '100%',
    aspectRatio: 3.57,
    borderRadius: 6,
    gap: 10,
    padding: 10,
    flexDirection: 'row',
  },
  appThemeContainerDarkTheme: {
    backgroundColor: '#0F1021',
  },
  appThemeContainerLightTheme: {
    backgroundColor: 'rgb(239,239,254)',
  },
  themeBox: {
    flex: 1,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appThemeContainerIcon :{
    width: 20,
    height: 20,
  },
  themeBoxText: {
    fontSize: 15,
  },
  themeBoxTextDarkTheme: {
    color: 'white',
  },
  themeBoxTextLightTheme: {
    color: 'black',
  },
  stick:{
    width: '100%',
    height: 1,
    marginVertical: 12,
  },
  stickDarkTheme:{
    backgroundColor: "#272838",
  },
  stickLightTheme:{
    backgroundColor: 'rgb(237,237,237)',
  },

  bodyContainer: {
    gap: 12,
    flex: 1,
  },
  bodyBox: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bodyContainerText: {
    fontSize: 16,
    color: "#7376aa",
    fontWeight: "bold",
  },
  footer: {
    gap:10,
  },

  footerLoginBox: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },

  footerLoginBoxText: {
    fontSize: 17,
  },
  footerLoginBoxTextDarkTheme: {
    color: 'white',
    fontWeight: '600',
  },
  footerLoginBoxTextLightTheme: {
    color: 'white',
    fontWeight: '600',
  },
  sidebarButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  footerCreditBox: {
    width: '100%',
    height: 60,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  footerCreditBoxDarkTheme:{
    backgroundColor: '#0F1021',
  },
  footerCreditBoxLightTheme: {
    backgroundColor: 'rgb(239,239,254)',
  },
  footerCreditBoxText: {
    fontSize: 19,
    color: '#7476AA',
    fontWeight: '600',
  },
  upgradeButton: {
    borderRadius: 10,
    backgroundColor: "#dd00ac",
    alignItems: "center",
    paddingVertical: 20,
  },
  upgradeText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
  },
  userTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    color: "#7376aa",
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#7376aa",
  },

  footerProfileBox: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  footerProfileBoxDarkTheme: {
    backgroundColor: '#0F1021',
  },
  footerProfileBoxLightTheme: {
    backgroundColor: 'rgb(239,239,254)',
  },
  footerProfileTextBox: {
    flexDirection: 'column',
    height: 50,
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  footerProfileTextBoxUsername: {
    fontSize: 20,
  },
  footerProfileTextBoxUsernameDarkTheme: {
    color: 'white',
  },
  footerProfileTextBoxUsernameLightTheme: {
    color: 'black',
  },
  footerProfileTextBoxEmail: {
    color: '#858585',
  },
});
export default CustomDrawer;

