import { useTheme } from '@/context/themeContext';
import React from 'react';
import { View } from 'react-native';

const Spinner: React.FC = () => {
    const { colors } = useTheme()

    return (
        <View className="flex justify-center items-center h-full w-full py-20"
            style={{ backgroundColor: colors.background }}
        >
            <View className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></View>
        </View>
    );
}

export default Spinner;