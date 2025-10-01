import React from 'react';
import { View } from 'react-native-reanimated/lib/typescript/Animated';

const Spinner: React.FC = () => (
    <View className="flex justify-center items-center h-full w-full py-20">
        <View className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></View>
    </View>
);

export default Spinner;