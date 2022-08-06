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

export default function RDCard({
  status,
  date,
  category,
  clientName,
  stage,
  services,
  onPress,
  form,
  type,
}) {
  if (type === "client") {
    return (
      <TouchableOpacity
        style={[
          styles.cardBtn,
          {
            height: 72,
            marginTop: form && 10,
            backgroundColor: colors.mainBlue,
          },
        ]}
        onPress={onPress}
      >
        <View style={styles.cardTxtContainer}>
          <Text style={styles.cardTxt}>{clientName}</Text>
          <Text style={styles.cardTxt}>
            {!services ? "0" : services} servizi
          </Text>
        </View>
        <Ionicons
          name="chevron-forward-outline"
          color={colors.mainWhite}
          size={40}
        />
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={[
          styles.cardBtn,
          {
            marginBottom: form && 10,
            backgroundColor:
              stage === "Nuovo"
                ? colors.mainBlue
                : stage === "In pausa"
                ? colors.mainRed
                : colors.mainBlack,
          },
        ]}
        onPress={onPress}
      >
        <View style={styles.cardTxtContainer}>
          <Text style={styles.cardTxt}>{clientName}</Text>
          {status && (
            <Text
              ellipsizeMode="tail"
              style={[styles.cardTxt, { fontSize: 12, maxWidth: 200 }]}
            >
              {status}
            </Text>
          )}
          <Text style={styles.cardTxt}>{stage}</Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", height: "100%" }}
        >
          <View style={[styles.cardTxtContainer, { alignItems: "center" }]}>
            <View style={styles.badge}>
              <Text style={styles.cardTxt}>{category}</Text>
            </View>
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
    fontSize: Platform.OS === "ios" ? 16 : 12,
    fontWeight: "bold",
    color: colors.mainWhite,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  cardTxtContainer: {
    height: "100%",
    justifyContent: "space-between",
  },
});
