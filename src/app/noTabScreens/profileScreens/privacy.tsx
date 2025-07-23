import { StyleSheet, Text, View } from "react-native";
import React from "react";

const PrivacyScreen = () => {
  return (
    <View style={styles.container}>
      <Text>PrivacyScreen</Text>
    </View>
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
