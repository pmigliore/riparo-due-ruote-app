import React from "react";
import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors.js";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function RDForm({
  label,
  editing,
  value,
  placeholder,
  onChangeText,
  keyboardType,
  autoCapitalize,
  money,
  checkbox,
  checkSelected,
  setCheckSelection,
  labelStyle,
  disabled,
  onFocus,
  onBlur,
  autoFocus,
  inputStyle,
}) {
  return (
    <View style={styles.container}>
      {!editing && <Text style={styles.txt}>{label}</Text>}
      {editing ? (
        <View style={[styles.euroContainer, { width: "100%" }]}>
          <View style={styles.subEuroContainer}>
            {checkbox && (
              <BouncyCheckbox
                size={25}
                fillColor={colors.mainBlue}
                unfillColor={colors.mainWhite}
                iconStyle={{ borderColor: colors.mainGray }}
                onPress={setCheckSelection}
                isChecked={checkSelected}
              />
            )}
            <Text style={[styles.txt, { ...labelStyle }]}>{label}</Text>
          </View>
          <View style={styles.subEuroContainer}>
            {money && (
              <Ionicons name="logo-euro" color={colors.mainBlack} size={12} />
            )}
            <TextInput
              autoCapitalize={autoCapitalize}
              keyboardType={keyboardType}
              value={value}
              placeholder={placeholder ? placeholder : "Aggiungi"}
              onChangeText={onChangeText}
              style={[styles.txtInput, { ...inputStyle }]}
              editable={disabled}
              onFocus={onFocus}
              onBlur={onBlur}
              autoFocus={autoFocus}
            />
          </View>
        </View>
      ) : (
        <View style={styles.euroContainer}>
          {money && (
            <Ionicons name="logo-euro" color={colors.mainBlack} size={12} />
          )}
          <Text style={styles.txt}>{value}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: colors.mainGray,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  txt: {
    color: colors.mainBlack,
    fontSize: Platform.OS === "ios" ? 16 : 14,
    fontWeight: "bold",
  },
  txtInput: {
    fontSize: Platform.OS === "ios" ? 16 : 14,
    fontWeight: "bold",
  },
  euroContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subEuroContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
