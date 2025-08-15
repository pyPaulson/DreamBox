import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import SettingCard from "@/components/SettingsCard";
import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import ToggleSwitch from "@/components/ToggleSwitch";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "@/services/user";
import { logoutUser, getToken } from "@/services/auth";
import * as ImagePicker from "expo-image-picker";
import api from "@/services/api";

type User = {
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture_url?: string;
};

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Load user data
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (token && token !== "xxx.jwt.token.here") {
        const userData = await getCurrentUser();
        console.log("Loaded user data:", userData);
        setUser(userData);
      } else {
        console.log("No valid token found");
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user on component mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Reload user data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  const showImageOptions = () => {
    setShowImageModal(true);
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "We need access to your camera to take a photo."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      setShowImageModal(false);

      if (!result.canceled && result.assets[0]) {
        await handleImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "We need access to your photos to upload a profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      setShowImageModal(false);

      if (!result.canceled && result.assets[0]) {
        await handleImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Error", "Failed to open gallery");
    }
  };

  const handleImageSelected = async (uri: string) => {
    try {
      setUploading(true);

      // Upload to server immediately
      await uploadProfilePicture(uri);

      // Reload user data to get the updated profile picture URL
      await loadUser();
    } catch (error) {
      console.error("Image selection failed:", error);
      Alert.alert("Error", "Failed to process image");
    } finally {
      setUploading(false);
    }
  };

 const uploadProfilePicture = async (uri: string) => {
   try {
     setUploading(true);

     // Show the local image immediately
     setUser((prev) => (prev ? { ...prev, profile_picture_url: uri } : prev));

     const token = await getToken();
     if (!token) throw new Error("No token found");

     const formData = new FormData();
     formData.append("file", {
       uri,
       name: "profile.jpg",
       type: "image/jpeg",
     } as any);

     const response = await api.post("/upload-profile-picture", formData, {
       headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "multipart/form-data",
       },
     });

     // After upload, replace with server-hosted image URL
     setUser((prev) =>
       prev ? { ...prev, profile_picture_url: response.data.url } : prev
     );

     Alert.alert("Success", "Profile picture updated!");
   } catch (error) {
     console.error(
       "Upload failed:",
       (error as any).response?.data || (error as any).message
     );
     Alert.alert("Error", "Failed to upload profile picture.");
   } finally {
     setUploading(false);
   }
 };


  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            const success = await logoutUser();
            if (success) {
              router.replace("/(auth)/login");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getProfileImageUrl = () => {
    if (user?.profile_picture_url) {
      const profileUrl = user.profile_picture_url;
      console.log("Raw profile_picture_url:", profileUrl);

      if (
        profileUrl.startsWith("file://") ||
        profileUrl.startsWith("content://")
      ) {
        return profileUrl;
      }

      // If already a full URL
      if (profileUrl.startsWith("http")) {
        return profileUrl;
      }

      // If relative path from backend, construct full URL
      const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
      console.log("Base URL from env:", baseUrl);

      if (baseUrl) {
        // Remove /api from base URL if present and ensure no trailing slash
        let cleanBaseUrl = baseUrl.replace("/api", "").replace(/\/$/, "");

        // Ensure profileUrl starts with /
        const cleanProfileUrl = profileUrl.startsWith("/")
          ? profileUrl
          : `/${profileUrl}`;

        const fullUrl = `${cleanBaseUrl}${cleanProfileUrl}`;
        console.log("Constructed full URL:", fullUrl);
        return fullUrl;
      } else {
        console.error("EXPO_PUBLIC_API_BASE_URL is not set!");
        // Fallback - try to construct URL assuming localhost
        const fallbackUrl = `http://localhost:8000${profileUrl}`;
        console.log("Using fallback URL:", fallbackUrl);
        return fallbackUrl;
      }
    }

    console.log("No profile picture URL found, using placeholder");
    // Fallback placeholder
    return "https://i.pravatar.cc/150?img=12";
  };

  const renderProfileImage = () => {
    const imageUrl = getProfileImageUrl();
    console.log("Final image URL:", imageUrl);

    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.avatar}
        onError={(error) => {
          console.error("Image load error for URL:", imageUrl);
          console.error("Error details:", error.nativeEvent.error);
        }}
        onLoad={() => {
          console.log("Image loaded successfully:", imageUrl);
        }}
        onLoadStart={() => {
          console.log("Started loading image:", imageUrl);
        }}
        onLoadEnd={() => {
          console.log("Finished loading image:", imageUrl);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSec}>
        <Text style={styles.header}>Profile</Text>

        <TouchableOpacity
          onPress={showImageOptions}
          disabled={uploading}
          style={styles.avatarContainer}
        >
          {renderProfileImage()}

          {/* Camera Icon Overlay */}
          <View style={styles.cameraIconContainer}>
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
            )}
          </View>

          {/* Upload Progress Overlay */}
          {uploading && (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.uploadText}>Uploading...</Text>
            </View>
          )}
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : user ? (
          <>
            <Text style={styles.name}>
              {user.first_name} {user.last_name}
            </Text>
            <Text style={styles.phone}>{user.phone_number}</Text>
          </>
        ) : (
          <>
            <Text style={styles.name}>Unknown User</Text>
            <Text style={styles.phone}>N/A</Text>
          </>
        )}
      </View>

      <View style={styles.bottomSec}>
        <SettingCard
          icon={<MaterialIcons name="person" size={22} color="#023e8a" />}
          label="Account Details"
          onPress={() =>
            router.push("/noTabScreens/profileScreens/account-details")
          }
        />
        <SettingCard
          icon={<FontAwesome5 name="wallet" size={20} color="#023e8a" />}
          label="Wallets"
          onPress={() => router.push("/noTabScreens/profileScreens/wallets")}
        />
        <SettingCard
          icon={<Feather name="bell" size={20} color="#023e8a" />}
          label="Notifications"
          rightElement={<ToggleSwitch />}
        />
        <SettingCard
          icon={<Feather name="file-text" size={20} color="#023e8a" />}
          label="Account Statement"
          onPress={() =>
            router.push("/noTabScreens/profileScreens/account-statement")
          }
        />
        <SettingCard
          icon={<MaterialIcons name="security" size={20} color="#023e8a" />}
          label="Security"
          onPress={() => router.push("/noTabScreens/profileScreens/security")}
        />
        <SettingCard
          icon={<MaterialIcons name="menu-book" size={20} color="#023e8a" />}
          label="Terms and conditions"
          onPress={() =>
            router.push("/noTabScreens/profileScreens/terms-and-condition")
          }
        />
        <SettingCard
          icon={<MaterialIcons name="privacy-tip" size={20} color="#023e8a" />}
          label="Privacy Policy"
          onPress={() => router.push("/noTabScreens/profileScreens/privacy")}
        />
        <SettingCard
          icon={<MaterialIcons name="logout" size={20} color="red" />}
          label="Log out"
          onPress={handleLogout}
        />
      </View>

      {/* Image Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleTakePhoto}
            >
              <MaterialIcons
                name="camera-alt"
                size={24}
                color={AppColors.primary}
              />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handlePickFromGallery}
            >
              <MaterialIcons
                name="photo-library"
                size={24}
                color={AppColors.primary}
              />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  topSec: {
    flex: 1.6,
    paddingTop: 60,
    alignItems: "center",
  },
  header: {
    color: AppColors.text_three,
    fontSize: 20,
    fontFamily: Fonts.bodyBold,
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: AppColors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
    fontFamily: Fonts.body,
  },
  name: {
    color: AppColors.text_three,
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
  phone: {
    marginTop: 5,
    color: AppColors.text_three,
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  bottomSec: {
    flex: 3.3,
    backgroundColor: AppColors.background_one,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.bodyBold,
    color: AppColors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: AppColors.background_one,
    borderRadius: 10,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
    marginLeft: 15,
  },
  modalCancelButton: {
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: Fonts.bodyBold,
    color: "#666",
  },
});


