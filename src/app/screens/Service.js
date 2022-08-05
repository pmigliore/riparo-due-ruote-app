import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
} from "react-native";
import uuid from "react-native-uuid";
import RDButton from "../../../src/components/RDButton.js";
import RDTextInput from "../../../src/components/RDTextInput.js";
import RDText from "../../../src/components/RDText.js";
import RDChip from "../../../src/components/RDChip.js";
import RDContainer from "../../../src/components/RDContainer.js";
import RDForm from "../../../src/components/RDForm.js";
import RDModal from "../../../src/components/RDModal.js";
import { colors } from "../../theme/colors.js";
import { monthNames } from "../../api/commonData.js";
import SignatureScreen from "react-native-signature-canvas";

// firebase
import { db, storage } from "../../api/firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { ref as storageUpload } from "firebase/storage";
import { uploadBytes, getMetadata, getDownloadURL } from "firebase/storage";

export default function Service({ route, navigation }) {
  const {
    client,
    from,
    thisDeclaration,
    thisServiceDate,
    thisPayment,
    thisCategory,
    thisSignature,
  } = route.params;

  //date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  const date = dd + "/" + mm + "/" + yyyy;
  const signatureRef = useRef();

  const [serviceId, setServiceId] = useState(uuid.v4());
  const [loading, setLoading] = useState(false);
  const [onlyView, setOnlyView] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [notes, setNotes] = useState("");
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    if (from) {
      setOnlyView(true);
    }
  }, []);

  const addFilter = (e) => {
    if (filter === e) {
      setFilter("");
    } else {
      setFilter(e);
    }
  };

  const handleOK = (signature) => {
    setSignature(signature);
    setSignModal(false);
  };

  const startService = async () => {
    setLoading(true);
    const media = await uploadMedia();
    uploadToDatabase(media);
    //TODOs: send customer receipt to WhatsApp
  };

  const uploadMedia = async () => {
    let eSign = "";

    const metadata = {
      contentType: null,
    };

    const response = await fetch(signature);
    const blob = await response.blob();
    var ref = storageUpload(storage, `media/${serviceId}/signature`);
    await uploadBytes(ref, blob, metadata);
    await getDownloadURL(ref)
      .then((metadata) => {
        eSign = metadata;
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    return eSign;
  };

  const uploadToDatabase = async (media) => {
    const startService = doc(
      db,
      "services",
      "allServices",
      "current",
      serviceId
    );
    await setDoc(startService, {
      clientInfo: client,
      serviceId: serviceId,
      date: date,
      notes: notes,
      signature: media,
      downPayment: downPayment,
      category: filter,
      stage: "Nuovo",
      status: "In attesa di preventivo",
    })
      .then(() => updateStats())
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const updateStats = async () => {
    const d = new Date().getMonth();
    const month = monthNames[d];
    const year = new Date().getFullYear();

    const updateStats = doc(db, "stats", `${month} ${year}`);

    const docRef = await getDoc(updateStats);

    let currentData = {
      Batteria: 0,
      Elettrico: 0,
      Meccanica: 0,
      Ruote: 0,
    };

    if (docRef.exists()) {
      currentData = docRef.data();

      currentData[filter] = parseInt(currentData[filter]) + 1;

      updateDoc(updateStats, {
        Batteria: currentData["Batteria"],
        Elettrico: currentData["Elettrico"],
        Meccanica: currentData["Meccanica"],
        Ruote: currentData["Ruote"],
      });
    } else {
      setDoc(updateStats, {
        Batteria: currentData["Batteria"],
        Elettrico: currentData["Elettrico"],
        Meccanica: currentData["Meccanica"],
        Ruote: currentData["Ruote"],
      });
    }

    setQrModal(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.mainWhite }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={signModal}
        onRequestClose={() => setSignModal(false)}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            backgroundColor: colors.mainWhite,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SignatureScreen
            androidHardwareAccelerationDisabled={true}
            clearText="Reset"
            confirmText="Conferma"
            ref={signatureRef}
            onOK={handleOK}
          />
          <RDButton
            black
            style={{ marginBottom: 150 }}
            onPress={() => setSignModal(false)}
            variant="contained"
            label="Annulla"
          />
        </View>
      </Modal>
      <RDModal
        code={serviceId}
        clientName={client.firstName + " " + client.lastName}
        date={date}
        category="qr-code"
        visible={qrModal}
        onRequestClose={() => navigation.navigate("TabNavigator")}
        onClose={() => navigation.navigate("TabNavigator")}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <RDContainer style={{ justifyContent: null }}>
          {!onlyView ? (
            <RDButton
              type="list"
              label={client.firstName + " " + client.lastName}
              onPress={() =>
                navigation.navigate("ClientForm", {
                  client: client,
                })
              }
            />
          ) : (
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
              }}
            >
              <RDText variant="h2">
                {client.firstName + " " + client.lastName}
              </RDText>
              <RDText variant="h2">{thisServiceDate}</RDText>
            </View>
          )}
          {!onlyView ? (
            <View style={styles.chipContainer}>
              <RDChip
                onPress={() => addFilter("Elettrico")}
                selected={filter === "Elettrico" ? true : false}
                label="Elettrico"
                style={{ width: "25%" }}
              />
              <RDChip
                onPress={() => addFilter("Meccanica")}
                selected={filter === "Meccanica" ? true : false}
                label="Meccanica"
                style={{ width: "28%" }}
              />
              <RDChip
                onPress={() => addFilter("Ruote")}
                selected={filter === "Ruote" ? true : false}
                label="Ruote"
                style={{ width: "18%" }}
              />
              <RDChip
                onPress={() => addFilter("Batteria")}
                selected={filter === "Batteria" ? true : false}
                label="Batteria"
                style={{ width: "22%" }}
              />
            </View>
          ) : (
            <View style={styles.badge}>
              <Text style={styles.cardTxt}>{thisCategory}</Text>
            </View>
          )}
          <RDForm
            money
            keyboardType="numeric"
            placeholder="Importo"
            label="Acconto"
            editing={!onlyView ? true : false}
            value={!onlyView ? downPayment : thisPayment}
            onChangeText={(e) => setDownPayment(e)}
          />
          <View style={styles.subContainer}>
            {!onlyView ? (
              <RDTextInput
                value={notes}
                onChangeText={(e) => setNotes(e)}
                style={{ width: "100%", marginTop: 10, marginBottom: 20 }}
                multiline
                placeholder="Eventuali dichiarazioni o note alla consegna e/o al ritiro"
              />
            ) : (
              <View>
                <RDText variant="h2">Dichiarazioni</RDText>
                <RDText style={{ marginBottom: 20 }} variant="h4">
                  {thisDeclaration
                    ? thisDeclaration
                    : "Nessuna dichiarazione da parte del cliente"}
                </RDText>
              </View>
            )}
            <RDText variant="h2">Note Informative</RDText>
            <RDText variant="body">
              Lorem ipsum dolor sit amet, regione consulatu duo no. Sit rebum
              nobis senserit an, no scripta discere vel. Cum ex doming
              disputando, eu vim quidam indoctum. Dicta legere id ius. Veri
              reformidans has ei, ex per saepe ullamcorper, ut fugit periculis
              eam. Adhuc aeque corpora nec te, ex iudico eloquentiam mel. Pro
              aliquip deseruisse ad, ex summo tacimates eum, eu augue sensibus
              urbanitas duo. Sed illum rationibus ei. An sit scripta vivendum,
              nec id enim magna. Ne viderer corrumpit per, eos movet salutatus
              at. Delectus gubergren accommodare vix at. Lorem ipsum dolor sit
              amet, regione consulatu duo no. Sit rebum nobis senserit an, no
              scripta discere vel. Cum ex doming disputando, eu vim quidam
              indoctum. Dicta legere id ius. Veri reformidans has ei, ex per
              saepe ullamcorper, ut fugit periculis eam. Adhuc aeque corpora nec
              te, ex iudico eloquentiam mel. Pro aliquip deseruisse ad, ex summo
              tacimates eum, eu augue sensibus urbanitas duo. Sed illum
              rationibus ei. An sit scripta vivendum, nec id enim magna. Ne
              viderer corrumpit per, eos movet salutatus at. Delectus gubergren
              accommodare vix at.
            </RDText>
            <RDText style={{ marginTop: 10 }} variant="h2">
              Informativa
            </RDText>
            <RDText variant="body">
              Lorem ipsum dolor sit amet, regione consulatu duo no. Sit rebum
              nobis senserit an, no scripta discere vel. Cum ex doming
              disputando, eu vim quidam indoctum. Dicta legere id ius. Veri
              reformidans has ei, ex per saepe ullamcorper, ut fugit periculis
              eam. Adhuc aeque corpora nec te, ex iudico eloquentiam mel. Pro
              aliquip deseruisse ad, ex summo tacimates eum, eu augue sensibus
              urbanitas duo. Sed illum rationibus ei. An sit scripta vivendum,
              nec id enim magna. Ne viderer corrumpit per, eos movet salutatus
              at. Delectus gubergren accommodare vix at.
            </RDText>
            <RDText style={{ marginTop: 10 }} variant="h2">
              Firma Cliente
            </RDText>
            {!onlyView ? (
              <RDButton
                style={{
                  backgroundColor: signature
                    ? colors.mainGreen
                    : colors.mainBlack,
                  width: "100%",
                  marginTop: 10,
                }}
                activeOpacity={signature && 1}
                onPress={() => {
                  !signature && setSignModal(true);
                }}
                variant="contained"
                label={signature ? "Firmato" : "Inserisci Firma"}
              />
            ) : (
              <Image
                style={{ width: "90%", height: 200, maxWidth: 300 }}
                source={{ uri: thisSignature }}
              />
            )}
          </View>
        </RDContainer>
      </ScrollView>
      {!onlyView && (
        <View style={styles.btnContainer}>
          <RDButton
            loading={loading}
            disabled={
              !filter || !downPayment || signature === null ? true : false
            }
            onPress={startService}
            variant="contained"
            label="Inizia servizio"
          />
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
});
