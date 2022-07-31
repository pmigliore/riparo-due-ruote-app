import React from "react";
import { View } from "react-native";
import RDButton from "../../components/RDButton";
import { colors } from "../../theme/colors";
import RDLogo from "../../components/RDLogo";

//firebase
import { auth } from "../../api/firebase";

export default function Settings({ navigation }) {
  const logout = () => {
    auth.signOut();
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: colors.mainWhite,
      }}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <RDLogo />
      </View>
      <RDButton
        onPress={() => navigation.navigate("ChangeEmail")}
        type="list"
        label="Cambia Email"
      />
      <RDButton
        onPress={() => navigation.navigate("ChangePassword")}
        type="list"
        label="Cambia Password"
      />
      <RDButton
        onPress={logout}
        style={{ marginTop: 50 }}
        variant="contained"
        label="Log Out"
      />
    </View>
  );
}
