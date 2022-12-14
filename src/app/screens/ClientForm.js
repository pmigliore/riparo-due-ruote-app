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
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ClientForm({ navigation, route }) {
  const { client } = route.params;

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
    fillClient();
    navigation.setOptions({
      headerTitle: client.firstName + " " + client.lastName,
    });
  }, []);

  const fillClient = () => {
    setCreating(false);
    const getClient = doc(db, "clients", client.id);
    getDoc(getClient).then((res) => {
      setId(res.data().id);
      setFirstName(res.data().firstName);
      setLastName(res.data().lastName);
      setPhoneNumber(res.data().phoneNumber);
      setEmail(res.data().email);
      setScore(res.data().score);
      setNotes(res.data().notes);
      navigation.setOptions({
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
    });
  };

  const editForm = (e) => {
    if (e === true) {
      navigation.setOptions({
        headerRight: () => null,
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

  const saveClient = () => {
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
      {editing && (
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
            onPress={saveClient}
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
