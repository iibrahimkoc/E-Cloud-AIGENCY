import React, { useContext } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  Text, TouchableOpacity, TouchableNativeFeedback, Image,
} from 'react-native';

import { StateContext } from '../context/StateContext';
import { ThemeContext } from '../context/ThemeContext';

import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const PopupLoginModal = ({ toggleModal, popupLoginModalVisible }) => {
  const { state } = useContext(StateContext);
  const { isDarkTheme } = useContext(ThemeContext);


  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={popupLoginModalVisible}
      onRequestClose={() => toggleModal('popupLoginModalClose')}
    >
      <TouchableNativeFeedback
        onPress={() => toggleModal('popupLoginModalClose')}
      >
        <View style={styles.creditModalOverlay}>
          <TouchableNativeFeedback>
            <View style={styles.container}>
              <View style={[styles.popupBox, isDarkTheme ? styles.popupBoxDarkTheme : styles.popupBoxLightTheme]}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 }}>
                  <TouchableOpacity
                      style={[styles.backButton , {backgroundColor: isDarkTheme ? "#7376aa" : '#f1f0fd'}]}
                      onPress={() => toggleModal('popupLoginModalClose')}
                  >
                    <Image source={require('../assets/images/close.png')} style={styles.backButtonIcon} />
                  </TouchableOpacity>
                  <Text
                      style={[
                        styles.modalTitle,
                        { color: isDarkTheme ? "#7376aa" : "#7376aa" },
                      ]}
                  >
                    Mesaj hakkın tükendi!
                  </Text>
                  <View style={styles.backButton}></View>
                </View>

                <View style={styles.lineContainer}>
                  <LinearGradient
                      colors={
                        isDarkTheme
                            ? ["#0d0e22", "#410093", "#0d0e22"]
                            : ["#E0E0E0", "#7130c3", "#E0E0E0"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.line}
                  />
                </View>
                <Text style={styles.popupMessage}>
                  Sohbete devam etmek için lütfen giriş yapın veya yeni bir hesap
                  oluşturun.
                </Text>

                <TouchableOpacity
                    style={styles.registerButtonContainer}
                    onPress={() => {
                      toggleModal('popupLoginModalClose');
                      setTimeout(() => toggleModal('loginModalOpen'), 300);
                    }}
                >
                  <LinearGradient
                      colors={["#dd00ac", "#7130c3", "#410093"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.registerButton}
                  >
                    <Text style={styles.registerButtonText}>Kaydol veya Giriş yap</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableNativeFeedback>
        </View>
      </TouchableNativeFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  creditModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(7,7,16,0.6)',
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBox: {
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  popupBoxDarkTheme: {
    backgroundColor: 'rgba(17,17,37,0.6)',
  },
  popupBoxLightTheme: {
    backgroundColor: 'rgba(255,255,255,1)',
  },


  backButton: {
    width: 25,
    height: 25,
    borderRadius: 50,
    padding: 5,
  },
  backButtonIcon: {
    width: '100%',
    height: '100%',
  },

  modalTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },

  lineContainer: {
    height: 2,
    width: "100%",
    marginBottom: 20,
  },
  line: {
    height: "100%",
    borderRadius: 1,
  },

  popupMessage: {
    fontSize: 14,
    color: "#7376aa",
    textAlign: "center",
    marginBottom: 20,
  },
  registerButtonContainer: {
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: "5%",
  },
  registerButton: {
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PopupLoginModal;
