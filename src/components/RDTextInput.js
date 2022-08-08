import React, { useState } from "react";
import { TextInput, StyleSheet, Platform } from "react-native";
import { colors } from "../theme/colors.js";

export default function RDTextInput({
  placeholder,
  onChangeText,
  form,
  secureTextEntry,
  value,
  autoFocus,
  keyboardType,
  style,
  multiline,
  defaultValue,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      defaultValue={defaultValue}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      style={[
        styles.input,
        {
          borderWidth: multiline ? 1 : 2,
          height: multiline ? 120 : 50,
          padding: multiline ? 20 : 0,
          paddingTop: multiline ? 10 : 0,
          paddingLeft: 20,
          marginBottom: form && 10,
          borderColor: focused ? colors.mainBlack : colors.mainGray,
          color: focused ? colors.mainBlack : colors.mainGray,
          fontSize: Platform.OS === "ios" ? 16 : 14,
          textAlignVertical: multiline && "top",
          ...style,
        },
      ]}
      multiline={multiline}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      secureTextEntry={secureTextEntry}
      autoFocus={autoFocus}
      autoCapitalize={!multiline ? "sentences" : "none"}
      autoCorrect={false}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "90%",
    borderRadius: 20,
    fontWeight: "bold",
  },
});
