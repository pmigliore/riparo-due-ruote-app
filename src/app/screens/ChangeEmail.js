import React, { useState } from "react";
import { Alert, View } from "react-native";
import RDContainer from "../../components/RDContainer.js";
import RDText from "../../components/RDText.js";
import RDButton from "../../components/RDButton.js";
import RDTextInput from "../../components/RDTextInput.js";

///firebase
import { updateEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../api/firebase";

export default function ChangeEmail({ navigation }) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  const [step, setStep] = useState(0);
  const [oldEmail, setOldEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyUser = () => {
    setLoading(true);

    signInWithEmailAndPassword(auth, oldEmail, password)
      .then(() => {
        setLoading(false);
        setStep(1);
      })
      .catch(
        () => Alert.alert("Utente non trovato nel database"),
        setLoading(false)
      );
  };

  const saveUpdate = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    setLoading(true);
    if (reg.test(newEmail) === false) {
      Alert.alert("Alert", "Email invalida", [{ text: "OK" }]);
      setLoading(false);
    } else {
      updateEmail(auth.currentUser, newEmail)
        .then(() => navigation.navigate("TabNavigator"))
        .catch((err) => {
          Alert.alert(`${err}`);
          setLoading(false);
        });
    }
  };

  return (
    <RDContainer>
      {step === 0 ? (
        <View style={{ width: "100%", alignItems: "center" }}>
          <RDText
            style={{ width: "90%", textAlign: "center", marginBottom: 30 }}
            variant="h2"
          >
            Confermiamo prima che sei tu
          </RDText>
          <RDTextInput
            value={oldEmail}
            onChangeText={(e) => setOldEmail(e)}
            keyboardType="email-address"
            form
            placeholder="Email Attuale"
          />
          <RDTextInput
            value={password}
            onChangeText={(e) => setPassword(e)}
            style={{ marginBottom: 20 }}
            secureTextEntry
            form
            placeholder="Password Attuale"
          />
          <RDButton
            disabled={
              !oldEmail || !reg.test(oldEmail) || !password ? true : false
            }
            onPress={verifyUser}
            loading={loading}
            style={{ marginTop: 80 }}
            form
            variant="contained"
            label="Conferma"
          />
        </View>
      ) : (
        <View style={{ width: "100%", alignItems: "center" }}>
          <RDTextInput
            value={newEmail}
            onChangeText={(e) => setNewEmail(e)}
            keyboardType="email-address"
            form
            placeholder="Nuova Email"
          />
          <RDText style={{ width: "90%", textAlign: "center" }} variant="h2">
            La tua email verra` cambiata con il seguente indirizzo
          </RDText>
          <RDButton
            disabled={!newEmail || !reg.test(newEmail) ? true : false}
            onPress={saveUpdate}
            loading={loading}
            style={{ marginTop: 80 }}
            form
            variant="contained"
            label="Cambia email"
          />
        </View>
      )}
    </RDContainer>
  );
}
