import { clsx$1 as clsx, cssClass, cssVar, round$1 as round, srcSetAndSizes$1 as srcSetAndSizes, unwrap } from "../utils/index.js";
import { createElement, forwardRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/static/Component.tsx
function Component({ as, render, context, classes = [], variables = {}, style: styleProp, className: classNameProp, children, ...rest }, ref) {
	const className = clsx(...(Array.isArray(classes) ? classes : [classes]).filter((el) => typeof el === "string").map(cssClass), classNameProp);
	const props = {
		style: {
			...Object.fromEntries(Object.entries(variables).map(([key, value]) => [cssVar(key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()), typeof value === "number" ? round(value, 5) : value])),
			...styleProp
		},
		className,
		children,
		...rest
	};
	if (render) {
		const rendered = render({
			ref,
			...props
		}, context);
		if (rendered) return rendered;
	}
	return jsx(as || "div", {
		ref,
		...props
	});
}
var Component_default = forwardRef(Component);
//#endregion
//#region src/static/PhotoComponent.tsx
function PhotoComponent({ photo, index, width, height, onClick, render: { wrapper, link, button, image, extras } = {}, componentsProps: { link: linkProps, button: buttonProps, wrapper: wrapperProps, image: imageProps } = {} }, ref) {
	const { href } = photo;
	const context = {
		photo,
		index,
		width: round(width, 3),
		height: round(height, 3)
	};
	let props;
	if (href) props = {
		...linkProps,
		as: "a",
		render: link,
		classes: ["photo", "link"],
		href,
		onClick
	};
	else if (onClick) props = {
		...buttonProps,
		as: "button",
		type: "button",
		render: button,
		classes: ["photo", "button"],
		onClick
	};
	else props = {
		...wrapperProps,
		render: wrapper,
		classes: "photo"
	};
	return jsxs(Component_default, {
		ref,
		variables: {
			photoWidth: context.width,
			photoHeight: context.height
		},
		context,
		...props,
		children: [jsx(Component_default, {
			as: "img",
			classes: "image",
			render: image,
			context,
			...imageProps
		}), extras?.({}, context)]
	});
}
var PhotoComponent_default = forwardRef(PhotoComponent);
//#endregion
//#region src/static/StaticPhotoAlbum.tsx
function StaticPhotoAlbum({ layout, sizes, model, skeleton, onClick: onClickCallback, render: { container, track, photo: renderPhoto, ...restRender } = {}, componentsProps: { container: containerProps, track: trackProps, link: linkProps, button: buttonProps, wrapper: wrapperProps, image: imageProps } = {} }, ref) {
	const { spacing, padding, containerWidth, tracks, variables, horizontal } = model || {};
	return jsxs(Component_default, {
		role: "group",
		"aria-label": "Photo album",
		...containerProps,
		variables: {
			spacing,
			padding,
			containerWidth,
			...variables
		},
		classes: ["", layout],
		render: container,
		ref,
		children: [spacing !== void 0 && padding !== void 0 && containerWidth !== void 0 && tracks?.map(({ photos, variables: trackVariables }, trackIndex) => {
			const trackSize = photos.length;
			const photosCount = horizontal ? trackSize : tracks.length;
			return createElement(Component_default, {
				...trackProps,
				key: trackIndex,
				render: track,
				classes: "track",
				variables: {
					trackSize,
					...trackVariables
				}
			}, photos.map((context) => {
				const { photo, index, width } = context;
				const { key, src, alt = "", title, label } = photo;
				const onClick = onClickCallback ? (event) => {
					onClickCallback({
						event,
						photo,
						index
					});
				} : void 0;
				if (renderPhoto) {
					const rendered = renderPhoto({ onClick }, context);
					if (rendered) return rendered;
				}
				const ariaLabel = (props) => {
					return label ? {
						"aria-label": label,
						...props
					} : props;
				};
				return jsx(PhotoComponent_default, {
					onClick,
					render: restRender,
					componentsProps: {
						image: {
							loading: "lazy",
							decoding: "async",
							src,
							alt,
							title,
							...srcSetAndSizes(photo, sizes, width, containerWidth, photosCount, spacing, padding),
							...unwrap(imageProps, context)
						},
						link: ariaLabel(unwrap(linkProps, context)),
						button: ariaLabel(unwrap(buttonProps, context)),
						wrapper: unwrap(wrapperProps, context)
					},
					...context
				}, key ?? index);
			}));
		}), containerWidth === void 0 && skeleton]
	});
}
var StaticPhotoAlbum_default = forwardRef(StaticPhotoAlbum);
//#endregion
export { StaticPhotoAlbum_default, StaticPhotoAlbum_default as default };
