import React, {useContext, useEffect} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
} from 'react-native';

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
        style={[styles.bodyBox, isDarkTheme === true ? styles.bodyBoxDarkTheme : styles.bodyBoxLightTheme]}
      >
        <Image style={{height: 40,width: 40}} source={{uri: item.image}}/>
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
              style={[styles.themeBox, {backgroundColor: isDarkTheme === true ? '#7064E9' : 'rgba(112,100,233,0)'}]}>
              <Image
                style={styles.appThemeContainerIcon}
                source={isDarkTheme === false ? require('../assets/images/moonDark.png') : require('../assets/images/moonLight.png')}/>
              <Text style={[styles.themeBoxText, isDarkTheme === true ? styles.themeBoxTextDarkTheme : styles.themeBoxTextLightTheme]}>Koyu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                toggleTheme(false); // light mod aktif
                appTheme.set('darkTheme', false);
                storage.set('isDarkTheme', false);
              }}
              style={[styles.themeBox,{backgroundColor: isDarkTheme === false ? '#7064E9' : 'rgba(112,100,233,0)'}]}>
              <Image
                style={styles.appThemeContainerIcon}
                source={isDarkTheme === false ? require('../assets/images/sun.png') : require('../assets/images/sun.png')}/>
              <Text style={[styles.themeBoxText, styles.themeBoxTextDarkTheme]}>Açık</Text>
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

        <View>
          <View style={[styles.stick, isDarkTheme === true ? styles.stickDarkTheme : styles.stickLightTheme]}/>
          {
            storage.getBoolean('isLogined') ? (
              <View style={styles.footer}>
                {
                  /*<TouchableOpacity
                  onPress={() => {
                    toggleModal('creditModalOpen');
                  }}
                  style={[styles.footerCreditBox, isDarkTheme ? styles.footerCreditBoxDarkTheme : styles.footerCreditBoxLightTheme]}>
                  <Text style={styles.footerCreditBoxText}>Kredilerim: 372.376 </Text>
                </TouchableOpacity>*/
                }
                <Pressable
                  onPress={() => {
                    toggleModal('creditModalOpen');
                  }}
                  style={({pressed}) => [{
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 6,
                    backgroundColor: pressed ? '#7064E9' : 'transparent',
                    borderWidth: 2,
                    borderColor: pressed ? '#7064E9' : isDarkTheme ? 'rgb(39,40,55)' : 'rgb(201,198,245)',
                  }]}
                >
                  {({pressed}) => (
                    <Text
                      style={{color: pressed ? 'white' :  isDarkTheme ? 'white' : 'rgb(24,24,24)',fontSize: 16,fontWeight: 600}}
                    >
                      Hesabınızı Yükseltin
                    </Text>
                  )}
                </Pressable>
                <TouchableOpacity
                  onPress={() => {
                    toggleModal('settingModalOpen');
                    toggleModalOpacity('settingModalOpacityOpen');
                  }}
                  style={[styles.footerProfileBox, isDarkTheme ? styles.footerProfileBoxDarkTheme : styles.footerProfileBoxLightTheme]}>
                  <View style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 100,backgroundColor: 'rgba(0,0,0,0.2)'}}>
                    <Text style={{fontSize: 30,color: 'white'}}>{String(state.myAccount.name)[0]}</Text>
                  </View>
                  {/*<Image style={{width: 50, height: 50, borderRadius: 100,}} source={require('../assets/images/profil.jpg')} />*/}
                  <View style={styles.footerProfileTextBox}>
                    <Text
                      style={[styles.footerProfileTextBoxUsername, isDarkTheme ? styles.footerProfileTextBoxUsernameDarkTheme : styles.footerProfileTextBoxUsernameLightTheme]}
                      numberOfLines={1}
                    >{state.myAccount.name}</Text>
                    <Text
                      style={styles.footerProfileTextBoxEmail}
                      numberOfLines={1}
                    >{state.myAccount.email}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={() => {
                    toggleModal('loginModalOpen');
                  }}
                  style={[styles.footerLoginBox, isDarkTheme ? styles.footerLoginBoxDarkTheme : styles.footerLoginBoxLightTheme]}>
                  <Text style={[styles.footerLoginBoxText, isDarkTheme ? styles.footerLoginBoxTextDarkTheme : styles.footerLoginBoxTextLightTheme]}>Kaydol veya Giriş yap</Text>
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
    marginBottom: 20,
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
    width: 25,
    height: 25,
  },
  themeBoxText: {
    fontSize: 19,
    marginLeft: 5,
  },
  themeBoxTextDarkTheme: {
    color: 'white',
  },
  themeBoxTextLightTheme: {
    color: 'black',
  },
  stick:{
    width: '100%',
    height: 2,
    marginVertical: 12,
  },
  stickDarkTheme:{
    backgroundColor: '#201F27',
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
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginBottom: 12,
  },
  bodyBoxDarkTheme: {
    backgroundColor: '#0F1021',
  },
  bodyBoxLightTheme: {
    backgroundColor: 'rgb(239,239,254)',
  },
  bodyContainerText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#7476AA',
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
  footerLoginBoxDarkTheme: {
    backgroundColor: '#7064E9',
  },
  footerLoginBoxLightTheme: {
    backgroundColor: '#7064E9',
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
