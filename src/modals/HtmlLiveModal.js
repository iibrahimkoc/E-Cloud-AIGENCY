import React, {useContext, useRef, useState} from 'react';
import {
    Modal, SafeAreaView,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {StateContext} from '../context/StateContext';

const HtmlLiveModal = ({toggleModal, htmlLiveModalVisible}) => {

    const {state} = useContext(StateContext);
    const [htmlViewVisible, setHtmlViewVisible] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const inactivityTimerRef = useRef(null);

    const resetInactivityTimer = () => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        setShowCloseButton(false);
        inactivityTimerRef.current = setTimeout(() => {
            setShowCloseButton(true);
        },1000);
    };

    const handleTouch = () => {
        resetInactivityTimer();
    };

    const openHtmlView = () => {
        setHtmlViewVisible(true);
        resetInactivityTimer();
    };

    const closeHtmlView = () => {
        toggleModal('htmlLiveModalClose');
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
    };

    return (
        <Modal
            visible={htmlLiveModalVisible}
            animationType={'slide'}
            transparent={true}
            onRequestClose={() => toggleModal('settingModalClose')}
        >
            <View
                style={styles.htmlViewOverlay}
            >
                <SafeAreaView
                    style={{
                        flex: 1,
                        backgroundColor:'black',
                        paddingTop: 48,
                    }}
                    edges={[]}
                >
                    <WebView
                        style={{backgroundColor: 'black',flex:1,zIndex:-1}}
                        originWhitelist={['*']}
                        source={{ html: state.htmlContent}}
                        onTouchStart={handleTouch}
                    />
                    {showCloseButton && (
                        <View
                            style={{
                                position: 'absolute',
                                zIndex: 1,
                                bottom: 40,
                                width: '100%',
                                paddingRight: 20,
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}
                        >
                            <TouchableOpacity
                                onPress={closeHtmlView}
                                style={{
                                    width: 50,
                                    height: 50,
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    borderRadius: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Image
                                    style={{width: 30, height: 30}}
                                    source={require('../assets/images/closeLight.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </SafeAreaView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    htmlViewOverlay: {
        flex: 1,
        zIndex: 1,
    }

});


export default HtmlLiveModal;

