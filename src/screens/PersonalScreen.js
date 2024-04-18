import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import userApi from "../api/UserApi";

const PersonalScreen = () => {
  const [me, setMe] = useState(null);

  useEffect(() => {
    const getMe = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const me = await userApi.getMe(accessToken);
        setMe(me);
      } catch (error) {
        console.error(error.code);
      }
    };

    getMe();
  }, []);

  if (!me) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: me.photoUrl }} style={styles.photo} />
        <Text style={styles.displayName}>{me.displayName}</Text>
        <Text style={styles.email}>{me.email}</Text>
        <Text style={styles.createdAt}>Joined: {formatDate(me.createdAt)}</Text>
      </View>
      {me.bio && (
        <View style={styles.bioContainer}>
          <Text style={styles.bio}>{me.bio}</Text>
        </View>
      )}
    </View>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bioContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  email: {
    fontSize: 18,
    marginBottom: 10,
    color: "#555",
  },
  createdAt: {
    fontSize: 16,
    marginBottom: 10,
    color: "#777",
  },
  bio: {
    fontSize: 16,
    color: "#444",
  },
  loadingText: {
    fontSize: 18,
    color: "#777",
  },
});

export default PersonalScreen;
