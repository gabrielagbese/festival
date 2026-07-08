import { cssClass } from "../utils/index.js";
import { useId } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/ssr/breakpoints/useBreakpoints.ts
function convertBreakpoints(breakpoints) {
	if (!breakpoints || breakpoints.length === 0) return [];
	const allBreakpoints = [Math.min(...breakpoints) / 2, ...breakpoints];
	allBreakpoints.sort((a, b) => a - b);
	return allBreakpoints;
}
function useBreakpoints(prefix, breakpoints) {
	const uid = `${prefix}-${useId().replace(/[«»:_]/g, "")}`;
	return {
		containerClass: cssClass(uid),
		breakpointClass: (breakpoint) => cssClass(`${uid}-${breakpoint}`),
		breakpoints: convertBreakpoints(breakpoints)
	};
}
//#endregion
//#region src/ssr/breakpoints/StyledBreakpoints.tsx
function StyledBreakpoints({ breakpoints, containerClass, breakpointClass }) {
	return jsx("style", { children: [
		`.${containerClass}{container-type:inline-size}`,
		`${breakpoints.map((breakpoint) => `.${breakpointClass(breakpoint)}`).join()}{display:none}`,
		...breakpoints.map((breakpoint, index, array) => `@container(min-width:${index > 0 ? breakpoint : 0}px)${index < array.length - 1 ? ` and (max-width:${array[index + 1] - 1}px)` : ""}{.${breakpointClass(breakpoint)}{display:block}}`)
	].join("\n") });
}
//#endregion
export { StyledBreakpoints, StyledBreakpoints as StyledBreakpoints$1, useBreakpoints, useBreakpoints as useBreakpoints$1 };
