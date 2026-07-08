"use client";
import { useContainerWidth$1 as useContainerWidth } from "./hooks.js";
import { StaticPhotoAlbum_default } from "../static/index.js";
import resolveColumnsProps from "./columnsProps.js";
import { computeColumnsLayout } from "../layouts/columns.js";
import { forwardRef, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/client/columns/ColumnsPhotoAlbum.tsx
function ColumnsPhotoAlbum({ photos, breakpoints, defaultContainerWidth, ...rest }, ref) {
	const { containerRef, containerWidth } = useContainerWidth(ref, breakpoints, defaultContainerWidth);
	const { spacing, padding, columns, ...restProps } = resolveColumnsProps(containerWidth, {
		photos,
		...rest
	});
	return jsx(StaticPhotoAlbum_default, {
		layout: "columns",
		ref: containerRef,
		model: useMemo(() => containerWidth !== void 0 && spacing !== void 0 && padding !== void 0 && columns !== void 0 ? computeColumnsLayout(photos, spacing, padding, containerWidth, columns) : void 0, [
			photos,
			spacing,
			padding,
			containerWidth,
			columns
		]),
		...restProps
	});
}
var ColumnsPhotoAlbum_default = forwardRef(ColumnsPhotoAlbum);
//#endregion
export { ColumnsPhotoAlbum_default, ColumnsPhotoAlbum_default as default };
