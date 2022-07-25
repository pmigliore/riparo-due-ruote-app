import React from "react";
import {
  TouchableOpacity,
  Text,
  Platform,
  ActivityIndicator,
  View,
} from "react-native";
import { colors } from "../theme/colors.js";
import { Ionicons } from "@expo/vector-icons";

export default function RDButton({
  label,
  onPress,
  variant,
  form,
  style,
  disabled,
  black,
  loading,
  type,
  activeOpacity,
}) {
  const stylesBtn = variant === "contained" && {
    backgroundColor: disabled
      ? colors.mainGray
      : black
      ? colors.mainBlack
      : colors.mainBlue,
    width: "90%",
    height: 51,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: form && 10,
    ...style,
  };

  const stylesTxt =
    variant === "contained"
      ? {
          fontSize: Platform.OS === "ios" ? 16 : 14,
          color: "white",
          fontWeight: "bold",
        }
      : {
          fontSize: Platform.OS === "ios" ? 16 : 14,
          color: "black",
          fontWeight: "bold",
        };

  if (type === "list") {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: colors.mainGray,
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 15
          }}
          onPress={onPress}
        >
          <Text style={stylesTxt}>{label}</Text>
          <Ionicons
            name="chevron-forward-outline"
            color={colors.mainBlack}
            size={20}
          />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        disabled={disabled}
        style={stylesBtn}
        onPress={!loading && onPress}
      >
        {loading ? (
          <ActivityIndicator color={colors.mainWhite} size="small" />
        ) : (
          <Text style={stylesTxt}>{label}</Text>
        )}
      </TouchableOpacity>
    );
  }
}
