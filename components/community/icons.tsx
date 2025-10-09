import React from "react";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";
import { ViewStyle } from "react-native";

type IconProps = {
    size?: number;
    color?: string;
    style?: ViewStyle;
};

export const PlusIcon = (props: IconProps) => (
    <MaterialCommunityIcons name="plus" size={props.size ?? 18} color={props.color} />
);
export const ChatIcon = (props: IconProps) => (
    <Ionicons name="chatbubble-ellipses-outline" size={props.size ?? 18} color={props.color} />
);
export const LikeIcon = (props: IconProps) => (
    <Feather name="thumbs-up" size={props.size ?? 18} color={props.color} />
);
export const PinIcon = (props: IconProps) => (
    <Feather name="map-pin" size={props.size ?? 16} color={props.color} />
);
export const TagIcon = (props: IconProps) => (
    <Feather name="tag" size={props.size ?? 16} color={props.color} />
);
export const UsersIcon = (props: IconProps) => (
    <Feather name="users" size={props.size ?? 16} color={props.color} />
);
export const TrashIcon = (props: IconProps) => (
    <Feather name="trash-2" size={props.size ?? 16} color={props.color} />
);
