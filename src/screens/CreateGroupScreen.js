import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  CheckBox,
} from "react-native";
import {
  AntDesignIcon,
  MaterialCommunityIconsIcon,
  IoniconsIcon,
  MaterialIconsIcon,
  OcticonsIcon,
  EntypoIcon,
} from "../utils/IconUtils";

import { useNavigation } from "@react-navigation/native";
import { Button, KeyboardAvoidingView, ScrollView } from "react-native-web";
import conversationApi from "../api/ConversationApi";
import TextMessage from "../components/message/TextMessage";
import { format } from "date-fns";
import ImageMessage from "../components/message/ImageMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSocket } from "../utils/SocketUtils";
import EmojiPicker from "emoji-picker-react";
import * as ImagePicker from "expo-image-picker";
import contactApi from "../api/ContactApi";
export default function CreateGroupScreen({ route }) {
  const [groupName, setGroupName] = useState("");
  const [eligible, setEligible] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [allFriendData, setAllFriendData] = useState([]);
  const [cloneAllFriendData, setCloneAllFriendData] = useState([]);
  const { navigation, setIsCreateGroup } = route.params;
  const [accessToken, setAccessToken] = useState("");
  const [checkedValues, setCheckedValues] = useState(
    Array(allFriendData.length).fill(false)
  );

  const handleCheckBoxChange = (index) => {
    const newCheckedValues = [...checkedValues];
    newCheckedValues[index] = !newCheckedValues[index];
    setCheckedValues(newCheckedValues);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      allowsMultipleSelection: true,
      quality: 1,
    });
    setSelectedImage(result.assets[0].uri);
  };

  // fecth Danh sách bạn bè
  // 2. Fetch danh sách Contact đề xuất
  useEffect(() => {
    const getAllContactAndFriend = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        setAccessToken(accessToken);
        console.log("get access token:", accessToken);
        const allFriendData = await contactApi.getAllFriend(accessToken);
        setAllFriendData(allFriendData);
        setCloneAllFriendData(allFriendData);
      } catch (error) {
        console.error(error.code);
      }
    };

    getAllContactAndFriend();
  }, [accessToken]);

  // 3. Tạo nhóm
  const handleCreateGroup = async () => {
    try {
      const participantIds = allFriendData
        .filter((item, index) => checkedValues[index]) // Lọc ra các mục đã được chọn
        .map(({ friend }) => friend.id);
      const accessToken = await AsyncStorage.getItem("accessToken");
      setAccessToken(accessToken);

      if (
        checkedValues.filter((item) => item === true).length > 1 &&
        groupName.trim() !== ""
      ) {
        const data = await conversationApi.createConversation(
          participantIds,
          groupName,
          accessToken
        );
        setIsCreateGroup(true);
        navigation.goBack();
      }
    } catch (error) {
      console.error(error.message + "--" + error.code);
    }
  };

  useEffect(() => {
    console.log(checkedValues);
  }, [groupName, checkedValues]);
  return (
    <KeyboardAvoidingView
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      {/*Header  */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: "teal",
          padding: 15,
          gap: 15,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesignIcon name="arrowleft" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#eee", fontSize: 18, fontWeight: "bold" }}>
          Tạo nhóm mới
        </Text>
      </View>
      {/* Cập nhật ảnh và tên nhóm */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 15,
          margin: 15,
          width: "100%",
          paddingLeft: 15,
          paddingRight: 15,
          alignItems: "stretch",
        }}
      >
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            borderRadius: "50%",
            borderWidth: 1,
            borderColor: "#ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handlePickImage}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            ></Image>
          ) : (
            <EntypoIcon name="camera" size={25} color="black" />
          )}
        </TouchableOpacity>
        <TextInput
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            color: "#8C8F91",
            flexGrow: 1,
            fontSize: 18,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 5,
            paddingLeft: 5,
          }}
          onChangeText={(text) => setGroupName(text)}
          value={groupName}
          placeholder="Nhập tên nhóm"
          autoCapitalize="none"
        />
      </View>
      {/* Tìm kiếm bạn bè */}
      <View style={{ width: "100%", paddingLeft: 15, paddingRight: 15 }}>
        <TextInput
          style={{
            width: "100%",
            height: 50,
            borderColor: "#ccc",
            borderWidth: 1,
            backgroundColor: "transparent",
            color: "#8C8F91",
            paddingLeft: 5,
            paddingRight: 5,
            borderRadius: 5,
            fontSize: 18,
          }}
          onChangeText={(text) => {
            const searchedFriendData =
              text.trim() !== ""
                ? cloneAllFriendData.filter((item) =>
                    item.friend.email.includes(text)
                  )
                : cloneAllFriendData;
            setAllFriendData(searchedFriendData);
          }}
          placeholder="Nhập email tìm bạn bè"
          autoCapitalize="none"
        />
      </View>
      {/* Danh sách bạn bè */}
      <ScrollView
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginTop: 15,
          width: "100%",
          paddingLeft: 15,
          paddingRight: 15,
          borderTopWidth: 1,
          borderTopColor: "#ccc",
          paddingTop: 15,
        }}
      >
        {allFriendData.map((item, index) => (
          <View
            key={index}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 5,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: item.friend.photoUrl }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  resizeMode: "cover",
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#ccc",
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    wordWrap: "break-word",
                  }}
                >
                  {item.friend.displayName.length > 27
                    ? `${item.friend.displayName.substring(0, 27)}...`
                    : item.friend.displayName}
                </Text>
                <Text style={{ fontSize: 14, color: "#ccc" }}>
                  {item.friend.email.length > 30
                    ? `${item.friend.email.substring(0, 30)}...`
                    : item.friend.email}
                </Text>
              </View>
            </View>
            <CheckBox
              value={checkedValues[index]}
              onValueChange={() => handleCheckBoxChange(index)}
              style={{
                alignSelf: "center",
                width: 20,
                height: 20,
              }}
            />
          </View>
        ))}
      </ScrollView>
      {/* Button tạo group */}
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor:
            checkedValues.filter((item) => item === true).length > 1 &&
            groupName.trim() !== ""
              ? "teal"
              : "#8C8F91",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 30,
          right: 15,
        }}
        onPress={handleCreateGroup}
      >
        <AntDesignIcon name="arrowright" size={22} color="#fff" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
