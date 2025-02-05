import type React from "react";

interface TexturedBackgroundProps {
    dotColor?: string;
    backgroundColor?: string;
    dotSize?: number;
    dotSpacing?: number;
    children: React.ReactNode;
}

export const TexturedBackground: React.FC<TexturedBackgroundProps> = ({
    dotColor = "currentColor",
    backgroundColor = "transparent",
    dotSize = 1,
    dotSpacing = 20,
    children,
}) => {
    return (
        <div className="relative">
            <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                width={dotSpacing}
                height={dotSpacing}
            >
                <defs>
                    <pattern
                        id="dotted-pattern"
                        x="0"
                        y="0"
                        width={dotSpacing}
                        height={dotSpacing}
                        patternUnits="userSpaceOnUse"
                    >
                        <circle
                            cx={dotSize}
                            cy={dotSize}
                            r={dotSize}
                            fill={dotColor}
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={backgroundColor} />
                <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
            </svg>
            <div className="relative z-10">{children}</div>
        </div>
    );
};
