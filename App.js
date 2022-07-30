import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  LogBox,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RDLogo from "./src/components/RDLogo.js";
import { colors } from "./src/theme/colors.js";

// firebase
import { auth } from "./src/api/firebase.js";

// navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigatorScreen from "./src/TabNavigator.js";
import LoginScreen from "./src/app/Login.js";
import ClientSearchScreen from "./src/app/screens/ClientSearch.js";
import NewClientFormScreen from "./src/app/screens/NewClientForm.js";
import ClientFormScreen from "./src/app/screens/ClientForm.js";
import ServiceScreen from "./src/app/screens/Service.js";
import ServiceFormScreen from "./src/app/screens/ServiceForm.js";
import OrderScreen from "./src/app/screens/Order.js";
import HistoryScreen from "./src/app/screens/History.js";
import ResetPasswordScreen from "./src/app/ResetPassword.js";
import QrScanScreen from "./src/app/screens/QrScan.js";

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native"]);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoaded(true);
        setLoggedIn(false);
      } else {
        setLoaded(true);
        setLoggedIn(true);
      }
    });
  }, []);

  if (!loaded) {
    return (
      <View style={styles.container}>
        <RDLogo />
        <ActivityIndicator color={colors.mainBlue} size="large" />
      </View>
    );
  }
  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerBackTitleVisible: false,
            headerTintColor: "black",
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
          initialRouteName="Login"
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{ headerTitle: "Password Dimenticata" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TabNavigator"
          screenOptions={{
            headerBackTitleVisible: false,
            headerTintColor: "black",
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigatorScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ClientSearch"
            component={ClientSearchScreen}
            options={{ headerTitle: "Seleziona Cliente" }}
          />
          <Stack.Screen
            name="NewClientForm"
            component={NewClientFormScreen}
            options={{
              headerTitle: () => (
                <ActivityIndicator color="black" size="small" />
              ),
            }}
          />
          <Stack.Screen
            name="ClientForm"
            component={ClientFormScreen}
            options={{
              headerTitle: () => (
                <ActivityIndicator color="black" size="small" />
              ),
            }}
          />
          <Stack.Screen
            name="Service"
            component={ServiceScreen}
            options={{ headerTitle: "Compila Servizio" }}
          />
          <Stack.Screen
            name="Order"
            component={OrderScreen}
            options={{ headerTitle: "Ordina Dispositivo/Accessorio" }}
          />
          <Stack.Screen
            name="ServiceForm"
            component={ServiceFormScreen}
            options={{ headerTitle: "Compila Servizio" }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{
              headerTitle: "Servizi Passati",
            }}
          />
          <Stack.Screen
            name="QrScan"
            component={QrScanScreen}
            options={{ headerTitle: "Scannerizza Codice QR" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
