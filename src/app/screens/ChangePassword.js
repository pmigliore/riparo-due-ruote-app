import React, { useState } from "react";
import { Alert } from "react-native";
import RDContainer from "../../components/RDContainer.js";
import RDText from "../../components/RDText.js";
import RDButton from "../../components/RDButton.js";
import RDTextInput from "../../components/RDTextInput.js";

//firebase
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../api/firebase";

export default function ChangePassword({ navigation }) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    setLoading(true);
    if (reg.test(email) === false) {
      Alert.alert("Alert", "Email invalida", [{ text: "OK" }]);
      setLoading(false);
    } else {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setLoading(false);
          Alert.alert(
            "Email Manadata",
            `Un email e' stata manadata al seguente indirizzo ${email}`
          );
          navigation.goBack();
        })
        .catch((error) => {
          Alert.alert("Error", error);
          setLoading(false);
        });
    }
  };

  return (
    <RDContainer>
      <RDTextInput
        value={email}
        onChangeText={(e) => setEmail(e)}
        keyboardType="email-address"
        form
        placeholder="Email"
      />
      <RDText style={{ width: "90%", textAlign: "center" }} variant="h2">
        Un email verra` mandata al seguente indirizzo per cambiare la password
      </RDText>
      <RDButton
        disabled={!email || !reg.test(email) ? true : false}
        onPress={resetPassword}
        loading={loading}
        style={{ marginTop: 80 }}
        form
        variant="contained"
        label="Cambia Password"
      />
    </RDContainer>
  );
}
