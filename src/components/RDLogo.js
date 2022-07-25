import React from "react";
import { Image } from "react-native";

export default function RDLogo() {
  return (
    <Image
      style={{ width: 200, height: 200 }}
      source={require("../../assets/RDlogo.png")}
    />
  );
}
