import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors.js";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function RDFServiceForm({
  label,
  value,
  placeholder,
  labelStyle,
  onPress,
  checkbox,
  editing,
}) {
  return (
    <View style={[styles.euroContainer, { width: "100%" }]}>
      <TouchableOpacity
        activeOpacity={editing ? 0.5 : 1}
        onPress={editing ? onPress : null}
        style={styles.container}
      >
        <View
          style={[styles.subEuroContainer, { marginLeft: !checkbox && 45 }]}
        >
          {editing && checkbox && (
            <View
              style={[
                styles.checkmark,
                {
                  backgroundColor: value ? colors.mainBlue : colors.mainWhite,
                  borderWidth: value ? 0 : 1,
                },
              ]}
            >
              <Ionicons
                name="checkmark-outline"
                color={colors.mainWhite}
                size={18}
              />
            </View>
          )}
          <Text style={[styles.txt, { ...labelStyle }]}>{label}</Text>
        </View>
        <View style={styles.subEuroContainer}>
          <Ionicons name="logo-euro" color={colors.mainBlack} size={12} />
          <Text
            style={[
              styles.txt,
              {
                color: value ? colors.mainBlack : colors.mainGray,
              },
            ]}
          >
            {value ? value : editing ? placeholder : "0"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
    borderBottomWidth: 1,
    borderColor: colors.mainGray,
  },
  subEuroContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkmark: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.mainGray,
    height: 25,
    width: 25,
    marginRight: 5,
  },
});
