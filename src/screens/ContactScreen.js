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
  TextInput,
  Dimensions,
  Modal,
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Button, KeyboardAvoidingView, ScrollView } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import contactApi from "../api/ContactApi";
import authAPI from "../api/AuthApi";
import { sendNotification } from "../utils/PushNotificationUtils";
import Notification from "../components/notification/Notification";

const userId = "660a2935d26d51861b4fc7fe"; // userID của người login vào, Kaito Hasei
export default function ContactScreen({ route }) {
  const [accessToken, setAccessToken] = useState("");
  const [contactData, setContactData] = useState([]);
  const [cloneContactData, setCloneContactData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [notification, setNotification] = useState({});
  // Tạo kênh thông báo

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // 1. Sau khi đăng nhập --> set Token
  // * Xoá code này: code này để test
  useEffect(() => {
    const fetchDataAndSetToken = async () => {
      try {
        const data = await authAPI.login({
          email: "kaitohasei@gmail.com",
          password: "LoL@123",
        });
        setAccessToken(data.access_token);
        // Lưu access token vào AsyncStorage
        await AsyncStorage.setItem("accessToken", data.access_token);
      } catch (error) {
        console.error("Lỗi khi lưu token vào AsyncStorage:", error);
      }
    };
    fetchDataAndSetToken();
  }, []);

  // 2. Fetch danh sách conversation khi accessToken thay đổi
  useEffect(() => {
    const getAllContact = async () => {
      try {
        const data = await contactApi.getAllContact(accessToken);
        setContactData(data);
        setCloneContactData(data);
      } catch (error) {
        console.error(error.code);
      }
    };

    getAllContact();
  }, [accessToken]);

  // 3. handle send friend request
  const handleSendFriendRequest = async (friendId) => {
    try {
      const data = await contactApi.sendFriendRequest(accessToken, friendId);
      const { status } = data;
      const title =
        status === 201 ? "Friend Request Sent" : "Friend Request Pending";
      const message =
        status === 201
          ? "Your friend request has been sent successfully."
          : "Your friend request is pending.";

      // Gửi thông báo
      await sendNotification(title, message);
      setNotification({ title: title, message: message });
    } catch (error) {
      // Xử lý lỗi
      console.error("Error sending friend request:", error);

      // Gửi thông báo về lỗi
      await sendNotification("Error", "Failed to send friend request.");
      setNotification({
        title: "Error",
        message: "Failed to send friend request.",
      });
    }
  };

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
      {notification && Object.keys(notification).length !== 0 ? (
        <Notification
          title={notification.title}
          message={notification.message}
        />
      ) : null}
      {/* Header */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          background: "teal",
          padding: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
          Bạn bè
        </Text>
        <TouchableOpacity onPress={toggleModal}>
          <AntDesignIcon name="adduser" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Content */}
      {/* Tìm kiếm bạn bè */}
      <TouchableOpacity
        style={{
          width: "100%",
          padding: 10,
          paddingTop: 15,
          paddingBottom: 15,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #ccc",
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "teal",
          }}
        >
          <AntDesignIcon name="search1" size={18} color="#fff" />
        </View>
        <Text style={{ fontSize: 16 }}>Tìm kiếm bạn bè</Text>
      </TouchableOpacity>
      {/* Lời mời kết bạn */}
      <TouchableOpacity
        style={{
          width: "100%",
          padding: 10,
          paddingTop: 15,
          paddingBottom: 15,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #ccc",
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "teal",
          }}
        >
          <FontAwesome5Icon name="user-friends" size={18} color="#fff" />
        </View>
        <Text style={{ fontSize: 16 }}>Lời mời kết bạn</Text>
      </TouchableOpacity>
      {/* Danh sách bạn bè */}
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            width: "100vw",
            backgroundColor: "#ccc",
            padding: 10,
            paddingTop: 15,
            paddingBottom: 15,
          }}
        >
          Danh sách bạn bè
        </Text>
        <Text style={{ fontSize: 16, marginTop: 15, marginBottom: 15 }}>
          Chưa có bạn bè
        </Text>
      </View>
      {/* Modal khi bấm vào gợi ý kết bạn  */}
      <Modal
        // animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
        style={{ backgroundColor: "black", width: "100%", height: "100vh" }}
      >
        {/* Modal Container */}
        <View
          style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            zIndex: 1000,
          }}
        >
          {/* Modal Content */}
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              height: "60vh",
              borderRadius: 5,
              borderColor: "#ccc",
              borderWidth: 1,
              display: "flex",
              flexDirection: "column",
              padding: 10,
              gap: 10,
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          >
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={toggleModal}
            >
              <IoniconsIcon name="chevron-down" size={35} color="#ccc" />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Gợi ý kết bạn
            </Text>
            {/* Tìm kiếm */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                gap: 5,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <TextInput
                style={{
                  height: 40,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  backgroundColor: "transparent",
                  color: "#8C8F91",
                  flexGrow: 1,
                  paddingLeft: 5,
                  paddingRight: 5,
                  borderRadius: 5,
                }}
                onChangeText={(text) => {
                  const searchedContactData =
                    text.trim() !== ""
                      ? cloneContactData.filter((item) =>
                          item.email.includes(text)
                        )
                      : cloneContactData;
                  setContactData(searchedContactData);
                }}
                // onBlur={handleBlur("email")}
                // value={values.email}
                placeholder="Nhập email"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "teal",
                  width: 50,
                  borderRadius: 5,
                }}
              >
                <AntDesignIcon name="search1" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            {/* render data */}
            <ScrollView
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {contactData.map((item, index) => (
                <View
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                    padding: 10,
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
                      // source={{item.photo}}}
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
                        {item.displayName.substring(0, 15) + "..."}
                      </Text>
                      <Text style={{ fontSize: 14, color: "#ccc" }}>
                        {item.email.substring(0, 20)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "teal",
                      width: 50,
                      height: 40,
                      borderRadius: 5,
                    }}
                    onPress={() => handleSendFriendRequest(item.id)}
                  >
                    <AntDesignIcon name="adduser" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
