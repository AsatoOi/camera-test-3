import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from "react-native";
import { Camera, CameraType } from "expo-camera";

const vision = require("@google-cloud/vision");
import { CONFIG } from "../config/environments.js";

const client = new vision.ImageAnnotatorClient(CONFIG);

export const MyCamera = () => {
  const [hasPermission, setHasPermission] = useState < any > null;
  const [camera, setCamera] = useState < any > null;
  const [data, setData] = useState < string > "";

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const image = await camera.takePictureAsync();
      console.log(image);
      sendCloudVision(image.base64);
    }
  };

  const sendCloudVision = async (image_path) => {
    const [result] = await client.textDetection(image_path);
    const detections = result.textAnnotations;
    const descriptions = detections.map((text) => text.description);
    setData(descriptions[0]);
    console.log(data);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Camera
          style={styles.camera}
          type={CameraType.back}
          ref={(ref) => {
            setCamera(ref);
          }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={takePicture}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  buttonContainer: {
    height: 60,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  touchableOpacity: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "black",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
