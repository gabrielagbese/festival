import { clsx$1 as clsx } from "../utils/index.js";
import { StaticPhotoAlbum_default } from "../static/index.js";
import resolveRowsProps from "../client/rowsProps.js";
import { computeRowsLayout } from "../layouts/rows.js";
import resolveColumnsProps from "../client/columnsProps.js";
import { computeColumnsLayout } from "../layouts/columns.js";
import resolveMasonryProps from "../client/masonryProps.js";
import { computeMasonryLayout } from "../layouts/masonry.js";
import { StyledBreakpoints$1 as StyledBreakpoints, useBreakpoints$1 as useBreakpoints } from "../ssr/breakpoints.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/server/ServerPhotoAlbum.tsx
function ServerPhotoAlbum({ layout, unstyled, classNames, breakpoints: breakpointsProp, ...props }) {
	const { photos } = props;
	const { breakpoints, containerClass, breakpointClass } = useBreakpoints("server", breakpointsProp);
	if (!Array.isArray(photos) || !Array.isArray(breakpoints) || breakpoints.length === 0) return null;
	const computeModel = (breakpoint) => {
		if (layout === "rows") {
			const { spacing, padding, targetRowHeight, minPhotos, maxPhotos, ...rest } = resolveRowsProps(breakpoint, props);
			return {
				...rest,
				model: computeRowsLayout(photos, spacing, padding, breakpoint, targetRowHeight, minPhotos, maxPhotos)
			};
		}
		if (layout === "columns") {
			const { spacing, padding, columns, ...rest } = resolveColumnsProps(breakpoint, props);
			return {
				...rest,
				model: computeColumnsLayout(photos, spacing, padding, breakpoint, columns)
			};
		}
		if (layout === "masonry") {
			const { spacing, padding, columns, ...rest } = resolveMasonryProps(breakpoint, props);
			return {
				...rest,
				model: computeMasonryLayout(photos, spacing, padding, breakpoint, columns)
			};
		}
		return null;
	};
	return jsxs(Fragment, { children: [!unstyled && jsx(StyledBreakpoints, {
		breakpoints,
		containerClass,
		breakpointClass
	}), jsx("div", {
		className: clsx(containerClass, classNames?.container),
		children: breakpoints.map((breakpoint) => jsx("div", {
			className: clsx(breakpointClass(breakpoint), classNames?.breakpoints?.[breakpoint]),
			children: jsx(StaticPhotoAlbum_default, {
				layout,
				...computeModel(breakpoint)
			})
		}, breakpoint))
	})] });
}
//#endregion
export { ServerPhotoAlbum as default };
