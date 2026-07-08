import { ratio$1 as ratio } from "../utils/index.js";
//#region src/layouts/columns/partition.ts
var TIEBREAKER_EPSILON = 1.0001;
function computePartition(costFn, partitions, start, end) {
	const dp = /* @__PURE__ */ new Map();
	const queue = /* @__PURE__ */ new Set();
	queue.add(start);
	for (let partition = 0; partition < partitions; partition += 1) {
		const currentQueue = [...queue.keys()];
		queue.clear();
		currentQueue.forEach((splitPoint) => {
			const accumulatedCost = partition > 0 ? dp.get(splitPoint)[partition][1] : 0;
			costFn(splitPoint).forEach(([next, cost]) => {
				let entry = dp.get(next);
				if (!entry) {
					entry = [];
					dp.set(next, entry);
				}
				const newCost = accumulatedCost + cost;
				const existing = entry[partition + 1];
				if (!existing || existing[1] > newCost && (existing[1] / newCost > TIEBREAKER_EPSILON || splitPoint < existing[0])) entry[partition + 1] = [splitPoint, newCost];
				if (partition < partitions - 1 && next !== end) queue.add(next);
			});
		});
	}
	return dp;
}
function reconstructPartition(dp, partitions, end) {
	const splitPoints = [end];
	for (let item = end, k = partitions; k > 0; k -= 1) {
		[item] = dp.get(item)[k];
		splitPoints.push(item);
	}
	return splitPoints.reverse();
}
function findOptimalPartition(costFn, partitions, start, end) {
	return reconstructPartition(computePartition(costFn, partitions, start, end), partitions, end);
}
//#endregion
//#region src/layouts/columns/columns.ts
function makePartitionCostFn(photos, spacing, padding, targetColumnWidth, targetColumnHeight) {
	return (splitPoint) => {
		const results = [];
		const cutOffHeight = targetColumnHeight * 1.5;
		let height = targetColumnWidth / ratio(photos[splitPoint]) + 2 * padding;
		for (let i = splitPoint + 1; i < photos.length + 1; i += 1) {
			results.push([i, (targetColumnHeight - height) ** 2]);
			if (height > cutOffHeight || i === photos.length) break;
			height += targetColumnWidth / ratio(photos[i]) + spacing + 2 * padding;
		}
		return results;
	};
}
function buildColumnsModel(path, photos, spacing, padding, containerWidth, columnsGaps, columnsRatios) {
	const tracks = [];
	const totalRatio = columnsRatios.reduce((total, columnRatio) => total + columnRatio, 0);
	for (let i = 0; i < path.length - 1; i += 1) {
		const column = photos.slice(path[i], path[i + 1]).map((photo, j) => ({
			photo,
			index: path[i] + j
		}));
		const adjustedGaps = columnsRatios.reduce((total, columnRatio, index) => total + (columnsGaps[i] - columnsGaps[index]) * columnRatio, 0);
		const columnWidth = (containerWidth - (path.length - 2) * spacing - 2 * (path.length - 1) * padding - adjustedGaps) * columnsRatios[i] / totalRatio;
		tracks.push({
			photos: column.map(({ photo, index }) => ({
				photo,
				index,
				width: columnWidth,
				height: columnWidth / ratio(photo)
			})),
			variables: {
				adjustedGaps,
				columnRatio: columnsRatios[i]
			}
		});
	}
	return {
		tracks,
		variables: { totalRatio }
	};
}
function computeColumnsModel(photos, spacing, padding, containerWidth, targetColumnWidth, columns) {
	const columnsGaps = [];
	const columnsRatios = [];
	if (photos.length <= columns) {
		const averageRatio = photos.length > 0 ? photos.reduce((acc, photo) => acc + ratio(photo), 0) / photos.length : 1;
		for (let i = 0; i < columns; i += 1) {
			columnsGaps[i] = 2 * padding;
			columnsRatios[i] = i < photos.length ? ratio(photos[i]) : averageRatio;
		}
		return buildColumnsModel(Array.from({ length: columns + 1 }, (_, index) => Math.min(index, photos.length)), photos, spacing, padding, containerWidth, columnsGaps, columnsRatios);
	}
	const path = findOptimalPartition(makePartitionCostFn(photos, spacing, padding, targetColumnWidth, (photos.reduce((acc, photo) => acc + targetColumnWidth / ratio(photo), 0) + spacing * (photos.length - columns) + 2 * padding * photos.length) / columns), columns, 0, photos.length);
	for (let i = 0; i < path.length - 1; i += 1) {
		const column = photos.slice(path[i], path[i + 1]);
		columnsGaps[i] = spacing * (column.length - 1) + 2 * padding * column.length;
		columnsRatios[i] = 1 / column.reduce((acc, photo) => acc + 1 / ratio(photo), 0);
	}
	return buildColumnsModel(path, photos, spacing, padding, containerWidth, columnsGaps, columnsRatios);
}
function computeColumnsLayout(photos, spacing, padding, containerWidth, columns) {
	const { tracks, variables } = computeColumnsModel(photos, spacing, padding, containerWidth, (containerWidth - spacing * (columns - 1) - 2 * padding * columns) / columns, columns);
	if (tracks.some((track) => track.photos.some(({ width, height }) => width <= 0 || height <= 0))) return columns > 1 ? computeColumnsLayout(photos, spacing, padding, containerWidth, columns - 1) : void 0;
	return {
		tracks,
		spacing,
		padding,
		containerWidth,
		variables: {
			columns,
			...variables
		}
	};
}
//#endregion
export { computeColumnsLayout, computeColumnsLayout as default };
