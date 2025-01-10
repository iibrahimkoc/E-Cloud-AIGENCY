import React, {useCallback, useContext, useState, useRef, useEffect} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Keyboard,
  Platform,
  Text,
  ImageBackground,
  TextInput, TouchableNativeFeedback,
  TouchableOpacity,
  View, ActivityIndicator, SafeAreaView,
} from 'react-native';

import { getViewChat } from '../mobil_api_fetch/GetViewChat';
import { postLogin } from '../mobil_api_fetch/PostLogin';
import { getAiTeamList } from '../mobil_api_fetch/GetAiTeamList';
import { getMyAccount } from '../mobil_api_fetch/GetMyAccount';
import { postRegister } from '../mobil_api_fetch/PostRegister';

import {StateContext} from '../context/StateContext';
import {ThemeContext} from '../context/ThemeContext';
import {storage} from '../components/Storage';
import LinearGradient from "react-native-linear-gradient";
import {getPricingList} from "../mobil_api_fetch/GetPricingList";

const LoginModal = ({toggleModal, loginModalVisible}) => {

  const { toggleState } = useContext( StateContext);
  const { isDarkTheme } = useContext(ThemeContext);
  const nameInputRef = useRef(null);
  const surnameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [activeIndicator, setActiveIndicator] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [loginOrSignIn, setLoginOrSignIn] = useState(true);
  const [wrongLogin, setWrongLogin] = useState(false);


  const controlFunc = async (email, password, name, surname) => {
    if(String(email).trim() === '' || String(password).trim() === '' || String(name).trim() === '' || String(surname).trim() === '') {
      setActiveIndicator(false);
      return true;
    }
    if(await controlMail(email)){
      setActiveIndicator(false);
      return true;
    }
  }
  const loginFunction = async (sendEmail, sendPassword) => {
    if(await controlFunc(sendEmail, sendPassword)) {
      console.log('Sending email');
      return;
    }
    console.log('Sending1 email');
    const loginData = await postLogin(sendEmail,sendPassword);
    if(loginData.status === true){
      storage.set('isLogined', true);
      storage.set('access_token', String(loginData.access_token));
      const aiTeamList = await getAiTeamList();
      await toggleState('viewChat' ,await getViewChat(aiTeamList[0].id));
      toggleState('talkScreenData', []);
      toggleState('aiTeamList', aiTeamList);
      toggleState('selectedAi',aiTeamList[0]);
      storage.set('selectedAi',JSON.stringify(aiTeamList[0]));
      toggleState('myAccount', await getMyAccount());
      toggleState('pricingList',await getPricingList());
      toggleModal('loginModalClose');
      setEmail('');
      setPassword('');
      setActiveIndicator(false);
      setWrongLogin(false);
    }
    else{
      setWrongLogin(true);
      setActiveIndicator(false);
    }
  };

  const registerFunction = async (sendName, sendSurname, sendEmail, sendPassword) => {
    if(await controlFunc(sendEmail, sendPassword, sendName, sendSurname)) {
      console.log('Sending email');
      return;
    }
    console.log('Sending1 email');
    const registerData = await postRegister(sendName,sendSurname,sendEmail,sendPassword);
    console.log("gelen data: ",registerData);
    if(registerData.status === true){
      storage.set('isLogined', true);
      storage.set('access_token', String(registerData.access_token));
      const aiTeamList = await getAiTeamList();
      await toggleState('viewChat' ,await getViewChat(aiTeamList[0].id));
      toggleState('pricingList',await getPricingList());
      toggleState('talkScreenData', []);
      toggleState('aiTeamList', aiTeamList);
      toggleState('selectedAi',aiTeamList[0]);
      storage.set('selectedAi',JSON.stringify(aiTeamList[0]));
      toggleState('myAccount', await getMyAccount());
      toggleModal('loginModalClose');
      setName('');
      setSurname('');
      setEmail('');
      setPassword('');
      setActiveIndicator(false);
    }
    else{

      setActiveIndicator(false);
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

  const controlMail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Geçersiz Email', 'Lütfen geçerli bir mail adresi giriniz.');
      return true;
    }
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={loginModalVisible}
    >
      <TouchableNativeFeedback onPress={() => toggleModal('loginModalClose')}>
        <View style={[styles.container1, { backgroundColor: isDarkTheme ? '#0F1021' : 'white' }]}>
          <TouchableNativeFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                //keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
              <SafeAreaView>

              </SafeAreaView>
              <View
                  style={styles.container}
              >
                <LinearGradient
                    colors={
                      isDarkTheme ? ["#070710", "#070710"] : ["#e4dfeb",  "#e4dfeb"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.registrationBox}
                >
                  <Text
                      style={[
                        styles.subtitle,
                        { color: isDarkTheme ? "#7376aa" : "#7376aa" },
                      ]}
                  >
                    {
                      loginOrSignIn
                          ? 'Giriş Yap'
                          : 'Kayıt ol'
                    }
                  </Text>
                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                    width: "100%",
                  }}>
                    <View style={styles.lineContainer}>
                      <LinearGradient
                          colors={
                            isDarkTheme
                                ? ["#0F1021", "#410093", "#0F1021"]
                                : ["#e4dfeb", "#7130c3", "#e4dfeb"]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.line}
                      />
                    </View>
                  </View>

                  <View style={{
                    flexDirection: "row",
                    marginBottom: 5,
                    width: "100%",
                    display: wrongLogin ? 'flex' : 'none',
                  }}>
                    <Text style={{ color: '#d1001b',fontWeight: 600}}>*Hata giriş bilgisi*</Text>
                  </View>

                  {
                      !loginOrSignIn &&
                      <>
                        <View style={[styles.inputContainer, {borderColor: isDarkTheme ? '#7376aa': 'black'}]}>
                          <Image style={{width: 20, height:20}} source={require('../assets/images/user.png')}/>
                          <TextInput
                              ref={nameInputRef}
                              placeholder={'İsim'}
                              keyboardType='ascii-capable'
                              placeholderTextColor={isDarkTheme ? "#7376aa" : "#7376aa"}
                              style={[styles.input,{color: isDarkTheme ? '#fff' : '#000'} , isDarkTheme ? styles.inputDarkTheme : styles.inputLightTheme]}
                              onChangeText={handleChangeName}
                              autoCapitalize="none"
                              textContentType="none"
                              autoCorrect={false}
                              returnKeyType="next"
                              onSubmitEditing={() => surnameInputRef.current.focus()}
                              autoComplete="off"
                          />
                        </View>
                        <View style={[styles.inputContainer, {borderColor: isDarkTheme ? '#7376aa': 'black'}]}>
                          <Image style={{width: 20, height:20}} source={require('../assets/images/user.png')}/>
                          <TextInput
                              ref={surnameInputRef}
                              placeholder={'Soyisim'}
                              keyboardType='ascii-capable'
                              placeholderTextColor={isDarkTheme ? "#7376aa" : "#7376aa"}
                              style={[styles.input, {color: isDarkTheme ? '#fff' : '#000'} , isDarkTheme ? styles.inputDarkTheme : styles.inputLightTheme]}
                              onChangeText={handleChangeSurname}
                              autoCapitalize="none"
                              textContentType="none"
                              autoCorrect={false}
                              returnKeyType="next"
                              onSubmitEditing={()=> emailInputRef.current.focus()}
                              autoComplete="off"
                          />
                        </View>
                      </>
                  }
                  <View style={[styles.inputContainer, {borderColor: isDarkTheme ? '#7376aa': 'black'}]}>
                    <Image style={{width: 20, height:20}} source={require('../assets/images/mail.png')}/>
                    <TextInput
                        ref={emailInputRef}
                        placeholder={'Email'}
                        keyboardType='email-address'
                        placeholderTextColor={isDarkTheme ? "#7376aa" : "#7376aa"}
                        style={[styles.input,{color: isDarkTheme ? '#fff' : '#000'}, isDarkTheme ? styles.inputDarkTheme : styles.inputLightTheme]}
                        onChangeText={handleChangeMail}
                        autoFocus={true}
                        autoCapitalize="none"
                        textContentType="none"
                        onFocus={() => emailInputRef.current.focus()}
                        autoCorrect={false}
                        returnKeyType="next"
                        autoComplete="off"
                    />
                  </View>
                  <View style={[styles.inputContainer, {borderColor: isDarkTheme ? '#7376aa': 'black'}]}>
                    <Image style={{width: 20, height:20}} source={require('../assets/images/lock.png')}/>
                    <TextInput
                        ref={passwordInputRef}
                        keyboardType='default'
                        placeholder={'Şifre'}
                        placeholderTextColor={isDarkTheme ? "#7376aa" : "#7376aa"}
                        style={[styles.input,{ color: isDarkTheme ? '#fff' : '#000'} , isDarkTheme ? styles.inputDarkTheme : styles.inputLightTheme]}
                        onChangeText={handleChangePassword}
                        autoCapitalize="none"
                        textContentType="none"
                        autoCorrect={false}
                        returnKeyType="go"
                        onSubmitEditing={()=> loginFunction(email,password)}
                        autoComplete="off"
                        secureTextEntry={true}
                    />
                  </View>

                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 15,
                    width: "100%",

                  }}>
                    <TouchableOpacity
                        disabled={activeIndicator ? true : false}
                        style={styles.button}
                        onPress={() => {
                          setActiveIndicator(true);
                          loginOrSignIn
                              ? loginFunction(email,password)
                              : registerFunction(name,surname,email,password);
                        }}
                    >
                      <LinearGradient
                          colors={["#dd00ac", "#7130c3", "#410093"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.gradientButton}
                      >
                        {
                          activeIndicator
                              ? <ActivityIndicator size={'small'} color="#fff" />

                              : <Text style={styles.buttonText}>{
                                loginOrSignIn
                                    ? 'Giriş Yap'
                                    : 'Kayıt Ol'
                              }</Text>
                        }
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>



                  <TouchableOpacity
                      onPress={() => setLoginOrSignIn(!loginOrSignIn)}>
                    <Text style={styles.linkText}>
                      {
                        loginOrSignIn
                            ? 'Hesabınız yok mu? '
                            : 'Zaten kayıtlı mısınız? '
                      }
                      <Text style={[styles.loginLink,  { color: isDarkTheme ? "#7130c3" : "#410093" },]}>{
                        loginOrSignIn
                            ? 'Kayıt Ol'
                            : 'Giriş Yap'
                      }</Text>
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </KeyboardAvoidingView>
          </TouchableNativeFeedback>
        </View>
      </TouchableNativeFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  registrationBox: {
    width: "90%",
    padding: 20,
    borderRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: "100%",
    borderWidth: 1,
    padding: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 0,
    width: "100%",
  },
  gradientButton: {
    borderRadius: 8,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  linkText: {
    color: "#7376aa",
    fontSize: 14,
    marginTop: 15,
  },
  loginLink: {
    textDecorationLine: "underline",
  },
});

export default LoginModal;
