import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import RDContainer from "../../../src/components/RDContainer.js";
import RDOrderCard from "../../components/RDOrderCard.js";
import RDText from "../../components/RDText.js";
import { colors } from "../../theme/colors.js";
import RDButton from "../../components/RDButton.js";

// firebase
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function OrdersBoard({ navigation }) {
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState("Current");
  const [currentOrders, setCurrentOrders] = useState([]);
  const [hsitoryOrders, setHistoryOrders] = useState([]);

  useEffect(() => {
    getCurrentOrders();
    getHistoryOrders();
  }, []);

  const getCurrentOrders = async () => {
    const querySnapshot = await getDocs(
      collection(db, "services", "allOrders", "current")
    );
    querySnapshot.forEach((doc) => {
      let arr = currentOrders;
      arr.push(doc.data());
      setCurrentOrders(arr);
    });
    setLoaded(true);
  };

  const getHistoryOrders = async () => {
    const querySnapshot = await getDocs(
      collection(db, "services", "allOrders", "history")
    );
    querySnapshot.forEach((doc) => {
      let arr = hsitoryOrders;
      arr.push(doc.data());
      setHistoryOrders(arr);
    });
    setLoaded(true);
  };

  return (
    <RDContainer style={{ alignItems: "center", justifyContent: null }}>
      <RDButton
        onPress={() => navigation.navigate("ClientSearch", { from: "order" })}
        form
        black
        variant="contained"
        label="Ordina"
      />
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            {
              borderBottomLeftRadius: 25,
              borderTopLeftRadius: 25,
              backgroundColor:
                currentPage === "Current" ? colors.mainBlue : colors.mainGray,
            },
          ]}
          onPress={() => setCurrentPage("Current")}
        >
          <Text style={styles.toggleTxt}>Attuale</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            {
              borderBottomRightRadius: 25,
              borderTopRightRadius: 25,
              backgroundColor:
                currentPage === "History" ? colors.mainBlue : colors.mainGray,
            },
          ]}
          onPress={() => setCurrentPage("History")}
        >
          <Text style={styles.toggleTxt}>Storia</Text>
        </TouchableOpacity>
      </View>
      {currentPage === "Current" ? (
        !loaded ? (
          <ActivityIndicator color={colors.mainBlue} size="small" />
        ) : currentOrders.length === 0 ? (
          <RDText variant="h2">Nessun ordine al momento</RDText>
        ) : (
          <ScrollView style={{ width: "90%" }}>
            {currentOrders.map((item) => (
              <RDOrderCard
                form
                key={item.serviceId}
                name={item.name}
                time={item.time}
                totalPrice={item.totalPrice}
                date={item.date}
                stage="In Spedizione"
                onPress={() =>
                  navigation.navigate("DisplayOrder", {
                    client: item.clientInfo,
                    order: item,
                  })
                }
              />
            ))}
          </ScrollView>
        )
      ) : !loaded ? (
        <ActivityIndicator color={colors.mainBlue} size="small" />
      ) : hsitoryOrders.length === 0 ? (
        <RDText variant="h2">Nessun ordine al momento</RDText>
      ) : (
        <ScrollView style={{ width: "90%" }}>
          {hsitoryOrders.map((item) => (
            <RDOrderCard
              form
              key={item.serviceId}
              name={item.name}
              time={item.time}
              totalPrice={item.totalPrice}
              date={item.date}
              stage="Consegnato"
              onPress={() =>
                navigation.navigate("DisplayOrder", {
                  client: item.clientInfo,
                  order: item,
                  from: "history",
                })
              }
            />
          ))}
        </ScrollView>
      )}
    </RDContainer>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  toggleBtn: {
    width: "50%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleTxt: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.mainWhite,
  },
});
