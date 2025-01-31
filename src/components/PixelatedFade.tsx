interface PixelatedFadeProps {
    direction: "bottom" | "right";
}

export function PixelatedFade({ direction }: PixelatedFadeProps) {
    const baseClasses = "absolute z-10 pointer-events-none";
    const positionClasses =
        direction === "bottom"
            ? "left-0 right-0 bottom-0 h-16"
            : "top-0 bottom-0 right-0 w-16";
    const gradientClasses =
        direction === "bottom"
            ? "bg-gradient-to-t from-white to-transparent"
            : "bg-gradient-to-l from-white to-transparent";

    return (
        <div className={`${baseClasses} ${positionClasses} ${gradientClasses}`}>
            <div className="absolute inset-0 bg-[url('/large-pixel-pattern.png')] bg-repeat opacity-50 mix-blend-multiply"></div>
        </div>
    );
}
