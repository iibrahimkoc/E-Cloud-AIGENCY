import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';

import { StateContext } from '../context/StateContext';
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
      <View style={styles.creditModalOverlay}>
        <Text
          onPress={() => toggleModal('creditModalClose')}
          style={{
            color: 'white',
            fontWeight: '600',
            position: 'absolute',
            top: 100,
            zIndex: 100,
          }}
        >
          KAPAT
        </Text>
        <View style={styles.container}>


        </View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  creditModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#070710',
  },
  container: {
    flex: 1,
  },
  page: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  indicator: {
    height: 7,
    width: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    margin: 5,
  },
  fixedButton1: {
    position: 'absolute',
    bottom: 50,
    width: '80%',
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  fixedButton2: {
    position: 'absolute',
    bottom: 120,
    width: '80%',
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreditModal;
