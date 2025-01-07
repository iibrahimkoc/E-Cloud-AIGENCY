import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Modal,
  Text,
  StyleSheet,
  Dimensions, View, SafeAreaView,

} from 'react-native';

import { StateContext } from '../context/StateContext';
import Swiper from "react-native-web-swiper";
const { width } = Dimensions.get('window');

const CreditModal = ({ toggleModal, isCreditModalVisible }) => {
  const { state } = useContext(StateContext);


  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={isCreditModalVisible}
      onRequestClose={() => toggleModal('creditModalClose')}
    >
      <SafeAreaView style={styles.creditModalOverlay}>
        <View style={styles.container}>
          <Text>s</Text>
          <Swiper

              loop={false}
              style={styles.wrapper} showsButtons={true}>
            <View style={styles.slide}>
              <Text style={styles.text}>Slide 1</Text>
            </View>
            <View style={styles.slide}>
              <Text style={styles.text}>Slide 2</Text>
            </View>
            <View style={styles.slide}>
              <Text style={styles.text}>Slide 3</Text>
            </View>
          </Swiper>
        </View>
      </SafeAreaView>

    </Modal>
  );
};

const styles = StyleSheet.create({
  creditModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#afafd8',
  },
  container: {
    backgroundColor:'#333',
    width: '100%',
    height: '100%',
  },
  wrapper: {
    height: 200, // Swiper'ın yüksekliği
    backgroundColor: '#fff',
  },
  slide: {
    flex: 1,


  },
  text: {
    fontSize: 30,
    color: 'white',
  },


});

export default CreditModal;
