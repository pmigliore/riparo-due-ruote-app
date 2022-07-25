import React from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import { colors } from "../theme/colors.js";
import { Ionicons } from "@expo/vector-icons";

export default function RDSearchInput({
  placeholder,
  onChangeText,
  value,
  autoFocus,
}) {
  return (
    <View style={styles.input}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={{
          width: "80%",
          fontSize: Platform.OS === "ios" ? 16 : 14,
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoCorrect={false}
      />
      <Ionicons name="search-outline" color={colors.mainGray} size={25} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "90%",
    height: 35,
    borderRadius: 30,
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 10,
    fontWeight: "bold",
    borderColor: colors.mainGray,
    color: colors.mainGray,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
