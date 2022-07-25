import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import RDButton from "../../../src/components/RDButton.js";
import RDText from "../../../src/components/RDText.js";
import RDCard from "../../../src/components/RDCard.js";
import RDContainer from "../../../src/components/RDContainer.js";
import RDSearchInput from "../../../src/components/RDSearchInput.js";
import { colors } from "../../theme/colors.js";

// firebase
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ClientSearch({ route, navigation }) {
  const { from } = route.params;
  const [loaded, setLoaded] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    const querySnapshot = await getDocs(collection(db, "clients"));
    querySnapshot.forEach((doc) => {
      let arr = clients;
      arr.push(doc.data());
      setClients(arr);
    });
    setLoaded(true);
  };

  return (
    <RDContainer style={{ justifyContent: null }}>
      <View style={styles.searchContainer}>
        <RDSearchInput placeholder="Cerca cliente..." />
      </View>
      <View style={styles.resultsContainer}>
        <RDText variant="h2">Storia Clienti</RDText>
        {!loaded ? (
          <ActivityIndicator color={colors.mainBlue} size="small" />
        ) : (
          <ScrollView>
            {clients.map((item) => (
              <RDCard
                form
                type="client"
                key={item.id}
                clientName={item.firstName + " " + item.lastName}
                services={item.services}
                onPress={
                  () =>
                    navigation.navigate("NewClientForm", {
                      from: from,
                      client: item,
                    })
                }
              />
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.btnContainer}>
        <RDButton
          onPress={() => navigation.navigate("NewClientForm", { from: from })}
          variant="contained"
          label="Nuovo Cliente"
          black
        />
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
});
