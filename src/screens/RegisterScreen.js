import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  CheckBox,
} from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as yup from "yup";
import authAPI from "../api/AuthApi";
const RegisterScreen = ({ navigation }) => {
  const [username, setUserName] = useState("");
  const [isValidForm, setIsValidForm] = useState(false);

  // validate with yup
  const registerSchema = yup.object().shape({
    password: yup.string().required("Password is required"),
    email: yup.string().email("Invalid email").required("Please enter email"),
    checkbox1: yup.boolean().oneOf([true], "Checkbox 1 must be checked"),
    checkbox2: yup.boolean().oneOf([true], "Checkbox 2 must be checked"),
  });

  // change tab
  const [currentTab, setCurrentTab] = useState(1);
  const totalTabs = 3;
  const goToNextTab = () => {
    if (currentTab < totalTabs) {
      setCurrentTab(currentTab + 1);
    }
  };
  const goToPrevTab = () => {
    if (currentTab > 3) {
      setCurrentTab(2);
    } else if (currentTab > 1) {
      setCurrentTab(currentTab - 1);
    } else if (currentTab == 1) {
      navigation.goBack();
    }
  };

  // handle register
  const handleRegister = async (userInfo) => {
    try {
      // Gọi phương thức register từ đối tượng authAPI
      const response = await authAPI.register(userInfo);

      // Trả về dữ liệu phản hồi nếu quá trình đăng ký thành công
      setCurrentTab(3);
      return response;
    } catch (error) {
      const errorCode = error?.code; // Lấy mã lỗi từ đối tượng lỗi được ném ra
      // Xử lý lỗi nếu quá trình đăng ký gặp vấn đề
      console.error("Error during registration:", error);
      setCurrentTab(4);
      throw error; // Rethrow lỗi để cho phép các thành phần khác xử lý nếu cần
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
        alignItems: "center",
      }}
      behavior="padding"
    >
      {/* Header */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          gap: 20,
          padding: 20,
          backgroundColor: "teal",
        }}
      >
        <TouchableOpacity onPress={() => goToPrevTab()}>
          <AntDesignIcon name="arrowleft" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: "white" }}>Tạo tài khoản</Text>
      </View>
      {/* Tab */}
      {currentTab === 4 && (
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 18,
              marginTop: 40,
              marginBottom: 40,
            }}
          >
            Đã tồn tại 1 tài khoản Zalo được gắn với Email này
          </Text>
          <View
            style={{
              width: 70,
              height: 70,
              backgroundColor: "#CFD7E2",
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <AntDesignIcon name="user" size={30} color="#F0F3FC" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>*****</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "teal",
                borderRadius: 5,
                padding: 15,
                width: "100%",
                marginTop: 40,
              }}
              onPress={() => goToPrevTab(2)}
            >
              <Text style={{ fontWeight: 500, fontSize: 16, color: "white" }}>
                Dùng Email khác
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "teal",
                borderRadius: 5,
                padding: 15,
                width: "100%",
                marginTop: 40,
              }}
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={{ fontWeight: 500, fontSize: 16, color: "white" }}>
                Đăng nhập Email này
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {currentTab === 3 && (
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 18,
              marginTop: 40,
              marginBottom: 40,
            }}
          >
            Tạo tài khoản thành công
          </Text>
          <View
            style={{
              width: 70,
              height: 70,
              backgroundColor: "teal",
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <AntDesignIcon name="check" size={30} color="#F0F3FC" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{username}</Text>
          <Text style={{ color: "#CFD7E2", fontSize: 16 }}>buitran@gmail</Text>
          <TouchableOpacity
            style={{
              backgroundColor: "teal",
              borderRadius: 5,
              padding: 15,
              width: "100%",
              marginTop: 40,
            }}
          >
            <Text style={{ fontWeight: 500, fontSize: 16, color: "white" }}>
              Trở về đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {currentTab === 2 && (
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              padding: 15,
              backgroundColor: "#F1F5F3",
            }}
          >
            <Text style={{ fontSize: 16 }}>
              Nhập email và mật khẩu của bạn để tạo tài khoản mới
            </Text>
          </View>
          <Formik
            initialValues={{
              email: "",
              password: "",
              checkbox1: false,
              checkbox2: false,
            }}
            validationSchema={registerSchema}
            validate={(values) => {
              // Kiểm tra tất cả các điều kiện
              registerSchema
                .validate(values)
                .then(() => setIsValidForm(true))
                .catch(() => setIsValidForm(false));
            }}
          >
            {({
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              setFieldValue,
              isValid,
            }) => (
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TextInput
                  style={{
                    height: 40,
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                    margin: 15,
                    backgroundColor: "transparent",
                    color: "#8C8F91",
                  }}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TextInput
                  style={{
                    height: 40,
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                    margin: 15,
                    marginTop: 0,
                    backgroundColor: "transparent",
                    color: "#8C8F91",
                  }}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholder="Mật khẩu"
                  secureTextEntry
                />
                {touched.email || touched.password ? (
                  <Text
                    style={{ color: "red", marginLeft: 15, marginBottom: 15 }}
                  >
                    {errors.email || errors.password}
                  </Text>
                ) : null}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 15,
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <CheckBox
                    style={{ width: 20, height: 20 }}
                    value={values.checkbox1}
                    onValueChange={(value) => setFieldValue("checkbox1", value)}
                  />
                  <Text style={{ fontSize: 15 }}>
                    Tôi đồng ý với các{" "}
                    <Text style={{ color: "#3C83D4", fontWeight: 500 }}>
                      điều khoản sử dụng Zalo
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 15,
                    gap: 10,
                  }}
                >
                  <CheckBox
                    style={{ width: 20, height: 20 }}
                    value={values.checkbox2}
                    onValueChange={(value) => setFieldValue("checkbox2", value)}
                  />
                  <Text style={{ fontSize: 15 }}>
                    Tôi đồng ý với{" "}
                    <Text style={{ color: "#3C83D4", fontWeight: 500 }}>
                      điều khoản Mạng xã hội của Zalo
                    </Text>
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: isValidForm ? "teal" : "#8C8F91",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 50,
                    alignSelf: "center",
                  }}
                  onPress={
                    isValidForm
                      ? () => {
                          // handleRegister({ username, values });
                          handleRegister({ username, ...values });
                        }
                      : ""
                  }
                >
                  <AntDesignIcon name="arrowright" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      )}
      {currentTab === 1 && (
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              padding: 15,
              backgroundColor: "white",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Tên zalo</Text>
          </View>

          <View style={{ width: "100%" }}>
            <TextInput
              style={{
                height: 40,
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                margin: 15,
                marginTop: 0,
                backgroundColor: "transparent",
                color: "#8C8F91",
                fontSize: 18,
              }}
              onChangeText={(text) => setUserName(text)}
              value={username}
              placeholder="Gồm 2-40 kí tự"
              keyboardType="username"
              autoCapitalize="none"
            />
            <Text
              style={{
                fontWeight: 500,
                fontSize: 16,
                marginLeft: 15,
                marginBottom: 15,
              }}
            >
              Lưu ý khi đặt tên
            </Text>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 15,
                  marginBottom: 15,
                }}
              >
                - Không vi phạm{" "}
                <Text style={{ color: "#2C92E4", fontWeight: "bold" }}>
                  Quy định đặt tên trên Zalo
                </Text>
                .
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 15,
                  marginBottom: 15,
                }}
              >
                - Nên sử dụng tên thật để giúp bạn bè dễ nhận ra bạn.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor:
                username !== "" && username.length > 1 && username.length <= 40
                  ? "teal"
                  : "#8C8F91",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 50,
            }}
            onPress={
              username !== "" && username.length > 1 && username.length <= 40
                ? () => goToNextTab()
                : ""
            }
          >
            <AntDesignIcon name="arrowright" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
