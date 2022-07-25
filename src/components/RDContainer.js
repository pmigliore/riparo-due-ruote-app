import React from "react";
import {
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Keyboard,
} from "react-native";

function RDContainer({ children, style }) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            ...style,
          }}
        >
          {children}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default RDContainer;
