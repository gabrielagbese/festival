"use client";
import { useContainerWidth$1 as useContainerWidth } from "../client/hooks.js";
import { clsx$1 as clsx } from "../utils/index.js";
import { StyledBreakpoints$1 as StyledBreakpoints, useBreakpoints$1 as useBreakpoints } from "./breakpoints.js";
import { cloneElement, forwardRef, isValidElement, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/ssr/SSR.tsx
function SSR({ breakpoints: breakpointsProp, unstyled, classNames, children }, ref) {
	const { breakpoints, containerClass, breakpointClass } = useBreakpoints("ssr", breakpointsProp);
	const { containerRef, containerWidth } = useContainerWidth(ref, breakpoints);
	const [hydratedBreakpoint, setHydratedBreakpoint] = useState();
	if (!Array.isArray(breakpoints) || breakpoints.length === 0 || !isValidElement(children)) return null;
	if (containerWidth !== void 0 && hydratedBreakpoint === void 0) setHydratedBreakpoint(containerWidth);
	return jsxs(Fragment, { children: [!unstyled && hydratedBreakpoint === void 0 && jsx(StyledBreakpoints, {
		breakpoints,
		containerClass,
		breakpointClass
	}), jsx("div", {
		ref: containerRef,
		className: clsx(containerClass, classNames?.container),
		children: breakpoints.map((breakpoint) => (hydratedBreakpoint === void 0 || hydratedBreakpoint === breakpoint) && jsx("div", {
			className: clsx(breakpointClass(breakpoint), classNames?.breakpoints?.[breakpoint]),
			children: cloneElement(children, {
				breakpoints,
				defaultContainerWidth: breakpoint
			})
		}, breakpoint))
	})] });
}
var SSR_default = forwardRef(SSR);
//#endregion
export { SSR_default as default };
