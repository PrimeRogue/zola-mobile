import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import userApi from "../api/UserApi";
import { FontAwesomeIcon } from "../utils/IconUtils";
import { useFocusEffect } from "@react-navigation/native";

const PersonalScreen = () => {
  const [me, setMe] = useState({});
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  const getMe = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const me = await userApi.getMe(accessToken);
      console.log(me);
      setMe(me);
    } catch (error) {
      console.error(error.code);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getMe();
      setIsUpdated(false);
    }, [])
  );

  const handleUpdateBio = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      setIsUpdated(true);
      const data = await userApi.updateUser(accessToken, name, dob, bio);
    } catch (error) {
      console.error(error.code);
    }
  };
  return (
    <View
      style={{
        height: "100vh",
        backgroundColor: "#fff",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <View
        style={{ height: "30vh", width: "100%", backgroundColor: "teal" }}
      ></View>
      <View style={{ height: "70vh", width: "100%" }}></View>
      <View
        style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          left: "50%",
          transform: "translate(-50%, -140%)",
        }}
      >
        {me.photoUrl && (
          <Image
            source={{ uri: me.photoUrl }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              resizeMode: "cover",
            }}
          ></Image>
        )}

        {!me.photoUrl && (
          <FontAwesomeIcon
            name="user-circle"
            color="#A0AEC0"
            size={150}
          ></FontAwesomeIcon>
        )}
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 55,
          padding: 15,
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "teal" }}>
            Tên:
          </Text>
          <TextInput
            style={{
              height: 40,
              width: "70%",
              backgroundColor: "transparent",
              color: "#8C8F91",
              fontSize: 18,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 5,
              paddingLeft: 5,
            }}
            placeholder={me.displayName}
            // value={me.displayName}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "teal" }}>
            Email:
          </Text>
          <TextInput
            style={{
              height: 40,
              width: "70%",
              backgroundColor: "transparent",
              color: "#8C8F91",
              fontSize: 18,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 5,
              paddingLeft: 5,
            }}
            placeholder={me.email}
            // value={me.displayName}
            // onChangeText={(text) => setMessageText(text)}
          />
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "teal" }}>
            Bio:
          </Text>
          <TextInput
            multiline={true}
            numberOfLines={4}
            style={{
              height: 100,
              width: "70%",
              backgroundColor: "transparent",
              color: "#8C8F91",
              fontSize: 18,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 5,
              paddingLeft: 5,
            }}
            placeholder={me.bio}
            // value={me.displayName}
            onChangeText={(text) => setBio(text)}
          />
        </View>
        <TouchableOpacity
          style={{
            height: 40,
            width: "fit-content",
            borderRadius: 7,
            padding: 7,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: isUpdated ? "#ccc" : "teal",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleUpdateBio}
        >
          <Text style={{ fontSize: 18, fontWeight: "450", color: "#fff" }}>
            Cập nhật
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonalScreen;
