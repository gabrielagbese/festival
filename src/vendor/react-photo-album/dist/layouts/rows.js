import { ratio$1 as ratio, round$1 as round } from "../utils/index.js";
//#region src/layouts/rows/rows.ts
var TIEBREAKER_EPSILON = 1.005;
function findMaxPhotosPerRow(photos, containerWidth, targetRowHeight, minPhotos) {
	return round(containerWidth / targetRowHeight / Math.min(...photos.map((photo) => ratio(photo)))) + (minPhotos || 0) + 2;
}
function getCommonHeight(photos, containerWidth, spacing, padding) {
	return (containerWidth - (photos.length - 1) * spacing - 2 * padding * photos.length) / photos.reduce((acc, photo) => acc + ratio(photo), 0);
}
function cost(photos, i, j, width, spacing, padding, targetRowHeight) {
	const row = photos.slice(i, j);
	const commonHeight = getCommonHeight(row, width, spacing, padding);
	return commonHeight > 0 ? (commonHeight - targetRowHeight) ** 2 * row.length : void 0;
}
function computeRowsLayout(photos, spacing, padding, containerWidth, targetRowHeight, minPhotos, maxPhotos) {
	const maxPerRow = Math.min(findMaxPhotosPerRow(photos, containerWidth, targetRowHeight, minPhotos), maxPhotos || Infinity);
	const minPerRow = minPhotos || 1;
	const n = photos.length;
	const dp = new Array(n + 1).fill(Infinity);
	const prev = new Array(n + 1).fill(-1);
	dp[0] = 0;
	for (let j = 1; j <= n; j += 1) for (let i = j - minPerRow; i >= Math.max(0, j - maxPerRow); i -= 1) {
		if (dp[i] === Infinity) continue;
		const c = cost(photos, i, j, containerWidth, spacing, padding, targetRowHeight);
		if (c === void 0) break;
		const newCost = dp[i] + c;
		if (dp[j] === Infinity || dp[j] > newCost && (dp[j] / newCost > TIEBREAKER_EPSILON || prev[j] !== -1 && prev[j] < i)) {
			dp[j] = newCost;
			prev[j] = i;
		}
	}
	if (dp[n] === Infinity) return void 0;
	const path = [];
	for (let node = n; node !== 0; node = prev[node]) path.push(node);
	path.push(0);
	path.reverse();
	const tracks = [];
	for (let i = 1; i < path.length; i += 1) {
		const row = photos.slice(path[i - 1], path[i]).map((photo, j) => ({
			photo,
			index: path[i - 1] + j
		}));
		const height = getCommonHeight(row.map(({ photo }) => photo), containerWidth, spacing, padding);
		tracks.push({ photos: row.map(({ photo, index }) => ({
			photo,
			index,
			width: height * ratio(photo),
			height
		})) });
	}
	return {
		spacing,
		padding,
		containerWidth,
		tracks,
		horizontal: true
	};
}
//#endregion
export { computeRowsLayout, computeRowsLayout as default };
