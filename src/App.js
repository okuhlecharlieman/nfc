import React, { useEffect, useState } from "react";
import { Text, Button, View, Alert, Image } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";

const NFCComponent = () => {
  const [tagData, setTagData] = useState(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported();
      if (deviceIsSupported) {
        NfcManager.start();
        NfcManager.isEnabled().then((enabled) => {});
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
        setShowImage(true);
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
          {showImage && (
            <Image
              source={{
                uri: "https://cashfreelogo.cashfree.com/website/landings/instant-settlements/payment-done.png",
              }}
              style={{ width: 100, height: 100 }}
            />
          )}
        </>
      );
    } else {
      return <Text>No NFC tag detected.</Text>;
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={{
          uri: "https://restechtoday.com/wp-content/uploads/2022/03/NFC-Card.png",
        }}
        style={{ width: 250, height: 250 }}
      />

      <Button title="Scan NFC" onPress={handleReadTag} />
      {renderTagData()}
    </View>
  );
};

export default NFCComponent;
