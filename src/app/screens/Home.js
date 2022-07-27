import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import RDButton from "../../../src/components/RDButton.js";
import RDText from "../../../src/components/RDText.js";
import RDChip from "../../../src/components/RDChip.js";
import RDCard from "../../../src/components/RDCard.js";
import { colors } from "../../theme/colors.js";

// firebase
import { db } from "../../api/firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

export default function Home({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [currentServices, setCurrentServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    onSnapshot(
      collection(db, "services", "allServices", "current"),
      (snapshot) => {
        setCurrentServices(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.serviceId }))
        );
      }
    );
    setLoading(false);
  };

  const addFilter = (e) => {
    if (filter === e) {
      setFilter("");
      fetchServices();
    } else {
      setFilter(e);

      let arr = [];
      for (let i = 0; i < currentServices.length; i++) {
        if (currentServices[i].category === e) {
          arr.push(currentServices[i]);
        }
      }
      setCurrentServices([...arr]);
    }
  };

  return (
    <View style={styles.container}>
      <RDButton
        onPress={() => navigation.navigate("ClientSearch", { from: "service" })}
        form
        variant="contained"
        label="Aggiungi servizio"
      />
      <RDButton
        onPress={() => navigation.navigate("ClientSearch", { from: "order" })}
        form
        black
        variant="contained"
        label="Ordina"
      />
      <View style={styles.chipContainer}>
        <RDChip
          onPress={() => addFilter("Elettrico")}
          selected={filter === "Elettrico" ? true : false}
          label="Elettrico"
          style={{ width: "25%" }}
        />
        <RDChip
          onPress={() => addFilter("Meccanica")}
          selected={filter === "Meccanica" ? true : false}
          label="Meccanica"
          style={{ width: "28%" }}
        />
        <RDChip
          onPress={() => addFilter("Ruote")}
          selected={filter === "Ruote" ? true : false}
          label="Ruote"
          style={{ width: "18%" }}
        />
        <RDChip
          onPress={() => addFilter("Batteria")}
          selected={filter === "Batteria" ? true : false}
          label="Batteria"
          style={{ width: "22%" }}
        />
      </View>
      <View style={styles.listContainer}>
        <RDText variant="h1">In Servizio</RDText>
        {loading ? (
          <ActivityIndicator color={colors.mainBlack} size="small" />
        ) : (
          <ScrollView
            contentContainerStyle={{ alignItems: "center" }}
            style={styles.listSubContainer}
          >
            {currentServices.length === 0 ? (
              <RDText variant="h2">Nessun servizio al momento</RDText>
            ) : (
              currentServices.map((item) => (
                <RDCard
                  form
                  onPress={() =>
                    navigation.navigate("ServiceForm", {
                      service: item,
                    })
                  }
                  key={item.serviceId}
                  status={item.status}
                  date={item.date}
                  category={item.category}
                  clientName={
                    item.clientInfo.firstName + " " + item.clientInfo.lastName
                  }
                  stage={item.stage}
                />
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  chipContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 30,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
    width: "90%",
  },
  listSubContainer: {
    marginTop: 20,
    width: "100%",
  },
});
