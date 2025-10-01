import React from "react";
import { Text } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

import type { ColorValue } from "react-native";

type GradientTextProps = {
    colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
    style?: any;
    [key: string]: any;
};

const GradientText = ({ colors, style, ...props }: GradientTextProps) => {
    return (
        <MaskedView maskElement={<Text {...props} style={style} />}>
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                {/* This Text element is invisible and defines the mask's size */}
                <Text {...props} style={[style, { opacity: 0 }]} />
            </LinearGradient>
        </MaskedView>
    );
};

export default GradientText;