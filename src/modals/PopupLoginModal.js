import React, { useContext } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  Text, TouchableOpacity, TouchableNativeFeedback,
} from 'react-native';

import { StateContext } from '../context/StateContext';
import { ThemeContext } from '../context/ThemeContext';

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
                <Text style={[styles.popupBoxTextHeader, isDarkTheme ? styles.popupBoxTextHeaderDarkTheme : styles.popupBoxTextHeaderLightTheme]}>
                  Mesaj hakkın tükendi!
                </Text>
                <Text style={[styles.popupBoxText, isDarkTheme ? styles.popupBoxTextDarkTheme : styles.popupBoxTextLightTheme]}>
                  Sohbete devam etmek için lütfen giriş yapın veya yeni bir hesap oluşturun
                </Text>
                <TouchableOpacity
                  style={[styles.popupBoxButton,isDarkTheme ? styles.popupBoxButtonDarkTheme : styles.popupBoxButtonLightTheme]}
                  onPress={() => {
                    toggleModal('popupLoginModalClose');
                    setTimeout(() => toggleModal('loginModalOpen'), 300);
                  }}
                >
                  <Text style={[styles.popupBoxButtonText, isDarkTheme ? styles.popupBoxButtonTextDarkTheme : styles.popupBoxButtonTextLightTheme]}>Kaydol veya Giriş yap</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBox: {
    width: 250,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 15,
  },
  popupBoxDarkTheme: {
    backgroundColor: 'rgba(17,17,37,0.6)',
  },
  popupBoxLightTheme: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  popupBoxTextHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popupBoxTextHeaderDarkTheme: {
    color: '#fff',
  },
  popupBoxTextHeaderLightTheme: {
    color: '#000',
  },
  popupBoxText:{
    fontSize: 15,
    width: '89%',
    marginBottom: 20,
    textAlign: 'center',
  },
  popupBoxTextDarkTheme: {
    color: '#fff',
  },
  popupBoxTextLightTheme: {
    color: '#000',
  },
  popupBoxButton: {
    width: '90%',
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBoxButtonDarkTheme: {
    backgroundColor: '#7064E9',
  },
  popupBoxButtonLightTheme: {
    backgroundColor: '#7064E9',
  },
  popupBoxButtonText:{
    fontSize: 16,
    fontWeight: '600',
  },
  popupBoxButtonTextDarkTheme: {
    color: 'white',
  },
  popupBoxButtonTextLightTheme: {
    color: 'white',
  }
});

export default PopupLoginModal;
