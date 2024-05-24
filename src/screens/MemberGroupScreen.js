import React, { useCallback } from "react";
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
import {
  AntDesignIcon,
  MaterialCommunityIconsIcon,
  IoniconsIcon,
  MaterialIconsIcon,
  FontAwesome5Icon,
  FontAwesomeIcon,
} from "../utils/IconUtils";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Button, KeyboardAvoidingView, ScrollView } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import contactApi from "../api/ContactApi";
import authAPI from "../api/AuthApi";
import { sendNotification } from "../utils/PushNotificationUtils";
import Notification from "../components/notification/Notification";
import conversationApi from "../api/ConversationApi";
import userApi from "../api/UserApi";
import { ActionSheetIOS } from "react-native";

export default function MemberGroupScreen({ route }) {
  const { navigation, conversationId } = route.params;
  const [accessToken, setAccessToken] = useState("");
  const [groupOwner, setGroupOwner] = useState("");
  const [groupName, setGroupName] = useState("");
  const [contactData, setContactData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [allFriendData, setAllFriendData] = useState([]);
  const [cloneContactData, setCloneContactData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [notification, setNotification] = useState({});
  const [userId, setUserId] = useState("");
  const [isDeletedMember, setIsDeletedMember] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");
  const [deleteUserName, setDeleteUserName] = useState("");

  // Tạo kênh thông báo
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    getConversationById();
  };
  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
    setDeleteUserId("");
  };
  const toggleModal3 = () => {
    setModalVisible3(!isModalVisible3);
  };

  const getConversationById = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const data = await conversationApi.fetchConversationById(
        conversationId,
        accessToken
      );
      setMemberData(data.participants);
      setGroupOwner(data.groupOwner);
      setGroupName(data.groupName);
    } catch (error) {
      console.error(error.code);
    }
  };
  useEffect(() => {
    getConversationById();
  }, [accessToken]);

  useEffect(() => {
    getConversationById();
    setIsDeletedMember(false);
  }, [isDeletedMember]);

  const getAllFriend = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const contactData = await contactApi.getAllContact(accessToken);
      const allFriendData = await contactApi.getAllFriend(accessToken);
      const me = await userApi.getMe(accessToken);
      setUserId(me.id);
      setContactData(contactData);
      setCloneContactData(contactData);
      setAllFriendData(allFriendData);
    } catch (error) {
      console.error(error.code);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllFriend();
    }, [])
  );
  // 3. handle send friend request
  const handleSendFriendRequest = async (friendId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log("get access token:", accessToken);
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

  // 4. Redirect chat user
  const handleRedirectChat = async (friendId, friendName) => {
    // fecth conversations
    const accessToken = await AsyncStorage.getItem("accessToken");
    const conversations = await conversationApi.fetchConversation(accessToken);
    const filteredItems = conversations.list.filter(
      (item) => !item.isGroup && item.participants[1].id === friendId
    );
    if (filteredItems.length !== 0) {
      navigation.navigate("ChatScreen", {
        conversationId: filteredItems[0].id,
        conversationName:
          filteredItems[0].participants[1].displayName.length > 27
            ? `${filteredItems[0].participants[1].displayName.substring(
                0,
                27
              )}...`
            : filteredItems[0].participants[1].displayName,
        userId: userId,
        navigation: navigation,
      });
    } else {
      const data = await conversationApi.createConversation(
        [friendId],
        null,
        accessToken
      );

      if (data !== "") {
        navigation.navigate("ChatScreen", {
          conversationId: data.id,
          conversationName:
            friendName.length > 27
              ? `${friendName.substring(0, 27)}...`
              : friendName,
          userId: userId,
          navigation: navigation,
        });
      }
    }
  };

  const handleDeleteGroup = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    toggleModal3();
    navigation.goBack();
    const data = await conversationApi.deleteGroup(conversationId, accessToken);
  };
  // 4. Redirect chat user
  const handleDeleteMemberGroup = async (userId) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const data = await conversationApi.deleteMemberGroup(
      conversationId,
      userId,
      accessToken
    );
    setIsDeletedMember(true);
    setModalVisible2(false);
  };

  const handleAddMemberGroup = async (userId) => {
    console.log(userId);
    // fecth conversations
    const accessToken = await AsyncStorage.getItem("accessToken");
    const data = await conversationApi.addMemberGroup(
      conversationId,
      [userId],
      accessToken
    );
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
          alignItems: "center",
          justifyContent: "space-between",
          background: "teal",
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesignIcon name="arrowleft" size={22} color="#fff" />
        </TouchableOpacity>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 15,
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={toggleModal}>
            <AntDesignIcon name="adduser" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal3}>
            <AntDesignIcon name="deleteusergroup" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Content */}
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
          Thành viên trong nhóm
        </Text>
        {memberData.length === 0 && (
          <Text style={{ fontSize: 16, marginTop: 15, marginBottom: 15 }}>
            Loading
          </Text>
        )}
        {memberData.map((item, index) => (
          <View
            key={index}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              borderRadius: 5,
              padding: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                width: 50,
                height: 50,
              }}
            >
              {item.photoUrl && (
                <Image
                  source={{ uri: item.photoUrl }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    resizeMode: "cover",
                  }}
                ></Image>
              )}
              {!item.photoUrl && (
                <FontAwesomeIcon
                  name="user-circle"
                  color="#A0AEC0"
                  size={50}
                ></FontAwesomeIcon>
              )}
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
                  {item.displayName.substring(0, 25) + "..."}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              {groupOwner === item.id ? (
                <View
                  style={{
                    height: 40,
                    width: 40,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIconsIcon
                    name="account-key"
                    size={25}
                    color="#E9A100"
                    s
                  />
                </View>
              ) : null}

              {userId !== item.id ? (
                <TouchableOpacity
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "teal",
                    width: 40,
                    height: 40,
                    borderRadius: 5,
                  }}
                  onPress={() => handleRedirectChat(item.id, item.displayName)}
                >
                  <AntDesignIcon name="message1" size={18} color="#fff" />
                </TouchableOpacity>
              ) : null}

              {groupOwner === item.id || userId !== groupOwner ? null : (
                <TouchableOpacity
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F31628",
                    width: 40,
                    height: 40,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    toggleModal2();
                    setDeleteUserId(item.id);
                    setDeleteUserName(item.displayName);
                  }}
                >
                  <AntDesignIcon name="deleteuser" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
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
              height: "75vh",
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
              Danh sách bạn bè
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
              {allFriendData.map((item, index) => (
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
                      source={{ uri: item.friend.photoUrl }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        resizeMode: "cover",
                        backgroundColor: "#ccc",
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
                        {item.friend.displayName.length > 15
                          ? item.friend.displayName.substring(0, 15) + "..."
                          : item.friend.displayName}
                      </Text>
                      <Text style={{ fontSize: 14, color: "#ccc" }}>
                        {item.friend.email.length > 20
                          ? item.friend.email.substring(0, 20) + "..."
                          : item.friend.email}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "teal",
                      width: 40,
                      height: 40,
                      borderRadius: 5,
                    }}
                    onPress={() => handleAddMemberGroup(item.friend.id)}
                  >
                    <AntDesignIcon name="adduser" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        // animationType="slide"
        transparent={true}
        visible={isModalVisible2}
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
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          {/* Modal Content */}
          <View
            style={{
              width: "70%",
              backgroundColor: "white",
              height: "fit-content",
              borderRadius: 5,
              borderColor: "#ccc",
              borderWidth: 1,
              display: "flex",
              flexDirection: "column",
              padding: 20,
              gap: 30,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
              Bạn chắc chắn muốn xoá:{" "}
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "teal" }}>
                {deleteUserName}
              </Text>
            </Text>
            <View
              style={{
                alignSelf: "flex-end",
                display: "flex",
                flexDirection: "row",
                gap: 15,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "teal",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                  borderRadius: 7,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  width: "fit-content",
                }}
                onPress={() => handleDeleteMemberGroup(deleteUserId)}
              >
                <Text
                  style={{ fontSize: "20", fontWeight: "bold", color: "white" }}
                >
                  Xác nhận
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                  borderRadius: 7,
                  borderWidth: 1,
                  borderColor: "teal",
                }}
                onPress={toggleModal2}
              >
                <Text
                  style={{ fontSize: "20", fontWeight: "bold", color: "black" }}
                >
                  Huỷ bỏ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={isModalVisible3}
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
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          {/* Modal Content */}
          <View
            style={{
              width: "70%",
              backgroundColor: "white",
              height: "fit-content",
              borderRadius: 5,
              borderColor: "#ccc",
              borderWidth: 1,
              display: "flex",
              flexDirection: "column",
              padding: 20,
              gap: 30,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
              Bạn chắc chắn muốn xoá:{" "}
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "teal" }}>
                {groupName}
              </Text>
            </Text>
            <View
              style={{
                alignSelf: "flex-end",
                display: "flex",
                flexDirection: "row",
                gap: 15,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "teal",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                  borderRadius: 7,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  width: "fit-content",
                }}
                onPress={handleDeleteGroup}
              >
                <Text
                  style={{ fontSize: "20", fontWeight: "bold", color: "white" }}
                >
                  Xác nhận
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                  borderRadius: 7,
                  borderWidth: 1,
                  borderColor: "teal",
                }}
                onPress={toggleModal3}
              >
                <Text
                  style={{ fontSize: "20", fontWeight: "bold", color: "black" }}
                >
                  Huỷ bỏ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
