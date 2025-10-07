import React from "react";
import { View, Image, Text } from "react-native";

export default function TestRemoteImage({ uri }) {
    return (
        <View style={{ width: 320, height: 180, backgroundColor: "#222", borderRadius: 12, overflow: "hidden" }}>
            <Image
                source={uri ? { uri } : require("@/assets/images/servicesjpg.jpg")}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                onLoad={() => console.log("TestRemoteImage: loaded")}
                onError={(e) => console.log("TestRemoteImage: error", e.nativeEvent?.error || e)}
            />
            {!uri && <Text>No URI provided</Text>}
        </View>
    );
}
