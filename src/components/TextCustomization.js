import {Text} from "react-native";
import React from "react";
import MathView from 'react-native-math-view';



export const TextCustomization = ( value ) => {
    console.log( value );
    const regex = /(\*\*.*?\*\*|\\\[.*?\\\]|---.*?---|\\\(.*?\\\)|`.*?`)/g;
    const parts = value.split(regex);
    console.log(parts);
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
        else if (/---.*/.test(part)) {
            const boldText = part.replace(/---/g, '');
            return (
                <Text key={index} style={{ fontStyle: 'italic' }}>
                    {boldText}
                </Text>
            );
        }
        else {
            return (
                <Text key={index}>
                    {part.replaceAll(/###/g, '')}
                </Text>
            );
        }
    });
}


{/*
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
} from "react-native";
import { Icon } from "react-native-elements";
import { Provider, Menu, Divider } from "react-native-paper";

interface HeaderProps {
    onLeftPress?: () => void;
    onRightPress?: () => void;
    title?: string;
    style?: ViewStyle;
    theme: "Koyu" | "Açık";
}

const Header: React.FC<HeaderProps> = ({
                                           onLeftPress,
                                           onRightPress,
                                           title = "ALPARSLAN",
                                           style,
                                           theme,
                                       }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    // يمكنك تعديل اللون فيما يلائم التصميم العام للتطبيق
    const commonColor = theme === "Koyu" ? "#7376aa" : "#7376aa";

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <Provider>
            <View
                style={[
                    styles.header,
                    style,
                    {
                        backgroundColor: theme === "Koyu" ? "#070710" : "#FFFFFF",
                        borderBottomColor: theme === "Koyu" ? "#0F1021" : "#f1f0fd",
                    },
                ]}
            >

                <TouchableOpacity
                    onPress={onLeftPress || (() => {})}
                    accessibilityLabel="Open menu"
                    accessibilityRole="button"
                >
                    <Icon name="menu" type="feather" color={commonColor} size={28} />
                </TouchableOpacity>


                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={
                        <TouchableOpacity
                            onPress={openMenu}
                            style={{ alignItems: "center" }}
                        >
                            <Text style={[styles.title, { color: commonColor }]}>
                                {title}
                            </Text>
                        </TouchableOpacity>
                    }
                    contentStyle={[
                        styles.menuContent,
                        {
                            alignSelf: "center",
                            backgroundColor: theme === "Koyu" ? "#0F1021" : "#FFFFFF",
                        },
                    ]}
                >
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                        }}
                        title="Ayrıntıları Görüntüle"
                        leadingIcon={({ size }) => (
                            <Icon
                                name="information-outline"
                                type="material-community"
                                size={size}
                                color={theme === "Koyu" ? "#7376aa" : "#7376aa"}
                            />
                        )}
                        titleStyle={{
                            color: theme === "Koyu" ? "#7376aa" : "#7376aa",
                        }}
                    />
                    <View
                        style={{
                            height: 1,
                            backgroundColor: theme === "Koyu" ? "#070710" : "#E0E0E0",
                            marginVertical: 5,
                        }}
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                        }}
                        title="Paylaşma"
                        leadingIcon={({ size }) => (
                            <Icon
                                name="archive-outline"
                                type="material-community"
                                size={size}
                                color={theme === "Koyu" ? "#7376aa" : "#7376aa"}
                            />
                        )}
                        titleStyle={{
                            color: theme === "Koyu" ? "#7376aa" : "#7376aa",
                        }}
                    />
                    <View
                        style={{
                            height: 1,
                            backgroundColor: theme === "Koyu" ? "#070710" : "#E0E0E0",
                            marginVertical: 5,
                        }}
                    />
                    <Menu.Item
                        onPress={() => {
                            closeMenu();
                        }}
                        title="Sil"
                        leadingIcon={({ size }) => (
                            <Icon
                                name="delete-outline"
                                type="material-community"
                                size={size}
                                color={theme === "Koyu" ? "#7376aa" : "#7376aa"}
                            />
                        )}
                        titleStyle={{
                            color: theme === "Koyu" ? "#7376aa" : "#7376aa",
                        }}
                    />
                </Menu>

                <TouchableOpacity
                    onPress={onRightPress || (() => {})}
                    accessibilityLabel="Add item"
                    accessibilityRole="button"
                >
                    <Icon
                        name="add-circle-outline"
                        type="material"
                        color={commonColor}
                        size={28}
                    />
                </TouchableOpacity>
            </View>
        </Provider>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        height: 60,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    menuContent: {
        paddingVertical: 0, // تحكم في مسافات عناصر القائمة
    },
});
*/}
