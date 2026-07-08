import { resolveCommonProps, resolveResponsiveParameter } from "../utils/index.js";
//#region src/client/columns/resolveColumnsProps.ts
function resolveColumnsProps(containerWidth, { columns, ...rest }) {
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
export { resolveColumnsProps as default };
