import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import RDButton from "../../components/RDButton";
import RDContainer from "../../components/RDContainer";
import RDForm from "../../components/RDForm";
import { colors } from "../../theme/colors";
import RDText from "../../components/RDText";

// firebase
import { db } from "../../api/firebase";
import { doc, setDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

export default function DisplayOrder({ route, navigation }) {
  const { client, order, from } = route.params;

  const [loading, setLoading] = useState(false);

  const updateDatabase = async () => {
    let pastOrders = [];

    const currentService = doc(
      db,
      "services",
      "allOrders",
      "current",
      order.serviceId
    );

    await updateDoc(currentService, {
      status: "Arrivato",
      type: "Order",
    });

    const pastService = await getDoc(currentService);

    const historyService = doc(
      db,
      "services",
      "allOrders",
      "history",
      order.serviceId
    );

    await setDoc(historyService, pastService.data()).catch((err) => {
      setLoading(false);
      console.log(err);
    });

    const addToPastOrders = doc(db, "clients", order.clientInfo.id);

    const client = await getDoc(addToPastOrders);

    if (client.data().pastOrders !== undefined) {
      pastOrders = client.data().pastOrders;
    }

    pastOrders.push(pastService.data());

    await updateDoc(addToPastOrders, {
      pastOrders: pastOrders,
    });

    await deleteDoc(currentService).then(() => navigation.goBack());
  };

  return (
    <RDContainer style={{ justifyContent: "flex-start" }}>
      <RDButton
        type="list"
        label={client.firstName + " " + client.lastName}
        onPress={() =>
          navigation.navigate("ClientForm", {
            client: client,
          })
        }
      />
      <RDForm
        money
        keyboardType="numeric"
        placeholder="Importo"
        label="Acconto"
        value={order.downPayment}
      />
      <View
        style={{
          width: "90%",
          marginTop: 20,
          justifyContent: "space-evenly",
          height: 150,
        }}
      >
        <RDText variant="h2">Dispositivo: {order.name}</RDText>
        <RDText variant="h2">Tempo Spedizione: {order.time}</RDText>
        <RDText variant="h2">Note: {order.notes}</RDText>
        <RDText variant="h2">Costo: {order.totalPrice}</RDText>
      </View>
      {!from && (
        <View style={styles.btnContainer}>
          <RDButton
            onPress={updateDatabase}
            loading={loading}
            variant="contained"
            label="Arrivato"
          />
        </View>
      )}
    </RDContainer>
  );
}

const styles = StyleSheet.create({
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
