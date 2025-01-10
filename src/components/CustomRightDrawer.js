import React, {useCallback, useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView, Keyboard, Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import { ThemeContext } from '../context/ThemeContext';
import { StateContext } from '../context/StateContext';
import { storage } from './Storage';

import LinearGradient from 'react-native-linear-gradient';

import { postResumeChat } from '../mobil_api_fetch/PostResumeChat';

const CustomRightDrawer = ({navigation}) => {

  const [searchText, setSearchText] = useState('');
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
        <Text
            numberOfLines={1}
            style={[styles.lastChatText, isDarkTheme ? styles.lastChatTextDarkTheme : styles.lastChatTextLightTheme]}>
          {item.chat_name}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleChangeSearchText = useCallback((item) => {
    setSearchText(item);
  },[])


  const data = [
    {
      title: 'Bugün',
      data: state.viewChat?.today?.filter(item => item.chat_name.toLowerCase().includes(searchText.toLowerCase())),
    },
    {
      title: 'Dün',
      data: state.viewChat?.yesterday?.filter(item => item.chat_name.toLowerCase().includes(searchText.toLowerCase())),
    },
    {
      title: 'Son 7 Gün',
      data: state.viewChat?.last7day?.filter(item => item.chat_name.toLowerCase().includes(searchText.toLowerCase())),
    },
  ];
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView
            edges={['top']}
            style={[styles.container, isDarkTheme ? styles.containerDarkTheme : styles.containerLightTheme]}>
          <View style={styles.containerBox}>
            <LinearGradient
                colors={["#dd00ac", "#7130c3", "#410093"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientSearchContainer}

            >
              <View style={{flex:1, backgroundColor: isDarkTheme ? "#070710" : "#fff",borderRadius:8,flexDirection: "row"}}>
                <View style={styles.searchIconBox}>
                  <Image
                      style={styles.searchIcon}
                      source={require('../assets/images/search.png')}></Image>
                </View>
                <TextInput
                    style={[styles.input, {color: isDarkTheme ?  '#fff' : '#000' }]}
                    placeholder={'Burada arayın...'}
                    placeholderTextColor={'#7476AA'}
                    value={searchText}
                    onChangeText={handleChangeSearchText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                />
              </View>
            </LinearGradient>

            <SafeAreaView style={{flex:1}} edges={['bottom']}>
              {storage.getBoolean('isLogined') && (
                  <SectionList
                      sections={data.filter(section => section.data.length !== 0)}  // Boş verileri filtrele
                      keyExtractor={(item, index) => index.toString()}
                      stickySectionHeadersEnabled={false}
                      renderItem={renderMessageItem}
                      renderSectionHeader={({ section: { title } }) => (
                          <TouchableWithoutFeedback>
                            <View>
                              <View style={[styles.stick, isDarkTheme ? styles.stickDarkTheme : styles.stickLightTheme]} />
                              <Text style={[styles.renderItemHeader, isDarkTheme ? styles.renderItemHeaderDarkTheme : styles.renderItemHeaderLightTheme]}>{title}</Text>
                            </View>
                          </TouchableWithoutFeedback>
                      )}
                      ListFooterComponent={<View style={{height: 20}}></View>}
                  />
              )}
            </SafeAreaView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10,
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
  gradientSearchContainer: {
    height: 50,
    flexDirection: "row",
    borderRadius: 10,
    padding: 2,
    width: "100%",
    alignSelf: "center",
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
    width: 25,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  searchIcon: {
    width: 25,
    height: 25,
  },
  input: {
    flex: 1,
    height: '100%',
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
    color: '#fff',
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
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 5
  },
  lastChatText: {
    width: '100%',
    fontSize: 15,
  },
  lastChatTextDarkTheme: {
    color: '#ede3e3',
  },
  lastChatTextLightTheme: {
    color: '#000000',

  }
});
export default CustomRightDrawer;
