"use client";
import { useContainerWidth$1 as useContainerWidth } from "./hooks.js";
import { StaticPhotoAlbum_default } from "../static/index.js";
import resolveRowsProps from "./rowsProps.js";
import { computeRowsLayout } from "../layouts/rows.js";
import { forwardRef, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/client/rows/RowsPhotoAlbum.tsx
function RowsPhotoAlbum({ photos, breakpoints, defaultContainerWidth, ...rest }, ref) {
	const { containerRef, containerWidth } = useContainerWidth(ref, breakpoints, defaultContainerWidth);
	const { spacing, padding, targetRowHeight, minPhotos, maxPhotos, ...restProps } = resolveRowsProps(containerWidth, {
		photos,
		...rest
	});
	return jsx(StaticPhotoAlbum_default, {
		layout: "rows",
		ref: containerRef,
		model: useMemo(() => containerWidth !== void 0 && spacing !== void 0 && padding !== void 0 && targetRowHeight !== void 0 ? computeRowsLayout(photos, spacing, padding, containerWidth, targetRowHeight, minPhotos, maxPhotos) : void 0, [
			photos,
			spacing,
			padding,
			containerWidth,
			targetRowHeight,
			minPhotos,
			maxPhotos
		]),
		...restProps
	});
}
var RowsPhotoAlbum_default = forwardRef(RowsPhotoAlbum);
//#endregion
export { RowsPhotoAlbum_default, RowsPhotoAlbum_default as default };
