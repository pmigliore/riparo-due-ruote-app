import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import RDButton from "../../../src/components/RDButton.js";
import RDTextInput from "../../../src/components/RDTextInput.js";
import RDText from "../../../src/components/RDText.js";
import RDContainer from "../../../src/components/RDContainer.js";
import RDForm from "../../../src/components/RDForm.js";
import RDServiceForm from "../../../src/components/RDServiceForm.js";
import RDModal from "../../../src/components/RDModal.js";
import { colors } from "../../theme/colors.js";
import { Form as EstimateForm } from "../../components/Form";

// firebase
import { db } from "../../api/firebase";
import { doc, setDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

export default function ServiceForm({ route, navigation }) {
  const { service, from } = route.params;

  const [loading, setLoading] = useState(false);
  const [justView, setJustView] = useState(false);
  const [step, setStep] = useState(1);
  const [attachModal, setAttachModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [estimate, setEstimate] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentField, setCurrentField] = useState({});
  const [currentValue, setCurrentValue] = useState("");
  const [cancelled, setCancelled] = useState(false);

  console.log(service);
  useEffect(() => {
    if (from === "history") {
      setJustView(true);
    }
    if (
      service.status === "In attesa di conferma preventivo" ||
      service.status === "In attesa di preventivo"
    ) {
      setStep(1);
    } else if (service.status === "Preventivo confermato") {
      setStep(2);
    } else if (service.status === "Preventivo rifiutato") {
      setCancelled(true);
    } else if (service.status === "In attesa di ritiro") {
      setStep(3);
    }
    if (service.estimate) {
      setEstimate(service.estimate);
    } else {
      setEstimate(EstimateForm);
    }
    if (service.serviceNotes) {
      setNotes(service.serviceNotes);
    }
  }, [setEstimate]);

  const selectService = (...args) => {
    let section = args[0];
    let item = args[1];

    setCurrentField({
      type: "top",
      section: section,
      item: item,
    });

    if (item.input) {
      setCurrentValue(item.input);
    }

    setModal(true);
  };

  const selectSubService = (...args) => {
    let section = args[0];
    let itemId = args[1].id;
    let subItem = args[2];
    let subItemId = args[2].id;

    setCurrentField({
      type: "sub",
      section: section,
      itemId: itemId,
      subItemId: subItemId,
    });

    if (subItem.input) {
      setCurrentValue(subItem.input);
    }

    setModal(true);
  };

  const closeModal = () => {
    setCurrentField({});
    setCurrentValue("");
    setModal(false);
  };

  const completeForm = () => {
    let arr = estimate;

    if (currentField.type === "sub") {
      arr[currentField.section].data[currentField.itemId].more[
        currentField.subItemId
      ].input = currentValue;
    } else {
      arr[currentField.section].data[currentField.item.id].input = currentValue;
    }

    setEstimate([...arr]);
    setCurrentField({});
    setCurrentValue("");
    setModal(false);
  };

  const Form = (props) =>
    estimate.length > 0 ? (
      estimate[props.section].data.map((item) => {
        let section = props.section;
        if (item.more) {
          return (
            <View key={item.title}>
              <RDServiceForm
                editing={
                  step === 1 && from !== "history" && !cancelled ? true : false
                }
                key={item.id}
                placeholder="Importo"
                label={item.title}
                checkbox
                uppercase
                value={item.input}
                onPress={() => selectService(section, item)}
              />
              {item.more.map((obj) => (
                <RDServiceForm
                  key={obj.id}
                  editing={
                    step === 1 && from !== "history" && !cancelled
                      ? true
                      : false
                  }
                  placeholder="Importo"
                  label={obj.title}
                  value={obj.input}
                  uppercase
                  onPress={() => selectSubService(section, item, obj)}
                />
              ))}
            </View>
          );
        } else {
          return (
            <RDServiceForm
              editing={
                step === 1 && from !== "history" && !cancelled ? true : false
              }
              key={item.id}
              checkbox
              placeholder="Importo"
              label={item.title}
              uppercase
              value={item.input}
              onPress={() => selectService(section, item)}
            />
          );
        }
      })
    ) : (
      <ActivityIndicator color={colors.mainBlack} size="small" />
    );

  const moveOn = async () => {
    setLoading(true);

    Alert.alert(
      step === 1
        ? "Invia preventivo al cliente?"
        : step === 2
        ? "Ordine pronto?"
        : "Cliente ha ritirato?",
      "",
      [
        {
          text: "Cancella",
          onPress: () => setLoading(false),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            step === 3 ? finishService("Ritirato") : uploadToDatabase();
          },
        },
      ]
    );
  };

  const uploadToDatabase = async () => {
    const startService = doc(
      db,
      "services",
      "allServices",
      "current",
      service.serviceId
    );
    await updateDoc(startService, {
      stage: step === 1 ? "Nuovo" : "Pronto",
      status:
        step === 1 ? "In attesa di conferma preventivo" : "In attesa di ritiro",
      serviceNotes: notes,
      estimate: estimate,
    })
      .then(() => {
        navigation.goBack();

        if (step === 1) {
          const msg = `Preventivo per il servizio di ${service.date}: https://riparodueruote-ce56e.web.app/estimate/${service.serviceId}`;
          initiateWhatsAppSMS(msg);
        }

        if (step === 2) {
          const msg = `Il servizio iniziato il ${service.date} e' terminato. Dispositivo pronto per il ritiro.`;
          initiateWhatsAppSMS(msg);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const finishService = async (e) => {
    let pastOrders = [];

    const currentService = doc(
      db,
      "services",
      "allServices",
      "current",
      service.serviceId
    );

    await updateDoc(currentService, {
      stage: "Finito",
      status: e,
      serviceNotes: notes,
      estimate: estimate,
    });

    const pastService = await getDoc(currentService);

    const historyService = doc(
      db,
      "services",
      "allServices",
      "history",
      service.serviceId
    );

    await setDoc(historyService, pastService.data()).catch((err) => {
      setLoading(false);
      console.log(err);
    });

    const addToPastOrders = doc(db, "clients", service.clientInfo.id);

    const client = await getDoc(addToPastOrders);

    if (client.data().pastOrders !== undefined) {
      pastOrders = client.data().pastOrders;
    }

    pastOrders.push(pastService.data());

    await updateDoc(addToPastOrders, {
      pastOrders: pastOrders,
    });

    await deleteDoc(currentService).then(() => navigation.goBack());
  };

  const initiateWhatsAppSMS = (whatsAppMsg) => {
    let url =
      "whatsapp://send?text=" +
      whatsAppMsg +
      "&phone=1" +
      service.clientInfo.phoneNumber;
    Linking.openURL(url).catch(() => {
      Alert.alert("Make sure Whatsapp installed on your device");
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.mainWhite }}>
      <RDModal
        clientName={
          service.clientInfo.firstName + " " + service.clientInfo.lastName
        }
        category="attachments"
        visible={attachModal}
        justView={justView}
        serviceId={service.serviceId}
        attachments={service.attachments}
        onRequestClose={() => setAttachModal(false)}
        onClose={() => setAttachModal(false)}
        onDone={(e) => setAttachModal(e)}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPressOut={closeModal}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <RDText variant="h3">
                {currentField.item ? currentField.item.title : null}
              </RDText>
              <RDTextInput
                value={currentValue}
                onChangeText={(e) => setCurrentValue(e)}
                placeholder="Importo"
                autoFocus={true}
                keyboardType="numeric"
              />
              <View style={styles.modalBtnContainer}>
                <RDButton
                  onPress={closeModal}
                  variant="contained"
                  label="Cancella"
                  style={{ backgroundColor: colors.mainRed, width: "45%" }}
                />
                <RDButton
                  onPress={completeForm}
                  variant="contained"
                  label="Conferma"
                  style={{ width: "45%" }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <RDContainer style={{ justifyContent: null }}>
          {justView && (
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
              }}
            >
              <RDText variant="h2">{service.status}</RDText>
              <RDText variant="h2">{service.date}</RDText>
            </View>
          )}
          <RDButton
            type="list"
            label={
              service.clientInfo.firstName + " " + service.clientInfo.lastName
            }
            onPress={() =>
              navigation.navigate("ClientForm", {
                client: service.clientInfo,
              })
            }
          />
          <View style={{ width: "95%", marginTop: 10, marginBottom: 20 }}>
            <RDText variant="h2">Dichiarazioni all'entrata</RDText>
            <RDText style={{ marginBottom: 20 }} variant="h4">
              {service.notes ? service.notes : "Nessuna"}
            </RDText>
            <RDText variant="h2">Note</RDText>
            {!justView ? (
              <RDTextInput
                value={notes}
                onChangeText={(e) => setNotes(e)}
                style={{ width: "100%", marginTop: 5, marginBottom: 20 }}
                multiline
                placeholder="Note per questo servizio"
              />
            ) : (
              <RDText style={{ marginBottom: 20 }} variant="h4">
                {service.serviceNotes ? service.serviceNotes : "Nessuna"}
              </RDText>
            )}
            <View style={styles.badge}>
              <Text style={styles.cardTxt}>{service.category}</Text>
            </View>
          </View>
          <RDButton
            onPress={() =>
              navigation.navigate("Service", {
                client: service.clientInfo,
                from: "ServiceForm",
                thisDeclaration: service.notes,
                thisServiceDate: service.date,
                thisPayment: service.downPayment,
                thisCategory: service.category,
                thisSignature: service.signature,
              })
            }
            type="list"
            label="Liberatoria"
          />
          <RDButton
            onPress={() => setAttachModal(true)}
            type="list"
            label="Allegati"
          />
          <RDForm
            money
            keyboardType="numeric"
            placeholder="Importo"
            label="Acconto"
            value={service.downPayment}
          />
          <RDText style={{ marginTop: 20 }} variant="h3">
            Telaio e Sospensioni
          </RDText>
          <Form section={0} />
          <RDText style={{ marginTop: 20 }} variant="h3">
            Trasmissione
          </RDText>
          <Form section={1} />
          <RDText style={{ marginTop: 20 }} variant="h3">
            Freni
          </RDText>
          <Form section={2} />
          <RDText style={{ marginTop: 20 }} variant="h3">
            Ruote
          </RDText>
          <Form section={3} />
          <RDText style={{ marginTop: 20 }} variant="h3">
            Accessori
          </RDText>
          <Form section={4} />
          <RDText style={{ marginTop: 20 }} variant="h3">
            Controlli e Regolazione
          </RDText>
          <Form section={5} />
        </RDContainer>
      </ScrollView>
      {!justView && (
        <View style={styles.btnContainer}>
          {cancelled ? (
            <RDButton
              loading={loading}
              onPress={() =>
                Alert.alert("Sei sicuro?", "Queso servizio verra' termina", [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => finishService("Terminato"),
                  },
                ])
              }
              variant="contained"
              label="Termina Servizio"
            />
          ) : step === 1 ? (
            <RDButton
              loading={loading}
              onPress={moveOn}
              variant="contained"
              label={
                service.status === "In attesa di conferma preventivo"
                  ? "Invia nuovo preventivo"
                  : "Invia preventivo"
              }
            />
          ) : step === 2 ? (
            <View style={styles.modalBtnContainer}>
              <RDButton
                loading={loading}
                onPress={() =>
                  Alert.alert("Sei sicuro?", "Queso servizio verra' Cancella", [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => finishService("Cancellato"),
                    },
                  ])
                }
                variant="contained"
                label="Cancella Servizio"
                style={{ width: "47%" }}
              />
              <RDButton
                loading={loading}
                onPress={moveOn}
                black
                variant="contained"
                label="Pronto"
                style={{ width: "47%" }}
              />
            </View>
          ) : (
            <RDButton
              loading={loading}
              onPress={moveOn}
              variant="contained"
              label="Cliente ha ritirato"
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  subContainer: {
    width: "100%",
    padding: 15,
  },
  chipContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 30,
    marginBottom: 30,
  },
  commonWidth: {
    width: "17%",
  },
  btnContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.mainGray,
    paddingTop: 10,
    backgroundColor: colors.mainWhite,
    height: 80,
  },
  signature: {
    flex: 1,
    borderColor: "#000033",
    borderWidth: 1,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#eeeeee",
    margin: 10,
  },
  cardTxt: {
    fontSize: Platform.OS === "ios" ? 16 : 14,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: colors.mainBlack,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    maxWidth: 150,
  },
  modalView: {
    width: "90%",
    height: 200,
    borderRadius: 18,
    backgroundColor: colors.mainWhite,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  modalBtnContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
