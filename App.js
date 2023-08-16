import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";
import { ImageBackground } from 'react-native';

import RecordingsScreen from "./RecordingsScreen";

const Stack = createStackNavigator();

export default function App() {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);

  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  }

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  }

  async function stopRecording() {
    if (!recording) {
      return;
    }

    await recording.stopAndUnloadAsync();
    const { sound, status } = await recording.createNewLoadedSoundAsync();

    const newRecording = {
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    };

    setRecordings((prevRecordings) => [...prevRecordings, newRecording]);
    setRecording(undefined);
  }

  function clearRecordings() {
    setRecordings([]);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={({ navigation }) => ({
            title: "Home",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Recordings", { clearRecordings })}
              >
                <Feather name="list" size={24} color="black" style={styles.icon} />
              </TouchableOpacity>
            ),
          })}
        >
          {() => (
            <ImageBackground
            source={{ uri: 'https://cdn.pixabay.com/photo/2017/10/28/15/44/guitar-2897355_640.jpg' }}
             style={styles.container}>
              <TouchableOpacity
                onPress={recording ? stopRecording : startRecording}
                style={styles.recordButton}
              >
                <Feather
                  name={recording ? "stop-circle" : "mic"}
                  size={48}
                  color="white"
                />
              </TouchableOpacity>
            </ImageBackground>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Recordings"
          component={RecordingsScreen}
          initialParams={{ recordings, clearRecordings }}
          options={{ title: "Recordings" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
  },
  recordButton: {
    backgroundColor: "#0FA615",
    padding: 20,
    borderRadius: 100,
  },
  icon: {
    marginRight: 16,
  },
});
