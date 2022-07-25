import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import uuid from "react-native-uuid";
import RDButton from "../../../src/components/RDButton.js";
import RDTextInput from "../../../src/components/RDTextInput.js";
import RDText from "../../../src/components/RDText.js";
import RDChip from "../../../src/components/RDChip.js";
import RDContainer from "../../../src/components/RDContainer.js";
import RDForm from "../../../src/components/RDForm.js";
import RDServiceForm from "../../../src/components/RDServiceForm.js";
import RDModal from "../../../src/components/RDModal.js";
import { colors } from "../../theme/colors.js";

// firebase
import { db, storage } from "../../api/firebase";
import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref as storageUpload } from "firebase/storage";
import { uploadBytes, getMetadata, getDownloadURL } from "firebase/storage";

export default function ServiceForm({ route, navigation }) {
  const { service } = route.params;

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [attachModal, setAttachModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [estimate, setEstimate] = useState([
    {
      id: 0,
      title: "Telaio e sospensioni",
      data: [
        {
          id: 0,
          selected: false,
          title: "Movimento cetn. e/o cuscinetti",
          input: "",
        },
        {
          id: 1,
          selected: false,
          title: "Serie sterzo e/o cuscinetti",
          input: "",
          more: [
            {
              id: 0,
              title: "Sostituzione e Lubrificaz. €15",
              input: "",
            },
          ],
        },
        {
          id: 2,
          selected: false,
          title: "Manubrio",
          input: "",
        },
        {
          id: 3,
          selected: false,
          title: "Attacco Manubrio",
          input: "",
          more: [
            {
              id: 0,
              title: "Sostituzione €10",
              input: "",
            },
          ],
        },
        {
          id: 4,
          selected: false,
          title: "Ammortizzatore (Manut. o Rev)",
          input: "",
        },
        {
          id: 5,
          selected: false,
          title: "Forcella (Manut. o Rev)",
          input: "",
        },
        {
          id: 6,
          selected: false,
          title: "Espander-Ragnetto",
          input: "",
        },
        {
          id: 7,
          selected: false,
          title: "Guarnizione-oring-paraolio",
          input: "",
        },
        {
          id: 8,
          selected: false,
          title: "Olio",
          input: "",
          more: [
            {
              id: 0,
              title: "Sost. Forcella €25",
              input: "",
            },
            {
              id: 1,
              title: "Sost. Ammortizzatore €15",
              input: "",
            },
            {
              id: 2,
              title: "Manutenzione da €50",
              input: "",
            },
            {
              id: 3,
              title: "Revisione da €100",
              input: "",
            },
          ],
        },
        {
          id: 9,
          selected: false,
          title: "Telaio o Bici Completa",
          input: "",
          more: [
            {
              id: 0,
              title: "Sostituzione montaggio da €100",
              input: "",
            },
          ],
        },
      ],
    },
  ]);
  const [modal, setModal] = useState(false);
  const [currentField, setCurrentField] = useState({});
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    if (
      service.status === "In attesa di conferma preventivo" ||
      service.status === "In attesa di preventivo"
    ) {
      setStep(1);
    } else if (service.status === "Preventivo confermato") {
      setStep(2);
    }
    if (service.estimate) {
      setEstimate([service.estimate]);
    }
    if (service.serviceNotes) {
      setNotes(service.serviceNotes);
    }
  }, []);

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
    estimate[props.section].data.map((item) => {
      let section = props.section;
      if (item.more) {
        return (
          <View key={item.title}>
            <RDServiceForm
              editing={step === 1 ? true : false}
              key={item.id}
              placeholder="Importo"
              label={item.title}
              checkbox
              value={item.input}
              onPress={() => selectService(section, item)}
            />
            {item.more.map((obj) => (
              <RDServiceForm
                key={obj.id}
                editing={step === 1 ? true : false}
                placeholder="Importo"
                label={obj.title}
                value={obj.input}
                onPress={() => selectSubService(section, item, obj)}
              />
            ))}
          </View>
        );
      } else {
        return (
          <RDServiceForm
            editing={step === 1 ? true : false}
            key={item.id}
            checkbox
            placeholder="Importo"
            label={item.title}
            value={item.input}
            onPress={() => selectService(section, item)}
          />
        );
      }
    });

  const moveOn = async () => {
    setLoading(true);

    Alert.alert("Invia preventivo al cliente?", "", [
      {
        text: "Cancella",
        onPress: () => setLoading(false),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          // if (attachments.length > 0) {
          //   const media = await uploadMedia();
          //   await uploadToDatabase(media);
          // } else {
          //   await uploadToDatabase();
          // }
          await uploadToDatabase();
        },
      },
    ]);
  };

  // const uploadMedia = async () => {
  //   let mediaArr = [];

  //   const metadata = {
  //     contentType: null,
  //   };

  //   for (let i = 0; i < attachments.length; i++) {
  //     const response = await fetch(attachments[i].uri);
  //     const blob = await response.blob();
  //     var ref = storageUpload(
  //       storage,
  //       `media/${service.serviceId}/${Math.random()}`
  //     );
  //     await uploadBytes(ref, blob, metadata);
  //     await getDownloadURL(ref)
  //       .then((metadata) => {
  //         mediaArr.push(metadata);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }

  //   return mediaArr;
  // };

  const uploadToDatabase = async (media) => {
    const startService = doc(
      db,
      "services",
      "allServices",
      "current",
      service.serviceId
    );
    await updateDoc(startService, {
      //attachments: attachments.length !== 0 && media,
      stage: step === 1 ? "Nuovo" : "Pronto",
      status:
        step === 1 ? "In attesa di conferma preventivo" : "In attesa di ritiro",
      serviceNotes: notes,
      estimate: estimate[0],
    })
      .then(() => navigation.goBack())
      .catch((err) => {
        setLoading(false);
        console.log(err);
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
        serviceId={service.serviceId}
        attachments={service.attachments}
        onRequestClose={() => setAttachModal(false)}
        onClose={() => setAttachModal(false)}
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
            <RDTextInput
              value={notes}
              onChangeText={(e) => setNotes(e)}
              style={{ width: "100%", marginTop: 5, marginBottom: 20 }}
              multiline
              placeholder="Note per questo servizio"
            />
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
        </RDContainer>
      </ScrollView>
      <View style={styles.btnContainer}>
        {step === 1 ? (
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
        ) : (
          <View style={styles.modalBtnContainer}>
            <RDButton
              // loading={loading}
              // onPress={moveOn}
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
        )}
      </View>
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
    height: 100,
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
