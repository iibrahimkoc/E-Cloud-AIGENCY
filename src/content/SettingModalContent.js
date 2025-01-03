import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Share} from 'react-native';
import React, {useContext} from 'react';

import {ThemeContext} from '../context/ThemeContext';
import {StateContext} from '../context/StateContext';

import {storage} from '../components/Storage';

const SettingModalContent = ({toggleModal}) => {

  const {isDarkTheme} = useContext(ThemeContext);
  const { toggleState } = useContext(StateContext);


  const shareCode = async () => {
    try {
      await Share.share({
        message: 'AIGENCY Mobil davetiye kodum: ' + JSON.parse(storage.getString('myAccount')).invite_code,
      });
    }
    catch (error) {
      console.error(error);
    }
  };


  return (
    <View>
      <View style={styles.dragIndicator} />
      <View style={{alignItems: 'center'}}>
        <Text style={[styles.modalBoxSettingHeader, isDarkTheme ? styles.modalBoxSettingHeaderDarkTheme : styles.modalBoxSettingHeaderLightTheme ]}>Ayarlar</Text>
        <View style={{width: '100%',height: 1, backgroundColor: 'rgba(255,255,255,0.1)',marginTop: 10}}></View>
      </View>
      <ScrollView>
        <View style={{paddingTop: 10,width: '100%', alignItems: 'center', paddingBottom: 70}}>

          <View style={styles.modalBoxSettingContainer}>
            <Text
              style={[styles.modalBoxSettingBoxHeader, isDarkTheme ? styles.modalBoxSettingBoxHeaderDarkTheme : styles.modalBoxSettingBoxHeaderLightTheme]}
            >Hesap Bilgileri</Text>
            <View style={[styles.modalBoxSettingBoxContainer, isDarkTheme ? styles.modalBoxSettingBoxContainerDarkTheme : styles.modalBoxSettingBoxContainerLightTheme]}>
              <View style={[styles.modalBoxSettingBox, isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <Text
                  style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}
                >
                  Kullanıcı Adı
                </Text>
                <Text
                  style={[styles.modalBoxSettingBoxTextAnswer, isDarkTheme ? styles.modalBoxSettingBoxTextAnswerDarkTheme : styles.modalBoxSettingBoxTextAnswerLightTheme]}
                >
                  {JSON.parse(storage.getString('myAccount')).name}
                </Text>
              </View>
              <View style={[styles.modalBoxSettingBox, isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <Text
                  style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}
                >
                  E-posta
                </Text>
                <Text
                  style={[styles.modalBoxSettingBoxTextAnswer, isDarkTheme ? styles.modalBoxSettingBoxTextAnswerDarkTheme : styles.modalBoxSettingBoxTextAnswerLightTheme]}
                >
                  {JSON.parse(storage.getString('myAccount')).email}
                </Text>
              </View>
              <View style={[styles.modalBoxSettingBox, isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <Text
                  style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}
                >
                  Telefon Numarası
                </Text>
                <Text
                  style={[styles.modalBoxSettingBoxTextAnswer, isDarkTheme ? styles.modalBoxSettingBoxTextAnswerDarkTheme : styles.modalBoxSettingBoxTextAnswerLightTheme]}
                >
                  {JSON.parse(storage.getString('myAccount')).phone}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => shareCode()}
                style={[styles.modalBoxSettingBox,  {borderBottomWidth: 0}, isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}
              >
                <View style={{flexDirection: 'row', gap: 10,alignItems: 'center'}}>
                  <Text
                    style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}
                  >Davet Linki</Text>
                </View>
                <View>
                  <Image style={{width: 25, height: 25}} source={require('../assets/images/arrow-up-right.png')}/>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {
            /*
            <View style={styles.modalBoxSettingContainer}>
            <Text style={[styles.modalBoxSettingBoxHeader, isDarkTheme ? styles.modalBoxSettingBoxHeaderDarkTheme : styles.modalBoxSettingBoxHeaderLightTheme]}>Bildirim Ayarları</Text>
            <View style={[styles.modalBoxSettingBoxContainer, isDarkTheme ? styles.modalBoxSettingBoxContainerDarkTheme : styles.modalBoxSettingBoxContainerLightTheme]}>
              <View style={[styles.modalBoxSettingBox, isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <View style={{flexDirection: 'row', gap: 10,alignItems: 'center'}}>
                  <View>
                    <Image style={{width: 20, height: 20}} source={require('../assets/images/bell.png')}/>
                  </View>
                  <Text
                    style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}
                  >Bildirimlerim</Text>
                </View>
                <View>
                  <Image style={{width: 25, height: 25}} source={require('../assets/images/arrow-up-right.png')}/>
                </View>
              </View>
              <View style={[styles.modalBoxSettingBox, isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <Text style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}>E-posta</Text>
              </View>
              <View style={[styles.modalBoxSettingBox, isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <Text style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}>E-posta</Text>
              </View>
              <View style={[styles.modalBoxSettingBox, isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <Text style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}>E-posta</Text>
              </View>
              <View style={[styles.modalBoxSettingBox, isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <Text style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}>E-posta</Text>
              </View>
              <View style={[styles.modalBoxSettingBox, isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <Text style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}>E-posta</Text>
              </View>
              <View style={[styles.modalBoxSettingBox,{borderBottomWidth: 0},  isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <Text style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}>E-posta</Text>
              </View>
            </View>
          </View>
            */
          }

          <View style={styles.modalBoxSettingContainer}>
            <Text style={[styles.modalBoxSettingBoxHeader, isDarkTheme ? styles.modalBoxSettingBoxHeaderDarkTheme : styles.modalBoxSettingBoxHeaderLightTheme]}>Uygulama ve Sohbet Dili</Text>
            <View style={[styles.modalBoxSettingBoxContainer, isDarkTheme ? styles.modalBoxSettingBoxContainerDarkTheme : styles.modalBoxSettingBoxContainerLightTheme]}>
              <View style={[styles.modalBoxSettingBox, isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <Text style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}>Uygulama Dili</Text>
                <Text style={[styles.modalBoxSettingBoxTextAnswer, isDarkTheme ? styles.modalBoxSettingBoxTextAnswerDarkTheme : styles.modalBoxSettingBoxTextAnswerLightTheme]}>Türkçe</Text>
              </View>
              <View style={[styles.modalBoxSettingBox,{borderBottomWidth: 0},  isDarkTheme ? styles.modalBoxSettingBoxDarkTheme : styles.modalBoxSettingBoxLightTheme]}>
                <Text style={[styles.modalBoxSettingBoxText, isDarkTheme ? styles.modalBoxSettingBoxTextDarkTheme : styles.modalBoxSettingBoxTextLightTheme]}>Sohbet Dili</Text>
                <Text style={[styles.modalBoxSettingBoxTextAnswer, isDarkTheme ? styles.modalBoxSettingBoxTextAnswerDarkTheme : styles.modalBoxSettingBoxTextAnswerLightTheme]}>Türkçe</Text>
              </View>
            </View>
          </View>




          {/* OTURUM KAPAMA */}
          <View style={[styles.modalBoxSettingContainer, { marginBottom: 0 }]}>
            <TouchableOpacity
              onPress={() => {
                storage.set('isLogined', false);
                toggleState('viewChat', []);
                toggleState('talkScreenData', []);
                toggleState('selectedAi', []);
                toggleModal('settingModalClose');
              }}
              style={styles.modalBoxSettingBoxLogout}>
              <Text style={styles.modalBoxSettingBoxLogoutText}>Oturumu kapat</Text>
            </TouchableOpacity>
          </View>


        </View>
      </ScrollView>
    </View>
  );
};

export default SettingModalContent;

const styles = StyleSheet.create({
  dragIndicator: {
    width: 40,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalBoxSettingHeader: {
    fontSize: 20,
    fontWeight: 500,
  },
  modalBoxSettingHeaderDarkTheme: {
    color: 'white',
  },
  modalBoxSettingHeaderLightTheme: {
    color: 'black',
  },
  modalBoxSettingContainer: {
    width:'90%',
    marginBottom: 20,
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },

  modalBoxSettingBoxHeader: {
    fontSize: 16,
    fontWeight: 500,
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 5
  },
  modalBoxSettingBoxHeaderDarkTheme: {
    color: 'rgba(255,255,255,0.2)',
  },
  modalBoxSettingBoxHeaderLightTheme: {
    color: 'rgba(0,0,0,0.4)',
  },

  modalBoxSettingBoxContainer: {
    width: '100%',
    borderRadius: 10,
  },
  modalBoxSettingBoxContainerDarkTheme: {
    backgroundColor: '#0F1021',
  },
  modalBoxSettingBoxContainerLightTheme: {
    backgroundColor: 'rgb(239,239,254)',
  },
  modalBoxSettingBox: {
    height: 45,
    borderBottomWidth:1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal:15,

  },
  modalBoxSettingBoxDarkTheme: {
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalBoxSettingBoxLightTheme: {
    borderColor: 'rgba(116,118,170,0.1)',
  },

  modalBoxSettingBoxText: {
    fontSize: 18,
  },
  modalBoxSettingBoxTextDarkTheme: {
    color: 'white',
  },
  modalBoxSettingBoxTextLightTheme: {
    color: '#7476AA',
    fontWeight: 500,
  },
  modalBoxSettingBoxTextAnswer: {
    fontSize: 18,
  },
  modalBoxSettingBoxTextAnswerDarkTheme: {
    color: 'rgba(255,255,255,0.4)',
  },
  modalBoxSettingBoxTextAnswerLightTheme: {
    color: 'rgb(0,0,0)',
  },


  modalBoxSettingBoxLogout: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalBoxSettingBoxLogoutText: {
    color: '#DD3F36',
    fontSize: 18,
    fontWeight: '600',
  },
})
