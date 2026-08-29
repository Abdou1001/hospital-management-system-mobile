import React from "react";
import { SvgProps } from "react-native-svg";

export type IconProps = SvgProps & {
    icon: React.ComponentType<SvgProps & { className?: string }>;
    size?: number;
    color?: string;
    className?: string;
};

export default function Icon({
    icon: IconComponent,
    size = 24,
    color,
    className,
    ...props
}: IconProps) {
    if (!IconComponent) return null;
    return (
        <IconComponent
            width={size}
            height={size}
            {...(color ? { color } : {})}
            {...(className ? { className } : {})}
            {...props}
        />
    );
}
