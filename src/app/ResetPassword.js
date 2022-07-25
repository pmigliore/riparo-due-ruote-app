import React, { useState } from "react";
import RDLogo from "../../src/components/RDLogo.js";
import RDContainer from "../../src/components/RDContainer.js";
import RDText from "../../src/components/RDText.js";
import RDButton from "../../src/components/RDButton.js";
import RDTextInput from "../../src/components/RDTextInput.js";

export default function ResetPassword() {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

  const [email, setEmail] = useState("");

  const reset = () => {
    console.log(email);
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
      <RDText variant="h2">
        Un email verra` mandata al seguente indirizzo
      </RDText>
      <RDButton
        disabled={!email || !reg.test(email) ? true : false}
        onPress={reset}
        style={{ marginTop: 80 }}
        form
        variant="contained"
        label="Manda"
      />
    </RDContainer>
  );
}
