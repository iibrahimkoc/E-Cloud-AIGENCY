import React, {useContext} from 'react';
import {View, Text, StyleSheet,SectionList, TextInput, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import { ThemeContext } from '../context/ThemeContext';
import { StateContext } from '../context/StateContext';
import { storage } from './Storage';

import MathView from 'react-native-math-view';

import { postResumeChat } from '../mobil_api_fetch/PostResumeChat';

const CustomRightDrawer = ({navigation}) => {

  const { state, toggleState } = useContext(StateContext);
  const { isDarkTheme } = useContext(ThemeContext);

  const renderMessageItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          toggleState('talkScreenData', await postResumeChat(item.chat_id));
          navigation.closeDrawer();
        }}
        key={item.chat_id}
        style={[
          styles.lastChat,
          {backgroundColor: isDarkTheme ? '#0F1021' : 'rgb(239,239,254)'},
        ]}>
        <Text numberOfLines={1} style={styles.lastChatText}>
          {item.chat_name}
        </Text>
      </TouchableOpacity>
    );
  };


  const data = [
    {
      title: 'Bugün',
      data: state.viewChat?.today,
    },
    {
      title: 'Dün',
      data: state.viewChat?.yesterday,
    },
    {
      title: 'Son 7 Gün',
      data: state.viewChat?.last7day,
    },
  ];
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, isDarkTheme ? styles.containerDarkTheme : styles.containerLightTheme]}>
      <View style={styles.containerBox}>
        <View style={[styles.searchBox, isDarkTheme ? styles.searchBoxDarkTheme : styles.searchBoxLightTheme]}>
          <View style={styles.searchIconBox}>
            <Image
              style={styles.searchIcon}
              source={require('../assets/images/search.png')}></Image>
          </View>
          <TextInput
            style={styles.input}
            placeholder={'Burada arayın...'}
            placeholderTextColor={'#7476AA'}
          />
        </View>

        <SafeAreaView style={{flex:1}} edges={['bottom']}>
          {storage.getBoolean('isLogined') && (
            <SectionList
              sections={data.filter(section => section.data.length !== 0)}  // Boş verileri filtrele
              keyExtractor={(item, index) => index.toString()}
              stickySectionHeadersEnabled={false}
              renderItem={renderMessageItem}
              renderSectionHeader={({ section: { title } }) => (
                <View>
                  <View style={[styles.stick, isDarkTheme ? styles.stickDarkTheme : styles.stickLightTheme]} />
                  <Text style={[styles.renderItemHeader, isDarkTheme ? styles.renderItemHeaderDarkTheme : styles.renderItemHeaderLightTheme]}>{title}</Text>
                </View>
              )}
              ListFooterComponent={<View style={{height: 20}}></View>}
            />
          )}
        </SafeAreaView>
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
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
  },
  searchBox: {
    marginVertical: 10,
    width: '100%',
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  searchBoxDarkTheme: {
    borderColor: '#201F27',
  },
  searchBoxLightTheme: {
    borderColor: 'rgb(211,213,215)',
  },
  searchIconBox:{
    width: 30,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  searchIcon: {
    width: 25,
    height: 25,
  },
  input: {
    flex: 1,
    height: '100%',
    color: 'white',
    fontSize: 16,
  },
  stick: {
    width: '100%',
    height: 1,
    marginVertical: 10,
  },
  stickDarkTheme: {
    backgroundColor: '#201F27',
  },
  stickLightTheme: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  renderItemHeader: {
    fontSize: 18,
    fontWeight: 700,
    marginVertical: 4,
    marginLeft: 8,
  },
  renderItemHeaderDarkTheme: {
    color: '#CCCEEF',
  },
  renderItemHeaderLightTheme: {
    color: '#000000',
  },


  dateHeaderBox: {
    paddingLeft: 10,
    marginBottom: 10,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: '700',
  },
  dateHeaderDarkTheme: {
    color: '#fff',
  },
  dateHeaderLightTheme: {
    color: '#000',
  },
  lastChat: {
    width: '100%',
    height: 45,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 3
  },
  lastChatText: {
    fontSize: 17,
    color: '#7476AA',
  }
});
export default CustomRightDrawer;
