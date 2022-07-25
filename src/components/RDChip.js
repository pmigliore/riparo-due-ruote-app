import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { colors } from "../theme/colors.js";

export default function RDChip({ label, selected, onPress, key, style }) {
  return (
    <TouchableOpacity
      key={key}
      onPress={onPress}
      style={{
        borderWidth: !selected ? 1 : 0,
        borderRadius: 30,
        paddingLeft: 10,
        paddingRight: 10,
        minWidth: 50,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderColor: colors.mainGray,
        backgroundColor: selected ? colors.mainBlue : colors.mainWhite,
        ...style,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: selected ? colors.mainWhite : colors.mainGray,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
