import { FONTS_CONSTANTS } from "@/constants/fontsConstants";
import GradientText from "./gradiantText";

export default function AnimatedGradientTitle() {

    return (
        <GradientText
            colors={['#27d0ee', '#BE85FC']}
            style={{
                fontFamily: FONTS_CONSTANTS.bold,
                fontSize: 22,
                textAlign: 'center',
            }}
        >
            Helio App
        </GradientText>
    );
}