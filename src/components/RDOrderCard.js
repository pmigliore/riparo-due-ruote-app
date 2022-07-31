import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors.js";

export default function RDOrderCard({
  name,
  time,
  totalPrice,
  stage,
  date,
  form,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.cardBtn,
        {
          marginBottom: form && 10,
          backgroundColor:
            stage === "Consegnato" ? colors.mainBlack : colors.mainBlue,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.cardTxtContainer}>
        <Text style={styles.cardTxt}>{name}</Text>
        <Text style={[styles.cardTxt, { fontSize: 12, maxWidth: 200 }]}>
          Tempo Spedizione: {time}
        </Text>
        <Text style={styles.cardTxt}>€ {totalPrice}</Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", height: "100%" }}
      >
        <View style={[styles.cardTxtContainer, { alignItems: "center" }]}>
          <Text style={styles.cardTxt}>{date}</Text>
        </View>
        <View>
          <Ionicons
            name="chevron-forward-outline"
            color={colors.mainWhite}
            size={50}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardBtn: {
    width: "100%",
    height: 92,
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  cardTxt: {
    fontSize: Platform.OS === "ios" ? 16 : 14,
    fontWeight: "bold",
    color: colors.mainWhite,
  },
  cardTxtContainer: {
    height: "100%",
    justifyContent: "space-between",
  },
});
