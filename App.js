import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Speech from "expo-speech";

export default function App() {
  const [location, setLocation] = useState(null);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // Fetch facilities from backend
      const data = await res.json();
      setFacilities(data);

      Speech.speak("Welcome to RailNav. Your location is detected.");
    })();
  }, []);

  const guideToExit = () => {
    let exit = facilities.find(f => f.type === "exit");
    if (exit) {
      Speech.speak(`In case of emergency, head towards ${exit.name}.`);
      Alert.alert("Emergency", `Nearest exit: ${exit.name}`);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="You are here"
            pinColor="blue"
          />

          {facilities.map((f, i) => (
            <Marker
              key={i}
              coordinate={{ latitude: f.latitude, longitude: f.longitude }}
              title={f.name}
              description={f.type}
              pinColor={f.type === "exit" ? "red" : "green"}
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading Map...</Text>
      )}

      <View style={styles.footer}>
        <Text onPress={guideToExit} style={styles.emergencyButton}>
          🚨 Emergency Guide
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  emergencyButton: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
});
