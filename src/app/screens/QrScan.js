import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import RDButton from "../../components/RDButton";

// firebase
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function QrScan({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const { from } = route.params;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    if (from === "current") {
      const querySnapshot = await getDocs(
        collection(db, "services", "allServices", "current")
      );
      querySnapshot.forEach((doc) => {
        if (doc.data().serviceId === data) {
          navigation.navigate("ServiceForm", {
            service: doc.data(),
          });
        }
      });
    } else {
      const querySnapshot = await getDocs(
        collection(db, "services", "allServices", "history")
      );
      querySnapshot.forEach((doc) => {
        if (doc.data().serviceId === data) {
          navigation.navigate("ServiceForm", {
            service: doc.data(),
          });
        }
      });
    }
    Alert.alert(`Servizio non esiste`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <RDButton
          onPress={() => setScanned(false)}
          form
          variant="contained"
          label="Scannerizza di nuovo"
          style={{ position: "absolute", bottom: 45 }}
        />
      )}
    </View>
  );
}
