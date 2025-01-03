import React, {useContext, useEffect, useState} from 'react';
import {Animated, Dimensions, Modal, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';

import SettingModalContent from '../content/SettingModalContent';
import { getMyAccount } from '../mobil_api_fetch/GetMyAccount';

import {storage} from '../components/Storage';
import {ThemeContext} from '../context/ThemeContext';

const SettingModal = ({toggleModal, settingModalVisible, toggleModalOpacity, settingModalOpacity}) => {

  const {isDarkTheme, toggleTheme} = useContext(ThemeContext);

  const translateY = new Animated.Value(0); // Animasyon için başlangıç değeri

  const [screen, setScreen] = useState(Dimensions.get('window'));

  const toggleModalSM = (value) => {
    toggleModal(value);
  };

  useEffect(() => {
    const asencFunc = async () => {
      storage.getBoolean('isLogined') ? await getMyAccount() : '';
    };
    asencFunc();
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreen(window);
    });
    return () => {
      subscription?.remove();
    };
  }, []);


  const [modalHeight, setModalHeight] = useState('90%');

  const onGestureEvent = (event) => {
    const { translationY } = event.nativeEvent;
    if (translationY > 0) {
      translateY.setValue(translationY);
    }
  };

  const onHandlerStateChange = (event) => {
    const { translationY } = event.nativeEvent;

    // Yukarı yönlü hareketi engelle
    if (translationY < 0) {
      translateY.setValue(0);
      return;
    }

    // Belirlenen mesafeden fazla kaydırıldıysa
    if (translationY > 70) {
      // Mevcut pozisyondan ekranın altına doğru animasyonlu geçiş
      Animated.timing(translateY, {
        toValue: screen.height * 0.9,
        useNativeDriver: true,
      }).start(() =>{
        toggleModalOpacity('settingModalOpacityClose');
        toggleModal('settingModalClose');
      });
    } else {
      // Yeterli mesafe kaydırılmadıysa başlangıç pozisyonuna dön
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Modal
      visible={settingModalVisible}
      animationType={Platform.OS === 'ios' ? 'none' : 'slide'}
      transparent={true}
      onRequestClose={() => toggleModal('settingModalClose')}
    >
      <View style={[styles.modalOverlay,{opacity: settingModalOpacity} ]}>
        <TouchableOpacity onPress={() => toggleModal('settingModalClose')} style={{width: '100%',height: '10%'}}><View></View></TouchableOpacity>
        {
          Platform.OS === 'ios' ? (
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
            >
              <Animated.View
                style={[
                  styles.modalBox,
                  isDarkTheme ? styles.modalBoxDarkTheme : styles.modalBoxLightTheme,
                  {
                    transform: [{ translateY }],
                    height: modalHeight,
                  },
                ]}
              >
                <SettingModalContent
                  toggleModal={toggleModalSM}
                />
              </Animated.View>
            </PanGestureHandler>
          ) : (
            <View style={[styles.modalBox, isDarkTheme ? styles.modalBoxDarkTheme : styles.modalBoxLightTheme, { height: '90%' }]}>
              <SettingModalContent
                toggleModal={toggleModalSM}
                />
            </View>
          )
        }
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  modalBoxDarkTheme: {
    backgroundColor: '#070710',
  },
  modalBoxLightTheme: {
    backgroundColor: '#ffffff',
  },
});


export default SettingModal;

