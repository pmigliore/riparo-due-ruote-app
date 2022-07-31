import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native";
import { monthNames } from "../../api/commonData.js";
import { colors } from "../../theme/colors.js";
import { Ionicons } from "@expo/vector-icons";
import RDText from "../../components/RDText.js";

// firebase
import { db } from "../../api/firebase";
import { getDoc, doc } from "firebase/firestore";

const dateData = [
  { categoria: "Elettrico", vendite: 0 },
  { categoria: "Meccanica", vendite: 0 },
  { categoria: "Ruote", vendite: 0 },
  { categoria: "Batteria", vendite: 0 },
];

export default function Statistics() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(dateData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateGraph(month, year);
  }, []);

  const updateGraph = async (currentMonth, currentYear) => {
    const updateStats = doc(
      db,
      "stats",
      `${monthNames[currentMonth]} ${currentYear}`
    );

    const ref = await getDoc(updateStats);

    if (ref.exists()) {
      setData([
        {
          categoria: "Elettrico",
          vendite: ref.data()["Elettrico"],
        },
        {
          categoria: "Meccanica",
          vendite: ref.data()["Meccanica"],
        },
        {
          categoria: "Ruote",
          vendite: ref.data()["Ruote"],
        },
        {
          categoria: "Batteria",
          vendite: ref.data()["Batteria"],
        },
      ]);
      setLoading(false);
    } else {
      setData(dateData);
      setLoading(false);
    }
  };

  const next = () => {
    let nextMonth = "";
    let nextYear = "";

    if (month === 12) {
      nextYear = year + 1;
      nextMonth = 1;
    } else {
      nextYear = year;
      nextMonth = month + 1;
    }

    setLoading(true);
    setMonth(nextMonth);
    setYear(nextYear);

    updateGraph(nextMonth, nextYear);
  };

  const previous = () => {
    let previousMonth = "";
    let previousYear = "";

    if (month === 1) {
      previousYear = year - 1;
      previousMonth = 12;
    } else {
      previousYear = year;
      previousMonth = month - 1;
    }

    setLoading(true);
    setMonth(previousMonth);
    setYear(previousYear);

    updateGraph(previousMonth, previousYear);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.mainBlue} size="small" />
        </View>
      ) : (
        <VictoryChart
          domainPadding={50}
          width={400}
          theme={VictoryTheme.material}
        >
          <VictoryBar
            style={{ data: { fill: colors.mainBlue } }}
            data={data}
            x="categoria"
            y="vendite"
          />
        </VictoryChart>
      )}
      <View style={styles.scrollContainer}>
        <TouchableOpacity onPress={previous} style={styles.button}>
          <Ionicons
            color={colors.mainWhite}
            name="arrow-back-outline"
            size={30}
          />
        </TouchableOpacity>
        <RDText variant="h2">{monthNames[month] + " " + year}</RDText>
        <TouchableOpacity onPress={next} style={styles.button}>
          <Ionicons
            color={colors.mainWhite}
            name="arrow-forward-outline"
            size={30}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.mainWhite,
  },
  scrollContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  button: {
    backgroundColor: colors.mainBlack,
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    height: 350,
    alignItems: "center",
    justifyContent: "center",
  },
});
