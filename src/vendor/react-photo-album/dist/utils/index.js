//#region src/utils/clsx.ts
function clsx(...classes) {
	return classes.filter(Boolean).join(" ");
}
//#endregion
//#region src/utils/css.ts
function cssClass(suffix) {
	return ["react-photo-album", suffix].filter(Boolean).join("--");
}
function cssVar(suffix) {
	return `--${cssClass(suffix)}`;
}
//#endregion
//#region src/utils/ratio.ts
function ratio({ width, height }) {
	const result = width / height;
	return Number.isFinite(result) ? result : 1;
}
//#endregion
//#region src/utils/responsive.ts
var breakpoints = Object.freeze([
	1200,
	600,
	300,
	0
]);
function unwrap(value, arg) {
	return typeof value === "function" ? value(arg) : value;
}
function unwrapParameter(value, containerWidth) {
	return containerWidth !== void 0 ? unwrap(value, containerWidth) : void 0;
}
function selectResponsiveValue(values, containerWidth) {
	const index = breakpoints.findIndex((breakpoint) => breakpoint <= containerWidth);
	return unwrap(values[Math.max(index, 0)], containerWidth);
}
function resolveResponsiveParameter(parameter, containerWidth, values, minValue = 0) {
	if (containerWidth === void 0) return void 0;
	const value = unwrapParameter(parameter, containerWidth);
	return Math.round(Math.max(value === void 0 ? selectResponsiveValue(values, containerWidth) : value, minValue));
}
function resolveCommonProps(containerWidth, { spacing, padding, componentsProps, render }) {
	return {
		spacing: resolveResponsiveParameter(spacing, containerWidth, [
			20,
			15,
			10,
			5
		]),
		padding: resolveResponsiveParameter(padding, containerWidth, [
			0,
			0,
			0,
			0
		]),
		componentsProps: unwrap(componentsProps, containerWidth) || {},
		render: unwrap(render, containerWidth)
	};
}
//#endregion
//#region src/utils/round.ts
function round(value, decimals = 0) {
	const factor = 10 ** decimals;
	return Math.round((value + Number.EPSILON) * factor) / factor;
}
//#endregion
//#region src/utils/sizes.ts
function srcSetAndSizes(photo, responsiveSizes, photoWidth, containerWidth, photosCount, spacing, padding) {
	let srcSet;
	let sizes;
	const calcSizes = (base) => {
		const gaps = spacing * (photosCount - 1) + 2 * padding * photosCount;
		return `calc((${base.match(/^\s*calc\((.*)\)\s*$/)?.[1] ?? base} - ${gaps}px) / ${round((containerWidth - gaps) / photoWidth, 5)})`;
	};
	const images = photo.srcSet;
	if (images && images.length > 0) srcSet = images.concat(!images.some(({ width }) => width === photo.width) ? [{
		src: photo.src,
		width: photo.width,
		height: photo.height
	}] : []).sort((first, second) => first.width - second.width).map((image) => `${image.src} ${image.width}w`).join(", ");
	if (responsiveSizes?.size) sizes = (responsiveSizes.sizes || []).map(({ viewport, size }) => `${viewport} ${calcSizes(size)}`).concat(calcSizes(responsiveSizes.size)).join(", ");
	else sizes = `${Math.ceil(photoWidth / containerWidth * 100)}vw`;
	return {
		srcSet,
		sizes
	};
}
//#endregion
export { clsx, clsx as clsx$1, cssClass, cssVar, ratio, ratio as ratio$1, resolveCommonProps, resolveResponsiveParameter, round, round as round$1, srcSetAndSizes, srcSetAndSizes as srcSetAndSizes$1, unwrap, unwrapParameter };
