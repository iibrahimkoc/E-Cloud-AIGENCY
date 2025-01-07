import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-web-swiper";
import Ionicons from "react-native-vector-icons/Ionicons";
import {storage} from "../components/Storage"; // استيراد الأيقونات

export default function Onboarding({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const slides = [
    {
      image: require("../assets/images/onboard_image1.jpg"),
      title: "Welcome to Amigo, Great Friend to Chat",
      subtitle:
        "Proin molestie pulvinar vitae enim erat morbi eu. Malesuada eros nisi augue.",
      buttonText: "Next",
    },
    {
      image: require("../assets/images/onboard_image2.jpg"),
      title: "Accelerate Your Learning with Amigo",
      subtitle:
        "Pulvinar in et eu volutpat mauris viverra ut orci. Lacus placerat volutpat pharetra a.",
      buttonText: "Next",
    },
    {
      image: require("../assets/images/onboard_image3.jpg"),
      title: "The Intelligent Way to Get Started",
      subtitle:
        "Quisque blandit risus duis odio. In pretium nibh velit a aenean vitae porta euismod.",
      buttonText: "Get Started",
    },
  ];

  const handleDotPress = (index) => {
    setActiveIndex(index);
    swiperRef.current?.goTo(index);
  };

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      swiperRef.current?.goTo(activeIndex + 1);
    } else {
      navigation.navigate("MainApp");
      storage.set('!firstOpen', true);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      swiperRef.current?.goTo(activeIndex - 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#070710" }}>
      <Swiper
        ref={swiperRef}
        controlsEnabled={false}
        loop={false}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            {/* الصورة */}
            <Image
              source={slide.image}
              style={styles.image}
              resizeMode="cover"
            />
            {/* العنوان */}
            <Text style={styles.title}>{slide.title}</Text>
            {/* الوصف النصي */}
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </Swiper>

      {/* النقاط */}
      <View style={styles.pagination}>
        {slides.map((_, dotIndex) => (
          <TouchableOpacity
            key={dotIndex}
            onPress={() => handleDotPress(dotIndex)}
            style={[styles.dot, activeIndex === dotIndex && styles.activeDot]}
          />
        ))}
      </View>

      {/* أزرار Skip أو Back و Next/Get Started */}
      <View style={styles.footerButtons}>
        {activeIndex === slides.length - 1 ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backText}>Geri</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              navigation.navigate("MainApp");
              storage.set('!firstOpen', true);
            }}
          >
            <Text style={styles.skipText}>Geç</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={
            activeIndex === slides.length - 1
              ? styles.getStartedButton
              : styles.iconButton
          }
          onPress={handleNext}
        >
          {activeIndex === slides.length - 1 ? (
            <Text style={styles.buttonText}>Hadi başlayalım</Text>
          ) : (
            <Image style={{width: 40,height: 40}} source={require('../assets/images/arrowRight.png')}/>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center", // تمركز العناصر في منتصف الشاشة
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40, // تقليل المسافة العمودية داخل الشاشة
  },
  image: {
    width: 200, // حجم مناسب للصورة
    height: 200, // ارتفاع مناسب للصورة
    marginBottom: 50, // مسافة مناسبة أسفل الصورة
    borderRadius: 10, // جعل الحواف دائرية بشكل كامل
    overflow: "hidden", // لضمان أن الحواف الدائرية تُطبق بشكل صحيح
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    color: "#7064E9",
    marginBottom: 10, // مسافة أسفل العنوان
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#7476AA",
    lineHeight: 22,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#272350",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#7064E9",
    width: 12,
    height: 12,
  },
  footerButtons: {
    flexDirection: "row", // محاذاة العناصر أفقيًا
    justifyContent: "space-between", // توزيع العناصر بالتساوي
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 50, // مسافة أسفل الأزرار
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipText: {
    color: "#7064E9", // لون النص Skip
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backText: {
    color: "#7064E9", // لون النص Back
    fontSize: 16,
    fontWeight: "bold",
  },
  iconButton: {
    backgroundColor: "#7064E9", // لون الخلفية للأيقونة
    width: 50, // عرض أصغر للأيقونة
    height: 50, // طول أصغر للأيقونة
    borderRadius: 10, // نصف القطر لجعلها دائرية
    justifyContent: "center",
    alignItems: "center",
  },
  getStartedButton: {
    backgroundColor: "#7064E9", // لون الخلفية
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "bold",
  },
});
