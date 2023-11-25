import React, { useEffect, useState } from "react";
import { Text, Button, View } from "react-native";
import NfcManager, { NfcEvents, NfcTech } from "react-native-nfc-manager";

const NFCComponent = () => {
  const [nfcEnabled, setNfcEnabled] = useState(false);
  const [tagData, setTagData] = useState(null);

  useEffect(() => {
    // Initialize NFC manager
    NfcManager.start();

    // Check if NFC is enabled on the device
    NfcManager.isEnabled().then((enabled) => {
      setNfcEnabled(enabled);
    });

    // Set up NFC tag detection event listener
    NfcManager.registerTagEvent((tag) => {
      setTagData(tag);
    });

    return () => {
      // Clean up NFC manager
      NfcManager.unregisterTagEvent();
      NfcManager.cancelTechnologyRequest().catch(() => {});
      NfcManager.unregisterTagEvent().catch(() => {});
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
    }
  };

  const renderTagData = () => {
    if (tagData) {
      return <Text>Tag ID: {tagData.id}</Text>;
    } else {
      return <Text>No NFC tag detected.</Text>;
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>NFC Enabled: {nfcEnabled ? "Yes" : "No"}</Text>
      <Button title="Read NFC Tag" onPress={handleReadTag} />
      {renderTagData()}
    </View>
  );
};

export default NFCComponent;
