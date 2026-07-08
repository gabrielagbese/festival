"use client";
import { RowsPhotoAlbum_default } from "./rows.js";
import { ColumnsPhotoAlbum_default } from "./columns.js";
import { MasonryPhotoAlbum_default } from "./masonry.js";
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/client/aggregate/PhotoAlbum.tsx
function PhotoAlbum({ layout, ...rest }, ref) {
	if (layout === "rows") return jsx(RowsPhotoAlbum_default, {
		ref,
		...rest
	});
	if (layout === "columns") return jsx(ColumnsPhotoAlbum_default, {
		ref,
		...rest
	});
	if (layout === "masonry") return jsx(MasonryPhotoAlbum_default, {
		ref,
		...rest
	});
	return null;
}
var PhotoAlbum_default = forwardRef(PhotoAlbum);
//#endregion
export { PhotoAlbum_default, PhotoAlbum_default as default };
