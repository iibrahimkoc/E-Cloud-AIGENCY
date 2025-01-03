import React, {useCallback, useContext, useState, useRef} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getViewChat } from '../mobil_api_fetch/GetViewChat';
import { postLogin } from '../mobil_api_fetch/PostLogin';
import { getAiTeamList } from '../mobil_api_fetch/GetAiTeamList';
import { getMyAccount } from '../mobil_api_fetch/GetMyAccount';
import { postRegister } from '../mobil_api_fetch/PostRegister';

import {StateContext} from '../context/StateContext';
import {ThemeContext} from '../context/ThemeContext';
import {storage} from '../components/Storage';


const LoginModal = ({toggleModal, loginModalVisible}) => {

  const { toggleState } = useContext( StateContext);
  const { isDarkTheme } = useContext(ThemeContext);
  const nameInputRef = useRef(null);
  const surnameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [loginOrSignIn, setLoginOrSignIn] = useState(true);

  const loginFunction = async (sendEmail, sendPassword) => {
    const loginData = await postLogin(sendEmail,sendPassword);
    if(loginData.status === true){
      storage.set('isLogined', true);
      storage.set('access_token', loginData.access_token);
      await toggleState('viewChat' ,await getViewChat(16));
      const aiTeamList = await getAiTeamList();
      toggleState('talkScreenData', []);
      toggleState('aiTeamList', aiTeamList);
      toggleState('selectedAi',aiTeamList.find((item) => item.id === 16));
      toggleState('myAccount', await getMyAccount());
      toggleModal('loginModalClose');
      setEmail('');
      setPassword('');
      setPasswordView(false);
      setEmailButtonView(true);
    }
  };

  const registerFunction = async (sendName, sendSurname,sendEmail, sendPassword) => {
    const registerData = await postRegister(sendName,sendSurname,sendEmail,sendPassword);
    if(registerData.status === true){
      storage.set('isLogined', true);
      storage.set('access_token', registerData.access_token);
      await toggleState('viewChat' ,await getViewChat(16));
      const aiTeamList = await getAiTeamList();
      toggleState('talkScreenData', []);
      toggleState('aiTeamList', aiTeamList);
      toggleState('selectedAi',aiTeamList.find((item) => item.id === 16));
      toggleState('myAccount', await getMyAccount());
      toggleModal('loginModalClose');
      setEmail('');
      setPassword('');
      setPasswordView(false);
      setEmailButtonView(true);
    }
  };
  const handleChangeName = useCallback((text) => {
    setName(text);
  }, []);

  const handleChangeSurname = useCallback((text) => {
    setSurname(text);
  }, []);

  const handleChangeMail = useCallback((text) => {
    setEmail(text);
  }, []);

  const handleChangePassword = useCallback((text) => {
    setPassword(text);
  }, []);

  const [emailButtonView, setEmailButtonView] = useState(true);
  const [passwordView, setPasswordView] = useState(false);
  const controlMail = async (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Geçersiz Email', 'Lütfen geçerli bir mail adresi giriniz.');
      return;
    }
    setEmailButtonView(false);
    setPasswordView(true);
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 100);

  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={loginModalVisible}
    >
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={passwordView ? -50 : -90} style={{flex: 1,}}>
        <View style={[styles.container, isDarkTheme ? styles.containerDarkTheme : styles.containerLightTheme]}>
          <View style={styles.inputContainer}>
            {!loginOrSignIn && (
              <View style={{width:'100%',alignItems:'center'}}>
                <View style={styles.inputBox}>
                  <TextInput
                    ref={nameInputRef}
                    placeholder={'İsim'}
                    keyboardType='ascii-capable'
                    placeholderTextColor={isDarkTheme ? 'rgba(255,255,255,0.5)' : '#000'}
                    style={[styles.input,{display: passwordView ? 'flex' : 'none', color: isDarkTheme ? '#fff' : '#000'} , isDarkTheme ? styles.inputDarkTheme : styles.inputLightTheme]}
                    onChangeText={handleChangeName}
                    autoCapitalize="none"
                    textContentType="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={() => surnameInputRef.current.focus()}
                    autoComplete="off"
                  />
                </View>

                <View style={styles.inputBox}>
                  <TextInput
                    ref={surnameInputRef}
                    placeholder={'Soyisim'}
                    keyboardType='ascii-capable'
                    placeholderTextColor={isDarkTheme ? 'rgba(255,255,255,0.5)' : '#000'}
                    style={[styles.input,{display: passwordView ? 'flex' : 'none', color: isDarkTheme ? '#fff' : '#000'} , isDarkTheme ? styles.inputDarkTheme : styles.inputLightTheme]}
                    onChangeText={handleChangeSurname}
                    autoCapitalize="none"
                    textContentType="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={()=>loginFunction(email,password)}
                    autoComplete="off"
                  />
                </View>
              </View>
            )}
            <View style={styles.inputBox}>
              <TextInput
                placeholder={'Email'}
                keyboardType='email-address'
                placeholderTextColor={isDarkTheme ? 'rgba(255,255,255,0.5)' : '#000'}
                style={[styles.input,{color: isDarkTheme ? '#fff' : '#000'}, isDarkTheme ? styles.inputDarkTheme : styles.inputLightTheme]}
                onChangeText={handleChangeMail}
                autoFocus={true}
                autoCapitalize="none"
                textContentType="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => controlMail(email)}
                autoComplete="off"
              />
              <TouchableOpacity
                style={[styles.inputBoxButton,{display: emailButtonView ? 'flex' : 'none'}, isDarkTheme ? styles.inputBoxButtonDarkTheme : styles.inputBoxButtonLightTheme ]}
                onPress={()=> {
                  controlMail(email);
                }}>
                <Image style={styles.inputBoxButtonIcon} source={isDarkTheme ? require('../assets/images/arrowRightDark.png') : require('../assets/images/arrowRightLight.png')}/>
              </TouchableOpacity>
            </View>
            <View style={styles.inputBox}>
              <TextInput
                ref={passwordInputRef}
                keyboardType='default'
                placeholder={'Şifre'}
                placeholderTextColor={isDarkTheme ? 'rgba(255,255,255,0.5)' : '#000'}
                style={[styles.input,{display: passwordView ? 'flex' : 'none', color: isDarkTheme ? '#fff' : '#000'} , isDarkTheme ? styles.inputDarkTheme : styles.inputLightTheme]}
                onChangeText={handleChangePassword}
                autoCapitalize="none"
                textContentType="none"
                autoCorrect={false}
                returnKeyType="go"
                onSubmitEditing={()=>loginFunction(email,password)}
                autoComplete="off"
              />
            </View>

            {loginOrSignIn ? (
              <View style={styles.inputBox}>
                <TouchableOpacity style={[styles.button, {display: passwordView ? 'flex' : 'none'}, isDarkTheme ? styles.buttonDarkTheme : styles.buttonLightTheme]} onPress={() => loginFunction(email, password)}>
                  <Text style={[styles.buttonText, isDarkTheme ? styles.buttonTextDarkTheme : styles.buttonTextLightTheme]}>Giriş yap</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inputBox}>
                <TouchableOpacity style={[styles.button, {display: passwordView ? 'flex' : 'none'}, isDarkTheme ? styles.buttonDarkTheme : styles.buttonLightTheme]} onPress={() => registerFunction(name, surname,email, password)}>
                  <Text style={[styles.buttonText, isDarkTheme ? styles.buttonTextDarkTheme : styles.buttonTextLightTheme]}>Kayıt ol</Text>
                </TouchableOpacity>
              </View>
            )}

            {passwordView ? (loginOrSignIn ? (
              <View>
                <Text
                  onPress={() => {
                    setLoginOrSignIn(false);

                  }}
                  style={{color: isDarkTheme ? 'white' : 'black' }}>Yeni hesap oluştur</Text>
              </View>
            ) : (
              <View>
                <Text
                  onPress={() => {
                    setLoginOrSignIn(true);
                  }}
                  style={{color: isDarkTheme ? 'white' : 'black' }}>Zaten hesabım var</Text>
              </View>
            )): ''}


          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  containerDarkTheme: {
    backgroundColor: '#070710',
  },
  containerLightTheme: {
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
  },
  inputBox: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#78adc1',
    width: '100%',
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  inputDarkTheme: {
    backgroundColor: '#070710',
    borderColor: '#fff',
  },
  inputLightTheme: {
    backgroundColor: '#fff',
    borderColor: '#070710',
  },
  inputBoxButton: {
    width: 50,
    height: 50,
    borderRadius: 5,
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBoxButtonDarkTheme: {
    backgroundColor: '#fff',
  },
  inputBoxButtonLightTheme: {
    backgroundColor: '#000',
  },
  inputBoxButtonIcon: {
    width: 30,
    height: 30,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDarkTheme: {
    backgroundColor: '#fff',
  },
  buttonLightTheme: {
    backgroundColor: '#000',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextDarkTheme: {
    color: '#000',
  },
  buttonTextLightTheme: {
    color: '#fff',
  },
});

export default LoginModal;



