import React from "react";
import { Text, Platform } from "react-native";
import { colors } from "../theme/colors.js";

export default function RDText({ children, variant, style }) {
  const styling =
    variant === "h1"
      ? {
          fontSize: Platform.OS === "ios" ? 24 : 20,
          color: colors.mainBlue,
          fontWeight: "bold",
          ...style,
        }
      : variant === "h2"
      ? {
          fontSize: Platform.OS === "ios" ? 16 : 14,
          color: colors.mainBlack,
          fontWeight: "bold",
          ...style,
        }
      : variant === "h3"
      ? {
          fontSize: Platform.OS === "ios" ? 18 : 16,
          color: colors.mainBlack,
          fontWeight: "bold",
          textTransform: "uppercase",
          ...style,
        }
      : {
          fontSize: Platform.OS === "ios" ? 11 : 10,
          color: colors.mainBlack,
          ...style,
        };
  return <Text style={styling}>{children}</Text>;
}
