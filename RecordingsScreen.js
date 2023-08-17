import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

export default function RecordingsScreen({ route }) {
  const { recordings, clearRecordings } = route.params;

  const navigation = useNavigation();
  const [elapsedTime, setElapsedTime] = useState(0);

  async function playRecording(recording) {
    const { sound } = await Audio.Sound.createAsync({
      uri: recording.file,
    });

    const playBackStatus = await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isPlaying) {
        setElapsedTime(status.positionMillis);
      } else {
        setElapsedTime(0);
      }
    });
  }

  function formatTime(milliseconds) {
    const totalSeconds = milliseconds / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text>Recordings:</Text>
        {recordings.map((recording, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.text}>Duration:{formatTime(elapsedTime)} </Text>
            <Button title="Play" onPress={() => playRecording(recording)} />
          </View>
        ))}
      </View>
      <Button
        title="Clear Recordings"
        onPress={() => {
          clearRecordings();
          navigation.goBack();
        }}
      />
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
        style={styles.goBackButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
    
  },
  text:{
    color: 'blue',
  },
  goBackButton: {
    marginTop: 20,
  },
});
