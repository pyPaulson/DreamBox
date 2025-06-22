import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppColors from "@/constants/AppColors";
import Fonts from "@/constants/Fonts";
import FormButton from "./FormButton";

const NETWORKS = ["MTN", "Tel", "AT"];

type WithdrawModalProps = {
  visible: boolean;
  onClose: () => void;
};

const WithdrawModal = ({ visible, onClose }: WithdrawModalProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState("MTN");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const handleSelectNetwork = (network: string) => {
    setSelectedNetwork(network);
    setShowDropdown(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Withdraw to Mobile Money</Text>

              {/* Network Dropdown */}
              <Text style={styles.label}>Select Network Provider</Text>
              <Pressable
                style={styles.dropdown}
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {selectedNetwork} Mobile Money
                </Text>
                <Ionicons name="chevron-down" size={20} color="#888" />
              </Pressable>

              {showDropdown && (
                <View style={styles.dropdownList}>
                  {NETWORKS.map((network) => (
                    <Pressable
                      key={network}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectNetwork(network)}
                    >
                      <Text style={styles.dropdownItemText}>
                        {network} Mobile Money
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Pressable Cards */}
              <View style={styles.networkOptions}>
                {NETWORKS.map((network) => (
                  <TouchableOpacity
                    key={network}
                    onPress={() => handleSelectNetwork(network)}
                    style={[
                      styles.networkBtn,
                      selectedNetwork === network && styles.networkBtnSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.networkBtnText,
                        selectedNetwork === network &&
                          styles.networkBtnTextSelected,
                      ]}
                    >
                      {network}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Mobile Number */}
              <Text style={styles.label}>Enter Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.prefixWrapper}>
                  <Text style={styles.prefixText}>+233</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={9}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
              </View>

              {/* Amount */}
              <Text style={styles.label}>Enter Withdrawal Amount</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.prefixWrapper}>
                  <Text style={styles.prefixText}>GHS</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              {/* Balance info */}
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceText}>
                  Available Balance: GHS 200.00
                </Text>
              </View>

              {/* PIN */}
              <Text style={styles.label}>Enter PIN</Text>
              <TextInput
                style={styles.standaloneInput}
                placeholder="Enter PIN"
                placeholderTextColor="#999"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
                value={pin}
                onChangeText={setPin}
              />

              {/* Withdraw Button */}
              <FormButton
                title="Withdraw"
                onPress={() => {
                  // Handle withdrawal here
                  console.log("Withdraw pressed");
                }}
              />

              {/* Cancel Button */}
              <Pressable onPress={onClose} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default WithdrawModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "75%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.title,
    textAlign: "center",
    marginBottom: 20,
    color: AppColors.primary,
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: AppColors.primary,
    marginTop: 10,
    marginBottom: 7,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: AppColors.grey_two,
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 18,
    backgroundColor: AppColors.background_one,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: Fonts.body,
    color: AppColors.text_two,
  },
  dropdownList: {
    backgroundColor: AppColors.background_one,
    borderWidth: 0.3,
    borderColor: AppColors.grey_two,
    borderRadius: 7,
    marginTop: 5,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 12,
    backgroundColor: "#fff",
  },
  dropdownItemText: {
    fontFamily: Fonts.body,
    color: "#333",
  },
  networkOptions: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 12,
  },
  networkBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  networkBtnSelected: {
    backgroundColor: AppColors.primary,
  },
  networkBtnText: {
    fontFamily: Fonts.body,
    color: "#333",
  },
  networkBtnTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  prefixWrapper: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    height: 55,
  },
  prefixText: {
    fontFamily: Fonts.body,
    color: "#333",
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 15,
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  standaloneInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 18,
    paddingHorizontal: 12,
    fontFamily: Fonts.body,
    fontSize: 15,
    marginBottom: 12,
  },
  balanceContainer: {
    backgroundColor: "#dbe4ff",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,   
  },
  balanceText: {
    fontFamily: Fonts.body,
    color: AppColors.primary,
    fontSize: 13,
  },
  cancelBtn: {
    alignItems: "center",
    marginTop: 20,
  },
  cancelText: {
    color: AppColors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
