import React, {useCallback, useContext, useState, useRef, useEffect} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Keyboard,
  Text,
  ImageBackground,
  TextInput, TouchableNativeFeedback,
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
import LinearGradient from "react-native-linear-gradient";

const LoginModal = ({toggleModal, loginModalVisible}) => {

  const { toggleState } = useContext( StateContext);
  const { isDarkTheme } = useContext(ThemeContext);
  const nameInputRef = useRef(null);
  const surnameInputRef = useRef(null);
  const emailInputRef = useRef(null);
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
        <View style={styles.container1}>
          <TouchableNativeFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
              <View style={styles.container}>
                <ImageBackground
                    source={require("../assets/images/Registration.jpg")}
                    style={styles.topSection}
                    imageStyle={styles.imageStyle}
                >
                  <View style={styles.overlay}></View>
                </ImageBackground>

                <View
                    style={[
                      styles.bottomSection,
                    ]}
                >
                  <Text style={styles.subtitle}>{
                    loginOrSignIn
                        ? 'Giriş Yap'
                        : 'Kayıt ol'
                  }</Text>
                  <View style={styles.lineContainer}>
                    <LinearGradient
                        colors={["#0d0e22", "#443a87", "#0d0e22"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.line}
                    />
                  </View>

                  {
                    !loginOrSignIn &&
                      <>
                        <View style={styles.inputContainer}>
                        <TextInput
                            ref={nameInputRef}
                            placeholder={'İsim'}
                            keyboardType='ascii-capable'
                            placeholderTextColor={isDarkTheme ? 'rgba(255,255,255,0.5)' : '#000'}
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
                        <View style={styles.inputContainer}>
                          <TextInput
                              ref={surnameInputRef}
                              placeholder={'Soyisim'}
                              keyboardType='ascii-capable'
                              placeholderTextColor={isDarkTheme ? 'rgba(255,255,255,0.5)' : '#000'}
                              style={[styles.input,{color: isDarkTheme ? '#fff' : '#000'} , isDarkTheme ? styles.inputDarkTheme : styles.inputLightTheme]}
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
                  <View style={styles.inputContainer}>
                    <TextInput
                        ref={emailInputRef}
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
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                        ref={passwordInputRef}
                        keyboardType='default'
                        placeholder={'Şifre'}
                        placeholderTextColor={isDarkTheme ? 'rgba(255,255,255,0.5)' : '#000'}
                        style={[styles.input,{ color: isDarkTheme ? '#fff' : '#000'} , isDarkTheme ? styles.inputDarkTheme : styles.inputLightTheme]}
                        onChangeText={handleChangePassword}
                        autoCapitalize="none"
                        textContentType="none"
                        autoCorrect={false}
                        returnKeyType="go"
                        onSubmitEditing={()=>loginFunction(email,password)}
                        autoComplete="off"
                        secureTextEntry={true}
                    />
                  </View>

                  <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
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
                      <Text style={styles.buttonText}>{
                        loginOrSignIn
                          ? 'Giriş Yap'
                          : 'Kayıt Ol'
                      }</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setLoginOrSignIn(!loginOrSignIn)}>
                    <Text style={styles.linkText}>

                      {
                        loginOrSignIn
                          ? 'Hesabınız yok mu? '
                          : 'Zaten kayıtlı mısınız? '
                      }
                      <Text style={styles.loginLink}>{
                        loginOrSignIn
                          ? 'Kayıt Ol'
                          : 'Giriş Yap'
                      }</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: "#0f1021",
  },
  topSection: {
    height: "68%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#0f1021",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "68%",
    shadowColor: "#0f1021",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  subtitle: {
    marginBottom: 10,
    fontSize: 25,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  lineContainer: {
    height: 2,
    width: "90%",
    marginBottom: 20,
  },
  line: {
    height: "100%",
    borderRadius: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: "95%",
    borderWidth: 1,
    borderColor: "#272838",
    padding: 5,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  button: {
    width: "90%",
    marginTop: 20,
  },
  gradientButton: {
    borderRadius: 8,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "#7376aa",
    fontSize: 14,
    marginTop: 15,
  },
  loginLink: {
    color: "#ccceef",
    textDecorationLine: "underline",
  },
});

export default LoginModal;



