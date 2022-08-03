import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";
import RDButton from "../../../src/components/RDButton.js";
import RDTextInput from "../../../src/components/RDTextInput.js";
import RDText from "../../../src/components/RDText.js";
import RDChip from "../../../src/components/RDChip.js";
import RDContainer from "../../../src/components/RDContainer.js";
import RDForm from "../../../src/components/RDForm.js";
import RDSearchInput from "../../../src/components/RDSearchInput.js";
import { colors } from "../../theme/colors.js";

// firebase
import { db } from "../../api/firebase";
import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default function NewClientForm({ navigation, route }) {
  const { from, client } = route.params;

  const newId = uuid.v4();
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(true);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");

  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  useEffect(() => {
    if (client) {
      fillClient();
    } else {
      navigation.setOptions({ headerTitle: "Nuovo Cliente" });
    }
  }, []);

  const fillClient = () => {
    setCreating(false);
    setId(client.id);
    setFirstName(client.firstName);
    setLastName(client.lastName);
    setPhoneNumber(client.phoneNumber);
    setEmail(client.email);
    setScore(client.score);
    setNotes(client.notes);
    navigation.setOptions({
      headerTitle: "Seleziona Cliente",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            editForm(true);
          }}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="pencil-outline" size={20} />
        </TouchableOpacity>
      ),
    });
  };

  const editForm = (e) => {
    if (e === true) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => deleteClient(route.params.client.id)}
            style={{ marginLeft: 10 }}
          >
            <Ionicons name="trash-bin-outline" size={20} />
          </TouchableOpacity>
        ),
      });
    } else {
      fillClient();
    }
    setEditing(e);
  };

  const addScore = (e) => {
    if (score === e) {
      setScore("");
    } else {
      setScore(e);
    }
  };

  const createClient = () => {
    setLoading(true);
    if (creating) {
      const addClient = doc(db, "clients", newId);
      setDoc(addClient, {
        id: newId,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        score: score,
        notes: notes,
      })
        .then(() => goNext())
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
      goNext();
    }
  };

  const deleteClient = (e) => {
    Alert.alert(
      "Elimina Cliente",
      "Una volta eliminato non porta` essere ripristinato",
      [
        {
          text: "Cancella",
          style: "cancel",
        },
        {
          text: "Elimina",
          onPress: async () => {
            const removeClient = await doc(db, "clients", e);
            deleteDoc(removeClient)
              .then(() => {
                navigation.navigate("TabNavigator");
              })
              .catch((err) => {
                setLoading(false);
                console.log(err);
              });
          },
        },
      ]
    );
  };

  const save = () => {
    setLoading(true);
    const addClient = doc(db, "clients", id);
    updateDoc(addClient, {
      id: id,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      score: score,
      notes: notes,
    })
      .then(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => editForm(true)}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="pencil-outline" size={20} />
            </TouchableOpacity>
          ),
        });
        setEditing(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const goNext = () => {
    setLoading(false);
    const clientInfo = {
      id: client ? id : newId,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      score: score,
      notes: notes,
    };

    if (from === "service") {
      navigation.navigate("Service", {
        client: clientInfo,
      });
    } else {
      navigation.navigate("Order", {
        client: clientInfo,
      });
    }
  };

  return (
    <RDContainer style={{ justifyContent: null }}>
      <RDForm
        label="Nome*"
        editing={creating ? creating : editing}
        value={firstName}
        onChangeText={(e) => setFirstName(e)}
      />
      <RDForm
        label="Cognome*"
        editing={creating ? creating : editing}
        value={lastName}
        onChangeText={(e) => setLastName(e)}
      />
      <RDForm
        keyboardType="numeric"
        label="Telefono*"
        editing={creating ? creating : editing}
        value={phoneNumber}
        onChangeText={(e) => setPhoneNumber(e)}
      />
      <RDForm
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email*"
        editing={creating ? creating : editing}
        value={email}
        onChangeText={(e) => setEmail(e)}
      />
      <View style={styles.subContainer}>
        <RDText variant="h2">Voto cliente</RDText>
        <View style={styles.chipContainer}>
          <RDChip
            selected={score === "5" ? true : false}
            onPress={() => {
              creating ? addScore("5") : editing && addScore("5");
            }}
            style={styles.commonWidth}
            label="5"
          />
          <RDChip
            selected={score === "4" ? true : false}
            onPress={() => {
              creating ? addScore("4") : editing && addScore("4");
            }}
            style={styles.commonWidth}
            label="4"
          />
          <RDChip
            selected={score === "3" ? true : false}
            onPress={() => {
              creating ? addScore("3") : editing && addScore("3");
            }}
            style={styles.commonWidth}
            label="3"
          />
          <RDChip
            selected={score === "2" ? true : false}
            onPress={() => {
              creating ? addScore("2") : editing && addScore("2");
            }}
            style={styles.commonWidth}
            label="2"
          />
          <RDChip
            selected={score === "1" ? true : false}
            onPress={() => {
              creating ? addScore("1") : editing && addScore("1");
            }}
            style={styles.commonWidth}
            label="1"
          />
        </View>
      </View>
      <View style={styles.subContainer}>
        <RDText variant="h2">Note</RDText>
        {creating || editing ? (
          <RDTextInput
            value={notes}
            onChangeText={(e) => setNotes(e)}
            style={{ width: "100%", marginTop: 10 }}
            multiline
            placeholder="Inseriscie note sul cliente..."
          />
        ) : (
          <RDText variant="h2" style={{ fontWeight: "normal" }}>
            {notes ? notes : "Nessuna nota"}
          </RDText>
        )}
      </View>
      {client?.pastOrders && !creating && !editing && (
        <ScrollView style={{ width: "100%", marginBottom: 80 }}>
          <RDText style={{ padding: 15 }} variant="h2">
            Storia Ordini
          </RDText>
          {client.pastOrders.map((item) => (
            <RDButton
              key={item.date}
              type="list"
              label={item.date}
              onPress={() =>
                item.type === "Order"
                  ? navigation.navigate("DisplayOrder", {
                      order: item,
                      client: item.clientInfo,
                      from: "history",
                    })
                  : navigation.navigate("ServiceForm", {
                      service: item,
                      from: "history",
                    })
              }
            />
          ))}
        </ScrollView>
      )}
      {!editing ? (
        <View style={styles.btnContainer}>
          <RDButton
            loading={loading}
            disabled={
              !firstName | !lastName ||
              !email ||
              !reg.test(email) ||
              !phoneNumber
                ? true
                : false
            }
            onPress={createClient}
            variant="contained"
            label={creating ? "Crea Cliente" : "Seleziona Cliente"}
          />
        </View>
      ) : (
        <View
          style={[
            styles.btnContainer,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            },
          ]}
        >
          <RDButton
            style={{ backgroundColor: colors.mainRed, width: "45%" }}
            onPress={() => editForm(false)}
            variant="contained"
            label="Cancella"
          />
          <RDButton
            style={{ width: "45%" }}
            loading={loading}
            disabled={
              !firstName | !lastName ||
              !email ||
              !reg.test(email) ||
              !phoneNumber
                ? true
                : false
            }
            onPress={save}
            variant="contained"
            label="Salva"
          />
        </View>
      )}
    </RDContainer>
  );
}

const styles = StyleSheet.create({
  subContainer: {
    width: "100%",
    padding: 15,
  },
  chipContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commonWidth: {
    width: "17%",
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
