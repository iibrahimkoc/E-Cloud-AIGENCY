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
    KeyboardAvoidingView, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from 'react-native-fs';

import {ThemeContext} from '../context/ThemeContext';
import {StateContext} from '../context/StateContext';
import {storage} from '../components/Storage';

import Clipboard from '@react-native-clipboard/clipboard';
import DocumentPicker from 'react-native-document-picker';
import MathView from 'react-native-math-view';
import { launchImageLibrary } from 'react-native-image-picker';
import TypeWriter from 'react-native-typewriter';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';

import { postNewChat } from '../mobil_api_fetch/PostNewChat';
import { postSendMessage } from '../mobil_api_fetch/PostSendMessage';
import { postPublicNewChat } from '../genel_api_fetch/PostPublicNewChat';
import { postPublicSendMessage } from '../genel_api_fetch/PostPublicSendMessage';

import SyntaxHighlighter from 'react-native-syntax-highlighter';
import {atomOneDark, atomOneLight } from 'react-syntax-highlighter/styles/hljs';
const codeBlogDarkTheme = atomOneDark;
const codeBlogLightTheme = atomOneLight;

import { Menu, Divider } from 'react-native-paper';


const TalkScreen = ({navigation, toggleModal}) => {
    const { state, toggleState } = useContext(StateContext);
    const { isDarkTheme } = useContext(ThemeContext);
    const [message, setMessage] = useState('');
    const flatListRef = useRef(null);
    const inset = useSafeAreaInsets();
    const [menuVisible, setMenuVisible] = useState(false);
    const [typeWriterActive, setTypeWriterActive] = useState(false);
    const [userNeedCredit, setUserNeedCredit] = useState(false);

    const openMenu = () => {
        setMenuVisible(true);
    }
    const closeMenu = () => {
        setMenuVisible(false);
    }

    const [copiedIndex, setCopiedIndex] = useState(null);

    
    const copyToClipboard = (code, index) => {
        Clipboard.setString(code);
        setCopiedIndex(index);
        setTimeout(() => {
            setCopiedIndex(null);
        }, 2000); 
    };


    function toUpperCaseTurkish(text) {
        return text.replace(/[ıiğüşöç]/g, (match) => {
            switch (match) {
                case 'ı': return 'I';
                case 'i': return 'İ';
                case 'ğ': return 'Ğ';
                case 'ü': return 'Ü';
                case 'ş': return 'Ş';
                case 'ö': return 'Ö';
                case 'ç': return 'Ç';
                default: return match;
            }
        }).toUpperCase();
    }


    const textCustomization = (text) => {
        const regex = /(\*\*.*?\*\*|\\\[.*?\\\]|\\\(.*?\\\)|`.*?`)/g;
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
            else if(/`.*?`/.test(part)) {
                const boldText = part.replace(/`/g, '');
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

    const saveImageFromUrl = async (imageUrl) => {
        try {
            const downloadPhotoName = `${RNFS.DocumentDirectoryPath}/${imageUrl}`;

            const response = await RNFS.downloadFile({
                fromUrl: `https://aigency.dev/api/image?fileName=${imageUrl}`,
                toFile: downloadPhotoName,
            }).promise;
            console.log(response);

            await CameraRoll.save(downloadPhotoName, { type: 'photo' });
            console.log('Photo saved to gallery!');
        } catch (error) {
            console.error('Error downloading or saving photo:', error);
        }
    };



    const renderTalkData = useCallback(({item, index: flatListIndex}) => {
        if(item.content.includes('```')){
            setTypeWriterActive(false)
            const parts = item.content.split(/```/);
            return (
              <LinearGradient
                key={item.id}
                colors={isDarkTheme ? ['#272350','#0F1021'] : ['rgb(215,214,244)','rgb(246,248,250)']}
                start={{x: 0,y: 0}} end={{x: 1,y: 0.5}}
                style={styles.talkBoxContainerBoxAiChat}
              >
                  <View style={styles.talkBoxContainerBoxAiChatMessageBox}>
                      {
                          parts.map((part, partIndex) => {
                              const isCode = partIndex % 2 === 1;

                              if (isCode) {
                                  const kelimeler = part.split('\n');
                                  const codeLanguage = part.split('\n',1);
                                  kelimeler.shift();
                                  const newCode = kelimeler.join("\n")

                                  const uniqueIndex = `${flatListIndex}-${partIndex}`;
                                  return (
                                    <View key={uniqueIndex} style={[styles.codeContainer, isDarkTheme ? {backgroundColor: '#282c34',borderColor: 'darkgray'}: {backgroundColor: '#fff',borderColor: 'lightgray'}]}>
                                        <TouchableOpacity 
                                            onPress={() => copyToClipboard(newCode, uniqueIndex)}
                                            style={{
                                                padding: 5,
                                                paddingHorizontal: 10, 
                                                borderRadius: 100, 
                                                backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', 
                                                position: 'absolute',
                                                top: 5,
                                                right: 5,
                                                zIndex: 100
                                            }}
                                        >
                                            <Text style={{color: isDarkTheme ? 'black' : 'white'}}>
                                                {copiedIndex === uniqueIndex ? 'Kopyalandı' : 'Kopyala'}
                                            </Text>
                                        </TouchableOpacity>
                                        <SyntaxHighlighter
                                            language={String(codeLanguage).toLowerCase()}
                                            style={isDarkTheme ? codeBlogDarkTheme : codeBlogLightTheme}
                                            customStyle={{padding: 0, margin: 0 }}
                                            highlighter="hljs"
                    
                                        >
                                            {newCode}
                                        </SyntaxHighlighter>
                                    </View>
                                  );
                              }
                              else {
                                  return (
                                    <Text key={partIndex} style={[isDarkTheme ? styles.talkBoxContainerBoxAiChatMessageDarkTheme : styles.talkBoxContainerBoxAiChatMessageLightTheme]}>{textCustomization(part)}</Text>
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
                    !(item.type === 'image_url' || item.content.includes('.png'))
                        ? (
                            <LinearGradient
                                key={item.id}
                                colors={isDarkTheme ? ['#272350','#272350'] : ['rgb(215,214,244)','rgb(246,248,250)']}
                                start={{x: 0,y: 0}} end={{x: 1,y: 0.5}}
                                style={[styles.talkBoxContainerBoxAiChat]}
                            >
                                <View style={[styles.talkBoxContainerBoxAiChatMessageBox, {paddingTop: item.type === 'image_url' ? 0 : 0}]}>
                                    {
                                        (item.type === 'image_url' || item.content.includes('.png')) ? (
                                            <Image
                                                style={{flex:1, aspectRatio:1, borderRadius: 6, backgroundColor :'transparent', borderWidth: 1}}
                                                source={{ uri: `https://aigency.dev/api/image?fileName=${item.content}`}}
                                            />
                                        ) : (
                                            <Text style={[isDarkTheme ? styles.talkBoxContainerBoxAiChatMessageDarkTheme : styles.talkBoxContainerBoxAiChatMessageLightTheme]}>
                                                {item.isTyping ? (
                                                    <TypeWriter
                                                        typing={1}
                                                        onTypingEnd={() => {
                                                            setTypeWriterActive(false)
                                                            console.log('incele', state.talkScreenData)
                                                            
                                                        }}
                                                        minDelay={10}
                                                        maxDelay={10}
                                                    >
                                                        {textCustomization(item.content)}
                                                    </TypeWriter>
                                                ) : (
                                                    textCustomization(item.content)
                                                )}
                                            </Text>
                                        )
                                    }
                                </View>
                            </LinearGradient>
                        )
                        :
                        (
                            <View style={{width: '100%', marginBottom: 20, position: 'relative'}}>
                                <TouchableOpacity
                                    onPress={() => saveImageFromUrl(item.content)}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 1,
                                        right: '15%',
                                        top: 0,
                                        width: 40, height: 40, borderRadius: 5,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(82,78,90,0.7)',
                                }}
                                >
                                    <Image style={{width: 30, height: 30}} source={require('../assets/images/download.png')} />
                                </TouchableOpacity>
                                <Image
                                    style={{width: '85%', aspectRatio:1, borderRadius: 6, resizeMode: 'cover', backgroundColor :'transparent',}}
                                    source={{ uri: `https://aigency.dev/api/image?fileName=${item.content}`}}
                                />
                            </View>
                        )

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
    }, [copiedIndex, isDarkTheme]);

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

    const assistantAnswerAdd = async (answer) => {
        let talkScreenData = state.talkScreenData;
        let talkScreenMessages = talkScreenData.messages;

        let newMessage = {
            id: Date.now().toString(),
            content: answer,
            role: 'assistant',
            isTyping: true,
        };

        talkScreenMessages.push(newMessage);
        talkScreenData.messages = talkScreenMessages;
        toggleState('talkScreenData', talkScreenData);

    };
    const sendMessage = async (myMessage) => {
        if(!myMessage || myMessage.trim() === ''){
            return;
        }
        if(storage.getBoolean('isLogined') === true){
            if( await isNewChat() ) {
                setMessage('');
                setSelectedFiles([]);
                setTypeWriterActive(true)
                let myMessageData  =  {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: '', messages: [{content: myMessage, role: 'user'}]};
                toggleState('talkScreenData', myMessageData);
                const newChatData =  await postNewChat(state.selectedAi.id);
                if(newChatData.message.message === "Yetersiz kredi. Lütfen daha fazla kredi yükleyin."){
                    setUserNeedCredit(true);
                    let assistantAnswerData= {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: newChatData.chat_id, messages: [{content: myMessage, role: 'user'}, {content: newChatData.message.message, role: 'assistant'}]};
                    toggleState('talkScreenData', assistantAnswerData);
                    setTypeWriterActive(false)
                    setSelectedFilesSend([])
                }
                else{
                    const assistantAnswer = selectedFiles.length > 0 ? await postSendMessage(myMessage.trim(), newChatData.chat_id, selectedFilesSend) :  await postSendMessage(myMessage.trim(), newChatData.chat_id,[]);
                    console.log("ai cevap : ",assistantAnswer);
                    let assistantAnswerData= assistantAnswer.message.includes('.png') ? {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: newChatData.chat_id, messages: [{content: myMessage, role: 'user'}, {content: assistantAnswer.message, role: 'assistant', type: 'image_url'}]} : {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: newChatData.chat_id, messages: [{content: myMessage, role: 'user'}, {content: assistantAnswer.message, role: 'assistant'}]};
                    toggleState('talkScreenData', assistantAnswerData);
                    setSelectedFilesSend([])
                    setTimeout(() => {
                        setTypeWriterActive(false)
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                }

            }
            else {
                await myMessageAdd(myMessage.trim());
                setMessage('');
                setSelectedFiles([]);
                setTypeWriterActive(true)
                const assistantAnswer = selectedFiles.length > 0 ? await postSendMessage(myMessage.trim(), state.talkScreenData.chat_id, selectedFilesSend) :  await postSendMessage(myMessage.trim(),  state.talkScreenData.chat_id,[]);
                if(userNeedCredit){
                    setSelectedFilesSend([]);
                    await assistantAnswerAdd("Yetersiz kredi. Lütfen daha fazla kredi yükleyin.");
                }
                else {
                    console.log(assistantAnswer);
                    setSelectedFilesSend([]);
                    await assistantAnswerAdd(assistantAnswer.message);
                }


            }
        }
        else{
            if( await isNewChat() ) {
                storage.getNumber('publicViewChatCount') === undefined ? storage.set('publicViewChatCount', 1) : storage.set('publicViewChatCount', storage.getNumber('publicViewChatCount') + 1);
                console.log(storage.getNumber('publicViewChatCount'));
                if(storage.getNumber('publicViewChatCount') < 6) {
                    setMessage('');
                    setSelectedFiles([]);
                    setTypeWriterActive(true)
                    let myMessageData  =  {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: '', messages: [{content: myMessage, role: 'user'}]};
                    toggleState('talkScreenData', myMessageData);
                    const newChatData = await postPublicNewChat();
                    const assistantAnswer = selectedFiles.length > 0 ? await postPublicSendMessage(myMessage.trim(), newChatData.chat_id, selectedFilesSend) :  await postPublicSendMessage(myMessage.trim(), newChatData.chat_id);
                    let assistantAnswerData = assistantAnswer.message.includes('.png') ? {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: newChatData.chat_id, messages: [{content: myMessage, role: 'user'}, {content: assistantAnswer.message, role: 'assistant', type: 'image_url'}]} : {ai_desc: state.selectedAi.description, ai_id: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: newChatData.chat_id, messages: [{content: myMessage, role: 'user'}, {content: assistantAnswer.message, role: 'assistant'}]};
                    setSelectedFilesSend([]);
                    toggleState('talkScreenData', assistantAnswerData);
                    setTimeout(() => {
                        setTypeWriterActive(false)
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
                setTypeWriterActive(true)
                setMessage('');
                setSelectedFiles([]);
                const assistantAnswer = selectedFiles.length > 0 ?  await postPublicSendMessage(myMessage.trim(), state.talkScreenData.chat_id, selectedFilesSend) : await postPublicSendMessage(myMessage.trim(), state.talkScreenData.chat_id);
                setSelectedFilesSend([]);
                await assistantAnswerAdd(assistantAnswer.message);
            }
        }
    };

    const resetTalkChatContent = () => {
        toggleState('talkScreenData',[]);
    };

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesSend, setSelectedFilesSend] = useState([]);
    const openFolderFunction = async () => {
        try {
            closeMenu()
            const response = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                allowMultiSelection: true,
            });
            setSelectedFiles((selectedFiles) => [...selectedFiles, ...response]);
            setSelectedFilesSend((selectedFiles) => [...selectedFiles, ...response]);
        }
        catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('Kullanıcı işlemi iptal etti');
            } else {
                console.log('Hata:', err.message);
            }
        }
    };

    const openPhotoFunction = async () => {
        await launchImageLibrary(
            {
                selectionLimit: 5,
                mediaType: 'photo',
            },

            (response) => {
                closeMenu()
                if (response.didCancel) {
                    console.log('Kullanıcı işlemi iptal etti');
                }
                else if (response.errorCode) {
                    console.log('Hata: ', response.errorMessage);
                }
                else {
                    setSelectedFiles((selectedFiles) => [...selectedFiles, ...response.assets]);
                    setSelectedFilesSend((selectedFiles) => [...selectedFiles, ...response.assets]);
                }

            }
        );
    };

    const selectedFilesPopFunc = (index) => {
        setSelectedFiles(selectedFiles.slice(0, index).concat(selectedFiles.slice(index + 1)))
        setSelectedFilesSend(selectedFiles.slice(0, index).concat(selectedFiles.slice(index + 1)))
    }


    const handleChange = useCallback((text) => {
        setMessage(text);
    }, []);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                //flatListRef.current?.scrollToEnd({ animated: true });
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
                            onPress={() => {
                                Keyboard.dismiss();
                                navigation.getParent('LeftDrawer').openDrawer()
                            }}
                        >
                            <Image source={require('../assets/images/menu.png')} style={styles.headerButton}></Image>
                        </TouchableOpacity>
                        <View style={{position: 'relative'}}>
                            <TouchableOpacity onPress={() => {
                                Keyboard.dismiss();
                                if(storage.getBoolean('isLogined')) {
                                    //setChatSettingBoxVisible(!chatSettingBoxVisible);
                                }
                            }}>
                                <Text style={[styles.title, isDarkTheme ? styles.titleDarkTheme : styles.titleLightTheme]}>{storage.getBoolean('isLogined') ? toUpperCaseTurkish(String(state.selectedAi?.name?.name_tr)): 'ALPARSLAN'}</Text>
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
                                onPress={() => Keyboard.dismiss()}
                                ListHeaderComponent={<View style={{ height: 60 + 15 }} />} // --> FlatList üst boşluğu
                                ListFooterComponent={<View style={{ height: selectedFiles.length > 0 ? inset.bottom + 52 + 14 + 100 : inset.bottom + 52 + 14 }} />} // --> FlatList alt boşluğu
                            />

                        </View>
                        <SafeAreaView style={styles.inputBox}>
                            <LinearGradient
                                colors={['#C137BB', '#6C30B3']}
                                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                style={{width: '100%', padding: 2, borderRadius: 10,marginBottom: 10}}>
                                <View style={{backgroundColor:isDarkTheme ? '#0F1021' : 'white',borderRadius: 8, minHeight: selectedFiles.length > 0 ? 121 : 46}}>
                                    {
                                        (selectedFiles.length > 0) &&
                                            <View style={{flexDirection: 'row', alignItems: 'center', padding: 5,}}>
                                                <NativeViewGestureHandler>
                                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                                        <View style={{flexDirection: 'row', gap: 5}}>
                                                            {
                                                                selectedFiles.map((item, index) => (
                                                                    <View key={index}>
                                                                        <TouchableOpacity
                                                                            onPress={() => selectedFilesPopFunc(index)}
                                                                            style={{position: 'absolute',zIndex: 1,right: 3, top: 3, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 30,padding: 3}}>
                                                                            <Image style={{width: 15, height: 15}} source={require('../assets/images/close.png')}/>
                                                                        </TouchableOpacity>
                                                                        <Image style={{width: 70, height: 70, borderRadius: 5}} source={{ uri: item.uri}} />
                                                                    </View>
                                                                ))
                                                            }
                                                        </View>
                                                    </ScrollView>
                                                </NativeViewGestureHandler>

                                            </View>
                                    }
                                    <View style={[styles.textInputBox, isDarkTheme ? styles.textInputBoxDarkTheme : styles.textInputBoxLightTheme, {minHeight: selectedFiles.length > 0 ? 46 : 46}]}>
                                        <TouchableOpacity
                                            onPress={() => openMenu()}
                                            style={styles.inputBoxAddIconBox}
                                        >
                                            <Menu
                                                visible={menuVisible}
                                                onDismiss={closeMenu}
                                                contentStyle={{
                                                    width: 200,
                                                    borderRadius: 10,
                                                    paddingVertical: 0,
                                                    padding: 0,
                                                    marginBottom: 35,
                                                    marginLeft: -15,
                                                    shadowColor: '#3e3e3e',
                                                    backgroundColor: isDarkTheme ? "#0F1021" : "#fff",
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 0,
                                                    },
                                                    shadowOpacity: 0.5,
                                                    shadowRadius: 10.84,
                                                    elevation: 25,
                                                }}
                                                anchor={
                                                    <Image source={require('../assets/images/add.png')} style={styles.inputBoxAddIcon} />
                                                }
                                            >
                                                <Menu.Item
                                                    style={{paddingHorizontal:10, height: 45}}
                                                    contentStyle={{paddingHorizontal: 0}}
                                                    leadingIcon={() => (
                                                        <Image source={isDarkTheme ? require('../assets/images/image_16dp_FFFFFF_FILL0_wght400_GRAD0_opsz20.png') : require('../assets/images/photo.png')} style={{width: 20, height: 20}} />
                                                    )}
                                                    titleStyle={{color: isDarkTheme ?  'white' : 'black'}}
                                                    title="Fotoğraflar"
                                                    onPress={() => openPhotoFunction()}
                                                />
                                                <Divider/>
                                                <Menu.Item
                                                    style={{paddingHorizontal: 10, height: 45,justifyContent:'center',}}
                                                    contentStyle={{paddingHorizontal: 0,}}
                                                    leadingIcon={() => (
                                                        <Image source={isDarkTheme ? require('../assets/images/folder.png') : require('../assets/images/openFolderDark.png')} style={{width: 20, height: 20}} />
                                                    )}
                                                    titleStyle={{color: isDarkTheme ?  'white' : 'black'}}
                                                    title='Dosyalar'
                                                    onPress={() => openFolderFunction()}
                                                />

                                            </Menu>
                                            {/*<Image source={require('../assets/images/add.png')} style={styles.inputBoxAddIcon} />*/}
                                        </TouchableOpacity>
                                        <TextInput
                                            editable={typeWriterActive ? false : true}
                                            placeholder="Mesajınızı buraya giriniz..."
                                            placeholderTextColor={'rgba(116, 118, 170, 0.7)'}
                                            style={[styles.textInput, isDarkTheme ? styles.textInputDarkTheme : styles.textInputLightTheme,  {minHeight: selectedFiles.length > 0 ? 46 : 46}]}
                                            value={message}
                                            onChangeText={handleChange}
                                            multiline={true}
                                            //autoFocus={storage.getBoolean('isLogined') ? true : false}
                                            keyboardType='ascii-capable'
                                            autoCapitalize="none"
                                            textContentType="none"
                                            autoCorrect={false}
                                            autoComplete="off"
                                        />
                                        <TouchableOpacity style={styles.inputBoxMicrofonIconBox}>
                                            <Image
                                                source={require('../assets/images/mic.png')}
                                                style={styles.inputBoxMicrofonIcon}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.inputBoxSendIconBox}
                                            onPress={() => sendMessage(message)}
                                        >
                                            <Image source={require('../assets/images/send.png')} style={styles.inputBoxSendIcon}/>
                                        </TouchableOpacity>
                                    </View>
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
        width: 26,
        height: 26,
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
        padding: 10,
        gap: 10,
        flexDirection:'row',
    } ,
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
    codeContainer: {
        borderRadius: 2,
        borderWidth: 2,
        zIndex: 1,
    },

    talkBoxContainerBoxUserChat: {
        marginBottom: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    talkBoxContainerBoxUserChatBox: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 6,
    },
    talkBoxContainerBoxUserChatBoxDarkTheme: {
        backgroundColor: '#C137BB',
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
        borderRadius: 8,
        paddingLeft: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    textInputBoxDarkTheme: {
        backgroundColor: '#0F1021',
    },
    textInputBoxLightTheme: {
        backgroundColor: 'rgb(255,255,255)',
    },
    inputBoxAddIconBox: {
        width: 30,
        height: 30,
        marginHorizontal: 10,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBoxMicrofonIconBox: {
        width: 30,
        height: 30,
        marginLeft: 5,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBoxSendIconBox: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
        marginBottom: 8,
        justifyContent: "center",
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
        maxHeight: 104,
        fontSize: 15,
        flex:1,
        
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
