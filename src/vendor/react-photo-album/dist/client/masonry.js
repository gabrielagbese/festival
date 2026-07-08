"use client";
import { useContainerWidth$1 as useContainerWidth } from "./hooks.js";
import { StaticPhotoAlbum_default } from "../static/index.js";
import resolveMasonryProps from "./masonryProps.js";
import { computeMasonryLayout } from "../layouts/masonry.js";
import { forwardRef, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/client/masonry/MasonryPhotoAlbum.tsx
function MasonryPhotoAlbum({ photos, breakpoints, defaultContainerWidth, ...rest }, ref) {
	const { containerRef, containerWidth } = useContainerWidth(ref, breakpoints, defaultContainerWidth);
	const { spacing, padding, columns, ...restProps } = resolveMasonryProps(containerWidth, {
		photos,
		...rest
	});
	return jsx(StaticPhotoAlbum_default, {
		layout: "masonry",
		ref: containerRef,
		model: useMemo(() => containerWidth !== void 0 && spacing !== void 0 && padding !== void 0 && columns !== void 0 ? computeMasonryLayout(photos, spacing, padding, containerWidth, columns) : void 0, [
			photos,
			spacing,
			padding,
			containerWidth,
			columns
		]),
		...restProps
	});
}
var MasonryPhotoAlbum_default = forwardRef(MasonryPhotoAlbum);
//#endregion
export { MasonryPhotoAlbum_default, MasonryPhotoAlbum_default as default };
