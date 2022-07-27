import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import RDChip from "../../../src/components/RDChip.js";
import RDCard from "../../../src/components/RDCard.js";
import RDContainer from "../../../src/components/RDContainer.js";
import { colors } from "../../theme/colors.js";

// firebase
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function History({ navigation }) {
  const [loaded, setLoaded] = useState(false);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getServices();
  }, []);

  const addFilter = (e) => {
    if (filter === e) {
      setFilter("");
    } else {
      setFilter(e);

      let arr = [];
      for (let i = 0; i < services.length; i++) {
        if (services[i].category === e) {
          arr.push(services[i]);
        }
      }
      setFilteredServices([...arr]);
    }
  };

  const getServices = async () => {
    const querySnapshot = await getDocs(
      collection(db, "services", "allServices", "history")
    );
    querySnapshot.forEach((doc) => {
      let arr = services;
      arr.push(doc.data());
      setServices(arr);
    });
    setLoaded(true);
  };

  return (
    <RDContainer style={{ justifyContent: null }}>
      <View style={styles.resultsContainer}>
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
        {!loaded ? (
          <ActivityIndicator color={colors.mainBlue} size="small" />
        ) : (
          <ScrollView>
            {filter
              ? filteredServices.map((item) => (
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
              : services.map((item) => (
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
                ))}
          </ScrollView>
        )}
      </View>
    </RDContainer>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainWhite,
  },
  resultsContainer: {
    width: "90%",
    backgroundColor: colors.mainWhite,
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.mainGray,
    paddingTop: 10,
    backgroundColor: colors.mainWhite,
  },
  chipContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginBottom: 30,
  },
});
