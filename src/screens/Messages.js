import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { CheckBox } from "react-native-elements";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import SwiperFlatList from "react-native-swiper-flatlist";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
// import i18n from "./src/i18n";

export default function Messages() {
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/*Search  */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to right, #257BFF, #00BAFA)",
          padding: 20,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 30,
          }}
        >
          <AntDesignIcon name="search1" size={18} color="#fff" />
          <Text style={{ color: "#eee", fontSize: 18 }}>Search</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 30,
          }}
        >
          <MaterialCommunityIconsIcon
            name="qrcode-scan"
            size={18}
            color="#fff"
          />
          <AntDesignIcon name="plus" size={18} color="#fff" />
        </View>
      </View>
      {/* Tab change */}
      <View
        style={{
          width: "100%",
          paddingLeft: 15,
          paddingRight: 15,
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "flex-start",
          gap: 30,
        }}
      >
        <Text
          style={{
            borderBottom: "1px solid black",
            fontSize: 16,
            fontWeight: "bold",
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          Focused
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            paddingTop: 10,
            paddingBottom: 10,
            color: "#6E6E6E",
          }}
        >
          Other
        </Text>
      </View>
      {/* Component box tin nhắn, 3 loại: hệ thống, nhóm,  người bth*/}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#ccc",
          paddingLeft: 5,
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/Auth/1.PNG")}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            resizeMode: "cover",
            margin: 15,
            marginRight: 20,
          }}
        />
        <View>
          <Text style={{ fontSize: 18, fontWeight: 500 }}>My Cloud</Text>
          <Text style={{ fontSize: 16, fontWeight: 500, color: "#848C8F" }}>
            Lorem kid
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 450,
            color: "#848C8F",
            position: "absolute",
            right: 15,
            top: 15,
          }}
        >
          23 hours
        </Text>
      </View>
    </View>
  );
}
