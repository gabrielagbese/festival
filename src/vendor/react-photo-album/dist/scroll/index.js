"use client";
import { Children, cloneElement, isValidElement, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/scroll/useIntersectionObserver.ts
var observers = /* @__PURE__ */ new Map();
var rootId = 0;
var rootIds = /* @__PURE__ */ new WeakMap();
function getRootId(root) {
	if (!root) return 0;
	if (rootIds.has(root)) return rootIds.get(root);
	rootIds.set(root, ++rootId);
	return rootId;
}
function getObserverId(root, rootMargin) {
	return `${getRootId(root)}_${rootMargin}`;
}
function createObserver(root, rootMargin) {
	const id = getObserverId(root, rootMargin);
	let instance = observers.get(id);
	if (!instance) {
		const listeners = /* @__PURE__ */ new Map();
		instance = {
			id,
			observer: new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					listeners.get(entry.target)?.forEach((callback) => {
						callback(entry);
					});
				});
			}, {
				root,
				rootMargin
			}),
			listeners
		};
		observers.set(id, instance);
	}
	return instance;
}
function useIntersectionObserver(rootMargin, scrollContainer) {
	const root = scrollContainer?.() ?? null;
	return useMemo(() => {
		const cleanup = [];
		const observe = (target, callback) => {
			const { id, observer, listeners } = createObserver(root, rootMargin);
			let callbacks = listeners.get(target);
			if (!callbacks) {
				callbacks = /* @__PURE__ */ new Set();
				listeners.set(target, callbacks);
				observer.observe(target);
			}
			if (callbacks.has(callback)) return;
			callbacks.add(callback);
			cleanup.push(() => {
				callbacks.delete(callback);
				if (callbacks.size === 0) {
					listeners.delete(target);
					observer.unobserve(target);
				}
				if (listeners.size === 0) {
					observer.disconnect();
					observers.delete(id);
				}
			});
		};
		const unobserve = () => {
			cleanup.forEach((callback) => callback());
			cleanup.splice(0, cleanup.length);
		};
		return {
			observe,
			unobserve
		};
	}, [root, rootMargin]);
}
//#endregion
//#region src/scroll/Offscreen.tsx
function Offscreen({ rootMargin, scrollContainer, children }) {
	const [placeholder, setPlaceholder] = useState();
	const { observe, unobserve } = useIntersectionObserver(rootMargin, scrollContainer);
	const ref = useCallback((node) => {
		unobserve();
		if (node) observe(node, ({ isIntersecting }) => {
			if (isIntersecting) {
				setPlaceholder(void 0);
				return;
			}
			const { width, height } = node.getBoundingClientRect();
			const { marginTop, marginRight, marginBottom, marginLeft } = getComputedStyle(node);
			setPlaceholder((prev) => prev || {
				aspectRatio: `${width} / ${height}`,
				margin: `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`
			});
		});
	}, [observe, unobserve]);
	return placeholder ? jsx("div", {
		ref,
		style: {
			width: "100%",
			...placeholder
		}
	}) : cloneElement(children, { ref });
}
//#endregion
//#region src/scroll/useLayoutEffect.ts
var useLayoutEffect$1 = typeof window !== "undefined" ? useLayoutEffect : useEffect;
//#endregion
//#region src/scroll/useEventCallback.ts
function useEventCallback(fn) {
	const ref = useRef(fn);
	useLayoutEffect$1(() => {
		ref.current = fn;
	});
	return useCallback((...args) => ref.current?.(...args), []);
}
//#endregion
//#region src/scroll/InfiniteScroll.tsx
var Status = function(Status) {
	Status[Status["IDLE"] = 0] = "IDLE";
	Status[Status["LOADING"] = 1] = "LOADING";
	Status[Status["ERROR"] = 2] = "ERROR";
	Status[Status["FINISHED"] = 3] = "FINISHED";
	return Status;
}(Status || {});
function InfiniteScroll({ photos: initialPhotos, onClick, fetch, retries = 0, singleton, error, loading, finished, children, scrollContainer, fetchRootMargin = "800px", offscreenRootMargin = "2000px" }) {
	const [status, setStatus] = useState(Status.IDLE);
	const [photos, setPhotos] = useState(() => initialPhotos ? [initialPhotos] : []);
	const { observe, unobserve } = useIntersectionObserver(fetchRootMargin, scrollContainer);
	const fetching = useRef(false);
	const fetchWithRetry = useEventCallback((index) => {
		let attempt = 1;
		const execute = async () => {
			try {
				return await fetch(index);
			} catch (err) {
				if (attempt > retries) throw err;
				await new Promise((resolve) => {
					setTimeout(resolve, 1e3 * 2 ** (attempt - 1));
				});
				attempt += 1;
				return execute();
			}
		};
		return execute();
	});
	const handleFetch = useCallback(async () => {
		if (fetching.current) return;
		const updateStatus = (newStatus) => {
			fetching.current = newStatus === Status.LOADING;
			setStatus(newStatus);
		};
		updateStatus(Status.LOADING);
		try {
			const batch = await fetchWithRetry(photos.length);
			if (batch === null) {
				updateStatus(Status.FINISHED);
				return;
			}
			setPhotos((prev) => [...prev, batch]);
			updateStatus(Status.IDLE);
		} catch (_) {
			updateStatus(Status.ERROR);
		}
	}, [photos.length, fetchWithRetry]);
	const sentinelRef = useCallback((node) => {
		unobserve();
		if (node) observe(node, ({ isIntersecting }) => {
			if (isIntersecting) handleFetch();
		});
	}, [
		observe,
		unobserve,
		handleFetch
	]);
	const photosArray = photos.flatMap((batch) => batch);
	const handleClick = onClick ? (offset) => ({ photo, index, event }) => {
		onClick({
			photos: photosArray,
			index: offset + index,
			photo,
			event
		});
	} : void 0;
	let batchOffset = 0;
	return jsxs(Fragment, { children: [
		singleton ? cloneElement(children, {
			photos: photosArray,
			onClick: handleClick?.(0),
			render: {
				...children.props.render,
				track: ({ children: trackChildren, ...rest }) => jsx("div", {
					...rest,
					children: Children.map(trackChildren, (child, index) => isValidElement(child) && jsx(Offscreen, {
						rootMargin: offscreenRootMargin,
						scrollContainer,
						children: child
					}, index))
				})
			}
		}) : photos.map((batch, index) => {
			const offset = batchOffset;
			batchOffset += batch.length;
			return jsx(Offscreen, {
				rootMargin: offscreenRootMargin,
				scrollContainer,
				children: cloneElement(children, {
					photos: batch,
					onClick: handleClick?.(offset)
				})
			}, index);
		}),
		status === Status.ERROR && error,
		status === Status.LOADING && loading,
		status === Status.FINISHED && finished,
		jsx("span", { ref: sentinelRef })
	] });
}
//#endregion
export { InfiniteScroll as default };
