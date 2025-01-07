import React, {useContext, useState} from "react";
import {View, Text, StyleSheet,SafeAreaView, TouchableOpacity, Image} from "react-native";
import Swiper from "react-native-web-swiper";
import LinearGradient from "react-native-linear-gradient";
import {StateContext} from "../context/StateContext";


export default function AccountUpgradeScreen({navigation}) {
    const { state } = useContext(StateContext);
    const [activeIndex, setActiveIndex] = useState(0);

    const [isMonthly, setIsMonthly] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{marginTop: 10,width: '100%',justifyContent:'center',alignItems: 'center',}}>
                <View style={{width:'60%',height:70,padding: 7,borderColor: 'rgba(48,48,58,0.7)',borderWidth:2,borderRadius:50,justifyContent:'center', alignItems: 'center',flexDirection: 'row'}}>
                    <TouchableOpacity
                        onPress={() => {
                            setIsMonthly(true)
                            setActiveIndex(0)
                        }}
                        style={{width:'50%',height: '100%',borderRadius: 100,alignItems: 'center', justifyContent: 'center',backgroundColor: isMonthly ? 'rgb(107,97,208)' : 'transparent'}}>
                        <Text style={{color: 'white'}}>Aylık</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setIsMonthly(false)
                            setActiveIndex(0)
                        }}
                        style={{width:'50%',height: '100%',borderRadius: 100,alignItems: 'center', justifyContent: 'center',backgroundColor: !isMonthly ? 'rgb(107,97,208)' : 'transparent'}}>
                        <Text style={{color: 'white'}}>Yıllık</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Swiper
                containerStyle={{height: 580}}
                key={isMonthly}
                controlsEnabled={false}
                loop={false}
                onIndexChanged={(index) => setActiveIndex(index)}
            >
                {state.pricingList.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <LinearGradient
                            colors={["#070710", "#070710"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardBackground}
                        >
                            <Text style={styles.planTitle}>{item.package_name.tr}</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.planPrice}>{isMonthly ? item.monthly_price : item.yearly_price}</Text>
                                <Text style={styles.currency}>₺</Text>
                            </View>

                            <Text style={styles.planCredits}>{item.credit}</Text>

                            <View style={styles.lineContainer}>
                                <LinearGradient
                                    colors={["#0d0e22", "#443a87", "#0d0e22"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.line}
                                />
                            </View>

                            <View style={styles.features}>
                                {item.highlight.map((highlight, index) => (
                                    <View key={index} style={styles.featureRow}>
                                        <Image
                                            style={{width: 15, height: 15,marginRight: 7}}
                                            source={highlight.status === '1'
                                                ? require("../assets/images/check-circle.png")
                                                : require("../assets/images/minus-circle.png")}
                                        />
                                        <Text
                                            style={[
                                                styles.featureText,
                                                highlight.status === '2'
                                                    ? { color: "#7376aa" }
                                                    : { color: "#7376aa" },
                                                highlight.status === '1'
                                                    ? {textDecorationLine: "none"}
                                                    : {textDecorationLine: 'line-through'}
                                            ]}
                                        >
                                            {highlight.tr}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity style={styles.button}>
                                <LinearGradient
                                    colors={["#dd00ac", "#7130c3", "#410093"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.buttonBackground}
                                >
                                    <Text style={styles.buttonText}>Satın Al</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                ))}
            </Swiper>

            <View style={styles.pagination}>
                {state.pricingList.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            activeIndex === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{width:'100%',justifyContent:'center', alignItems: 'center',marginTop:20}}>
                <Image
                    style={{width:40, height:40}}
                    source={require('../assets/images/close.png')}/>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1021",
    },
    card: {
        width: '100%',
        marginTop: 30,
        alignItems: "center",
    },
    cardBackground: {
        width: "80%",
        borderRadius: 15,
        padding: 25,
        alignItems: "flex-start",
        justifyContent: "center",
        height: 550,
    },
    planTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#7376aa",
        marginBottom: 8,
        textAlign: "center",
        width: "100%",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        width: "100%",
    },
    planPrice: {
        fontSize: 65,
        fontWeight: "bold",
        color: "#a9a6c1",
    },
    currency: {
        fontSize: 24,
        color: "#a9a6c1",
        marginLeft: 5,
    },
    planCredits: {
        fontSize: 14,
        color: "#7376aa",
        marginBottom: 20,
        textAlign: "center",
        width: "100%",
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
    features: {
        alignItems: "flex-start",
        width: "100%",
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    icon: {
        marginRight: 10,
    },
    featureText: {
        fontSize: 16,
    },
    button: {
        width: "100%",
        borderRadius: 10,
        overflow: "hidden",
        marginTop: "auto",
    },
    buttonBackground: {
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    pagination: {
        height:0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#070710",
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: "#410093",
        width: 12,
        height: 12,
    },
});
