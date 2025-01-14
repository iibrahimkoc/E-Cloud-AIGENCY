import React, {useCallback, useContext, useState} from 'react';
import {
    Modal,
    View,
    StyleSheet,
    Dimensions,
    Text, TouchableOpacity, TouchableNativeFeedback, Image, TextInput,
} from 'react-native';

import { StateContext } from '../context/StateContext';
import { ThemeContext } from '../context/ThemeContext';

import LinearGradient from 'react-native-linear-gradient';
import {postRenameChat} from "../mobil_api_fetch/PostRenameChat";
import {getViewChat} from "../mobil_api_fetch/GetViewChat";

const { width } = Dimensions.get('window');

const RenameChatModal = ({ toggleModal, renameChatModalVisible}) => {
    const { state, toggleState } = useContext(StateContext);
    const { isDarkTheme } = useContext(ThemeContext);

    const [renameChatText, setRenameChatText] = useState('');
    const handleChangeRenameChatText = useCallback((text) => {
        setRenameChatText(text);
    }, []);

    const renameFunc = async () => {
        if (renameChatText.trim().length > 0) {
            console.log(renameChatText);
            console.log(state.talkScreenData.chat_id);
            const renameResult = await postRenameChat(state.talkScreenData.chat_id, renameChatText);
            toggleModal('renameChatModalClose');
            if (renameResult.status) {
                toggleState('viewChat', await getViewChat(state.talkScreenData.assistantId));
            }
        }
    }

    return (
        <Modal
            animationType={'fade'}
            transparent={true}
            visible={renameChatModalVisible}
            onRequestClose={() => toggleModal('renameChatModalClose')}
        >
            <TouchableNativeFeedback
                onPress={() => toggleModal('renameChatModalClose')}
            >
                <View style={styles.creditModalOverlay}>
                    <TouchableNativeFeedback>
                        <View style={styles.container}>
                            <View style={[styles.popupBox, isDarkTheme ? styles.popupBoxDarkTheme : styles.popupBoxLightTheme]}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 }}>
                                    <TouchableOpacity
                                        style={[styles.backButton , {backgroundColor: isDarkTheme ? "#7376aa" : '#f1f0fd'}]}
                                        onPress={() => toggleModal('renameChatModalClose')}
                                    >
                                        <Image source={require('../assets/images/close.png')} style={styles.backButtonIcon} />
                                    </TouchableOpacity>
                                    <Text
                                        style={[
                                            styles.modalTitle,
                                            { color: isDarkTheme ? "#7376aa" : "#7376aa" },
                                        ]}
                                    >
                                        Sohbeti Yeniden Adlandır
                                    </Text>
                                    <View style={styles.backButton}></View>
                                </View>

                                <View style={styles.lineContainer}>
                                    <LinearGradient
                                        colors={
                                            isDarkTheme
                                                ? ["#0d0e22", "#410093", "#0d0e22"]
                                                : ["#E0E0E0", "#7130c3", "#E0E0E0"]
                                        }
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.line}
                                    />
                                </View>

                                <View style={[styles.inputContainer, {borderColor: isDarkTheme ? '#7376aa': 'black'}]}>
                                <TextInput
                                    placeholder={'Sohbeti yeni adı'}
                                    keyboardType='ascii-capable'
                                    placeholderTextColor={isDarkTheme ? "#7376aa" : "#7376aa"}
                                    style={[styles.input,{color: isDarkTheme ? '#fff' : '#000'} , isDarkTheme ? styles.inputDarkTheme : styles.inputLightTheme]}
                                    onChangeText={handleChangeRenameChatText}
                                    autoCapitalize="none"
                                    textContentType="none"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                    autoComplete="off"
                                />
                                </View>

                                <TouchableOpacity
                                    disabled={renameChatText.trim().length === 0}
                                    style={styles.registerButtonContainer}
                                    onPress={() => {renameFunc()}}
                                >
                                    <LinearGradient
                                        colors={["#dd00ac", "#7130c3", "#410093"]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.registerButton}
                                    >
                                        <Text style={styles.registerButtonText}>Yeniden Adlandır</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </TouchableNativeFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    creditModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(7,7,16,0.6)',
    },
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupBox: {
        width: '90%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    popupBoxDarkTheme: {
        backgroundColor: 'rgba(17,17,37,0.6)',
    },
    popupBoxLightTheme: {
        backgroundColor: 'rgba(255,255,255,1)',
    },


    backButton: {
        width: 25,
        height: 25,
        borderRadius: 50,
        padding: 5,
    },
    backButtonIcon: {
        width: '100%',
        height: '100%',
    },

    modalTitle: {
        fontSize: 18,
        color: "#FFF",
        fontWeight: "bold",
        textAlign: "center",
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

    popupMessage: {
        fontSize: 14,
        color: "#7376aa",
        textAlign: "center",
        marginBottom: 20,
    },
    registerButtonContainer: {
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: "5%",
    },
    registerButton: {
        borderRadius: 10,
        paddingVertical: 18,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    registerButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
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
});

export default RenameChatModal;
