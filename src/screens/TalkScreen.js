import React, {useContext, useRef, useState, useCallback, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Keyboard,
    StyleSheet,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {ThemeContext} from '../context/ThemeContext';
import {StateContext} from '../context/StateContext';
import {storage} from '../components/Storage';

import DocumentPicker from 'react-native-document-picker';
import MathView, { MathText } from 'react-native-math-view';

import { postNewChat } from '../mobil_api_fetch/PostNewChat';
import { postSendMessage } from '../mobil_api_fetch/PostSendMessage';
import { postPublicNewChat } from '../genel_api_fetch/PostPublicNewChat';
import { postPublicSendMessage } from '../genel_api_fetch/PostPublicSendMessage';

import SyntaxHighlighter from 'react-native-syntax-highlighter';
import {atomOneDark } from 'react-syntax-highlighter/styles/hljs';
const codeBlogThema = atomOneDark;


const TalkScreen = ({navigation, toggleModal}) => {
    console.log("bak ba",toggleModal);

    const { state, toggleState } = useContext(StateContext);
    const { isDarkTheme } = useContext(ThemeContext);
    const [message, setMessage] = useState('');
    const flatListRef = useRef(null);
    const inset = useSafeAreaInsets();
    console.log(inset);


    const textCustomization = (text) => {
        const regex = /(\*\*.*?\*\*|\\\[.*?\\\]|\\\(.*?\\\))/g;
        const parts = text.split(regex);
        return parts.map((part, index) => {
            if (/\*\*.*?\*\*/.test(part)) {
                const boldText = part.replace(/\*\*/g, '');
                return (
                  <Text key={index} style={{ fontWeight: 'bold' }}>
                      {boldText}
                  </Text>
                );
            }
            else if (/\\\[.*?\\\]|\\\(.*?\\\)/.test(part)) {
                const mathContent = part.replace(/\\[\[\]()]/g, '');
                return (
                  <MathView key={index} math={mathContent} />
                );
            }
            else {
                return (
                  <Text key={index}>
                      {part}
                  </Text>
                );
            }
        });
    };


    const renderTalkData = ({item}) =>{
        if(item.content.includes('```')){
            const parts = item.content.split(/```/);
            return (
              <LinearGradient
                key={item.id}
                colors={isDarkTheme ? ['#272350','#0F1021'] : ['rgb(215,214,244)','rgb(246,248,250)']}
                start={{x: 0,y: 0}} end={{x: 1,y: 0.5}}
                style={styles.talkBoxContainerBoxAiChat}
              >
                  <View style={styles.talkBoxContainerBoxAiChatLogoBox}>
                      <Image style={styles.talkBoxContainerBoxAiChatLogo} source={require('../assets/images/appLogo.png')} />
                  </View>
                  <View style={styles.talkBoxContainerBoxAiChatMessageBox}>
                      {
                          parts.map((part, index) => {
                              const isCode = index % 2 === 1;

                              if (isCode) {
                                  const kelimeler = part.split('\n');
                                  const codeLanguage = part.split('\n',1);
                                  console.log(codeLanguage)
                                  kelimeler.shift();
                                  const newCode = kelimeler.join("\n")

                                  return (
                                    <View key={index} style={styles.codeContainer}>
                                        <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: "center", gap: 50, height: 35,backgroundColor: "rgb(66,74,87)",paddingHorizontal: 8,borderTopRightRadius: 5,borderTopLeftRadius:5}}>
                                            <Text style={{color: "white",fontWeight: "bold"}}>{String(codeLanguage).toUpperCase()}</Text>
                                            <TouchableOpacity
                                              style={{display: 'none',borderWidth: 2,borderColor: "rgb(33,37,52)",borderRadius: 5, backgroundColor:"rgb(33,37,52)",padding: 3,paddingHorizontal: 5, alignItems: "center",justifyContent:"center"}}>
                                                <Text style={{color: "white"}}>Kodu kopyala</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <SyntaxHighlighter
                                          language={String(codeLanguage).toLowerCase()}
                                          style={codeBlogThema}
                                        >
                                            {newCode}
                                        </SyntaxHighlighter>
                                    </View>
                                  );
                              }
                              else {
                                  return (
                                    <Text key={index} style={[isDarkTheme ? styles.talkBoxContainerBoxAiChatMessageDarkTheme : styles.talkBoxContainerBoxAiChatMessageLightTheme]}>{textCustomization(part)}</Text>
                                  );
                              }
                          })
                      }
                  </View>

              </LinearGradient>
            );
        }
        else{
            if(item.role === 'assistant'){
                return (
                  <LinearGradient
                    key={item.id}
                    colors={isDarkTheme ? ['#272350','#0F1021'] : ['rgb(215,214,244)','rgb(246,248,250)']}
                    start={{x: 0,y: 0}} end={{x: 1,y: 0.5}}
                    style={[styles.talkBoxContainerBoxAiChat]}
                  >
                      {
                          !(item.type === 'image_url' || item.content.includes('.png')) &&
                        (
                          <View style={styles.talkBoxContainerBoxAiChatLogoBox}>
                              <Image style={styles.talkBoxContainerBoxAiChatLogo} source={require('../assets/images/appLogo.png')} />
                          </View>
                        )

                      }
                      <View style={[styles.talkBoxContainerBoxAiChatMessageBox, {paddingTop: item.type === 'image_url' ? 0 : 5}]}>
                          {
                              (item.type === 'image_url' || item.content.includes('.png')) ? (
                                <Image
                                  style={{flex:1, aspectRatio:1, borderRadius: 6, backgroundColor :'transparent', borderWidth: 1}}
                                  source={{ uri: `https://aigency.dev/api/image?fileName=${item.content}`}}
                                />
                              ) : (
                                <Text style={[isDarkTheme ? styles.talkBoxContainerBoxAiChatMessageDarkTheme : styles.talkBoxContainerBoxAiChatMessageLightTheme]}>{textCustomization(item.content)}</Text>
                              )
                          }
                      </View>
                  </LinearGradient>
                );
            }
            else {
                return (
                  <View
                    key={item.id}
                    style={styles.talkBoxContainerBoxUserChat}
                  >
                      <View style={[styles.talkBoxContainerBoxUserChatBox, isDarkTheme ? styles.talkBoxContainerBoxUserChatBoxDarkTheme : styles.talkBoxContainerBoxUserChatBoxLightTheme]}>
                          <Text style={[isDarkTheme ? styles.talkBoxContainerBoxAiChatMessageDarkTheme : styles.talkBoxContainerBoxAiChatMessageLightTheme]}>{item.content}</Text>
                      </View>
                  </View>
                );
            }
        }
    };

    const isNewChat = async () => {
        return state.talkScreenData.length === 0 ? true : false;
    };

    const myMessageAdd = async (myMessage) => {
        let talkScreenData = state.talkScreenData;
        let talkScreenMessages = talkScreenData.messages || [];
        let myMessageData =  {content : myMessage, role: 'user'};
        talkScreenMessages.push(myMessageData);
        talkScreenData.messages = talkScreenMessages;
        toggleState('talkScreenData', talkScreenData);
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };
    const assistantAnswerAdd = async (asnwer) => {
        let talkScreenData = state.talkScreenData;
        let talkScreenMessages = talkScreenData.messages;
        let assistantAnswerData = {content : asnwer, role: 'assistant'};
        talkScreenMessages.push(assistantAnswerData);
        talkScreenData.messages = talkScreenMessages;
        toggleState('talkScreenData', talkScreenData);
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const sendMessage = async (myMessage) => {
        if(!myMessage || myMessage.trim() === ''){
            return;
        }
        if(storage.getBoolean('isLogined') === true){
            if( await isNewChat() ) {
                setMessage('');
                let myMessageData  =  {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: '', messages: [{content: myMessage, role: 'user'}]};
                toggleState('talkScreenData', myMessageData);
                const newChatData =  await postNewChat(state.selectedAi.id);
                console.log(3383,selectedFiles);
                const assistantAnswer = selectedFiles.length > 0 ? await postSendMessage(myMessage.trim(), newChatData.chat_id, selectedFiles) :  await postSendMessage(myMessage.trim(), newChatData.chat_id,[]);
                let assistantAnswerData= assistantAnswer.message.includes('.png') ? {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: newChatData.chat_id, messages: [{content: myMessage, role: 'user'}, {content: assistantAnswer.message, role: 'assistant', type: 'image_url'}]} : {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: newChatData.chat_id, messages: [{content: myMessage, role: 'user'}, {content: assistantAnswer.message, role: 'assistant'}]};
                toggleState('talkScreenData', assistantAnswerData);
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
            else {
                await myMessageAdd(myMessage.trim());
                setMessage('');
                const assistantAnswer = selectedFiles.length > 0 ? await postSendMessage(myMessage.trim(),  state.talkScreenData.chat_id, selectedFiles) :  await postSendMessage(myMessage.trim(),  state.talkScreenData.chat_id,[]);
                await assistantAnswerAdd(assistantAnswer.message);
            }
        }
        else{
            if( await isNewChat() ) {
                storage.getNumber('publicViewChatCount') === undefined ? storage.set('publicViewChatCount', 1) : storage.set('publicViewChatCount', storage.getNumber('publicViewChatCount') + 1);
                console.log(storage.getNumber('publicViewChatCount'));
                if(storage.getNumber('publicViewChatCount') < 6) {
                    setMessage('');
                    let myMessageData  =  {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: '', messages: [{content: myMessage, role: 'user'}]};
                    toggleState('talkScreenData', myMessageData);
                    const newChatData = await postPublicNewChat();
                    const assistantAnswer = await postPublicSendMessage(myMessage.trim(), newChatData.chat_id);
                    let assistantAnswerData = assistantAnswer.message.includes('.png') ? {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: newChatData.chat_id, messages: [{content: myMessage, role: 'user'}, {content: assistantAnswer.message, role: 'assistant', type: 'image_url'}]} : {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: newChatData.chat_id, messages: [{content: myMessage, role: 'user'}, {content: assistantAnswer.message, role: 'assistant'}]};
                    toggleState('talkScreenData', assistantAnswerData);
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                }
                else{
                    toggleModal('popupLoginModalOpen');
                    console.log(storage.getNumber('publicViewChatCount'));
                }
            }
            else {
                await myMessageAdd(myMessage.trim());
                setMessage('');
                const assistantAnswer = await postPublicSendMessage(myMessage.trim(), state.talkScreenData.chat_id);
                await assistantAnswerAdd(assistantAnswer.message);
            }
        }
    };

    const resetTalkChatContent = () => {
        toggleState('talkScreenData',[]);
    };

    const [selectedFiles, setSelectedFiles] = useState([]);
    const openFolderFunction = async () => {
        try {
            const response = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                allowMultiSelection: true,
            });
            setSelectedFiles(response);
            console.log("bu dosya1", selectedFiles);
        }
        catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('Kullanıcı işlemi iptal etti');
            } else {
                console.log('Hata:', err.message);
            }
        }
    };


    const handleChange = useCallback((text) => {
        setMessage(text);
    }, []);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const [chatSettingBoxVisible, setChatSettingBoxVisible] = useState(false);
    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={-20} style={{flex:1}}>
          <SafeAreaView style={[styles.container, isDarkTheme ? styles.containerDarkTheme : styles.containerLightTheme]} edges={['top']}>
              <View style={[styles.header, {top: inset.top , backgroundColor: isDarkTheme ?  'rgba(7,7,16,0.9)' :  'rgba(255,255,255,0.9)'}]}>
                  <TouchableOpacity
                    style={styles.headerButtonBox}
                    onPress={() => navigation.getParent('LeftDrawer').openDrawer()}
                  >
                      <Image source={require('../assets/images/sidebar.png')} style={styles.headerButton}></Image>
                  </TouchableOpacity>
                  <View style={{position: 'relative'}}>
                      <TouchableOpacity onPress={() => {
                          if(storage.getBoolean('isLogined')) {
                              //setChatSettingBoxVisible(!chatSettingBoxVisible);
                          }
                      }}>
                          <Text style={[styles.title, isDarkTheme ? styles.titleDarkTheme : styles.titleLightTheme]}>{storage.getBoolean('isLogined') ? String(state.selectedAi?.name?.name_tr).toUpperCase() : 'ALPARSLAN'}</Text>
                      </TouchableOpacity>
                      {
                          chatSettingBoxVisible && (
                            <TouchableOpacity
                              activeOpacity={1}
                              style={{display: chatSettingBoxVisible ? 'flex' : 'none' ,width: 200, height: 200,borderRadius: 10,backgroundColor:'white', position: 'absolute',top: 50,borderWidth: 1,borderColor: 'grey'}}>
                                <View style={{flex:1}}>
                                    <TouchableOpacity style={{flex: 1,flexDirection: 'row',alignItems: 'center',paddingHorizontal: 7, gap: 7,backgroundColor:'lightgrey',borderTopLeftRadius: 10, borderTopRightRadius: 10,}}>
                                        <Image style={{width: 23, height: 23}} source={require('../assets/images/info.png')} />
                                        <Text>Karakter detayı</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flex: 1,flexDirection: 'row',alignItems: 'center',paddingHorizontal: 7, gap: 7,backgroundColor:'lightgrey',}}>
                                        <Image style={{width: 23, height: 23}} source={require('../assets/images/downloadButton.png')} />
                                        <Text>Karakter detayı</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flex: 1,flexDirection: 'row',alignItems: 'center',paddingHorizontal: 7, gap: 7,backgroundColor:'lightgrey',}}>
                                        <Image style={{width: 23, height: 23}} source={require('../assets/images/info.png')} />
                                        <Text>Karakter detayı</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flex: 1,flexDirection: 'row',alignItems: 'center',paddingHorizontal: 7, gap: 7,backgroundColor:'lightgrey',borderBottomLeftRadius: 10, borderBottomRightRadius: 10,}}>
                                        <Image style={{width: 23, height: 23}} source={require('../assets/images/info.png')} />
                                        <Text>Karakter detayı</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )
                      }
                  </View>
                  <TouchableOpacity
                    style={styles.headerButtonBox}
                    onPress={() => resetTalkChatContent()}
                  >
                      <Image source={require('../assets/images/add.png')} style={styles.headerButton}></Image>
                  </TouchableOpacity>
              </View>

              <View style={styles.talkBoxContainer}>
                  <View style={[styles.talkBoxContainerBox]}>

                      <FlatList
                        contentContainerStyle={{width:'100%',paddingHorizontal:'5%'}}
                        data={state.talkScreenData?.messages?.filter((item) => item.role === 'user' || item.role === 'assistant')}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderTalkData}
                        ref={flatListRef}
                        onContentSizeChange={() => {
                                flatListRef.current?.scrollToEnd({ animated: false });
                        }}
                        ListHeaderComponent={<View style={{ height: 60 + 15 }} />} // --> FlatList üst boşluğu
                        ListFooterComponent={<View style={{ height: inset.bottom + 52 + 24 }} />} // --> FlatList alt boşluğu
                      />
                  </View>
                  <SafeAreaView style={styles.inputBox}>
                          <LinearGradient
                            colors={['#C137BB', '#6C30B3']}
                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            style={{width: '100%', padding: 2, borderRadius: 6,marginBottom: 20}}>
                              <View style={[styles.textInputBox, isDarkTheme ? styles.textInputBoxDarkTheme : styles.textInputBoxLightTheme]}>
                                  <TouchableOpacity
                                    onPress={() => openFolderFunction()}
                                    style={styles.inputBoxAddIconBox}
                                  >
                                      <Image source={require('../assets/images/add.png')} style={styles.inputBoxAddIcon} />
                                  </TouchableOpacity>
                                  <TextInput
                                    placeholder="Mesajınızı buraya giriniz..."
                                    placeholderTextColor={'rgba(116, 118, 170, 0.7)'}
                                    style={[styles.textInput, isDarkTheme ? styles.textInputDarkTheme : styles.textInputLightTheme]}
                                    value={message}
                                    onChangeText={handleChange}
                                    multiline={true}
                                    autoFocus={storage.getBoolean('isLogined') ? true : false}
                                  />
                                  <TouchableOpacity style={styles.inputBoxMicrofonIconBox}>
                                      <Image
                                        source={require('../assets/images/microfon.png')}
                                        style={styles.inputBoxMicrofonIcon}/>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={styles.inputBoxSendIconBox}
                                    onPress={() => sendMessage(message)}
                                  >
                                      <Image source={require('../assets/images/send.png')} style={styles.inputBoxSendIcon}/>
                                  </TouchableOpacity>
                              </View>
                          </LinearGradient>
                  </SafeAreaView>
              </View>
          </SafeAreaView>
      </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    containerDarkTheme: {
        backgroundColor: '#070710',
    },
    containerLightTheme: {
        backgroundColor: '#ffffff',
    },
    header: {
        left: 0, right: 0,
        position: 'absolute',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: '5%',
    },
    headerButtonBox: {
        width: 35,
        height: 35,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButton: {
        width: 30,
        height: 30,
    },
    title:{
        fontSize: 22,
        fontWeight: 'bold',
    },
    titleDarkTheme: {
        color: '#fff',
    },
    titleLightTheme: {
        color: 'black',
    },
    talkBoxContainer: {
        flex: 1,
    },
    talkBoxContainerBox:{
        flex:1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    talkBoxContainerBoxAiChat:{
        marginBottom: 20,
        width: '100%',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 10,
        flexDirection:'row',
    } ,
    talkBoxContainerBoxAiChatLogoBox:{
        width: 30,
        height: 30,
        padding: 5,
        justifyContent:'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#1D1B3F',
    },
    talkBoxContainerBoxAiChatLogo:{
        width: '90%',
        aspectRatio:1,
        height: undefined,
        resizeMode: 'cover',
    },
    talkBoxContainerBoxAiChatMessageBox: {
        flex:1,
    },
    talkBoxContainerBoxAiChatMessageDarkTheme:{
        color: 'white',
    },
    talkBoxContainerBoxAiChatMessageLightTheme: {
        color: 'black',
    },

    talkBoxContainerBoxUserChat: {
        marginBottom: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    talkBoxContainerBoxUserChatBox: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 6,
    },
    talkBoxContainerBoxUserChatBoxDarkTheme: {
        backgroundColor: '#201D41',
    },
    talkBoxContainerBoxUserChatBoxLightTheme: {
        backgroundColor: 'rgb(246,248,250)',
    },
    talkBoxContainerBoxUserChatBoxMessageDarkTheme: {
        color: 'white',
    },
    talkBoxContainerBoxUserChatBoxMessageLightTheme: {
        color: 'black',
    },
    inputBox: {
        position: 'absolute',
        marginHorizontal: '5%',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
    },
    textInputBox: {
        width: '100%',
        height: 52,
        borderRadius: 6,
        paddingLeft: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInputBoxDarkTheme: {
        backgroundColor: '#0F1021',
    },
    textInputBoxLightTheme: {
        backgroundColor: 'rgb(239,239,254)',
    },
    inputBoxAddIconBox: {
        width: 30,
        height: '100%',
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBoxMicrofonIconBox: {
        width: 30,
        height: '100%',
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBoxSendIconBox: {
        width: 30,
        height: '100%',
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    inputBoxAddIcon: {
        width: 24,
        height: 24,
    },
    inputBoxMicrofonIcon: {
        width: 24,
        height: 24,
    },
    inputBoxSendIcon: {
        width: 24,
        height: 24,
    },

    textInput: {
        height: 52,
        fontSize: 15,
        flex:1,
        paddingTop:17,
        paddingBottom: 17,
        textAlignVertical: 'center',
    },
    textInputDarkTheme: {
        color: 'white',
    },
    textInputLightTheme: {
        color: 'black',
    },




});

export default TalkScreen;
