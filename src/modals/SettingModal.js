import React, {useContext, useEffect, useState} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Image, Share
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { getMyAccount } from '../mobil_api_fetch/GetMyAccount';

import {storage} from '../components/Storage';
import {ThemeContext} from '../context/ThemeContext';
import {StateContext} from "../context/StateContext";

const SettingModal = ({toggleModal, settingModalVisible, toggleModalOpacity, settingModalOpacity}) => {

  const {isDarkTheme, toggleTheme} = useContext(ThemeContext);
  const { toggleState, state } = useContext(StateContext);

  useEffect(() => {
    const asencFunc = async () => {
      storage.getBoolean('isLogined') ? await getMyAccount() : '';
    };
    asencFunc();
  }, []);

  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);


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
      <Modal
          visible={settingModalVisible}
          animationType={'slide'}
          transparent={true}
          onRequestClose={() => toggleModal('settingModalClose')}
      >
        <View style={[styles.modalContainer, {backgroundColor: isDarkTheme ? "rgba(0, 0, 0, 0.9)" :  "rgba(115,118,170,0.7)"} ]}>
          <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            {/* Modal içeriği */}
            <View style={[styles.modalContent , { backgroundColor: isDarkTheme ? "#0F1021" : 'white' }]}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                    style={{width: 25, height: 25, justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => toggleModal('settingModalClose')}
                >
                  <Image style={{width: 25, height: 25}} source={isDarkTheme ? require('../assets/images/arrowBack.png') : require('../assets/images/arrowBackDark.png')}/>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, {color: isDarkTheme ? 'white' : 'black'}]}>Ayarlar</Text>
                <View style={{width: 25, height: 25}}></View>
              </View>
              <View style={styles.lineContainer}>
                <LinearGradient
                    colors={isDarkTheme ? ["#0d0e22", "#410093", "#0d0e22"] : ["#fff", "#410093", "#fff"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.line}
                />
              </View>
              <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{width:'100%', paddingBottom: 20}}
                  contentContainerStyle={{ flexGrow: 1 }}
                  keyboardShouldPersistTaps="handled"
              >
                <Text style={[styles.sectionTitle, {color: isDarkTheme ? 'white' : 'black'}]}>Hesap Bilgileri</Text>

                <View style={styles.accountInfo}>
                  <View style={[styles.infoRow, {borderBottomColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}]}>
                    <Text style={styles.infoLabel}>Kullanıcı Adı</Text>
                    <Text style={styles.infoValue}>{state.myAccount.name}</Text>
                  </View>
                  <View style={[styles.infoRow, {borderBottomColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}]}>
                    <Text style={styles.infoLabel}>E-posta</Text>
                    <TouchableOpacity onPress={() => setShowEmail(!showEmail)}>
                      <Text style={styles.infoValue}>
                        {showEmail ? state.myAccount.email : "**********"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.infoRow, {borderBottomColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}]}>
                    <Text style={styles.infoLabel}>Telefon Numarası</Text>
                    <TouchableOpacity onPress={() => setShowPhone(!showPhone)}>
                      <Text style={styles.infoValue}>
                        {showPhone ? state.myAccount.phone : "**********"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                      style={[styles.infoRow, {borderBottomColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}]}
                      onPress={() => shareCode()}
                  >
                    <Text style={styles.infoLabel}>Davet Linki</Text>
                    <Image style={{width: 25, height: 25}} source={require('../assets/images/arrow-up-right.png')}/>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.sectionTitle, {color: isDarkTheme ? 'white' : '#000000'}]}>Uygulama ve Sohbet Dili</Text>

                <View style={styles.languageSettings}>
                  <View style={[styles.infoRow, {borderBottomColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}]}>
                    <Text style={styles.infoLabel}>Uygulama Dili</Text>
                    <Text style={styles.infoValue}>Türkçe</Text>
                  </View>
                  <View style={[styles.infoRow, {borderBottomColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}]}>
                    <Text style={styles.infoLabel}>Sohbet Dili</Text>
                    <Text style={styles.infoValue}>Türkçe</Text>
                  </View>
                </View>

                <TouchableOpacity
                    onPress={() => {
                      storage.set('isLogined', false);
                      toggleState('viewChat', []);
                      toggleState('talkScreenData', []);
                      toggleState('selectedAi', []);
                      toggleModal('settingModalClose');
                    }}
                >
                  <LinearGradient
                      colors={["#dd00ac", "#7130c3", "#410093"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.logoutButton}
                  >
                    <Text style={styles.logoutText}>Oturumu Kapat</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    width: "90%",
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
    paddingBottom: 0,
  },
  modalTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  lineContainer: {
    height: 2,
    width: "100%",
    marginBottom: 5,
  },
  line: {
    height: "100%",
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  accountInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  infoLabel: {
    fontSize: 16,
    color: "#7376aa",
  },
  infoValue: {
    fontSize: 16,
    color: "#7376aa",
  },
  languageSettings: {
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  closeSidebar: {
    alignSelf: "flex-start",
    width: 25,
    height: 25,
    borderRadius: 20,
    backgroundColor: "#7376aa",
    alignItems: "center",
    justifyContent: "center",
  },
});


export default SettingModal;

