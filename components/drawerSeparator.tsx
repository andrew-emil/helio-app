import { View } from "react-native";

export const DrawerSeparator = ({ color }: { color: string }) => (
    <View style={{
        height: 1,
        backgroundColor: color || '#e0e0e0',
        marginHorizontal: 16,
        marginVertical: 8
    }} />
);
