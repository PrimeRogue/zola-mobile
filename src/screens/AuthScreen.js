import React from "react";
import { useState, useRef, useEffect } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
import { useNavigation } from "@react-navigation/native";

export default function AuthScreen({ route }) {
  const [isEN, setIsEN] = useState(false);
  const navigation = useNavigation();
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: "white",
      }}
    >
      {/* Zalo logo */}
      <Text style={{ fontSize: "40px", color: "teal", fontWeight: "bold" }}>
        Zola
      </Text>
      {/* Slider */}
      <SwiperFlatList
        autoplay
        autoplayDelay={1}
        autoplayLoop
        showPagination
        paginationActiveColor="#0690F8"
        paginationDefaultColor="#D5D5D5"
        paginationStyle={{
          position: "absolute",
          top: 200,
          //   transform: translateY(30),
        }}
        paginationStyleItem={{
          height: 10,
          width: 10,
          borderRadius: "50%",
        }}
        index={0}
        style={{
          width: "100%",
          display: "flex",
          gap: 5,
        }}
      >
        {authScreenSlider.map((item) => (
          <View
            key={item.id}
            style={{
              width: "100vw",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Image
              source={item.image}
              style={{
                width: "100%",
                height: 260,
                resizeMode: "contain",
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              {isEN ? item.titleTran : item.title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#8C9093",
                paddingLeft: 15,
                paddingRight: 15,
                textAlign: "center",
              }}
            >
              {isEN ? item.descTran : item.desc}
            </Text>
          </View>
        ))}
      </SwiperFlatList>
      {/* Button */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "50%",
            borderRadius: 30,
            padding: 15,
            backgroundColor: "teal",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("LoginScreen", { navigation });
          }}
        >
          <Text style={{ color: "#fff", fontWeight: 500 }}>
            {isEN ? "LOG IN" : "ĐĂNG NHẬP"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "50%",
            borderRadius: 30,
            padding: 15,
            backgroundColor: "teal",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("RegisterScreen", { navigation });
          }}
        >
          <Text style={{ color: "#fff", fontWeight: 500 }}>
            {isEN ? "SIGN UP" : "ĐĂNG KÝ"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Tab */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 30,
          marginTop: 40,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity onPress={() => setIsEN(false)}>
          <Text
            style={{
              fontWeight: 500,
              borderBottomColor: isEN == false ? "#000" : "",
              borderBottomWidth: isEN == false ? 1 : 0,
              paddingBottom: 5,
              fontSize: 16,
            }}
          >
            Tiếng Việt
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsEN(true)}>
          <Text
            style={{
              fontWeight: 500,
              borderBottomColor: isEN == true ? "#000" : "",
              borderBottomWidth: isEN == true ? 1 : 0,
              paddingBottom: 5,
              fontSize: 16,
            }}
          >
            English
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const authScreenSlider = [
  {
    id: "1",
    image: {
      uri: "https://res.cloudinary.com/drqbhj6ft/image/upload/v1713484698/1_ae8hsg.png",
    },
    title: "Gọi video ổn định",
    desc: "Trò chuyện thật đã với chất lượng video ổn định mọi lúc, mọi nơi",
    titleTran: "Stable video calling",
    descTran: "Chat for real with stable video quality anytime, anywhere",
  },
  {
    id: "2",
    image: {
      uri: "https://res.cloudinary.com/drqbhj6ft/image/upload/v1713484698/2_xohccl.png",
    },
    title: "Chat nhóm tiện ích",
    desc: "Nơi cùng nhau trao đổi, giữ liên lạc với gia đình, bạn bè, đồng nghiệp...",
    titleTran: "Utility group chat",
    descTran:
      "A place to exchange and keep in touch with family, friends, colleagues...",
  },
  {
    id: "3",
    image: {
      uri: "https://res.cloudinary.com/drqbhj6ft/image/upload/v1713484698/3_flmawl.png",
    },
    title: "Gọi video ổn định",
    desc: "Trò chuyện thật đã với chất lượng video ổn định mọi lúc, mọi nơi",
    titleTran: "Stable video calling",
    descTran: "Chat for real with stable video quality anytime, anywhere",
  },
  {
    id: "4",
    image: require("../../assets/Auth/1.PNG"),
    title: "Gọi video ổn định",
    desc: "Trò chuyện thật đã với chất lượng video ổn định mọi lúc, mọi nơi",
    titleTran: "Stable video calling",
    descTran: "Chat for real with stable video quality anytime, anywhere",
  },
];
