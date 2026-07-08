import { resolveCommonProps, resolveResponsiveParameter } from "../utils/index.js";
//#region src/client/masonry/resolveMasonryProps.ts
function resolveMasonryProps(containerWidth, { columns, ...rest }) {
	return {
		...rest,
		...resolveCommonProps(containerWidth, rest),
		columns: resolveResponsiveParameter(columns, containerWidth, [
			5,
			4,
			3,
			2
		], 1)
	};
}
//#endregion
export { resolveMasonryProps as default };
