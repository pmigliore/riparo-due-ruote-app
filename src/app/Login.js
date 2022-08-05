import React, { useState } from "react";
import { Alert } from "react-native";
import RDLogo from "../../src/components/RDLogo.js";
import RDContainer from "../../src/components/RDContainer.js";
import RDButton from "../../src/components/RDButton.js";
import RDTextInput from "../../src/components/RDTextInput.js";

//firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebase.js";

export default function Login({ navigation }) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password).catch(() => {
      setLoading(false);
      Alert.alert("Incorretto", "Email o password sono incorrette");
    });
  };

  return (
    <RDContainer>
      <RDLogo />
      <RDTextInput
        value={email}
        onChangeText={(e) => setEmail(e)}
        keyboardType="email-address"
        form
        placeholder="Email"
      />
      <RDTextInput
        value={password}
        onChangeText={(e) => setPassword(e)}
        style={{ marginBottom: 20 }}
        secureTextEntry
        form
        placeholder="Password"
      />
      <RDButton
        onPress={() => navigation.navigate("ResetPassword")}
        form
        variant="text"
        label="Password dimenticata?"
      />
      <RDButton
        loading={loading}
        disabled={!email || !password || !reg.test(email) ? true : false}
        onPress={login}
        style={{ marginTop: 80 }}
        form
        variant="contained"
        label="Login"
      />
    </RDContainer>
  );
}
