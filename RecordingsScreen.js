import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

export default function RecordingsScreen({ route }) {
  const { recordings, clearRecordings } = route.params;

  const navigation = useNavigation();

  async function playRecording(recording) {
    const { sound } = await Audio.Sound.createAsync({
      uri: recording.file,
    });
    await sound.playAsync();
  }

  return (
    <View style={styles.container}>
      <Text>Recordings:</Text>
      {recordings.map((recording, index) => (
        <View key={index} style={styles.row}>
          <Text>Duration: {recording.duration} ms</Text>
          <Button title="Play" onPress={() => playRecording(recording)} />
        </View>
      ))}
      <Button title="Clear Recordings" onPress={() => {
        clearRecordings();
        navigation.goBack();
      }} />
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
  goBackButton: {
    marginTop: 20,
  },
});
