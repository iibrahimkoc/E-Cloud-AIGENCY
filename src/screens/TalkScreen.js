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
    Platform,
    PermissionsAndroid,
    KeyboardAvoidingView, ScrollView,
} from 'react-native';

import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from 'react-native-fs';
import Voice from '@react-native-voice/voice';

import {ThemeContext} from '../context/ThemeContext';
import {StateContext} from '../context/StateContext';

import {storage} from '../components/Storage';
import {TextCustomization} from "../components/TextCustomization";
import {TypewriterEffect} from "../components/TypeWriterEffect";
import {TypewriterEffectSyntax} from "../components/TypeWriterEffectSnytax";


import Clipboard from '@react-native-clipboard/clipboard';
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import { MenuView } from '@react-native-menu/menu';
import Share from 'react-native-share';

import { postPublicNewChat } from '../genel_api_fetch/PostPublicNewChat';
import { postPublicSendMessage } from '../genel_api_fetch/PostPublicSendMessage';
import { postNewChat } from '../mobil_api_fetch/PostNewChat';
import { postSendMessage } from '../mobil_api_fetch/PostSendMessage';
import { deleteChatApi } from '../mobil_api_fetch/DeleteChatApi';
import { getShareChat } from "../mobil_api_fetch/GetShareChat";
import { getViewChat } from "../mobil_api_fetch/GetViewChat";

import SyntaxHighlighter from 'react-native-syntax-highlighter';
import {atomOneDark, atomOneLight } from 'react-syntax-highlighter/styles/hljs';

import { Menu, Divider } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';



