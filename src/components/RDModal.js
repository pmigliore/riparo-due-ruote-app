import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import RDButton from "../../src/components/RDButton.js";
import RDText from "../../src/components/RDText.js";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors.js";
import * as ImagePicker from "expo-image-picker";
import { Video, AVPlaybackStatus, Audio } from "expo-av";
import QRCode from "react-native-qrcode-svg";
import * as Print from "expo-print";

// firebase
import { db, storage } from "../api/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref as storageUpload } from "firebase/storage";
import { uploadBytes, getDownloadURL } from "firebase/storage";

export default function RDModal({
  category,
  onSign,
  style,
  visible,
  onRequestClose,
  onPressOut,
  onClose,
  attachments,
  code,
  clientName,
  date,
  serviceId,
  justView,
  onDone,
}) {
  const video = useRef(null);

  let qrCode = "";
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [mediaType, setMediaType] = useState("Video/Foto");
  const [status, setStatus] = useState({});
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();

  useEffect(() => {
    if (attachments || attachments !== undefined) {
      setFiles(attachments);
    }
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "All",
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 30,
    });

    if (!result.cancelled) {
      let arr = files;
      arr.push(result);
      setFiles([...arr]);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    let object = {
      uri: uri,
      type: "audio",
    };
    let arr = files;
    arr.push(object);
    setFiles([...arr]);
  };

  const playSound = async (e) => {
    const { sound } = await Audio.Sound.createAsync({ uri: e.uri });
    setSound(sound);
    await sound.playAsync();
  };

  const deleteFile = (e) => {
    Alert.alert("Elimina File", "", [
      {
        text: "Cancel",
        style: "Cancella",
      },
      {
        text: "Elimina",
        onPress: () => {
          let arr = files;
          for (let i = 0; i < files.length; i++) {
            if (files[i].uri === e.uri) {
              arr.splice(i, 1);
              setFiles([...arr]);
            }
          }
        },
      },
    ]);
  };

  const printCode = () => {
    qrCode.toDataURL(async (data) => {
      const { uri } = await Print.printAsync({
        html: `
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            </head>
            <body style="display: flex; flex-direction: column; justify-content: center; align-items: center">
              <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
                ${clientName}
              </h1>
              <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
                ${date}
              </h1>
              <img
                src="data:image/png;base64,${data}"
                style="width: 50vw;" />
            </body>
          </html>
        `,
      }).catch((err) => console.log(err));
    });
  };

  const saveAttach = async () => {
    setLoading(true);
    let mediaArr = [];

    const metadata = {
      contentType: null,
    };

    for (let i = 0; i < files.length; i++) {
      if (!files[i].uploaded) {
        const response = await fetch(files[i].uri);
        const blob = await response.blob();
        var ref = storageUpload(storage, `media/${serviceId}/${Math.random()}`);
        await uploadBytes(ref, blob, metadata);
        await getDownloadURL(ref)
          .then((metadata) => {
            let obj = {
              uploaded: true,
              type: files[i].type,
              uri: metadata,
            };
            mediaArr.push(obj);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        mediaArr.push(files[i]);
      }
    }

    const saveMedia = doc(db, "services", "allServices", "current", serviceId);
    await updateDoc(saveMedia, {
      attachments: mediaArr.length !== 0 && mediaArr,
    })
      .then(() => {
        setLoading(false);
        onDone(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", ...style }}
        activeOpacity={1}
        onPressOut={onPressOut}
      >
        <TouchableWithoutFeedback>
          {category === "attachments" ? (
            <SafeAreaView style={styles.container}>
              <View style={styles.containerHeader}>
                <RDText variant="h2">Allegati</RDText>
                <TouchableOpacity
                  onPress={onClose}
                  style={{ marginLeft: 15, marginRight: 10 }}
                >
                  <Ionicons name="close-outline" size={30} />
                </TouchableOpacity>
              </View>
              <View style={styles.containerBtn}>
                <RDButton
                  style={{
                    backgroundColor:
                      mediaType !== "Video/Foto"
                        ? colors.mainGray
                        : colors.mainBlue,
                    width: "47%",
                  }}
                  onPress={() => setMediaType("Video/Foto")}
                  variant="contained"
                  label="Video/Foto"
                />
                <RDButton
                  style={{
                    backgroundColor:
                      mediaType !== "Audio" ? colors.mainGray : colors.mainBlue,
                    width: "47%",
                  }}
                  onPress={() => setMediaType("Audio")}
                  variant="contained"
                  label="Audio"
                />
              </View>
              {!justView && (
                <RDButton
                  form
                  variant="contained"
                  black
                  label={
                    mediaType === "Video/Foto"
                      ? "Aggiungi Video/Foto"
                      : recording
                      ? "Stop"
                      : "Inizia Vocale"
                  }
                  onPress={
                    mediaType === "Video/Foto"
                      ? pickImage
                      : recording
                      ? stopRecording
                      : startRecording
                  }
                />
              )}
              <ScrollView
                contentContainerStyle={{
                  alignItems: "center",
                }}
                style={{ width: "100%", marginBottom: 65 }}
              >
                {files.map((item) => (
                  <TouchableOpacity
                    key={item.uri}
                    activeOpacity={item.type === "video" ? 1 : 0.5}
                    onLongPress={() => deleteFile(item)}
                    onPress={() => {
                      item.type === "audio" && playSound(item);
                    }}
                    style={{
                      width: "90%",
                      maxHeight: 170,
                      marginTop: 10,
                    }}
                  >
                    {item.type === "image" ? (
                      <Image
                        key={item.uri}
                        source={{ uri: item.uri }}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : item.type === "video" ? (
                      <Video
                        ref={video}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        source={{
                          uri: item.uri,
                        }}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                        onPlaybackStatusUpdate={(status) =>
                          setStatus(() => status)
                        }
                      />
                    ) : (
                      <View style={styles.audioContainer}>
                        <RDText
                          variant="h2"
                          style={{ color: colors.mainWhite }}
                        >
                          Play Audio
                        </RDText>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {!justView && (
                <View style={styles.btnContainer}>
                  <RDButton
                    loading={loading}
                    onPress={saveAttach}
                    variant="contained"
                    label="Salva Allegati"
                  />
                </View>
              )}
            </SafeAreaView>
          ) : (
            <SafeAreaView style={styles.container}>
              <View
                style={[styles.containerHeader, { justifyContent: "flex-end" }]}
              >
                <TouchableOpacity
                  onPress={onClose}
                  style={{ marginLeft: 15, marginRight: 10 }}
                >
                  <Ionicons name="close-outline" size={30} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: 300,
                }}
              >
                <RDText style={{ fontSize: 18 }} variant="h2">
                  {clientName}
                </RDText>
                <RDText style={{ fontSize: 18 }} variant="h2">
                  {date}
                </RDText>
                <QRCode
                  value={code}
                  getRef={(c) => (qrCode = c)}
                  logoSize={50}
                />
              </View>
              <TouchableOpacity
                onPress={printCode}
                style={{
                  backgroundColor: colors.mainBlue,
                  width: "90%",
                  height: 51,
                  flexDirection: "row",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingRight: 15,
                  paddingLeft: 15,
                }}
              >
                <RDText variant="h2" style={{ color: colors.mainWhite }}>
                  Stampa
                </RDText>
                <Ionicons name="print" color={colors.mainWhite} size={30} />
              </TouchableOpacity>
            </SafeAreaView>
          )}
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.mainWhite,
    alignItems: "center",
  },
  containerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 15,
  },
  containerBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
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
  audioContainer: {
    width: "100%",
    borderRadius: 30,
    backgroundColor: colors.mainBlue,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  position: "absolute",
  bottom: 0,
  width: "100%",
  alignItems: "center",
  borderTopWidth: 1,
  borderColor: colors.mainGray,
  paddingTop: 10,
  backgroundColor: colors.mainWhite,
  height: 100,
});
