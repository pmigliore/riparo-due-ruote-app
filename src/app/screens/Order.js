import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import RDButton from "../../components/RDButton";
import RDContainer from "../../components/RDContainer";
import RDForm from "../../components/RDForm";
import { colors } from "../../theme/colors";
import RDTextInput from "../../components/RDTextInput";
import uuid from "react-native-uuid";

// firebase
import { db } from "../../api/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Order({ route, navigation }) {
  const { client } = route.params;

  //date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  const date = dd + "/" + mm + "/" + yyyy;

  const orderId = uuid.v4();
  const [downPayment, setDownPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const uploadToDatabase = async () => {
    const startOrder = doc(db, "services", "allOrders", "current", orderId);
    await setDoc(startOrder, {
      clientInfo: client,
      serviceId: orderId,
      name: name,
      time: time,
      totalPrice: totalPrice,
      date: date,
      notes: notes,
      downPayment: downPayment,
      category: "ordine",
      stage: "Ordine",
      status: "In spedizione",
    })
      .then(() => navigation.navigate("TabNavigator"))
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
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
        editing
        value={downPayment}
        onChangeText={(e) => setDownPayment(e)}
      />
      <RDTextInput
        value={name}
        onChangeText={(e) => setName(e)}
        form
        style={{ marginTop: 20 }}
        placeholder="Nome Dipsositivo/Accessorio"
      />
      <RDTextInput
        value={time}
        onChangeText={(e) => setTime(e)}
        form
        placeholder="Tempo spedizione"
      />
      <RDTextInput
        value={notes}
        onChangeText={(e) => setNotes(e)}
        style={{
          borderWidth: 2,
          width: "90%",
          marginTop: 10,
          marginBottom: 20,
        }}
        multiline
        placeholder="Dettagli o note"
      />
      <RDTextInput
        keyboardType="numeric"
        value={totalPrice}
        onChangeText={(e) => setTotalPrice(e)}
        form
        placeholder="€ Prezzo Totale"
      />
      <View style={styles.btnContainer}>
        <RDButton
          disabled={!totalPrice || !time || (!name && true)}
          onPress={uploadToDatabase}
          loading={loading}
          variant="contained"
          label="Ordina"
        />
      </View>
    </RDContainer>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    position: "absolute",
    bottom: 0,
    paddingBottom: 10,
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.mainGray,
    paddingTop: 10,
    backgroundColor: colors.mainWhite,
  },
});
