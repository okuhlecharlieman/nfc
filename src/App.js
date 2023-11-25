import React, { useEffect, useState } from "react";
import { Text, Button, View, Alert, Image } from "react-native";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";

const NFCComponent = () => {
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [tagData, setTagData] = useState(null);

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported();
      if (deviceIsSupported) {
        NfcManager.start();
        NfcManager.isEnabled().then((enabled) => {
          setNfcEnabled(enabled);
        });
        NfcManager.registerTagEvent((tag) => {
          setTagData(tag);
        });
        NfcManager.setEventListener(NfcTech.Ndef, (error) => {
          console.log("NFC Error:", error);
          Alert.alert("NFC Error", error);
        });
      } else {
        console.log("Device does not support NFC");
      }
    };
    checkIsSupported();
    return () => {
      NfcManager.unregisterTagEvent();
      NfcManager.cancelTechnologyRequest().catch(() => {});
      NfcManager.setEventListener(NfcTech.Ndef, null);
    };
  }, []);

  const handleReadTag = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag) {
        setTagData(tag);
      }
      await NfcManager.cancelTechnologyRequest();
    } catch (error) {
      console.log("Error reading tag:", error);
      Alert.alert("Error", "Error reading NFC tag.");
    }
  };

  const renderTagData = () => {
    if (tagData) {
      return (
        <>
          <Text>Tag ID: {tagData.id}</Text>
          <Image source={require("./path-to-your-image.png")} />
        </>
      );
    } else {
      return <Text>No NFC tag detected.</Text>;
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>NFC Enabled: {nfcEnabled ? "Yes" : "No"}</Text>
      <Button title="Scan NFC" onPress={handleReadTag} />
      {renderTagData()}
    </View>
  );
};

export default NFCComponent;