const TalkScreen = ({navigation, toggleModal}) => {
    const { state, toggleState } = useContext(StateContext);
    const { isDarkTheme } = useContext(ThemeContext);
    const [message, setMessage] = useState('');
    const flatListRef = useRef(null);
    const menuRef = useRef(null);
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

    const [talkScreenData, setTalkScreenData] = useState({});

    const dataRef = useRef(talkScreenData);

    useEffect(() => {
        dataRef.current = talkScreenData;
    }, [talkScreenData]);


    useEffect(() => {
        setTalkScreenData(state.talkScreenData);
        setFirstMessageError(false);
        setLastMessageError(false);
    },[state.talkScreenData])



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

    const complatedText = (item) => {
        setTypeWriterActive(false)
        setTalkScreenData( {
            ...dataRef.current,
            messages: dataRef.current.messages.map((msg) =>
                msg.id === item.id ? { ...msg, isTyping: false } : msg
            ),
        });
    }


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

    const shareMessage = async (message) => {
        const shareOptions = {
            message: message,
        };
        try {
            await Share.open(shareOptions);
        } catch (error) {
            console.log('Paylaşma hatası:', error);
        }
    }

    const handleShareImage = async (value) => {
        const shareOptions = {
            url: `https://aigency.dev/api/image?fileName=${value}`,
            type: 'image/jpeg',
        };
        try {
            await Share.open(shareOptions);
        } catch (error) {
            console.log('Paylaşma hatası:', error);
        }
    };

    const renderTalkData = useCallback(({item, index: flatListIndex}) => {
        console.log("bub verri: ",item);
        if(item.content.includes('```')){
            const parts = item.content.split(/```/);
            console.log("daa:Ç",item); // item verisinin doğru geldiğinden emin olun

            return (
                <MenuView
                    onLongPress={() => {
                        console.log(1);
                    }}
                    key={item.id}
                    style={{marginBottom: 20, borderRadius: 6}}
                    ref={menuRef}
                    onPressAction={(event) => {
                        const actionId = event.nativeEvent.event;
                        switch (actionId) {
                            case 'copy':
                                Clipboard.setString(event._dispatchInstances.memoizedProps.actions[0].item)
                                break;
                            case 'share':
                                //console.log("Paylaşılacak metin:", event._dispatchInstances.memoizedProps.actions[0].item);
                                shareMessage(event._dispatchInstances.memoizedProps.actions[0].item)
                                break;
                        }
                    }}
                    actions={[
                        {
                            id: 'copy',
                            title: 'Metni Kopyala',
                            titleColor: '#131916',
                            image: Platform.select({
                                ios: 'document.on.document',
                                android: '',
                            }),
                            imageColor: '#000',
                            item: item.content,
                        },
                        {
                            id: 'share',
                            title: 'Metni Paylaş',
                            image: Platform.select({
                                ios: 'square.and.arrow.up',
                                android: '',
                            }),
                            imageColor: '#000000',
                            item: item.content,
                        },
                    ]}
                    shouldOpenOnLongPress={true}
                >
                    <LinearGradient
                        colors={isDarkTheme ? ['#272350','#0F1021'] : ['rgb(215,214,244)','rgb(246,248,250)']}
                        start={{x: 0,y: 0}} end={{x: 1,y: 0.5}}
                        style={styles.talkBoxContainerBoxAiChat}
                    >
                        <View style={styles.talkBoxContainerBoxAiChatMessageBox}>
                            { // yazma efekti varken
                                item.isTyping ? (
                                    <TypewriterEffectSyntax  parts={parts} theme={isDarkTheme} style={isDarkTheme ? atomOneDark : atomOneLight} onComplete={()=>complatedText(item)} windowWidth={windowWidth}/>
                                ) : ( // yazma efekti olmadan
                                    parts.map((part, partIndex) => {
                                        const isCode = partIndex % 2 === 1;
                                        if (isCode) {
                                            const kelimeler = part.split('\n');
                                            const codeLanguage = kelimeler.shift();
                                            const newCode = kelimeler.join("\n");

                                            const uniqueIndex = `${flatListIndex}-${partIndex}`;
                                            return (
                                                <View style={[styles.codeContainer, isDarkTheme ? {backgroundColor: '#282c34',borderColor: 'darkgray'}: {backgroundColor: '#fff',borderColor: 'lightgray'}]}>
                                                    <View style={{position: "absolute", top: 5, right: 5,zIndex: 1000, flexDirection: "row-reverse"}}>
                                                        <TouchableOpacity
                                                            onPress={() => copyToClipboard(newCode, uniqueIndex)}
                                                            style={{
                                                                padding: 5,
                                                                paddingHorizontal: 10,
                                                                borderRadius: 100,
                                                                backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <Text style={{color: isDarkTheme ? 'black' : 'white'}}>
                                                                {copiedIndex === uniqueIndex ? 'Kopyalandı' : 'Kopyala'}
                                                            </Text>
                                                        </TouchableOpacity>
                                                        {
                                                            String(codeLanguage).includes('html') && (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        toggleState("talkScreenData", dataRef.current);
                                                                        toggleState('htmlContent', newCode)
                                                                        toggleModal('htmlLiveModalOpen');
                                                                    }}
                                                                    style={{
                                                                        width: 30,
                                                                        height: 30,
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                                                        borderRadius: 100,
                                                                        marginRight: 5,
                                                                    }}
                                                                >
                                                                    <Image style={{width: 20, height: 20}} source={isDarkTheme ? require('../assets/images/playHtmlDark.png') : require('../assets/images/playHtmlLight.png')}/>
                                                                </TouchableOpacity>
                                                            )
                                                        }
                                                    </View>
                                                    <SyntaxHighlighter
                                                        //wrapLines={true}
                                                        //wrapLongLines={true}

                                                        language={String(codeLanguage).toLowerCase()}
                                                        style={isDarkTheme ? atomOneDark : atomOneLight}
                                                        customStyle={{minWidth: 0, width: (windowWidth * 0.9)-24}}
                                                        highlighter="hljs"
                                                    >
                                                        {newCode}
                                                    </SyntaxHighlighter>
                                                </View>
                                            );
                                        } else {
                                            return (
                                                <View style={[isDarkTheme ? styles.talkBoxContainerBoxAiChatMessageDarkTheme : styles.talkBoxContainerBoxAiChatMessageLightTheme]}>
                                                    <TextCustomization text={part}/>
                                                </View>
                                            );
                                        }
                                    })
                                )
                            }
                        </View>
                    </LinearGradient>
                </MenuView>
            );
        }
        else{
            if(item.role === 'assistant'){
                return (
                    !(item.content.includes('.png'))
                        ? (
                            <MenuView
                                key={item.id}
                                style={{marginBottom: 20,borderRadius:6}}
                                ref={menuRef}
                                onPressAction={(event) => {
                                    const actionId = event.nativeEvent.event;
                                    switch (actionId) {
                                        case 'copy':
                                            Clipboard.setString(event._dispatchInstances.memoizedProps.actions[0].item)
                                            break;
                                        case 'share':
                                            //console.log("Paylaşılacak metin:", event._dispatchInstances.memoizedProps.actions[0].item);
                                            shareMessage(event._dispatchInstances.memoizedProps.actions[0].item)
                                            break;
                                    }
                                }}
                                actions={[
                                    {
                                        id: 'copy',
                                        title: 'Metni Kopyala',
                                        titleColor: '#131916',
                                        image: Platform.select({
                                            ios: 'document.on.document',
                                            android: '',
                                        }),
                                        imageColor: '#000',
                                        item: item.content,
                                    },
                                    {
                                        id: 'share',
                                        title: 'Metni Paylaş',
                                        image: Platform.select({
                                            ios: 'square.and.arrow.up',
                                            android: '',
                                        }),
                                        imageColor: '#000000',
                                        item: item.content,
                                    },
                                ]}
                                shouldOpenOnLongPress={true}
                            >
                                <LinearGradient
                                    colors={isDarkTheme ? ['#272350','#272350'] : ['rgb(215,214,244)','rgb(246,248,250)']}
                                    start={{x: 0,y: 0}} end={{x: 1,y: 0.5}}
                                    style={[styles.talkBoxContainerBoxAiChat]}
                                >
                                    <View style={[styles.talkBoxContainerBoxAiChatMessageBox, {paddingTop: 0}]}>
                                        {item.isTyping ? (
                                            <TypewriterEffect
                                                text={item.content}
                                                onComplete={() => complatedText(item)}
                                            />
                                        ) : (
                                            <TextCustomization text={item.content} />
                                        )}
                                    </View>
                                </LinearGradient>
                            </MenuView>
                        )
                        :
                        (
                            <View key={item.id} style={{width: '100%',position: 'relative',marginBottom: 20}}>
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
                                <MenuView
                                    style={{width: '85%', aspectRatio:1, borderRadius: 6, resizeMode: 'cover', backgroundColor :'transparent',}}
                                    ref={menuRef}
                                    onPressAction={(event) => {
                                        const actionId = event.nativeEvent.event;
                                        switch (actionId) {
                                            case 'download':
                                                saveImageFromUrl(event._dispatchInstances.memoizedProps.actions[0].item)
                                                break;
                                            case 'share':
                                                handleShareImage(event._dispatchInstances.memoizedProps.actions[0].item)
                                                break;
                                        }
                                    }}
                                    actions={[
                                        {
                                            id: 'download',
                                            title: 'Görseli indir',
                                            titleColor: '#131916',
                                            image: Platform.select({
                                                ios: 'arrow.down',
                                                android: '',
                                            }),
                                            imageColor: '#000',
                                            item: item.content,
                                        },
                                        {
                                            id: 'share',
                                            title: 'Görseli Paylaş',
                                            image: Platform.select({
                                                ios: 'arrow.down.app',
                                                android: '',
                                            }),
                                            imageColor: '#000000',
                                            item: item.content,
                                        },
                                    ]}
                                    shouldOpenOnLongPress={true}
                                >
                                        <Image
                                            resizeMode={'contain'}
                                            style={{width: '100%', aspectRatio:1, height: undefined, borderRadius: 6, backgroundColor :'transparent',}}
                                            source={{ uri: `https://aigency.dev/api/image?fileName=${item.content}`}}
                                        />
                                </MenuView>
                            </View>
                        )
                );
            }
            else if(item.role === 'user') {
                return (
                    <View
                        key={item.id}
                        style={styles.talkBoxContainerBoxUserChat}
                    >
                        <MenuView
                            style={[styles.talkBoxContainerBoxUserChatBox, isDarkTheme ? styles.talkBoxContainerBoxUserChatBoxDarkTheme : styles.talkBoxContainerBoxUserChatBoxLightTheme]}
                            ref={menuRef}
                            onPressAction={(event) => {
                                const actionId = event.nativeEvent.event;
                                switch (actionId) {
                                    case 'copy':
                                        Clipboard.setString(event._dispatchInstances.memoizedProps.actions[0].item)
                                        break;
                                    case 'share':
                                        //console.log("Paylaşılacak metin:", event._dispatchInstances.memoizedProps.actions[0].item);
                                        shareMessage(event._dispatchInstances.memoizedProps.actions[0].item)
                                        break;
                                }
                            }}
                            actions={[
                                {
                                    id: 'copy',
                                    title: 'Metni Kopyala',
                                    titleColor: '#131916',
                                    image: Platform.select({
                                        ios: 'document.on.document',
                                        android: '',
                                    }),
                                    imageColor: '#000',
                                    item: item.content,
                                },
                                {
                                    id: 'share',
                                    title: 'Metni Paylaş',
                                    image: Platform.select({
                                        ios: 'square.and.arrow.up',
                                        android: '',
                                    }),
                                    imageColor: '#000000',
                                    item: item.content,
                                },
                            ]}
                            shouldOpenOnLongPress={true}
                        >
                            <Text style={[isDarkTheme ? styles.talkBoxContainerBoxAiChatMessageDarkTheme : styles.talkBoxContainerBoxAiChatMessageLightTheme]}>{item.content}</Text>
                        </MenuView>
                    </View>
                );
            }
            else if(item.role === 'aigencyMobile') {
                return (
                    <View
                        key={item.id}
                        style={styles.talkBoxContainerBoxAiChat}
                    >
                        <FastImage
                            source={require('../assets/images/loader-one.gif')}
                            style={{width: 40, height: 40}}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </View>
                )
            }
            else if(item.role === 'internetError') {
                return (
                    <LinearGradient
                        key={item.id}
                        colors={isDarkTheme ? ['#272350','#272350'] : ['rgb(164,161,239)','rgb(164,161,239)']}
                        start={{x: 0,y: 0}} end={{x: 1,y: 0.5}}
                        style={[styles.talkBoxContainerBoxAiChat,{flexDirection: 'column',padding: 2,borderRadius: 10}]}
                    >
                        <View style={{backgroundColor: 'white',borderRadius: 8, padding: 10,gap: 10}}>
                            <Text style={{color: 'rgb(149,145,241)',fontWeight: 500}}>Bağlantı hatası oluştu</Text>
                            <TouchableOpacity
                                onPress={()=> {
                                    if (item.firstMessage) {
                                        reSendFirstMessage(item.reSendMyMessage)
                                    }
                                    else {
                                        let talkScreenMessages = dataRef.current.messages;
                                        talkScreenMessages.pop();
                                        setTalkScreenData({...dataRef.current, messages: talkScreenMessages});
                                        reSendMessage(item.reSendMyMessage)

                                    }
                                }}
                                style={{width: '100%', backgroundColor: 'rgb(164,161,239)',padding: 10,borderRadius: 6, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: 'rgba(255,255,255,0.9)', fontWeight: 'bold'}}>Yeniden gönder</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                )
            }
        }
    }, [copiedIndex, isDarkTheme]);

    const isNewChat = async () => {
        return Object.keys(dataRef.current).length === 0;
    };

    const messageWaitAdd = () => {
        let talkScreenMessages = dataRef.current?.messages === undefined ? '' : dataRef.current.messages;
        talkScreenMessages.push({content : "mesajGif", role: 'aigencyMobile'});
        setTalkScreenData({...dataRef.current, messages: talkScreenMessages});
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }

    const myMessageAdd = async (myMessage) => {
        let talkScreenMessages = dataRef.current?.messages === undefined ? '' : dataRef.current.messages;
        let myMessageData =  {content : myMessage, role: 'user'};
        talkScreenMessages.push(myMessageData);
        talkScreenMessages.push({content : "mesajGif", role: 'aigencyMobile'});
        setTalkScreenData({...dataRef.current, messages: talkScreenMessages});
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const assistantErrorAnswerAdd = async (answer, myMessage) => {
        let talkScreenMessages = dataRef.current.messages;
        talkScreenMessages.pop()
        talkScreenMessages.push({content : "mesajGif", role: 'internetError', reSendMyMessage: myMessage, firstMessage: false});
        setTalkScreenData({...dataRef.current, messages: talkScreenMessages});
    };

    const assistantAnswerAdd = async (answer) => {
        let talkScreenMessages = dataRef.current.messages;
        let assistantMessage = {
            id: Date.now().toString(),
            content: answer,
            role: 'assistant',
            isTyping: !answer.includes(".png"),
        };
        if(answer.includes(".png")){
            setTypeWriterActive(false)
        }
        talkScreenMessages.pop()
        talkScreenMessages.push(assistantMessage);
        setTalkScreenData({...dataRef.current, messages: talkScreenMessages});
    };

    const assistantErrorFirstAnswerAdd = async (myMessage, assistantFirstAnswer, chatId) => {
        let talkScreenMessages = [{content: myMessage, role: 'user'}];
        let newMessage = {
            reSendMyMessage: myMessage,
            content: assistantFirstAnswer,
            role: 'internetError',
            firstMessage: true
        };
        setTypeWriterActive(false)
        talkScreenMessages.push(newMessage);
        setTalkScreenData({ ...dataRef.current, chat_id: chatId, messages: talkScreenMessages })
    };

    const assistantFirstAnswerAdd = async (myMessage, assistantFirstAnswer, chatId) => {
        let talkScreenMessages = [{content: myMessage, role: 'user'}];
        let newMessage = {
            id: Date.now().toString(),
            content: assistantFirstAnswer,
            role: 'assistant',
            isTyping: true,
        };
        if(assistantFirstAnswer.includes(".png")){
            setTypeWriterActive(false)
        }
        talkScreenMessages.push(newMessage);
        setTalkScreenData({ ...dataRef.current, chat_id: chatId, messages: talkScreenMessages })
    }



    const reSendFirstMessage = async (myMessage) => {
        setFirstMessageError(false);
        setTypeWriterActive(false)
        if(storage.getBoolean('isLogined') === true){ // Kullanıcı girişi var
            setMessage('');
            setSelectedFiles([]);
            setTypeWriterActive(true)
            setTalkScreenData({ai_desc: state.selectedAi.description, assistantId: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: '', messages: [{content: myMessage, role: 'user'},{content: 'mesajGif',role: 'aigencyMobile'}]});

            const newChatData =  await postNewChat(state.selectedAi.id, myMessage);
            if(newChatData.message.message === "Yetersiz kredi. Lütfen daha fazla kredi yükleyin."){
                setUserNeedCredit(true);
                await assistantAnswerAdd(newChatData.message.message)
                setTypeWriterActive(false)
                setSelectedFilesSend([])
            }
            else{
                if(newChatData.errorType){
                    await assistantErrorFirstAnswerAdd(myMessage, newChatData.message, newChatData.chat_id);
                    setTypeWriterActive(false)
                    setFirstMessageError(true)
                }
                else {
                    await assistantFirstAnswerAdd(myMessage, newChatData.message, newChatData.chat_id);
                    toggleState('viewChat', await getViewChat(state.selectedAi.id));
                    setSelectedFilesSend([])
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                }
            }
        }
        else {  // Kullanıcı girişi yok
            storage.getNumber('publicViewChatCount') === undefined ? storage.set('publicViewChatCount', 1) : storage.set('publicViewChatCount', storage.getNumber('publicViewChatCount') + 1);
            storage.getNumber('publicViewChatMessageCount') === undefined ? storage.set('publicViewChatMessageCount', 1) : storage.set('publicViewChatMessageCount', storage.getNumber('publicViewChatMessageCount') + 1);
            if(storage.getNumber('publicViewChatCount') < 6) {
                setTypeWriterActive(true)
                setTalkScreenData({ai_desc: state.selectedAi.description, assistantId: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: '', messages: [{content: myMessage, role: 'user'}]});

                const newChatData = await postPublicNewChat(myMessage.trim());
                console.log("bu yeni",newChatData);

                await assistantFirstAnswerAdd(myMessage, newChatData.message, newChatData.chat_id);
                setSelectedFilesSend([])
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
            else{
                toggleModal('popupLoginModalOpen');
                console.log(storage.getNumber('publicViewChatCount'));
            }
        }
    }
    const reSendMessage = async (myMessage) => {
        if(storage.getBoolean('isLogined') === true){ // Kullanıcı girişi var
            messageWaitAdd()
            setTypeWriterActive(true)
            const assistantAnswer = selectedFiles.length > 0 ? await postSendMessage(myMessage.trim(), dataRef.current.chat_id, selectedFilesSend) :  await postSendMessage(myMessage.trim(),  dataRef.current.chat_id,[]);
            console.log("internet hatası :   ",assistantAnswer);
            if(userNeedCredit){
                setSelectedFilesSend([]);
                await assistantAnswerAdd("Yetersiz kredi. Lütfen daha fazla kredi yükleyin.");
            }
            else {
                if(assistantAnswer.errorType){
                    await assistantErrorAnswerAdd(assistantAnswer.message, myMessage);
                    setTypeWriterActive(false)
                    setLastMessageError(true)

                }
                else{
                    setSelectedFilesSend([]);
                    await assistantAnswerAdd(assistantAnswer.message);
                }
            }
        }
        else{  // Kullanıcı girişi yok
            storage.set('publicViewChatMessageCount', storage.getNumber('publicViewChatMessageCount') + 1);
            if(storage.getNumber('publicViewChatMessageCount') < 6) {
                await myMessageAdd(myMessage.trim());
                setMessage('');
                setSelectedFiles([]);
                setTypeWriterActive(true)
                const assistantAnswer = selectedFiles.length > 0 ?  await postPublicSendMessage(myMessage.trim(), dataRef.current.chat_id, selectedFilesSend) : await postPublicSendMessage(myMessage.trim(), dataRef.current.chat_id, []);
                setSelectedFilesSend([]);
                await assistantAnswerAdd(assistantAnswer.message);
            }
            else{
                toggleModal('popupLoginModalOpen');
                console.log(storage.getNumber('publicViewChatMessageCount'));
            }
        }
    }

    const [firstMessageError, setFirstMessageError] = useState(false);
    const [lastMessageError, setLastMessageError] = useState(false);

    const sendMessage = async (myMessage) => {
        console.log(22, lastMessageError);
        if(lastMessageError){
            let talkScreenMessages = dataRef.current.messages;
            talkScreenMessages.pop();
            setTalkScreenData({...dataRef.current, messages: talkScreenMessages});
            setLastMessageError(false);
        }
        if(!myMessage || myMessage.trim() === ''){
            return;
        }
        if(storage.getBoolean('isLogined') === true){ // Kullanıcı girişi var
            if( await isNewChat() ) {
                setMessage('');
                setSelectedFiles([]);
                setTypeWriterActive(true)
                setTalkScreenData({ai_desc: state.selectedAi.description, assistantId: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: '', messages: [{content: myMessage, role: 'user'},{content: 'mesajGif',role: 'aigencyMobile'}]});

                const newChatData =  await postNewChat(state.selectedAi.id, myMessage);
                if(newChatData.message.message === "Yetersiz kredi. Lütfen daha fazla kredi yükleyin."){
                    setUserNeedCredit(true);
                    await assistantAnswerAdd(newChatData.message.message)
                    setTypeWriterActive(false)
                    setSelectedFilesSend([])
                }
                else{
                    if(newChatData.errorType){
                        await assistantErrorFirstAnswerAdd(myMessage, newChatData.message, newChatData.chat_id);
                        setTypeWriterActive(false)
                        setFirstMessageError(true)
                    }
                    else {
                        await assistantFirstAnswerAdd(myMessage, newChatData.message, newChatData.chat_id);
                        toggleState('viewChat', await getViewChat(state.selectedAi.id));
                        setSelectedFilesSend([])
                        setTimeout(() => {
                            flatListRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                    }
                }
            }
            else {
                await myMessageAdd(myMessage.trim());
                setMessage('');
                setSelectedFiles([]);
                setTypeWriterActive(true)
                const assistantAnswer = selectedFiles.length > 0 ? await postSendMessage(myMessage.trim(), dataRef.current.chat_id, selectedFilesSend) :  await postSendMessage(myMessage.trim(),  dataRef.current.chat_id,[]);
                console.log("internet hatası :   ",assistantAnswer);
                if(userNeedCredit){
                    setSelectedFilesSend([]);
                    await assistantAnswerAdd("Yetersiz kredi. Lütfen daha fazla kredi yükleyin.");
                }
                else {
                    if(assistantAnswer.errorType){
                        await assistantErrorAnswerAdd(assistantAnswer.message, myMessage);
                        setTypeWriterActive(false)
                        setLastMessageError(true)
                    }
                    else{
                        setSelectedFilesSend([]);
                        await assistantAnswerAdd(assistantAnswer.message);
                    }
                }
            }
        }
        else{  // Kullanıcı girişi yok
            if( await isNewChat() ) {
                storage.getNumber('publicViewChatCount') === undefined ? storage.set('publicViewChatCount', 1) : storage.set('publicViewChatCount', storage.getNumber('publicViewChatCount') + 1);
                storage.getNumber('publicViewChatMessageCount') === undefined ? storage.set('publicViewChatMessageCount', 1) : storage.set('publicViewChatMessageCount', storage.getNumber('publicViewChatMessageCount') + 1);
                console.log(storage.getNumber('publicViewChatCount'));
                if(storage.getNumber('publicViewChatCount') < 6) {
                    setMessage('');
                    setSelectedFiles([]);
                    setTypeWriterActive(true)
                    setTalkScreenData({ai_desc: state.selectedAi.description, assistantId: state.selectedAi.id, ai_name: state.selectedAi.name, chat_id: '', messages: [{content: myMessage, role: 'user'}]});

                    const newChatData = await postPublicNewChat(myMessage.trim());
                    console.log("bu yeni",newChatData);

                    await assistantFirstAnswerAdd(myMessage, newChatData.message, newChatData.chat_id);
                    setSelectedFilesSend([])
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
                storage.set('publicViewChatMessageCount', storage.getNumber('publicViewChatMessageCount') + 1);
                if(storage.getNumber('publicViewChatMessageCount') < 6) {
                    await myMessageAdd(myMessage.trim());
                    setMessage('');
                    setSelectedFiles([]);
                    setTypeWriterActive(true)
                    const assistantAnswer = selectedFiles.length > 0 ?  await postPublicSendMessage(myMessage.trim(), dataRef.current.chat_id, selectedFilesSend) : await postPublicSendMessage(myMessage.trim(), dataRef.current.chat_id, []);
                    setSelectedFilesSend([]);
                    await assistantAnswerAdd(assistantAnswer.message);
                }
                else{
                    toggleModal('popupLoginModalOpen');
                    console.log(storage.getNumber('publicViewChatMessageCount'));
                }
            }
        }
    };

    const resetTalkChatContent = () => {
        setTypeWriterActive(false)
        setFirstMessageError(false);
        setLastMessageError(false);
        setTalkScreenData({});
        toggleState("talkScreenData", {});
        storage.getBoolean('isLogined') ? '' : storage.set('publicViewChatMessageCount', 0);
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
            response.forEach((item) => {
                item.selectedFileType = "file";
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
                    response.assets.forEach((item) => {
                        item.selectedFileType = "photo";
                    })
                    console.log(response.assets);
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







    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [partialTranscript, setPartialTranscript] = useState('');
    const [isPaused, setIsPaused] = useState(false);  // Duraklatma durumu

    const voiceToText = (value) => {
        setMessage(message + " " + value);
    }
    useEffect(() => {
        Voice.onSpeechStart = () => console.log('Konuşma başladı');
        Voice.onSpeechEnd = () => console.log('Konuşma durdu');
        Voice.onSpeechResults = (event) => {
            console.log('SESİN SON HALİ:', event.value);
            setTranscript(event.value[0]);
        };
        Voice.onSpeechPartialResults = (event) => {
            console.log('Partial Results:', event.value);
            setPartialTranscript(event.value[0]);
        };

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const startListening = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.error('Mikrofon izni reddedildi.');
                return;
            }
        }

        try {
            await Voice.start('tr-TR');
            setIsListening(true);
            setIsPaused(false);
        } catch (error) {
            console.error('Voice başlatılamadı:', error);
        }
    };

    const stopListening = async (value) => {
        try {
            await Voice.stop();
            value ? voiceToText(transcript) : '';
            setIsListening(false);
            setIsPaused(false);
        } catch (error) {
            console.error('Voice durdurulamadı:', error);
        }
    };

    // ASİSTANT İSİM UZUNLUĞU
    const [textWidth, setTextWidth] = useState(0);
    const handleTextLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setTextWidth(width);
    };

    const [assistantMenu, setAssistantMenu] = useState(false);


    const lastMessageTypeWritterDeactive = async () => {
        setTypeWriterActive(false)
         await setTalkScreenData({
            ...dataRef.current,
            messages: dataRef.current.messages.map((msg, index) =>
                index === dataRef.current.messages.length - 1
                    ? { ...msg, isTyping: false }
                    : msg
            ),
        });
        toggleState('talkScreenData',dataRef.current);
    }
    const renameChat = async () => {
        setAssistantMenu(false);
        await lastMessageTypeWritterDeactive();
        setTimeout(()=>{
            toggleModal('renameChatModalOpen');
        },100)
    }

    const shareChat = async (message) => {
        setAssistantMenu(false);
        const shareOptions = {
            message: message,
        };
        try {
            await Share.open(shareOptions);
        } catch (error) {
            console.log('Paylaşma hatası:', error);
        }
    }
    const deleteChat = async () => {
        let assistantId = dataRef.current.assistantId;

        console.log("1",dataRef.current);
        console.log("2",dataRef.current.assistantId);
        setTimeout(()=>{
            resetTalkChatContent()
        },100)

        setAssistantMenu(false);

        await deleteChatApi(dataRef.current.chat_id)
        toggleState('viewChat', await getViewChat(assistantId));
    }


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
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss();
                                if(storage.getBoolean('isLogined')) {
                                    if((Object.keys(dataRef.current).length !== 0) && dataRef.current.chat_id.length !== 0) {
                                        setAssistantMenu(true);
                                        getShareChat(talkScreenData.chat_id);
                                    }
                                }
                            }}>
                            <Menu
                                visible={assistantMenu}
                                onDismiss={() => setAssistantMenu(false)}
                                contentStyle={{
                                    width: 230,
                                    borderRadius: 10,
                                    paddingVertical: 0,
                                    padding: 0,
                                    marginTop: 40,
                                    marginLeft: -((230-textWidth)/2),
                                    shadowColor: '#3e3e3e',
                                    backgroundColor: isDarkTheme ? "#0F1021" : "#fff",

                                }}
                                anchor={
                                    <Text
                                        onLayout={handleTextLayout}
                                        style={[styles.title, isDarkTheme ? styles.titleDarkTheme : styles.titleLightTheme]}
                                    >
                                        {storage.getBoolean('isLogined') ? toUpperCaseTurkish(String(state.selectedAi?.name?.name_tr)): 'ALPARSLAN'}
                                    </Text>
                                }
                            >
                                <Menu.Item
                                    onPress={() => {
                                        renameChat();
                                    }}
                                    title="Yeniden Adlandır"
                                    leadingIcon={({ size }) => (
                                        <Octicons name={'pencil'} size={20} color={'#7376aa'} />
                                    )}
                                    titleStyle={{
                                        color: isDarkTheme ? "#7376aa" : "#7376aa",
                                    }}

                                />
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: isDarkTheme ? "#070710" : "#E0E0E0",
                                        marginVertical: 5,
                                    }}
                                />

                                <Menu.Item
                                    onPress={() => {
                                        shareChat(storage.getString('shareChatLink'));
                                    }}
                                    title="Paylaş"
                                    leadingIcon={({ size }) => (
                                        <Image source={isDarkTheme ? require('../assets/images/share.png') : require('../assets/images/share.png')} style={{width: 20, height: 20}} />
                                    )}
                                    titleStyle={{
                                        color: isDarkTheme ? "#7376aa" : "#7376aa",
                                    }}
                                />
                                <View
                                    style={{
                                        height: 1,
                                        backgroundColor: isDarkTheme ? "#070710" : "#E0E0E0",
                                        marginVertical: 5,
                                    }}
                                />
                                <Menu.Item
                                    onPress={() => {
                                        deleteChat();
                                    }}
                                    title="Sil"
                                    leadingIcon={({ size }) => (
                                        <MaterialIcons name={'delete'} size={20} color={'#BD0B0B'} />
                                    )}
                                    titleStyle={{
                                        color: isDarkTheme ? "#7376aa" : "#7376aa",
                                    }}
                                />

                            </Menu>
                        </TouchableOpacity>
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
                            data={talkScreenData?.messages?.filter((item) => item.role === 'user' || item.role === 'assistant' || item.role === 'aigencyMobile' || item.role === 'internetError')}
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
                                                            {
                                                                Platform.OS !== 'android'
                                                                    ? <Image style={{width: 70, height: 70, borderRadius: 5}} source={{ uri: item.uri}} />
                                                                    : item.selectedFileType === 'file' ? <Image style={{width: 60, height: 60,marginTop: 10, borderRadius: 5}} source={isDarkTheme ? require("../assets/images/pdfLight.png") : require("../assets/images/pdf.png")} /> : <Image style={{width: 60, height: 60,marginTop: 10, borderRadius: 5}} source={{ uri: item.uri}} />
                                                            }
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        </ScrollView>
                                    </View>
                                }
                                <View style={[styles.textInputBox, isDarkTheme ? styles.textInputBoxDarkTheme : styles.textInputBoxLightTheme, {minHeight: selectedFiles.length > 0 ? 46 : 46}]}>
                                    {
                                        !isListening
                                            ? (
                                                <>
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
                                                    </TouchableOpacity>
                                                    <TextInput
                                                        //editable={!typeWriterActive}
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
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            isListening ? stopListening() : startListening();
                                                        }}
                                                        style={styles.inputBoxMicrofonIconBox}>
                                                        <Image
                                                            source={require('../assets/images/mic.png')}
                                                            style={styles.inputBoxMicrofonIcon}/>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        disabled={typeWriterActive}
                                                        style={styles.inputBoxSendIconBox}
                                                        onPress={() => {
                                                            if (firstMessageError) {
                                                                console.log(111)
                                                                reSendFirstMessage(message)
                                                            }
                                                            else {
                                                                console.log(222)
                                                                sendMessage(message)
                                                            }
                                                        }}
                                                    >
                                                        <Image source={require('../assets/images/send.png')} style={styles.inputBoxSendIcon}/>
                                                    </TouchableOpacity>
                                                </>
                                            )
                                            : (
                                                <View style={{paddingHorizontal: 8, width: "100%",height: '100%',flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            stopListening(false);
                                                        }}
                                                        style={{width: 30, height: 30,justifyContent: 'center', alignItems:'center', borderRadius: 100, borderWidth: 1.8, borderStyle: "dashed", borderColor: '#7376AA'}}>
                                                        <Image
                                                            source={require('../assets/images/microfonCloseDark.png')}
                                                            style={styles.inputBoxMicrofonIcon}/>
                                                    </TouchableOpacity>
                                                    <View
                                                        style={{width: 30, height: 30,justifyContent: 'center', alignItems:'center', borderRadius: 100}}>
                                                        <Image
                                                            source={require('../assets/images/microfonActive.png')}
                                                            style={styles.inputBoxMicrofonIcon}/>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            stopListening(true);

                                                        }}
                                                        style={{width: 30, height: 30,justifyContent: 'center', alignItems:'center', borderRadius: 100,backgroundColor: '#7376AA'}}>
                                                        <Image
                                                            source={require('../assets/images/checkLight.png')}
                                                            style={styles.inputBoxMicrofonIcon}/>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                    }
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

        width: '100%',
        borderRadius: 6,
        padding: 10,
        gap: 10,
        flexDirection:'row',
    } ,
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
        width: '100%',
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
