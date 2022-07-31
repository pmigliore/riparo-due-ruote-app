import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "./theme/colors.js";
import RDLogo from ".//components/RDLogo.js";

// navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StatisticsScreen from "./app/screens/Statistics.js";
import SettingsSreen from "./app/screens/Settings.js";
import HomeScreen from "./app/screens/Home.js";

const Tab = createBottomTabNavigator();

function TabNavigator({ navigation }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <View style={styles.container}>
        <RDLogo />
        <ActivityIndicator color={colors.mainBlue} size="large" />
      </View>
    );
  } else {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          activeTintColor: colors.mainBlue,
          inactiveTintColor: colors.mainGray,
          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.mainBlue,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("History")}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="time-outline" size={30} />
              </TouchableOpacity>
            ),
            headerRight: ({}) => (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("OrdersBoard")}
                  style={{ marginLeft: 15, marginRight: 10 }}
                >
                  <Ionicons name="cart-outline" size={30} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("QrScan", {
                      from: "current",
                    })
                  }
                  style={{ marginLeft: 15, marginRight: 10 }}
                >
                  <Ionicons name="qr-code-outline" size={30} />
                </TouchableOpacity>
              </View>
            ),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={30} />
            ),
            headerTitle: "Riparo Due Ruote",
          })}
        />
        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" color={color} size={30} />
            ),
            headerTitle: "Statistiche",
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsSreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cog" color={color} size={30} />
            ),
            headerTitle: "Impostazioni",
          }}
        />
      </Tab.Navigator>
    );
  }
}

export default TabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRightContainer: {
    flexDirection: "row",
  },
});
